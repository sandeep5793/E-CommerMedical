import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    Keyboard,
    TouchableOpacity,
   
} from 'react-native';

//Global Libs
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient';
import IconBadge from 'react-native-icon-badge';
import { TextInput } from 'react-native-gesture-handler';


//Local imports
import styles from '../styles'
import strings from '../utilities/languages'
import Validation from '../utilities/validations'
import CustomeButton from '../components/Button'
import { ToastMessage } from '../components/Toast'
import Spinner from '../components/Spinner'
import Container from '../components/Container'
import {
    Freshchat,
    setUser
} from '../components/FreshChat'
import { colors, screenDimensions } from '../utilities/constants';


//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import * as orderActions from '../redux/actions/orderAction'




class TrackOrder extends Component {
    constructor(props) {
        super(props);
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.state = {
            totalWalletMoney: "500.00",
            visible: false,
            orderNumber: "",
            email: 'sandydas11@yopmail.com',
            trackOrderView: true,
            orderStatusView: false,
            orderInfo: null

        };


    }
    componentDidMount() {

    }

    //validation

    ValidationRules = () => {
        let { email, orderNumber } = this.state
        let { lang } = this.props.userCommon
        debugger
        return [

            {
                field: orderNumber,
                name: strings.orderNumber,
                rules: 'required|no_space',
                lang: lang

            },
        ]
    }

    //track your order
    trackOrder = () => {

        if (!this.props.userCommon.netStatus) {
            return this.props.actions.showOptionsAlert('Check your internet connection!')
        }
        else {
            let { orderNumber, email } = this.state
            let validation = Validation.validate(this.ValidationRules())
            if (validation.length != 0) {
                return ToastMessage(validation[0])
            }
            else {
                let data = {
                    "id": orderNumber,
                    // "email": email
                }
                this.setState({ visible: true })
                this.props.orderActions.trackOrder(this.props.user, data).then((res) => {
                    if (res && res.status == 200) {

                        if (res && res.data && res.data.customer_id == this.props.user.id) {
                            debugger
                            console.log("res data for track order", res.data)
                            this.setState({
                                orderInfo: res.data,
                                visible: false,
                                orderStatusView: true,
                                trackOrderView: false
                            })
                        } else {
                            debugger
                            this.setState({ visible: false, })
                            ToastMessage("No orders found with this order id")
                        }

                    } else {
                        ToastMessage("No orders found with this order id")
                        this.setState({ visible: false, })
                    }
                }).catch((err) => {
                    this.setState({ visible: false, })
                    ToastMessage("No orders found with this order id")
                    console.log(err, "err")
                })

            }
        }

    }

    //trackorders view
    trackOrders = () => {
        return (
            <View>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/trackOrder/ic_location.png')} />
                </View>

                <View style={{ paddingHorizontal: 20, paddingTop: 10, }}>
                    <View>
                        <View style={{ marginTop: 30, }}>
                            <Text style={{ color: 'black', fontSize: 14 }}>{'Order ID'}</Text>
                            <TextInput
                                ref={(ref) => { this.cardNumber = ref; }}
                                style={{ height: 45, fontSize: 14 }}
                                value={this.state.orderNumber}
                                onChangeText={(text) => this.setState({ orderNumber: text })}
                                keyboardType={'numeric'}
                                onSubmitEditing={(event) => Keyboard.dismiss()}
                            // onSubmitEditing={(event) => this.email.focus()}

                            />
                        </View>
                        <View style={{ height: 0.5, backgroundColor: 'grey', }} />
                    </View>

                    {/* <View>
                        <View style={{ marginTop: 20, }}>
                            <Text style={{ color: 'black', fontSize: 14 }}>{'Email'}</Text>
                            <TextInput
                                ref={(ref) => { this.email = ref; }}
                                style={{ height: 35, fontSize: 14 }}
                                value={this.state.email}
                                onChangeText={(text) => this.setState({ email: text })}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                                onSubmitEditing={(event) => Keyboard.dismiss()}

                            />
                        </View>
                        <View style={{ height: 0.5, backgroundColor: 'grey', }} />
                    </View> */}


                    <View style={{ marginTop: 20 }}>
                        <CustomeButton

                            buttonStyle={styles.buttonStyle}
                            backgroundColor={'#01A651'}
                            title={'Track Order'}
                            borderColor={'#01A651'}
                            fontWeight={'bold'}
                            fontSize={16}
                            lineHeight={16}
                            activeOpacity={9}
                            onPress={() => this.trackOrder()}
                            textColor={'#FFFFFF'}
                            icon={require('../assets/images/location_icon/ic_location.png')}
                        />
                    </View>

                </View>


            </View>
        )
    }
    orderStatusWithInfo = () => {
        let { orderInfo } = this.state
        return (
            <View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: colors.appColor, fontWeight: 'bold', fontSize: 22 }}>{`Order Number #${this.state.orderInfo.id}`}</Text>
                    {/* <Image source={require('../assets/images/trackOrder/ic_location.png')} /> */}
                </View>

