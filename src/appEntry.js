
import React, { Component } from 'react';
import {
    Platform,
    View,
    Dimensions,
    StyleSheet
} from 'react-native'
// import { string } from './utilities/languages/i18n'
// Redux
import NetInfo from "@react-native-community/netinfo";
import firebase from 'react-native-firebase';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout } from '../src/appNavigation'
const { width } = Dimensions.get('window');
import SplashScreen from 'react-native-splash-screen'


//Actions
import * as  userActions from '../src/redux/actions/userAction'

//Component
import OfflineNotice from '../src/components/OfflineNotice'
// import I18n from 'react-native-i18n';
import { setLanguage } from '../src/redux/actions/userAction'
import getStore from '../src/redux/store';
let store = getStore()

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

class AppEntry extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    currentRouteName;
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            component: null,
            isLoadung: false,
            timerBool: false,
            netStatus: true,
            setLanguage: false,
            user: null
        }

        // this._bootstrapAsync()

        // _didFocusSubscription  
        console.log(props, "kkjjl")
    }


    _bootstrapAsync = async () => {
    }
    // componentWillMount = async () => {
    //     // I18n.locale = 'en'
    //     // I18n.currentLocale();
    //     // this.asqw('en')
    // }

    asqw = (getwq) => {
        // this.props.actions.setLanguage(getwq)
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     debugger
    //     this.checkUserIsLoggedIn(nextProps.login)
    // }

    componentDidMount() {
        // if (!__DEV__) {
        //     console.log = () => null
        // }
        SplashScreen.hide()
        // firebase.notifications().setBadge(0)
        // firebase.notifications()
        this._getNetInfo();
    }

    //_getNetInfo isConnected Or IsReachable
    _getNetInfo = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            let value = (state.type != 'none' || state.type != 'unknown') && state.isConnected ? true : false;
            this.props.actions.checkInternet(value);
        });
    };

    componentWillUnmount() {
        // unsubscribe();
    }

    

    //   shouldComponentUpdate(nextProps) {
    //     if(this.props.user && this.props.user.user)
    //     return (this.props.user.user.verified !== nextProps.user.user.verified);
    //  }

    //   shouldComponentUpdate(nextProps) {
    //     // if((this.props.user && this.props.user.user) && (this.props.user.user.verified == nextProps.user.user.verified))
    //     // return (this.props.user.user.verified !== nextProps.user.user.verified);
    //  }
    //backhandler
    // _backhandle = async () => {
    //     const isVisible = this.currentRouteName;
    //     if (isVisible && isVisible.index == 0) {
    //         if (Platform.OS == 'android') {
    //             if (!this.state.timerBool) {
    //                 this.setState({ timerBool: true })
    //                 //ToastAndroid.show(string('exitToast'), 3000);
    //                 setTimeout(() => { this.setState({ timerBool: false }) }, 3000)
    //             }
    //             else {
    //                 BackHandler.exitApp();
    //             }
    //         }
    //         return true
    //     } else {
    //         if (!this.state.timerBool) {
    //             this.setState({ timerBool: true })
    //             // ToastAndroid.show(string('exitToast'), 3000);
    //             setTimeout(() => { this.setState({ timerBool: false }) }, 3000)
    //         }
    //         else {
    //             BackHandler.exitApp();
    //         }
    //     }
    // }

    // componentWillUnmount() {
    //     this.unsubscribe();
    //     // NetInfo.removeEventListener('connectionChange', this._handleConnectionChange);
    //     //     BackHandler.removeEventListener('hardwareBackPress', this._backhandle);
    //     //     // NotificationRemoveListeners(this.props)
    // }

    // checkUserIsLoggedIn = (user) => {
    //     //TODO:
    //     if (user) {
    //         this.setState({ user: user })
    //     }
    // }
    render() {
        // let Layout = createAppContainerRoute
        return (
            <SafeAreaProvider>
                <View style={{ flex: 1, zIndex: 0 }}>

                    <View style={{ zIndex: 1 }}>
                        {/* {this.props.user && this.props.user.netStatus ? null : <OfflineNotice />} */}
                    </View>
                    {/* {this.props.user && this.props.user.netStatus ? null : <OfflineNotice />} */}
                    {/* {
                    Platform.OS == 'ios' && <View style={[styles.statusBar, { backgroundColor: '#79B45D' }]}>
                        <StatusBar
                            barStyle={"light-content"} />
                    </View>
                } */}
                    <Layout />
                    {/* <Layout
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                    onNavigationStateChange={(prevState, currentState, action) => {
                        debugger
                        this.currentRouteName = currentState.routes[currentState.index];
                    }}
                >
                </Layout> */}
                </View>
            </SafeAreaProvider>
        )
    }
}
// Connect Store With Component
function mapStateToProps(state, ownProps) {
    return {
        // user: state.user,
        login: state.login.user,
        setLanguage: state.user.setLanguage
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(AppEntry);

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 20;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 44;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {
        height: STATUSBAR_HEIGHT,
        // padding:0
    },
    appBar: {
        backgroundColor: '#79B45D',
        height: APPBAR_HEIGHT,
    },
    content: {
        flex: 1,
        backgroundColor: '#33373B',
    },
    offlineContainer: {

        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
        top: 50,
        zIndex: 1000
    },
    offlineText: {
        color: '#fff'
    }
});