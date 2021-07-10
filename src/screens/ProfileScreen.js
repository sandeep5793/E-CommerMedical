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
    Alert,
    Linking,
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
import { setNotificationStatus, getNotificationStatus } from '../utilities/config'
import axios from 'axios'
import Communications from 'react-native-communications';
// import SafeAreaView from 'react-native-safe-area-view';

import moment from 'moment'
import { key, sec, walletUrl, headerForWishlist, contactNumber, emailAdrress } from '../utilities/config'
import { Freshchat, setUser } from '../components/FreshChat'

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import * as cartActions from '../redux/actions/cartAction'

import * as wishlistActions from '../redux/actions/wishlistAction'
import * as productActions from '../redux/actions/productAction'
import IconBadge from 'react-native-icon-badge';


import { colors, screenDimensions } from '../utilities/constants';
import firebase from 'react-native-firebase';
import { ListEmpty2 } from '../components/noDataFound';


class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

            visible: false,
            refreshToken: null,
            allProfileItems: [
                {
                    id: 1,
                    lableText: 'Account type',
                    profileItemsForThisLabel: [
                        { id: 1, route: null, communication: false, settingName: null, icon: null }
                    ],

                },
                {
                    id: 2,
                    lableText: 'Account settings',
                    profileItemsForThisLabel: [
                        { id: 1, route: 'ProfileSettingScreen', communication: false, settingName: 'Profile settings', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') },
                        { id: 2, route: 'ShippingAndBilllingInfoScreen', communication: false, settingName: 'Shipping & billing address', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') },
                        { id: 3, logout: true, communication: false, settingName: 'Logout', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') }

                    ],


                },
                {
                    id: 3,
                    lableText: 'Orders',
                    profileItemsForThisLabel: [
                        { id: 1, route: 'YourOrders', communication: false, settingName: 'Your orders', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') },
                        { id: 2, route: 'RcentlyPurchased', communication: false, settingName: 'Recently purchased items', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') }

                    ],
                    communication: false

                },
                {
                    id: 4,
                    lableText: 'Wallet',
                    profileItemsForThisLabel: [
                        { id: 1, route: 'AddMoneyToWallet', settingName: 'Add balance', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') },
                        { id: 2, route: 'ViewUsageWalletScreen', settingName: 'View usage', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') }
                    ],
                    communication: false

                },
                {
                    id: 5,
                    lableText: 'Settings',
                    profileItemsForThisLabel: [
                        { id: 1, route: 'NotificationSetting', communication: false, settingName: 'Notification', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') },
                        { id: 2, route: 'rateourapp', communication: false, settingName: 'Rate our app', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') }

                    ]
                },
                {
                    id: 6,
                    lableText: 'Customer services',
                    profileItemsForThisLabel: [
                        { id: 1, communication: false, route: 'TrackOrder', settingName: 'Track order', icon: require('../assets/images/arrowRightGreen/ic_green_arrow.png') },
                        { id: 2, type: 'chat', communication: true, settingName: 'Chat with customer service', icon: require('../assets/images/chat/ic_chat_green.png') },
                        { id: 3, type: 'email', communication: true, settingName: 'Email customer service', icon: require('../assets/images/email/ic_message_green.png') },
                        { id: 4, type: 'call', communication: true, settingName: 'Call customer service', icon: require('../assets/images/call/ic_phone_green.png') }


                    ],

                },
            ],
            accountType: null,
            email: this.props.arascaEmail,
            phone: this.props.arascaPhone,
            user: this.props.user,
            getAccountInfo: this.getAccountInfo.bind(this)
        };

    }

    componentDidMount = () => {
        this.getUserEmailAndPhoneInfo()
        let userInfo = this.props.user ? this.props.user : null
        this.getAccountInfo()
        if (userInfo) {

            // this.getUserEmailAndPhoneInfo()
            this.getNotificationStatus()
            this.getAddAmountArray()
            this.getWalletHistory()
            this.getUserWalletAmount()
        } else {
            // this.getUserEmailAndPhoneInfo()
            console.log('Not a logged in user')
        }
    }


    getUserWalletAmount = () => {

        let userInfo = this.props.user ? this.props.user : null

        debugger
        // this.setState({visible:true})
        axios.get(`${walletUrl}user/${userInfo.id}?key=${key}&sec=${sec}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res, "wallet data")
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
            console.log(err, "err-err")
            debugger
            // this.setState({ tableData: [],visible:false })
        })
    }

    getWalletHistory = () => {

        let userInfo = this.props.user ? this.props.user : null

        debugger
        // this.setState({visible:true})
        axios.get(`${walletUrl}history/user/${userInfo.id}?key=${key}&sec=${sec}`, {
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

                    // console.log('get all products listing', res)
                    if (response && response.status == 200) {
                        debugger
                        console.log("response", response.data)
                        this.props.productActions.setWalletAmount({ allwalletAmounts: response.data, })

                        // this.setState({
                        //     visible: false,
                        //     addAmountArray: response.data
                        // })

                    } else {

                        this.setState({ visible: false, })

                    }
                }).catch((err) => {
                    //
                    this.setState({ visible: false })
                })


            }
            else {
                this.setState({ visible: false })

            }
        }).catch((err) => {
            this.setState({ visible: false })
        })
    }




    getUserEmailAndPhoneInfo = () => {
        let data = {
            'key': key,
            'sec': sec,
        }

        axios.get(`${contactNumber}`, { params: data }, headerForWishlist).then((res) => {
            if (res && res.status == 200) {
                debugger
                // this.setState({ phone: res.data.contact })
                this.props.actions.saveArascaPhone({ arascaPhone: res.data.contact, })

                console.log("res phone...", res.data)
                // return res
            }
        }).catch((err) => {
            debugger
            // return err
        })

        axios.get(`${emailAdrress}`, { params: data }, headerForWishlist).then((res) => {
            if (res && res.status == 200) {
                debugger
                // this.setState({ email: res.data.email })
                this.props.actions.saveArascaEmail({ arascaEmail: res.data.email, })

                console.log("res email.....", res.data)
                // return res
            }
        }).catch((err) => {
            debugger
            // return err
        })


    }
    getAccountInfo = () => {
        let userInfo = this.props && this.props.user ? this.props.user : null
        debugger
        if (userInfo) {
            let checkAccountType = userInfo.meta_data.find((item, index) => {
                if (item.key == 'account_type' || item.key == 'customer_type') {
                    return item
                }
            })
            if (checkAccountType.value) {
                this.setState({ accountType: checkAccountType.value })
            }
        } else {
            console.log('Not a logged in user')

            this.setState({ accountType: 'Guest' })

        }


    }

    getNotificationStatus = () => {
        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${this.props.userTokenAdmin}`
            }
        }

        return axios.get(`${getNotificationStatus}`, header).then((res) => {
            console.log("user details", res)
            if (res && res.status == 200) {
                debugger
                if (res && res.data && res.data.user && res.data.user.is_push_notification == "1") {
                    //   console.log("user details",res)

                    this.props.customerActions.setUserNotification({
                        onSelectedYes: true,
                        onSelectedNo: false
                    })

                }
                else {
                    this.props.customerActions.setUserNotification({
                        onSelectedYes: false,
                        onSelectedNo: true
                    })
                }
                debugger
                return res
            }
        }).catch((err) => {
            debugger
            console.log(err.response)
            return err
        })
    }


    // static getDerivedStateFromProps(props, state){

    //     console.log("props,",props)
    //     console.log("propusersus,",state.user)
    //     if (props && props.user != this.prop.user) {
    //         // return state.getAccountInfo()
    //     }
    // }

    logOutSuccess = () => {

        return Alert.alert(
            '',
            `Are you sure you want to logout?`,
            [
                { text: 'Cancel', onPress: () => console.log('cancel pressed') },
                {

                    text: 'Ok',
                    onPress: () => {
                        this.logoutFunction()
                    },
                    // style:'cancel'
                }
            ],
            { cancelable: false }
        )
    }

    firebaseCount = () => {
        let count = firebase.notifications().setBadge(0)
        console.log(count, "count")
        Promise.resolve(count).then((res) => {
            return true
        }).catch((err) => {
            return false
        })

    }

    logoutFunction = () => {
        this.setState({ visible: true })
        Promise.all([

            this.props.customerActions.logOutUser(),
            this.props.customerActions.setUserShipping({ shippingaddress: [], }),
            this.props.customerActions.setUserBilling({ billingaddress: [] }),
            this.props.cartActions.setAllCartItems(0),
            this.props.cartActions.setAllCartItemsData([]),
            this.props.cartActions.setAllCartItemsTotalAmount({
                "totalAmount": 0,
                "totalVat": 0,
            }),
            this.props.wishlistActions.setWishlistItem({ wishlistData: [], totalWishlistItem: 0 }),

            // this.firebaseCount(),
            this.props.productActions.saveWalletAmountForUser({ userWalletAmount: 0 }),
            this.props.productActions.saveWalletUsage({ allwalletUsage: [], }),
            this.props.customerActions.setUserUnreadNotification(0),
        ]).then((res) => {
            firebase.notifications().setBadge(0)
            Freshchat.resetUser()
            console.log(res, "res")
            // console.log('All promices are resolved');
            setTimeout(() => {
                ToastMessage('Logout successfully')
                this.setState({ visible: false }, () => {
                    this.props.navigation.navigate('Auth')
                })
            }, 3500);
        }).catch((error) => {
            // console.log('promise all error: ', error);
            console.log(error, "error")
            firebase.notifications().setBadge(0)
            Freshchat.resetUser()
            setTimeout(() => {
                ToastMessage('Logout successfully')
                this.setState({ visible: false }, () => {
                    this.props.navigation.navigate('Auth')
                })
            }, 3500);
        });








        // this.props.wishlistActions.setWishlistItem({ wishlistData: [], totalWishlistItem: 0 })
        // if(!this.props.user){
        // setTimeout(() => {
        //     ToastMessage('Logout successfully')
        //     this.setState({ visible: false }, () => {
        //         this.props.navigation.navigate('Auth')
        //     })
        // }, 2000);
        // }

    }

    onProfileItemsPress = (itm) => {
        let userInfo = this.props.user ? this.props.user : null

        if (itm && itm.route) {

            if (itm.route == 'rateourapp') {
                if (Platform.OS == 'ios') {
                    Linking.openURL('itms-apps://itunes.apple.com/us/app/apple-store/id1508168718?mt=8')

                } else {
                    Linking.openURL('market://details?id=com.arascamedicalgroup')


                }
            } else {
                if (!userInfo) {
                    ToastMessage('You need to login to access this feature')
                } else {

                    // else{
                    this.props.navigation.navigate(itm.route, { getAccountInfo: () => this.getAccountInfo() })

                    // }

                }
            }


        }
        if (itm && itm.logout) {
            if (userInfo) {
                this.logOutSuccess()
            } else {
                this.props.navigation.navigate('Auth')
            }

        }

    }

    communication = (itm) => {
        let userInfo = this.props.user ? this.props.user : null

        if (itm.type == 'chat') {
            // if (!userInfo) {
            //     ToastMessage('You need to login to access this feature')
            // } else {
            //     this.openFreshChat()

            // }
            this.openFreshChat()
        }
        else if (itm.type == 'email') {
            Communications.email([this.state.email, ''], null, null, '', '')
        } else if (itm.type == 'call') {
            Communications.phonecall(this.state.phone, true)
        } else {

        }
        //

        console.log(itm, "itm")
    }

    message = () => {
        return (
            // <View>
            //     <Text>{'Hello'}</Text>
            // </View>
            <View>
                {/* <Image source={require('../assets/images/graphic/graphic.png')} /> */}

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {/* <View style={{ height: 2 }} />
                    <Text style={styles.emptyData}>{"Your Wishlist Is Empty"}</Text> */}
                    <View style={{ height: 2 }} />
                    <Text style={styles.emptyDataSubLabel}>{"You need to login to access this feature"}</Text>
                </View>


                <View style={{ marginTop: 20 }}>
                    <CustomeButton

                        buttonStyle={{ marginHorizontal: 20, borderWidth: 1, borderRadius: 15, flexDirection: 'row' }}
                        backgroundColor={'#01A651'}
                        title={'Login to continue'}
                        borderColor={'#01A651'}
                        fontWeight={'bold'}
                        fontSize={16}
                        lineHeight={16}
                        activeOpacity={9}
                        onPress={() => this.props.navigation.navigate('Auth')}
                        textColor={'#FFFFFF'}
                        icon={require('../assets/images/login/ic_login.png')}

                    />
                </View>

            </View>

        )
    }


    mainComponent = () => {

        let userInfo = this.props.user ? this.props.user : null

        // if (true) {
        return (
            // 0x575859
            <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>

                {

                    this.state.allProfileItems.map((item, index) => {
                        return (
                            <View key={item.id} style={{}}>
                                <View style={{ margin: 5 }}>
                                    <Text style={styles.labelText}>{item.lableText}</Text>
                                </View>
                                {item.profileItemsForThisLabel.map((itm, inx) => {
                                    return (
                                        <TouchableOpacity key={inx} onPress={itm.communication ? () => this.communication(itm) : () => this.onProfileItemsPress(itm)}>
                                            <View style={{ borderWidth: 0.5, marginBottom: 4, borderColor: '#575859', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={styles.profileItemText}>{itm && itm.settingName ? !userInfo && itm.settingName == 'Logout' ? 'Login' : itm.settingName : this.state.accountType ? this.state.accountType : null}</Text>
                                                {itm && itm.icon ? <Image source={itm.icon} style={(itm && itm.communication) ? '' : { height: 14, width: 8 }} /> : null}
                                            </View>
                                        </TouchableOpacity>

                                    )
                                })}

                            </View>
                        )
                    })

                }

            </View>
        )
        // }
        //  else {
        //     return (
        //         ListEmpty2({ state: false, margin: screenDimensions.height / 3, message: () => this.message(), loaderStyle: { height: 50, width: 50 } })

        //     )


        // }

    }
    openFreshChat = () => {
        if (this.props.user && this.props.user.id) {
            setUser(this.props.user)
            Freshchat.showConversations()
        } else {
            setUser(this.props.guestID)
            Freshchat.showConversations()
            // ToastMessage('You need to login to access this feature.')
        }

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
            <>
                <View style={[styles.container, styles.AndroidSafeArea]}>
                    {/* <SafeAreaView style={{ flex: 0, backgroundColor: '#00A651' }} /> */}
                    <SafeAreaView style={{ backgroundColor: colors.appColor }} />
                    <SafeAreaView
                        style={{ backgroundColor: colors.white }}>
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
                            scrollView={true}
                            rightItem={() => this.rightItem()}
                            title={'Your Account'}
                            viewStyle={{ paddingBottom: 20 }}
                            scrollStyle={{ flex: 1, marginTop: 10 }}
                            scrollProps={{ showsVerticalScrollIndicator: false }}
                            mainComponent={() => this.mainComponent()}

                        />

                    </SafeAreaView>
                </View>

            </>
        );
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        userTokenAdmin: state.login.userTokenAdmin,
        allwalletAmounts: state.login.allwalletAmounts,
        unReadMessage: state.login.unReadMessage,
        arascaEmail: state.login.arascaEmail,
        arascaPhone: state.login.arascaPhone,
        guestID: state.login.guestID
        //userCommon: state.user
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        wishlistActions: bindActionCreators(wishlistActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        cartActions: bindActionCreators(cartActions, dispatch),

    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(ProfileScreen)

