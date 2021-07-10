import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    Keyboard,
    TouchableOpacity,
    ScrollView,
    Platform,
    FlatList
} from 'react-native';

//Local imports
import styles from '../styles'
import strings from '../utilities/languages'
import Validation from '../utilities/validations'
import TextInputComponent from '../components/TextInput'
import CustomeButton from '../components/Button'
import { ToastMessage } from '../components/Toast'
import backButton from '../assets/img/ic_back.png'
import Spinner from '../components/Spinner'
import homelogo from '../assets/images/logo.png'
import Header from '../components/Header'
import Container from '../components/Container'
import InputField from '../components/InputField'
import {
    Freshchat,
    setUser
} from '../components/FreshChat'

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import { colors, screenDimensions } from '../utilities/constants';
import IconBadge from 'react-native-icon-badge';


class ProfileSettingScreen extends Component {
    constructor(props) {
        super(props);
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.state = {

            visible: false,
            refreshToken: null,

            firstName: userInfo ? userInfo.first_name : '',
            lastName: userInfo ? userInfo.last_name : '',
            email: userInfo ? userInfo.email : '',
            password: '',
            confirmPassword: '',
            contactNumber: this.getRequiredInfoForContact(userInfo, 'contact'),
            buinessName: this.getRequiredInfo(userInfo, 'business'),
            trnNo: this.getRequiredInfo(userInfo, 'trno'),
            partnerId: '',
            firstNameFieldFocus: false,
            lastNameFieldFocus: false,
            emailFieldFocus: false,
            passwordFieldFocus: false,
            confirmPasswordFieldFocus: false,
            contactNumberFieldFocus: false,
            buinessNameFieldFocus: false,
            trnNoFieldFocus: false,
            buinessNameFieldFocus: false,
            trnNoFieldFocus: false,
            partnerIdFieldFocus: false,
            isModalVisible: false,
            loader: false,
            securePassword: true,
            secureconfirmPassword: true,
            visible: false,
            business: false,
            individual: false,
            userStatus: null


        };
        debugger
    }

    componentDidMount = () => {
        let userInfo = this.props && this.props.user ? this.props.user : null

        let checkAccountType = userInfo.meta_data.find((item, index) => {
            debugger
            if (item.key == 'account_type' || item.key == 'customer_type') {
                return item
            }
        })

        if (checkAccountType) {
            debugger
            this.setState({ userStatus: checkAccountType.value })
            if (checkAccountType.value == 'Business') {
                this.setState({ business: true })
            }
            else {
                this.setState({ individual: true })
            }
        }
    }

    getRequiredInfoForContact = (userInfo, key) => {
        if (userInfo && userInfo.meta_data.length) {

            let contact_value = userInfo.meta_data.find((item, index) => {

                if (item.key == 'contact_number' || item.key == 'contact-number') {
                    return item
                } 
            })

            if (contact_value && key == 'contact') {
                return contact_value.value
            }else{
                return ""
            }
        }
        else {
            return ""
        }
    }

