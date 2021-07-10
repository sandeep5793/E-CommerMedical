import React, { Component } from "react";
import { TextInput, View, Text, Image } from "react-native";

//Constants
import { fonts, colors } from "../utilities/constants";

export default class InputField extends Component {
    render() {
        let { isFocused } = this.props
        let labelStyle = {
            fontSize: !isFocused ? 16 : 16,
            color: colors.lightfontColor,
            fontWeight: 'bold',
            // color: !isFocused ? 'rgba(0,0,0,0.56)' : '#388F76',
            fontFamily: fonts.helveticaNeue
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={labelStyle}>
                        {this.props && this.props.label ? this.props.label : ''}
                        {
                            this.props && this.props.sublabel ?
                                <Text style={this.props.sublabelStyle}>{this.props && this.props.sublabel ? this.props.sublabel : ''}</Text>
                                :
                                null
                        }
                    </Text>
                    {
                        this.props && this.props.rightIcon ?
                            <Image source={this.props.rightIcon} />
                            :
                            null
                    }

                </View>

                <View style={{ flex: 1 }}>
                    <TextInput
                        style={{
                            height: 40,
                            fontSize: this.props.fontSize?this.props.fontSize:17,
                            textAlign: 'left',
                            fontWeight: '500',
                            color: 'rgba(0,0,0,0.87)',
                            fontFamily: fonts.sourcesanspro
                        }}

                        {...this.props}
                        ref={ref => (this.props.inputMenthod ?
                            this.props.inputMenthod(ref) : null)}
                    />
                    <View style={{ height: 1, backgroundColor: '#C6C6C4' }} />
                </View>
            </View>

        )
    }
}