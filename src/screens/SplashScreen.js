import React, { Component } from 'react';
import {
    View,

    StatusBar,
} from 'react-native';

//Global libs



//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import * as orderActions from '../redux/actions/orderAction'
import { colors, screenDimensions } from '../utilities/constants';

import Video from 'react-native-video'

class SplashScreen extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {

        setTimeout(() => {
            this.props.navigation.navigate('slider')
            // if (this.props && this.props.user) {
            //     this.props.navigation.navigate('App')
            // }
            // else {
            //     this.props.navigation.navigate('Auth')
            // }
        }, 4500);

    }


    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: null, height: null }}>

                <Video source={require('../assets/video/splash_video.mp4')}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        // opacity: 0.3
                    }}

                    muted={true}
                    repeat={false}
                    resizeMode="cover" />
                <View>{StatusBar.setBackgroundColor('black', true)}</View>
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
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
    };
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(SplashScreen)
