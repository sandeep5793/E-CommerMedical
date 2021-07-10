import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image


} from 'react-native';

//Local imports
import styles from '../styles';

import {
    DotIndicator,
} from 'react-native-indicators';
import { colors } from '../utilities/constants';
import ContentLoader, { Facebook, Instagram, Bullets } from 'react-native-easy-content-loader'

export const ListEmpty2 = props => {
    let {
        state,
        margin,
        message,
        loaderStyle,
        content
    } = props;

    if (state) {
        return (
            <View style={{ flex: 1, marginVertical: margin, justifyContent: 'center', alignItems: 'center' }}>
                {/* <DotIndicator color={colors.appColor} size={10} /> */}
                {
                    content ?
                        <ContentLoader pWidth={["100%", 200, "25%", 45]} active avatar />

                        :
                        <Image source={require('../assets/images/ARASCA-Animated-Logo-white-light.gif')} style={loaderStyle ? loaderStyle : { width: 30, height: 30 }} />

                }




                {/* <ActivityIndicator size={'small'} color={'#F6871C'} /> */}
            </View>
        )
    }
    else {
        return (
            <View style={{ flex: 1, marginVertical: margin, justifyContent: 'center', alignItems: 'center' }}>

                {message && message != null ? message() : null}
            </View>
        )
    }
}

{/* <Text style={[styles.productPrice, { textAlign: 'center' }]}>
    {message != '' || message != null ? message : 'No data found'}
</Text> */}

