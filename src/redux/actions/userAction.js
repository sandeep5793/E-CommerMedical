'use strict';
import React from 'react';
import * as type from '../actionsType';
import { AsyncStorage, Alert, Platform, View, Image } from 'react-native';
import axios from 'axios';
import { appUrl, dataUrl,consumerKey,consumerSecret,WooCommerce } from '../../utilities/config';

// Check Internet 
export const checkInternet = (netStatus) => {

  return {
    type: type.CHECK_INTERNET_CONNECTION,
    netStatus
  }
}
// Set language 
export const setLanguageActionType = (lang) => {
  debugger
  return {
    type: type.APP_LANG,
    lang
  }
}





//arasca phone
export const saveArascaPhone = (payload) => {
  debugger
  return {
      type: type.SAVE_ARASCA_PHONE,
      payload
  }
}

//arasca email
export const saveArascaEmail = (payload) => {
  debugger
  return {
      type: type.SAVE_ARASCA_EMAIL,
      payload
  }
}


// Set Fcm Id
export const setFCM_ID = (fcm_id) => {
  return {
    type: type.NOTI_FCM_ID,
    fcm_id
  }
}
// Set User Device Token
export const setUserDeviceToken = (userId) => {
  return (dispatch, getState) => {
    dispatch(setFCM_ID(userId))
  }
}
// Remove Storage
const removeUserStorage = async () => {
  await AsyncStorage.removeItem('loggedin')
  await AsyncStorage.removeItem('password')
}

// Create Custome Alert
export const showOptionsAlert = (message, logOutUser, logOutSucees) => {
  debugger
  // if (Platform.OS == 'ios') {
  //   setTimeout(() => {
  //     Alert.alert(
  //       '',
  //       message,
  //       [
  //         {
  //           text: 'Ok',
  //           onPress: () => {
  //             if(logOutUser){
  //               debugger
  //               logOutUser()
  //            }
  //           }
  //         }
  //       ],
  //       { cancelable: false }
  //     )
  //   }, 600)
  // }
  // else {
  Alert.alert(
    '',
    message,
    [
      {
        text: 'Ok',
        // onPress: () => {
        //   if(logOutUser){
        //     debugger
        //      logOutUser()
        //      logOutSucees()
        //   }
        // }
      }
    ],
    { cancelable: false }
  )
  // }

}

// Set Logged User Data
export const setLoggedUserData = (payload) => {
  return {
    type: type.SET_LOGGED_USER_DATA,
    payload
  }
}
// Set Logged Password
export const setLoggedUserPassword = (loggedPassword) => {
  return {
    type: type.SET_LOGGED_USER_PASSWORD,
    loggedPassword
  }
}
// Set Loader
export const changeNavigationState = (visible) => {
  return {
    type: "NAVIGATION_STATE_PUSH",
  }
}
// Dispatch Navigation route Languages 
export const changeNavigationStateAction = (lang) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(changeNavigationState())
      resolve(true)
    })
  }
}
// Set Profile Data
export const setMyProfileData = (myProfileData) => {
  return {
    type: type.SET_MY_PROFILE_DATA,
    myProfileData
  }
}
export const logOutUser = () => {
  return {
    type: type.LOGOUT_SUCCESS,
  }
}
// Upadte Languages 
export const setLanguage = (lang) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(setLanguageActionType(lang))
      resolve(true)
    })
  }
}
export const setLanguageDefault = (lang) => {
  return {
    type: type.SET_DEFAULT_LANGUAGE
  }
}



//export all countries
export const getAllCountries = () => {
  debugger
  return (dispatch, getState) => {
    return WooCommerce.get(`settings/general/woocommerce_specific_allowed_countries`).then(res=>{
    // return WooCommerce.get(`data/countries?code='AE'`).then(res => {
      debugger
      console.log("main data", res.data)
      // console.log("All countries", res.data)
      return res
    }).catch((error) => {
      debugger
      return error
    })
  
}
}


