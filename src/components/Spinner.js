


import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Toast,
    Modal,
    Text,
    ActivityIndicator
} from 'react-native';

//Global imports
import {
    DotIndicator,
} from 'react-native-indicators';
import { colors } from '../utilities/constants';
// import Modal from 'react-native-modal'

export default class Spinner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false
        }
    }
    render() {
        return (
            this.props.loader ?
                <Modal
                    transparent={true}
                    animationType={'none'}

                    visible={this.props.loader}
                    onRequestClose={() => { console.log('close modal') }}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <Image source={require('../assets/images/ARASCA-Animated-Logo-white-light.gif')} style={{ width: 50, height: 50 }} />

                            {/* <ActivityIndicator
                                animating={this.state.loader} /> */}
                        </View>
                    </View>
                </Modal>
                :
                <View style={styles.loading}>
                    <View style={{ zIndex: 100000000,justifyContent:'center' ,alignItems:'center'}}>
                        <Image source={require('../assets/images/ARASCA-Animated-Logo-white-light.gif')} style={{ width: 50, height: 50 }} />
                        {this.props.messsgaeBelow?
                        <Text style={{fontSize:16,fontWeight:'bold',textAlign:'center'}}>{this.props.messsgaeBelow}</Text>
                        :
                        null}
                    </View>
                    {/* <DotIndicator color={colors.appColor} size={10}/> */}
                </View>

        );
    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        display: 'flex',
        top: 0,
        justifyContent: 'center',
        bottom: 0,
        alignItems: 'center',
        zIndex: 10,
        // opacity: 0.6,
        backgroundColor: 'rgba(245,245,245,0.6)'
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
        // backgroundColor: 'white',

        opacity: 0.9

    },
    activityIndicatorWrapper: {
        backgroundColor: 'transparent',
        height: 100,
        width: 100,
        borderRadius: 10,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }


});


