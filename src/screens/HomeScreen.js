import React, { Component } from 'react';
import {
    View,
    Text,
    // SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    StyleSheet,
    ImageBackground,
    TextInput,
    RefreshControl,
    AsyncStorage,
    AppState,
    Platform

} from 'react-native';

//Local imports
import styles from '../styles'
import location from '../assets/images/ic_location.png'
import strings from '../utilities/languages'
import cart from '../assets/images/ic_cart.png'
import { ListEmpty2 } from '../components/noDataFound'
import { formatter } from '../utilities/Formatter'
import Spinner from '../components/Spinner'
import { key, sec, getNotifications, contactNumber, emailAdrress, headerForWishlist, addUserToAdminPanel } from '../utilities/config'
import { screenDimensions, colors } from '../utilities/constants';
import { ToastMessage } from '../components/Toast';

import CarouselUpdate from '../components/Carousel';

//global libs
import CardView from 'react-native-cardview'
import Modal from 'react-native-modal'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import axios from 'axios';
import firebase from 'react-native-firebase';
import {
    Freshchat,
    setUser
} from '../components/FreshChat'
import DefaultPreference from 'react-native-default-preference';
import { ScrollView } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';
import IconBadge from 'react-native-icon-badge';
import SafeAreaView from 'react-native-safe-area-view';


//contants
const sliderWidth = Dimensions.get("window").width - 20;
const itemWidth = Dimensions.get("window").width - 20;

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as productActions from '../redux/actions/productAction'
import * as customerActions from '../redux/actions/customerAction'
import * as wishlistActions from '../redux/actions/wishlistAction'
import * as orderActions from '../redux/actions/orderAction'
import * as couponActions from '../redux/actions/couponsAction'
import * as cartActions from '../redux/actions/cartAction'




