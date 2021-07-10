import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    TouchableOpacity,
    FlatList,
} from 'react-native';

//GLobal Libs
import firebase from 'react-native-firebase';


//Local imports and constans
import styles from '../styles'
import CustomeButton from '../components/Button'
import Spinner from '../components/Spinner'
import Header from '../components/Header'
import Container from '../components/Container'
import axios from 'axios'
import { getNotifications, deleteNotifications } from '../utilities/config'
import { colors, screenDimensions } from '../utilities/constants';
import { setNotificationStatus, getNotificationStatus } from '../utilities/config'
import { ListEmpty2 } from '../components/noDataFound';


//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import * as orderActions from '../redux/actions/orderAction'

//Constants 


class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            notificationArray: [],
            refreshing: false
        };


    }


    componentDidMount() {
        let userInfo = this.props && this.props.user ? this.props.user : null
        if (userInfo) {
            this.getNotification()

        }

        this.getNotification()


    }

    //get the all notifications 
    getNotification = () => {
        this.setState({ visible: true })

        let userInfo = this.props && this.props.user ? this.props.user : null

        if (userInfo) {
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
                    this.setState({ notificationArray: res.data.data.data, visible: false, refreshing: false })
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
        else{
            if(this.props.guestID && this.props.userTokenAdmin){
                let header = {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${this.props.userTokenAdmin}`
                    },
                }
                // header.headers['X-WP-Nonce'] = user.id
                axios.get(`${getNotifications}?user_id=${this.props.guestID}`, header).then((res) => {
                    debugger
                    if (res && res.status == 200) {
                        debugger
                        console.log(res, "res")
                        let unreadNotificationArray = res.data.data.data.filter(item => item.is_read == 0)
                        console.log(unreadNotificationArray, "unreadNotificationArray")
                        firebase.notifications().setBadge(unreadNotificationArray.length)
                        this.props.customerActions.setUserUnreadNotification(unreadNotificationArray.length)
                        this.setState({ notificationArray: res.data.data.data, visible: false, refreshing: false })
                        // return res
                    }
                    else {
                        this.setState({ visible: false, refreshing: false })
                    }
                }).catch((err) => {
                    debugger
                    this.setState({ visible: false, refreshing: false })
                })  
            }else{
                this.setState({ notificationArray: [], visible: false, refreshing: false })

            }
        }

    }

    //delete notifications
    deleteNotification = (item) => {
        this.setState({ visible: true })
        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${this.props.userTokenAdmin}`
            },
        }
        // header.headers['X-WP-Nonce'] = user.id
        axios.get(`${deleteNotifications}?id=${item.id}`, header).then((res) => {
            if (res && res.status == 200) {
                debugger
                console.log(res, "res")
                this.getNotification()
                this.setState({ visible: false })
                // this.setState({ notificationArray: res.data.data.data, visible: false })
                // return res
            }
            else {
                this.setState({ visible: false })
            }
        }).catch((err) => {
            debugger
            this.setState({ visible: false })
        })


    }


    // all notiication view
    _keyExtractor3 = (item, index) => index + 'flatlist3';
    
    allNotification = ({ item, index }) => {
        return (
            <View style={{}}>
                <TouchableOpacity
                    onPress={
                        item && (item.order_id != 0 && item.order_id != null) ?
                            () => this.props.navigation.navigate('OrderDetailScreen', { orderId: item.order_id, orderDetailData: item, getNotification: () => this.getNotification() })
                            : () => this.props.navigation.navigate('NotificationDetail', { notificationData: item, getNotification: () => this.getNotification() })
                    }>
                    <View style={{ flexDirection: 'row', flex: 1 }}>

                        <View style={{ flex: 0.1, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => console.log("nothing")}>
                                <Image source={item.type == 1 || item.type == 2 ? require('../assets/images/infoGreen/ic_info_green.png') : require('../assets/images/promotion/ic_promotion.png')} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 0.9, flexDirection: 'row', marginLeft: 5, }}>

                            <View style={{ marginLeft: 5 }}>

                                {
                                    item && item.order_id ?
                                        <View><Text style={[styles.productType, { color: colors.appColor, fontSize: 16 }]} numberOfLines={2}>{`${item.title}  #${item.order_id}`}</Text></View>

                                        :
                                        <View><Text style={[styles.productType, { color: colors.appColor, fontSize: 16 }]} numberOfLines={2}>{`${item.promotion_title}`}</Text></View>

                                }
                                {/* <View style={{ marginTop: 5 }}><Text style={[styles.productType, { color: colors.appColor, fontSize: 16 }]} numberOfLines={2}>{`` : ''}</Text></View> */}

                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {
                                        item && item.order_id ?
                                            <Text style={[styles.aedPrice, { color: colors.lightfontColor, fontSize: 14 }]} numberOfLines={2}>{item.msg}</Text>
                                            :
                                            <Text style={[styles.aedPrice, { color: colors.lightfontColor, fontSize: 14 }]} numberOfLines={2}>{item.promotion_msg}</Text>

                                    }

                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {
                                        item && item.type != 3 ?
                                            <Text style={[styles.aedPrice, { color: colors.lightfontColor, fontSize: 14 }]} numberOfLines={2}>{`Order status: ${item && item.order_status != "" ? item.order_status : item.order.status}`}</Text>
                                            :
                                            null

                                        // <Text style={[styles.aedPrice, { color: colors.lightfontColor, fontSize: 14 }]} numberOfLines={2}>{`Order status: ${item && item.order_status != "" ? item.order_status : item.order.status}`}</Text>

                                    }
                                </View>
                            </View>

                        </View>
                        {item && item.is_read == 0 ?
                            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <View
                                    style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: item && item.is_read == 0 ? colors.appColor : '#ffffff' }}
                                />
                            </View>
                            :
                            null
                        }


                    </View>

                </TouchableOpacity>
                <View style={{ height: 0.5, backgroundColor: 'grey', marginVertical: 10 }} />
            </View>
        )
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true,
            // visible: true
        }, () => {
            this.getNotification();
        });

    }


    mainComponent = () => {
        let userInfo = this.props && this.props.user ? this.props.user : null


        return (
            <View style={{ paddingTop: 10, }}>

                <FlatList
                    bounces={true}
                    extraData={this.state}
                    showsVerticalScrollIndicator={true}
                    data={this.state.notificationArray}
                    keyExtractor={this._keyExtractor3}
                    renderItem={this.allNotification}
                    automaticallyAdjustContentInsets={true}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                />
            </View>
        )

    }

    message = () => {
        return (
           
            <View>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  
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

    rightItem = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Notification')}>
                        <Image source={require('../assets/images/notificationIcon/ic_notification.png')} style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                </View>

                <View>
                    <Image source={require('../assets/images/messageIcon/ic_message.png')} />
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
                        scrollView={this.state.walletAmountSection ? false : true}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        // rightItem={() => this.rightItem()}
                        title={'Notifications'}
                        subtitileFontSize={14}
                        // subtitile={'Settings    '}
                        viewStyle={{ marginTop: 20, height: screenDimensions.height }}
                        scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 150 }}
                        scrollProps={{
                            showsVerticalScrollIndicator: false,
                            keyboardShouldPersistTaps: 'handled',
                            // refreshControl: <RefreshControl
                            //     refreshing={this.state.refreshing}
                            //     onRefresh={this.handleRefresh}
                            // />
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
        userTokenAdmin: state.login.userTokenAdmin,
        guestID: state.login.guestID
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),
    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(Notification)

