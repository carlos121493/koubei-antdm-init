import React, { Component, PropTypes } from 'react';
import ShopEntity from './ShopEntity';
import ShopForm from './ShopForm';
import { NavBar, WhiteSpace, Icon } from 'antd-mobile';
import svg from '../../assets/svg';

export default class ShopAdd extends Component {
  constructor(props) {
    super(props);
    this.shop = new ShopEntity();
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleScan = this.handleScan.bind(this);
  }

  handleClickBack() {
    ap.popTo(-1);
  }

  handleScan() {
    ap.scan(() => {});
  }

  render() {
    return (
      <div>
        <NavBar
          leftContent="返回"
          mode="light"
          onLeftClick={this.handleClickBack}
          rightContent={[
            <a key="0" onClick={this.handleScan}>
              <Icon type={svg.scan} />
            </a>,
          ]}
        >
          新建门店
        </NavBar>
        <WhiteSpace />
        <ShopForm isEdit={false} shop={this.shop} router={this.props.router} />
      </div>
    );
  }
}

ShopAdd.propTypes = {
  router: PropTypes.object,
};
