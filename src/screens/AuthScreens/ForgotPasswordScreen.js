import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    Keyboard,
    TouchableOpacity,
} from 'react-native';

//Global lib
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
import { userAuth, appUrl, consumerKey, consumerSecret } from "../../utilities/config";
import { colors, screenDimensions } from '../../utilities/constants';

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../../redux/actions/userAction';
import * as customerActions from '../../redux/actions/customerAction'
import * as orderActions from '../../redux/actions/orderAction'

class ForgotPasswordScreen extends Component {
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
    
    //validaition
    ValidationRules = () => {
        let { email } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [
            {
                field: email.trim(),
                name: strings.email,
                rules: 'required|email|no_space',
                lang: lang

            },
        ]
    }
   

    //reset password
    resetPassword = () => {
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
                data['user_login'] = email.trim()
                debugger
                axios.post(`${appUrl}lostpassword`, data,
                    {
                        headers: {
                            "consumer_key": consumerKey,
                            "consumer_secret": consumerSecret,
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                    }).then((res) => {
                        debugger
                        if (res && res.status == 200) {
                            debugger
                            ToastMessage(res.data.message)
                            this.setState({ visible: false }, () => {
                                this.props.navigation.goBack()
                            })
                        }
                    }).catch((err) => {
                        debugger
                        if (err && err.response && err.response.data && err.response.data.message) {
                            ToastMessage(err.response.data.message)
                            this.setState({ visible: false })
                        } else {
                            this.setState({ visible: false })
                        }
                    })
            }
        }
    }

    //main rendered component
    mainComponent = () => {
        return (
            <View style={{ paddingVertical: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../../assets/images/logo/ic_logo.png')} />
                </View>

                <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                            <Text style={[styles.forgotPass, { textAlign: 'center' }]}>{strings.forgotpassmsg}</Text>
                        </View>
                    </TouchableOpacity>

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
                        onSubmitEditing={(event) => { Keyboard.dismiss() }}

                    />

                    <View style={styles.continueButton}>
                        <CustomeButton
                            buttonStyle={styles.buttonStyle}
                            backgroundColor={'#01A651'}
                            title={'Submit'}
                            borderColor={'#01A651'}
                            fontWeight={'bold'}
                            fontSize={16}
                            lineHeight={16}
                            activeOpacity={9}
                            onPress={() => this.resetPassword()}
                            textColor={'#FFFFFF'}
                            icon={require('../../assets/images/login/ic_login.png')}
                        />
                        <View style={{ height: 20 }} />

                    </View>

                </View>
            </View>
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
                        backButton={true}
                        scrollView={true}
                        viewStyle={{ paddingBottom: 150, height: screenDimensions.height, }}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        title={'Forgot password'}
                        mainComponent={() => this.mainComponent()}
                    />
                </SafeAreaView>
            </View>


        );
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        userCommon: state.user
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
    };
}
//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(ForgotPasswordScreen)


