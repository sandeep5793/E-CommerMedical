import React, { Component } from 'react';

import {
    Text,
    Image,
    View,
    ImageBackground,
    TouchableOpacity
} from 'react-native';

//Local imports
import backButton from "../assets/images/ic_back_arrow.png";
//Constants
import { fonts, colors, screenDimensions } from '../utilities/constants';

export default class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (

            <ImageBackground
                source={require('../assets/images/Group.png')}
                style={{ width: screenDimensions.width, height: 225, margin: 0 }}

            >
            </ImageBackground>




        )
    }
}
