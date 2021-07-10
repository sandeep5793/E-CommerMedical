import React, { Component } from 'react';
import { createAppContainerRoute } from './src/appNavigation'
import { Provider } from 'react-redux';

import strings from './src/utilities/languages'
import AppEntry from './src/appEntry'
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './src/redux/store';
import SplashScreen from 'react-native-splash-screen';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';

const { store, persistor } = configureStore();
export default class App extends Component {
  constructor(props) {
    super()
    this.state = {
      isLoggedIn: false,
      component: null,
      isLoadung: false,
    }
    this._bootstrapAsync()
  }
  _bootstrapAsync = async () => {
  }
  componentDidMount() {
    if (!__DEV__) {
      // console.log("this is production mode")
      console.log = () => null;//disable all the console logs in app
     
    } 
    firebase.notifications().setBadge(0)

    strings.setLanguage('en');
    // if(Platform.OS=='ios'){
    //   setTimeout(() => {
    //     SplashScreen.hide()
    //   }, 3000);
    // }
    setTimeout(() => {
      SplashScreen.hide()
    }, 2000);
  }

  componentWillUnmount() {
    // SplashScreen.hide()
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={true} persistor={persistor}>
          <AppEntry />
        </PersistGate>
      </Provider>
    )
  }
}
