import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    Keyboard,
    RefreshControl,

} from 'react-native';

//Local imports
import styles from '../styles'
import strings from '../utilities/languages'
import Validation from '../utilities/validations'
import CustomeButton from '../components/Button'
import { ToastMessage } from '../components/Toast'
import Spinner from '../components/Spinner'

import Container from '../components/Container'
import InputField from '../components/InputField'

//Global

import { Dropdown } from 'react-native-material-dropdown';


//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//Actions
import * as userActions from '../redux/actions/userAction'
import * as customerActions from '../redux/actions/customerAction'
import { colors, screenDimensions, fonts } from '../utilities/constants'


//constants 


class AddNewBillingAndShipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            streetAddress: '',
            townCity: '',
            state: '',
            postCode: '',
            country: 'Select',
            contactNumber: '',
            email: '',
            emailFieldFocus: false,
            allcountries: this.props && this.props.allCountriesData ? this.props.allCountriesData : [],
            allcountriesForFilter: [],

            firstNameFieldFocus: false,
            lastNameFieldFocus: false,
            streetAddressFocus: false,
            townCityFieldFocus: false,
            stateFieldFocus: false,
            postCodeFieldFocus: false,
            countryFieldFocus: false,
            contactNumberFieldFocus: false,

            isModalVisible: false,
            loader: false,
            securePassword: true,
            secureconfirmPassword: true,
            visible: false,
            allcountriesAvailble: [],
            isRefreshing: false,
            refreshing: false,
        }
    }

    componentDidMount = () => {
        console.log(this.props.navigation.state)
        this.getCountries()
    }


    //get list of all the countries
    getCountries = () => {
        // this.setState({ visible: true })
        let { allcountriesForFilter, allcountriesAvailble } = this.state
        this.props.actions.getAllCountries().then((res) => {
            if (res && res.status == 200) {
                let newvalue = Object.entries(res.data.options)
                this.setState({
                    allcountriesAvailble: res.data.value,
                    allcountriesForFilter: newvalue && newvalue.length ? newvalue.map((item, index) => {
                        let vauetoSave = {}
                        vauetoSave['name'] = item[1]
                        vauetoSave['value'] = item[1]
                        vauetoSave['code'] = item[0]
                        return vauetoSave

                    }) : [],

                }, () => {
                    let filteredCounty = []
                    for (let i = 0; i < this.state.allcountriesForFilter.length; i++) {
                        for (let j = 0; j < this.state.allcountriesAvailble.length; j++) {
                            if (this.state.allcountriesForFilter[i].code == this.state.allcountriesAvailble[j]) {

                                filteredCounty.push(this.state.allcountriesForFilter[i])
                            }
                        }
                    }
                    if (filteredCounty && filteredCounty.length) {
                        this.setState({
                            allcountries: filteredCounty,
                            visible: false,
                            isRefreshing: false,
                            refreshing: false,
                        })
                    } else {
                        this.setState({
                            visible: false,
                            isRefreshing: false,
                            refreshing: false,
                        })
                    }
                })

            } else {
                this.setState({
                    visible: false,
                    isRefreshing: false,
                    refreshing: false,
                })
            }
        }).catch((err) => {
            console.log(err)
            this.setState({
                visible: false, isRefreshing: false,
                refreshing: false,
            })
        })
    }


    //Selected country
    _selectedCountry = (val, index, data) => {
        debugger
        let { allcountriesAvailble } = this.state
        let found = data.find(function (element) {
            return element.name == val;
        });
        this.setState({
            country: val,

        }, () => {

            let counttuAvailForSelling = allcountriesAvailble.find(function (element) {
                return element == found.code;
            });

            console.log(counttuAvailForSelling, "counttuAvailForSelling")
            this.setState({ countryToSave: counttuAvailForSelling })

        })

    }


    //Form validations
    ValidationRules = () => {
        let { firstName, lastName, streetAddress, townCity, state, postCode, country, contactNumber } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [
            {
                field: firstName.trim(),
                name: strings.firstname,
                rules: 'required|hasNumber|hasSymbol',
                lang: lang

            },
            {
                field: lastName.trim(),
                name: strings.lastName,
                rules: 'required|hasNumber|hasSymbol',
                lang: lang

            },
            {
                field: streetAddress.trim(),
                name: strings.streetAddress,
                rules: 'required|no_space',
                lang: lang

            },
            {
                field: townCity,
                name: strings.townCity,
                rules: 'required|no_space',
                lang: lang

            },
            {
                field: state,
                name: strings.state,
                rules: 'required|no_space',
                lang: lang

            },


            {
                field: country,
                name: strings.country,
                rules: 'required|no_space',
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


    ValidationRules2 = () => {
        let { postCode } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [
            {
                field: postCode.trim(),
                name: strings.pincode,
                rules: 'required|no_space',
                lang: lang

            },

        ]
    }

    ValidationRules3 = () => {
        let { email } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [
            {
                field: email,
                name: strings.email,
                rules: 'required|email|no_space',
                lang: lang

            },

        ]
    }

    // form validation ends ********

    //add addreess process
    addAddress = () => {
        if (!this.props.userCommon.netStatus) {
            return this.props.showOptionsAlert('Check your internet connection!')
        }
        else {
            let { firstName, lastName, streetAddress, townCity, state, email, postCode, country, countryToSave, contactNumber } = this.state
            let validation = Validation.validate(this.ValidationRules())
            let validation2 = Validation.validate(this.ValidationRules2())
            let validation3 = Validation.validate(this.ValidationRules3())

            let { params } = this.props.navigation.state
            let userInfo = this.props && this.props.user ? this.props.user : null

            if (postCode != '' && validation2.length) {
                return ToastMessage(validation2[0])
            }

            if (validation.length != 0) {
                return ToastMessage(validation[0])
            }
            else if (params && params.key == 'billing' && validation3.length) {
                return ToastMessage(validation3[0])
            }
            else if (country == 'Select') {
                ToastMessage('Please select an available country')
            }
            else {
                this.setState({ visible: true })
                let data = {}
                let datatosave = {}
                if (userInfo && userInfo.meta_data) {
                    userInfo.meta_data.map((item, index) => {
                        if (item.key == 'shipping') {
                            if (item.value.length == 1 && (userInfo.shipping && userInfo.shipping.id == 1) && (userInfo.shipping && userInfo.shipping.first_name == "") && (params && params.key == 'shipping')) {
                                debugger
                                datatosave['shipping'] = {
                                    "id": 1,
                                    "first_name": firstName,
                                    "last_name": lastName,
                                    "company": "",
                                    "address_1": streetAddress,
                                    "address_2": "",
                                    "city": townCity,
                                    "state": state,
                                    "postcode": postCode,
                                    "country": countryToSave,
                                    'phone': contactNumber,
                                }
                            }
                            else {
                                data['id'] = new Date().getTime()
                            }
                        }
                        if (item.key == 'billing') {
                            debugger
                            if (item.value.length == 1 && (userInfo.billing && userInfo.billing.id == 1) && (userInfo.billing && userInfo.billing.first_name == "") && (params && params.key == 'billing')) {

                                datatosave['billing'] = {
                                    "id": 1,
                                    "first_name": firstName,
                                    "last_name": lastName,
                                    "email": email,
                                    "company": "",
                                    "address_1": streetAddress,
                                    "address_2": "",
                                    "city": townCity,
                                    "state": state,
                                    "postcode": postCode,
                                    "country": countryToSave,
                                    'phone': contactNumber,
                                }
                            }
                            else {
                                data['id'] = new Date().getTime()
                            }
                        }
                    })
                }

                data["first_name"] = firstName
                data["last_name"] = lastName
                data["company"] = ""
                data["address_1"] = streetAddress
                data["address_2"] = ""
                data["city"] = townCity

                if (params && params.key == 'billing') {
                    data["email"] = email
                }
                data["state"] = state
                data["postcode"] = postCode
                data["country"] = countryToSave
                data['phone'] = contactNumber

                datatosave['meta_data'] = [
                    {
                        "key": params && params.key ? params.key : '',
                        "value": params && params.shippingBillingArray ?
                            params.shippingBillingArray.length == 1 && params.shippingBillingArray[0].first_name == "" ?
                                [data] :
                                [...params.shippingBillingArray, data] :

                            [...params.shippingBillingArray, data]


                    }
                ]
                debugger

                if (userInfo) {
                    this.props.customerActions.updateCustomer(userInfo.id, datatosave).then((res) => {
                        debugger

                        if (res && (res.status == 200 || res.status == 201)) {
                            this.setState({ visible: false })
                            res.data['token'] = this.props.userToken
                            this.props.customerActions.logInUserActionype(res.data)
                            if (this.props.navigation.state.params && this.props.navigation.state.params.getShippingOrBillingInfo) {
                                debugger
                                this.props.navigation.state.params.getShippingOrBillingInfo(res.data)
                                ToastMessage("Address added successfully")
                                this.props.navigation.goBack()
                            } else {
                                this.props.navigation.goBack()
                            }
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
                else {

                    data['key'] = params.key
                    this.props.navigation.state.params.getShippingOrBillingInfo(data)
                    ToastMessage("Address added successfully")
                    this.props.navigation.goBack()


                }



            }
        }
    }


    //main rendered view component

    mainComponent = () => {
        let { params } = this.props.navigation.state
        return (
            <View style={{ paddingTop: 20, paddingBottom: 50 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/logo/ic_logo.png')} />
                </View>
                <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.5 }}>
                            <InputField
                                label={strings.firstname}
                                inputMenthod={(input) => { this.firstNameField = input }}
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
                                onSubmitEditing={params && params.key == 'billing' ? (event) => this.emailField.focus() : (event) => this.streetAddressField.focus()}

                            />
                        </View>

                    </View>

                    {
                        params && params.key == 'billing' ?
                            <InputField
                                label={strings.email}
                                inputMenthod={(input) => { this.emailField = input }}
                                placeholderTextColor="rgba(62,62,62,0.55)"
                                selectionColor="#3B56A6"
                                returnKeyType="next"
                                keyboardType='default'
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
                                onSubmitEditing={(event) => { this.streetAddressField.focus() }}

                            />

                            :
                            null
                    }

                    <InputField
                        label={strings.streetAddress}
                        inputMenthod={(input) => { this.streetAddressField = input }}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        selectionColor="#3B56A6"
                        returnKeyType="next"
                        keyboardType='default'
                        autoCorrect={false}
                        autoCapitalize='none'
                        blurOnSubmit={false}
                        viewTextStyle={[styles.viewTextStyle, {}]}
                        value={this.state.streetAddress}
                        underlineColorAndroid='transparent'
                        isFocused={this.state.streetAddressFieldFocus}
                        onFocus={() => this.setState({ streetAddressFieldFocus: true })}
                        onBlur={() => this.setState({ streetAddressFieldFocus: false })}
                        onChangeText={(streetAddress) => this.setState({ streetAddress })}
                        onSubmitEditing={(event) => { this.townCityField.focus() }}

                    />

                    <InputField
                        label={strings.townCity}
                        inputMenthod={(input) => { this.townCityField = input }}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        returnKeyType="next"
                        keyboardType='default'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize='none'
                        value={this.state.townCity}
                        viewTextStyle={[styles.viewTextStyle, {}]}

                        isFocused={this.state.townCityFieldFocus}
                        underlineColorAndroid='transparent'
                        onFocus={() => this.setState({ townCityFieldFocus: true })}
                        onBlur={() => this.setState({ townCityFieldFocus: false })}
                        onChangeText={(townCity) => this.setState({ townCity })}
                        onSubmitEditing={(event) => { this.stateField.focus() }}
                    />

                    <InputField
                        label={strings.state}
                        inputMenthod={(input) => { this.stateField = input }}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        returnKeyType="next"
                        keyboardType='default'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize='none'
                        value={this.state.state}
                        viewTextStyle={[styles.viewTextStyle, {}]}
                        isFocused={this.state.stateFieldFocus}
                        underlineColorAndroid='transparent'
                        onFocus={() => this.setState({ stateFieldFocus: true })}
                        onBlur={() => this.setState({ stateFieldFocus: false })}
                        onChangeText={(state) => this.setState({ state })}
                        onSubmitEditing={(event) => { this.postCodeField.focus() }}
                    />


                    <InputField
                        label={strings.pincode}
                        inputMenthod={(input) => { this.postCodeField = input }}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        returnKeyType="next"
                        keyboardType='number-pad'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize='none'
                        value={this.state.postCode}
                        viewTextStyle={[styles.viewTextStyle, {}]}
                        isFocused={this.state.postCodeFieldFocus}
                        underlineColorAndroid='transparent'
                        onFocus={() => this.setState({ postCodeFieldFocus: true })}
                        onBlur={() => this.setState({ postCodeFieldFocus: false })}
                        onChangeText={(postCode) => this.setState({ postCode })}
                        onSubmitEditing={(event) => { Keyboard.dismiss() }}
                    />

                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                        <Text style={{
                            fontSize: 16,
                            color: colors.lightfontColor,
                            fontWeight: 'bold',
                        }}>
                            {strings.country}
                        </Text>
                    </View>

                    <Dropdown
                        containerStyle={{ marginTop: 4, width: screenDimensions.width - 40, paddingRight: 10 }}
                        inputContainerStyle={{
                            borderBottomColor: '#C6C6C4'
                        }}
                        itemTextStyle={styles.inputField}
                        style={{}}
                        textColor={colors.titleColor}
                        value={this.state.country}
                        baseColor={'black'}
                        labelHeight={0}
                        valueExtractor={({ value }) => value}
                        data={this.state.allcountries}
                        onChangeText={(value, index, data) => this._selectedCountry(value, index, data)}
                    />
                   

                    <InputField
                        label={strings.contactNumber}
                        inputMenthod={(input) => { this.contactNumberField = input }}
                        placeholderTextColor="rgba(62,62,62,0.55)"
                        returnKeyType="next"
                        keyboardType='number-pad'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize='none'
                        value={this.state.contactNumber}
                        viewTextStyle={[styles.viewTextStyle, {}]}
                        isFocused={this.state.contactNumberFieldFocus}
                        underlineColorAndroid='transparent'
                        onFocus={() => this.setState({ contactNumberFieldFocus: true })}
                        onBlur={() => this.setState({ contactNumberFieldFocus: false })}
                        onChangeText={(contactNumber) => this.setState({ contactNumber })}
                        onSubmitEditing={(event) => { Keyboard.dismiss() }}
                    />


                    <View style={styles.continueButton}>
                        <CustomeButton
                            buttonStyle={styles.buttonStyle}
                            backgroundColor={'#01A651'}
                            title={'Add'}
                            borderColor={'#01A651'}
                            fontWeight={'bold'}
                            fontSize={16}
                            lineHeight={16}
                            activeOpacity={9}
                            onPress={() => this.addAddress()}
                            textColor={'#FFFFFF'}
                            icon={require('../assets/images/addPlus/ic_add.png')}
                        />
                        <View style={{ height: 20 }} />

                    </View>

                </View>


            </View>
        )
    }

    handleRefresh = () => {
        let { params } = this.props.navigation.state

        this.setState({
            refreshing: true,
            visible: true
        }, () => {
            this.getCountries();
        });
    }



    render() {
        let { params } = this.props.navigation.state
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
                        title={params && params.title ? params.title : ''}
                        scrollView={true}
                        viewStyle={{ marginTop: 20, height: screenDimensions.height }}
                        scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 150 }}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        scrollProps={{
                            showsVerticalScrollIndicator: false,
                            height: screenDimensions.height,
                            keyboardShouldPersistTaps: 'handled',
                            refreshControl:
                                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />

                        }}
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
        user: state.login.user,
        userCommon: state.user,
        userToken: state.login.userToken,
        allCountriesData: state.login.allCountriesData,
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
export default connect(mapStateToProps, mapDispathToProps)(AddNewBillingAndShipping)