    getRequiredInfo = (userInfo, key) => {
        if (userInfo && userInfo.meta_data.length) {

            // let contact_value = userInfo.meta_data.find((item, index) => {

            //     if (item.key == 'contact_number' || item.key == 'contact-number') {
            //         return item
            //     } else {
            //         return
            //     }
            // })




            let buisness_value = userInfo.meta_data.find((item, index) => {

                if (item.key == 'company-name' || item.key == 'company_name') {
                    return item
                }

            })

            let trn_number = userInfo.meta_data.find((item, index) => {

                if (item.key == 'trn_number' || item.key == 'trn-number') {
                    return item
                }
            })

            debugger


            // if (contact_value && key == 'contact') {
            //     return contact_value.value
            // }
            // else {
            //     return ""
            // }

            if (buisness_value && key == 'business') {
                return buisness_value.value
            }
            // else {
            //     return ""
            // }

            if (trn_number && key == 'trno') {
                return trn_number.value
            }
            //else {
            //     return ""
            // }


        }
        else {
            return ""
        }
    }
    mainComponent = () => {
        return (
            <View style={{ paddingTop: 20, }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/logo/ic_logo.png')} />
                </View>

                <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.5 }}>
                            <InputField
                                label={strings.firstname}
                                inputMenthod={(input) => { this.firstNameField = input }}
                                // rightIcon={require('../assets/images/ic_profile_black.png')}
                                placeholderTextColor="rgba(62,62,62,0.55)"
                                selectionColor="#3B56A6"
                                returnKeyType="next"
                                keyboardType='default'
                                autoCorrect={false}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                viewTextStyle={[styles.viewTextStyle, {}]}
                                value={this.state.firstName}
                                underlineColorAndroid='transparent'
                                isFocused={this.state.firstNameFieldFocus}
                                onFocus={() => this.setState({ firstNameFieldFocus: true })}
                                onBlur={() => this.setState({ firstNameFieldFocus: false })}
                                onChangeText={(firstName) => this.setState({ firstName })}
                                onSubmitEditing={(event) => { this.lastNameField.focus() }}

                            />
                        </View>
                        <View style={{ width: 10 }} />
                        <View style={{ flex: 0.5 }}>
                            <InputField
                                label={strings.lastName}
                                inputMenthod={(input) => { this.lastNameField = input }}
                                rightIcon={require('../assets/images/profileBlack/ic_profile_black.png')}
                                placeholderTextColor="rgba(62,62,62,0.55)"
                                selectionColor="#3B56A6"
                                returnKeyType="next"
                                keyboardType='default'
                                autoCorrect={false}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                viewTextStyle={[styles.viewTextStyle, {}]}
                                value={this.state.lastName}
                                underlineColorAndroid='transparent'
                                isFocused={this.state.lastNameFieldFocus}
                                onFocus={() => this.setState({ lastNameFieldFocus: true })}
                                onBlur={() => this.setState({ lastNameFieldFocus: false })}
                                onChangeText={(lastName) => this.setState({ lastName })}
                                onSubmitEditing={(event) => { this.emailField.focus() }}

                            />
                        </View>

                    </View>



                    <InputField
                        label={strings.email}
                        rightIcon={require('../assets/images/messageBlack/ic_message_black.png')}
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
                        rightIcon={require('../assets/images/keyBlack/ic_key.png')}
                        secureTextEntry={true}
                        inputMenthod={(input) => { this.passwordField = input }}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        returnKeyType="next"
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
                        onSubmitEditing={(event) => { this.confirmPasswordField.focus() }}
                    />

                    <InputField
                        label={strings.confirmPassword}
                        rightIcon={require('../assets/images/keyBlack/ic_key.png')}
                        inputMenthod={(input) => { this.confirmPasswordField = input }}
                        //placeholder={strings.confirmPassword')}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        secureTextEntry={true}
                        returnKeyType="next"
                        keyboardType='default'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize='none'
                        value={this.state.confirmPassword}
                        viewTextStyle={[styles.viewTextStyle, {}]}
                        onShowconfirmPassword={
                            () => this.setState({ secureconfirmPassword: !this.state.secureconfirmPassword })
                        }
                        isFocused={this.state.confirmPasswordFieldFocus}
                        underlineColorAndroid='transparent'
                        onFocus={() => this.setState({ confirmPasswordFieldFocus: true })}
                        onBlur={() => this.setState({ confirmPasswordFieldFocus: false })}
                        onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                        onSubmitEditing={(event) => { this.contactNumberField.focus() }}
                    />


                    <InputField
                        label={strings.contactNumber}
                        rightIcon={require('../assets/images/callBlack/ic_call_black.png')}
                        inputMenthod={(input) => { this.contactNumberField = input }}
                        //placeholder={strings.contactNumber')}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        // secureTextEntry={true}
                        returnKeyType="next"
                        keyboardType='phone-pad'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize='none'
                        maxlength={10}
                        value={this.state.contactNumber}
                        viewTextStyle={[styles.viewTextStyle, {}]}
                        isFocused={this.state.contactNumberFieldFocus}
                        underlineColorAndroid='transparent'
                        onFocus={() => this.setState({ contactNumberFieldFocus: true })}
                        onBlur={() => this.setState({ contactNumberFieldFocus: false })}
                        onChangeText={(contactNumber) => this.setState({ contactNumber })}
                        onSubmitEditing={(event) => { Keyboard.dismiss() }}
                    />
                    <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10, justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.4 }}>
                            <Text style={{
                                fontSize: 16,
                                color: colors.lightfontColor,
                                fontWeight: 'bold'
                            }}>
                                {'Account Type'}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 0.6, }}>
                            <TouchableOpacity onPress={() => this.setState({ individual: true, business: false })}>
                                <View style={{ borderWidth: 1, borderColor: colors.appColor, borderRadius: 15, flexDirection: 'row', marginRight: 5, flex: 0.3, height: 32, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: this.state.individual ? colors.appColor : 'rgba(238,238,238,0.9)', justifyContent: 'center' }}>
                                    <Image style={{ alignSelf: 'center' }} source={this.state.individual ? require('../assets/images/radioBusiness/ic_radio.png') : require('../assets/images/radioOff/ic_radio_off.png')} />
                                    <Text style={[styles.individualAndBusiness, { color: this.state.individual ? '#FFFFFF' : colors.appColor }]}>{' Individual'}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ individual: false, business: true })}>
                                <View style={{ borderWidth: 1, borderColor: colors.appColor, borderRadius: 15, flexDirection: 'row', flex: 0.3, height: 32, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: this.state.business ? colors.appColor : 'rgba(238,238,238,0.9)', justifyContent: 'center' }}>
                                    <Image style={{ alignSelf: 'center' }} source={this.state.business ? require('../assets/images/radioBusiness/ic_radio.png') : require('../assets/images/radioOff/ic_radio_off.png')} />
                                    <Text style={[styles.individualAndBusiness, , { color: this.state.business ? '#FFFFFF' : colors.appColor }]}>{' Business'}</Text>
                                </View>
                            </TouchableOpacity>

                        </View>


                    </View>

                    {
                        this.state.business ?
                            <View style={{ marignTop: 40 }}>
                                <InputField
                                    label={strings.buinessName}

                                    // rightIcon={require('../../assets/images/ic_call_black.png')}
                                    inputMenthod={(input) => { this.buinessNameField = input }}
                                    //placeholder={strings.buinessName')}
                                    placeholderTextColor="rgba(62,62,62,0.55)"
                                    // secureTextEntry={true}
                                    returnKeyType="next"
                                    keyboardType='default'
                                    autoCorrect={false}
                                    blurOnSubmit={false}
                                    autoCapitalize='none'
                                    maxlength={10}
                                    value={this.state.buinessName}
                                    viewTextStyle={[styles.viewTextStyle, {}]}
                                    isFocused={this.state.buinessNameFieldFocus}
                                    underlineColorAndroid='transparent'
                                    onFocus={() => this.setState({ buinessNameFieldFocus: true })}
                                    onBlur={() => this.setState({ buinessNameFieldFocus: false })}
                                    onChangeText={(buinessName) => this.setState({ buinessName })}
                                    onSubmitEditing={(event) => { this.trnNoField.focus() }}
                                />

                                <InputField
                                    label={strings.trnNo}
                                    sublabel={' (Can be added later)'}
                                    sublabelStyle={{ color: '#C6C6C4', fontSize: 12 }}
                                    // rightIcon={require('../../assets/images/ic_call_black.png')}
                                    inputMenthod={(input) => { this.trnNoField = input }}
                                    //placeholder={strings.trnNo')}
                                    placeholderTextColor="rgba(62,62,62,0.55)"
                                    // secureTextEntry={true}
                                    returnKeyType="done"
                                    keyboardType='default'
                                    autoCorrect={false}
                                    blurOnSubmit={false}
                                    autoCapitalize='none'
                                    maxlength={10}
                                    value={this.state.trnNo}
                                    viewTextStyle={[styles.viewTextStyle, {}]}
                                    isFocused={this.state.trnNoFieldFocus}
                                    underlineColorAndroid='transparent'
                                    onFocus={() => this.setState({ trnNoFieldFocus: true })}
                                    onBlur={() => this.setState({ trnNoFieldFocus: false })}
                                    onChangeText={(trnNo) => this.setState({ trnNo })}
                                    onSubmitEditing={(event) => { Keyboard.dismiss() }}
                                />
                            </View>



                            :
                            null
                    }

                    <View style={styles.continueButton}>
                        <CustomeButton

                            buttonStyle={styles.buttonStyle}
                            backgroundColor={'#01A651'}
                            title={'Save'}
                            borderColor={'#01A651'}
                            fontWeight={'bold'}
                            fontSize={16}
                            lineHeight={16}
                            activeOpacity={9}
                            onPress={() => this.Signup()}
                            textColor={'#FFFFFF'}
                            icon={require('../assets/images/submitGreen/ic_submit.png')}
                        />
                        <View style={{ height: 20 }} />

                    </View>

                </View>

            </View>
        )
    }

    //Form validations
    ValidationRules = () => {
       
        let { firstName, contactNumber, buinessName, individual, trnNo, email, password, confirmPassword } = this.state
        let { lang } = this.props.userCommon
        debugger
        
        return [
            {
                field: firstName,
                name: strings.firstname,
                rules: 'required|hasNumber|hasSymbol|no_space',
                lang: lang

            },
            {
                field: email,
                name: strings.email,
                rules: 'required|email|no_space',
                lang: lang

            },
            {
                field: contactNumber,
                name: strings.contactNumber,
                rules: 'required|numeric|min:10|max:10|no_space',
                lang: lang

            },
        ]
    }

    ValidationRulesPasswordAndCOonfirmPass = () => {
        let { password, confirmPassword } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [
            {
                field: password,
                name: strings.password,
                rules: 'required|no_space|min:6',
                lang: lang

            },
            {
                field: confirmPassword,
                name: strings.confirmPassword,
                rules: 'required|no_space|min:6',
                lang: lang

            },

        ]
    }
    ValidationRuleslastName = () => {
        let { lastName } = this.state
        let { lang } = this.props.userCommon
        return [
            {
                field: lastName,
                name: strings.lastName,
                rules: 'required|hasNumber|hasSymbol|no_space',
                lang: lang

            },


        ]
    }

    ValidationRulesAccountType = () => {
        let { buinessName, trnNo } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [
            {
                field: buinessName,
                name: strings.buinessName,
                rules: 'required|no_space',
                lang: lang

            },
            // {
            //     field: trnNo.trim(),
            //     name: strings.trnNo,
            //     rules: 'required',
            //     lang: lang

            // },


        ]
    }

    validationForOnlyTrnNUmber = () => {
        let { buinessName, trnNo } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [

            {
                field: trnNo,
                name: strings.trnNo,
                rules: 'required|no_space',
                lang: lang

            },


        ]
    }


    //Signup process
    Signup = () => {
        if (!this.props.userCommon.netStatus) {
            return this.props.showOptionsAlert('Check your internet connection!')
        }
        else {
            let customer_id = null
            // if (this.state.contactNumber != undefined || this.state.contactNumber == null) {
            //     this.setState({ contactNumber: "" })
            // }

            let { email, password, firstName, lastName, confirmPassword, contactNumber, buinessName, individual, business, trnNo } = this.state
            let validation = Validation.validate(this.ValidationRules())
            let validation2 = Validation.validate(this.ValidationRulesPasswordAndCOonfirmPass())
            let valiadtion3 = Validation.validate(this.ValidationRuleslastName())
            let validation4 = Validation.validate(this.ValidationRulesAccountType())
            let validation5 = Validation.validate(this.validationForOnlyTrnNUmber())

            if (validation.length != 0) {
                return ToastMessage(validation[0])
            }
            else if (lastName && valiadtion3.length != 0) {
                return ToastMessage(valiadtion3[0])
            }
            else if ((password || confirmPassword) && validation2.length != 0) {
                return ToastMessage(validation2[0])

            }
            else if (password !== confirmPassword) {
                return ToastMessage(strings.passwordnotmatch)

            }
            else if (this.state.business && validation4.length != 0) {
                return ToastMessage(validation4[0])
            }
            else if (this.state.trnNo && validation5.length != 0) {
                return ToastMessage(validation5[0])
            }
            else {
                this.setState({ visible: true })
                let data = {}

                data['email'] = email.trim()
                data['first_name'] = firstName.trim()
                data['last_name'] = lastName.trim()
                customer_id = this.props && this.props.user ? this.props.user.id : null
                // if (lastName) {

                // }
                if (password) {
                    data['password'] = password.trim()
                }

                if (this.state.business) {

                    data['meta_data'] = [
                        {
                            'id': 1,
                            'key': 'contact_number',
                            'value': contactNumber
                        },
                        {
                            'id': 2,
                            'key': 'account_type',
                            'value': 'Business',
                        },
                        {
                            'id': 5,
                            'key': 'customer_type',
                            'value': 'Business',
                        },

                        {
                            'id': 3,
                            'key': 'company-name',
                            'value': buinessName
                        },
                        {
                            'id': 4,
                            'key': 'trn_number',
                            'value': trnNo
                        },
                        {
                            'id': 5,
                            'key': 'trn-number',
                            'value': trnNo
                        },

                    ]
                }
                else {
                    data['meta_data'] = [
                        {
                            'id': 1,
                            'key': 'contact_number',
                            'value': contactNumber
                        },
                        {
                            'id': 2,
                            'key': 'account_type',
                            'value': 'Individual',
                        },
                        {
                            'id': 5,
                            'key': 'customer_type',
                            'value': 'Individual',
                        },
                        {
                            'id': 3,
                            'key': 'company-name',
                            'value': ""
                        },
                        {
                            'id': 4,
                            'key': 'trn_number',
                            'value': ""
                        },
                        {
                            'id': 4,
                            'key': 'trn-number',
                            'value': ""
                        },

                    ]
                }

                // data['meta_data'] = [
                //     {
                //         'id': 1,
                //         'key': 'contact_number',
                //         'value': contactNumber
                //     },

                // ]
                console.log(data, "data to be send")
                debugger

                this.props.customerActions.updateCustomer(customer_id, data).then((res) => {
                    debugger
                    let { params } = this.props.navigation.state
                    if (res && (res.status == 200 || res.status == 201)) {


                        res.data['token'] = this.props.userToken
                        this.props.customerActions.logInUserActionype(res.data)
                        setTimeout(() => {
                            ToastMessage('Your account has been updated successfully')
                            this.setState({ visible: false })
                            if (params && params.getAccountInfo()) {
                                params.getAccountInfo()
                                this.props.navigation.goBack()
                            }
                            else {
                                this.props.navigation.goBack()
                            }
                        }, 1000);

                        // this.props.navigation.navigate('App')

                    }
                    else {
                        if (res && res.response && res.response.data && res.response.data.message) {
                            ToastMessage(res.response.data.message)
                            this.setState({ visible: false })
                        } else {

                            this.setState({ visible: false })
                        }
                    }

                }).catch((err) => {
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

    openFreshChat = () => {
        setUser(this.props.user)
        Freshchat.showConversations()

    }

    rightItem = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Notification')}>
                        <IconBadge
                            MainElement={
                                <Image source={require('../assets/images/notificationIcon/ic_notification.png')} style={{ marginRight: 10 }} />
                            }
                            BadgeElement={
                                <Text style={{ color: 'white', fontSize: 10 }}>{this.props.unReadMessage}</Text>
                            }
                            IconBadgeStyle={{
                                position: 'absolute',
                                top: -8,
                                left: 8,
                                width: 22,
                                height: 22,
                                borderRadius: 22 / 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: 'white',
                                borderWidth: 1,
                                backgroundColor: 'red'
                            }}
                            Hidden={this.props.unReadMessage == 0 || this.props.unReadMessage == null}
                        />
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity onPress={() => this.openFreshChat()}>
                        <Image source={require('../assets/images/messageIcon/ic_message.png')} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
    render() {
        return (
            <View style={[styles.container, styles.AndroidSafeArea]}>
                <SafeAreaView style={{ backgroundColor: colors.appColor }} />
                <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }} style={{ backgroundColor: colors.white }}>

                    <StatusBar
                        translucent
                        barStyle={"dark-content"}
                        backgroundColor={'#00A651'}
                    />
                    {/* <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }}
                    style={[{ flex: 1, backgroundColor: '#ffffff' }]} > */}

                    {this.state.visible ? <Spinner /> : null}
                    <Container
                        backButton={true}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        rightItem={() => this.rightItem()}
                        title={'Profile Settings'}
                        // viewStyle={{ paddingBottom:50}}
                        scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 150 }}
                        // scrollStyle={{flex:1}}
                        scrollProps={{ showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: 'handled', }}
                        mainComponent={() => this.mainComponent()}
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
        userToken: state.login.userToken,
        unReadMessage: state.login.unReadMessage,
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(ProfileSettingScreen)

