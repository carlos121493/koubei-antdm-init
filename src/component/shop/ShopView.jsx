import React, { Component, PropTypes } from 'react';
import store from './store';
import { WhiteSpace, List } from 'antd-mobile';
import { PAY_TYPE_TEXT } from './config';
import { genUrlFromRoute } from '../../common/utils';
const Item = List.Item;

export default class ShopEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shop: store.getShop(this.props.params.id),
    };
  }

  componentWillMount() {
    const { shopName, shopId } = this.state.shop;
    this.setTitle(shopName);
    AlipayJSBridge.call('setOptionMenu', {
      title: '编辑',
    });
    AlipayJSBridge.call('showOptionMenu');
    document.addEventListener('optionMenu', () => {
      this.handleEdit(shopId);
    }, false);
    document.addEventListener('resume', e => {
      const { shopName: name } = e.data;
      if (name) {
        this.setTitle(name);
        this.setState({
          shop: e.data,
        });
      }
    }, false);
  }

  setTitle(title) {
    AlipayJSBridge.call('setTitle', {
      title,
    });
  }

  handleEdit(id) {
    AlipayJSBridge.call('pushWindow', {
      url: genUrlFromRoute(`/shop/edit/${id}`),
    });
  }

  handleDelete(id) {
    AlipayJSBridge.call('confirm', {
      title: '删除',
      message: `确定删除${this.shop.shopName}吗？`,
      okButton: '确定',
      cancelButton: '取消',
    }, (res) => {
      if (res.confirm) {
        store.delShop(id);
        AlipayJSBridge.call('toast', {
          content: '门店已删除',
          type: 'success',
          duration: 3000,
        }, () => {
          AlipayJSBridge.call('pushWindow', {
            url: genUrlFromRoute('/shop/list'),
          });
        });
      }
    });
  }

  render() {
    const { shopName, brandName, categoryName, provinceName, cityName, districtName, address, mobileNo, payType, receiveUserId } = this.state.shop;
    return (
      <div>
        <WhiteSpace />
        <List>
          <Item extra={shopName}>店名</Item>
          <Item extra={brandName}>品牌</Item>
          <Item extra={categoryName}>品类</Item>
          <Item
            multipleLine
            wrap
            extra={`
            ${provinceName}
            ${cityName}
            ${districtName || ''}
            ${address}
          `}
          >地址</Item>
          <Item extra={mobileNo}>电话</Item>
          <Item extra={PAY_TYPE_TEXT[payType]}>收款方式</Item>
          <Item extra={receiveUserId}>收款帐号</Item>
        </List>
      </div>
    );
  }
}

ShopEdit.propTypes = {
  router: PropTypes.object,
  params: PropTypes.object,
};
