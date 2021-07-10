import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    TouchableOpacity,
    FlatList,
    RefreshControl,
} from 'react-native';

//Global Libs
import IconBadge from 'react-native-icon-badge';

//Local imports
import styles from '../styles'
import Container from '../components/Container'
import { ListEmpty2 } from '../components/noDataFound'
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
import * as wishlistActions from '../redux/actions/wishlistAction'
import * as orderActions from '../redux/actions/orderAction'
import { colors, screenDimensions } from '../utilities/constants';


class YourOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            visible: false,
            refreshToken: null,
            pendingOrderSelected: true,
            completeOrderSelected: false,
            pendingOrders: this.props.usersOrders.pendingOrders,
            completedOrders: this.props.usersOrders.completedOrders,

        };

    }

    componentDidMount = () => {
        this.getAllOrders()

    }

    //get all orders of specific user
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
                    this.setState({ visible: false, refreshing: false, })
                }
                else {
                    this.setState({ visible: false, refreshing: false, })
                }
            } else {
                this.setState({ visible: false, refreshing: false, })
            }
        }).catch((err) => {
            this.setState({ visible: false, refreshing: false, })
        })
    }

    //component for pending orders
    _keyExtractor = (item, index) => index + '_keyExtractor';
    pendingOrdersList = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderDetailScreen', { orderId: item.id, order_key_name: item.id })}>
                <View style={{ paddingHorizontal: 10, paddingBottom: 10, paddingTop: 20 }}>
                    <View style={{ paddingBottom: 5 }}><Text style={{ color: colors.appColor, fontSize: 13 }} numberOfLines={1}>{`Order # ${item.id}`}</Text></View>
                    <View style={{ paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View><Text style={{ color: colors.lightfontColor, fontSize: 13 }} >{`No of Products : ${item.line_items.length}`}</Text></View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: colors.lightfontColor, fontSize: 13 }}>{`TOTAL : ${Number(item.total).toFixed(2)} AED`}</Text>
                            <Image source={require('../assets/images/greyArrowForward/ic_arrow_gray.png')} />
                        </View>

                    </View>
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={{ color: colors.lightfontColor, fontSize: 13 }}>{`Order Status : ${item.status}`}</Text>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: colors.lightfontColor }} />
                </View>
            </TouchableOpacity>
        )
    }

    //Flatlist view all the pending orders
    pendingOrders = () => {
        return (
            <FlatList
                bounces={true}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                data={this.state.pendingOrders}
                keyExtractor={this._keyExtractor}
                renderItem={this.pendingOrdersList}
                automaticallyAdjustContentInsets={true}
                ListEmptyComponent={
                    (this.state.pendingOrders.length == 0) ?
                        ListEmpty2({ state: this.state.visible, margin: this.state.visible ? screenDimensions.height / 3 : screenDimensions.height / 8, message: () => this.message('pending'), loaderStyle: { height: 50, width: 50 } })
                        :
                        null
                }
            />
        )
    }

    //component for complete orders
    _keyExtractor2 = (item, index) => index + '_keyExtractor2';
    completedOrdersList = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderDetailScreen', { orderId: item.id, order_key_name: item.id })}>

                <View style={{ paddingHorizontal: 10, paddingBottom: 10, paddingTop: 20 }}>
                    <View style={{ paddingBottom: 5 }}><Text style={{ color: colors.appColor, fontSize: 13 }} numberOfLines={1}>{`Order # ${item.id}`}</Text></View>
                    <View style={{ paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View><Text style={{ color: colors.lightfontColor, fontSize: 13 }} >{`No of Products : ${item.line_items.length}`}</Text></View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: colors.lightfontColor, fontSize: 13 }}>{`TOTAL : ${Number(item.total).toFixed(2)} AED`}</Text>
                            <Image source={require('../assets/images/greyArrowForward/ic_arrow_gray.png')} />
                        </View>

                    </View>
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={{ color: colors.lightfontColor, fontSize: 13 }}>{`Order Status : ${item.status}`}</Text>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: colors.lightfontColor }} />
                </View>
            </TouchableOpacity>
        )
    }

    //Flatlist view all the complete orders
    completedOrders = () => {
        return (
            <FlatList
                bounces={true}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                data={this.state.completedOrders}
                keyExtractor={this._keyExtractor2}
                renderItem={this.completedOrdersList}
                automaticallyAdjustContentInsets={true}
                ListEmptyComponent={
                    (this.state.completedOrders.length == 0) ?
                        ListEmpty2({ state: this.state.visible, margin: this.state.visible ? screenDimensions.height / 3 : screenDimensions.height / 8, message: () => this.message('completed'), loaderStyle: { height: 50, width: 50 } })
                        :
                        null
                }
            />
        )
    }

    //epmty orders message view
    message = (status) => {
        return (
            <View>
                <Image source={require('../assets/images/graphic/graphic.png')} />

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: 2 }} />
                    <Text style={styles.emptyData}>{`You don't have any ${status} orders`}</Text>
                    <View style={{ height: 2 }} />
                </View>
            </View>
        )
    }

    // main component to show all the orders
    mainComponent = () => {
        return (
            <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flex: 0.5, alignItems: 'center' }} onPress={() => this.setState({ pendingOrderSelected: true, completeOrderSelected: false })}>
                        <View><Text style={{ fontSize: 16, fontWeight: 'bold', color: this.state.pendingOrderSelected ? colors.appColor : '#D9D9D9' }}>{'Pending'}</Text></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flex: 0.5, alignItems: 'center' }} onPress={() => this.setState({ pendingOrderSelected: false, completeOrderSelected: true })}>
                        <View><Text style={{ fontSize: 16, fontWeight: 'bold', color: this.state.completeOrderSelected ? colors.appColor : '#D9D9D9' }}>{'Completed'}</Text></View>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', height: 12, backgroundColor: '#D9D9D9', marginTop: 10, marginHorizontal: 10, borderRadius: 10 }}>
                    <View style={{ height: 5, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, marginLeft: 3, flex: 0.5, backgroundColor: this.state.pendingOrderSelected ? colors.appColor : '#D9D9D9' }} />
                    <View style={{ height: 5, borderTopRightRadius: 10, borderBottomRightRadius: 10, marginRight: 3, flex: 0.5, backgroundColor: this.state.completeOrderSelected ? colors.appColor : '#D9D9D9' }} />
                </View>


                {
                    this.state.pendingOrderSelected ? this.pendingOrders() : null
                }

                {
                    this.state.completeOrderSelected ? this.completedOrders() : null

                }
                <View style={{ height: 40 }} />
            </View>
        )
    }

    //Pull to refresh
    handleRefresh = () => {
        this.setState({
            refreshing: true,
            // visible: true
        }, () => {
            this.getAllOrders();
        });

    }

    //freshchat sdk
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
        return (
            <View style={[styles.container, styles.AndroidSafeArea]}>
                <SafeAreaView style={{ backgroundColor: colors.appColor }} />
                <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }} style={{ backgroundColor: colors.white }}>
                    <StatusBar
                        translucent
                        barStyle={"dark-content"}
                        backgroundColor={'#00A651'}
                    />
                   
                    <Container
                        backButton={true}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        scrollView={true}
                        rightItem={() => this.rightItem()}
                        title={'Your Orders'}
                        scrollStyle={{ flex: 1, marginTop: 10, }}
                        scrollProps={{
                            showsVerticalScrollIndicator: false,
                            refreshControl: <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
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
        usersOrders: state.login.usersOrders,
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

    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(YourOrders)

