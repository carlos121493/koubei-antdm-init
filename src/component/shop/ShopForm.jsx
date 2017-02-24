import React, { Component, PropTypes } from 'react';
import { Picker, List, InputItem, WingBlank, WhiteSpace, Button, ImagePicker } from 'antd-mobile';
import { createForm } from 'rc-form';
import store from './store';
import brands from './data/brands';
import areas from './data/areas';
import category from './data/category';
import images from './data/images';
import { PAY_TYPE_TEXT } from './config';
import './shop.less';

/*
1、门店创建的电话号码不允许为空；
2、不含“-”的电话号码长度为7到12位。包含固话、手机、400/800号码。
-对11位长度的号码校验：不是“0或1”开头是错的
3、含“-”的电话号码长度为10到20位。
-含一个“-“的电话号码长度为10到15位;
-含两个“-“的电话号码长度为13到20位；
-不能连续出现2个“-”，不能在开头和结尾。
*/
export function telephone(rule, value, callback) {
  if (value) {
    const tempContactArr = value.split(',');
    tempContactArr.forEach((el) => {
      if (!/^(\d+(-\d+){2}|\d+(-\d+){1}|\d+)$/.test(el)) {
        callback(new Error('请填写正确电话号码'));
        return;
      }
      const count = (el.match(/-/g) || []).length;
      if (count === 0 && el.length === 11 && !/^[01]/.test(el) ||
        count === 0 && (el.length < 7 || el.length > 12) ||
        count === 1 && (el.length < 10 || el.length > 15) ||
        count === 2 && (el.length < 13 || el.length > 20)) {
        callback(new Error('请填写正确电话号码'));
        return;
      }
    });
  }
  callback();
}

// compose payTypes picker data
const payTypes = Object.keys(PAY_TYPE_TEXT)
  .map(type => ({ label: PAY_TYPE_TEXT[type], value: type }));

const getTreeNodes = (values, tree) => {
  const nodes = [];
  let levelList = tree;
  values.forEach(v => {
    if (!levelList) {
      return;
    }
    const node = levelList.find(n => n.value === v);
    if (node) {
      nodes.push(node);
      levelList = node.children;
    }
  });
  return nodes;
};

const getBrandName = brandId => brands.find(brand => brand.value === brandId).label;

const getCategoryName = categoryIds => {
  const categoryTreeNodes = getTreeNodes(categoryIds, category);
  return categoryTreeNodes.reduce(
    (acc, node) => (acc === '' ? node.label : `${acc} - ${node.label}`),
    '');
};

class ShopForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { shop, isEdit, form } = this.props;
    const { validateFields } = form;
    this.setState({
      submitting: true,
    });

    validateFields((err, values) => {
      if (!err) {
        const areaFields = getTreeNodes(values.residence, areas);
        const shopInfo = {...shop,
          brandId: values.brandId[0],
          brandName: getBrandName(values.brandId[0]),
          shopName: values.shopName,
          provinceId: areaFields[0].value,
          provinceName: areaFields[0].label,
          cityId: areaFields[1].value,
          cityName: areaFields[1].label,
          districtId: areaFields[2] ? areaFields[2].value : '',
          districtName: areaFields[2] ? areaFields[2].label : '',
          categoryIds: values.categoryIds,
          categoryName: getCategoryName(values.categoryIds),
          address: values.address,
          mobileNo: values.mobileNo,
          payType: values.payType[0],
          receiveUserId: values.receiveUserId,
        };

        if (isEdit) {
          store.saveShop(shopInfo.shopId, shopInfo);
        } else {
          store.addShop(shopInfo);
        }
        AlipayJSBridge.call('popTo', {
          index: -1,
          data: shopInfo,
        });
      } else {
        this.setState({
          submitting: false,
        });
      }
    });
  }

  render() {
    const { shop, form } = this.props;
    const { getFieldProps, getFieldError } = form;
    const { brandId, shopName, provinceId, cityId, districtId, address, categoryIds, receiveUserId, payType, mobileNo } = shop;

    return (
      <div>

        <List>
          <Picker
            extra="请选择(必选)"
            cols={1}
            data={brands}
            title="选择品牌"
            {...getFieldProps('brandId', {
              rules: [{
                type: 'array',
                required: true,
                message: '请选择品牌'
              }],
              initialValue: brandId ? [brandId] : [],
            })}
          >
            <List.Item arrow="horizontal" error={getFieldError('brandId')}>选择品牌</List.Item>
          </Picker>
          <InputItem
            className="shop-form-input"
            error={getFieldError('shopName')}
            {...getFieldProps('shopName', {
              rules: [{
                required: true,
                message: '请填写门店名称'
              }],
              initialValue: shopName,
            })}
          >门店名称</InputItem>
          <Picker
            extra="请选择(必选)"
            data={areas}
            title="选择地区"
            {...getFieldProps('residence', {
              rules: [{
                required: true,
                message: '请选择地区'
              }],
              initialValue: provinceId && cityId && districtId ? [provinceId, cityId, districtId] : [],
            })}
          >
            <List.Item arrow="horizontal" error={getFieldError('residence')}>选择地区</List.Item>
          </Picker>
        </List>
        <List renderHeader={() => '门店Logo'}>
          <ImagePicker
            files={images}
            onChange={this.onLogoChange}
            onImageClick={(index, fs) => console.log(index, fs)}
            selectable={images.length < 5}
          />
        </List>
        <List>
          <InputItem
            error={getFieldError('address')}
            className="shop-form-input"
            {...getFieldProps('address', {
              rules: [{
                required: true,
                message: '请填写地址'
              }],
              initialValue: address,
            })}
          >
            详细地址
          </InputItem>
          <Picker
            extra="请选择(品类)"
            cols={2}
            data={category}
            title="选择品类"
            {...getFieldProps('categoryIds', {
              rules: [{
                required: true,
                message: '请选择品类'
              }],
              initialValue: categoryIds,
            })}
          >
            <List.Item arrow="horizontal" 
            error={getFieldError('categoryIds')}>选择品类</List.Item>
          </Picker>
          <InputItem
            className="shop-form-input"
            error={getFieldError('mobileNo')}
            {...getFieldProps('mobileNo', {
              rules: [{
                required: true,
                message: '请填写门店电话'
              }, telephone],
              initialValue: mobileNo,
            })}
          >
            门店电话
          </InputItem>
          <Picker
            extra="请选择收款方式"
            error={getFieldError('payType')}
            cols={1}
            data={payTypes}
            title="收款方式"
            {...getFieldProps('payType', {
              rules: [{
                required: true,
                message: '请选择收款方式'
              }],
              initialValue: [payType],
            })}
          >
            <List.Item arrow="horizontal">选择收款方式</List.Item>
          </Picker>
          <InputItem
            className="shop-form-input"
            error={getFieldError('receiveUserId')}
            {...getFieldProps('receiveUserId', {
              rules: [{
                required: true,
                message: '请填写收款账号'
              }],
              initialValue: receiveUserId,
            })}
          >
            收款帐号
          </InputItem>
        </List>
        <WhiteSpace />
        <WingBlank>
          <Button
            type="primary"
            loading={this.state.submitting}
            onClick={this.handleSubmit}
          >提交</Button>
        </WingBlank>
        <WhiteSpace />
      </div>
    );
  }
}

ShopForm.propTypes = {
  form: PropTypes.object,
  shop: PropTypes.object,
  isEdit: PropTypes.bool,
  router: PropTypes.object,
};

export default createForm()(ShopForm);
