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
import CardView from 'react-native-cardview'
import {
    Freshchat,
    setUser
} from '../components/FreshChat'


import { setNotificationStatus, getNotificationStatus } from '../utilities/config'
import axios from 'axios'

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
import IconBadge from 'react-native-icon-badge';


class NotificationSetting extends Component {
    constructor(props) {
        super(props);
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.state = {
            totalWalletMoney: "500.00",
            visible: false,
            onSelectedYes: this.props.userNotification.onSelectedYes,
            onSelectedNo: this.props.userNotification.onSelectedNo

        };


    }
    componentDidMount() {
        // this.getNotificationStatus()
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
            if (res && res.status == 200) {

                if (res && res.data && res.data.user && res.data.user.is_push_notification == "1") {

                    // this.setState({
                    //     onSelectedYes: true
                    // })
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
                    // this.setState({
                    //     onSelectedNo: true
                    // })
                }
                debugger
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })
    }



    setNotificationStatus = () => {

        let header = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${this.props.userTokenAdmin}`
            }
        }
        let data = {
            "is_push_notification": this.state.onSelectedYes ? 1 : 2
        }

        return axios.post(`${setNotificationStatus}`, data, header).then((res) => {
            if (res && res.status == 200) {
                debugger
                this.props.customerActions.setUserNotification({
                    onSelectedYes: this.state.onSelectedYes ? true : false,
                    onSelectedNo: this.state.onSelectedNo ? true : false,
                })
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })
    }


    notificationMain = () => {
        return (
            <View>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/notificationGreen/ic_notification_big.png')} />
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                    <Text style={{ textAlign: 'center', color: colors.black, fontSize: 14 }}>{'Do you want to recieve notifications related to \n your orders and new promotions'}</Text>
                </View>

                <View style={{ flexDirection: 'row', height: 70, justifyContent: 'center', marginTop: 40 }}>
                    <TouchableOpacity onPress={() => this.setState({ onSelectedYes: true, onSelectedNo: false }, () => {
                        this.setNotificationStatus()
                    })}>
                        <View style={{ borderWidth: 1, borderColor: colors.appColor, borderRadius: 15, flexDirection: 'row', marginRight: 5, height: 32, width: 100, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: this.state.onSelectedYes ? colors.appColor : 'rgba(238,238,238,0.9)', }}>
                            <Image style={{ alignSelf: 'center' }} source={this.state.onSelectedYes ? require('../assets/images/radioBusiness/ic_radio.png') : require('../assets/images/radioOff/ic_radio_off.png')} />
                            <Text style={[styles.individualAndBusiness, { color: this.state.onSelectedYes ? '#FFFFFF' : colors.appColor }]}>{'   Yes'}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.setState({ onSelectedYes: false, onSelectedNo: true }, () => {
                        this.setNotificationStatus()
                    })}>
                        <View style={{ borderWidth: 1, borderColor: colors.appColor, borderRadius: 15, flexDirection: 'row', height: 32, width: 100, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: this.state.onSelectedNo ? colors.appColor : 'rgba(238,238,238,0.9)', }}>
                            <Image style={{ alignSelf: 'center' }} source={this.state.onSelectedNo ? require('../assets/images/radioBusiness/ic_radio.png') : require('../assets/images/radioOff/ic_radio_off.png')} />
                            <Text style={[styles.individualAndBusiness, , { color: this.state.onSelectedNo ? '#FFFFFF' : colors.appColor }]}>{'   No'}</Text>
                        </View>
                    </TouchableOpacity>

                </View>


            </View>
        )
    }


    openFreshChat = () => {
        setUser(this.props.user)
        Freshchat.showConversations()
    }


    mainComponent = () => {
        return (
            <View style={{ paddingTop: 70, height: screenDimensions.height }}>

                {this.notificationMain()}



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
                        title={'Notifications'}
                        subtitileFontSize={14}
                        subtitile={'Settings    '}
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
        userToken: state.login.userToken,
        userTokenAdmin: state.login.userTokenAdmin,
        userNotification: state.login.userNotification,
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
export default connect(mapStateToProps, mapDispathToProps)(NotificationSetting)

