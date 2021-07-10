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
import { tsExpressionWithTypeArguments } from '@babel/types';
import IconBadge from 'react-native-icon-badge';


class ShippingAndBilllingInfoScreen extends Component {
    constructor(props) {
        super(props);
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.state = {

            visible: false,
            refreshToken: null,
            shippingaddress: this.props.userShipping.shippingaddress,
            selectedShippingAddressIndex: null,
            selectedShippingAddress: null,

            billingaddress: this.props.userBilling.billingaddress,
            selectedbillingAddressIndex: null,
            selectedbillingAddress: null,
            billingExist: false,
            shippingExist: false,
            lastIndex: false,
            allcountriesForFilter: [],
            allcountriesAvailble: [],
            allcountries: []

        };

        // this.getUserInfoForBillingAndShipping(userInfo)
        // this.updateShipping(userInfo)

    }
    componentDidMount = () => {
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.getUserInfo(userInfo)
        this.getCountries()
    }

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

    openFreshChat = () => {
        setUser(this.props.user)
        Freshchat.showConversations()
    }


    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     if (this.props.user != nextProps.user) {
    //         this.getUserInfoForBillingAndShipping(nextProps.user)
    //     }
    // }

    getUserInfoForBillingAndShipping = (userInfo) => {

        debugger
        this.setState({ visible: true })

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

    }



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

    deleteShipping = (item) => {
        debugger
        let userInfo = this.props && this.props.user ? this.props.user : null

        debugger
        this.setState({
            visible: true
        })
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

    onSelectShipping = (item, index) => {
        this.setState({ selectedShippingAddress: item, selectedShippingAddressIndex: index })
    }


    deleteBilling = (item) => {
        debugger
        let userInfo = this.props && this.props.user ? this.props.user : null

        this.setState({
            visible: true
        })
        let shipping_billing = 'billing'


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




    onSelectBilling = (item, index) => {
        this.setState({ selectedbillingAddress: item, selectedbillingAddressIndex: index })
    }

    shippingaddressComponent = () => {
        return (
            <View>
                <View>
                    <Text style={{ fontWeight: '600', fontSize: 14, fontWeight: 'bold' }}>{'Shipping Address'}</Text>
                </View>

                <View>
                    {this.state.shippingaddress.length ?

                        this.state.shippingaddress.map((item, index) => {
                            let countryToShow = null

                            if (item && item.country) {

                                countryToShow = this.state.allcountriesForFilter.find(function (element) {
                                    return element.code == item.country;
                                });
                                console.log(countryToShow, "counttuAvailForSelling")
                            }
                            return (
                                item && item.first_name != "" ?
                                    <View key={index}>
                                        <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                            <View style={{ flex: 0.05, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <TouchableOpacity onPress={() => this.onSelectShipping(item, index)}>
                                                    <Image
                                                        source={this.state.selectedShippingAddressIndex == index ?
                                                            require('../assets/images/radioOn/ic_radio_on.png')
                                                            :
                                                            require('../assets/images/radioOff/ic_radio_off.png')
                                                        } />

                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 0.9, paddingLeft: 5, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <Text style={{ fontSize: 14, color: colors.black, fontWeight: 'bold' }} numberOfLines={2}>
                                                    {`${item && item.first_name != '' ? item.first_name : ''} ${item && item.last_name != '' ? item.last_name : ''}`}
                                                </Text>
                                                <Text style={{ fontSize: 14, color: colors.lightfontColor }} numberOfLines={2}>
                                                    {`${item && item.company != '' ? item.company + ',' : ''} ${item && item.address_1 != '' ? item.address_1 + ',' : ''} ${item && item.address_2 != '' ? item.address_2 + ',' : ''} ${item && item.city != '' ? item.city + ',' : ''} ${item && item.state != '' ? item.state + ',' : ''}  ${item && item.postcode != '' ? item.postcode : ''} ${countryToShow && (countryToShow != undefined || countryToShow != null) ? countryToShow.name : ''}  ${item && item.phone ? item.phone : ''}`}
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
                                    : null
                            )
                        })

                        :
                        null}
                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('AddNewBillingAndShipping', { title: 'Shipping Address', key: 'shipping', shippingBillingArray: this.state.shippingaddress, getShippingOrBillingInfo: (value) => this.getUserInfo(value) })}>
                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                        <Image source={require('../assets/images/locationGreen/ic_location_green.png')} />
                        <Text style={{ color: colors.appColor, fontSize: 14, fontWeight: 'bold', paddingLeft: 10 }}>
                            {/* {item && item.company != '' ? item.company + ',' : ''} ${item && item.address_1 != '' ? item.address_1 + ',' : ''} ${item && item.address_2 != '' ? item.address_2 + ',' : ''} ${item && item.city != '' ? item.city + ',' : ''} ${item && item.state != '' ? item.state + ',' : ''}  ${item && item.postcode != '' ? item.postcode : ''} ${item && item.country != '' ? item.country : ''} `} */}

                            {'Add New Address'}

                        </Text>


                    </View>

                </TouchableOpacity>
                <View style={{ backgroundColor: colors.appColor, height: 0.5, marginTop: 10 }} />


            </View>

        )
    }


    billingaddressComponent = () => {
        return (
            <View style={{ marginTop: 20 }}>
                <View>
                    <Text style={{ fontWeight: '600', fontSize: 14, fontWeight: 'bold' }}>{'Billing Address'}</Text>
                </View>

                <View>
                    {this.state.billingaddress.length ?

                        this.state.billingaddress.map((item, index) => {

                            let countryToShow = null

                            if (item && item.country) {

                                countryToShow = this.state.allcountriesForFilter.find(function (element) {
                                    return element.code == item.country;
                                });
                                console.log(countryToShow, "counttuAvailForSelling")
                            }

                            return (
                                item && item.first_name != "" ?
                                    <View key={index}>
                                        <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                            <View style={{ flex: 0.05, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <TouchableOpacity onPress={() => this.onSelectBilling(item, index)}>
                                                    <Image
                                                        source={this.state.selectedbillingAddressIndex == index ?
                                                            require('../assets/images/ic_radio_on.png')
                                                            :
                                                            require('../assets/images/ic_radio_off.png')
                                                        } />

                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 0.9, paddingLeft: 5, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <Text style={{ fontSize: 14, color: colors.black, fontWeight: 'bold' }} numberOfLines={2}>
                                                    {`${item && item.first_name != '' ? item.first_name : ''} ${item && item.last_name != '' ? item.last_name : ''}`}
                                                </Text>

                                                <Text style={{ fontSize: 14, color: colors.lightfontColor }} numberOfLines={2}>
                                                    {`${item && item.company != '' ? item.company + ',' : ''} ${item && item.address_1 != '' ? item.address_1 + ',' : ''} ${item && item.address_2 != '' ? item.address_2 + ',' : ''} ${item && item.city != '' ? item.city + ',' : ''} ${item && item.state != '' ? item.state + ',' : ''}  ${item && item.postcode != '' ? item.postcode : ''} ${countryToShow && (countryToShow != undefined || countryToShow != null) ? countryToShow.name : ''}  ${item && item.phone ? item.phone : ''}`}
                                                </Text>

                                            </View>

                                            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => this.deleteBilling(item)}>
                                                    <Image source={require('../assets/images/ic_delete.png')} />

                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ backgroundColor: colors.lightBlack, height: 0.5, marginTop: 10 }} />
                                    </View>
                                    :
                                    null
                            )
                        })

                        :
                        null}
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('AddNewBillingAndShipping', { title: 'Billing Address', key: 'billing', shippingBillingArray: this.state.billingaddress, getShippingOrBillingInfo: (value) => this.getUserInfoForBillingAndShipping(value) })}>

                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                        <Image source={require('../assets/images/ic_location_green.png')} />
                        <Text style={{ color: colors.appColor, fontSize: 12, fontWeight: 'bold', paddingLeft: 10 }}>{'Add New Address'}</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ backgroundColor: colors.appColor, height: 0.5, marginTop: 10 }} />


            </View>

        )
    }

