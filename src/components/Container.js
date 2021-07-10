import React, { Component } from 'react';

import {
    Text,
    Image,
    View,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    // TextInput,
    Platform
} from 'react-native';

//Local imports
import backButton from "../assets/images/arrowLeftBackWhite/ic_back_arrow.png";
import styles from "../styles";
//Constants
import { fonts, colors, screenDimensions } from '../utilities/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-gesture-handler';
import IconBadge from 'react-native-icon-badge';

export default class Container extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{ height: '100%' }}>
                <View style={{ position: 'absolute', paddingTop: Platform.OS == 'android' ? 0 : 0 }}>
                    <ImageBackground
                        source={require('../assets/images/Group/Group.png')}
                        style={{ width: screenDimensions.width, height: screenDimensions.height / 3 + 20, margin: 0, }}
                    >
                    </ImageBackground>
                </View>

                {this.props && this.props.header ?
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 5 }}>
                        <View style={{ flex: 0.9,  paddingLeft: 10, flexDirection: 'row' }}
                        >
                            {this.props && this.props.leftItem1 ?
                                <TouchableOpacity
                                
                                style={{flex:0.1,alignItems: 'center',justifyContent:'center'}}
                                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                                    onPress={this.props && this.props.leftItem1Press ? this.props.leftItem1Press : console.log('nothing pressed')}
                                >
                                    <Image source={this.props.leftItem1} />

                                </TouchableOpacity>
                                :
                                null
                            }
                            {
                                this.props && this.props.leftItem2 ?
                                    <View style={{ paddingLeft: 5,justifyContent:'center',alignItems:'center',flex:0.8}}>
                                        <Text numberOfLines={this.props && this.props.numberOfLines ? this.props.numberOfLines : 2} style={{ textAlign: 'center', color: 'white', fontSize: this.props && this.props.rightItem2FontSize ? this.props.rightItem2FontSize : 22, fontWeight: 'bold' }}>{this.props.leftItem2}</Text>

                                    </View>
                                    :
                                    null
                            }

                        </View>

                        <View style={{ flex: 0.3,  flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {this.props && this.props.rightItem1 ?
                                <TouchableOpacity 
                                onPress={this.props && this.props.rightItem1Press ? this.props.rightItem1Press : console.log('Pressed')}>
                                    {this.props.notificationCount ?
                                        <IconBadge
                                            MainElement={
                                                <Image source={this.props.rightItem1} style={{ marginRight: 10 }} />
                                            }
                                            BadgeElement={
                                                <Text style={{ color: 'white', fontSize: 10 }}>{this.props.notificationCount}</Text>
                                            }
                                            IconBadgeStyle={{
                                                position: 'absolute',
                                                top: -8,
                                                left: 8,
                                                width: 22,
                                                height: 22,
                                                borderRadius: 22 / 2,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderColor: 'white',
                                                borderWidth: 1,
                                                backgroundColor: 'red'
                                            }}
                                            Hidden={this.props.notificationCount == 0 || this.props.notificationCount == null}
                                        />
                                        :
                                        <Image source={this.props.rightItem1} style={{ marginRight: 10 }} />

                                    }
                                </TouchableOpacity>

                                :
                                null}

                            {this.props && this.props.rightItem2 ?
                                <TouchableOpacity onPress={this.props && this.props.rightItem2Press ? this.props.rightItem2Press : console.log('Pressed')}>
                                    <Image source={this.props.rightItem2} style={{ marginRight: 10 }} />

                                </TouchableOpacity>

                                :
                                null
                            }

                            {this.props && this.props.rightItem3 ?

                                <Text onPress={this.props && this.props.rightItem3Press ? this.props.rightItem3Press : console.log('Pressed')} numberOfLines={2} style={{ paddingLeft: 15, color: 'white', fontSize: 18, fontWeight: '500' }}>{this.props.rightItem3}</Text>

                                :
                                null
                            }

                        </View>

                    </View>
                    :
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 30 }}>
                        <TouchableOpacity style={{ flex: 0.2, paddingLeft: 10 }} onPress={this.props.backButtonFunction}>
                            <View>{this.props && this.props.backButton ? <Image source={backButton} /> : null}</View>

                        </TouchableOpacity>
                        <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: this.props && this.props.headerFontSize ? this.props.headerFontSize : 25, fontWeight: 'bold' }}>
                                {this.props && this.props.title ? this.props.title : 'Login/Signup'}
                            </Text>
                            {
                                this.props && this.props.subtitile ?
                                    <Text style={{ textAlign: 'center', color: 'white', fontSize: this.props && this.props.subtitileFontSize ? this.props.subtitileFontSize : 14, fontWeight: 'bold' }}>
                                        {this.props && this.props.subtitile ? this.props.subtitile : ''}
                                    </Text>
                                    :
                                    null
                            }
                        </View>
                        <View style={{ flex: 0.2 }}>
                            {this.props && this.props.rightItem ? this.props.rightItem() : null}
                        </View>
                    </View>
                }


                {
                    this.props && this.props.searchProps ?
                        <View style={{ backgroundColor: 'white', marginHorizontal: 10 }}>
                            <View style={styles.searchContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ paddingHorizontal: 10, alignItems: 'center', flexDirection: 'row' }}>
                                        <View style={{ flex: 0.1, alignItems: 'center' }}>
                                            <Image source={require('../assets/images/greySearch/ic_search_gray.png')} />

                                        </View>
                                        <View style={{ flex: 0.9, justifyContent: 'center', alignSelf: 'center' }}>
                                            <TextInput
                                                {...this.props.textInputProps()}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>


                        :
                        null
                }




                <View style={{
                    ...this.props.viewStyle,
                    marginTop: 30,
                    marginHorizontal: 10,
                    backgroundColor: 'rgba(238,238,238,0.9)',
                    // backgroundColor: 'yellow',

                    // height: '100%',
                    flex: 1,
                    // borderRadius: 20,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20


                }}
                >

                    {/* <KeyboardAwareScrollView>  */}
                    {this.props && this.props.scrollView ?
                        // <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                        <ScrollView
                            keyboardShouldPersistTaps={'handled'}
                            style={this.props && this.props.scrollStyle ? this.props.scrollStyle : {}}
                            showsVerticalScrollIndicator={false}

                            {...this.props.scrollProps}>
                            {this.props && this.props.mainComponent()}
                        </ScrollView>
                        // </KeyboardAwareScrollView>

                        :
                        this.props && this.props.mainComponent()

                    }

                    {/* </KeyboardAwareScrollView> */}

                    {/* <ScrollView keyboardShouldPersistTaps={'handled'} style={this.props && this.props.scrollStyle ? this.props.scrollStyle : {}} {...this.props.scrollProps}>
                    </ScrollView> */}
                    {/* {
                    this.props && this.props.bottomComponent ?
                        this.props.bottomComponent()
                        :
                        null
                } */}
                </View>


            </View>





        )
    }
}
