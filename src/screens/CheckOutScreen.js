import React, { Component } from 'react';
import {
    View,
    Text,
    // SafeAreaView,
    Image,
    StatusBar,
    Keyboard,
    TouchableOpacity,
    ScrollView,
    NativeModules,
    Platform,
    FlatList,
} from 'react-native';


//GLobal lib 
import SafeAreaView from 'react-native-safe-area-view';

//Local imports
import styles from '../styles'
import strings from '../utilities/languages'
import Validation from '../utilities/validations'
import CustomeButton from '../components/Button'
import { ToastMessage } from '../components/Toast'
import backButton from '../assets/img/ic_back.png'
import Spinner from '../components/Spinner'
import Header from '../components/Header'
import Container from '../components/Container'
import InputField from '../components/InputField'
import CardView from 'react-native-cardview'
const { MasterCardPayement: MasterCardPayement } = NativeModules;
import { upadteOrderPlacedOnAdmin, mechantCredential, addUserToAdminPanel, getNotifications } from '../utilities/config'
import axios from 'axios'
import { walletUrl, key, sec, headerForWishlist } from '../utilities/config'

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import { colors, screenDimensions } from '../utilities/constants';
import { tsExpressionWithTypeArguments } from '@babel/types';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as productActions from '../redux/actions/productAction'
import * as cartActions from '../redux/actions/cartAction'
import * as orderActions from '../redux/actions/orderAction'
import * as couponActions from '../redux/actions/couponsAction'
import moment from 'moment';
import { paymentOptions } from '../utilities/staticData';
import cloneDeep from 'clone-deep';



class CheckOutScreen extends Component {
    constructor(props) {
        super(props);
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.state = {
            visible: false,
            refreshToken: null,
            shippingaddress: this.props.userShipping.shippingaddress,
            billingaddress: this.props.userBilling.billingaddress,
            accountTypesArray: [
                { id: 1, accountTypeTitle: 'Individual' },
                { id: 1, accountTypeTitle: 'Business' },
            ],
            individual: false,
            business: false,
            deliveryOptions: [
                { id: "local_pickup", title: "Local pickup", description: "Pickup from our DIP warehouse (Dubai Investment Park)", chargableAmount: "0" },
                { id: "flat_rate", title: "Flat rate", description: "Delivery within UAE", chargableAmount: "10" },
            ],
            paymentOptions: paymentOptions,

            selectedShippingAddressIndex: null,
            selectedShippingAddress: null,
            selectedDeliveryOptionIndex: null,
            selectedDeliveryOption: null,
            selectedbillingAddressIndex: null,
            selectedbillingAddress: null,
            slectedPaymentMethodIndex: null,
            slectedPaymentMethod: null,
            billingExist: false,
            shippingExist: false,
            lastIndex: false,
            shippingDetails: true,
            shippingSelectedBar: true,
            paymentSelectedBar: false,
            completeSelectedBar: false,
            paymentMethods: false,
            cardPaymentView: false,
            completeOrderView: false,
            orderComplete: false,
            cardNumber: '',
            monthYear: '',
            cvvNumber: '',
            orderNumber: "32342",
            allTaxRates: [],
            orderCompleteData: null,
            allCoupons: this.props.allCoupons,
            retrieveCouponsInfo: null,
            couponCode: '',
            couponMessage: "",
            error: false,
            messsgaeBelow: null,
            allcountriesForFilter: [],
            allcountriesAvailble: [],
            allcountries: [],
            companyName: '',
            trnNumber: '',
            accountType: '',
            buinessNameFieldFocus: false,
            trnNoFieldFocus: false,
            newdate: ''


        };


    }


    componentDidMount = async () => {
        let { params } = this.props.navigation.state
        let userInfo = this.props && this.props.user ? this.props.user : null

        if (userInfo) {
            userInfo.meta_data.map((item, index) => {
                if (item && (item.key == "account_type" || item.key == "account-type" || item.key == "customer_type")) {
                    this.setState({
                        accountType: item.value
                    })
                }
                if (item && (item.key == "company-name" || item.key == "company_name")) {
                    this.setState({
                        companyName: item.value
                    })
                }
                if (item && (item.key == "trn_number" || item.key == "trn-number")) {
                    this.setState({
                        trnNumber: item.value
                    })
                }
            })
        }

        var today = new Date();
        var newdate = new Date();
        newdate = today.getDay() == 5 ? moment(newdate.setDate(today.getDate() + 4)).format('DD-MM-YYYY') : moment(newdate.setDate(today.getDate() + 3)).format('DD-MM-YYYY');

        this.setState({
            newdate: newdate
        }, () => {
            console.log(newdate, "newdate----newdate")
        })

        this.getCountries()
        this.getAllCoupons()
        this.getAllOrders()


    }

    getAllOrders = () => {
        // this.setState({ visible: true })
        this.props.orderActions.getAllOrders(this.props.user).then((res) => {
            if (res && res.status == 200) {
                if (res && res.data.length) {

                    this.props.orderActions.saveUsersOrders({
                        usersOrders: {
                            "pendingOrders": res.data.filter(item => item.status != 'completed'),
                            "completedOrders": res.data.filter(item => item.status == 'completed')
                        }
                    })
                    // this.setState({ visible: false })
                }
                else {
                    // this.setState({ visible: false })
                }
            } else {
                // this.setState({ visible: false })
            }
        }).catch((err) => {
            // this.setState({ visible: false })
        })
    }