                <View style={{ paddingHorizontal: 20, marginTop: 20 }}>


                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginBottom: 5 }}>

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <LinearGradient
                                colors={['#D6D5DD', '#D2D6DA']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{ height: 5, width: 10, alignItems: 'center', justifyContent: 'center', width: 10 }}
                            />
                        </View>

                        <View style={{ height: 20, width: 20, borderRadius: 20 / 2, backgroundColor: this.state.orderInfo.status != 'completed' ? colors.appColor : colors.appColor }} />

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <LinearGradient
                                colors={this.state.orderInfo.status == 'completed' ? [colors.appColor, colors.appColor] : ['#D6D5DD', '#D2D6DA', '#BEC4CA', '#A4AEB9', '#A4AEB9', '#919DAB']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{ height: 5, width: 200, alignItems: 'center', justifyContent: 'center', width: 200 }}
                            />
                        </View>
                        <View style={{ height: 20, width: 20, borderRadius: 20 / 2, backgroundColor: this.state.orderInfo.status == 'completed' ? colors.appColor : '#919DAB' }} />

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 40 }}>

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <LinearGradient
                                colors={['transparent', 'transparent']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{ height: 1, width: 10, alignItems: 'center', justifyContent: 'center', }}
                            />
                        </View>

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, color: colors.lightfontColor, alignSelf: 'center' }}>{this.state.orderInfo.status != 'completed' ? this.state.orderInfo.status : '       '}</Text>
                        </View>

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <LinearGradient
                                colors={['transparent', 'transparent']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{ height: 1, width: 160, alignItems: 'center', justifyContent: 'center', }}
                            />
                        </View>

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, color: colors.lightfontColor }}>{'completed'}</Text>
                        </View>

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <LinearGradient
                                colors={['transparent', 'transparent']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{ height: 1, width: 10, alignItems: 'center', justifyContent: 'center', }}
                            />
                        </View>
                    </View>



                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <View style={{ alignItems: 'flex-start', flex: 0.5 }}><Text style={{ fontSize: 14, color: colors.lightfontColor }}>Ordered on</Text></View>
                        <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>{moment(new Date(this.state.orderInfo.date_created_gmt)).format('LL')}</Text></View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <View style={{ alignItems: 'flex-start', flex: 0.5 }}><Text style={{ fontSize: 14, color: colors.lightfontColor }}>Estimated Delivery</Text></View>
                        <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>{'3 Business Days'}</Text></View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <View style={{ alignItems: 'flex-start', flex: 0.5 }}><Text style={{ fontSize: 14, color: colors.lightfontColor }}>Payment method</Text></View>
                        <View style={{ alignItems: 'flex-end', flex: 0.5 }}><Text>{this.state.orderInfo ? this.state.orderInfo.payment_method_title : ''}</Text></View>
                    </View>


                    <View style={{ height: 0.5, backgroundColor: colors.lightfontColor, marginBottom: 12 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <View style={{ alignItems: 'flex-start', flex: 0.7 }}><Text style={{ fontSize: 14, color: colors.appColor }} >Total Amount<Text style={{ fontSize: 14, color: colors.lightfontColor }}> (Inc. VAT)</Text></Text></View>
                        <View style={{ alignItems: 'flex-end', flex: 0.3 }}><Text style={{ color: colors.appColor, fontWeight: 'bold' }}>AED {this.state.orderInfo ? Number(this.state.orderInfo.total).toFixed(2) : ''}</Text></View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: colors.lightfontColor, marginBottom: 10 }} />

                </View>



            </View>

        )
    }

    mainComponent = () => {
        return (
            <View style={{ paddingTop: 80, height: screenDimensions.height }}>

                {this.state.trackOrderView ? this.trackOrders() : null}
                {this.state.orderStatusView ? this.orderStatusWithInfo() : null}
                {/* {this.orderStatusWithInfo()} */}


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
                        rightItem={() => this.rightItem()}
                        title={'Track Order'}
                        subtitileFontSize={14}
                        // subtitile={'Settings    '}
                        viewStyle={{ marginTop: 10, }}
                        // scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 75 }}
                        scrollProps={{ showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: 'handled' }}
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
        unReadMessage: state.login.unReadMessage,

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
export default connect(mapStateToProps, mapDispathToProps)(TrackOrder)

