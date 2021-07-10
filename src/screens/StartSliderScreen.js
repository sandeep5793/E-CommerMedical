import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    StatusBar
} from 'react-native';

//Local imports
import styles from '../styles'


//global imports
import AppIntroSlider from 'react-native-app-intro-slider';

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import { colors, screenDimensions } from '../utilities/constants';
import * as customerActions from '../redux/actions/customerAction'

import { createAppStack } from '../appNavigation'
const slides = [
    {
        key: 'somethun',
        title: 'Place order \n in 3 simple steps',
        text: 'Search for your product from our wide range Pre-Hospital Medical Equipments',
        image: require('../assets/images/walkthrough/graphic_2.png'),
        // backgroundColor: '#59b2ab',
    },
    {
        key: 'somethun-dos',
        title: '\n',
        text: 'Select product, add it to cart and place order with a secure checkout process',
        image: require('../assets/images/ic_graphic_2.png'),
        // backgroundColor: '#febe29',
    },
    {
        key: 'somethun1',
        title: '\n',
        text: 'Sit back and get your order delivered',
        image: require('../assets/images/graphic-1.png'),
        // backgroundColor: '#22bcb5',
    }
];

class StartSiderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRealApp: false

        }
        this.chooseApp()
    }

    chooseApp = () => {
        debugger
        if (this.props && !this.props.slider) {
            if (this.props && this.props.user) {
                this.props.navigation.navigate('App')
            }
            else {
                this.props.navigation.navigate('Auth')
            }
        }

    }
    _renderItem = ({ item }) => {
        return (
            <View style={[styles.slide, { paddingHorizontal: 20, alignItems: "center", paddingTop: screenDimensions.height / 8 }]}>
                <Text style={styles.titleSlider} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.textSlider, { paddingTop: 35 }]}>{item.text}</Text>
                <View style={{ paddingTop: 20 }}>
                    <Image source={item.image} />
                </View>


            </View>
        );
    }
    
    _onDone = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        this.props.customerActions.toShowSliderOrNot(false)
        this.setState({ showRealApp: true });

    }
    changeStack = () => {
        this.props.navigation.navigate('Auth')
    }
    render() {
        if (this.state.showRealApp) {
            return <View>{this.changeStack()}</View>
        } else {
            return (<View style={[styles.container, { backgroundColor: colors.appColor, justifyContent: 'center', alignItems: 'center' }]}>
                <SafeAreaView style={{ backgroundColor: colors.appColor }} />
                <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }} style={{ backgroundColor: colors.appColor }}>
                    <StatusBar
                        translucent
                        barStyle={"dark-content"}
                        backgroundColor={colors.appColor}
                    />
                    <AppIntroSlider renderItem={this._renderItem} slides={slides} onDone={this._onDone} />
                </SafeAreaView>

            </View>
            )

        }
    }

}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        slider: state.login.slider,
        userCommon: state.user
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
export default connect(mapStateToProps, mapDispathToProps)(StartSiderScreen)

