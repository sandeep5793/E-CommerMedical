import {
    Freshchat,
    FreshchatConfig,
    FaqOptions,
    ConversationOptions,
    FreshchatUser,
    FreshchatMessage,
    FreshchatNotificationConfig
} from 'react-native-freshchat-sdk';

import axios from 'axios'

import { freshChatAppKey, freshChatAppId } from '../utilities/config'

var freshchatConfig = new FreshchatConfig(freshChatAppId, freshChatAppKey);

Freshchat.init(freshchatConfig);


const setUser = (props) => {
    debugger
    var freshchatUser = new FreshchatUser();
    console.log(freshchatUser,"freshchatUser")

    if(typeof(props)=='object'){
    freshchatUser.firstName = props.first_name
    freshchatUser.lastName = props.last_name
    freshchatUser.email = props.email
    }
    else{
        freshchatUser.firstName = 'Guest'
        freshchatUser.lastName = JSON.stringify(props)
    }
    // freshchatUser.phoneCountryCode = '+971';
    // freshchatUser.phone = "1234234123";
    Freshchat.setUser(freshchatUser, (error) => {
        // console.log(error);
    });
}


module.exports = {
    Freshchat: Freshchat,
    FreshchatConfig: FreshchatConfig,
    FaqOptions: FaqOptions,
    ConversationOptions: ConversationOptions,
    FreshchatUser: FreshchatUser,
    FreshchatMessage: FreshchatMessage,
    FreshchatNotificationConfig: FreshchatNotificationConfig,
    setUser: (props) => setUser(props)
}