import { setNotificationStatus, getNotificationStatus } from '../utilities/config'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '4202, Tabuk St , Riyadh',
            cartItems: 3,
            slider1ActiveSlide: 0,
            bannerData: [],

            adesandaccessories: [],
            trainingEquipmentsroducts: [],
            productsOnSaleItems: [],
            offersAndBanners: [],
            allDataSearchChoice: [{
                value: 'By Code',
            }, {
                value: 'By Name',
            },],

            toptencategory: [],
            toptencategoryAdmin:[],
            allBrandsPartners: [
                { id: 1, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/Philips.png' },
                { id: 2, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/St-John.png' },
                { id: 3, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/Reliance.png' },
                { id: 4, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/gamte.png' },
                { id: 5, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/Life-secure.png' },
                { id: 6, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/03/Innosonian-1.png' },
            ],
            visible: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            visible6: false,
            visible7: false,
            visible8: false,
            visible9: false,
            showReset: false,
            categoryProductData: [],
            allselectedItemToWishList: [],
            isModalVisible: false,
            searchedArray: [],
            newArrivalItems: null,
            allFeaturedOItems: null,
            refreshing: false,
            selectedSearchOption: 'By Name',
            allcountries: [],
            allcountriesForFilter: [],
            allcountriesAvailble: [],
            appState: AppState.currentState,

            // searchText: ''

        }
    }

    componentDidMount = () => {
        debugger
        let userInfo = this.props && this.props.user ? this.props.user : null
        console.log(userInfo, "userInfo-----userInfo------userInfo")
        if (this.props && this.props.user) {

        } else {
            let fcm_data = {
                "user_id": this.props.guestID,
                "device_type": Platform.OS,
                "device_token": this.props.fcm_id
            }
            this.addUserToAdminPanel(fcm_data)
        }

        this._navListener = this.props.navigation.addListener('willFocus', (playload) => {
            this.reset()

        });

        this.getUserEmailAndPhoneInfo()
        // firebase.notifications().setBadge(0)
        AppState.addEventListener('change', this._handleAppStateChange);

        this.getCountries()
        this.checkPermission()
        this.createNotificationListeners() //add this line
        this.getAllCategory()
        this.getAllData()
        this.getAllTaxes()

    }



    //Adding user to the admin panel
    addUserToAdminPanel = (data) => {
        console.log(data, "data push notification.....2")
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

    //get user's email and phone number
    getUserEmailAndPhoneInfo = () => {
        let data = {
            'key': key,
            'sec': sec,
        }

        axios.get(`${contactNumber}`, { params: data }, headerForWishlist).then((res) => {
            if (res && res.status == 200) {
                debugger
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
                this.props.actions.saveArascaEmail({ arascaEmail: res.data.email, })

                console.log("res email.....", res.data)
                // return res
            }
        }).catch((err) => {
            debugger
            // return err
        })


    }

    //get notifications on active state
    _handleAppStateChange = nextAppState => {
        if (this.state.appState == 'active') {
            this.getNotification()
        }
    };
    //get List of all the countries

    getCountries = () => {
        // this.setState({ visible: true })
        let { allcountriesForFilter, allcountriesAvailble } = this.state
        this.props.actions.getAllCountries().then((res) => {
            console.log(res.response, "res----countires----res")
            if (res && res.status == 200) {
                console.log("res....countries", res)
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
                        console.log("filteredCounty", filteredCounty)
                        this.props.cartActions.setAllCountries(filteredCounty)

                        this.setState({
                            allcountries: filteredCounty
                        })
                    }
                })

            } else {
                this.setState({ visible: false })
            }
        }).catch((err) => {
            console.log(err, "err--rrrr")
            this.setState({ visible: false })
        })
    }

    //get list of all the taxes

    getAllTaxes = () => {
        this.props.cartActions.getAllTaxes().then((res) => {
            if (res && res.status == 200) {
                console.log(res, "tax response")

                this.props.cartActions.setAllTaxData(res.data)
            }
        }).catch((err) => {
            console.log(err, "tax error")
        })
    }

    // freshcaht sdk
    openFreshChat = () => {
        if (this.props.user && this.props.user.id) {
            setUser(this.props.user)
            Freshchat.showConversations()
        } else {
            setUser(this.props.guestID)
            Freshchat.showConversations()
        }

    }


    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //get the fcm token 
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                console.log('fcmToken:', fcmToken);
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
        console.log('fcmToken:', fcmToken);
    }
    async createNotificationListeners() {

        // Triggered when a particular notification has been received in foreground

        this.notificationListener = firebase.notifications().onNotification((notification) => {
            debugger
            this.getNotification()
            console.log('onNotification:');
            if (notification && notification.data && notification.data.order_id) {
                // notificationData = notification.data.order_id
                // console.log(notificationData, "notificationData")
                // this.getNotification()
                // if (notificationData) {
                //     this.props.navigation.navigate('OrderDetailScreen', { orderId: notificationData })

                // }
            } else {
                debugger
                // let item = {
                //     "promotion_title":notification.data.promotion_title,
                //     "promotion_msg":notification.data.promotion_msg
                // }
                // this.props.navigation.navigate('NotificationDetail', { notificationData:notification.data })
                // this.getNotification()
            }
            // this.props.navigation.navigate('OrderDetailScreen', { orderId: notificationData })
            const localNotification = new firebase.notifications.Notification({
                sound: 'sampleaudio',
                show_in_foreground: true,
            })
                .setSound('sampleaudio.wav')
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setBody(notification.body)
                .setData(notification.data)
                .android.setChannelId('default') // e.g. the id you chose above
                //   .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
                .android.setColor('#000000') // you can set a color here
                .android.setPriority(firebase.notifications.Android.Priority.High);

            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));


        });

        const channel = new firebase.notifications.Android.Channel('default', 'Demo app name', firebase.notifications.Android.Importance.High)
            .setDescription('Demo app description');
        // .setSound('sampleaudio.wav');
        firebase.notifications().android.createChannel(channel);
        // PushNotificationIOS.setApplicationIconBadgeNumber()
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            debugger
            this.getNotification()

            if (notificationOpen && notificationOpen.notification.data && notificationOpen.notification.data.order_id) {
                let notificationData = notificationOpen.notification.data.order_id
                // console.log(notificationData, "notificationData")
                if (notificationData) {
                    this.props.navigation.navigate('OrderDetailScreen', { orderId: notificationData, orderDetailData: notificationOpen.notification.data })
                }
            }
            // else if (notificationData) {
            //     this.props.navigation.navigate('OrderDetailScreen', { orderId: notificationData })

            // }
            else {
                debugger
                let item = {
                    "promotion_title": notificationOpen.notification.data.promotion_title,
                    "promotion_msg": notificationOpen.notification.data.promotion_msg
                }
                this.props.navigation.navigate('NotificationDetail', { notificationData: notificationOpen.notification.data })
                //                //
            }

            console.log('onNotificationOpened:');
            // Alert.alert(title, body)
        });

        //If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            debugger
            this.getNotification()
            if (notificationOpen && notificationOpen.notification && notificationOpen.notification.data && notification.data.order_id) {
                let notificationData = notificationOpen.notification.data.order_id
                // console.log(notificationData, "notificationData")
                if (notificationData) {
                    this.props.navigation.navigate('OrderDetailScreen', { orderId: notificationData, orderDetailData: notificationOpen.notification.data })

                }
            }
            // else if (notificationData) {
            //     this.props.navigation.navigate('OrderDetailScreen', { orderId: notificationData })

            // }
            else {
                debugger
                let item = {
                    "promotion_title": notificationOpen.notification.data.promotion_title,
                    "promotion_msg": notificationOpen.notification.data.promotion_msg
                }
                this.props.navigation.navigate('NotificationDetail', { notificationData: notificationOpen.notification.data })
                //
            }

            console.log('getInitialNotification:');
        }

        // Triggered for data only payload in foreground

        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            debugger
            this.getNotification()

            console.log("JSON.stringify:", JSON.stringify(message));
        });

    }


    //get the permission request
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);

        this.notificationListener();
        this.notificationOpenedListener();
        if (this._navListener) {
            this._navListener.remove()
        }
    }

    //get all tha data comon promise resolve for all the function
    getAllData = () => {
        this.getAllOrders()
        this.getALlRecentlyPurchasedItems()
        this.getAllCoupons()
        let userInfo = this.props && this.props.user ? this.props.user : null
        if (userInfo) {
            this.getUserInfo(userInfo)
        }

        this.setState({
            visible2: true, visible3: true, visible4: true, visible6: true, visible8: true,
            // showReset: false,
        }, () => {
            Promise.all([
                this.getAllWishListItem(),
                this.getAllBanners(),
                this.getAllCategoryByAdmin(),
                this.getTopTenCategory(),
                this.getAllFeaturedProducts(),
                this.getAllCategory(),
                this.onSaleProducts(),
                this.getNotification()
            ]).then(() => {
                // console.log('All promices are resolved');
                this.setState({ refreshing: false });
            }).catch((error) => {
                // console.log('promise all error: ', error);
                this.setState({ refreshing: false });
            });

        })
    }
    // get users information
    getUserInfo = (userInfo) => {

        // this.setState({ visible: this.state.shippingaddress.length || this.state.billingaddress.length?false:true })
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

    //geting the user information for shipping and billing address
    getUserInfoForBillingAndShipping = (userInfo) => {

        debugger
        // this.setState({ visible: true })

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

    // update shipping and billing
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

    // get total notification count and the data
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
            axios.get(`${getNotifications}?user_id=${userid}`, header).then((res) => {
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
        }, 2000);

        // } else {
        //     console.log("Not a logged in user")
        // }




    }


    // get all the coupons
    getAllCoupons = () => {
        this.props.couponActions.getAllCoupons().then((res) => {
            console.log("res all couypons", res)
            if (res && res.status == 200 || res.status == 201) {
                this.props.couponActions.setAllCoupons({ allCoupons: res.data })
            } else {
                console.log("res ", res)
            }
        }).catch((err) => {
            console.log("coupon error", error)
        })
    }

    //get all the orders placed by the user
    getAllOrders = () => {
        // this.setState({ visible: true })
        if (this.props.user && this.props.user.id) {
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
        } else {
            console.log('Not a logged in user')
        }

    }

    //get all the recently purchased items
    getALlRecentlyPurchasedItems = () => {
        let userInfo = this.props && this.props.user ? this.props.user : null

        if (userInfo) {


            let data = {
                'key': key,
                'sec': sec,
                'user_id': userInfo ? userInfo.id : null
            }
            this.props.productActions.getAllRecentlyPurchasedItems(data, userInfo.id).then((res) => {
                if (res && res.status == 200) {
                    debugger
                    let data = Object.keys(res.data).map(val => {
                        return { ...res.data[val], parentId: val };
                    });

                    this.props.productActions.saveRecentlyPurchasedItems(data)


                } else {

                    this.setState({ visible: false, refreshing: false })

                }
            }).catch((err) => {
                //
                this.setState({ visible: false, refreshing: false })
            })

        } else {

        }

    }
    //get all category by admin
    getAllCategoryByAdmin = () => {
        this.setState({ visible8: true })
        return axios.get('https://admin.arascamedical.com/api/homecategory', {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        }).then((res) => {
            console.log(res,"res>>>>>get all category by admin")
            if (res && res.data && res.data.statuscode == 200) {
                // console.log(res,"res>>>>>get all category by admin")
                this.setState({
                    toptencategoryAdmin: res.data.data,
                    visible8: false
                },()=>{
                    this.categoryPress(this.state.toptencategoryAdmin[0])
                })
            }
        }).catch((err) => {
            alert(err)
            this.setState({ visible8: false })
            debugger

        })


    }


    //get all banners
    getAllBanners = () => {
        this.setState({ visible8: true })

        return axios.get('https://admin.arascamedical.com/api/index-data', {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        }).then((res) => {
            if (res && res.status == 200) {
                this.setState({
                    bannerData: res.data.banner,
                }, () => {
                    let data = {
                        page: 1,
                        per_page: 100,
                        on_sale: true
                    }
                    debugger
                    return this.props.productActions.getAllProducts(data).then((res2) => {
                        debugger
                        if (res2 && res2.status == 200) {
                            debugger
                            this.setState({
                                visible8: false,
                                offersAndBanners: res.data.offer
                            }, () => {
                                res2.data.filter((item, index) => {
                                    if ((item.date_on_sale_from != null) && (item.date_on_sale_to != null)) {
                                        let dealofTheDayProduct = [item]
                                        this.setState({ offersAndBanners: [...dealofTheDayProduct, ...this.state.offersAndBanners], }, () => {
                                            // console.log("offersAndBanners", this.state.offersAndBanners)
                                        })
                                    }
                                })
                            })
                        }
                        else {
                            this.setState({
                                visible8: false,
                                offersAndBanners: res.data.offer
                            })
                        }

                        // this.setState({ visible6: false, adesandaccessories: res })
                    }).catch((err) => {
                        //
                        this.setState({ visible8: false })
                    })
                })
            }
        }).catch((err) => {
            alert(err)
            this.setState({ visible8: false })
            debugger

        })


    }

    //on sale products
    onSaleProducts = () => {
        this.setState({ visible6: true, })
        let data = {
            page: 1,
            per_page: 100,
            on_sale: true,
            status: 'publish'
        }
        debugger
        return this.props.productActions.getAllProducts(data).then((res) => {
            // console.log("All Sales product", res.data)
            debugger
            if (res && res.status == 200) {
                debugger

                this.setState({ visible6: false, productsOnSaleItems: res.data, })
                // console.log(allFeatured, "featured")
            }
            else {
                this.setState({ visible6: false, productsOnSaleItems: [] })
            }

            // this.setState({ visible6: false, adesandaccessories: res })
        }).catch((err) => {
            //
            this.setState({ visible6: false })
        })
    }

    //get the list of all the featured products
    getAllFeaturedProducts = () => {
        this.setState({ visible2: true })
        let data = {
            page: 1,
            per_page: 100,

        }
        debugger
        return this.props.productActions.getAllProductsCategory(data).then((res) => {
            // console.log("All featured", res.data)
            debugger
            if (res && res.status == 200) {
                res.data.filter((item, index) => {
                    if (item.slug == 'first-aid-kits-and-consumables') {
                        this.setState({ visible2: true, allFeaturedOItems: item })
                        let data2 = {
                            category: item.id,
                            per_page: 10,
                            status: 'publish',
                            featured: true
                        }
                        debugger
                        return this.props.productActions.getAllProducts(data2).then((res2) => {
                            console.log(res2, "featured products")
                            if (res2 && res2.status == 200) {
                                debugger
                                let allFeatured = res2.data.filter((item, index) => {
                                    if (item.featured) {
                                        // debugger
                                        return item
                                    }
                                })
                                // console.log(allFeatured, "allFeatured")
                                this.setState({ visible2: false, adesandaccessories: allFeatured })
                            } else {
                                this.setState({ visible2: false, })
                            }
                            // console.log('all the aeds', res.data)
                        }).catch((err) => {
                            //
                            this.setState({ visible2: false })
                        })
                    }
                })


                // let allFeatured = res.data.filter((item, index) => {
                //     if (!item.featured) {
                //         // debugger
                //         return item
                //     }
                // })
                // debugger
                // this.setState({ visible2: false, adesandaccessories: allFeatured })
                // console.log(allFeatured, "featured")
            }
            else {
                this.setState({ visible2: false, adesandaccessories: [] })
            }

            // this.setState({ visible2: false, adesandaccessories: res })
        }).catch((err) => {
            //
            this.setState({ visible2: false })
        })
    }

    //get top ten category
    getTopTenCategory = () => {
        debugger
        this.setState({ visible4: true })
        return this.props.productActions.getAllProductsCategory({ page: 1, per_page: 10, order: 'asc' }).then((res) => {
            // console.log("top te category", res.data)
            if (res && res.status == 200) {
                let newArray = res.data.filter(item => item.slug != 'wallet' && item.slug != 'uncategorized')

                this.setState({ toptencategory: newArray, visible4: false }, () => {
                    
                })
            }
            else {
                this.setState({ visible4: false })

            }
        }).catch((err) => {
            this.setState({ visible4: false })
        })
    }

    //get all the category
    getAllCategory = () => {
        debugger
        return this.props.productActions.getAllProductsCategory({ per_page: 100 }).then((res) => {
            // debugger
            // console.log("All category", res.data)

            if (res && res.status == 200) {

                let newArray2 = res.data.filter(item => item.slug != 'wallet' && item.slug != 'uncategorized')
                this.props.productActions.setAllCategory({ allCategoryItems: newArray2, })

                res.data.filter((item, index) => {

                    if (item.slug == "new-arrivals") {
                        this.setState({ visible3: true, newArrivalItems: item })
                        let data = {
                            category: item.id,
                            per_page: 5,
                            status: 'publish'
                        }
                        return this.props.productActions.getAllProducts(data).then((res) => {
                            // console.log('all the new arrival', res)
                            if (res && res.status == 200) {
                                this.setState({ visible3: false, trainingEquipmentsroducts: res.data })

                            } else {
                                this.setState({ visible3: false, })

                            }
                        }).catch((err) => {
                            //
                            this.setState({ visible3: false })
                        })
                    }
                })

                this
                // console.log(res)
            } else {
                //  ToastMessage()
            }
        }).catch((err) => {

            // console.log(err)
        })
    }

    //toptencategory
    _keyExtractor2 = (item, index) => index + 'flatlist2';
    toptencategory = ({ item, index }) => {
        debugger
        return (
            <TouchableOpacity activeOpacity={9} onPress={() => console.log("product list")}>
                <View index={index} style={styles.mainViewAllProducts}>
                    <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={5}
                        style={[{ width: screenDimensions.width / 2 - 60, height: screenDimensions.width / 2 - 10 }]}>
                        <View style={{ backgroundColor: 'white', borderRadius: 5, height: screenDimensions.width / 2 - 10 }}>


                            <Image
                                style={[styles.imageViewAllProducts, { position: 'absolute', zIndex: 0 }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={require('../assets/img/greyscale.jpg')}
                            />

                            <Image
                                style={[styles.imageViewAllProducts, { zIndex: 1, backgroundColor: 'white' }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={item.images && item.images.length && item.images[0].src ? { uri: 'https://api.arascamedical.com/wp-content/uploads/2019/03/M5066CC.Philips-Heart-Start-Defibrillator-HS1-with-carrying-case-M5075.jpg' } : require('../assets/img/greyscale.jpg')}
                            />

                            <View style={{ marginTop: 10, padding: 5 }}>
                                <Text style={styles.productType} numberOfLines={2}>{item.name}</Text>
                            </View>

                        </View>
                    </CardView>

                </View>
            </TouchableOpacity>
        )
    }

    //click on banner functionality
    redirectonOfBanner = (item) => {
        if (item.title == "product") {
            debugger
            this.setState({ visible: true })
            // let productDetail = item.product
            this.props.productActions.retrieveProduct(item.product.ID).then((res) => {
                this.setState({ visible: false }, () => {
                    this.props.navigation.navigate('ProductDetailScreen', { productDetail: res.data, })

                })
            }).catch((err) => {
                //
                this.setState({ visible: false })
            })

        }
        if (item.title == "category") {
            let categotry = item.category

            this.props.navigation.navigate('ProductListingScreen', { categotry: categotry })
        }
    }

    //banner images
    _keyExtractor = (item, index) => index + 'flatlist';
    bannerDataImages = ({ item, index }) => {
        return (

            <TouchableOpacity
                key={index}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderRadius: 5,

                }}
                onPress={() => this.redirectonOfBanner(item)}>
                {/* <View> */}
                <CardView
                    // cardElevation={5}
                    // cardMaxElevation={5}
                    // cornerRadius={10}
                    style={styles.cardViewStyle}>

                    <ImageBackground
                        source={{ uri: item.image, }}
                        resizeMode={'stretch'}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        }}
                    >
                        <View style={{ justifyContent: 'flex-end', height: 200 }}>
                            <Pagination
                                dotsLength={this.state.bannerData.length}
                                activeDotIndex={this.state.slider1ActiveSlide}
                                containerStyle={{ paddingTop: 5 }}
                                dotColor={'grey'}
                                dotStyle={{ height: 12, width: 12, borderRadius: 12 / 2 }}
                                inactiveDotColor={'black'}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.8}

                            />
                        </View>

                    </ImageBackground>
                </CardView>
          
            </TouchableOpacity>

        )
    }

    //offersAndbanner images
    _keyExtractor3 = (item, index) => String(item.id);
    offerbannerDataImages = ({ item, index }) => {

        if (item && (item.date_on_sale_from != null) && (item.date_on_sale_to != null)) {

            var countDownDate = new Date(item.date_on_sale_to_gmt).getTime()

            // Update the count down every 1 second
            var days = null
            var hours = null
            var minutes = null
            var seconds = null

            // var x = setInterval(() => {
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            days = Math.floor(distance / (1000 * 60 * 60 * 24));
            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            seconds = Math.floor((distance % (1000 * 60)) / 1000);



            var cardViewAllProductsCategory = {
                height: screenDimensions.width / 2 + 40,
                width: screenDimensions.width / 2 - 40,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            }


            var mainViewAllProducts2 = {
                marginHorizontal: 10, marginVertical: 0,
                height: screenDimensions.width / 2 + 20,
                width: screenDimensions.width / 2 - 50,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            }


            var imageViewAllProductsCategory = {
                // paddingTop:20,
                height: screenDimensions.width / 6,
                width: screenDimensions.width / 4,
                flex: 1,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                alignSelf: 'center'
            }

            // var datetoPass = `${days}D : ${hours}H : ${minutes}M : ${seconds}S`
            var datetoPass = `${hours}H : ${minutes}M : ${seconds}S`

            return (
                <TouchableOpacity activeOpacity={9} onPress={() => this.props.navigation.navigate('ProductDetailScreen', { productDetail: item, dealofTheDayProduct: true, datetoPass: datetoPass })}>
                    <View index={index} style={mainViewAllProducts2}>
                        <CardView
                            cardElevation={2}
                            cardMaxElevation={2}
                            // cornerRadius={10}
                            style={cardViewAllProductsCategory}>
                            <View style={{
                                backgroundColor: 'white',
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                padding: 8,
                                height: screenDimensions.width / 2 + 40,
                                width: screenDimensions.width / 2 - 40,
                            }}>

                                <View style={{ backgroundColor: '#f5f2d0', padding: 2 }}>
                                    <Text style={{ color: 'black', fontSize: 12, fontWeight: 'bold' }}>{'Deal of the day'}</Text>
                                </View>


                                <View style={{ backgroundColor: 'red', padding: 2 }}>
                                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{` Ends In : ${hours}H : ${minutes}M : ${seconds}S `}</Text>
                                </View>
                                {/* <Image
                                    style={[imageViewAllProductsCategory, { position: 'absolute', zIndex: 0 }]}
                                    // resizeMode={'cover'}
                                    // resizeMethod={'cover'}
                                    source={require('../assets/img/greyscale.jpg')}
                                /> */}

                                <Image
                                    style={[imageViewAllProductsCategory, { zIndex: 1, backgroundColor: 'white', marginTop: 10 }]}
                                    resizeMode={'cover'}
                                    //  resizeMethod={'cover'}
                                    source={item.images && item.images[0] && item.images[0].src ? { uri: item.images[0].src } : require('../assets/img/greyscale.jpg')}
                                />




                                <View style={{ marginTop: 5, padding: 5 }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
                                        <TouchableOpacity onPress={() => this.selectItemToWishList(item)}>
                                            <Image source={item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                        </TouchableOpacity>
                                    </View>


                                    <Text style={styles.productType} numberOfLines={2}>{item.name.replace(/&amp;/g, '&')}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.aedPrice} numberOfLines={2}>{`AED ${Number(item.price).toFixed(2)}`}</Text>
                                        <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                                    </View>

                                </View>

                            </View>
                        </CardView>

                    </View>
                </TouchableOpacity>

            )
        }
        else {
            return (


                <TouchableOpacity
                    key={index}
                    style={{
                        // flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // borderRadius: 5,
                        padding: 8,
                        backgroundColor: 'white',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        marginLeft: 10
                    }}
                    onPress={() => this.redirectonOfBanner(item)}>
                    {/* <View> */}
                    <View
                        style={styles.cardViewStyle3}>
                        <Image
                            source={{ uri: item.image }}
                            resizeMode={'stretch'}
                            style={{
                                height: screenDimensions.width / 2 + 20,
                                width: screenDimensions.width / 2 - 50,
                            }}
                        />
                    </View>
                </TouchableOpacity>

            )
        }


        // }
    }

    //retrieve a specific item
    getProductData = (item) => {
        return this.props.productActions.retrieveProduct(item.prod_id).then((response) => {
            let data = response.data
            data.prod_id = item.prod_id
            data.user_id = item.user_id
            data.wishlist_id = item.wishlist_id
            item = data
            return item
        }).catch((err) => {
            //
            debugger
            return item
        })

        //return info
    }

    //remove item from wishlist
    deleteItemFromwishlist = (item, type) => {
        let userInfo = this.props && this.props.user ? this.props.user : null
        let guestID = this.props && this.props.guestID ? this.props.guestID : null

        this.setState({ visible: true })
        let data = {
            'key': key,
            'sec': sec,
            'prod_id': item.prod_id,
            'wishlist_id': item.wishlist_id,
            'user_id': userInfo ? userInfo.id : guestID ? guestID : null
        }
        this.props.wishlistActions.deleteItemFromwishlist(data).then((res) => {
            if (res && res.status == 200) {
                this.getAllWishListItem(type ? type : 'DELETE')
                console.log(res, "delete successfully")
                debugger
                // this.setState({ visible: false })
            }
            else {
                console.log(res)
                debugger
            }
        }).catch((err) => {
            console.log("wishlist errotr", err)
        })
    }

    //get list of all the wishlist items
    getAllWishListItem = (type) => {

        let userInfo = this.props && this.props.user ? this.props.user : null
        let guestID = this.props && this.props.guestID ? this.props.guestID : null

        // if (userInfo) {

        let data = {
            'key': key,
            'sec': sec,
            'user_id': userInfo ? userInfo.id : guestID ? guestID : null
        }

        let userId = userInfo ? userInfo.id : guestID ? guestID : null

        console.log(userId, "userId userIduserIduserIduserId")
        this.props.wishlistActions.getItemsWishlist(data, userId).then((res) => {

            if (res && res.status == 200) {

                console.log(res, "res from ")
                console.log(res.data, "res.data ----res.data.....wishlitems")

                if (res && res.data && res.data.length) {

                    let allData = res.data.map((item, index) => {
                        return (this.getProductData(item))
                    })

                    Promise.all(allData).then((result) => {

                        // result.reduce((a, x) => a.includes(x) ? a : [...a, x], []).sort()
                        console.log(result, "result------wishlist")
                        this.props.wishlistActions.setWishlistItem({ wishlistData: result, totalWishlistItem: result.length })
                        if (type == 'Add') {
                            ToastMessage("Item added successfully to wishlist")

                        }
                        if (type == 'DELETE') {
                            ToastMessage("Item removed from the wishlist successfully")

                        }
                        this.setState({ wishlistItems: result, visible: false })
                    }).catch((error) => {
                        this.setState({ visible: false })
                        console.log(`Error in promises ${error}`)
                    })

                } else {
                    this.setState({ visible: false })

                }

            } else {
                console.log(res.response, "error from get wshlist items")

                this.setState({ visible: false })
                debugger
            }
        }).catch((err) => {
            this.setState({ visible: false })
            console.log("wishlist error", err)
        })
        // } else {

        //     console.log('You need to log in')
        // }


    }

    //select wishlist item second method after selectItemToWishList
    selectWishList = (value) => {

        let userInfo = this.props && this.props.user ? this.props.user : null

        let guestID = this.props && this.props.guestID ? this.props.guestID : null

        debugger
        // if (userInfo) {

        this.setState({ visible: true })
        let data = {
            'key': key,
            'sec': sec,
            'prod_id': value.id,
            'quantity': 1,
            'user_id': userInfo ? userInfo.id : guestID ? guestID : null
        }
        this.props.wishlistActions.addItemToWishlist(data).then((res) => {
            if (res && res.status == 200) {
                this.getAllWishListItem('Add')
                console.log(res, "wishlist response")
                debugger
            }
            else {
                this.setState({ visible: false })
                console.log(res)
                debugger
            }
        }).catch((err) => {
            this.setState({ visible: false })
            console.log("wishlist errotr", err)
        })

        // } else {
        //     ToastMessage('You need to login to access this feature')
        // }

    }

    //Select item to wish list for Featured values
    selectItemToWishList = (value) => {

        if (this.props.wishlistData && this.props.wishlistData.length) {
            let wishlistExist = this.props.wishlistData.find(item => item.prod_id == value.id)
            if (wishlistExist) {
                // ToastMessage("Item is already added in wishlist")
                this.deleteItemFromwishlist(wishlistExist)

            }
            else {
                this.selectWishList(value)
            }
        }
        else {
            this.selectWishList(value)
        }
    }


    //Select item to wish list fro New arrivals ////NOT USING 
    selectItemToWishListNewArrivals = (value) => {

        let newArray = this.state.trainingEquipmentsroducts.map((item) => {
            if (item.id === value.id) {
                return {
                    ...item,
                    check: !item.check
                }
                // item.check = !item.check
                // if (item.check === true) {
                //     this.state.allselectedItemToWishList.push(item);
                //     console.log('selected:' + item.title);
                // } else if (item.check === false) {
                //     const i = this.state.allselectedItemToWishList.indexOf(item)
                //     if (1 != -1) {
                //         this.state.allselectedItemToWishList.splice(i, 1)
                //         console.log('unselect:' + item.title)
                //         return this.state.allselectedItemToWishList
                //     }
                // }
            } else {
                return {
                    ...item
                }
            }
        })
        // console.log(newArray, " this.state.trainingEquipmentsroducts ")
        this.setState({ trainingEquipmentsroducts: newArray })
    }


    //Select item to wish list fro New arrivals //NOT USING
    selectItemToWishProductOnSale = (value) => {

        let newArray = this.state.productsOnSaleItems.map((item) => {
            if (item.id === value.id) {
                return {
                    ...item,
                    check: !item.check
                }
                // item.check = !item.check
                // if (item.check === true) {
                //     this.state.allselectedItemToWishList.push(item);
                //     console.log('selected:' + item.title);
                // } else if (item.check === false) {
                //     const i = this.state.allselectedItemToWishList.indexOf(item)
                //     if (1 != -1) {
                //         this.state.allselectedItemToWishList.splice(i, 1)
                //         console.log('unselect:' + item.title)
                //         return this.state.allselectedItemToWishList
                //     }
                // }
            } else {
                return {
                    ...item
                }
            }
        })
        // console.log(newArray, " this.state.trainingEquipmentsroducts ")
        this.setState({ productsOnSaleItems: newArray })
    }

    //AEDs and Accessories
    _keyExtractor4 = (item, index) => String(item.id);
    adeproducts = ({ item, index }) => {

        let imageUrl
        let wishlistExist = null
        if (item.images && item.images[0] && item.images[0].src) {
            imageUrl = item.images[0].src.slice(0, item.images[0].src.lastIndexOf('.')) + '-300x300' + item.images[0].src.slice(item.images[0].src.lastIndexOf('.'))

        } else {
            imageUrl = null

        }

        if (this.props.wishlistData && this.props.wishlistData.length) {
            wishlistExist = this.props.wishlistData.find(itm => itm.prod_id == item.id)
            // console.log(wishlistExist, "wishlistExist     -------    wishlistExist exist")

            if (wishlistExist != null && wishlistExist != undefined) {
                item['check'] = true
            }
            else {
                item['check'] = false
            }
        }


        // console.elo
        return (

            <TouchableOpacity activeOpacity={9} onPress={() => this.props.navigation.navigate('ProductDetailScreen', { productDetail: item })}>
                <View index={index} style={styles.mainViewAllProducts2}>
                    <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={10}
                        style={styles.cardViewAllProductsCategory}>
                        <View style={{ backgroundColor: 'white', borderRadius: 10, height: screenDimensions.width / 2 + 40 }}>


                            <Image
                                style={[styles.imageViewAllProductsCategory, { position: 'absolute', zIndex: 0, }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={require('../assets/img/greyscale.jpg')}
                            />

                            <ImageBackground
                                style={[styles.imageViewAllProductsCategory, { zIndex: 1, backgroundColor: 'white', }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={imageUrl ? { uri: imageUrl } : require('../assets/img/greyscale.jpg')}
                            >

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', top: 120 }} >
                                    <TouchableOpacity onPress={() => this.selectItemToWishList(item)}>

                                        <Image source={item && item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>

                                </View>


                            </ImageBackground>

                            <View style={{ marginTop: 8, padding: 6 }}>


                                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => this.selectItemToWishList(item)}>
                                        <Image source={item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>
                                </View> */}

                                <Text style={styles.productType} numberOfLines={2}>{item.name.replace(/&amp;/g, '&')}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.aedPrice} numberOfLines={2}>{`AED ${Number(item.price).toFixed(2)}`}</Text>
                                    <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                                </View>

                            </View>

                        </View>
                    </CardView>

                </View>
            </TouchableOpacity>
        )
    }

    //all products 
    _keyExtractor4 = (item, index) => index + 'flatlist4';
    trainingEquipmentsroducts = ({ item, index }) => {
        let imageUrl
        let wishlistExist = null

        if (item.images && item.images[0] && item.images[0].src) {
            imageUrl = item.images[0].src.slice(0, item.images[0].src.lastIndexOf('.')) + '-300x300' + item.images[0].src.slice(item.images[0].src.lastIndexOf('.'))

        } else {
            imageUrl = null

        }
        if (this.props.wishlistData && this.props.wishlistData.length) {
            wishlistExist = this.props.wishlistData.find(itm => itm.prod_id == item.id)
            // console.log(wishlistExist, "wishlistExist     -------    wishlistExist exist")

            if (wishlistExist != null && wishlistExist != undefined) {
                item['check'] = true
            }
            else {
                item['check'] = false
            }
        }


        return (

            <TouchableOpacity activeOpacity={9} onPress={() => this.props.navigation.navigate('ProductDetailScreen', { productDetail: item })}>
                <View index={index} style={styles.mainViewAllProducts2}>
                    <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={10}
                        style={styles.cardViewAllProductsCategory}>
                        <View style={{ backgroundColor: 'white', borderRadius: 10, height: screenDimensions.width / 2 + 40 }}>


                            <Image
                                style={[styles.imageViewAllProductsCategory, { position: 'absolute', zIndex: 0 }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={require('../assets/img/greyscale.jpg')}
                            />

                            <ImageBackground
                                style={[styles.imageViewAllProductsCategory, { zIndex: 1, backgroundColor: 'white' }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={imageUrl ? { uri: imageUrl } : require('../assets/img/greyscale.jpg')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', top: 120 }}>
                                    <TouchableOpacity onPress={() => this.selectItemToWishList(item)}>
                                        <Image source={item && item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>

                                </View>
                            </ImageBackground>

                            <View style={{ marginTop: 10, padding: 6 }}>

                                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => this.selectItemToWishListNewArrivals(item)}>
                                        <Image source={item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>
                                </View> */}


                                <Text style={styles.productType} numberOfLines={2}>{item.name.replace(/&amp;/g, '&')}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.aedPrice} numberOfLines={2}>{`AED ${Number(item.price).toFixed(2)}`}</Text>
                                    <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                                </View>

                            </View>

                        </View>
                    </CardView>

                </View>
            </TouchableOpacity>



        )
    }

    //products on sale
    _keyExtractor5 = (item, index) => index + 'flatlist5';
    productsOnSale = ({ item, index }) => {
        let imageUrl
        let wishlistExist = null

        if (item.images && item.images[0] && item.images[0].src) {
            imageUrl = item.images[0].src.slice(0, item.images[0].src.lastIndexOf('.')) + '-300x300' + item.images[0].src.slice(item.images[0].src.lastIndexOf('.'))

        } else {
            imageUrl = null

        }

        if (this.props.wishlistData && this.props.wishlistData.length) {
            wishlistExist = this.props.wishlistData.find(itm => itm.prod_id == item.id)
            // console.log(wishlistExist, "wishlistExist     -------    wishlistExist exist")

            if (wishlistExist != null && wishlistExist != undefined) {
                item['check'] = true
            }
            else {
                item['check'] = false
            }
        }


        return (

            <TouchableOpacity activeOpacity={9} onPress={() => this.props.navigation.navigate('ProductDetailScreen', { productDetail: item })}>
                <View index={index} style={styles.mainViewAllProducts2}>
                    <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={10}
                        style={styles.cardViewAllProductsCategory}>
                        <View style={{ backgroundColor: 'white', borderRadius: 10, height: screenDimensions.width / 2 + 40 }}>


                            <Image
                                style={[styles.imageViewAllProductsCategory, { position: 'absolute', zIndex: 0 }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={require('../assets/img/greyscale.jpg')}
                            />

                            <ImageBackground
                                style={[styles.imageViewAllProductsCategory, { zIndex: 1, backgroundColor: 'white' }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={imageUrl ? { uri: imageUrl } : require('../assets/img/greyscale.jpg')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', top: 120 }}>
                                    <TouchableOpacity onPress={() => this.selectItemToWishList(item)}>

                                        <Image source={item && item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>

                                </View>
                            </ImageBackground>


                            <View style={{ marginTop: 10, padding: 6 }}>

                                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => this.selectItemToWishListNewArrivals(item)}>
                                        <Image source={item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>
                                </View> */}


                                <Text style={styles.productType} numberOfLines={2}>{item.name.replace(/&amp;/g, '&')}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.aedPrice} numberOfLines={2}>{`AED ${Number(item.price).toFixed(2)}`}</Text>
                                    <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                                </View>

                            </View>

                        </View>
                    </CardView>

                </View>
            </TouchableOpacity >




        )
    }

    //search modal
    modalForSearch = () => {
        return (
            // <Modal
            //     isVisible={this.state.isModalVisible}
            //     backdropColor={'rgba(0,0,0,0.75)'}
            //     backdropOpacity={1}
            //     animationIn="slideInUp"
            //     animationOut="slideOutDown"
            //     animationInTiming={400}
            //     animationOutTiming={400}
            //     backdropTransitionInTiming={500}
            //     backdropTransitionOutTiming={500}
            //     onBackButtonPress={() => this.setState({ isModalVisible: false, searchedArray: [], search: '', autoFocus: false })}
            //     onBackdropPress={() => this.setState({ isModalVisible: false, searchedArray: [], search: '', autoFocus: false })}
            //     style={{ margin: 0, }}
            // >
            <View style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 10, marginTop: 10, }}>
                {/* {this.state.visible7 ? <Spinner /> : null} */}

                <View style={styles.modalView2}>
                    {/* <View style={[styles.modalViewInside, { alignItems: 'center' }]}> */}
                    {/* <View style={{ flexDirection: 'row', flex: 1 }}>
                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 0.1 }} onPress={() => this.setState({ isModalVisible: false, searchedArray: [], search: '', autoFocus: false })}>
                                <View>
                                    <Image source={require('../assets/images/ic_back.png')} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ marginLeft: 20, flex: 0.9, alignSelf: 'flex-start', justifyContent: 'center' }}>
                                <TextInput
                                    ref={input => this.inputref = input}
                                    placeholder={strings.search}
                                    placeholderTextColor={colors.lightfontColor}
                                    value={this.state.searchText}
                                    onChangeText={(text) => this.searchFilterFunction(text)}
                                    style={[styles.searchText, { height: 40 }]}
                                    
                                    keyboardType={'default'}
                                    returnKeyType={'done'}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.reset()}>
                            <View style={[styles.resetView,]}>
                                <Text style={styles.resetTitle}>{strings.reset}</Text>
                            </View>
                        </TouchableOpacity> */}
                    {/* </View> */}


                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(91,37,31,0.12)' }} />
                    <ScrollView>
                        <View style={{ paddingVertical: 10 }}>
                            <FlatList
                                style={{ height: '100%' }}
                                bounces={true}
                                pagingEnabled={true}
                                data={this.state.searchedArray}
                                extraData={this.state.searchedArray}
                                keyExtractor={this._keyExtractor4}
                                renderItem={this.recentSearch}
                                ListEmptyComponent={
                                    (this.state.searchedArray.length == 0) ?
                                        null
                                        :
                                        null
                                }
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>


        )
    }


    modalForSearch2 = () => {
        return (
            <Modal
                isVisible={this.state.isModalVisible2}
                backdropColor={'rgba(0,0,0,0.75)'}
                backdropOpacity={1}
                animationIn="fadeInUp"
                animationOut="fadeOut"
                // animationInTiming={400}
                // animationOutTiming={400}
                // backdropTransitionInTiming={500}
                // backdropTransitionOutTiming={500}
                onBackButtonPress={() => this.setState({ isModalVisible2: false, searchedArray: [], search: '', autoFocus: false })}
                onBackdropPress={() => this.setState({ isModalVisible2: false, searchedArray: [], search: '', autoFocus: false })}
                style={{ margin: 0, alignItems: 'center' }}
            >
                <View style={{ width: screenDimensions.width / 2 + 50, height: screenDimensions.width / 2 - 50, backgroundColor: 'white', marginHorizontal: 10, marginTop: 10, }}>
                    {/* {this.state.visible7 ? <Spinner /> : null} */}
                    <View style={{ paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}><Text style={{ color: colors.appColor, fontSize: 16, fontWeight: 'bold' }}>{'Choose Option'}</Text></View>
                    <TouchableOpacity onPress={() => this.setState({ selectedSearchOption: 'byname', isModalVisible2: false })}>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 5, alignItems: 'flex-start' }}><Text style={{ color: colors.lightfontColor, fontSize: 14, fontWeight: 'bold' }}>{'1. Search by name'}</Text></View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ selectedSearchOption: 'bySKU', isModalVisible2: false })}>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 5, alignItems: 'flex-start' }}><Text style={{ color: colors.lightfontColor, fontSize: 14, fontWeight: 'bold' }}>{'2. Search by SKU'}</Text></View>

                    </TouchableOpacity>

                    {/* <View style={styles.modalView2}>



                    </View> */}
                </View>
            </Modal>


        )
    }
    //search funtions
    searchFilterFunction = (text) => {
        debugger
        debugger
        if (text != '') {
            this.setState({ showReset: true, visible: true })
            let data = {}
            if (this.state.selectedSearchOption == 'By Code') {
                data = {
                    sku: text,
                    per_page: 7,
                    status:'publish'
                    // sku
                }
            } else {
                data = {
                    search: text,
                    per_page: 7,
                    status:'publish'
                    // sku
                }
            }

            this.props.productActions.getAllProducts(data).then((res) => {
                debugger
                if (res && (res.status == 200 || res.status == 201)) {
                    this.setState({
                        searchedArray: res.data,
                        // searchText: text,
                        visible: false,
                        isModalVisible: true
                    })
                }
                else {
                    if (res && res.response && res.response.data && res.response.data.message) {
                        ToastMessage(res.response.data.message)
                        this.setState({
                            searchedArray: [],
                            searchText: text,
                            visible: false,

                        });
                    } else {
                        this.setState({
                            searchedArray: [],
                            searchText: text,
                            visible: false,

                        });
                    }
                }

            }).catch((err) => {
                if (err && err.response && err.response.data && err.response.data.message) {
                    ToastMessage(err.response.data.message)
                    this.setState({
                        searchedArray: [],
                        searchText: text,
                        visible: false,
                        isModalVisible: true
                    });
                } else {
                    this.setState({
                        searchedArray: [],
                        searchText: text,
                        visible: false,
                        isModalVisible: true
                    });
                }
            })
        }
        else {
            this.setState({
                showReset: false,
                searchedArray: [],
                // searchText: text,
                visible: false,
                isModalVisible: false
            })
        }

    }

    handleRefresh = () => {
        this.setState({
            refreshing: true,
            // visible: true
        }, () => {
            this.getAllData();
            // setTimeout(() => {
            //     this.setState({ refreshing: false })

            // }, 2000);


        });
        // this.getAllData();

    }
    //Reset option
    reset = () => {
        this.inputref.clear()
        this.setState({
            searchedArray: [],
            selectedSearchOption: 'By Name', isModalVisible: false, search: '', showReset: false
        })
    }

    //clicked on search item
    redirectAfterSearch = (item) => {
        this.props.customerActions.saveRelatedSearch(item)
        this.props.navigation.navigate('ProductDetailScreen', { productDetail: item })
    }
    //recent research
    _keyExtractor5 = (item, index) => index + 'flatlist5';
    recentSearch = ({ item, index }) => {
        return (

            <TouchableOpacity onPress={() => this.setState({
                isModalVisible: false,
                // searchText:'',
                showReset: false,
                selectedSearchOption: 'By Code', searchedArray: []
            }, () => {
                this.inputref.clear()
                this.redirectAfterSearch(item)
            })}>

                <View key={index} style={{ paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', flex: 0.8, alignItems: 'center' }}>
                            <Image source={require('../assets/images/crossSearch/ic_cross_search.png')} />
                            <Text numberOfLines={2} style={[{ paddingTop: 2, paddingLeft: 10, fontSize: 14, fontWeight: 'bold', color: colors.lightfontColor }]}>{item.name}</Text>

                        </View>
                        <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../assets/images/arrowSearch/ic_arrow_search.png')} />

                        </View>
                    </View>
                    <View style={styles.previousandRecentSearchline} />

                </View>
            </TouchableOpacity>
        )
    }

    //Selected country
    allDataSearchChoice = (val, index, data) => {
        debugger
        this.setState({
            selectedSearchOption: val,
            // searchText:null
        }, () => { })
    }

    categoryPress = (data) => {
        this.setState({visible9:true})
        console.log(data, "category data")
        let apiData = {
            category: data.category_id,
            page: 1,
            per_page: 5,
            // search: this.state.searchedText,
            status: 'publish'
        }
        this.props.productActions.getAllProducts(apiData).then((res) => {

            console.log('get all products listing', res)

            if (res && res.status == 200) {
                this.setState({
                    visible9: false,
                    // dataExit: res.data.length ? true : false,
                    categoryProductData: res.data
                })
            } else {
                this.setState({ visible9: false, })
            }
        }).catch((err) => {
            this.setState({ visible9: false })
        })

    }


    categoryListingDataView = ({ item, index }) => {

        let imageUrl
        let wishlistExist = null
        if (item.images && item.images[0] && item.images[0].src) {
            imageUrl = item.images[0].src.slice(0, item.images[0].src.lastIndexOf('.')) + '-300x300' + item.images[0].src.slice(item.images[0].src.lastIndexOf('.'))

        } else {
            imageUrl = null

        }

        if (this.props.wishlistData && this.props.wishlistData.length) {
            wishlistExist = this.props.wishlistData.find(itm => itm.prod_id == item.id)
            // console.log(wishlistExist, "wishlistExist     -------    wishlistExist exist")

            if (wishlistExist != null && wishlistExist != undefined) {
                item['check'] = true
            }
            else {
                item['check'] = false
            }
        }


        // console.elo
        return (

            <TouchableOpacity key={index} activeOpacity={9} onPress={() => this.props.navigation.navigate('ProductDetailScreen', { productDetail: item })}>
                <View index={index} style={styles.mainViewAllProducts2}>
                    <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={10}
                        style={styles.cardViewAllProductsCategory}>
                        <View style={{ backgroundColor: 'white', borderRadius: 10, height: screenDimensions.width / 2 + 40 }}>


                            <Image
                                style={[styles.imageViewAllProductsCategory, { position: 'absolute', zIndex: 0, }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={require('../assets/img/greyscale.jpg')}
                            />

                            <ImageBackground
                                style={[styles.imageViewAllProductsCategory, { zIndex: 1, backgroundColor: 'white', }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={imageUrl ? { uri: imageUrl } : require('../assets/img/greyscale.jpg')}
                            >

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', top: 120 }} >
                                    <TouchableOpacity onPress={() => this.selectItemToWishList(item)}>

                                        <Image source={item && item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>

                                </View>


                            </ImageBackground>

                            <View style={{ marginTop: 8, padding: 6 }}>


                                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => this.selectItemToWishList(item)}>
                                        <Image source={item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>
                                </View> */}

                                <Text style={styles.productType} numberOfLines={2}>{item.name.replace(/&amp;/g, '&')}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.aedPrice} numberOfLines={2}>{`AED ${Number(item.price).toFixed(2)}`}</Text>
                                    <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                                </View>

                            </View>

                        </View>
                    </CardView>

                </View>
            </TouchableOpacity>
        )
    }


   

    render() {
        return (
            <>
                <View style={[styles.container, styles.AndroidSafeArea]}>
                    <SafeAreaView style={{ flex: 0, backgroundColor: '#00A651' }} />
                    <StatusBar
                        translucent
                        barStyle={"dark-content"}
                        backgroundColor={'#00A651'}
                    />
                    <SafeAreaView
                        style={[{ flex: 1, backgroundColor: '#ffffff' }]} >
                        {/* loader={this.state.visible} */}
                        {this.state.visible || this.state.visible9 ? <Spinner /> : null}

                        <View style={{ flex: 1, backgroundColor: 'white' }}>

                            <View style={{ position: 'absolute' }}>
                                <ImageBackground
                                    source={require('../assets/images/Group/Group.png')}
                                    style={{ width: screenDimensions.width, height: screenDimensions.height / 3, margin: 0, }}                            >
                                </ImageBackground>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
                                <View style={{ flex: 0.8, paddingLeft: 10 }}>
                                    {<Image source={require('../assets/images/appTopIcon/logo.png')} />}
                                </View>

                                <View style={{ flex: 0.2, flexDirection: 'row' }}>
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
                                    <TouchableOpacity onPress={() => this.openFreshChat()}>
                                        <Image source={require('../assets/images/messageIcon/ic_message.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <View style={{ backgroundColor: 'white', marginHorizontal: 10 }}>
                                <TouchableOpacity activeOpacity={9} onPress={() => this.setState({ isModalVisible: true, autoFocus: true })}>

                                    <View style={styles.searchContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ paddingHorizontal: 10, alignItems: 'center', flexDirection: 'row' }}>
                                                <View style={{ flex: 0.1, alignItems: 'center' }}>
                                                    <Image source={require('../assets/images/greySearch/ic_search_gray.png')} />

                                                </View>
                                                <View style={{ flex: 0.6, justifyContent: 'center', alignSelf: 'center' }}>
                                                    <TextInput
                                                        ref={input => this.inputref = input}
                                                        placeholder={strings.whatareyoulooking}
                                                        placeholderTextColor={'rgba(28,28,28,0.44)'}
                                                        value={this.state.searchText}
                                                        onChangeText={(text) => this.searchFilterFunction(text)}
                                                        style={[styles.whatareyoulooking, { height: 40 }]}
                                                        keyboardType={'default'}
                                                        onSubmitEditing={(event) => this.setState({ isModalVisible: true })}
                                                        returnKeyType={'done'}

                                                    />

                                                </View>

                                                {
                                                    this.state.showReset ?
                                                        <TouchableOpacity style={{ flex: 0.2 }} onPress={() => this.reset()}>
                                                            <View style={[styles.resetView,]}>
                                                                <Text style={styles.resetTitle}>{strings.reset}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        :
                                                        null
                                                }

                                                <View style={{ flex: 0.3, borderLeftWidth: 0.5, paddingLeft: 10, borderLeftColor: colors.lightfontColor, backgroundColor: 'transparent', }}>


                                                    <Dropdown
                                                        containerStyle={{ backgroundColor: 'transparent', paddingTop: 10, marginTop: 0, paddingVertical: 0, justifyContent: 'center' }}
                                                        inputContainerStyle={{
                                                            borderBottomColor: 'transparent',
                                                            alignItems: 'center',
                                                        }}

                                                        itemTextStyle={{ fontSize: 12, color: colors.appColor }}
                                                        style={{}}
                                                        textColor={colors.appColor}
                                                        value={this.state.selectedSearchOption}
                                                        baseColor={colors.appColor}
                                                        selectedItemColor={colors.appColor}
                                                        itemColor={colors.lightfontColor}
                                                        labelHeight={0}
                                                        fontSize={14}
                                                        valueExtractor={({ value }) => value}
                                                        data={this.state.allDataSearchChoice}
                                                        onChangeText={(value, index, data) => this.allDataSearchChoice(value, index, data)}
                                                    />

                                                </View>
                                            </View>



                                        </View>
                                    </View>
                                </TouchableOpacity>


                            </View>



                            {this.state.isModalVisible2 ?

                                this.modalForSearch2() : null}

                            {this.state.isModalVisible && this.state.searchedArray.length ?
                                this.modalForSearch()
                                :
                                <ScrollView
                                    refreshControl={
                                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />
                                    }
                                    style={{ flex: 1, marginTop: 10 }}>



                                    {/* <View style={[styles.cardMainView, { marginHorizontal: 10, marginTop: 0 }]}> */}

                                    {(this.state.bannerData.length == 0) ?
                                        ListEmpty2({ state: this.state.visible8, margin: 50 })
                                        :
                                        <View style={[styles.cardMainView, { marginHorizontal: 10, marginTop: 0 }]}>

                                            <CardView

                                                style={styles.cardViewStyle}>
                                                <Carousel
                                                    ref={(c) => { this._carousel = c; }}
                                                    data={this.state.bannerData}
                                                    renderItem={this.bannerDataImages}
                                                    autoplay={true}
                                                    loop={true}
                                                    autoplayInterval={3000}
                                                    sliderWidth={sliderWidth}
                                                    itemWidth={itemWidth}
                                                    onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                                                />
                                            </CardView>
                                        </View>


                                    }

                                    <View style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 5, marginTop: 5 }}>
                                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, }]}>
                                            <View>
                                                <Text style={styles.trending}>{'Shop by Category'}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                            {
                                                this.state.toptencategory.length ?
                                                    this.state.toptencategory.map((item, index) => {
                                                        if (index <= 6) {
                                                            return (
                                                                <TouchableOpacity
                                                                    key={index}
                                                                    onPress={() => this.props.navigation.navigate('ProductListingScreen', { item: item })}>
                                                                    <View style={{ width: screenDimensions.width / 5, paddingBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                                                        {item && item.image && item.image.src ?
                                                                            <Image
                                                                                style={[{ height: 75, width: 75, }, { zIndex: 1, }]}
                                                                                resizeMode={'stretch'}
                                                                                resizeMethod={'resize'}
                                                                                // source={{ uri: 'https://eshop.arascamedical.com/wp-content/uploads/2019/07/31515-MobileAid%C2%AE-Easy-Roll-Modular-Trauma-First-Aid-Station-with-BleedStop-Compact-200-Bleeding-Control-Kit-600x600.jpg' }}
                                                                                source={item && item.image && item.image.src ? { uri: item.image.src } : require('../assets/img/greyscale.jpg')}
                                                                            />
                                                                            :
                                                                            <View style={{ width: 75, height: 75 }} />

                                                                        }
                                                                        <Text style={[styles.productType, { paddingTop: 10, textAlign: 'center' }]} numberOfLines={2}>{item.name}</Text>
                                                                    </View>

                                                                </TouchableOpacity>


                                                            )
                                                        } else if (index == 7) {
                                                            return (
                                                                <TouchableOpacity
                                                                    key={index}
                                                                    onPress={() => this.props.navigation.navigate('CategoriesScreen', { item: item })}>
                                                                    <View key={index} style={{ width: screenDimensions.width / 5, paddingBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                                                        <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', height: 75, width: 75, borderRadius: 75 / 2 }}>
                                                                            <Image

                                                                                resizeMode={'stretch'}
                                                                                resizeMethod={'resize'}
                                                                                // style={{height:75,width}}
                                                                                source={require('../assets/images/menu/ic_menu.png')}
                                                                            // source={item.images && item.images[0] && item.images[0].src ? { uri: 'https://api.arascamedical.com/wp-content/uploads/2019/03/M5066CC.Philips-Heart-Start-Defibrillator-HS1-with-carrying-case-M5075.jpg' } : require('../assets/img/greyscale.jpg')}
                                                                            />
                                                                        </View>

                                                                        <Text style={[styles.productType, { paddingTop: 10, textAlign: 'center' }]} numberOfLines={2}>{'More Categories'}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            )
                                                        }
                                                        else {
                                                            return null
                                                        }

                                                    })
                                                    :

                                                    this.state.visible4 ?
                                                        ListEmpty2({ state: this.state.visible4, margin: 50, content: true })
                                                        :
                                                        null

                                            }
                                        </View>



                                    </View>

                                    <View style={[styles.cardMainViewOffers, { backgroundColor: this.state.visible8 ? 'white' : colors.appColor, marginTop: 0 }]}>
                                        <FlatList
                                            bounces={false}
                                            extraData={this.state}
                                            pagingEnabled={true}
                                            showsHorizontalScrollIndicator={false}
                                            autoplay={true}
                                            scrollEnabled={true}
                                            snapToInterval={300}
                                            horizontal={true}
                                            data={this.state.offersAndBanners}
                                            keyExtractor={this._keyExtractor3}
                                            renderItem={this.offerbannerDataImages}
                                            ListEmptyComponent={
                                                (this.state.offersAndBanners.length == 0) ?
                                                    ListEmpty2({ state: this.state.visible8, margin: 50, content: true })
                                                    :
                                                    null
                                            }
                                        />
                                    </View>
                                    <View style={{ marginTop: 20 }}>
                                        {
                                            this.state.toptencategoryAdmin.length ?
                                                <CarouselUpdate
                                                    // style="slides"
                                                    // scrollViewRef={ref => this.flatlistview = ref}
                                                    itemsPerInterval={3}
                                                    onPressCategory={(data) => this.categoryPress(data)}
                                                    renderItem={this.categoryListingDataView}
                                                    items={this.state.toptencategoryAdmin}
                                                    catergoryData={this.state.categoryProductData}
                                                    visibleStatus={this.state.visible9}
                                                />


                                                :
                                                null
                                        }
                                    </View>

                                    <View style={{ backgroundColor: 'white' }}>
                                        <View style={[styles.trendingProductsView, { marginTop: 20 }]}>
                                            <View>
                                                <Text style={styles.trending}>{'Featured Products'}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductListingScreen', { item: this.state.allFeaturedOItems })}>
                                                {/* <View style={styles.viewAllView}> */}
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={[styles.viewAll, { color: 'black' }]}>{strings.viewAll}</Text>
                                                    <Image style={{ marginLeft: 5 }} source={require('../assets/images/doubleArrow/ic_double_arrow.png')} />
                                                </View>
                                                {/* </View> */}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={{ paddingHorizontal: 20, backgroundColor: 'white' }}>
                                        <FlatList
                                            bounces={false}
                                            extraData={this.state}
                                            pagingEnabled={true}
                                            autoplay={true}
                                            horizontal={true}
                                            snapToInterval={300}
                                            showsHorizontalScrollIndicator={false}
                                            data={this.state.adesandaccessories}
                                            keyExtractor={this._keyExtractor4}
                                            renderItem={this.adeproducts}
                                            automaticallyAdjustContentInsets={true}

                                            ListEmptyComponent={
                                                (this.state.adesandaccessories.length == 0) ?
                                                    ListEmpty2({ state: this.state.visible3, margin: 50, content: true })
                                                    :
                                                    null
                                            }
                                        />
                                    </View>

                                    {/* /*******training equipmemts */}

                                    <View style={{ backgroundColor: 'white' }}>
                                        <View style={[styles.trendingProductsView, { marginTop: 20, backgroundColor: 'white' }]}>
                                            <View>
                                                <Text style={styles.trending}>{'New Arrivals'}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductListingScreen', { item: this.state.newArrivalItems })}>
                                                {/* <View style={styles.viewAllView}> */}
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={[styles.viewAll, { color: 'black' }]}>{strings.viewAll}</Text>
                                                    <Image style={{ marginLeft: 5 }} source={require('../assets/images/doubleArrow/ic_double_arrow.png')} />
                                                </View>
                                                {/* </View> */}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={{ paddingHorizontal: 20, backgroundColor: 'white' }}>
                                        <FlatList
                                            bounces={false}
                                            extraData={this.state}
                                            pagingEnabled={true}
                                            autoplay={true}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            data={this.state.trainingEquipmentsroducts}
                                            keyExtractor={this._keyExtractor4}
                                            renderItem={this.trainingEquipmentsroducts}
                                            automaticallyAdjustContentInsets={true}
                                            ListEmptyComponent={
                                                (this.state.trainingEquipmentsroducts.length == 0) ?
                                                    ListEmpty2({ state: this.state.visible3, margin: 50, content: true })
                                                    :
                                                    null
                                            }
                                        />
                                    </View>



                                    <View style={{ backgroundColor: 'white' }}>
                                        <View style={[styles.trendingProductsView, { marginTop: 5, backgroundColor: 'white' }]}>
                                            <View>
                                                <Text style={styles.trending}>{'Products On Sale'}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductListingScreen', { onsale: true, categotry: { name: 'On sale' } })}>

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={[styles.viewAll, { color: 'black' }]}>{strings.viewAll}</Text>
                                                    <Image style={{ marginLeft: 5 }} source={require('../assets/images/doubleArrow/ic_double_arrow.png')} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={{ paddingHorizontal: 20, backgroundColor: 'white' }}>
                                        <FlatList
                                            bounces={false}
                                            extraData={this.state}
                                            pagingEnabled={true}
                                            autoplay={true}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            data={this.state.productsOnSaleItems}
                                            keyExtractor={this._keyExtractor4}
                                            renderItem={this.productsOnSale}
                                            automaticallyAdjustContentInsets={true}
                                            ListEmptyComponent={
                                                (this.state.productsOnSaleItems.length == 0) ?
                                                    ListEmpty2({ state: this.state.visible6, margin: 50, content: true })
                                                    :
                                                    null
                                            }
                                        />
                                    </View>



                                </ScrollView>


                            }
                        </View>
                    </SafeAreaView>
                </View>
            </>
        )
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        userCommon: state.user,
        userToken: state.login.userToken,
        wishlistData: state.login.wishlistData,
        totalWishListItem: state.login.totalWishListItem,
        userTokenAdmin: state.login.userTokenAdmin,
        unReadMessage: state.login.unReadMessage,
        guestID: state.login.guestID,
        fcm_id: state.user.fcm_id
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        wishlistActions: bindActionCreators(wishlistActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),
        couponActions: bindActionCreators(couponActions, dispatch),
        cartActions: bindActionCreators(cartActions, dispatch),





    };
    //return bindActionCreators({logInUser, showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(Home)

