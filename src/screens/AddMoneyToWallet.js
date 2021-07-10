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
    KeyboardAvoidingView,
    FlatList,
    RefreshControl,
    NativeModules
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
import CardView from 'react-native-cardview'
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
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as productActions from '../redux/actions/productAction'
import IconBadge from 'react-native-icon-badge';
import { mechantCredential } from '../utilities/config';
import * as orderActions from '../redux/actions/orderAction'


class AddMoneyToWallet extends Component {
    constructor(props) {
        super(props);
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.state = {
            totalWalletMoney: this.props.userWalletAmount,
            visible: false,
            money: '',
            showPriceDropdown: false,
            walletAmountSection: true,
            cardDetailEnterSection: false,
            amountAddedSuccessfull: false,
            addAmountArray: this.props.allwalletAmounts,
            selectedAmount: '',
            selectedAmountIndex: null,
            cardNumber: '',
            monthYear: '',
            cvvNumber: '',
            refreshing: false,
            orderCompleteData: null,
            disabled: false

        };


    }
    componentDidMount() {
        this.getAddAmountArray()
    }

    //to get the wallet amount if it gets updated
    getAddAmountArray = () => {
        // this.setState({ visible: true })
        this.props.productActions.getAllProductsCategory({ page: 1, slug: 'wallet' }).then((res) => {
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

                    console.log('get all products listing', response)
                    if (response && response.status == 200) {
                        debugger
                        console.log("response for all waller ", response.data)
                        this.props.productActions.setWalletAmount({ allwalletAmounts: response.data, })

                        this.setState({
                            visible: false,
                            refreshing: false
                            // addAmountArray: response.data
                        })

                    } else {
                        console.log("rs")

                        this.setState({ visible: false, refreshing: false })

                    }
                }).catch((err) => {
                    //
                    this.setState({ visible: false, refreshing: false })
                })


            }
            else {
                this.setState({ visible: false, refreshing: false })

            }
        }).catch((err) => {
            this.setState({ visible: false, refreshing: false })
        })
    }

    //open freshchat function
    openFreshChat = () => {
        setUser(this.props.user)
        Freshchat.showConversations()
    }

    //Get products
    _keyExtractor3 = (item, index) => index + 'flatlist3';
    getAllPriceList = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ marginHorizontal: 10, }} key={index} activeOpacity={9} onPress={() => this.setState({ selectedAmount: item, selectedAmountIndex: index, showPriceDropdown: false, })}>
                <View style={{ padding: 10 }}><Text style={{ fontSize: 12, color: (this.state.selectedAmountIndex == index ? colors.appColor : 'grey') }}>{`AED ${item.price}`}</Text></View>
                <View style={{ backgroundColor: 'grey', height: 0.5 }} />
            </TouchableOpacity>
        )
    }

    //Flat list for all the wallet product
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

    // component 1 wallet
    walletFirstComponent = () => {
        return (
            <View>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/wallet/ic_wallet.png')} />
                </View>
                <View style={{ paddingHorizontal: 20, paddingTop: 20, alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 14, alignItems: 'center' }}>{'Your Current Wallet Balance is'}</Text>
                    <Text style={{ color: colors.appColor, fontWeight: 'bold', fontSize: 12, marginTop: 5 }}>{`AED ${this.state.totalWalletMoney}`}</Text>
                    <Text style={styles.addBalance}>{`Add Balance`}</Text>

                    <View>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}>
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={2}
                                cornerRadius={22}
                                style={styles.cardViewDropDownWallet2} >
                                <TouchableOpacity onPress={() => this.setState({ showPriceDropdown: !this.state.showPriceDropdown })}>
                                    <View
                                        style={{
                                            paddingHorizontal: 10,
                                            justifyContent: 'space-between',
                                            flexDirection: 'row'
                                        }} >
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: colors.lightfontColor, fontSize: 12 }}>{this.state.selectedAmount ? this.state.selectedAmount.price : 'Select Amount'}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Image source={require('../assets/images/arrowDown/ic_dropdown_green.png')} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </CardView>

                            {this.state.showPriceDropdown ?
                                <CardView
                                    cardElevation={2}
                                    cardMaxElevation={2}
                                    style={styles.cardViewDropDownWallet} >

                                    <View>
                                        {this.priceList()}
                                    </View>
                                </CardView>
                                :
                                null}

                        </View>

                    </View>
                </View>

            </View>

        )
    }

    // component 2 wallet
    walletSecondComponent = () => {
        return (
            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
                <View>
                    <Text style={{ color: 'black', fontSize: 12, fontWeight: 'bold' }}>{'Enter Card Details'}</Text>
                    <View style={{ marginTop: 30, }}>
                        <Text style={{ color: 'grey', fontSize: 12 }}>{'Enter card number'}</Text>
                        <TextInput
                            ref={(ref) => { this.cardNumber = ref; }}
                            style={{ height: 35, fontSize: 12 }}
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
                        <Text style={{ color: 'grey', fontSize: 12 }}>{'MM/YY'}</Text>


                        <TextInput
                            ref={(ref) => { this.monthYear = ref; }}
                            value={this.state.monthYear}
                            onChangeText={(text) => this.setState({ monthYear: text })}
                            keyboardType={'numeric'}
                            style={{ height: 35, fontSize: 12 }}
                            onSubmitEditing={(event) => this.cvvNumber.focus()}
                        />

                        <View style={{ height: 0.5, backgroundColor: 'grey', }} />
                    </View>
                    <View style={{ width: 20, height: 35 }} />
                    <View style={{ flex: 0.5 }}>
                        <Text style={{ color: 'grey', fontSize: 12 }}>{'CVV number'}</Text>

                        <TextInput
                            ref={(ref) => { this.cvvNumber = ref; }}
                            value={this.state.cvvNumber}
                            onChangeText={(text) => this.setState({ cvvNumber: text })}
                            keyboardType={'numeric'}
                            style={{ height: 35, fontSize: 12, }}
                            onSubmitEditing={(event) => Keyboard.dismiss()}
                        />

                        <View style={{ height: 0.5, backgroundColor: 'grey', }} />
                    </View>


                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                    <View><Text style={{ fontWeight: 'bold', color: colors.appColor, fontSize: 16 }}>{'Total Amount'}</Text></View>
                    <View><Text style={{ fontWeight: 'bold', color: colors.appColor, fontSize: 16 }}>{`AED ${this.state.selectedAmount.price}`}</Text></View>
                </View>

            </View>
        )
    }

    // component 2 wallet
    walletAmountAdded = () => {
        let { orderCompleteData } = this.state
        return (
            <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/whiteWallet/ic_wallet_outline.png')} />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', fontWeight: 'bold' }}>
                        {'Thank you for adding balance \n in your wallet'}
                    </Text>

                    <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', marginTop: 40 }}>
                        {'Your payment refernce number is'}
                    </Text>

                    <Text style={{ fontSize: 20, color: colors.appColor, textAlign: 'center', fontWeight: 'bold' }}>
                        {orderCompleteData ? orderCompleteData.number : ''}
                    </Text>
                    <View>
                        <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', marginTop: 20 }}>
                            {'Amount will be credited \n in your wallet in 24 hours'}
                        </Text>
                    </View>




                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: screenDimensions.height / 10 }}>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 14, color: 'black', textAlign: 'left', }}>
                            {'Total amount to be credited'}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 14, color: colors.appColor, textAlign: 'right', fontWeight: 'bold', }}>
                            {`AED ${this.state.selectedAmount.price}`}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }


    //validation rules
    ValidationRules = () => {
        let { cardNumber, monthYear, cvvNumber } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [
            {
                field: cardNumber,
                name: strings.enterCardDetail,
                rules: 'required|hasNumber|hasSymbol|no_space',
                lang: lang

            },
            {
                field: monthYear,
                name: strings.enterMonthAndYear,
                rules: 'required|hasNumber|hasSymbol|no_space',
                lang: lang

            },
            {
                field: cvvNumber,
                name: strings.cvvNumber,
                rules: 'required|hasNumber|hasSymbol|no_space',
                lang: lang

            },
        ]
    }


    //add money to wallet api
    addMoneyToWallet = (selectedAmount) => {

        let datamerchant = {
            merchantId: mechantCredential.merchantId,
            region: mechantCredential.region,
            merchandServerUrl: mechantCredential.merchandServerUrl,
            amount: JSON.parse(selectedAmount.price),
            orderId: null
        }
        debugger
        let randomID = Math.random().toString(36)

        let line_items = [{
            "key": randomID,
            "product_id": selectedAmount.id,
            "variation_id": 0,
            "variation": [],
            "quantity": 1,
            "data": {},
            "data_hash": randomID,
            "line_tax_data": { "subtotal": [], "total": [] },
            "line_subtotal": JSON.parse(selectedAmount.price),
            "line_subtotal_tax": 0,
            "line_total": JSON.parse(selectedAmount.price),
            "line_tax": 0,
            "product_name": selectedAmount.name,
            "product_title": selectedAmount.name,
            "product_price": `AED ${JSON.parse(selectedAmount.price)}`,
            "product_image": "https://test.arascamedical.com/wp-content/uploads/2019/10/989803139251-300x300.jpg",
            "parentId": randomID,
            "stock_quantity": selectedAmount.stock_quantity,
            "stock_status": selectedAmount.stock_status
        }]

        console.log(line_items, "line_items")
        console.log(datamerchant, "datamerchant")
        debugger

        if (Platform.OS == 'ios') {

            NativeModules.MasterCardPayment.findEvents(datamerchant, (response) => {
                debugger
                this.setState({ visible: true })
                console.log(response, "events")
                if (response && response.result == "SUCCESS") {
                    let { params } = this.props.navigation.state
                    let userInfo = this.props && this.props.user ? this.props.user : null
                    let data = {
                        "customer_id": userInfo ? userInfo.id : 0,
                        "payment_method": "abzer_networkonline",
                        "payment_method_title": "Debit/Credit Card",
                        "set_paid": true,
                        "status": "processing",
                        "line_items": line_items
                    }
                    console.log(data, "payment data to send")
                    console.log(JSON.stringify(data))

                    this.finalPayementMade(data)

                    debugger
                } else {
                    // alert("!2324")
                    this.setState({ disabled: false })

                    this.setState({ visible: false })
                    // alert('Something went wrong')
                }

            });
        }


        if (Platform.OS == 'android') {


            NativeModules.ToastExample.measureLayout(
                mechantCredential.merchantId,
                mechantCredential.region,
                mechantCredential.merchandServerUrl,
                selectedAmount.price,
                "",
                (msg) => {
                    debugger
                    console.log(msg, "msg");
                    this.setState({ visible: false, disabled: false })
                },
                (msgsucess) => {
                    this.setState({ visible: true })
                    let obj = JSON.parse(msgsucess)

                    if (obj && obj.gatewayResponse && obj.gatewayResponse.result == "SUCCESS") {
                        let { params } = this.props.navigation.state
                        let userInfo = this.props && this.props.user ? this.props.user : null
                        let data = {
                            "customer_id": userInfo ? userInfo.id : 0,
                            "payment_method": "abzer_networkonline",
                            "payment_method_title": "Debit/Credit Card",
                            "set_paid": true,
                            "status": "processing",
                            "line_items": line_items
                        }
                        console.log(data, "payment data to send")
                        console.log(JSON.stringify(data))

                        this.finalPayementMade(data)

                        debugger
                    } else {
                        this.setState({ visible: false, disabled: false })
                        // alert('Something went wrong')

                    }
                },
            );

        }


    }

    finalPayementMade = (data) => {
        let userInfo = this.props && this.props.user ? this.props.user : null

        this.props.orderActions.createOrder(data).then((res) => {
            debugger
            if (res && (res.status == 200 || res.status == 201)) {
                this.setState({
                    orderCompleteData: res.data,
                    visible: false,
                    amountAddedSuccessfull: true,
                    walletAmountSection: false,
                    disabled: false
                })
                // this.setState({disabled:false})

            }
            else {
                console.log("res from server", res)
                debugger
                if (res && res.data && res.data.message) {
                    this.setState({ visible: false, disabled: false })

                } else {
                    this.setState({ visible: false, disabled: false })

                }
            }
        }).catch((err) => {
            debugger
            this.setState({ visible: false })
        })
    }

    changeStatus = () => {
        if (this.state.selectedAmount) {
            this.setState({ disabled: true })
            console.log(this.state.selectedAmount, "selectedAmount")
            this.addMoneyToWallet(this.state.selectedAmount)
        }
        else {
            ToastMessage("Please select an amount from the list")
        }

    }

    mainComponent = () => {
        return (
            <View style={{ paddingTop: this.state.cardDetailEnterSection ? 30 : 60, height: screenDimensions.height }}>
                {
                    this.state.walletAmountSection ? this.walletFirstComponent() : null
                }
                {/* {
                    this.state.cardDetailEnterSection ? this.walletSecondComponent() : null
                } */}
                {
                    this.state.amountAddedSuccessfull ? this.walletAmountAdded() : null
                }


            </View>
        )
    }


    handleRefresh = () => {
        this.setState({
            refreshing: true,
            // visible: true
        }, () => {
            this.getAddAmountArray();
        });

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
                            IconBadgeStyle={styles.iconBadgeStyle}
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
                        scrollView={this.state.showPriceDropdown ? false : true}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        rightItem={() => this.rightItem()}
                        title={'Your wallet'}
                        subtitileFontSize={14}
                        subtitile={'Add Balance'}
                        viewStyle={{ marginTop: 10, }}
                        scrollProps={{
                            showsVerticalScrollIndicator: false,
                            keyboardShouldPersistTaps: 'handled',
                            refreshControl: <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }}
                        mainComponent={() => this.mainComponent()}
                    />

                </SafeAreaView>
                {this.state.amountAddedSuccessfull ?
                    null
                    :
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
                        {this.state.visible ?
                            null :
                            <CustomeButton
                                enabled={this.state.visible}
                                buttonStyle={styles.buttonStyle}
                                backgroundColor={'#01A651'}
                                title={'NEXT'}
                                borderColor={'#01A651'}
                                fontWeight={'bold'}
                                fontSize={16}
                                lineHeight={16}
                                activeOpacity={0.6}
                                onPress={() => this.state.walletAmountSection ? this.changeStatus() : this.addMoneyToWallet()}
                                textColor={'#FFFFFF'}
                                icon={require('../assets/images/next/ic_arrow.png')}
                            />
                        }
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
        userCommon: state.user,
        allwalletAmounts: state.login.allwalletAmounts,
        userWalletAmount: state.login.userWalletAmount,
        unReadMessage: state.login.unReadMessage,
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),


    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(AddMoneyToWallet)

