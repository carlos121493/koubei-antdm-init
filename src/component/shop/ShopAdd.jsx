import React, { Component, PropTypes } from 'react';
import ShopEntity from './ShopEntity';
import ShopForm from './ShopForm';
import { WhiteSpace } from 'antd-mobile';

export default class ShopAdd extends Component {
  constructor(props) {
    super(props);
    this.shop = new ShopEntity();
  }

  componentWillMount() {
    AlipayJSBridge.call('setTitle', {
      title: '新建门店',
    });
    AlipayJSBridge.call('setOptionMenu', {
      title: '扫码',
      override: true,
    });
    document.addEventListener('optionMenu', () => {
      this.handleScan();
    }, false);
    AlipayJSBridge.call('showOptionMenu');
  }

  handleScan() {
    AlipayJSBridge.call('scan', {
      type: 'qr',
      actionType: 'scan',
    }, (result) => {
      alert(result);
    });
  }

  render() {
    return (
      <div>
        <WhiteSpace />
        <ShopForm isEdit={false} shop={this.shop} router={this.props.router} />
      </div>
    );
  }
}

ShopAdd.propTypes = {
  router: PropTypes.object,
};
