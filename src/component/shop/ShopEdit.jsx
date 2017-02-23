import React, { Component, PropTypes } from 'react';
import store from './store';
import ShopForm from './ShopForm';
import { NavBar, WhiteSpace, Icon } from 'antd-mobile';
import svg from '../../assets/svg';
import { genUrlFromRoute } from '../../common/utils';

export default class ShopEdit extends Component {
  constructor(props) {
    super(props);
    this.shop = store.getShop(this.props.params.id);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleClickBack() {
    ap.popTo(-1);
  }

  handleDelete(id) {
    ap.confirm({
      title: '删除',
      content: `确定删除${this.shop.shopName}吗？`,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }, res => {
      if (res.confirm) {
        store.delShop(id);
        ap.showToast({
          content: '门店已删除',
          type: 'success',
        });
        ap.pushWindow({
          url: genUrlFromRoute('/shop/list'),
        });
      }
    });
  }

  render() {
    return (
      <div>
        <NavBar
          leftContent="返回"
          mode="light"
          onLeftClick={this.handleClickBack}
          rightContent={[
            <a key="0" onClick={() => this.handleDelete(this.shop.shopId)}>
              <Icon
                type={svg.delete}
              />
            </a>,
          ]}
        >
          {this.shop.shopName}
        </NavBar>
        <WhiteSpace />
        <ShopForm isEdit shop={this.shop} router={this.props.router} />
      </div>
    );
  }
}

ShopEdit.propTypes = {
  router: PropTypes.object,
  params: PropTypes.object,
};
