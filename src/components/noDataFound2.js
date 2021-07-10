import React, { Component } from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

//Local imports
import styles from '../styles';

//Global imports
import {
    DotIndicator,
} from 'react-native-indicators';

export const ListEmpty2 = props => {
    let {
        state,
        margin,
        message
    } = props;

    if (state) {
        return (
            <View style={{ flex: 1, marginVertical: margin, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/images/ARASCA-Animated-Logo-white-light.gif')} style={{ width: 50, height: 50 }} />

                {/* <DotIndicator color='#F6871C' /> */}
            </View>
        )
    }
    else {
        return (
            <View style={{ flex: 1, marginVertical: margin, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.productPrice, { textAlign: 'center' }]}>
                {this.props && this.props.message ? this.props.message() : null}
                </Text>
            </View>
        )
    }
}

