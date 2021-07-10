import React, { Component } from "react";
import { TextInput, View, Text, Image } from "react-native";

//Constants
import { fonts } from "../utilities/constants";

export default class TextInputLabel extends Component {
    render() {
        let { isFocused } = this.props
        let labelStyle = {
            fontSize: !isFocused ? 16 : 16,
            color: !isFocused ? 'rgba(0,0,0,0.56)' : '#388F76',
            fontFamily:fonts.circularStd
        };
        if (this.props.forgot) {
            labelStyle = {
                fontSize: 16,
                color: '#3E3E3E',
            };
        }

        let borderColor = {
            borderColor: !isFocused ? '#C8BEBD' : '#388F76'
        }
        return (
            <View style={{ marginTop: 10 }}>
                <Text style={labelStyle}>{this.props.label}</Text>
                <View style={[this.props.viewTextStyle, { borderColor: borderColor.borderColor, marginTop: 10, paddingLeft: 15 }]}>
                    <View style={{ flex: this.props.rightIcon && this.props.rightIcon != null ? 0.8 : 1 }}>
                        <TextInput
                            style={{
                                height: 45,
                                fontSize: 20,
                                textAlign: 'left',
                                fontWeight: '500',
                                color:'rgba(0,0,0,0.87)',
                                // color: isFocused ? '#5B251F' : '#3E3E3E',
                                fontFamily: fonts.sourcesanspro
                            }}
                            {...this.props}
                            ref={ref => (this.props.inputMenthod ?
                                this.props.inputMenthod(ref) : null)}
                        />
                    </View>
                    {this.props.rightIcon && this.props.rightIcon != null ?
                        <View style={{ paddingHorizontal: 10, flex: 0.2 }}>
                            <Image source={this.props.rightIcon} />
                        </View>

                        :
                        null}
                </View>
            </View>

        )
    }
}