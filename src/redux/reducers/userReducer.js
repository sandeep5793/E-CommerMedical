'use-strict'
import * as type from '../actionsType'
import { I18nManager } from 'react-native';
const initialState = {
  netStatus: true,
  lang: 'en',
  fontFamilyBold: null,
  fontFamilySemibold: null,
  fontFamilyRegular: null,
  flexDirection: null,
  textAlign: 'left',
  fcm_id: '',
  isRTL: false,
  loggedPassword: '',
  user: null,
  myProfileData: null,
  setLanguage: false,
  userInfo: true,
  cartItems: 0,
  fcm_id:null
};
const user = (state = initialState, action) => {
  switch (action.type) {
    case type.SET_DEFAULT_LANGUAGE:
      return {
        ...state,
        setLanguage: true
      }
    case type.CHECK_INTERNET_CONNECTION:
      return {
        ...state,
        netStatus: action.netStatus
      }
    case type.APP_LANG:
      debugger
      return {
        ...state,
        lang: action.lang,
        isRTL: action.lang == 'ar' ? true : false,
        // fontFamilyBold: action.lang=='en'?'MyriadPro-Bold':'Mirza-Bold',
        // fontFamilySemibold: action.lang=='en'?'MyriadPro-Semibold':'Mirza-SemiBold',
        // fontFamilyRegular: action.lang=='en'?'MyriadPro-Regular':'Mirza-Regular',
        fontFamilyBold: action.lang == 'en' ? 'campton-book' : 'Noor-Bold',
        fontFamilySemibold: action.lang == 'en' ? 'campton-semibold' : 'Noor-Regular',
        fontFamilyRegular: action.lang == 'en' ? 'campton-light' : 'Noor-Regular',
        flexDirection: (action.lang == 'ar') ? 'row-reverse' : 'row',
        textAlign: action.lang == 'en' ? 'left' : 'right'
      }
    case type.NOTI_FCM_ID:
      return {
        ...state,
        fcm_id: action.fcm_id,

      }
    case type.SET_LOGGED_USER_DATA:
      return {
        ...state,
        user: action.payload
      }

    // case type.CART_ITEMS:
    //   debugger
    //   return {
    //     ...state,
    //     cartItems: action.cartItems
    //   }

    case type.SET_LOGGED_USER_PASSWORD:
      return {
        ...state,
        loggedPassword: action.loggedPassword
      }
    case type.SET_VISIBLE:
      return {
        ...state,
        visible: action.visible
      }
    case type.SET_MY_PROFILE_DATA:
      return {
        ...state,
        myProfileData: action.myProfileData
      }

    case type.LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        lang: state.lang,
        fontFamilyBold: state.fontFamilyBold,
        fontFamilySemibold: state.fontFamilySemibold,
        fontFamilyRegular: state.fontFamilyRegular,
        flexDirection: state.flexDirection,
        textAlign: state.textAlign,
        loggedPassword: '',
        myProfileData: null,
        userInfo: true
      }
    default:
      return state
  }
}
export default user
