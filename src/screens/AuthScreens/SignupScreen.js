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
    KeyboardAvoidingView,
    Platform
} from 'react-native';

//Global libs
import axios from 'axios'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

//Local imports
import styles from '../../styles'
import strings from '../../utilities/languages'
import Validation from '../../utilities/validations'
import CustomeButton from '../../components/Button'
import { ToastMessage } from '../../components/Toast'
import Spinner from '../../components/Spinner'
import Container from '../../components/Container'
import InputField from '../../components/InputField'
import { addUserToAdminPanel } from '../../utilities/config'

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../../redux/actions/userAction';
import * as customerActions from '../../redux/actions/customerAction'
import { colors, screenDimensions } from '../../utilities/constants';


//constants 
const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    buinessName: '',
    trnNo: '',
    partnerId: '',
    firstNameFieldFocus: false,
    lastNameFieldFocus: false,
    emailFieldFocus: false,
    passwordFieldFocus: false,
    confirmPasswordFieldFocus: false,
    contactNumberFieldFocus: false,
    buinessNameFieldFocus: false,
    trnNoFieldFocus: false,
    partnerIdFieldFocus: false,
    isModalVisible: false,
    loader: false,
    securePassword: true,
    secureconfirmPassword: true,
    visible: false,
    business: true,
    individual: false
};

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = initialState
    }

    //Form validations
    ValidationRules = () => {
        let { firstName, contactNumber,  email, password, confirmPassword } = this.state
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

            {
                field: contactNumber,
                name: strings.mobilenumber,
                rules: 'required|numeric|min:10|max:10|no_space',
                lang: lang

            },

        ]
    }
    //validaiton for account type
    ValidationRulesAccountType = () => {
        let { buinessName } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [
            {
                field: buinessName.trim(),
                name: strings.buinessName,
                rules: 'required',
                lang: lang

            },
        ]
    }
    //validation last name
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
    //validation trn number
    validationForOnlyTrnNUmber = () => {
        let { trnNo } = this.state
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

    //register user to admin panel
    addUserToAdminPanel = (user) => {
        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        }
        let data = {
            'user_id': user.id,
            'is_app': 1
        }
        return axios.post(`${addUserToAdminPanel}`, data, header).then((res) => {
            if (res && res.status == 200) {
                debugger
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })
    }


    //Signup process
    Signup = () => {
        if (!this.props.userCommon.netStatus) {
            return this.props.showOptionsAlert('Check your internet connection!')
        }
        else {
            let { email, password, firstName, confirmPassword, contactNumber, buinessName, individual, lastName, business, trnNo } = this.state
            let validation = Validation.validate(this.ValidationRules())
            let validation2 = Validation.validate(this.ValidationRulesAccountType())
            let valiadtion3 = Validation.validate(this.ValidationRuleslastName())
            let validation5 = Validation.validate(this.validationForOnlyTrnNUmber())


            if (validation.length != 0) {
                return ToastMessage(validation[0])
            }

            else if (lastName && valiadtion3.length != 0) {
                return ToastMessage(valiadtion3[0])
            }
            else if (password !== confirmPassword) {
                return ToastMessage(strings.passwordnotmatch)
            }
            else if (this.state.business && validation2.length != 0) {
                return ToastMessage(validation2[0])
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
                data['password'] = password.trim()
                if (this.state.business) {
                    //meta data
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
                            key: 'shipping',
                            value: []
                        },
                    ]
                }
                else {
                    //meta data
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
                            key: 'shipping',
                            value: []
                        }
                    ]
                }
                console.log(data, "data to be send")
                debugger
                this.props.customerActions.createCustomer(data).then((res) => {
                    debugger

                    if (res && (res.status == 200 || res.status == 201)) {
                        Promise.all([
                            this.addUserToAdminPanel(res.data)
                        ]).then(() => {
                            debugger
                            this.setState({ visible: false })
                            this.props.navigation.navigate('LoginScreen')
                            ToastMessage('Your account has been created successfully. Please login to continue.')
                        }).catch((error) => {
                            debugger
                            this.setState({ visible: false })
                            this.props.navigation.navigate('LoginScreen')
                            ToastMessage('Server Error !!!!')
                            // ToastMessage('Your account has been created successfully. Please login to continue.')
                        })

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

    //Main rendered component

    mainComponent = () => {
        return (

            // <KeyboardAwareScrollView>
                <View style={{ paddingTop: 20}}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../assets/images/logo/ic_logo.png')} />
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
                                    rightIcon={require('../../assets/images/profileBlack/ic_profile_black.png')}
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
                            rightIcon={require('../../assets/images/keyBlack/ic_key.png')}
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
                            rightIcon={require('../../assets/images/callBlack/ic_call_black.png')}
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
                                    <View style={{ borderWidth: 1, borderColor: colors.appColor, borderRadius: 15, flexDirection: 'row', marginRight: 5, flex: 0.3, height: 30, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: this.state.individual ? colors.appColor : 'rgba(238,238,238,0.9)', }}>
                                        <Image style={{ alignSelf: 'center' }} source={this.state.individual ? require('../../assets/images/radioBusiness/ic_radio.png') : require('../../assets/images/radioOff/ic_radio_off.png')} />
                                        <Text style={[styles.individualAndBusiness, { color: this.state.individual ? '#FFFFFF' : colors.appColor }]}>{' Individual'}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.setState({ individual: false, business: true })}>
                                    <View style={{ borderWidth: 1, borderColor: colors.appColor, borderRadius: 15, flexDirection: 'row', flex: 0.3, height: 30, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: this.state.business ? colors.appColor : 'rgba(238,238,238,0.9)', }}>
                                        <Image style={{ alignSelf: 'center' }} source={this.state.business ? require('../../assets/images/radioBusiness/ic_radio.png') : require('../../assets/images/radioOff/ic_radio_off.png')} />
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
                                        inputMenthod={(input) => { this.buinessNameField = input }}
                                        placeholderTextColor="rgba(62,62,62,0.55)"
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
                                        inputMenthod={(input) => { this.trnNoField = input }}
                                        placeholderTextColor="rgba(62,62,62,0.55)"
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
                                title={strings.signupsmall}
                                borderColor={'#01A651'}
                                fontWeight={'bold'}
                                fontSize={16}
                                lineHeight={16}
                                activeOpacity={9}
                                onPress={() => this.Signup()}
                                textColor={'#FFFFFF'}
                                icon={require('../../assets/images/addProfile/ic_profile-add.png')}
                            />
                            <View style={{ height: 20 }} />

                        </View>

                    </View>

                </View>
            // </KeyboardAwareScrollView>



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
                        title={'Signup'}
                        viewStyle={{ paddingBottom: 10, height: screenDimensions.height, }}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        scrollProps={{ showsVerticalScrollIndicator: false, height: screenDimensions.height, keyboardShouldPersistTaps: 'handled' }}
                        mainComponent={() => this.mainComponent()}
                        scrollView={true}
                    />
                </SafeAreaView>
            </View >

        );
    }
}


//mapping reducer states to component
function mapStateToProps(state) {

    return {
        // user: state.login.user,
        userCommon: state.user
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
export default connect(mapStateToProps, mapDispathToProps)(Signup)

