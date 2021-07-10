import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';

//Local imports
import styles from '../styles'

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
//import * as loginActions from '../redux/actions/AuthAction'


class OrderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }

    }
    render() {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>{'welcome to Order screen'}</Text>
            </View>

        )
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        // user: state.login.user,
        userCommon: state.user
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        // loginActions: bindActionCreators(loginActions, dispatch),
    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(OrderScreen)

