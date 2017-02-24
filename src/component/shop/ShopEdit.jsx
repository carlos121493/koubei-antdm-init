import React, { Component, PropTypes } from 'react';
import store from './store';
import ShopForm from './ShopForm';
import { WhiteSpace } from 'antd-mobile';
import { genUrlFromRoute } from '../../common/utils';

export default class ShopEdit extends Component {
  componentWillMount() {
    this.shop = store.getShop(this.props.params.id);
    AlipayJSBridge.call('setTitle', {
      title: this.shop.shopName,
    });
    AlipayJSBridge.call('setOptionMenu', {
      title: '删除',
    });
    document.addEventListener('optionMenu', () => {
      this.handleDelete(this.shop.shopId);
    }, false);
    AlipayJSBridge.call('showOptionMenu');
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
      }
      AlipayJSBridge.call('toast', {
        content: '门店已删除',
        type: 'success',
        duration: 3000,
      }, () => {
        AlipayJSBridge.call('pushWindow', {
          url: genUrlFromRoute('/shop/list'),
        });
      });
    });
  }

  render() {
    return (
      <div>
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
