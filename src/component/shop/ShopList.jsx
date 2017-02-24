import React, { Component, PropTypes } from 'react';
import store from './store';
import { Card, WingBlank, WhiteSpace } from 'antd-mobile';
import { genUrlFromRoute } from '../../common/utils';

class ShopList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shopList: store.getList(),
    };
  }

  componentWillMount() {
    AlipayJSBridge.call('setTitle', {
      title: '门店列表',
    });
    AlipayJSBridge.call('setOptionMenu', {
      title: '+',
      color: '#108ee9',
    });
    AlipayJSBridge.call('showOptionMenu');
    document.addEventListener('back', () => {
      this.handleClickBack();
    }, false);
    document.addEventListener('optionMenu', () => {
      this.handleClickNew();
    }, false);
    document.addEventListener('resume', e => {
      if (e.data && e.data.shopName) {
        const { shopList } = this.state;
        this.setState({
          shopList: [...shopList, e.data],
        });
      } else {
        window.location.reload(); // 有可能是编辑后过来，弱可以预知哪一个可以相应改动。
      }
    }, false);
  }

  handleClickBack() {
    AlipayJSBridge.call('hideOptionMenu');
  }

  handleClickShop(id) {
    AlipayJSBridge.call('pushWindow', {
      url: genUrlFromRoute(`/shop/view/${id}`),
    });
    AlipayJSBridge.call('hideOptionMenu');
  }

  handleClickNew() {
    AlipayJSBridge.call('pushWindow', {
      url: genUrlFromRoute('/shop/add'),
    });
    AlipayJSBridge.call('hideOptionMenu');
  }

  render() {
    return (
      <div>
        {this.state.shopList.map(shop => (
          <div key={shop.shopId} onClick={() => this.handleClickShop(shop.shopId)}>
            <WingBlank>
              <WhiteSpace />
              <Card>
                <Card.Header
                  title={shop.shopName}
                  thumb={shop.shopLogo}
                  extra={shop.brandName}
                />
                <Card.Body>
                  <div>
                    <p>品类：{shop.categoryName}</p>
                  </div>
                </Card.Body>
                <Card.Footer
                  content={shop.mobileNo}
                  extra={shop.address}
                />
              </Card>
              <WhiteSpace />
            </WingBlank>
          </div>
        ))}
      </div>
    );
  }
}

ShopList.propTypes = {
  router: PropTypes.object,
};

export default ShopList;
