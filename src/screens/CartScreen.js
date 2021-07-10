import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    ImageBackground,
    Alert,
    ActivityIndicator
} from 'react-native';

//Local imports
import styles from '../styles'
import Spinner from '../components/Spinner'
import cart from '../assets/images/ic_cart.png'
import { ListEmpty2 } from '../components/noDataFound'
import Container from '../components/Container'
import {
    Freshchat,
    setUser
} from '../components/FreshChat'

//global libs
import IconBadge from 'react-native-icon-badge';
import cloneDeep from 'clone-deep';
// import SafeAreaView from 'react-native-safe-area-view';


//contants
const sliderWidth = Dimensions.get("window").width - 100;
const itemWidth = Dimensions.get("window").width - 100;

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
//Actions
import * as userActions from '../redux/actions/userAction';
import * as productActions from '../redux/actions/productAction'
import * as cartActions from '../redux/actions/cartAction'

import { screenDimensions, colors } from '../utilities/constants';
import { ScrollView } from 'react-native-gesture-handler';
import CustomeButton from '../components/Button'
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ToastMessage } from '../components/Toast';
var willFocusSubscription = null



class CartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '4202, Tabuk St , Riyadh',
            cartItems: 3,
            cartData: this.props.allCartItems,
            adesandaccessories: [],
            trainingEquipmentsroducts: [],
            allCategory: [],
            products: [],
            visible: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            searchedText: '',
            totalAmount: this.props.allCartValues.totalAmount,
            totalVat: this.props.allCartValues.totalVat,
            pageNO: 1,
            refreshing: false,
            allDataToSave: this.props && this.props.allCartItems.length ? this.props.allCartItems : [],
            allItemInCartNow: [],
        }
    }
    componentDidMount = () => {

    }

    openFreshChat = () => {
        if (this.props.user && this.props.user.id) {
            setUser(this.props.user)
            Freshchat.showConversations()
        } else {
            setUser(this.props.guestID)
            Freshchat.showConversations()
            // ToastMessage('You need to login to access this feature.')  
        }

    }



    getAllCartInfo = () => {

        Promise.all([
            this.getAllCartItems(),
            this.getTotalCartValue(),
            // this.getCartCount()
        ]).then(() => {
            // console.log('All promices are resolved');
            this.setState({ visible2: false });
        }).catch((error) => {
            // console.log('promise all error: ', error);
            this.setState({ visible2: false });
        });

    }

    clearCart = () => {
        this.props.cartActions.clearCart(this.props.user).then((res) => {
            this.props.cartActions.setAllCartItems(res.data)
            this.props.cartActions.setAllCartItemsData([])
            this.props.cartActions.setAllCartItemsTotalAmount({
                "totalAmount": 0,
                "totalVat": 0,
            })
            debugger
        }).catch((err) => {
            debugger
        })
    }


    //Get Cart item count
    getCartCount = () => {
        return this.props.cartActions.getCartCount(this.props.user).then((res) => {
            debugger
            this.props.cartActions.setAllCartItems(res.data)
            console.log(res)
        }).catch((err) => {
            console.log("Errr", err)
        })
    }


    //get Total cart value
    getTotalCartValue = () => {
        return this.props.cartActions.getTotalCartValue(this.props.user).then((res) => {
            if (res && res.status == 200) {
                console.log(res.data, "totalAmount")
                this.props.cartActions.setAllCartItemsTotalAmount({
                    "totalAmount": res.data.subtotal,
                    "totalVat": res.data.subtotal_tax,
                })
                this.setState({
                    visible2: false,
                    // cartData: data 
                }, () => console.log(""))
            }
        }).catch((err) => {
            console.log(err, "Err")
        })
    }


    //get All Items in cart
    getAllCartItems = () => {


        // this.setState({ visible: true })
        return this.props.cartActions.getAllItemInCart(this.props.user).then((res) => {

            if (res && res.status == 200) {
                if (res && res.data && typeof (res.data) == 'object') {
                    let data = Object.keys(res.data).map(val => {
                        return { ...res.data[val], parentId: val };
                    });
                    debugger
                    let allData = data.map((item, index) => {
                        return (this.getProductData(item))
                    })
                    debugger
                    Promise.all(allData).then((result) => {
                        console.log(result, "result data --------result data")
                        debugger
                        this.props.cartActions.setAllCartItemsData(result)
                        this.setState({ visible: false, visible2: false })


                    }).catch((error) => {
                        this.setState({ visible: false, visible2: false, visible: false })
                        console.log(`Error in promises ${error}`)
                    })

                }
                else {
                    this.setState({ visible: false, visible2: false, visible: false })

                }
            }
            else {
                this.setState({ visible: false, visible2: false, visible: false })

            }


        }).catch((err) => {
            this.setState({ visible: false, visible2: false, visible: false })

            console.log("err", err)
        })

    }


    getProductData = (item) => {

        return this.props.productActions.retrieveProduct(item.product_id).then((response) => {
            if (response && (response.status == 200 || response.status == 201)) {
                debugger
                console.log("retrive data for a productActions", response.data)
                item.stock_quantity = response.data.stock_quantity
                item.stock_status = response.data.stock_status
                item.product_price_number = JSON.parse(response.data.price)

                return item
            }
            else {
                return item
            }
        }).catch((err) => {
            //
            debugger
            return item
        })

        //return info
    }

    //remove item completely from cart
    removeItemFormCart = (item, index) => {
        debugger
        // this.setState({ visible2: true })
        console.log(item, "item")
        let newData = cloneDeep(this.props.allCartItems);


        const data = newData.filter((itm) => itm.id !== item.id);

        if (data) {


            console.log(data, "data after delete")

            this.setState({ visible2: false })
            var total = 0;
            var totalItemsInCart = 0
            for (var i = 0; i < data.length; i++) {

                total += Number(data[i].price);
                totalItemsInCart += Number(data[i].quantity);

            }
            this.props.cartActions.setAllCartItemsTotalAmount({
                "totalAmount": total,
                "totalVat": 0,
            })
            this.props.cartActions.setAllCartItems(totalItemsInCart)

            console.log(this.props.allCartItems, "this.props.allCartItems")
            this.props.cartActions.setAllCartItemsData(data)

        } else {
            this.setState({ visible2: false })

        }

        // let data = {
        //     "cart_item_key": item.key,
        //     "return_cart": true,
        //     "thumb": true
        // }
        // this.props.cartActions.removeItemFromCart(data, this.props.user).then((res) => {
        //     let data = Object.keys(res.data).map(val => {
        //         return { ...res.data[val], parentId: val };
        //     });
        //     this.getTotalCartValue()
        //     this.props.cartActions.setAllCartItemsData(data)
        //     this.setState({
        //         visible2: false,
        //         // cartData: data 
        //     }, () => console.log(""))
        // }).catch((err) => {
        //     this.setState({ visible2: false })
        // })
    }

    //remove item completely from cart by delete button
    removeItemByDeleteButton = (item, index) => {
        Alert.alert(
            'warning',
            'Are you sure you want to remove the item?',
            [
                {
                    text: 'cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Ok', onPress: () => this.removeItemFormCart(item, index) },
            ],
            { cancelable: false },
        )
    }

    //add and update item to cart
    addData = (item2, index) => {
        debugger


        if ((item2.stock_quantity == item2.quantity) && (!item2.backorders_allowed)) {
            ToastMessage("Stock limit reached")

        }
        else {
            this.setState({ visible2: true })
            // let data = {
            //     "cart_item_key": item2.key,
            //     "quantity": item2.quantity + 1,
            //     "return_cart": true,
            //     "refresh_totals": true,
            //     "thumb": true

            // }

            debugger

            if (this.props.allCartItems.length) {

                let newData = cloneDeep(this.props.allCartItems);

                const newArray = newData.map(val => {

                    if (val.id === item2.id) {

                        val['price'] = Number(item2.regular_price) * (Number(item2.quantity) + 1)
                        val['quantity'] = Number(item2.quantity) + 1
                        return val
                    }
                    return val
                })


                var total = 0;
                var totatVat = 0
                var totalItemsInCart = 0
                for (var i = 0; i < newArray.length; i++) {
                    let taxexist = 0
                    if (newArray[i].tax_status == "taxable") {
                        debugger
                        taxexist = this.props.allTaxData.find(x => x.class == newArray[i].tax_class)
                        debugger
                        if (taxexist) {
                            debugger
                            newArray[i].tax_value = (Number(newArray[i].price) * (Number(taxexist.rate) / 100))
                            debugger
                            totatVat += newArray[i].tax_value
                            // totatVat += (Number(newArray[i].price) * (Number(taxexist.rate) / 100))
                        }
                    }
                    total += Number(newArray[i].price);
                    totalItemsInCart += Number(newArray[i].quantity);
                }
                this.props.cartActions.setAllCartItemsTotalAmount({
                    "totalAmount": total,
                    "totalVat": totatVat,
                })
                this.props.cartActions.setAllCartItems(totalItemsInCart)


                setTimeout(() => {
                    this.setState({

                        visible2: false,

                    }, () => {
                        // ToastMessage("Item added succesfully to cart")
                        this.props.cartActions.setAllCartItemsData(newArray)
                    })
                }, 1000);

                // this.setState({ allDataToSave: newArray }, () => {
                //     setTimeout(() => {
                //         this.setState({

                //             visible2: false,

                //         }, () => {
                //             // ToastMessage("Item added succesfully to cart")
                //             this.props.cartActions.setAllCartItemsData(this.state.allDataToSave)
                //         })
                //     }, 1000);

                // })
            }


            // this.props.cartActions.updateItemInCart(data, this.props.user).then((res) => {
            //     if (res && res.status == 200) {
            //         debugger
            //         let data = Object.keys(res.data).map(val => {
            //             return { ...res.data[val], parentId: val };
            //         });
            //         this.getTotalCartValue()
            //         this.props.cartActions.setAllCartItemsData(data)


            //     }
            //     else {
            //         this.setState({ visible2: false })

            //     }
            // }).catch((err) => {
            //     debugger
            //     this.setState({ visible2: false })
            // })
        }


    }

    //remove and update item in cart
    removeData = (item2, index) => {

        if (item2.quantity == 1) {
            Alert.alert(
                'warning',
                'Are you sure you want to remove the item?',
                [
                    {
                        text: 'cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'Ok', onPress: () => this.removeItemFormCart(item2, index) },
                ],
                { cancelable: false },
            )
        }
        else {

            this.setState({ visible2: true })

            if (this.props.allCartItems.length) {

                let newData = cloneDeep(this.props.allCartItems);

                const newArray = newData.map(val => {

                    if (val.id === item2.id) {

                        val['price'] = Number(item2.regular_price) * (Number(item2.quantity) - 1)
                        val['quantity'] = Number(item2.quantity) - 1
                        return val
                    }
                    return val
                })


                var total = 0;
                var totatVat = 0
                var totalItemsInCart = 0
                for (var i = 0; i < newArray.length; i++) {
                    let taxexist = 0
                    if (newArray[i].tax_status == "taxable") {
                        debugger
                        taxexist = this.props.allTaxData.find(x => x.class == newArray[i].tax_class)
                        debugger
                        if (taxexist) {
                            debugger
                            newArray[i].tax_value = (Number(newArray[i].price) * (Number(taxexist.rate) / 100))
                            debugger
                            totatVat += newArray[i].tax_value
                            // totatVat += (Number(newArray[i].price) * (Number(taxexist.rate) / 100))
                        }
                    }
                    total += Number(newArray[i].price);
                    totalItemsInCart += Number(newArray[i].quantity);

                }

                this.props.cartActions.setAllCartItemsTotalAmount({
                    "totalAmount": total,
                    "totalVat": totatVat,
                })
                this.props.cartActions.setAllCartItems(totalItemsInCart)

                setTimeout(() => {
                    this.setState({

                        visible2: false,

                    }, () => {
                        // ToastMessage("Item added succesfully to cart")
                        this.props.cartActions.setAllCartItemsData(newArray)
                    })
                }, 1000);

                // this.setState({ allDataToSave: newArray }, () => {
                //     setTimeout(() => {
                //         this.setState({

                //             visible2: false,

                //         }, () => {
                //             // ToastMessage("Item added succesfully to cart")
                //             this.props.cartActions.setAllCartItemsData(this.state.allDataToSave)
                //         })
                //     }, 1000);

                // })
            }

            // let data = {
            //     "cart_item_key": item2.key,
            //     "quantity": item2.quantity - 1,
            //     "return_cart": true,
            //     "refresh_totals": true,
            //     "thumb": true
            // }
            // debugger
            // this.props.cartActions.updateItemInCart(data, this.props.user).then((res) => {


            //     if (res && res.status == 200) {
            //         debugger
            //         let data = Object.keys(res.data).map(val => {
            //             return { ...res.data[val], parentId: val };
            //         });
            //         this.getTotalCartValue()
            //         this.props.cartActions.setAllCartItemsData(data)


            //     }
            //     else {
            //         this.setState({ visible2: false })

            //     }


            // }).catch((err) => {
            //     this.setState({ visible2: false })
            // })
        }


    }

    //AEDs and Accessories

    _keyExtractor3 = (item, index) => index + 'flatlist3';
    cartData = ({ item, index }) => {
        console.log("item.line_subtotal", item.line_subtotal)
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.removeItemByDeleteButton(item, index)}>
                            <Image source={require('../assets/images/deleteGrey/ic_delete.png')} />

                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.9, flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', flex: 0.2, borderRadius: 10, }}>
                            {item && item.images && item.images.length ?
                                <ImageBackground
                                    style={[{
                                        width: 70, height: 70,
                                        borderRadius: 10,
                                    }, { zIndex: 1, backgroundColor: 'white' }]}
                                    resizeMode={'stretch'}
                                    resizeMethod={'resize'}
                                    source={item && item.images && item.images[0].src ? { uri: item.images[0].src } : require('../assets/img/greyscale.jpg')}
                                />
                                :
                                null}
                        </View>
                        <View style={{ marginLeft: 30, flex: 0.8, marginRight: 2 }}>
                            <View><Text style={styles.productType} numberOfLines={2}>{item.name.replace(/&amp;/g, '&')}</Text></View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

                                {/* {item && item.line_subtotal ?
                                    <Text style={styles.aedPrice} numberOfLines={1}>{`AED ${Number(item.line_subtotal).toFixed(2)}`}</Text>

                                    :
                                    item && item.product_price_number ?

                                        <Text style={styles.aedPrice} numberOfLines={1}>{`AED ${Number(item.product_price_number * item.quantity).toFixed(2)}`}</Text>
                                        :
                                        null
                                } */}

                                {
                                    item && item.price ?
                                        <Text style={styles.aedPrice} numberOfLines={1}>{`AED ${Number(item.price).toFixed(2)}`}</Text>
                                        : null
                                }

                                <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-end'
                            }}>
                                <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.appColor, height: 25 }}>


                                    <TouchableOpacity style={{ width: 30, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: colors.appColor }} onPress={() => this.removeData(item, index)}>
                                        <View >
                                            <Text style={{ color: 'black' }}>{'-'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ width: 35, alignItems: 'center', justifyContent: 'center', }}>
                                        <Text style={{ color: 'black', fontSize: 12 }}>{item.quantity}</Text>
                                    </View>
                                    <TouchableOpacity style={{ width: 30, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: colors.appColor }} onPress={() => this.addData(item, index)}>
                                        <View>
                                            <Text style={{ color: 'black' }}>{'+'}</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>

                    </View>

                </View>
                <View style={{ height: 0.5, backgroundColor: 'grey', marginVertical: 5 }} />
            </View>
        )
    }

    searchFilterFunction = (text) => {
        // debugger
        // // if (text != '') {
        // debugger
        // this.setState({ searchedText: text, visible: true })
        // let data = {
        //     search: text,
        //     per_page: 100
        // }
        // this.props.productActions.getAllProductsCategory(data).then((res) => {
        //     this.setState({ allCategory: res.data, visible: false })
        // }).catch((err) => {
        //     this.setState({ visible: false })
        //     console.log(err, "error")
        // })

    }

    getAllCartItemVIew = () => {
        return (
            <FlatList
                bounces={true}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                data={this.props.allCartItems}
                keyExtractor={this._keyExtractor3}
                renderItem={this.cartData}
                automaticallyAdjustContentInsets={true}
                ListEmptyComponent={
                    (this.props.allCartItems.length == 0) ?
                        ListEmpty2({ state: this.state.visible, margin: this.state.visible ? screenDimensions.height / 3 : screenDimensions.height / 8, message: () => this.message(), loaderStyle: { height: 50, width: 50 } })
                        :
                        null
                }
            />

        )
    }

    navigateToProduct = (item) => {
        this.searchFilterFunction('')
        this.props.navigation.navigate('ProductListingScreen', { item: item })
    }
    backToMenu = () => {
        this.props.navigation.goBack()
    }

    message = () => {
        return (
            <View>
                <Image source={require('../assets/images/graphic/graphic.png')} />

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: 2 }} />
                    <Text style={styles.emptyData}>{"Your Cart Is Empty"}</Text>
                    <View style={{ height: 2 }} />
                    <Text style={styles.emptyDataSubLabel}>{"Looks like you haven't made \n your choice yet"}</Text>
                </View>


                <View style={{ marginTop: 40 }}>
                    <CustomeButton

                        buttonStyle={styles.buttonStyle}
                        backgroundColor={'#01A651'}
                        title={'Back to Menu'}
                        borderColor={'#01A651'}
                        fontWeight={'bold'}
                        fontSize={16}
                        lineHeight={16}
                        activeOpacity={9}
                        onPress={() => this.backToMenu()}
                        textColor={'#FFFFFF'}
                        icon={require('../assets/images/backButtonGreen/ic_back_button.png')}
                    />
                </View>

            </View>
        )
    }

    proceedToCheckOut = () => {
        let userInfo = this.props && this.props.user ? this.props.user : null
        // if (userInfo) {


        let newData = cloneDeep(this.props.allCartItems)
        let lineItems = newData.map((item, index) => {
            item['product_id'] = item.id
            item['quantity'] = item.quantity
            return item
        })



        this.props.navigation.navigate('CheckOutScreen',
            {
                cartData:
                {
                    "totalAmount": this.props.allCartValues.totalAmount,
                    "totalVat": this.props.allCartValues.totalVat,
                    "lineItems": lineItems,
                },
                // getAllCartItems: () => this.getAllCartItems(),
                // getCartCount: () => this.getCartCount()

            })
    }

    mainComponent = () => {
        return (
            <View style={{ paddingTop: 5, paddingHorizontal: 10 }}>


                {this.getAllCartItemVIew()}

                {
                    this.props.allCartItems && this.props.allCartItems.length ?
                        <View style={{ marginTop: 20, }}>
                            <View style={{ paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View><Text style={{ color: 'black', fontSize: 14 }}>{'Subtotal'}</Text></View>
                                <View><Text style={{ color: 'black', fontSize: 14 }}>{`AED ${Number(this.props.allCartValues.totalAmount).toFixed(2)}`}</Text></View>

                            </View>

                            <View style={{ paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View><Text style={{ color: 'black', fontSize: 14 }}>{'VAT'}</Text></View>
                                <View><Text style={{ color: 'black', fontSize: 14 }}>{`AED ${Number(this.props.allCartValues.totalVat).toFixed(2)}`}</Text></View>

                            </View>

                            <View style={{ paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View><Text style={{ paddingBottom: 10, color: 'black', fontSize: 14, fontWeight: 'bold' }}>{'Total'}</Text></View>
                                <View><Text style={{ paddingBottom: 10, color: 'black', fontSize: 14, fontWeight: 'bold' }} >{`AED ${(Number(this.props.allCartValues.totalAmount) + Number(this.props.allCartValues.totalVat)).toFixed(2)}`}</Text></View>
                            </View>
                            <CustomeButton

                                buttonStyle={styles.buttonStyleCheckOut}
                                backgroundColor={'#01A651'}
                                title={'Proceed to checkout'}
                                borderColor={'#01A651'}
                                fontWeight={'bold'}
                                fontSize={16}
                                lineHeight={16}
                                activeOpacity={9}
                                onPress={() => this.proceedToCheckOut()}
                                textColor={'#FFFFFF'}
                                icon={require('../assets/images/addProfile/ic_profile-add.png')}
                            />
                            <View style={{ marginTop: 20 }} />
                        </View>
                        :
                        null
                }

                <View style={{ marginTop: 20, height: 20 }} />
            </View >
        )
    }

    rightItem = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Notification')}>
                        <IconBadge
                            MainElement={
                                <Image source={require('../assets/images/notificationIcon/ic_notification.png')} style={{ marginRight: 10 }} />
                            }
                            BadgeElement={
                                <Text style={{ color: 'white', fontSize: 10 }}>{this.props.unReadMessage}</Text>
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
                            Hidden={this.props.unReadMessage == 0 || this.props.unReadMessage == null}
                        />
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity onPress={() => this.openFreshChat()}>
                        <Image source={require('../assets/images/messageIcon/ic_message.png')} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    render() {
        // styles.AndroidSafeArea
        return (
            <>
                <View style={[styles.container, styles.AndroidSafeArea]}>
                    <SafeAreaView style={{ flex: 0, backgroundColor: '#00A651' }} />
                    <StatusBar
                        translucent
                        barStyle={"dark-content"}
                        backgroundColor={'#00A651'}
                    />
                    <SafeAreaView
                        // forceInset={{ top: 'never', bottom: 'always' }}
                        style={[{ flex: 1, backgroundColor: '#ffffff' }]} >

                        {this.state.visible2 ? <Spinner /> : null}



                        <Container
                            backButton={true}
                            backButtonFunction={() => this.props.navigation.goBack()}
                            scrollView={true}
                            rightItem={() => this.rightItem()}
                            title={'Cart'}
                            viewStyle={{ marginTop: 20, height: screenDimensions.height }}
                            scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 75 }}
                            scrollProps={{ showsVerticalScrollIndicator: false }}
                            mainComponent={() => this.mainComponent()}
                        />


                    </SafeAreaView>
                </View>
            </>
        )
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        cartItems: state.login.cartItems,
        userCommon: state.user,
        allCartItems: state.login.allCartItems,
        allCartValues: state.login.allCartValues,
        unReadMessage: state.login.unReadMessage,
        allTaxData: state.login.allTaxData,
        guestID: state.login.guestID

        // routeName: state.navigation.route,
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        cartActions: bindActionCreators(cartActions, dispatch),

    };
    //return bindActionCreators({logInUser, showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(CartScreen)

