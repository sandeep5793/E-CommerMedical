import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    Keyboard,
    TouchableOpacity,
    ScrollView,
    Platform,
    FlatList,
    Alert,
    ImageBackground
} from 'react-native';

//Local imports
import styles from '../styles'
import strings from '../utilities/languages'
import Validation from '../utilities/validations'
import TextInputComponent from '../components/TextInput'
import CustomeButton from '../components/Button'
import { ToastMessage } from '../components/Toast'
import backButton from '../assets/img/ic_back.png'
import Spinner from '../components/Spinner'
import homelogo from '../assets/images/logo.png'
import Header from '../components/Header'
import Container from '../components/Container'
import InputField from '../components/InputField'

import { Rating, AirbnbRating } from 'react-native-ratings';

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import * as wishlistActions from '../redux/actions/wishlistAction'
import * as productActions from '../redux/actions/productAction'
import * as orderActions from '../redux/actions/orderAction'
import * as reviewActions from '../redux/actions/reviewAction'

import { colors, screenDimensions } from '../utilities/constants';
import { Switch, TextInput } from 'react-native-gesture-handler';


class ReviewAndStarRating extends Component {
    constructor(props) {
        super(props);
        this.state = {

            visible: false,
            refreshToken: null,
            productInfo: {},
            productInfo2:
            {
                id: 5,
                images: [{
                    src: 'https://test.arascamedical.com/wp-content/uploads/2019/10/ame-nfac-300x300.jpg'
                }],
                name: 'Empty First Aid Wall Mounted Metal Cabinet',
                price: '400.00',
                average_rating: "2"

            },
            rating: 0,
            reviewText: ""

        };

    }

    componentDidMount = () => {

        this.getProductDetails()
    }


