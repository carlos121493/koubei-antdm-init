import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import { Router, Route, hashHistory } from 'react-router';
import userRoutes from '../component/user/routes';
import shopRoutes from '../component/shop/routes';

const RouteArray = [{
  path: '/',
  onEnter: (nextState, replace) => replace('/user/login'),
}]
  .concat(userRoutes)
  .concat(shopRoutes);

const RouteCollection = RouteArray.map((props, index) =>
  <Route {...props} key={index} />
);

function ready(callback) {
  if (window.AlipayJSBridge && callback) {
    callback();
  } else {
    document.addEventListener('AlipayJSBridgeReady', callback);
  }
}

ready(() => {
  ReactDOM.render(
  <Router history={hashHistory}>
    {RouteCollection}
  </Router>,
    document.getElementById('react-content')
  );
});

