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
    FlatList,
    ImageBackground,
    Alert
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

//GLobal lib
import { Rating, AirbnbRating } from 'react-native-ratings';

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import * as wishlistActions from '../redux/actions/wishlistAction'
import * as productActions from '../redux/actions/productAction'
import * as orderActions from '../redux/actions/orderAction'
import { deleteNotifications, getNotifications } from '../utilities/config'
import { colors, screenDimensions } from '../utilities/constants';
import moment from 'moment';
import axios from 'axios'
// import logger from 'redux-logger';
import IconBadge from 'react-native-icon-badge';

import logger from "react-native-simple-logger";
import firebase from 'react-native-firebase';
class OrderDetailScreen2 extends Component {
    constructor(props) {
        super(props);
        let { params } = this.props.navigation.state
        this.state = {

            visible: false,
            orderNumber: null,
            shippingCharges: null



        };

    }

    componentDidMount = () => {
        this.getOrderDetail()
        let { params } = this.props.navigation.state
        debugger
        if (params && params.orderDetailData) {
            this.getNotificationReadUnRead(params.orderDetailData)
        }
    }

    getNotificationReadUnRead = (orderDetailData) => {

        let { params } = this.props.navigation.state
        // this.setState({ visible: true })
        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${this.props.userTokenAdmin}`
            },
        }
        let data = {
            id: orderDetailData.id,
            // user_id: orderDetailData.receiver_id
        }
        debugger
        // header.headers['X-WP-Nonce'] = user.id
        axios.post(`${deleteNotifications}`, data, header).then((res) => {
            debugger
            if (res && res.status == 200) {
                debugger
                console.log(res, "res")
                if (params && params.getNotification) {
                    params.getNotification()
                }
                else {
                    this.getNotification()
                }
                // return res
            }
            else {
                // this.setState({ visible: false, refreshing: false })
            }
        }).catch((err) => {
            logger.apiError(err)
            console.log(err.response)
            debugger
            // this.setState({ visible: false, refreshing: false })
        })


    }

    getNotification = () => {
        // this.setState({ visible: true })
        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${this.props.userTokenAdmin}`
            },
        }
        // header.headers['X-WP-Nonce'] = user.id
        axios.get(`${getNotifications}?user_id=${this.props.user.id}`, header).then((res) => {
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
                this.setState({ visible: false, refreshing: false })
            }
        }).catch((err) => {
            debugger
            this.setState({ visible: false, refreshing: false })
        })


    }

    getOrderDetail = () => {
        this.setState({ visible: true })
        let { params } = this.props.navigation.state
        this.props.orderActions.retrieveOrder(params.orderId).then((res) => {
            if (res && res.status == 200) {
                console.log(res.data, "order details")
                if (res && res.data) {
                    debugger
                    if (res && res.data && res.data.line_items && res.data.line_items.length) {
                        let allData = res.data.line_items.map((item, index) => {
                            return (this.getProductData(item))
                        })
                        debugger
                        Promise.all(allData).then((result) => {
                            console.log(result, "result")
                            debugger
                            this.setState({
                                line_items: result,
                                subtotal: Number(res.data.total) - Number(res.data.total_tax) - Number(res.data.shipping_total),
                                vat: res.data.total_tax,
                                total: res.data.total,
                                shippingCharges: Number(res.data.shipping_total),
                                paymentMethod: res.data.payment_method_title,
                                deliveredon: moment(res.data.date_completed_gmt).format("LL"),
                                createdOn: moment(res.data.date_created_gmt).format("LL"),
                                orderStatus: res.data.status,
                                visible: false,
                                orderNumber: res.data.number,
                            })

                        }).catch((error) => {
                            debugger
                            this.setState({ visible: false, })
                            console.log(`Error in promises ${error}`)
                        })

                        // console.log("allData", allData)
                    }
                    else {
                        debugger
                        this.setState({ line_items: [], visible: false })
                    }
                } else {
                    debugger
                    this.setState({ visible: false })
                }

            } else {
                debugger
                this.setState({ visible: false })
            }
        }).catch((err) => {
            debugger
            console.log("err", err)
        })
    }

    getProductData = (item) => {

        return this.props.productActions.retrieveProduct(item.product_id).then((response) => {
            // if (response && response.status == 200) {
            let data = response.data
            data.product_total_for_thisOrder = item.total
            data.product_tax_for_thisOrder = item.total_tax
            data.product_quantity_for_thisOrder = item.quantity
            // data.orderStatus=item.status
            item = data
            return item
        }).catch((err) => {
            //
            debugger
            return item
        })

        //return info
    }


    _keyExtractor3 = (item, index) => index + 'flatlist3';
    lineItems = ({ item, index }) => {
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <TouchableOpacity onPress={() => this.deleteItemFromwishlist(item)}>
                            <Image source={require('../assets/images/deleteGrey/ic_delete.png')} />
                        </TouchableOpacity> */}
                    </View>

                    <View style={{ flex: 0.9, flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', flex: 0.2, borderRadius: 10, }}>
                            {item.images && item.images[0] && item.images[0].src ?
                                <ImageBackground
                                    style={[{
                                        width: 70, height: 70,
                                        borderRadius: 10,
                                    }, { zIndex: 1, backgroundColor: 'white' }]}
                                    resizeMode={'stretch'}
                                    resizeMethod={'resize'}
                                    source={item.images && item.images[0] && item.images[0].src ? { uri: item.images[0].src } : require('../assets/img/greyscale.jpg')}
                                />
                                :
                                null}
                        </View>
                        <View style={{ marginLeft: 30, flex: 0.8 }}>
                            <View><Text style={styles.productType} numberOfLines={2}>{item.name.replace(/&amp;/g, '&')}</Text></View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <Text style={styles.aedPrice} numberOfLines={1}>{`AED ${Number(item.product_total_for_thisOrder).toFixed(2)}`}</Text>
                                <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                            </View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
                                <View>
                                    <AirbnbRating
                                        count={5}
                                        selectedColor={colors.appColor}
                                        reviews={[]}
                                        defaultRating={item.average_rating}
                                        size={12}
                                        showRating={false}
                                        isDisabled={true}
                                    />

                                    {/* <Image source={require('../assets/images/rating/ic_path_green.png')} /> */}
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end'
                                }}>
                                    {
                                        this.state.orderStatus == 'completed' ?
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ReviewAndStarRating', { product_id: item.id })}>
                                                <Text style={{ color: colors.appColor, fontSize: 12, fontWeight: 'bold' }}>{'Write a review'}</Text>
                                            </TouchableOpacity>
                                            :
                                            null

                                    }


                                </View>

                            </View>

                        </View>

                    </View>

                </View>
                <View style={{ height: 0.5, backgroundColor: 'grey', marginVertical: 10 }} />
            </View>
        )
    }


    lineItemsList = () => {
        return (
            <FlatList
                bounces={true}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                data={this.state.line_items}
                keyExtractor={this._keyExtractor}
                renderItem={this.lineItems}
                automaticallyAdjustContentInsets={true}
                ListEmptyComponent={
                    (this.state.line_items.length == 0) ?
                        ListEmpty2({ state: this.state.visible, margin: this.state.visible ? screenDimensions.height / 3 : screenDimensions.height / 8, message: () => this.message(), loaderStyle: { height: 50, width: 50 } })
                        :
                        null
                }
            />
        )
    }

    totalPriceAndValues = () => {


        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>{'Subtotal'}</Text>
                    <Text style={{ fontSize: 12 }}>{this.state.subtotal ? `AED ${Number(this.state.subtotal).toFixed(2)}` : ""}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                    <Text style={{ fontSize: 12 }}>{'VAT'}</Text>
                    <Text style={{ fontSize: 12 }}>{this.state.vat ? `AED ${Number(this.state.vat).toFixed(2)}` : ""}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                    <Text style={{ fontSize: 12 }}>{'Shipping Charges'}</Text>
                    <Text style={{ fontSize: 12 }}>{this.state.shippingCharges ? `AED ${Number(this.state.shippingCharges).toFixed(2)}` : ""}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{'Total'}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{this.state.total ? `AED ${Number(this.state.total).toFixed(2)}` : ""}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                    <Text style={{ fontSize: 12 }}>{'Payment Method'}</Text>
                    <Text style={{ fontSize: 12 }}>{this.state.paymentMethod ? this.state.paymentMethod : ""}</Text>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                    <Text style={{ fontSize: 12 }}>{'Order status'}</Text>
                    <Text style={{ fontSize: 12 }}>{this.state.orderStatus}</Text>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                    <Text style={{ fontSize: 12 }}>{this.state.orderStatus && this.state.orderStatus == 'completed' ? 'Delieved on' : 'Placed on'}</Text>
                    <Text style={{ fontSize: 12 }}>{this.state.orderStatus && this.state.orderStatus == 'completed' ? this.state.deliveredon : this.state.createdOn}</Text>
                </View>
                {this.state.orderStatus && (this.state.orderStatus != 'pending') ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                        <Text style={{ fontSize: 12 }}>{'Estimated Delivery'}</Text>
                        <Text style={{ fontSize: 12 }}>{'3 Business Days'}</Text>
                    </View>
                    :
                    null
                }

                <View style={{ height: 40 }} />

                {
                    this.state.orderStatus == 'pending' ?


                        <CustomeButton

                            buttonStyle={styles.buttonStyle}
                            backgroundColor={'#01A651'}
                            title={'Complete your order'}
                            borderColor={'#01A651'}
                            fontWeight={'bold'}
                            fontSize={16}
                            lineHeight={16}
                            activeOpacity={9}
                            onPress={() => this.checkout()}
                            textColor={'#FFFFFF'}
                            icon={require('../assets/images/checkLarge/ic_check.png')}
                        />
                        :
                        null
                }

            </View>
        )
    }


    checkout = () => {

        this.props.navigation.navigate('CheckOutScreen',
            {
                cartData:
                {
                    "totalAmount": this.state.subtotal,
                    "totalVat": this.state.vat,
                    "lineItems": this.state.line_items,
                    "fromOrderPage": true,
                    "number": this.state.orderNumber,
                    "id": this.state.orderNumber,
                    "total": this.state.total
                },
                // getAllCartItems: () => this.getAllCartItems(),
                // getCartCount: () => this.getCartCount()

            })
    }

    mainComponent = () => {
        return (
            <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>

                {
                    this.state.line_items && this.state.line_items.length ? this.lineItemsList() : null
                }


                {
                    this.state.line_items && this.state.line_items.length ? this.totalPriceAndValues() : null
                }


            </View>
        )
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
        let { params } = this.props.navigation.state
        return (
            <View style={[styles.container, styles.AndroidSafeArea]}>
                {/* <SafeAreaView style={{ flex: 0, backgroundColor: '#00A651' }} /> */}
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
                        // backButtonFunction={() => this.props.navigation.goBack()}
                        scrollView={true}
                        rightItem={() => this.rightItem()}
                        header={true}
                        numberOfLines={1}
                        leftItem1={require('../assets/images/arrowLeftBackWhite/ic_back_arrow.png')}
                        rightItem1={require('../assets/images/notificationIcon/ic_notification.png')}
                        rightItem2={require('../assets/images/messageIcon/ic_message.png')}
                        rightItem1Press={() => this.props.navigation.navigate('Notification')}
                        rightItem2Press={() => this.openFreshChat()}
                        rightItem2FontSize={18}
                        notificationCount={this.props.unReadMessage}
                        leftItem2={params && params.orderId ? `Order # ${params.orderId}` : ''}
                        leftItem1Press={() => this.props.navigation.navigate('app')}
                        // title={`Order # ${this.state.orderNumber}`}
                        viewStyle={{ marginTop: 20, height: screenDimensions.height }}
                        scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 150 }}
                        scrollProps={{ showsVerticalScrollIndicator: false }}
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
        userTokenAdmin: state.login.userTokenAdmin,
        unReadMessage: state.login.unReadMessage,

        //userCommon: state.user
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        wishlistActions: bindActionCreators(wishlistActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),


    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(OrderDetailScreen2)