    mainComponent = () => {
        return (
            <View style={{ paddingTop: 10, paddingBottom: 120, }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/logo/ic_logo.png')} />
                </View>

                <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
                    {/* <ScrollView> */}
                    {this.shippingaddressComponent()}

                    {this.billingaddressComponent()}

                    {/* </ScrollView> */}

                    {/* <View style={styles.continueButton}>
                        <CustomeButton

                            buttonStyle={styles.buttonStyle}
                            backgroundColor={'#01A651'}
                            title={'Save'}
                            borderColor={'#01A651'}
                            fontWeight={'bold'}
                            fontSize={16}
                            lineHeight={16}
                            activeOpacity={9}
                            onPress={() => alert("Shipping and billing")}
                            textColor={'#FFFFFF'}
                            icon={require('../assets/images/ic_submit.png')}
                        />
                        <View style={{ height: 20 }} />

                    </View> */}

                </View>


            </View>
        )
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

    saveAddress = () => {
        this.setState({ visible: true })
        setTimeout(() => {
            this.setState({ visible: false })
            ToastMessage("Address saved successfully")
        }, 1000);
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
                <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }}
                    style={[{ flex: 1, backgroundColor: '#ffffff' }]} >

                    {this.state.visible ? <Spinner /> : null}
                    <Container
                        backButton={true}
                        scrollView={true}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        rightItem={() => this.rightItem()}
                        title={'Shipping & Billing Address'}
                        // viewStyle={{ paddingBottom: 120, marginTop: 10, }}
                        // scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 75 }}
                        scrollProps={{ showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: 'handled' }}
                        mainComponent={() => this.mainComponent()}

                    />
                    <View style={{

                        position: 'absolute',
                        bottom: 10, left: 0, right: 0,
                        paddingVertical: 15,
                        marginHorizontal: 40,
                        backgroundColor: 'transparent',

                    }}>
                        {/* <View style={styles.continueButton}> */}
                        <CustomeButton

                            buttonStyle={styles.buttonStyle}
                            backgroundColor={'#01A651'}
                            title={'Save'}
                            borderColor={'#01A651'}
                            fontWeight={'bold'}
                            fontSize={16}
                            lineHeight={16}
                            activeOpacity={9}
                            onPress={() => this.saveAddress()}
                            textColor={'#FFFFFF'}
                            icon={require('../assets/images/submitGreen/ic_submit.png')}
                        />
                        {/* </View> */}


                    </View>
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
        userShipping: state.login.userShipping,
        userBilling: state.login.userBilling,
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
export default connect(mapStateToProps, mapDispathToProps)(ShippingAndBilllingInfoScreen)