    //get list of all countries
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
                            allcountries: filteredCounty
                        })
                    }
                })

            } else {
                this.setState({ visible: false })
            }
        }).catch((err) => {
            console.log(err)
            this.setState({ visible: false })
        })
    }

    //get all the coupons available
    getAllCoupons = () => {
        this.props.couponActions.getAllCoupons().then((res) => {
            console.log("res all couypons", res)
            if (res && res.status == 200 || res.status == 201) {
                this.props.couponActions.setAllCoupons({ allCoupons: res.data })
            } else {
                console.log("res for coupon ", res)
            }
        }).catch((err) => {
            console.log("coupon error", error)
        })
    }

    // get all the taxes available
    getAllTaxes = () => {
        this.props.cartActions.getAllTaxes().then((res) => {
            if (res && (res.status == 200 || res.status == 201)) {
                this.setState({
                    allTaxRates: res.data
                }, () => console.log(this.state.allTaxRates, "this.state.allTaxRates"))
            }
        }).catch((err) => {
            console.log()
        })
    }


    //get whole information of user
    getUserInfo = (userInfo) => {

        this.setState({ visible: this.state.shippingaddress.length || this.state.billingaddress.length ? false : true })
        this.props.customerActions.retrieveCustomer(userInfo.id).then((res) => {
            if (res && res.status == 200) {
                debugger
                res.data.shipping['id'] = 1
                res.data.billing['id'] = 1
                res.data['token'] = this.props.userToken
                debugger
                this.props.customerActions.logInUserActionype(res.data)
                this.getUserInfoForBillingAndShipping(res.data)

            }
        })
    }

    //get billing and shipping info
    getUserInfoForBillingAndShipping = (userInfo) => {

        debugger
        this.setState({ visible: true })
        let userExist = this.props && this.props.user ? this.props.user : null

        if (userExist) {
            userInfo && userInfo.meta_data ?

                userInfo.meta_data.map((item, index) => {

                    if (item.key == 'shipping') {
                        debugger
                        this.setState({
                            visible: false,
                            // shippingaddress: item.value.length ? item.value : [userInfo.shipping],
                            shippingExist: true
                        }, () => {
                            if (item.value.length) {
                                if (item.value.length == 1) {

                                    if (userInfo.shipping.id == 1 && userInfo.shipping.first_name != "") {
                                        let data1 = {
                                            'meta_data': [
                                                {
                                                    key: 'shipping',
                                                    value: [userInfo.shipping]
                                                },
                                            ]
                                        }
                                        this.updateShippingAndBillingKeys(this.props.user, data1)
                                        this.props.customerActions.setUserShipping({ shippingaddress: [userInfo.shipping] })
                                        this.setState({ visible: false, shippingaddress: [userInfo.shipping] })

                                        debugger
                                    } else {

                                        if (userInfo.shipping.first_name == "" && userInfo.shipping.id) {
                                            this.setState({ visible: false, shippingaddress: [userInfo.shipping] })
                                            this.props.customerActions.setUserShipping({ shippingaddress: [userInfo.shipping] })

                                        } else {
                                            this.setState({ visible: false, shippingaddress: item.value })
                                            this.props.customerActions.setUserShipping({ shippingaddress: item.value })

                                        }

                                        // this.setState({ visible: false, shippingaddress: [userInfo.shipping] })
                                        debugger
                                    }

                                }
                                else {
                                    this.setState({ visible: false, shippingaddress: item.value })
                                    this.props.customerActions.setUserShipping({ shippingaddress: item.value })

                                }
                                // this.setState({ shippingaddress: item.value })
                            } else {
                                debugger
                                this.setState({ visible: false, shippingaddress: [userInfo.shipping] })
                                this.props.customerActions.setUserShipping({ shippingaddress: item.value })
                                let data1 = {
                                    'meta_data': [
                                        {
                                            key: 'shipping',
                                            value: [userInfo.shipping]
                                        },
                                    ]
                                }
                                this.updateShippingAndBillingKeys(this.props.user, data1)
                                console.log("here")

                            }
                            console.log("shippingExist", this.state.shippingExist)

                        })
                    }




                    if (item.key == 'billing') {
                        debugger
                        this.setState({
                            visible: false,
                            // billingaddress: item.value.length ? item.value : [userInfo.shipping],
                            billingExist: true
                        }, () => {
                            debugger
                            if (item.value.length) {
                                if (item.value.length == 1) {
                                    debugger

                                    if (userInfo.billing.id == 1 && userInfo.billing.first_name != "") {
                                        let data1 = {
                                            'meta_data': [
                                                {
                                                    key: 'billing',
                                                    value: [userInfo.billing]
                                                },
                                            ]
                                        }
                                        this.updateShippingAndBillingKeys(this.props.user, data1)
                                        this.props.customerActions.setUserBilling({ billingaddress: [userInfo.billing] })

                                        this.setState({ visible: false, billingaddress: [userInfo.billing] })

                                        debugger
                                    } else {
                                        if (userInfo.billing.first_name == "" && userInfo.billing.id) {
                                            this.setState({ visible: false, billingaddress: [userInfo.billing] })
                                            this.props.customerActions.setUserBilling({ billingaddress: [userInfo.billing] })

                                        } else {
                                            this.setState({ visible: false, billingaddress: item.value })
                                            this.props.customerActions.setUserBilling({ billingaddress: item.value })

                                        }
                                        debugger
                                    }

                                }
                                else {
                                    this.setState({ visible: false, billingaddress: item.value })
                                    this.props.customerActions.setUserBilling({ billingaddress: item.value })
                                }
                            } else {
                                debugger
                                this.setState({ visible: false, billingaddress: [userInfo.billing] })
                                this.props.customerActions.setUserBilling({ billingaddress: [userInfo.billing] })
                                let data2 = {
                                    'meta_data': [
                                        {
                                            key: 'billing',
                                            value: [userInfo.billing]
                                        },
                                    ]
                                }
                                this.updateShippingAndBillingKeys(this.props.user, data2)

                            }

                            console.log("billingExist", this.state.billingExist)
                        })
                    }



                    if (index == (userInfo.meta_data.length - 1)) {
                        this.setState({ lastIndex: true })
                    }


                })
                :
                null

            if (this.state.lastIndex) {
                // if (index == (userInfo.meta_data.length - 1)) {
                debugger
                if (!this.state.shippingExist) {
                    debugger
                    let data1 = {
                        'meta_data': [
                            {
                                key: 'shipping',
                                value: [userInfo.shipping]
                            },
                        ]
                    }
                    this.updateShippingAndBillingKeys(this.props.user, data1)
                }

                if (!this.state.billingExist) {
                    debugger


                    let data2 = {
                        'meta_data': [
                            {
                                key: 'billing',
                                value: [userInfo.billing]
                            },
                        ]
                    }
                    this.updateShippingAndBillingKeys(this.props.user, data2)
                }
                // }
            }

        } else {

            if (userInfo.key == 'billing') {
                this.setState({ visible: false })
                this.props.customerActions.setUserBilling({ billingaddress: [userInfo] })

                this.setState({
                    billingaddress: [userInfo]
                })

            } else {
                this.setState({ visible: false })
                this.props.customerActions.setUserShipping({ shippingaddress: [userInfo] })
                this.setState({
                    shippingaddress: [userInfo]
                })

            }

        }



    }


    //updating the keys in billing and shipping info if required
    updateShippingAndBillingKeys = (userInfo, data, item, shipping_billing) => {
        debugger
        this.props.customerActions.updateCustomer(userInfo.id, data).then((res) => {
            if (res && (res.status == 200 || res.status == 201)) {
                res.data.shipping['id'] = 1
                res.data.billing['id'] = 1
                res.data['token'] = this.props.userToken
                this.props.customerActions.logInUserActionype(res.data)
                if (shipping_billing) {
                    ToastMessage("Address has been deleted successfully")
                    this.getUserInfo(res.data)
                }
                this.setState({ visible: false })
            }
            else {
                this.setState({ visible: false })
            }
        }).catch((err) => {
            console.log(err)
            this.setState({ visible: false })
        })
    }


    //Delete shipping info
    deleteShipping = (item) => {
        debugger
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.setState({ visible: true })
        if (userInfo) {
            let shipping_billing = 'shipping'
            let dataToSplice = [...this.state.shippingaddress]
            var filterITem = dataToSplice.filter(x => x.id != item.id)
            debugger
            let datatosave = {}
            if (item.id === userInfo.shipping.id) {


                if (filterITem.length) {
                    let dataNew = { ...filterITem[0] }
                    dataNew.id = 1
                    datatosave['shipping'] = dataNew
                    // datatosave.shipping['id'] = 1
                } else {
                    datatosave['shipping'] = {
                        "first_name": "",
                        "last_name": "",
                        "company": "",
                        "address_1": "",
                        "address_2": "",
                        "city": "",
                        "state": "",
                        "postcode": "",
                        "country": "",
                        "phone": ""
                    }
                }




                datatosave['meta_data'] = [
                    {
                        "key": 'shipping',
                        "value": filterITem
                    }
                ]
            } else {
                // var filterITem = dataToSplice.filter(x => x.id != item.id)
                datatosave['meta_data'] = [
                    {
                        "key": 'shipping',
                        "value": filterITem
                    }
                ]
            }
            this.updateShippingAndBillingKeys(this.props.user, datatosave, item, shipping_billing)
        }
        else {

            this.setState({ visible: false })
            this.props.customerActions.setUserShipping({ shippingaddress: [] })
            this.setState({
                shippingaddress: [],
                visible: false
            })
        }
    }


    //select shipping address
    onSelectShipping = (item, index) => {
        this.setState({ selectedShippingAddress: item, selectedShippingAddressIndex: index }, () => {
            if (this.state.selectedDeliveryOption && this.state.selectedDeliveryOption.id == 'local_pickup') {
                this.setState({
                    selectedDeliveryOption: null,
                    selectedDeliveryOptionIndex: null
                })
            }
        })
    }


    //delete billing adrress
    deleteBilling = (item) => {
        debugger
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.setState({ visible: true })
        let shipping_billing = 'billing'
        if (userInfo) {
            let dataToSplice = [...this.state.billingaddress]
            var filterITem = dataToSplice.filter(x => x.id != item.id)
            debugger
            let data = {}
            if (item.id === userInfo.billing.id) {


                if (filterITem.length) {

                    let dataNew = { ...filterITem[0] }
                    dataNew.id = 1
                    datatosave['billing'] = dataNew
                } else {
                    // var filterITem = []
                    data['billing'] = {
                        "first_name": "",
                        "last_name": "",
                        "company": "",
                        "address_1": "",
                        "address_2": "",
                        "city": "",
                        "state": "",
                        "postcode": "",
                        "country": "",
                        // "email": "abc@123.com",
                        "phone": ""
                    }
                }




                data['meta_data'] = [
                    {
                        "key": 'billing',
                        "value": filterITem
                    }
                ]
            } else {
                var filterITem = dataToSplice.filter(x => x.id != item.id)
                data['meta_data'] = [
                    {
                        "key": 'billing',
                        "value": filterITem
                    }
                ]
            }

            // data = {
            //     'meta_data': [
            //         {
            //             key: 'billing',
            //             value: filterITem
            //         },
            //     ]
            // }
            this.updateShippingAndBillingKeys(this.props.user, data, item, shipping_billing)

        }
        else {
            this.setState({ visible: false })
            this.props.customerActions.setUserBilling({ billingaddress: [] })

            this.setState({
                billingaddress: []
            })
        }


    }

    //select billing address
    onSelectBilling = (item, index) => {
        this.setState({ selectedbillingAddress: item, selectedbillingAddressIndex: index })
    }

    //Select Delievery option
    onSelectDeliveryOption = (item, index) => {
        this.setState({ selectedDeliveryOption: item, selectedDeliveryOptionIndex: index }, () => {
            if (item.id == 'local_pickup') {
                this.setState({
                    selectedShippingAddress: null,
                    selectedShippingAddressIndex: null
                })
            }

        })
    }

    priceList = () => {
        return (
            <ScrollView>
                <FlatList
                    bounces={true}
                    extraData={this.state}
                    showsVerticalScrollIndicator={true}
                    data={this.state.addAmountArray}
                    keyExtractor={this._keyExtractor3}
                    renderItem={this.getAllPriceList}
                    automaticallyAdjustContentInsets={true}

                />
            </ScrollView>

        )
    }

    //Selected payment method
    paymentMethodsInfo = () => {
        if (this.state.slectedPaymentMethod) {
            if (this.state.slectedPaymentMethod.id == 'abzer_networkonline') {
                this.setState({ completeOrderView: true, paymentMethods: false, completeSelectedBar: true })
            }
            else if (this.state.slectedPaymentMethod.id == 'wallet_gateway') {
                this.setState({ completeOrderView: true, paymentMethods: false, completeSelectedBar: true })
            }
            else {
                this.setState({ completeOrderView: true, paymentMethods: false, completeSelectedBar: true })
            }
        }
        else {
            ToastMessage('Please select a payment method')
        }
    }

    //Add shipping and billing info
    
    addShippingInfo = () => {
        this.setState({ visible: true })

        let { accountType } = this.state
        let userInfo = this.props && this.props.user ? this.props.user : null

        let validation4 = Validation.validate(this.ValidationRulesAccountType())
        let validation5 = Validation.validate(this.validationForOnlyTrnNUmber())


        if (!userInfo && accountType == '') {
            ToastMessage("Please select the account type")
            this.setState({ visible: false })
        }
        else if (!userInfo && (accountType == 'Business') && validation4.length != 0) {
            ToastMessage(validation4[0])
            this.setState({ visible: false })
        }
        else if (!userInfo && (accountType == 'Business') && this.state.trnNumber != '' && validation5.length != 0) {
            ToastMessage(validation5[0])
            this.setState({ visible: false })
        }
        else if (!this.state.selectedShippingAddress && !this.state.selectedDeliveryOption) {
            ToastMessage("Please select the shipping address")
            this.setState({ visible: false })
        }
        else if (!this.state.selectedShippingAddress && (this.state.selectedDeliveryOption && this.state.selectedDeliveryOption.id != 'local_pickup')) {
            ToastMessage("Please select the shipping address")
            this.setState({ visible: false })
        }

        else if (!this.state.selectedbillingAddress) {
            ToastMessage("Please select the billing address")
            this.setState({ visible: false })
        }
        else if (!this.state.selectedDeliveryOption) {
            ToastMessage("Please select the delivery option")
            this.setState({ visible: false })
        }
        else {
            this.setState({
                visible: false,
                shippingDetails: false,
                paymentMethods: true,
                paymentSelectedBar: true

            })
            
        }

    }

    //validation rule account type
    ValidationRulesAccountType = () => {
        let { companyName, trnNo } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [
            {
                field: companyName,
                name: strings.buinessName,
                rules: 'required|no_space',
                lang: lang

            },


        ]
    }

    //validation rule trn number
    validationForOnlyTrnNUmber = () => {
        let { buinessName, trnNumber } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [

            {
                field: trnNumber,
                name: strings.trnNo,
                rules: 'required|no_space',
                lang: lang

            },


        ]
    }

    enterCartForPayment = () => {

        let { cardNumber, monthYear, cvvNumber } = this.state
        let validation = Validation.validate(this.ValidationRules())
        
        this.setState({ visible: true })
        setTimeout(() => {
            this.setState({ visible: false, cardPaymentView: false, completeOrderView: true, completeSelectedBar: true })
        }, 2000);
        // }

    }

    //on click next button function
    nextFuntion = () => {
        if (this.state.shippingDetails) {
            this.addShippingInfo()
        }
        if (this.state.paymentMethods) {
            this.paymentMethodsInfo()
        }
        if (this.state.cardPaymentView) {
            this.enterCartForPayment()
        }
        if (this.state.completeOrderView) {
            this.completeOrderView()
        }

    }


    rightItem = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <Image source={require('../assets/images/notificationIcon/ic_notification.png')} style={{ marginRight: 10 }} />
                </View>

                <View>
                    <Image source={require('../assets/images/messageIcon/ic_message.png')} />
                </View>
            </View>
        )
    }

    //shipping detaill view
    shippingDetails = () => {
        let userInfo = this.props && this.props.user ? this.props.user : null

        return (
            <View style={{ marginTop: 40, marginHorizontal: 20, paddingBottom: 120, }}>

                {
                    userInfo ?
                        null
                        :
                        <View>
                            <View>
                                <Text style={{ fontWeight: '600', fontSize: 14, fontWeight: 'bold' }}>{'Choose Account Type'}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>


                                <TouchableOpacity
                                    style={{ borderWidth: 1, borderColor: colors.appColor, borderRadius: 15, flexDirection: 'row', marginRight: 5, flex: 0.3, height: 32, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: this.state.individual ? colors.appColor : 'rgba(238,238,238,0.9)', justifyContent: 'center' }}
                                    onPress={() => this.setState({ individual: true, business: false, accountType: 'Individual' })}>

                                    <Image style={{ alignSelf: 'center' }} source={this.state.individual ? require('../assets/images/radioBusiness/ic_radio.png') : require('../assets/images/radioOff/ic_radio_off.png')} />
                                    <Text style={[styles.individualAndBusiness, { color: this.state.individual ? '#FFFFFF' : colors.appColor }]}>{' Individual'}</Text>

                                </TouchableOpacity>

                                <View style={{ flex: 0.1 }} />

                                <TouchableOpacity
                                    style={{ borderWidth: 1, borderColor: colors.appColor, borderRadius: 15, flexDirection: 'row', flex: 0.3, height: 32, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: this.state.business ? colors.appColor : 'rgba(238,238,238,0.9)', justifyContent: 'center' }}
                                    onPress={() => this.setState({ individual: false, business: true, accountType: 'Business' })}>

                                    <Image style={{ alignSelf: 'center' }} source={this.state.business ? require('../assets/images/radioBusiness/ic_radio.png') : require('../assets/images/radioOff/ic_radio_off.png')} />
                                    <Text style={[styles.individualAndBusiness, , { color: this.state.business ? '#FFFFFF' : colors.appColor }]}>{' Business'}</Text>

                                </TouchableOpacity>
                            </View>


                            {
                                this.state.business ?
                                    <View style={{ marignTop: 20 }}>
                                        <InputField
                                            inputMenthod={(input) => { this.buinessNameField = input }}
                                            placeholder={strings.buinessName}
                                            placeholderTextColor="rgba(62,62,62,0.55)"
                                            returnKeyType="next"
                                            keyboardType='default'
                                            autoCorrect={false}
                                            blurOnSubmit={false}
                                            autoCapitalize='none'
                                            maxlength={10}
                                            fontSize={14}
                                            value={this.state.companyName}
                                            viewTextStyle={[styles.viewTextStyle, { borderColor: '#C6C6C4' }]}
                                            isFocused={this.state.buinessNameFieldFocus}
                                            underlineColorAndroid='transparent'
                                            onFocus={() => this.setState({ buinessNameFieldFocus: true })}
                                            onBlur={() => this.setState({ buinessNameFieldFocus: false })}
                                            onChangeText={(companyName) => this.setState({ companyName })}
                                            onSubmitEditing={(event) => { this.trnNoField.focus() }}
                                        />


                                        <InputField
                                            inputMenthod={(input) => { this.trnNoField = input }}
                                            placeholder={strings.trnNo}
                                            placeholderTextColor="rgba(62,62,62,0.55)"
                                            // secureTextEntry={true}
                                            returnKeyType="done"
                                            keyboardType='default'
                                            autoCorrect={false}
                                            blurOnSubmit={false}
                                            autoCapitalize='none'
                                            maxlength={10}
                                            fontSize={14}
                                            value={this.state.trnNumber}
                                            viewTextStyle={[styles.viewTextStyle, { borderColor: '#C6C6C4' }]}
                                            isFocused={this.state.trnNoFieldFocus}
                                            underlineColorAndroid='transparent'
                                            onFocus={() => this.setState({ trnNoFieldFocus: true })}
                                            onBlur={() => this.setState({ trnNoFieldFocus: false })}
                                            onChangeText={(trnNumber) => this.setState({ trnNumber })}
                                            onSubmitEditing={(event) => { Keyboard.dismiss() }}
                                        />
                                    </View>



                                    :
                                    null
                            }



                            <View style={{ backgroundColor: colors.appColor, height: 0.5, marginTop: 20, marginBottom: 20 }} />
                        </View>

                }




                <View>
                    <Text style={{ fontWeight: '600', fontSize: 14, fontWeight: 'bold' }}>{'Choose Shipping Address'}</Text>
                </View>

                <View>
                    {this.state.shippingaddress.length ?

                        this.state.shippingaddress.map((item, index) => {

                            let countryToShow = null

                            if (item && item.country) {

                                countryToShow = this.state.allcountriesForFilter.find(function (element) {
                                    return element.code == item.country;
                                });
                                // console.log(countryToShow, "counttuAvailForSelling")
                            }

                            return (
                                item && item.first_name != "" ?
                                    <TouchableOpacity key={index} onPress={() => this.onSelectShipping(item, index)}>
                                        <View>
                                            <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                                <View style={{ flex: 0.05, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    {/* <TouchableOpacity onPress={() => this.onSelectShipping(item, index)}> */}
                                                    <Image
                                                        source={this.state.selectedShippingAddressIndex == index ?
                                                            require('../assets/images/radioOn/ic_radio_on.png')
                                                            :
                                                            require('../assets/images/radioOff/ic_radio_off.png')
                                                        } />

                                                    {/* </TouchableOpacity> */}
                                                </View>
                                                <View style={{ flex: 0.9, paddingLeft: 5, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    <Text style={{ fontSize: 14, color: colors.black, fontWeight: 'bold' }} numberOfLines={2}>
                                                        {`${item && item.first_name != '' ? item.first_name : ''} ${item && item.last_name != '' ? item.last_name : ''}`}
                                                    </Text>
                                                    <Text style={{ fontSize: 14, color: colors.lightfontColor }} numberOfLines={2}>
                                                        {`${item && item.company != '' ? item.company + ',' : ''} ${item && item.address_1 != '' ? item.address_1 + ',' : ''} ${item && item.address_2 != '' ? item.address_2 + ',' : ''} ${item && item.city != '' ? item.city + ',' : ''} ${item && item.state != '' ? item.state + ',' : ''}  ${item && item.postcode != '' ? item.postcode : ''} ${countryToShow && (countryToShow != undefined || countryToShow != null) ? countryToShow.name : ''} ${item && item.phone ? item.phone : ''}`}
                                                    </Text>

                                                </View>

                                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <TouchableOpacity onPress={() => this.deleteShipping(item)}>
                                                        <Image source={require('../assets/images/deleteGrey/ic_delete.png')} />

                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ backgroundColor: colors.lightBlack, height: 0.5, marginTop: 10 }} />
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    null
                            )
                        })

                        :
                        null}
                </View>


                {
                    !userInfo && this.state.shippingaddress.length ?
                        null
                        :

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddNewBillingAndShipping', { title: 'Shipping Address', key: 'shipping', shippingBillingArray: this.state.shippingaddress, getShippingOrBillingInfo: (value) => this.getUserInfoForBillingAndShipping(value) })}>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Image source={require('../assets/images/locationGreen/ic_location_green.png')} />
                                <Text style={{ color: colors.appColor, fontSize: 14, fontWeight: 'bold', paddingLeft: 10 }}>
                                    {/* {item && item.company != '' ? item.company + ',' : ''} ${item && item.address_1 != '' ? item.address_1 + ',' : ''} ${item && item.address_2 != '' ? item.address_2 + ',' : ''} ${item && item.city != '' ? item.city + ',' : ''} ${item && item.state != '' ? item.state + ',' : ''}  ${item && item.postcode != '' ? item.postcode : ''} ${item && item.country != '' ? item.country : ''} `} */}

                                    {'Add New Address'}

                                </Text>


                            </View>

                        </TouchableOpacity>
                }



                <View style={{ backgroundColor: colors.appColor, height: 0.5, marginTop: 20 }} />

                {/* //BIlling info */}


                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: '600', fontSize: 14, fontWeight: 'bold' }}>{'Choose billing Address'}</Text>
                </View>

                <View>
                    {this.state.billingaddress.length ?

                        this.state.billingaddress.map((item, index) => {

                            let countryToShow = null

                            if (item && item.country) {

                                countryToShow = this.state.allcountriesForFilter.find(function (element) {
                                    return element.code == item.country;
                                });
                                // console.log(countryToShow, "counttuAvailForSelling")
                            }

                            return (
                                item && item.first_name != "" ?
                                    <TouchableOpacity key={index} onPress={() => this.onSelectBilling(item, index)}>
                                        <View>
                                            <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                                <View style={{ flex: 0.05, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    {/* <TouchableOpacity onPress={() => this.onSelectShipping(item, index)}> */}
                                                    <Image
                                                        source={this.state.selectedbillingAddressIndex == index ?
                                                            require('../assets/images/radioOn/ic_radio_on.png')
                                                            :
                                                            require('../assets/images/radioOff/ic_radio_off.png')
                                                        } />

                                                    {/* </TouchableOpacity> */}
                                                </View>
                                                <View style={{ flex: 0.9, paddingLeft: 5, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    <Text style={{ fontSize: 14, color: colors.black, fontWeight: 'bold' }} numberOfLines={2}>
                                                        {`${item && item.first_name != '' ? item.first_name : ''} ${item && item.last_name != '' ? item.last_name : ''}`}
                                                    </Text>
                                                    <Text style={{ fontSize: 14, color: colors.lightfontColor }} numberOfLines={2}>
                                                        {`${item && item.company != '' ? item.company + ',' : ''} ${item && item.address_1 != '' ? item.address_1 + ',' : ''} ${item && item.address_2 != '' ? item.address_2 + ',' : ''} ${item && item.city != '' ? item.city + ',' : ''} ${item && item.state != '' ? item.state + ',' : ''}  ${item && item.postcode != '' ? item.postcode : ''} ${countryToShow && (countryToShow != undefined || countryToShow != null) ? countryToShow.name : ''} ${item && item.phone ? item.phone : ''}`}
                                                    </Text>

                                                </View>

                                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <TouchableOpacity onPress={() => this.deleteBilling(item)}>
                                                        <Image source={require('../assets/images/deleteGrey/ic_delete.png')} />

                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ backgroundColor: colors.lightBlack, height: 0.5, marginTop: 10 }} />
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    null
                            )
                        })

                        :
                        null}
                </View>



                {
                    !userInfo && this.state.billingaddress.length ?
                        null
                        :

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddNewBillingAndShipping', { title: 'Billing Address', key: 'billing', shippingBillingArray: this.state.billingaddress, getShippingOrBillingInfo: (value) => this.getUserInfoForBillingAndShipping(value) })}>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Image source={require('../assets/images/locationGreen/ic_location_green.png')} />
                                <Text style={{ color: colors.appColor, fontSize: 14, fontWeight: 'bold', paddingLeft: 10 }}>
                                    {/* {item && item.company != '' ? item.company + ',' : ''} ${item && item.address_1 != '' ? item.address_1 + ',' : ''} ${item && item.address_2 != '' ? item.address_2 + ',' : ''} ${item && item.city != '' ? item.city + ',' : ''} ${item && item.state != '' ? item.state + ',' : ''}  ${item && item.postcode != '' ? item.postcode : ''} ${item && item.country != '' ? item.country : ''} `} */}

                                    {'Add New Address'}

                                </Text>


                            </View>

                        </TouchableOpacity>
                }


                <View style={{ backgroundColor: colors.appColor, height: 0.5, marginTop: 20 }} />







                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: '600', fontSize: 14, fontWeight: 'bold' }}>{'Choose Delivery options'}</Text>
                </View>

                <View>
                    {this.state.deliveryOptions.length ?

                        this.state.deliveryOptions.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => this.onSelectDeliveryOption(item, index)}>
                                    <View>
                                        <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                            <View style={{ flex: 0.05, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <Image
                                                    source={this.state.selectedDeliveryOptionIndex == index ?
                                                        require('../assets/images/radioOn/ic_radio_on.png')
                                                        :
                                                        require('../assets/images/radioOff/ic_radio_off.png')
                                                    } />


                                            </View>
                                            <View style={{ flex: 0.9, flexDirection: 'row' }}>
                                                <View style={{ flex: 0.8, paddingLeft: 5, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    <Text style={{ fontSize: 14, color: colors.lightfontColor }} numberOfLines={3}>{item.description}</Text>

                                                </View>
                                                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <Text style={{ fontSize: 12, color: colors.appColor }}>{`AED ${Number(item.chargableAmount).toFixed(2)}`}</Text>
                                                </View>
                                            </View>


                                        </View>
                                        <View style={{ backgroundColor: colors.lightBlack, height: 0.5, marginTop: 10 }} />
                                    </View>
                                </TouchableOpacity>

                            )
                        })
                        :
                        null}
                </View>


            </View>

        )
    }


    paymentMethods = () => {
        let userInfo = this.props && this.props.user ? this.props.user : null

        return (
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <View>
                    <Text style={{ fontWeight: '600', fontSize: 14, fontWeight: 'bold' }}>{'Choose Payment Option'}</Text>
                </View>

                {this.state.paymentOptions.length ?

                    this.state.paymentOptions.map((item, index) => {
                        return (
                            !userInfo && item.id == 'wallet_gateway' ?
                                <View />
                                :

                                <View key={index}>
                                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flex: 0.15 }} />
                                        <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ slectedPaymentMethod: item, slectedPaymentMethodIndex: index })}>
                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image source={item.image} />
                                                    <View style={{ height: 5 }} />
                                                    <Text style={{ fontSize: 12 }}>{item.title.toUpperCase()}</Text>
                                                </View>

                                            </TouchableOpacity>


                                        </View>
                                        <View style={{ flex: 0.15, marginLeft: 0 }}>
                                            {
                                                this.state.slectedPaymentMethodIndex == index ?
                                                    <Image source={require('../assets/images/tickRight/ic_arrow_bold.png')} />
                                                    :
                                                    null
                                            }
                                        </View>



                                    </View>
                                    <View style={{ marginTop: 15, height: 0.9, backgroundColor: '#D9D9D9' }} />

                                </View>
                        )
                    })
                    :
                    null


                }
                {/* <View style={{marginBottom:100,backgroundColor:'red'}}/> */}
            </View>
        )
    }

    cardPaymentView = () => {
        return (
            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
                <View>
                    <Text style={{ fontWeight: '600', fontSize: 14, fontWeight: 'bold' }}>{'Enter Card Details'}</Text>
                    <View style={{ marginTop: 30, }}>
                        <Text style={{ color: 'grey', fontSize: 14 }}>{'Enter card number'}</Text>
                        <TextInput
                            ref={(ref) => { this.cardNumber = ref; }}
                            style={{ height: 35, fontSize: 14 }}
                            value={this.state.cardNumber}
                            onChangeText={(text) => this.setState({ cardNumber: text })}
                            keyboardType={'numeric'}
                            onSubmitEditing={(event) => this.monthYear.focus()}

                        />
                    </View>
                    <View style={{ height: 0.5, backgroundColor: 'grey', }} />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 30, }}>
                    <View style={{ flex: 0.5 }}>
                        <Text style={{ color: 'grey', fontSize: 14 }}>{'MM/YY'}</Text>


                        <TextInput
                            ref={(ref) => { this.monthYear = ref; }}
                            value={this.state.monthYear}
                            onChangeText={(text) => this.setState({ monthYear: text })}
                            keyboardType={'numeric'}
                            style={{ height: 35, fontSize: 14 }}
                            onSubmitEditing={(event) => this.cvvNumber.focus()}
                        />

                        <View style={{ height: 0.5, backgroundColor: 'grey', }} />
                    </View>
                    <View style={{ width: 20, height: 35 }} />
                    <View style={{ flex: 0.5 }}>
                        <Text style={{ color: 'grey', fontSize: 14 }}>{'CVV number'}</Text>

                        <TextInput
                            ref={(ref) => { this.cvvNumber = ref; }}
                            value={this.state.cvvNumber}
                            onChangeText={(text) => this.setState({ cvvNumber: text })}
                            keyboardType={'numeric'}
                            style={{ height: 35, fontSize: 14, }}
                            onSubmitEditing={(event) => Keyboard.dismiss()}
                        />

                        <View style={{ height: 0.5, backgroundColor: 'grey', }} />
                    </View>


                </View>



            </View>
        )
    }

    //coupon code after submission
    afterSubmitCoupon = (event) => {
        // console.log(this.state.couponCode, "couponCode")
        console.log(this.props.allCoupons, "this.props.allCoupon")
        debugger
        let existCode = false
        if (this.state.couponCode) {
            for (let i = 0; i < this.props.allCoupons.length; i++) {
                console.log(this.props.allCoupons[i].code, "this.props.allCoupons[0].code")
                if (this.props.allCoupons[i].code == this.state.couponCode) {
                    console.log("here")
                    existCode = true
                    break
                }
            }

            if (existCode) {


                console.log(existCode, "existCode-----existCode")

                let dataFindForCoupon = this.props.allCoupons.find(item => item.code == this.state.couponCode)
                console.log("dataFindForCoupon", dataFindForCoupon)

                var unixTimestamp = moment().unix();
                console.log(unixTimestamp, "unixTimestamp")

                var unixTimestampCoupon = moment(dataFindForCoupon.date_expires_gmt).unix();
                console.log(unixTimestampCoupon, "unixTimestampCoupon")

                if (unixTimestamp > unixTimestampCoupon) {

                    this.setState({
                        retrieveCouponsInfo: null,
                        couponMessage: 'Coupon date has expired',
                        error: true,
                    })
                    // this.selectWishList(value)
                    Keyboard.dismiss()

                }
                else {
                    let { params } = this.props.navigation.state

                    console.log(params.cartData.lineItems, " params.cartData.lineItems")

                    let sellItemExist = null
                    sellItemExist = params.cartData.lineItems.find(x => x.on_sale == true)
                    console.log(sellItemExist, "sellItemExist")
                    if (sellItemExist && dataFindForCoupon.exclude_sale_items) {
                        this.setState({
                            retrieveCouponsInfo: null,
                            couponMessage: "You can't be apply coupon on sale products",
                            error: true,
                        })
                    }
                    else {

                        if (dataFindForCoupon.usage_limit != null && dataFindForCoupon.usage_limit == dataFindForCoupon.usage_count) {
                            console.log("Already used")
                            this.setState({
                                retrieveCouponsInfo: null,
                                couponMessage: 'coupon usage reached',
                                error: true,
                            })
                        } else {


                            let { user } = this.props
                            let userAlreayUsed = null
                            let userCount = 0

                            for (let m = 0; m < dataFindForCoupon.used_by.length; m++) {
                                debugger
                                if (dataFindForCoupon.used_by[m] == JSON.stringify(user.id) || (dataFindForCoupon.used_by[m] == user.email)) {
                                    debugger
                                    userCount += 1
                                }
                            }
                            console.log("userCount -----userCount", userCount)
                            console.log(userCount, "count")

                            // usage_limit_per_user

                            userAlreayUsed = dataFindForCoupon.used_by.find((itm) => {

                                if ((itm == JSON.stringify(user.id) || (itm == user.email)) && (dataFindForCoupon.usage_limit_per_user == userCount || userCount > dataFindForCoupon.usage_limit_per_user)) {
                                    return true
                                }

                            })

                            console.log(userAlreayUsed, "userAlreayUsed")


                            if (userAlreayUsed) {
                                console.log("Already used")
                                this.setState({
                                    retrieveCouponsInfo: null,
                                    couponMessage: 'coupon usage reached',
                                    error: true,
                                })

                            } else {

                                let retrieveCouponsInfo = this.props.allCoupons.find(item => item.code == this.state.couponCode)




                                if (retrieveCouponsInfo) {
                                    console.log("retrieveCouponsInfo", retrieveCouponsInfo)
                                    this.setState({
                                        retrieveCouponsInfo: retrieveCouponsInfo,
                                        couponMessage: `You get the discount of ${retrieveCouponsInfo.amount} %`,
                                        error: false,
                                    })
                                    Keyboard.dismiss()
                                }
                                else {
                                    this.setState({
                                        retrieveCouponsInfo: null,
                                        couponMessage: '',
                                        error: false,
                                    })
                                    console.log("retrieveCouponsInfo ...no data", this.state.retrieveCouponsInfo)
                                    // this.selectWishList(value)
                                    Keyboard.dismiss()
                                }
                            }
                        }

                    }

                }


            } else {
                this.setState({
                    retrieveCouponsInfo: null,
                    couponMessage: 'coupon code is not valid',
                    error: true,
                })
                // console.log("retrieveCouponsInfo ...no data", this.state.retrieveCouponsInfo)
                // this.selectWishList(value)
                // Keyboard.dismiss()
            }


        }
    }

    //Complte order View
    completeOrderView = () => {
        let { params } = this.props.navigation.state
        return (
            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
                <Text>{this.state.slectedPaymentMethod.title}</Text>
                <View>
                    {
                        this.props.user ?
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 30 }}>
                                <View style={{ alignItems: 'flex-start', justifyContent: 'center', flex: 0.4 }}><Text style={{ fontSize: 14, color: colors.lightfontColor }}>{'Have a coupon?'}</Text></View>
                                <View style={{ flex: 0.6, height: 45, borderColor: colors.lightfontColor, borderWidth: 1 }}>
                                    <TextInput
                                        ref={input => this.inputref = input}
                                        value={this.state.couponCode}
                                        placeholder={'Enter Coupon Code Here'}
                                        onChangeText={(value) => this.setState({ couponCode: value }, () => {
                                            if (this.state.couponCode == '') {
                                                this.setState({
                                                    // retrieveCouponsInfo: this.state.couponCode,
                                                    couponMessage: '',
                                                    error: false,
                                                })
                                            }
                                        })}
                                        onChange={(event) => this.setState({ couponCode: event.nativeEvent.text }, () => {
                                            this.afterSubmitCoupon(event)
                                        })}
                                        keyboardType={'default'}
                                        autoCapitalize={'none'}

                                        onBlur={(event) => this.afterSubmitCoupon(event)}
                                        style={{ fontSize: 12, color: colors.lightfontColor, height: 45, paddingLeft: 5 }}
                                        onSubmitEditing={(event) => this.afterSubmitCoupon(event)}
                                    />
                                    {/* <Text>{'AED 220.00'}</Text> */}
                                </View>

                            </View>

                            :
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 30 }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Auth')}>
                                    <View>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.appColor, textDecorationLine: 'underline', }}>Want to use coupon code? Click here to create an account and login to the app</Text>

                                    </View>
                                </TouchableOpacity>

                            </View>
                    }

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 5 }}>
                        <Text style={{ color: this.state.error ? 'red' : colors.appColor, fontWeight: 'bold' }}>{this.state.couponMessage}</Text>
                    </View>
                </View>
                {/* // } */}


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ alignItems: 'flex-start', flex: 0.5 }}><Text style={{ fontSize: 14, color: 'black' }}>Sub total</Text></View>
                    <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>AED {params && params.cartData.totalAmount ? params.cartData.totalAmount : ''}</Text></View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ alignItems: 'flex-start', flex: 0.5 }}><Text style={{ fontSize: 14, color: colors.lightfontColor }}>Discount</Text></View>

                    {
                        this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ?
                            <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>-AED {this.state.retrieveCouponsInfo ? Number(this.state.retrieveCouponsInfo.amount * ((Number(params.cartData.totalAmount) / 100))).toFixed(2) : '0.00'}</Text></View>

                            :

                            <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>AED 0.00</Text></View>

                    }
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ alignItems: 'flex-start', flex: 0.5 }}><Text style={{ fontSize: 14, color: colors.lightfontColor }}>VAT</Text></View>
                    <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>AED {params && params.cartData.totalVat ? Number(params.cartData.totalVat).toFixed(2) : '0.00'}</Text></View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ alignItems: 'flex-start', flex: 0.7 }}><Text style={{ fontSize: 14, color: 'black' }} >Shippping : <Text style={{ fontSize: 14, color: colors.lightfontColor }}>{this.state.selectedDeliveryOption.title}</Text></Text></View>
                    <View style={{ alignItems: 'flex-end', flex: 0.3 }}><Text>AED {this.state.selectedDeliveryOption ? Number(this.state.selectedDeliveryOption.chargableAmount).toFixed(2) : ''}</Text></View>
                </View>
                <View style={{ height: 0.7, backgroundColor: colors.lightfontColor, marginBottom: 10 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ alignItems: 'flex-start', flex: 0.7 }}><Text style={{ fontSize: 14, color: colors.appColor }} >Total Amount<Text style={{ fontSize: 14, color: colors.lightfontColor }}>(including VAT)</Text></Text></View>
                    <View style={{ alignItems: 'flex-end', flex: 0.3 }}>

                        {
                            this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ?
                                <Text style={{ color: colors.appColor, fontWeight: 'bold' }}>
                                    AED {(Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount) - Number(this.state.retrieveCouponsInfo.amount * ((Number(params.cartData.totalAmount) / 100)))).toFixed(2)}
                                </Text>
                                :
                                <Text style={{ color: colors.appColor, fontWeight: 'bold' }}>
                                    AED {(Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount)).toFixed(2)}
                                </Text>
                        }

                    </View>
                </View>
            </View>)
    }


    //OrderComplete view
    orderComplete = () => {
        let { params } = this.props.navigation.state
        return (
            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={this.state.orderCompleteData && this.state.orderCompleteData.status == 'processing' ? require('../assets/images/orderRecieved/ic_order.png') : require('../assets/images/orderRecieved/ic_cross_2.png')} />
                    <View style={{ height: 10 }} />
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.black, textAlign: 'center', alignSelf: 'center' }}>
                            {
                                this.state.orderCompleteData && this.state.orderCompleteData.status == 'processing' ?

                                    'Thank you for placing the order!'
                                    :
                                    'Your order is not placed successfully \n something went wrong with the payment process.'


                            }
                        </Text>
                    </View>

                    {this.state.orderCompleteData && this.state.orderCompleteData.status == 'processing' ?

                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.black }}>{'Your order number is '}<Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.appColor }}>{this.state.orderCompleteData ? this.state.orderCompleteData.number : ''}</Text></Text>
                        : null
                    }


                </View>

                {
                    this.state.orderCompleteData && this.state.orderCompleteData.status == 'processing' ?

                        <View>
                            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <View style={{ alignItems: 'flex-start', flex: 0.5 }}><Text style={{ fontSize: 14, color: colors.lightfontColor }}>Ordered on</Text></View>
                                    <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>{moment(new Date(this.state.orderCompleteData.date_created_gmt)).format('LL')}</Text></View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <View style={{ alignItems: 'flex-start', flex: 0.5 }}><Text style={{ fontSize: 14, color: colors.lightfontColor }}>Estimated Delivery</Text></View>
                                    <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>{'3 Business Days'}</Text></View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <View style={{ alignItems: 'flex-start', flex: 0.5 }}><Text style={{ fontSize: 14, color: colors.lightfontColor }}>Payment method</Text></View>
                                    <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>{this.state.slectedPaymentMethod ? this.state.slectedPaymentMethod.title : ''}</Text></View>
                                </View>


                                <View style={{ height: 0.5, backgroundColor: colors.lightfontColor, marginBottom: 12 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <View style={{ alignItems: 'flex-start', flex: 0.7 }}><Text style={{ fontSize: 14, color: colors.appColor }} >Total Amount<Text style={{ fontSize: 14, color: colors.lightfontColor }}> (Inc. VAT)</Text></Text></View>
                                    <View style={{ alignItems: 'flex-end', flex: 0.3 }}><Text style={{ color: colors.appColor, fontWeight: 'bold' }}>
                                        AED {this.state.orderCompleteData ? Number(this.state.orderCompleteData.total).toFixed(2) : ''}</Text>

                                        {/* // (Number(this.state.orderCompleteData.total) + Number(this.state.orderCompleteData.total_tax) + Number(this.state.orderCompleteData.shipping_total)).toFixed(2) : ''}</Text> */}
                                    </View>
                                </View>
                                <View style={{ height: 0.5, backgroundColor: colors.lightfontColor, marginBottom: 10 }} />

                            </View>


                        </View>
                        :
                        null

                }
                <TouchableOpacity onPress={() =>
                    params && params.cartData && params.cartData.fromOrderPage ?
                        this.props.navigation.navigate('OrderDetailScreen2', { orderId: this.state.orderCompleteData ? this.state.orderCompleteData.number : null })
                        :
                        this.state.orderCompleteData && this.state.orderCompleteData.status == 'pending' ?
                            this.props.navigation.navigate('OrderDetailScreen', {
                                orderId: this.state.orderCompleteData ? this.state.orderCompleteData.number : null,
                                setToShipping: () => this.setToShipping()
                            })

                            :

                            this.props.navigation.navigate('OrderDetailScreen', { orderId: this.state.orderCompleteData ? this.state.orderCompleteData.number : null })}
                    style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <View>
                        <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18, color: colors.appColor }}>{'Click here for complete order details'}</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ height: 100 }} />

                {/* <View style={{ height: 0.5, backgroundColor: colors.lightfontColor, marginBottom: 10 }} /> */}

            </View>
        )
    }


    setToShipping = () => {
        this.setState({
            shippingDetails: true,
            shippingSelectedBar: true,
            paymentSelectedBar: false,
            completeSelectedBar: false,
            paymentMethods: false,
            cardPaymentView: false,
            completeOrderView: false,
            orderComplete: false,

        })
    }

    //back button functionality

    backButtonFunctionality = () => {

        let { params } = this.props.navigation.state

        if (this.state.shippingDetails) {
            this.props.navigation.goBack()
        }
        if (this.state.paymentMethods) {
            this.setState({
                paymentMethods: false,
                shippingDetails: true,
                shippingSelectedBar: true,
                paymentSelectedBar: false

            })
        }

        if (this.state.cardPaymentView) {
            this.setState({
                paymentMethods: true,
                cardPaymentView: false,
                shippingSelectedBar: true,
                paymentSelectedBar: true

            })
        }

        if (this.state.completeOrderView) {
            this.setState({
                paymentMethods: true,
                completeOrderView: false,
                shippingSelectedBar: true,
                paymentSelectedBar: true,
                completeSelectedBar: false

            })
        }
        if (this.state.orderComplete) {

            if (params && params.cartData && params.cartData.fromOrderPage) {
                this.props.navigation.navigate('app')
            } else {
                this.props.navigation.goBack()
            }


            // this.setState({
            //     paymentMethods: false,
            //     completeOrderView: false,
            //     shippingDetails: true,
            //     shippingSelectedBar: true,
            //     paymentSelectedBar: false,
            //     completeSelectedBar: false
            // },()=>{
            //     this.props.navigation.goBack()

            // })
        }




    }


    //update placed order on admin side
    upadteOrderPlacedOnAdmin = (data) => {

        let userInfo = this.props && this.props.user ? this.props.user : null

        // if (userInfo) {
        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${this.props.userTokenAdmin}`
            }
        }
        debugger
        return axios.post(`${upadteOrderPlacedOnAdmin}`, data, header).then((res) => {
            if (res && res.status == 200) {
                debugger
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })
        // } else {
        //     return true
        // }

    }


    //update wallet after payment
    updateWalletAfterPayment = (order_id, amount) => {

        let { params } = this.props.navigation.state
        let userInfo = this.props && this.props.user ? this.props.user : null

        debugger
        let totalAmountAfterdeduction = Number(this.props.userWalletAmount) - Number(amount)
        debugger
        // this.setState({visible:true})
        return axios.post(`${walletUrl}user/update/${userInfo.id}?key=${key}&sec=${sec}`, { "order_id": order_id, "amount": totalAmountAfterdeduction }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res && res.status == 200) {
                console.log("sucess after order", res)
                // this.props.productActions.saveWalletAmountForUser({ userWalletAmount: res.data[0].amount, })
                // this.setState({ tableData: officersIds,visible:false })
                debugger
            }
            else {
                console.log("error after order", res)
                // this.setState({ tableData: [],visible:false })
            }
        }).catch((err) => {
            debugger
            console.log("error after order", res)
            // this.setState({ tableData: [],visible:false })
        })

    }


    //get the users wallet amount
    getUserWalletAmount = () => {

        let userInfo = this.props.user ? this.props.user : null

        debugger
        // this.setState({visible:true})
        return axios.get(`${walletUrl}user/${userInfo.id}?key=${key}&sec=${sec}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res && res.status == 200) {
                console.log("Wallet amount for user", res)
                this.props.productActions.saveWalletAmountForUser({ userWalletAmount: res.data[0].amount, })
                // this.setState({ tableData: officersIds,visible:false })
                debugger
            }
            else {
                // this.setState({ tableData: [],visible:false })
            }
        }).catch((err) => {
            debugger
            // this.setState({ tableData: [],visible:false })
        })
    }

    //get wallet history of user
    getWalletHistory = () => {

        let userInfo = this.props.user ? this.props.user : null

        debugger
        // this.setState({visible:true})
        return axios.get(`${walletUrl}history/user/${userInfo.id}?key=${key}&sec=${sec}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res && res.status == 200) {
                var officersIds = [];
                res.data.forEach(function (item) {
                    officersIds.push([
                        `${item.order_id != 0 ? '#' + item.order_id : '_'}`,
                        `AED ${item.before_amount}`,
                        `AED ${item.after_amount}`,
                        moment(item.added_on).format('DD-MM-YY'),
                        `${item.order_id != 0 ? 'Debit' : 'Credit'}`
                    ]);
                });
                debugger
                this.props.productActions.saveWalletUsage({ allwalletUsage: officersIds, })

                // this.setState({ tableData: officersIds,visible:false })
                debugger
            }
            else {
                // this.setState({ tableData: [],visible:false })
            }
        }).catch((err) => {
            debugger
            // this.setState({ tableData: [],visible:false })
        })

    }

    getAddAmountArray = () => {
        // this.setState({ visible: true })
        return this.props.productActions.getAllProductsCategory({ page: 1, slug: 'wallet' }).then((res) => {
            debugger
            if (res && res.status == 200) {
                console.log(res.data)
                let data = {
                    category: res.data[0].id,
                    page: 1,
                    per_page: 20,
                    status: 'publish'
                }
                this.props.productActions.getAllProducts(data).then((response) => {

                    // console.log('get all products listing', res)
                    if (response && response.status == 200) {
                        debugger
                        console.log("response", response.data)
                        this.props.productActions.setWalletAmount({ allwalletAmounts: response.data, })


                    } else {

                        // this.setState({ visible: false, })

                    }
                }).catch((err) => {
                    //
                    // this.setState({ visible: false })
                })


            }
            else {
                // this.setState({ visible: false })

            }
        }).catch((err) => {
            // this.setState({ visible: false })
        })
    }


    //Place order using  wallet

    placeOrderUsingWallet = () => {
        this.setState({ visible: true })
        let { params } = this.props.navigation.state

        let newData = cloneDeep(params.cartData.lineItems)
        let lineItems = newData.map((item, index) => {
            return {

                "product_id": item.id,
                "quantity": item.quantity

            }
        })

        let userInfo = this.props && this.props.user ? this.props.user : null
        let data = {
            "customer_id": userInfo ? userInfo.id : 0,
            "payment_method": this.state.slectedPaymentMethod.id,
            "payment_method_title": this.state.slectedPaymentMethod.title,
            "set_paid": true,
            "status": "processing",
            "billing": this.state.selectedbillingAddress,
            "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
            "line_items": lineItems ? lineItems : [],
            "shipping_lines": this.state.selectedDeliveryOption ? [
                {
                    "method_id": this.state.selectedDeliveryOption.id,
                    "method_title": this.state.selectedDeliveryOption.title,
                    "total": this.state.selectedDeliveryOption.chargableAmount,
                }
            ] : [],
            // "coupon_lines": this.state.retrieveCouponsInfo ? [{
            //     "code": this.state.retrieveCouponsInfo.code
            // }] : [],

            "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                "code": this.state.retrieveCouponsInfo.code
            }] : [],
            'meta_data': [
                {
                    "key": "select",
                    "value": this.state.accountType
                },
                {
                    "key": "company-name",
                    "value": this.state.companyName
                },
                {
                    "key": "trn-number",
                    "value": this.state.trnNumber
                },
                {
                    "key": "sap_order_id",
                    "value": ""
                },
                {
                    "key": "sap_delivery_id",
                    "value": ""
                },
                {
                    "key": "delivery_driver",
                    "value": ""
                },
                {
                    "key": "delivery_date",
                    "value": this.state.newdate
                },
                {
                    "key": "priority",
                    "value": "Normal"
                },

            ]

        }
        console.log(data, "payment data to send")
        console.log(JSON.stringify(data))
        debugger

        // let { params } = this.props.navigation.state

        if (params && params.cartData && params.cartData.fromOrderPage) {
            this.props.orderActions.updateOrder(JSON.parse(params.cartData.number), {
                "status": "processing",
                "payment_method": this.state.slectedPaymentMethod.id,
                "payment_method_title": this.state.slectedPaymentMethod.title,
                "customer_id": userInfo ? userInfo.id : 0,
                "billing": this.state.selectedbillingAddress,
                "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                "shipping_lines": this.state.selectedDeliveryOption ? [
                    {
                        "method_id": this.state.selectedDeliveryOption.id,
                        "method_title": this.state.selectedDeliveryOption.title,
                        "total": this.state.selectedDeliveryOption.chargableAmount,
                    }
                ] : [],
                "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                    "code": this.state.retrieveCouponsInfo.code
                }] : [],
                'meta_data': [
                    {
                        "key": "select",
                        "value": this.state.accountType
                    },
                    {
                        "key": "company-name",
                        "value": this.state.companyName
                    },
                    {
                        "key": "trn-number",
                        "value": this.state.trnNumber
                    },
                    {
                        "key": "sap_order_id",
                        "value": ""
                    },
                    {
                        "key": "sap_delivery_id",
                        "value": ""
                    },
                    {
                        "key": "delivery_driver",
                        "value": ""
                    },
                    {
                        "key": "delivery_date",
                        "value": this.state.newdate
                    },
                    {
                        "key": "priority",
                        "value": "Normal"
                    },

                ]

            }).then((res) => {

                let order_data_admin = {
                    "user_id": userInfo.id,
                    "order_id": res.data.id,
                    "order_amount": res.data.total
                }
                debugger

                Promise.all([
                    this.upadteOrderPlacedOnAdmin(order_data_admin),
                    this.updateWalletAfterPayment(res.data.id, res.data.total)
                ]).then(() => {
                    debugger

                    Promise.all([
                        this.getAddAmountArray(),
                        this.getWalletHistory(),
                        this.getUserWalletAmount(),
                        this.getAllOrders(),
                        this.getAllCoupons()

                    ]).then(() => {
                        setTimeout(() => {
                            this.setState({
                                orderComplete: true,
                                completeOrderView: false,
                                visible: false,
                                orderCompleteData: res.data,
                                retrieveCouponsInfo: null
                            })
                        }, (1500));
                    }).catch((error) => {
                        console.log("errror 2", error)
                        setTimeout(() => {
                            this.setState({
                                orderComplete: true,
                                completeOrderView: false,
                                visible: false,
                                orderCompleteData: res.data,
                                retrieveCouponsInfo: null
                            })
                        }, (1500));
                    })

                    // this.inputref.clear()

                }).catch((error) => {
                    Promise.all([
                        this.getAddAmountArray(),
                        this.getWalletHistory(),
                        this.getUserWalletAmount(),
                        this.getAllOrders(),
                        this.getAllCoupons()

                    ]).then(() => {
                        setTimeout(() => {
                            this.setState({
                                orderComplete: true,
                                completeOrderView: false,
                                visible: false,
                                orderCompleteData: res.data,
                                retrieveCouponsInfo: null
                            })
                        }, (1500));
                    }).catch((error) => {
                        console.log("errror 3", error)
                        setTimeout(() => {
                            this.setState({
                                orderComplete: true,
                                completeOrderView: false,
                                visible: false,
                                orderCompleteData: res.data,
                                retrieveCouponsInfo: null
                            })
                        }, (1500));
                    })
                })
            }).catch((err3) => {
                this.setState({
                    visible: false,
                    retrieveCouponsInfo: null
                })
                // this.upadteCartAndWalletThings(res3)

                // this.setState({ visible: false })   
            })

        }
        else {

            this.props.orderActions.createOrder(data).then((res) => {
                debugger

                if (res && (res.status == 200 || res.status == 201)) {
                    this.props.cartActions.clearCart(this.props.user).then((res2) => {
                        if (res2 && (res2.status == 200 || res2.status == 201)) {

                            let order_data_admin = {
                                "user_id": userInfo.id,
                                "order_id": res.data.id,
                                "order_amount": res.data.total
                            }
                            // let noteData = {
                            //     note: 'Payment successful.'
                            // }

                            Promise.all([
                                this.upadteOrderPlacedOnAdmin(order_data_admin),
                                this.updateWalletAfterPayment(res.data.id, res.data.total)
                            ]).then(() => {
                                debugger
                                this.props.cartActions.setAllCartItems(0)
                                this.props.cartActions.setAllCartItemsData([])
                                this.props.cartActions.setAllCartItemsTotalAmount({
                                    "totalAmount": 0,
                                    "totalVat": 0,
                                })
                                Promise.all([
                                    this.getAddAmountArray(),
                                    this.getWalletHistory(),
                                    this.getUserWalletAmount(),
                                    this.getAllOrders(),
                                    this.getAllCoupons()

                                ]).then(() => {
                                    setTimeout(() => {
                                        this.setState({
                                            orderComplete: true,
                                            completeOrderView: false,
                                            visible: false,
                                            orderCompleteData: res.data,
                                            retrieveCouponsInfo: null
                                        })
                                    }, (1500));
                                }).catch((error) => {
                                    console.log("errror 2", error)
                                    setTimeout(() => {
                                        this.setState({
                                            orderComplete: true,
                                            completeOrderView: false,
                                            visible: false,
                                            orderCompleteData: res.data,
                                            retrieveCouponsInfo: null
                                        })
                                    }, (1500));
                                })

                                // this.inputref.clear()

                            }).catch((error) => {
                                debugger
                                // this.inputref.clear()
                                this.props.cartActions.setAllCartItems(0)
                                this.props.cartActions.setAllCartItemsData([])
                                this.props.cartActions.setAllCartItemsTotalAmount({
                                    "totalAmount": 0,
                                    "totalVat": 0,
                                })
                                Promise.all([
                                    this.getAddAmountArray(),
                                    this.getWalletHistory(),
                                    this.getUserWalletAmount(),
                                    this.getAllOrders(),
                                    this.getAllCoupons()

                                ]).then(() => {
                                    setTimeout(() => {
                                        this.setState({
                                            orderComplete: true,
                                            completeOrderView: false,
                                            visible: false,
                                            orderCompleteData: res.data,
                                            retrieveCouponsInfo: null
                                        })
                                    }, (1500));
                                }).catch((error) => {
                                    console.log("errror 3", error)
                                    setTimeout(() => {
                                        this.setState({
                                            orderComplete: true,
                                            completeOrderView: false,
                                            visible: false,
                                            orderCompleteData: res.data,
                                            retrieveCouponsInfo: null
                                        })
                                    }, (1500));
                                })
                            })

                        }
                        else {
                            debugger
                            // this.inputref.clear()
                            this.setState({
                                visible: false,
                                retrieveCouponsInfo: null
                            })
                        }

                    }).catch((err2) => {
                        debugger
                        // this.inputref.clear()
                        this.setState({
                            visible: false,
                            retrieveCouponsInfo: null
                        })
                    })

                }
                else {
                    console.log("res from server", res)
                    debugger
                    if (res && res.data && res.data.message) {
                        // this.inputref.clear()
                        this.setState({
                            couponMessage: res.data.message,
                            error: true,
                            visible: false,
                            retrieveCouponsInfo: null
                        })
                    } else {
                        // this.inputref.clear()
                        this.setState({
                            visible: false,
                            error: false,
                            retrieveCouponsInfo: null
                        })
                    }

                    // ToastMessage("Something went wrong")
                }
            }).catch((err) => {
                debugger
                // this.inputref.clear()
                this.setState({
                    visible: false,
                    error: false,
                    retrieveCouponsInfo: null
                })
                // ToastMessage(JSON.string(err))
            })
        }

    }


    updateNotesData = (orderId, data) => {
        this.props.orderActions.updateNotes(orderId, data).then((res) => {
            if (res && res.data == 200) {
                console.log('Note update successfully', res)
            } else {
                console.log(res, "rsomec eslo")
            }
        }).catch((err) => {
            console.log(err.response, "order notes error")
        })
    }




    //place order using card
    placeOrderUsingCard = () => {
        // alert("success")

        let { params } = this.props.navigation.state
        let totalAmountTosend = null
        {
            this.state.retrieveCouponsInfo ?
                totalAmountTosend = (Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount) - Number(this.state.retrieveCouponsInfo.amount * ((Number(params.cartData.totalAmount) / 100)))).toFixed(2)

                :
                totalAmountTosend = (Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount)).toFixed(2)

        }



        let merchandData = {
            merchantId: mechantCredential.merchantId,
            region: mechantCredential.region,
            merchandServerUrl: mechantCredential.merchandServerUrl,
            amount: totalAmountTosend
        }
        debugger


        if (Platform.OS == 'ios') {
            NativeModules.MasterCardPayment.findEvents(merchandData, (response) => {
                debugger
                console.log(response, "events")
                if (response && response.result == "SUCCESS") {
                    this.setState({ visible: true })
                    let { params } = this.props.navigation.state
                    let userInfo = this.props && this.props.user ? this.props.user : null
                    let data = {
                        "customer_id": userInfo ? userInfo.id : 0,
                        "payment_method": this.state.slectedPaymentMethod.id,
                        "payment_method_title": this.state.slectedPaymentMethod.title,
                        "set_paid": true,
                        "status": "processing",
                        "billing": this.state.selectedbillingAddress,
                        "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                        "line_items": params && params.cartData && params.cartData.lineItems ? params.cartData.lineItems : [],
                        "shipping_lines": this.state.selectedDeliveryOption ? [
                            {
                                "method_id": this.state.selectedDeliveryOption.id,
                                "method_title": this.state.selectedDeliveryOption.title,
                                "total": this.state.selectedDeliveryOption.chargableAmount,
                            }
                        ] : [],
                        // "coupon_lines": this.state.retrieveCouponsInfo ? [{
                        //     "code": this.state.retrieveCouponsInfo.code
                        // }] : [],
                        // "coupon_lines": [{
                        //     "code": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? this.state.retrieveCouponsInfo.code : this.state.retrieveCouponsInfo,
                        // }]
                        "coupon_lines": []

                    }
                    console.log(data, "payment data to send")
                    console.log(JSON.stringify(data))
                    debugger
                    this.finalPayementMade(data)

                }
                else {
                    alert('Something went wrong')
                }
            });
        }


        if (Platform.OS == 'android') {
            NativeModules.ToastExample.measureLayout(
                mechantCredential.merchantId,
                mechantCredential.region,
                mechantCredential.merchandServerUrl,
                totalAmountTosend,

                (msg) => {
                    console.log(msg, "msg");
                    // alert(msg)
                    this.setState({ visible: false })
                },
                (msgsucess) => {

                    let obj = JSON.parse(msgsucess)

                    if (obj && obj.gatewayResponse && obj.gatewayResponse.result == "SUCCESS") {
                        this.setState({ visible: true })
                        let { params } = this.props.navigation.state
                        let userInfo = this.props && this.props.user ? this.props.user : null
                        let data = {
                            "customer_id": userInfo ? userInfo.id : 0,
                            "payment_method": this.state.slectedPaymentMethod.id,
                            "payment_method_title": this.state.slectedPaymentMethod.title,
                            "set_paid": true,
                            "status": "processing",
                            "billing": this.state.selectedbillingAddress,
                            "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                            "line_items": params && params.cartData && params.cartData.lineItems ? params.cartData.lineItems : [],
                            "shipping_lines": this.state.selectedDeliveryOption ? [
                                {
                                    "method_id": this.state.selectedDeliveryOption.id,
                                    "method_title": this.state.selectedDeliveryOption.title,
                                    "total": this.state.selectedDeliveryOption.chargableAmount,
                                }
                            ] : [],
                            // "coupon_lines": this.state.retrieveCouponsInfo ? [{
                            //     "code": this.state.retrieveCouponsInfo.code
                            // }] : [],
                            // "coupon_lines": [{
                            //     "code": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? this.state.retrieveCouponsInfo.code : this.state.retrieveCouponsInfo,
                            // }]
                            "coupon_lines": []

                        }
                        console.log(data, "payment data to send")
                        console.log(JSON.stringify(data))
                        debugger
                        this.finalPayementMade(data)
                        //  alert("aa gya")
                    }
                    else {
                        this.setState({ visible: false })
                        alert('Something went wrong')
                    }
                },
            );
        }



    }


    //order place api 
    placeorder = () => {

        let { couponCode, retrieveCouponsInfo } = this.state
        let guestID = this.props && this.props.guestID ? this.props.guestID : null

        if (couponCode != '' && retrieveCouponsInfo == null) {
            ToastMessage("Please enter a valid coupon")
        } else {
            let { params } = this.props.navigation.state
            this.setState({ messsgaeBelow: 'Please wait while we are creating your order...\n Do not go back or refresh the screen.' })
            if ((this.state.slectedPaymentMethod.id == 'wallet_gateway')) {

                let total = null
                this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ?
                    total = (Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount) - Number(this.state.retrieveCouponsInfo.amount * ((Number(params.cartData.totalAmount) / 100)))).toFixed(2)
                    :
                    total = (Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount)).toFixed(2)
                if (Number(total) > Number(this.props.userWalletAmount)) {
                    //    alert(total)
                    debugger
                    ToastMessage("Insufficient amount in the wallet")
                } else {
                    this.placeOrderUsingWallet()
                    // alert("in progress")
                }
            }
            // else if (this.state.slectedPaymentMethod.id == 'abzer_networkonline') {

            //     this.placeOrderUsingCard()

            // }
            else {
                // console.log(params.cartData.lineItems, "params.cartData.lineItems--------params.cartData.lineItems")
                let { params } = this.props.navigation.state

                let newData = cloneDeep(params.cartData.lineItems)
                let lineItems = newData.map((item, index) => {
                    return {

                        "product_id": item.id,
                        "quantity": item.quantity

                    }
                })
                console.log(lineItems, "lineItems----lineItems")

                var today = new Date();
                var newdate = new Date();
                newdate = today.getDay() == 5 ? moment(newdate.setDate(today.getDate() + 4)).format('DD-MM-YYYY') : moment(newdate.setDate(today.getDate() + 3)).format('DD-MM-YYYY');

                //console.log(newdate,"newdate--delievery date")
                // console.log(today.getDay())
                this.setState({ visible: true })
                let userInfo = this.props && this.props.user ? this.props.user : null
                let data = {
                    "customer_id": userInfo ? userInfo.id : 0,
                    "payment_method": this.state.slectedPaymentMethod.id,
                    "payment_method_title": this.state.slectedPaymentMethod.title,
                    "set_paid": true,
                    "status": this.state.slectedPaymentMethod.id == 'abzer_networkonline' ? "pending" : "processing",
                    "billing": this.state.selectedbillingAddress,
                    "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                    "line_items": lineItems ? lineItems : [],
                    "shipping_lines": this.state.selectedDeliveryOption ? [
                        {
                            "method_id": this.state.selectedDeliveryOption.id,
                            "method_title": this.state.selectedDeliveryOption.title,
                            "total": this.state.selectedDeliveryOption.chargableAmount,
                        }
                    ] : [],
                    // "coupon_lines": this.state.retrieveCouponsInfo ? [{
                    //     "code": this.state.retrieveCouponsInfo.code
                    // }] : [],

                    "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                        "code": this.state.retrieveCouponsInfo.code
                    }] : [],

                    'meta_data': [
                        {
                            "key": "select",
                            "value": this.state.accountType
                        },
                        {
                            "key": "company-name",
                            "value": this.state.companyName
                        },
                        {
                            "key": "trn-number",
                            "value": this.state.trnNumber
                        },
                        {
                            "key": "sap_order_id",
                            "value": ""
                        },
                        {
                            "key": "sap_delivery_id",
                            "value": ""
                        },
                        {
                            "key": "delivery_driver",
                            "value": ""
                        },
                        {
                            "key": "delivery_date",
                            "value": this.state.newdate
                        },
                        {
                            "key": "priority",
                            "value": "Normal"
                        },

                    ]
                    // 'meta_data': this.state.accountType == 'Individual' ?
                    //     [{

                    //         "key": "select",
                    //         "value": this.state.accountType

                    //     }]
                    //     : [
                    //         {
                    //             "key": "select",
                    //             "value": this.state.accountType
                    //         },
                    //         {
                    //             "key": "company-name",
                    //             "value": this.state.companyName
                    //         },
                    //         {
                    //             "key": "trn-number",
                    //             "value": this.state.trnNumber
                    //         }
                    //     ]


                    // "coupon_lines": [{
                    //     "code": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? this.state.retrieveCouponsInfo.code : this.state.retrieveCouponsInfo,
                    // }]

                }
                console.log(data, "payment data to send")
                console.log(JSON.stringify(data))
                debugger
                this.finalPayementMade(data)

            }

        }




    }


    //Adding user to the admin panel
    addUserToAdminPanel = (data) => {
        console.log(data, "data push notification")
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



    finalPayementMade = (data) => {
        let userInfo = this.props && this.props.user ? this.props.user : null
        let { params } = this.props.navigation.state

        if (params && params.cartData && params.cartData.fromOrderPage) {

            if (this.state.slectedPaymentMethod.id == 'abzer_networkonline') {

                let { params } = this.props.navigation.state
                let totalAmountTosend = null
                {
                    this.state.retrieveCouponsInfo ?
                        totalAmountTosend = (Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount) - Number(this.state.retrieveCouponsInfo.amount * ((Number(params.cartData.totalAmount) / 100)))).toFixed(2)

                        :
                        totalAmountTosend = (Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount)).toFixed(2)

                }

                let merchandData = {
                    merchantId: mechantCredential.merchantId,
                    region: mechantCredential.region,
                    merchandServerUrl: mechantCredential.merchandServerUrl,
                    amount: totalAmountTosend,
                    orderId: params.cartData.number,
                }

                if (Platform.OS == 'ios') {
                    // this.setState
                    NativeModules.MasterCardPayment.findEvents(merchandData, (response) => {
                        debugger
                        console.log(response, "events respones")

                        if (response && response.result == "SUCCESS") {
                            this.props.orderActions.updateOrder(JSON.parse(params.cartData.number), {
                                "status": "processing",
                                "payment_method": this.state.slectedPaymentMethod.id,
                                "payment_method_title": this.state.slectedPaymentMethod.title,
                                "customer_id": userInfo ? userInfo.id : 0,
                                "billing": this.state.selectedbillingAddress,
                                "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                                "shipping_lines": this.state.selectedDeliveryOption ? [
                                    {
                                        "method_id": this.state.selectedDeliveryOption.id,
                                        "method_title": this.state.selectedDeliveryOption.title,
                                        "total": this.state.selectedDeliveryOption.chargableAmount,
                                    }
                                ] : [],
                                "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                                    "code": this.state.retrieveCouponsInfo.code
                                }] : [],

                                'meta_data': [
                                    {
                                        "key": "select",
                                        "value": this.state.accountType
                                    },
                                    {
                                        "key": "company-name",
                                        "value": this.state.companyName
                                    },
                                    {
                                        "key": "trn-number",
                                        "value": this.state.trnNumber
                                    },
                                    {
                                        "key": "sap_order_id",
                                        "value": ""
                                    },
                                    {
                                        "key": "sap_delivery_id",
                                        "value": ""
                                    },
                                    {
                                        "key": "delivery_driver",
                                        "value": ""
                                    },
                                    {
                                        "key": "delivery_date",
                                        "value": this.state.newdate
                                    },
                                    {
                                        "key": "priority",
                                        "value": "Normal"
                                    },

                                ]

                            }).then((res3) => {

                                console.log(res3, "res3")
                                let noteData = {
                                    note: 'Payment successful.'
                                }
                                this.updateNotesData(JSON.parse(params.cartData.number), noteData)
                                this.getAllOrders()
                                this.getAllCoupons()
                                this.updateingCartValuesAndMoreOperationofPendingPayments(res3)


                            }).catch((err3) => {
                                // this.setState({visible:false})
                                this.props.orderActions.updateOrder(JSON.parse(params.cartData.number), {
                                    "status": "pending",
                                    "payment_method": this.state.slectedPaymentMethod.id,
                                    "payment_method_title": this.state.slectedPaymentMethod.title,
                                    "customer_id": userInfo ? userInfo.id : 0,
                                    "billing": this.state.selectedbillingAddress,
                                    "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                                    "shipping_lines": this.state.selectedDeliveryOption ? [
                                        {
                                            "method_id": this.state.selectedDeliveryOption.id,
                                            "method_title": this.state.selectedDeliveryOption.title,
                                            "total": this.state.selectedDeliveryOption.chargableAmount,
                                        }
                                    ] : [],
                                    "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                                        "code": this.state.retrieveCouponsInfo.code
                                    }] : [],
                                    'meta_data': [
                                        {
                                            "key": "select",
                                            "value": this.state.accountType
                                        },
                                        {
                                            "key": "company-name",
                                            "value": this.state.companyName
                                        },
                                        {
                                            "key": "trn-number",
                                            "value": this.state.trnNumber
                                        },
                                        {
                                            "key": "sap_order_id",
                                            "value": ""
                                        },
                                        {
                                            "key": "sap_delivery_id",
                                            "value": ""
                                        },
                                        {
                                            "key": "delivery_driver",
                                            "value": ""
                                        },
                                        {
                                            "key": "delivery_date",
                                            "value": this.state.newdate
                                        },
                                        {
                                            "key": "priority",
                                            "value": "Normal"
                                        },

                                    ]
                                }).then((res3) => {
                                    let noteData = {
                                        note: 'MPGS payment failed.'
                                    }
                                    this.updateNotesData(JSON.parse(params.cartData.number), noteData)
                                    this.getAllOrders()
                                    this.getAllCoupons()
                                    this.updateingCartValuesAndMoreOperationofPendingPayments(res3)
                                }).catch((err3) => {
                                    this.updateingCartValuesAndMoreOperationofPendingPayments(params.cartData)

                                    // this.setState({ visible: false })   
                                })
                            })
                        }
                        else {

                            debugger
                            this.props.orderActions.updateOrder(JSON.parse(params.cartData.number), {
                                "status": "pending",
                                "payment_method": this.state.slectedPaymentMethod.id,
                                "payment_method_title": this.state.slectedPaymentMethod.title,
                                "customer_id": userInfo ? userInfo.id : 0,
                                "billing": this.state.selectedbillingAddress,
                                "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                                "shipping_lines": this.state.selectedDeliveryOption ? [
                                    {
                                        "method_id": this.state.selectedDeliveryOption.id,
                                        "method_title": this.state.selectedDeliveryOption.title,
                                        "total": this.state.selectedDeliveryOption.chargableAmount,
                                    }
                                ] : [],
                                "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                                    "code": this.state.retrieveCouponsInfo.code
                                }] : [],
                                'meta_data': [
                                    {
                                        "key": "select",
                                        "value": this.state.accountType
                                    },
                                    {
                                        "key": "company-name",
                                        "value": this.state.companyName
                                    },
                                    {
                                        "key": "trn-number",
                                        "value": this.state.trnNumber
                                    },
                                    {
                                        "key": "sap_order_id",
                                        "value": ""
                                    },
                                    {
                                        "key": "sap_delivery_id",
                                        "value": ""
                                    },
                                    {
                                        "key": "delivery_driver",
                                        "value": ""
                                    },
                                    {
                                        "key": "delivery_date",
                                        "value": this.state.newdate
                                    },
                                    {
                                        "key": "priority",
                                        "value": "Normal"
                                    },

                                ]
                            }).then((res3) => {
                                let noteData = {
                                    note: 'MPGS payment failed.'
                                }
                                this.updateNotesData(JSON.parse(params.cartData.number), noteData)
                                this.getAllOrders()
                                this.getAllCoupons()
                                this.updateingCartValuesAndMoreOperationofPendingPayments(res3)

                            }).catch((err3) => {
                                this.updateingCartValuesAndMoreOperationofPendingPayments(params.cartData)

                                // this.setState({ visible: false })   
                            })                                // this.setState({ visible: false })
                            // alert('Something went wrong')
                        }
                    })
                }


                if (Platform.OS == 'android') {
                    NativeModules.ToastExample.measureLayout(
                        mechantCredential.merchantId,
                        mechantCredential.region,
                        mechantCredential.merchandServerUrl,
                        totalAmountTosend,
                        params.cartData.number,
                        (msg) => {
                            console.log(msg, "msg");
                            // alert(msg)
                            // this.setState({ visible: false })
                            this.props.orderActions.updateOrder(JSON.parse(params.cartData.number), {
                                "status": "pending",
                                "payment_method": this.state.slectedPaymentMethod.id,
                                "payment_method_title": this.state.slectedPaymentMethod.title,
                                "customer_id": userInfo ? userInfo.id : 0,
                                "billing": this.state.selectedbillingAddress,
                                "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                                "shipping_lines": this.state.selectedDeliveryOption ? [
                                    {
                                        "method_id": this.state.selectedDeliveryOption.id,
                                        "method_title": this.state.selectedDeliveryOption.title,
                                        "total": this.state.selectedDeliveryOption.chargableAmount,
                                    }
                                ] : [],
                                "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                                    "code": this.state.retrieveCouponsInfo.code
                                }] : [],
                                'meta_data': [
                                    {
                                        "key": "select",
                                        "value": this.state.accountType
                                    },
                                    {
                                        "key": "company-name",
                                        "value": this.state.companyName
                                    },
                                    {
                                        "key": "trn-number",
                                        "value": this.state.trnNumber
                                    },
                                    {
                                        "key": "sap_order_id",
                                        "value": ""
                                    },
                                    {
                                        "key": "sap_delivery_id",
                                        "value": ""
                                    },
                                    {
                                        "key": "delivery_driver",
                                        "value": ""
                                    },
                                    {
                                        "key": "delivery_date",
                                        "value": this.state.newdate
                                    },
                                    {
                                        "key": "priority",
                                        "value": "Normal"
                                    },

                                ]
                            }).then((res3) => {
                                let noteData = {
                                    note: 'MPGS payment failed.'
                                }
                                this.updateNotesData(JSON.parse(params.cartData.number), noteData)
                                this.getAllOrders()
                                this.getAllCoupons()
                                this.updateingCartValuesAndMoreOperationofPendingPayments(res3)
                            }).catch((err3) => {
                                this.updateingCartValuesAndMoreOperationofPendingPayments(params.cartData)

                                // this.setState({ visible: false })   
                            })
                        },
                        (msgsucess) => {

                            let obj = JSON.parse(msgsucess)

                            if (obj && obj.gatewayResponse && obj.gatewayResponse.result == "SUCCESS") {
                                // this.setState({ visible: true })

                                this.props.orderActions.updateOrder(JSON.parse(params.cartData.number), {
                                    "status": "processing",
                                    "payment_method": this.state.slectedPaymentMethod.id,
                                    "payment_method_title": this.state.slectedPaymentMethod.title,
                                    "customer_id": userInfo ? userInfo.id : 0,
                                    "billing": this.state.selectedbillingAddress,
                                    "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                                    "shipping_lines": this.state.selectedDeliveryOption ? [
                                        {
                                            "method_id": this.state.selectedDeliveryOption.id,
                                            "method_title": this.state.selectedDeliveryOption.title,
                                            "total": this.state.selectedDeliveryOption.chargableAmount,
                                        }
                                    ] : [],
                                    "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                                        "code": this.state.retrieveCouponsInfo.code
                                    }] : [],
                                    'meta_data': [
                                        {
                                            "key": "select",
                                            "value": this.state.accountType
                                        },
                                        {
                                            "key": "company-name",
                                            "value": this.state.companyName
                                        },
                                        {
                                            "key": "trn-number",
                                            "value": this.state.trnNumber
                                        },
                                        {
                                            "key": "sap_order_id",
                                            "value": ""
                                        },
                                        {
                                            "key": "sap_delivery_id",
                                            "value": ""
                                        },
                                        {
                                            "key": "delivery_driver",
                                            "value": ""
                                        },
                                        {
                                            "key": "delivery_date",
                                            "value": this.state.newdate
                                        },
                                        {
                                            "key": "priority",
                                            "value": "Normal"
                                        },

                                    ]
                                }).then((res3) => {

                                    let noteData = {
                                        note: 'Payment successful.'
                                    }
                                    this.updateNotesData(JSON.parse(params.cartData.number), noteData)

                                    this.getAllOrders()
                                    this.getAllCoupons()
                                    this.updateingCartValuesAndMoreOperationofPendingPayments(res3)
                                }).catch((err3) => {
                                    this.updateingCartValuesAndMoreOperationofPendingPayments(params.cartData)

                                    // this.setState({ visible: false })   
                                })
                            }
                            else {
                                // this.setState({ visible: false })
                                this.props.orderActions.updateOrder(JSON.parse(params.cartData.number), {
                                    "status": "pending",
                                    "payment_method": this.state.slectedPaymentMethod.id,
                                    "payment_method_title": this.state.slectedPaymentMethod.title,
                                    "customer_id": userInfo ? userInfo.id : 0,
                                    "billing": this.state.selectedbillingAddress,
                                    "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                                    "shipping_lines": this.state.selectedDeliveryOption ? [
                                        {
                                            "method_id": this.state.selectedDeliveryOption.id,
                                            "method_title": this.state.selectedDeliveryOption.title,
                                            "total": this.state.selectedDeliveryOption.chargableAmount,
                                        }
                                    ] : [],
                                    "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                                        "code": this.state.retrieveCouponsInfo.code
                                    }] : [],
                                    'meta_data': [
                                        {
                                            "key": "select",
                                            "value": this.state.accountType
                                        },
                                        {
                                            "key": "company-name",
                                            "value": this.state.companyName
                                        },
                                        {
                                            "key": "trn-number",
                                            "value": this.state.trnNumber
                                        },
                                        {
                                            "key": "sap_order_id",
                                            "value": ""
                                        },
                                        {
                                            "key": "sap_delivery_id",
                                            "value": ""
                                        },
                                        {
                                            "key": "delivery_driver",
                                            "value": ""
                                        },
                                        {
                                            "key": "delivery_date",
                                            "value": this.state.newdate
                                        },
                                        {
                                            "key": "priority",
                                            "value": "Normal"
                                        },

                                    ]
                                }).then((res3) => {
                                    this.getAllOrders(),
                                        this.getAllCoupons(),
                                        this.updateingCartValuesAndMoreOperationofPendingPayments(res3)
                                }).catch((err3) => {
                                    this.updateingCartValuesAndMoreOperationofPendingPayments(params.cartData)

                                    // this.setState({ visible: false })   
                                })

                                // alert('Something went wrong')
                            }
                        },
                    );
                }

            }
            else {

                this.props.orderActions.updateOrder(JSON.parse(params.cartData.number), {
                    "status": "processing",
                    "payment_method": this.state.slectedPaymentMethod.id,
                    "payment_method_title": this.state.slectedPaymentMethod.title,
                    "customer_id": userInfo ? userInfo.id : 0,
                    "billing": this.state.selectedbillingAddress,
                    "shipping": this.state.selectedShippingAddress ? this.state.selectedShippingAddress : {},
                    "shipping_lines": this.state.selectedDeliveryOption ? [
                        {
                            "method_id": this.state.selectedDeliveryOption.id,
                            "method_title": this.state.selectedDeliveryOption.title,
                            "total": this.state.selectedDeliveryOption.chargableAmount,
                        }
                    ] : [],
                    "coupon_lines": this.state.retrieveCouponsInfo && this.state.retrieveCouponsInfo.code ? [{
                        "code": this.state.retrieveCouponsInfo.code
                    }] : [],
                    'meta_data': [
                        {
                            "key": "select",
                            "value": this.state.accountType
                        },
                        {
                            "key": "company-name",
                            "value": this.state.companyName
                        },
                        {
                            "key": "trn-number",
                            "value": this.state.trnNumber
                        },
                        {
                            "key": "sap_order_id",
                            "value": ""
                        },
                        {
                            "key": "sap_delivery_id",
                            "value": ""
                        },
                        {
                            "key": "delivery_driver",
                            "value": ""
                        },
                        {
                            "key": "delivery_date",
                            "value": this.state.newdate
                        },
                        {
                            "key": "priority",
                            "value": "Normal"
                        },

                    ]
                }).then((res3) => {
                    let noteData = {
                        note: 'Payment successful.'
                    }
                    this.updateNotesData(JSON.parse(params.cartData.number), noteData)
                    if (userInfo) {
                        this.getAllOrders()

                    }
                    this.getAllCoupons()
                    this.updateingCartValuesAndMoreOperationofPendingPayments(res3)
                }).catch((err3) => {
                    this.updateingCartValuesAndMoreOperationofPendingPayments(params.cartData)

                    // this.setState({ visible: false })   
                })
                // this.updateingCartValuesAndMoreOperation(res)


            }
        }

        else {

            this.props.orderActions.createOrder(data).then((res) => {
                debugger
                console.log(res, "res---res from order place")

                if (res && (res.status == 200 || res.status == 201)) {

                    if (this.state.slectedPaymentMethod.id == 'abzer_networkonline') {

                        let { params } = this.props.navigation.state
                        let totalAmountTosend = (res.data.total)
                        // {
                        //     this.state.retrieveCouponsInfo ?
                        //         totalAmountTosend = (Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount) - Number(this.state.retrieveCouponsInfo.amount * ((Number(params.cartData.totalAmount) / 100)))).toFixed(2)

                        //         :
                        //         totalAmountTosend = (Number(params.cartData.totalAmount) + Number(params.cartData.totalVat) + Number(this.state.selectedDeliveryOption.chargableAmount)).toFixed(2)

                        // }

                        let merchandData = {
                            merchantId: mechantCredential.merchantId,
                            region: mechantCredential.region,
                            merchandServerUrl: mechantCredential.merchandServerUrl,
                            amount: totalAmountTosend,
                            orderId: res.data.number,
                        }

                        if (Platform.OS == 'ios') {
                            // this.setState
                            NativeModules.MasterCardPayment.findEvents(merchandData, (response) => {
                                debugger
                                console.log(response, "events respones")

                                if (response && response.result == "SUCCESS") {
                                    this.props.orderActions.updateOrder(res.data.id, { "status": "processing" }).then((res3) => {
                                        debugger
                                        let noteData = {
                                            note: 'Payment successful.'
                                        }
                                        // this.updateNotesData(JSON.stringify(res.data.id), noteData)

                                        if (userInfo) {
                                            this.getAllOrders()

                                        }
                                        this.getAllCoupons()
                                        this.updateingCartValuesAndMoreOperation(res3)
                                    }).catch((err3) => {
                                        // this.setState({visible:false})
                                        debugger
                                        let statusData = userInfo ? { "status": "pending" } : { "status": "failed" }

                                        this.props.orderActions.updateOrder(res.data.id, statusData).then((res3) => {
                                            let noteData = {
                                                note: 'MPGS payment failed.'
                                            }
                                            // this.updateNotesData(res.data.id, noteData)
                                            if (userInfo) {
                                                this.getAllOrders()

                                            }
                                            this.getAllCoupons()
                                            this.updateingCartValuesAndMoreOperation(res3)
                                        }).catch((err3) => {
                                            debugger
                                            // this.updateingCartValuesAndMoreOperation(res)

                                            this.setState({ visible: false })
                                        })
                                    })
                                }
                                else {

                                    debugger
                                    let statusData = userInfo ? { "status": "pending" } : { "status": "failed" }

                                    this.props.orderActions.updateOrder(res.data.id, statusData).then((res3) => {
                                        // let noteData = {
                                        //     note: 'MPGS payment failed.'
                                        // }
                                        // this.updateNotesData(res.data.id, noteData)
                                        if (userInfo) {
                                            this.getAllOrders()

                                        }
                                        this.getAllCoupons()
                                        this.updateingCartValuesAndMoreOperation(res3)
                                    }).catch((err3) => {
                                        debugger
                                        //this.updateingCartValuesAndMoreOperation(res)

                                        this.setState({ visible: false })
                                    })                                // this.setState({ visible: false })
                                    // alert('Something went wrong')
                                }
                            })
                        }


                        if (Platform.OS == 'android') {
                            NativeModules.ToastExample.measureLayout(
                                mechantCredential.merchantId,
                                mechantCredential.region,
                                mechantCredential.merchandServerUrl,
                                totalAmountTosend,
                                res.data.number,
                                (msg) => {
                                    console.log(msg, "msg");
                                    // alert(msg)
                                    // this.setState({ visible: false })
                                    let statusData = userInfo ? { "status": "pending" } : { "status": "failed" }

                                    this.props.orderActions.updateOrder(res.data.id, statusData).then((res3) => {
                                        debugger
                                        let noteData = {
                                            note: 'MPGS payment failed.'
                                        }
                                        this.updateNotesData(res.data.id, noteData)
                                        if (userInfo) {
                                            this.getAllOrders()

                                        }
                                        this.getAllCoupons()
                                        this.updateingCartValuesAndMoreOperation(res3)
                                    }).catch((err3) => {
                                        //this.updateingCartValuesAndMoreOperation(res)

                                        this.setState({ visible: false })
                                    })
                                },
                                (msgsucess) => {

                                    let obj = JSON.parse(msgsucess)

                                    if (obj && obj.gatewayResponse && obj.gatewayResponse.result == "SUCCESS") {
                                        // this.setState({ visible: true })
                                        debugger
                                        this.props.orderActions.updateOrder(res.data.id, { "status": "processing" }).then((res3) => {
                                            let noteData = {
                                                note: 'Payment successful.'
                                            }
                                            this.updateNotesData(res.data.id, noteData)
                                            if (userInfo) {
                                                this.getAllOrders()

                                            }
                                            this.getAllCoupons()
                                            this.updateingCartValuesAndMoreOperation(res3)
                                        }).catch((err3) => {
                                            debugger
                                            //this.updateingCartValuesAndMoreOperation(res)

                                            this.setState({ visible: false })
                                        })
                                    }
                                    else {
                                        // this.setState({ visible: false })
                                        let statusData = userInfo ? { "status": "pending" } : { "status": "failed" }

                                        this.props.orderActions.updateOrder(res.data.id, statusData).then((res3) => {
                                            let noteData = {
                                                note: 'MPGS payment failed.'
                                            }
                                            this.updateNotesData(res.data.id, noteData)
                                            if (userInfo) {
                                                this.getAllOrders()

                                            }
                                            this.getAllCoupons()
                                            this.updateingCartValuesAndMoreOperation(res3)
                                        }).catch((err3) => {
                                            // this.updateingCartValuesAndMoreOperation(res)

                                            this.setState({ visible: false })
                                        })

                                        // alert('Something went wrong')
                                    }
                                },
                            );
                        }



                    }
                    else {
                        this.updateingCartValuesAndMoreOperation(res)
                    }

                }
                else {
                    console.log("res from server", res)
                    debugger
                    if (res && res.data && res.data.message) {
                        // this.inputref.clear()
                        this.setState({
                            couponMessage: res.data.message,
                            error: true,
                            visible: false,
                            retrieveCouponsInfo: null
                        })
                    } else {
                        // this.inputref.clear()
                        this.setState({
                            visible: false,
                            error: false,
                            retrieveCouponsInfo: null
                        })
                    }

                    // ToastMessage("Something went wrong")
                }
            }).catch((err) => {
                debugger
                // this.inputref.clear()
                this.setState({
                    visible: false,
                    error: false,
                    retrieveCouponsInfo: null
                })
                // ToastMessage(JSON.string(err))
            })

        }

    }


    //getiing notification after payemnt done
    getNotification = () => {
        // this.setState({ visible: true })
        // if (this.props.user && this.props.user.id) {
        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${this.props.userTokenAdmin}`
            },
        }
        // header.headers['X-WP-Nonce'] = user.id
        let userid = this.props && this.props.user ? this.props.user.id : this.props.guestID
        setTimeout(() => {
            return axios.get(`${getNotifications}?user_id=${userid}`, header).then((res) => {
                debugger
                if (res && res.status == 200) {
                    debugger
                    console.log(res, "res")
                    let unreadNotificationArray = res.data.data.data.filter(item => item.is_read == 0)
                    console.log(unreadNotificationArray, "unreadNotificationArray")
                    firebase.notifications().setBadge(unreadNotificationArray.length)

                    this.props.customerActions.setUserUnreadNotification(unreadNotificationArray.length)
                    // this.setState({ notificationArray: res.data.data.data, visible: false, refreshing: false })
                    // return res
                }
                else {
                    this.setState({ refreshing: false })
                }
            }).catch((err) => {
                debugger
                this.setState({ refreshing: false })
            })
        }, 2000);

        // } else {
        //     console.log("Not a logged in user")
        // }




    }


    //complete payment of the pending ones
    updateingCartValuesAndMoreOperationofPendingPayments = (res) => {
        debugger
        let userInfo = this.props && this.props.user ? this.props.user : null

        let order_data_admin = {}

        if (!userInfo) {
            let fcm_data = {
                "user_id": this.props.guestID,
                "device_type": Platform.OS,
                "device_token": this.props.fcm_id
            }
            this.addUserToAdminPanel(fcm_data)
        }


        if (userInfo) {
            order_data_admin = {
                "user_id": userInfo.id,
                "order_id": res.data.id,
                "order_amount": res.data.total
            }
        } else {
            order_data_admin = {
                "user_id": this.props.guestID,
                "order_id": res.data.id,
                "order_amount": res.data.total
            }
        }


        Promise.resolve(
            this.upadteOrderPlacedOnAdmin(order_data_admin),
            this.getNotification()
        ).then(() => {

            // this.inputref.clear()
            setTimeout(() => {
                this.setState({
                    orderComplete: true,
                    completeOrderView: false,
                    visible: false,
                    orderCompleteData: res.data,
                    retrieveCouponsInfo: null
                }, () => {
                    console.log(this.state.orderCompleteData, "orderCompleteData orderCompleteData orderCompleteData")
                })
            }, (1000));
        }).catch((error) => {
            setTimeout(() => {
                this.setState({
                    orderComplete: true,
                    completeOrderView: false,
                    visible: false,
                    orderCompleteData: res.data,
                    retrieveCouponsInfo: null
                })
            }, (1000));
        })



    }


    // Upadte all cart values and cart count other cart operation...
    updateingCartValuesAndMoreOperation = (res) => {
        debugger
        let userInfo = this.props && this.props.user ? this.props.user : null
        let order_data_admin = {}



        if (!userInfo) {
            let fcm_data = {
                "user_id": this.props.guestID,
                "device_type": Platform.OS,
                "device_token": this.props.fcm_id
            }
            this.addUserToAdminPanel(fcm_data)
        }


        if (userInfo) {
            order_data_admin = {
                "user_id": userInfo.id,
                "order_id": res.data.id,
                "order_amount": res.data.total
            }
        } else {
            order_data_admin = {
                "user_id": this.props.guestID,
                "order_id": res.data.id,
                "order_amount": res.data.total
            }
        }


        Promise.resolve(
            this.upadteOrderPlacedOnAdmin(order_data_admin),
            this.getNotification()
        ).then(() => {
            debugger
            this.props.cartActions.setAllCartItems(0)
            this.props.cartActions.setAllCartItemsData([])
            this.props.cartActions.setAllCartItemsTotalAmount({
                "totalAmount": 0,
                "totalVat": 0,
            })
            // this.inputref.clear()
            setTimeout(() => {
                this.setState({
                    orderComplete: true,
                    completeOrderView: false,
                    visible: false,
                    orderCompleteData: res.data,
                    retrieveCouponsInfo: null
                }, () => {
                    console.log(this.state.orderCompleteData, "orderCompleteData orderCompleteData orderCompleteData")
                })
            }, (1500));
        }).catch((error) => {
            debugger
            // this.inputref.clear()
            this.props.cartActions.setAllCartItems(0)
            this.props.cartActions.setAllCartItemsData([])
            this.props.cartActions.setAllCartItemsTotalAmount({
                "totalAmount": 0,
                "totalVat": 0,
            })
            setTimeout(() => {
                this.setState({
                    orderComplete: true,
                    completeOrderView: false,
                    visible: false,
                    orderCompleteData: res.data,
                    retrieveCouponsInfo: null
                })
            }, (1500));
        })


        // this.props.cartActions.clearCart(this.props.user).then((res2) => {
        //     if (res2 && (res2.status == 200 || res2.status == 201)) {



        //     }
        //     else {
        //         debugger
        //         // this.inputref.clear()
        //         this.setState({
        //             visible: false,
        //             retrieveCouponsInfo: null
        //         })
        //     }

        // }).catch((err2) => {
        //     debugger
        //     // this.inputref.clear()
        //     this.setState({
        //         visible: false,
        //         retrieveCouponsInfo: null
        //     })
        // })
    }

    backToMenu = () => {
        this.props.navigation.navigate('app')
    }

    mainComponent = () => {

        return (
            <View style={{ paddingTop: 30, }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, fontSize: 14, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flex: 0.33, alignItems: 'center' }}><Text style={{ fontSize: 12, color: colors.appColor }}>{'shipping details'}</Text></View>
                    <View style={{ flex: 0.33, alignItems: 'center' }}><Text style={{ fontSize: 12, color: this.state.paymentSelectedBar ? colors.appColor : '#D9D9D9' }}>{'Payment method'}</Text></View>

                    <View style={{ flex: 0.33, alignItems: 'center' }}><Text style={{ fontSize: 12, color: this.state.completeSelectedBar ? this.state.orderCompleteData && (this.state.orderCompleteData.status != 'processing') ? 'red' : colors.appColor : '#D9D9D9' }}>{
                        this.state.orderComplete ?

                            this.state.orderCompleteData && this.state.orderCompleteData.status != 'processing' ?
                                'Order failed' :
                                'Order Completed' : 'Complete Order'}</Text></View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 12, backgroundColor: '#D9D9D9', marginTop: 10, marginHorizontal: 10, borderRadius: 10 }}>
                    <View style={{ height: 5, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, marginLeft: 3, flex: 0.33, backgroundColor: colors.appColor }} />
                    <View style={{ height: 5, flex: 0.33, backgroundColor: this.state.paymentSelectedBar ? colors.appColor : '#D9D9D9' }} />
                    <View style={{ height: 5, borderTopRightRadius: 10, borderBottomRightRadius: 10, marginRight: 3, flex: 0.33, backgroundColor: this.state.completeSelectedBar ? colors.appColor : '#D9D9D9' }} />
                </View>


                {
                    this.state.shippingDetails ?
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            bounces={false}>
                            {this.shippingDetails()}
                        </ScrollView> : null
                }

                {
                    this.state.paymentMethods ?
                        <ScrollView
                            showsVerticalScrollIndicator={false}

                            bounces={false}>
                            {this.paymentMethods()}
                        </ScrollView> : null
                    // this.paymentMethods() : null

                }
                {
                    this.state.cardPaymentView ? this.cardPaymentView() : null

                }
                {
                    this.state.completeOrderView ?

                        <ScrollView
                            showsVerticalScrollIndicator={false}

                            bounces={false}>
                            {this.completeOrderView()}
                        </ScrollView> : null

                }

                {
                    this.state.orderComplete ?
                        <ScrollView
                            showsVerticalScrollIndicator={false}

                            bounces={false}>
                            {this.orderComplete()}
                        </ScrollView> : null
                    // this.orderComplete() : null
                }
            </View>
        )
    }

    render() {
        return (
            <View style={[styles.container, styles.AndroidSafeArea]}>
                <SafeAreaView style={{ flex: 0, backgroundColor: '#00A651' }} />

                <StatusBar
                    translucent
                    barStyle={"dark-content"}
                    backgroundColor={'#00A651'}
                />

                <SafeAreaView 
                    style={[{ flex: 1, backgroundColor: '#ffffff' }]} >


                    {this.state.visible ? <Spinner messsgaeBelow={this.state.messsgaeBelow} /> : null}

                    <Container
                        backButton={true}
                        // scrollView={this.state.walletAmountSection ? false : true}
                        backButtonFunction={() => this.backButtonFunctionality()}
                        // rightItem={() => this.rightItem()}
                        title={'Checkout'}
                        subtitileFontSize={14}
                        viewStyle={{ marginTop: 10, paddingBottom: 100 }}
                        // scrollStyle={{  paddingBottom: 75 }}
                        scrollProps={{ showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: 'handled' }}
                        mainComponent={() => this.mainComponent()}
                    />

                </SafeAreaView>
                {
                    // this.state.amountAddedSuccessfull ?
                    //     null
                    //     :
                    this.state.completeOrderView ?
                        // true ?



                        <View style={{
                            justifyContent: 'flex-end',
                            paddingVertical: 15,
                            marginHorizontal: 40,
                            backgroundColor: 'transparent',
                            position: 'absolute',
                            bottom: 5,
                            left: 0,
                            right: 0

                        }}>
                            {/* <View style={styles.continueButton}> */}
                            {this.state.visible ?
                                null :

                                <CustomeButton

                                    buttonStyle={styles.buttonStyle}
                                    backgroundColor={'#01A651'}
                                    title={'Place Order'}
                                    borderColor={'#01A651'}
                                    fontWeight={'bold'}
                                    fontSize={16}
                                    lineHeight={16}
                                    activeOpacity={9}
                                    onPress={() => this.placeorder()}
                                    textColor={'#FFFFFF'}
                                    icon={require('../assets/images/checkLarge/ic_check.png')}
                                />

                            }
                        </View>
                        // :
                        // null 

                        :

                        // null
                        // :

                        <View style={{
                            justifyContent: 'flex-end',
                            paddingVertical: 15,
                            marginHorizontal: 40,
                            backgroundColor: 'transparent',
                            position: 'absolute',
                            bottom: 5,
                            left: 0,
                            right: 0

                        }}>
                            {/* <View style={styles.continueButton}> */}

                            <CustomeButton

                                buttonStyle={styles.buttonStyle}
                                backgroundColor={'#01A651'}
                                title={this.state.orderComplete ? 'Back' : 'NEXT'}
                                borderColor={'#01A651'}
                                fontWeight={'bold'}
                                fontSize={16}
                                lineHeight={16}
                                activeOpacity={9}
                                onPress={this.state.orderComplete ? () => this.backToMenu() : () => this.nextFuntion()}
                                textColor={'#FFFFFF'}
                                icon={this.state.orderComplete ? require('../assets/images/backButtonGreen/ic_back_button.png') : require('../assets/images/next/ic_arrow.png')}
                            />

                            {/* </View> */}


                        </View>

                }



            </View>


        );
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        userToken: state.login.userToken,
        userCommon: state.user,
        userTokenAdmin: state.login.userTokenAdmin,
        userShipping: state.login.userShipping,
        userBilling: state.login.userBilling,
        allCoupons: state.login.allCoupons,
        userWalletAmount: state.login.userWalletAmount,
        guestID: state.login.guestID,
        fcm_id: state.user.fcm_id

    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        cartActions: bindActionCreators(cartActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),
        couponActions: bindActionCreators(couponActions, dispatch),


    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(CheckOutScreen)

