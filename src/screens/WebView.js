import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';

//Local imports

import { ToastMessage } from '../components/Toast'
import {
    Freshchat,
    setUser
} from '../components/FreshChat'

//GLobal lib
import { WebView } from 'react-native-webview';

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import * as wishlistActions from '../redux/actions/wishlistAction'
import * as productActions from '../redux/actions/productAction'
import * as orderActions from '../redux/actions/orderAction'

class WebViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            productDetail: null
        };

    }

    componentDidMount = () => {
    }



    mainComponent = () => {
        let { params } = this.props.navigation.state

        return (
                <WebView
                    source={{ uri: params.url }}
                    style={{ marginTop: 20}}
                />

        )

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

    //opne the webview link
    openLink=()=>{
        let { params } = this.props.navigation.state
        Linking.canOpenURL(params.url).then(supported => {
            if (supported) {
              Linking.openURL(params.url);
            } else {
              ToastMessage(`Invalid url ${params.url}`)
            }
          });
    }

    render() {
        return (
            <View>
                {this.openLink()}
            </View>
        )
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
export default connect(mapStateToProps, mapDispathToProps)(WebViewScreen)