    getProductDetails = () => {
        this.setState({ visible: true })
        let { params } = this.props.navigation.state
        this.props.productActions.retrieveProduct(params.product_id).then((response) => {
            if (response && response.status == 200) {
                let data = response.data
                this.setState({
                    productInfo: response.data,
                    visible: false
                })
            } else {
                this.setState({ visible: false })
            }

        }).catch((err) => {
            this.setState({ visible: false })
            debugger
        })
    }

    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
        this.setState({ rating: rating })

    }

    getReview = (rating) => {
        switch (rating) {
            case 1:
                return 'Ok';
            case 2:
                return 'Good';
            case 3:
                return 'Very Good';
            case 4:
                return 'Amazing';
            case 5:
                return 'Excellent';
            default:
                return '';
        }
    }


    submitReview = () => {

        if (this.state.reviewText != "") {
            this.setState({ visible: true })
            let data = {
                "product_id": this.state.productInfo.id,
                "review": this.state.reviewText,
                "reviewer": `${this.props.user.first_name}  ${this.props.user.last_name}`,
                "reviewer_email": this.props.user.email,
                "rating": this.state.rating,
                // "status": "hold"
            }
            debugger
            this.props.reviewActions.createAReview(data).then((res) => {
                debugger
                if (res && (res.status == 200 || res.status == 201)) {
                    debugger
                    if (res && res.data) {
                        debugger
                        if (res.data.status != 'approved' && !res.data.verified) {
                            debugger
                            this.setState({ visible: false, rating: 0, reviewText: "" })
                            ToastMessage("Your review is awaiting approval")
                        }
                        else {
                            this.setState({ visible: false, rating: 0, reviewText: "" })
                            ToastMessage("review uploaded successfully")
                        }
                        // this.setState({ visible: false, rating: 0, reviewText: "" })
                    } else {
                        this.setState({ visible: false })
                    }
                }
            })
        }
        else {
            ToastMessage("Please write some review for the product")
        }






    }
    getProductInfo = () => {
        let { productInfo } = this.state
        return (
            <View>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 0.05, justifyContent: 'center', alignItems: 'center' }}>
                            {/* <TouchableOpacity onPress={() => this.deleteItemFromwishlist(item)}>
                            <Image source={require('../assets/images/deleteGrey/ic_delete.png')} />
                        </TouchableOpacity> */}
                        </View>

                        <View style={{ flex: 0.9, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center', flex: 0.2, borderRadius: 10, }}>
                                {productInfo.images && productInfo.images[0] && productInfo.images[0].src ?
                                    <ImageBackground
                                        style={[{
                                            width: 70, height: 70,
                                            borderRadius: 10,
                                        }, { zIndex: 1, backgroundColor: 'white' }]}
                                        resizeMode={'stretch'}
                                        resizeMethod={'resize'}
                                        source={productInfo.images && productInfo.images[0] && productInfo.images[0].src ? { uri: productInfo.images[0].src } : require('../assets/img/greyscale.jpg')}
                                    />
                                    :
                                    null}
                            </View>
                            <View style={{ marginLeft: 30, flex: 0.8 }}>
                                <View><Text style={styles.productType} numberOfLines={2}>{productInfo && productInfo.name}</Text></View>
                                {
                                    productInfo && productInfo.price ?
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

                                            <Text style={styles.aedPrice} numberOfLines={1}>{`AED ${Number(productInfo.price).toFixed(2)}`}</Text>
                                            <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                                        </View>
                                        :
                                        null
                                }


                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start'
                                }}>
                                    {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ReviewAndStarRating')}>
                                        <Text style={{ color: colors.lightfontColor, fontSize: 12, fontWeight: '100' }}>{'Delieved on '}</Text>
                                    </TouchableOpacity> */}

                                </View>


                            </View>

                        </View>

                    </View>
                    <View style={{ height: 0.5, backgroundColor: 'grey', marginVertical: 10 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: screenDimensions.width / 9, paddingTop: 20, paddingBottom: 30 }}>

                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <AirbnbRating
                            count={5}
                            selectedColor={colors.appColor}
                            reviews={[]}
                            defaultRating={0}
                            size={16}
                            showRating={false}
                            isDisabled={false}
                            onFinishRating={(rating) => this.ratingCompleted(rating)}
                        />

                    </View>

                    <View>
                        <Text style={{ color: colors.appColor, fontSize: 12, fontWeight: 'bold' }}>{this.getReview(this.state.rating)}</Text>
                    </View>

                </View>


                <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white', borderWidth: 0.5, borderRadius: 5, borderColor: colors.lightfontColor, height: screenDimensions.height / 4 }}>
                    <TextInput
                        value={this.state.reviewText}
                        placeholder={'write your review here...'}
                        placeholderTextColor={colors.lightfontColor}
                        style={{ fontSize: 12, }}
                        multiline={true}
                        onChangeText={(text) => this.setState({ reviewText: text })}

                    />
                </View>

                <View style={{
                    // justifyContent: 'flex-end',
                    paddingVertical: 15,
                    // marginHorizontal: 40,
                    backgroundColor: 'transparent',

                }}>
                    <CustomeButton

                        buttonStyle={styles.buttonStyle}
                        backgroundColor={'#01A651'}
                        title={"Submit"}
                        borderColor={'#01A651'}
                        fontWeight={'bold'}
                        fontSize={16}
                        lineHeight={16}
                        activeOpacity={9}
                        onPress={() => this.submitReview()}
                        textColor={'#FFFFFF'}
                        icon={require('../assets/images/submitGreen/ic_submit.png')}
                    />

                </View>



            </View>
        )
    }

    mainComponent = () => {
        return (
            <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>

                {this.getProductInfo()}

            </View>
        )
    }

    rightItem = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Notification')}>
                        <Image source={require('../assets/images/notificationIcon/ic_notification.png')} style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                </View>

                <View>
                    <Image source={require('../assets/images/messageIcon/ic_message.png')} />
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={[styles.container, styles.AndroidSafeArea]}>
                {/* <SafeAreaView style={{ flex: 0, backgroundColor: '#00A651' }} /> */}
                <SafeAreaView style={{ backgroundColor: colors.appColor }} />
                <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }} style={{ backgroundColor: colors.white }}>
                    <StatusBar
                        translucent
                        barStyle={"dark-content"}
                        backgroundColor={'#00A651'}
                    />
                    {/* <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }}
                    style={[{ flex: 1, backgroundColor: '#ffffff' }]} > */}

                    {this.state.visible ? <Spinner /> : null}
                    <Container
                        backButton={true}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        scrollView={true}
                        headerFontSize={22}
                        rightItem={() => this.rightItem()}
                        title={'Write a Review'}
                        viewStyle={{ paddingBottom: 110, marginTop: 20, height: screenDimensions.height }}
                        scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 110 }}
                        scrollProps={{ showsVerticalScrollIndicator: false }}
                        mainComponent={() => this.mainComponent()}

                    />

                </SafeAreaView>
            </View>


        );
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        //userCommon: state.user
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        wishlistActions: bindActionCreators(wishlistActions, dispatch),
        orderActions: bindActionCreators(orderActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        reviewActions: bindActionCreators(reviewActions, dispatch),

    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(ReviewAndStarRating)

