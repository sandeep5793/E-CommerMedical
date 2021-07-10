import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    TouchableOpacity,
    Linking
} from 'react-native';

//Local imports
import styles from '../styles'
import CustomeButton from '../components/Button'
import { ToastMessage } from '../components/Toast'
import Spinner from '../components/Spinner'
import Header from '../components/Header'
import Container from '../components/Container'
import {
    Freshchat,
    setUser
} from '../components/FreshChat'
import { colors, screenDimensions } from '../utilities/constants';

//GLobal lib
import HTML from 'react-native-render-html';
import firebase from 'react-native-firebase';
import axios from 'axios'

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



class NotificationDetail extends Component {
    constructor(props) {
        super(props);
        let { params } = this.props.navigation.state
        this.state = {
            visible: false,
            productDetail: null
        };

    }

    componentDidMount = () => {
        let { params } = this.props.navigation.state
        if (params && params.notificationData) {
            this.getNotificationReadUnRead(params.notificationData)
        }
        if (params && params.notificationData && params.notificationData.notification_type == 'product') {
            this.getProductDetail(JSON.parse(params.notificationData.product_id))
        }

    }

    getProductDetail = (id) => {
        this.setState({ visible: true })
        this.props.productActions.retrieveProduct(id).then((res) => {
            console.log("Product detail", res.data)
            debugger
            this.setState({ productDetail: res.data, visible: false }, () => {

            })
        }).catch((err) => {
            this.setState({ visible: false })
        })
    }

    //get notification according to read unread
    getNotificationReadUnRead = (notificationData) => {

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
            promotion_title: notificationData.promotion_title,
            promotion_msg: notificationData.promotion_msg
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

    //get notification list
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

    //open link if any in notification
    openLink = (url) => {
        let { params } = this.props.navigation.state

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                ToastMessage(`Invalid url ${url}`)
            }
        });
    }


    //main compoenet for the render
    mainComponent = () => {
        let { params } = this.props.navigation.state

        console.log(params.notificationData, "notificationData")
        let { productDetail } = this.state
        return (
            <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>

                <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{'Title :'}</Text>
                <Text style={{ color: colors.lightfontColor, fontSize: 16, fontWeight: 'bold' }}>{params && params.notificationData ? params.notificationData.promotion_title : ''}</Text>

                <View style={{ height: 10 }} />
                <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{'Message :'}</Text>
                <Text style={{ color: colors.lightfontColor, fontSize: 16, fontWeight: 'bold' }}>{params && params.notificationData ? params.notificationData.promotion_msg : ''}</Text>


                {
                    params && params.notificationData && params.notificationData.notification_type == 'product' ?
                        <View>
                            <View style={{ height: 50 }} />
                            <CustomeButton
                                buttonStyle={styles.buttonStyle}
                                backgroundColor={'#01A651'}
                                title={'View product'}
                                borderColor={'#01A651'}
                                fontWeight={'bold'}
                                fontSize={16}
                                lineHeight={16}
                                activeOpacity={9}
                                onPress={() => this.props.navigation.navigate('ProductDetailScreen', { productDetail: productDetail })}
                                textColor={'#FFFFFF'}
                                icon={require('../assets/images/checkLarge/ic_check.png')}
                            />
                        </View>

                        :
                        null
                }

                {
                    params && params.notificationData && params.notificationData.notification_type == 'web_link' ?
                        <View>
                            <View style={{ height: 25 }} />

                            {
                                params && params.notificationData && (params.notificationData.web_link != "0" || params.notificationData.web_link != 0) ?
                                    <TouchableOpacity
                                        onPress={() => this.openLink(params.notificationData.web_link)}
                                    >
                                        <Text style={{ color: 'blue', fontSize: 16, fontWeight: 'bold' }}>{params.notificationData.web_link}</Text>
                                    </TouchableOpacity>
                                    :
                                    null

                            }
                            <View style={{ height: 25 }} />
                        </View>

                        :
                        null
                }
                {
                    params && params.notificationData && params.notificationData.notification_type == 'web_html' ?
                        <View>
                            <View style={{ height: 25 }} />
                            {
                                params.notificationData.content ?
                                    <HTML html={`${params.notificationData.content}`} />
                                    :
                                    null
                            }
                            {
                                params && params.notificationData && (params.notificationData.web_link_web != "0" || params.notificationData.web_link_web != 0) ?
                                    <TouchableOpacity
                                        onPress={() => this.openLink(params.notificationData.web_link_web)}
                                    >
                                        <Text style={{ color: 'blue', fontSize: 16, fontWeight: 'bold' }}>{params.notificationData.web_link_web}</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                            }
                            <View style={{ height: 50 }} />
                        </View>
                        :
                        null
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
                        <Image source={require('../assets/images/notificationIcon/ic_notification.png')} style={{ marginRight: 10 }} />
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


                    {this.state.visible ? <Spinner /> : null}
                    <Container
                        backButton={true}
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
                        leftItem2={'Notification Detail'}
                        leftItem1Press={() => this.props.navigation.goBack()}
                        viewStyle={{ marginTop: 10, height: screenDimensions.height }}
                        scrollStyle={{ flex: 1, marginTop: 10, }}
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
export default connect(mapStateToProps, mapDispathToProps)(NotificationDetail)

