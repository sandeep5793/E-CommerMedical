import React, { Component } from 'react';

import {
    Text,
    Image,
    View,
    TouchableOpacity
} from 'react-native';

//Constants
import { fonts } from '../utilities/constants';

export default class CustomeButton extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <TouchableOpacity
                
                enabled={this.props && this.props.enabled ? this.props.enabled : true}
                onPress={() => this.props.onPress ? this.props.onPress() : null}
                activeOpacity={this.props.activeOpacity ? this.props.activeOpacity : 0}
                style={{
                    borderColor: this.props.borderColor ? this.props.borderColor : '#F6871C',
                    backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : 'white',
                    ...this.props.buttonStyle,
                }}>

                {
                    this.props.icon ?
                        <View style={{ flex: 0.15, paddingLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={this.props.icon} style={{ alignSelf: 'center' }} />
                        </View>
                        :
                        null
                }

                <View style={this.props.buttonPadding || [{ paddingVertical: this.props.veriticalPadding ? this.props.veriticalPadding : 20, alignItems: 'center', justifyContent: 'center', flex: 0.7 }]}>
                    <Text style={{
                        color: this.props.textColor ? this.props.textColor : '#FFFFFF',
                        lineHeight: this.props.lineHeight ? this.props.lineHeight : 18,
                        fontSize: this.props.fontSize ? this.props.fontSize : 12,
                        fontWeight: this.props.fontWeight ? this.props.fontWeight : null,
                        fontFamily: this.props.fontFamily ? this.props.fontFamily : fonts.circularStd,
                        textAlign: this.props.textAlign ? this.props.textAlign : null,
                    }}>
                        {this.props.title}
                    </Text>
                </View>

                {
                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                        {this.props.icon2 ?
                            <Image source={this.props.icon} style={{ alignSelf: 'center' }} />
                            : null}
                    </View>

                }


            </TouchableOpacity>
        )
    }
}
