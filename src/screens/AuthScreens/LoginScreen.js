import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    Keyboard,
    TouchableOpacity,
    Platform,
    AsyncStorage
} from 'react-native';

//Global libs
import firebase from 'react-native-firebase';
import axios from 'axios';

//Local imports
import styles from '../../styles'
import strings from '../../utilities/languages'
import Validation from '../../utilities/validations'
import CustomeButton from '../../components/Button'
import { ToastMessage } from '../../components/Toast'
import Spinner from '../../components/Spinner'
import Container from '../../components/Container'
import InputField from '../../components/InputField'
import { userAuth, consumerKey, consumerSecret, key, sec } from "../../utilities/config";
import { updateUsersFcmTokenAdminPanel, addUserToAdminPanel } from '../../utilities/config'

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../../redux/actions/userAction';
import * as customerActions from '../../redux/actions/customerAction'
import * as orderActions from '../../redux/actions/orderAction'
import * as wishlistActions from '../../redux/actions/wishlistAction'

import { colors, screenDimensions } from '../../utilities/constants';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailFieldFocus: false,
            passwordFieldFocus: false,
            loader: false,
            securePassword: true,
            visible: false,
            refreshToken: null
        };
    }

    componentDidMount = () => {
        let generatedGuestId = Number(Math.random().toString().slice(2, 11))
        console.log(generatedGuestId, "generatedGuestId")
        if (this.props.guestID) {

        } else {
            this.props.customerActions.saveGuestUserToken(generatedGuestId)
        }
        this.checkPermission()

    }

    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            Promise.resolve(
                this.getToken()
            ).then((res) => {
                debugger
                this.setState({ refreshToken: res }, () => {
                    this.props.actions.setFCM_ID(this.state.refreshToken)

                    console.log("refreshToken is:", this.state.refreshToken)
                })

            }).catch((error) => {
                debugger
                console.log("error not enabled", error)
                // console.log('promise all error:)

            })
        } else {
            this.requestPermission();
        }
    }

    //get the fcm token 
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            return fcmToken
        }
        else {
            return fcmToken
        }
    }

    //get the permission request
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            console.log("requestPermission comes here..")
            Promise.resolve(
                this.getToken()
            ).then((res) => {
                debugger
                this.setState({ refreshToken: res }, () => {
                    this.props.actions.setFCM_ID(this.state.refreshToken)
                    console.log("refreshToken is:", this.state.refreshToken)
                })

            }).catch((error) => {
                debugger
                console.log("error not enabled", error)
                // console.log('promise all error:)

            })
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    ValidationRules = () => {
        let { email, password } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [

            {
                field: email.trim(),
                name: strings.email,
                rules: 'required|email|no_space',
                lang: lang

            },
            {
                field: password,
                name: strings.password,
                rules: 'required|no_space|min:6',
                lang: lang

            },
        ]
    }


    updateUsersFcmTokenAdminPanel = (data) => {
        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                // "Authorization": `Bearer ${this.props.userTokenAdmin}`
            }
        }

        return axios.post(`${updateUsersFcmTokenAdminPanel}`, data, header).then((res) => {
            if (res && res.status == 200) {
                debugger
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })
    }

    //Adding user to the admin panel
    addUserToAdminPanel = (data) => {
        console.log(data, "data push notification.......1")
        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                // "Authorization": `Bearer ${this.props.userTokenAdmin}`
            }
        }
        return axios.post(`${addUserToAdminPanel}`, data, header).then((res) => {
            if (res && res.status == 200) {
                debugger
                if (res && res.headers && res.headers.access_token) {
                    debugger
                    this.props.customerActions.setUserTokenFromAdmin(res.headers.access_token)
                }
                // this.props.customerActions.setUserTokenFromAdmin(res.data)
                console.log("res from add user:", res)
                debugger
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })
    }

    removeGuestUserInfo = () => {

        if (this.props && this.props.guestID) {
            let data = {
                'key': key,
                'sec': sec,
                'user_id': this.props.guestID
            }

            return this.props.wishlistActions.deleteItemFromwishlistExistForGuest(data).then((res) => {
                if (res && res.status == 200) {
                    console.log(res, "Guest item and Guest delete successfully")
                    debugger
                    // this.setState({ visible: false })
                    this.props.wishlistActions.setWishlistItem({ wishlistData: [], totalWishlistItem: 0 }),

                    this.props.customerActions.saveGuestUserToken(null)

                }
                else {
                    console.log(res,"error response of the user")
                    debugger
                }
            }).catch((err) => {
                console.log("wishlist errotr", err)
            })

        }
        else {
            this.props.wishlistActions.setWishlistItem({ wishlistData: [], totalWishlistItem: 0 }),

            this.props.customerActions.saveGuestUserToken(null)

        }



    }

    //authenticate user in wordpess
    authenticateUser = (data) => {


        let authData = {
            'username': data.email,
            'password': data.password
        }
        axios.post(`${userAuth}`, authData,
            {
                headers: {
                    "consumer_key": consumerKey,
                    "consumer_secret": consumerSecret,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    // "cookie":"cookie value will goes here"
                },
            }).then(async (res2) => {
                if (res2 && res2.status == 200) {
                    this.props.customerActions.setUserToken(res2.data.token)
                    this.props.customerActions.getAllCustomers(data).then((res) => {
                        debugger
                        if (res && res.status == 200) {
                            if (res && res.data.length) {
                                let fcm_data = {
                                    "user_id": res.data[0].id,
                                    "device_type": Platform.OS,
                                    "device_token": this.state.refreshToken
                                }
                                debugger
                                Promise.all([
                                    this.addUserToAdminPanel(fcm_data),
                                    this.removeGuestUserInfo(),

                                    this.props.customerActions.setUserShipping({ shippingaddress: [], }),
                                    this.props.customerActions.setUserBilling({ billingaddress: [] }),

                                ]).then(() => {
                                    debugger
                                    this.setState({ visible: false })
                                    res.data[0].token = res2.data.token
                                    debugger
                                    this.props.customerActions.logInUserActionype(res.data[0])
                                    this.props.navigation.navigate('App')
                                }).catch((error) => {
                                    debugger
                                    // console.log('promise all error:
                                    this.setState({ visible: false })
                                    ToastMessage('Server Error !!!!')
                                    // res.data[0].token = res2.data.token
                                    // this.props.customerActions.logInUserActionype(res.data[0])
                                    // this.props.navigation.navigate('App')
                                })
                            }
                            else {
                                this.setState({ visible: false })
                                ToastMessage("User is not a customer. Please login with customer credential.")
                            }
                        }
                        else {
                            this.setState({ visible: false })
                            ToastMessage(res.message)
                        }
                    }).catch((err) => {
                        this.setState({ visible: false })
                        console.log(err)
                    })


                }
            }).catch((err) => {
                debugger
                this.setState({ visible: false })
                ToastMessage('Username or password is incorrect')
            })
    }


    //login by  email id
    loginByEmail = () => {

        if (!this.props.userCommon.netStatus) {
            return this.props.actions.showOptionsAlert('Check your internet connection!')
        }
        else {
            let { email, password } = this.state
            let validation = Validation.validate(this.ValidationRules())
            if (validation.length != 0) {
                return ToastMessage(validation[0])
            }
            else {
                this.setState({ visible: true })
                let data = {}
                data['email'] = email.trim()
                data['password'] = password.trim()

                this.props.customerActions.totatCartItem(0)

                console.log(data, "data to be send")
                debugger

                this.authenticateUser(data)

            }
        }
    }

    mainComponent = () => {
        return (
            <View style={{ paddingVertical: 20, }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../../assets/images/logo/ic_logo.png')} />
                </View>

                <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
                    <InputField
                        label={strings.email}
                        rightIcon={require('../../assets/images/messageBlack/ic_message_black.png')}
                        inputMenthod={(input) => { this.emailField = input }}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        selectionColor="#3B56A6"
                        returnKeyType="next"
                        keyboardType='email-address'
                        autoCorrect={false}
                        autoCapitalize='none'
                        blurOnSubmit={false}
                        viewTextStyle={[styles.viewTextStyle, {}]}
                        value={this.state.email}
                        underlineColorAndroid='transparent'
                        isFocused={this.state.emailFieldFocus}
                        onFocus={() => this.setState({ emailFieldFocus: true })}
                        onBlur={() => this.setState({ emailFieldFocus: false })}
                        onChangeText={(email) => this.setState({ email })}
                        onSubmitEditing={(event) => { this.passwordField.focus() }}

                    />

                    <InputField
                        label={strings.password}
                        rightIcon={require('../../assets/images/keyBlack/ic_key.png')}
                        secureTextEntry={true}
                        inputMenthod={(input) => { this.passwordField = input }}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        returnKeyType="done"
                        keyboardType='default'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize='none'
                        value={this.state.password}
                        viewTextStyle={[styles.viewTextStyle, {}]}
                        onShowPassword={
                            () => this.setState({ securePassword: !this.state.securePassword })
                        }
                        isFocused={this.state.passwordFieldFocus}
                        underlineColorAndroid='transparent'
                        onFocus={() => this.setState({ passwordFieldFocus: true })}
                        onBlur={() => this.setState({ passwordFieldFocus: false })}
                        onChangeText={(password) => this.setState({ password })}
                        onSubmitEditing={(event) => { Keyboard.dismiss() }}
                    />

                    <TouchableOpacity style={{ flexDirection: 'row', width: screenDimensions.width / 2, paddingTop: 10, justifyContent: 'space-between' }}
                        onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')}>
                        <View>
                            <Text style={styles.forgotPass}>{strings.forgotpass}</Text>
                        </View>
                    </TouchableOpacity>


                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                        <Text style={styles.newArascaAndSignupText}>{strings.newToAraska}</Text>

                        <Text onPress={() => this.props.navigation.navigate('SignupScreen')} style={[styles.newArascaAndSignupText, { fontWeight: 'bold', fontSize: 20 }]}>{strings.signupsmall}</Text>
                    </View>


                    <View style={styles.continueButton}>
                        <CustomeButton
                            buttonStyle={styles.buttonStyle}
                            backgroundColor={'#01A651'}
                            title={strings.loginsmall}
                            borderColor={'#01A651'}
                            fontWeight={'bold'}
                            fontSize={16}
                            lineHeight={16}
                            activeOpacity={9}
                            onPress={() => this.loginByEmail()}
                            textColor={'#FFFFFF'}
                            // textAlign={'right'}
                            icon={require('../../assets/images/login/ic_login.png')}
                        />
                        {/* <View style={{ height: 20 }} /> */}

                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('App')}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ textDecorationLine: 'underline', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, color: colors.appColor }}>
                                    {'Proceed as guest'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }

    rightItem = () => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('App')}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                        {'Skip'}
                    </Text>
                </View>
            </TouchableOpacity>

        )
    }
    render() {
        return (
            <View style={{}} >
                <SafeAreaView style={{ backgroundColor: colors.appColor }} />
                <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }} style={{ backgroundColor: colors.white }}>

                    <StatusBar
                        translucent
                        barStyle={"dark-content"}
                        backgroundColor={colors.appColor}
                    />
                    {this.state.visible ? <Spinner /> : null}
                    <Container
                        title={'Login/Signup'}
                        mainComponent={() => this.mainComponent()}
                        scrollProps={{ showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: 'handled', }}
                        scrollView={true}
                    />

                </SafeAreaView>
            </View>


        );
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        userCommon: state.user,
        userTokenAdmin: state.login.userTokenAdmin,
        guestID: state.login.guestID
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        wishlistActions:bindActionCreators(wishlistActions, dispatch),
    };
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(Login)

