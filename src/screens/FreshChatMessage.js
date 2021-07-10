import React, { Component } from 'react';
import {
    View,
} from 'react-native';

import {
    Freshchat,
    FreshchatConfig,
    FaqOptions,
    ConversationOptions,
    FreshchatUser,
    FreshchatMessage,
    FreshchatNotificationConfig
} from 'react-native-freshchat-sdk';

//local imports and consts
import { freshChatAppKey, freshChatAppId } from '../utilities/config'

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import * as productActions from '../redux/actions/productAction'
import * as cartActions from '../redux/actions/cartAction'
import * as orderActions from '../redux/actions/orderAction'

class FreshChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount = () => {

        //Set user for freshChat
        var freshchatConfig = new FreshchatConfig(freshChatAppId, freshChatAppKey);
        Freshchat.init(freshchatConfig);

        var freshchatUser = new FreshchatUser();
        freshchatUser.firstName = this.props.user.first_name;
        freshchatUser.lastName = this.props.user.last_name;
        freshchatUser.email = this.props.user.email;
        // freshchatUser.phoneCountryCode = '+971';
        // freshchatUser.phone = "1234234123";
        Freshchat.setUser(freshchatUser, (error) => {

            // console.log(error);
        });
    }
  

    render() {
        //     
        return (
            <View>
                {Freshchat.showConversations()}
            </View>
        )
    }

}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        userToken: state.login.userToken,
        userCommon: state.user,
        userTokenAdmin: state.login.userTokenAdmin,
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        cartActions: bindActionCreators(cartActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),
    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(FreshChatScreen)
