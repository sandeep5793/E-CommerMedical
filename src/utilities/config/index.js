'use-strict';

import {
  Platform
} from 'react-native'
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;


//testing 

// const WooCommerce = new WooCommerceRestApi({
//   url: "https://test.arascamedical.com",
//   consumerKey: "ck_83a30feba6e1dd7615a598bd94a2871096b7fb31",
//   consumerSecret: "cs_187b9cb5bc7a68dfd3b41cc7ebb037d64b06a84b",
//   version: "wc/v3",
//   queryStringAuth: true,

// });


//live

const WooCommerce = new WooCommerceRestApi({
  url: "https://eshop.arascamedical.com",
  consumerKey: "ck_a8bdd28c5dec840cc3a4a77fe9d831f236c903b8",
  consumerSecret: "cs_a17854df8fe6bff7f0e7cccbee311c6f6f12a6ed",
  version: "wc/v3",
  queryStringAuth: true,

});


//test

// var consumerKey = 'ck_83a30feba6e1dd7615a598bd94a2871096b7fb31'
// var consumerSecret = 'cs_187b9cb5bc7a68dfd3b41cc7ebb037d64b06a84b'

//live

var consumerKey = 'ck_a8bdd28c5dec840cc3a4a77fe9d831f236c903b8'
var consumerSecret = 'cs_a17854df8fe6bff7f0e7cccbee311c6f6f12a6ed'


//testurl

// let urlAracsa='https://test.arascamedical.com/'

//liveurl

let urlAracsa='https://eshop.arascamedical.com/'


var appUrl = `${urlAracsa}wp-json/wc/v3/`
var dataUrl = `${urlAracsa}wp-json/wc/v3/data/`
var userAuth = `${urlAracsa}wp-json/jwt-auth/v1/token`
var cocartUrl = `${urlAracsa}wp-json/cocart/v1/`
var wishlistUrl = `${urlAracsa}wp-json/wishlist/v1/`
var recentlyPurchasedUrl = `${urlAracsa}wp-json/users/v1/recent`
var emailAdrress = `${urlAracsa}wp-json/users/v1/email`
var contactNumber = `${urlAracsa}wp-json/users/v1/number`
var walletUrl = `${urlAracsa}wp-json/wallet/v1/`

//Admin panel api's
const url = 'https://admin.arascamedical.com/api/'
//const url='http://192.168.100.222:8012/api/'

var addUserToAdminPanel = `${url}user-add`
var updateUsersFcmTokenAdminPanel = `${url}fcm_update`
var upadteOrderPlacedOnAdmin = `${url}order-place`
var getNotifications = `${url}get-notifications`
var deleteNotifications = `${url}clear-notification`
var getNotificationStatus = `${url}get-profile`
var setNotificationStatus = `${url}push-on-off`



var key = 'aCTznNDM7eNuRYrxKvk5GwdK8pWtdk'
var sec = 'wuZgFDQhNmKnvLpZzmDV8WJJS6z6K4'
var freshChatAppKey = '756705a8-339e-4af0-87d4-cd540ad0aed5'
var freshChatAppId = '4cd0b84f-585f-4822-8432-1f075bab0141'

//Test

// var mechantCredential = {
//   merchantId: '120810000016',
//   region: 'mtf',
//   merchandServerUrl: 'https://arasca-modif.herokuapp.com/',
// }


//Live

var mechantCredential = {
  merchantId: '120810000016',
  region: 'mtf',
  merchandServerUrl: Platform.OS == 'android' ? 'https://mpgs.arascamedical.com' : 'https://mpgs.arascamedical.com/',
}
//merchandServerUrl: 'https://adcb.gateway.mastercard.com/',





var header = {
  headers: {
    // "Content-Type": "application/json",
    // "Accept": "application/json",
    // "consumerKey": 'ck_83a30feba6e1dd7615a598bd94a2871096b7fb31',
    // "consumerSecret": 'cs_187b9cb5bc7a68dfd3b41cc7ebb037d64b06a84b',
    // "Authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvdGVzdC5hcmFzY2FtZWRpY2FsLmNvbSIsImlhdCI6MTU3NTI3MjI1MiwibmJmIjoxNTc1MjcyMjUyLCJleHAiOjE1NzU4NzcwNTIsImRhdGEiOnsidXNlciI6eyJpZCI6IjI4MyJ9fX0.Hub4GVv2STEk2cA5-PoTT1uEDL1XvOhDdk9V2ly8ElA`
  },
}

var headerForWishlist = {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "consumerKey": 'aCTznNDM7eNuRYrxKvk5GwdK8pWtdk',
    "consumerSecret": 'wuZgFDQhNmKnvLpZzmDV8WJJS6z6K4',
    // "Authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvdGVzdC5hcmFzY2FtZWRpY2FsLmNvbSIsImlhdCI6MTU3NTI3MjI1MiwibmJmIjoxNTc1MjcyMjUyLCJleHAiOjE1NzU4NzcwNTIsImRhdGEiOnsidXNlciI6eyJpZCI6IjI4MyJ9fX0.Hub4GVv2STEk2cA5-PoTT1uEDL1XvOhDdk9V2ly8ElA`
  },
}
export {
  getNotifications,
  addUserToAdminPanel,
  updateUsersFcmTokenAdminPanel,
  upadteOrderPlacedOnAdmin,
  WooCommerce,
  appUrl,
  key,
  sec,
  headerForWishlist,
  wishlistUrl,
  header,
  cocartUrl,
  userAuth,
  consumerKey,
  consumerSecret,
  dataUrl,
  recentlyPurchasedUrl,
  getNotificationStatus,
  setNotificationStatus,
  deleteNotifications,
  freshChatAppKey,
  freshChatAppId,
  contactNumber,
  emailAdrress,
  walletUrl,
  mechantCredential
}


