import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    TouchableOpacity,
    ImageBackground,
    FlatList,
} from 'react-native';

//Global libs
const cloneDeep = require('clone-deep');
import IconBadge from 'react-native-icon-badge';
// import SafeAreaView from 'react-native-safe-area-view';

//Local imports
import styles from '../styles'
import CustomeButton from '../components/Button'
import { ListEmpty2 } from '../components/noDataFound'
import { ToastMessage } from '../components/Toast'
import Spinner from '../components/Spinner'
import Container from '../components/Container'
import { key, sec, headerForWishlist, contactNumber, emailAdrress } from '../utilities/config'
import {
    Freshchat,
    setUser
} from '../components/FreshChat'
import { colors, screenDimensions } from '../utilities/constants';

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import * as wishlistActions from '../redux/actions/wishlistAction'
import * as productActions from '../redux/actions/productAction'
import * as cartActions from '../redux/actions/cartAction'




class WishlistScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

            visible: false,
            visible2: false,
            refreshToken: null,
            accountType: null,
            wishlistItems: this.props.wishlistData,
            allDataToSave: this.props && this.props.allCartItems.length ? this.props.allCartItems : []


        };

    }

    componentDidMount = () => {
        // this.getAllWishListItem()
    }

    openFreshChat = () => {
        if (this.props.user && this.props.user.id) {
            setUser(this.props.user)
            Freshchat.showConversations()
        } else {
            setUser(this.props.guestID)
            Freshchat.showConversations()
        }

    }

    //get all the wishlost items
    getAllWishListItem = (type) => {
        this.setState({
            visible2: true
        })
        let userInfo = this.props && this.props.user ? this.props.user : null
        let guestID = this.props && this.props.guestID ? this.props.guestID : null
        let data = {
            'key': key,
            'sec': sec,
            'user_id': userInfo ? userInfo.id : guestID ? guestID : null
        }
        let userId = userInfo ? userInfo.id : guestID ? guestID : null
        this.props.wishlistActions.getItemsWishlist(data, userId).then((res) => {
            if (res && res.status == 200) {
                console.log(res.data)
                if (res && res.data && res.data.length) {
                    let allData = res.data.map((item, index) => {
                        return (this.getProductDataWishlist(item))
                    })
                    Promise.all(allData).then((result) => {
                        console.log(result, "result")
                        this.setState({
                            // wishlistItems: result,
                            visible: false,
                            visible2: false
                        })
                        this.props.wishlistActions.setWishlistItem({ wishlistData: result, totalWishlistItem: result.length })
                        if (type == 'DELETE') {
                            ToastMessage("Item deleted successfully")
                        }
                        if (type == 'ADDTOCART') {
                            ToastMessage("Item added succesfully to cart")
                        }
                    }).catch((error) => {
                        this.setState({ visible: false, visible2: false })
                        console.log(`Error in promises ${error}`)
                    })

                }
                else {
                    this.setState({
                        // wishlistItems: [],
                        visible: false,
                        visible2: false
                    })
                    this.props.wishlistActions.setWishlistItem({ wishlistData: [], totalWishlistItem: 0 })
                    if (type == 'DELETE') {
                        ToastMessage("Item deleted successfully")
                    }
                    if (type == 'ADDTOCART') {
                        ToastMessage("Item added succesfully to cart")
                    }
                }
            } else {
                debugger
                this.setState({ visible: false, visible2: false })
                debugger
            }
        }).catch((err) => {
            debugger
            this.setState({ visible: false, visible2: false })
            console.log("wishlist error", err)
        })
    }
    //get product data from wishlist items
    getProductDataWishlist = (item) => {

        return this.props.productActions.retrieveProduct(item.prod_id).then((response) => {
            // if (response && response.status == 200) {
            let data = response.data
            data.prod_id = item.prod_id
            data.user_id = item.user_id
            data.wishlist_id = item.wishlist_id
            item = data
            return item
        }).catch((err) => {
            //
            debugger
            return item
        })

        //return info
    }

    //delete items from the wihslist
    deleteItemFromwishlist = (item, type) => {
        let userInfo = this.props && this.props.user ? this.props.user : null
        let guestID = this.props && this.props.guestID ? this.props.guestID : null

        this.setState({ visible: true })
        let data = {
            'key': key,
            'sec': sec,
            'prod_id': item.prod_id,
            'wishlist_id': item.wishlist_id,
            'user_id': userInfo ? userInfo.id : guestID ? guestID : null
        }
        this.props.wishlistActions.deleteItemFromwishlist(data).then((res) => {
            if (res && res.status == 200) {
                this.getAllWishListItem(type ? type : 'DELETE')
                console.log(res, "delete successfully")
                debugger
                // this.setState({ visible: false })
            }
            else {
                this.setState({ visible: false })
                console.log(res)
                debugger
            }
        }).catch((err) => {
            this.setState({ visible: false })
            console.log("wishlist errotr", err)
        })
    }

    //get total cart value--NOT USING NOW
    getTotalCartValue = () => {
        return this.props.cartActions.getTotalCartValue(this.props.user).then((res) => {
            if (res && res.status == 200) {
                console.log(res.data, "totalAmount")
                this.props.cartActions.setAllCartItemsTotalAmount({
                    "totalAmount": res.data.subtotal,
                    "totalVat": res.data.subtotal_tax
                })

            }
        }).catch((err) => {
            console.log(err, "Err")
        })
    }

    //get all cart items --NOT USE
    getAllCartItems = () => {


        // this.setState({ visible: true })
        return this.props.cartActions.getAllItemInCart(this.props.user).then((res) => {

            if (res && res.status == 200) {
                if (res && res.data && typeof (res.data) == 'object') {
                    let data = Object.keys(res.data).map(val => {
                        return { ...res.data[val], parentId: val };
                    });

                    let allData = data.map((item, index) => {
                        return (this.getProductData(item))
                    })
                    Promise.all(allData).then((result) => {
                        console.log(result, "result")
                        this.props.cartActions.setAllCartItemsData(result)

                    }).catch((error) => {

                    })
                }
                else {
                    // this.setState({ visible: false, visible2: false, visible: false })

                }
            }
            else {
                // this.setState({ visible: false, visible2: false, visible: false })

            }


        }).catch((err) => {

        })

    }

    //Get procduct data
    getProductData = (item) => {

        return this.props.productActions.retrieveProduct(item.product_id).then((response) => {
            if (response && (response.status == 200 || response.status == 201)) {
                item.stock_quantity = response.data.stock_quantity
                item.stock_status = response.data.stock_status

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
    }

    //adding an item to cart
    addItemToCart = (item) => {

        this.setState({ visible: true })



        if (item && item.stock_status != "outofstock") {


            if (this.props.allCartItems.length) {

                let found = null
                debugger
                console.log(this.props.allCartItems, "allDataToSave new .....")

                found = this.props.allCartItems.find(x => x.id == item.id)
                console.log(found, "found found")

                if (found != null) {

                    let newData = cloneDeep(this.props.allCartItems);

                    const newArray = newData.map(val => {

                        if (val.id === found.id) {
                            val['price'] = (val.quantity + 1) * Number(val.regular_price)
                            val['quantity'] = val.quantity + 1
                            return val
                        }
                        return val
                    })


                    var total = 0
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
                            // visible: false,
                        }, () => {
                            // ToastMessage("Item added succesfully to cart")
                            this.props.cartActions.setAllCartItemsData(newArray)
                            this.deleteItemFromwishlist(item, 'ADDTOCART')

                        })
                    }, 1000);



                } else {
                    let dataToSave = cloneDeep(item)

                    dataToSave['price'] = Number(dataToSave.price)
                    dataToSave['quantity'] = 1

                    let newData = cloneDeep(this.props.allCartItems);
                    newData.push(dataToSave)

                    const newArray = newData.map(val => {
                        return val
                    })
                    console.log(newArray, "newArray")

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
                            // visible: false,
                        }, () => {
                            // ToastMessage("Item added succesfully to cart")
                            this.props.cartActions.setAllCartItemsData(newArray)
                            this.deleteItemFromwishlist(item, 'ADDTOCART')

                        })
                    }, 1000);

                }

            }



            else {
                let dataToSave = cloneDeep(item)

                dataToSave['price'] = Number(dataToSave.price)
                dataToSave['quantity'] = 1

                let newData = cloneDeep(this.props.allCartItems);
                newData.push(dataToSave)

                const newArray = newData.map(val => {
                    return val
                })
                console.log(newArray, "newArray")

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
                this.props.cartActions.setAllCartItems(totalItemsInCart)



                this.props.cartActions.setAllCartItemsTotalAmount({
                    "totalAmount": total,
                    "totalVat": totatVat,
                })



                setTimeout(() => {
                    this.setState({
                        // visible: false,
                    }, () => {
                        // ToastMessage("Item added succesfully to cart")
                        this.props.cartActions.setAllCartItemsData(newArray)
                        this.deleteItemFromwishlist(item, 'ADDTOCART')

                    })
                }, 1000);
            }
        }
        else {
            ToastMessage("Product is out of stock")
            this.setState({ visible: false })
        }





        // let data = {
        //     "product_id": item.id,
        //     "quantity": 1,
        //     "refresh_totals": true,
        //     "return_cart": true

        // }
        // this.props.cartActions.addItemtoCart(data, this.props.user).then((res) => {
        //     if (res && res.status == 200) {

        //         Promise.all([
        //             this.getAllCartItems(),
        //             this.getTotalCartValue(),
        //             // this.getCartCount()
        //         ]).then(() => {
        //             this.deleteItemFromwishlist(item, 'ADDTOCART')
        //             // this.setState({visible: false})

        //         }).catch((error) => {
        //             this.setState({ visible: false })
        //         })


        //     } else {
        //         debugger
        //         if(res && res.response && res.response.data && res.response.data.message){
        //             ToastMessage(res.response.data.message)
        //         }
        //         this.setState({ visible: false })
        //     }
        // }).catch((err) => {
        //     debugger
        //     console.log(err, "Err")
        //     this.setState({
        //         visible: false
        //     })
        //     if (err && err.response && err.response.data && err.response.data.message) {
        //         ToastMessage(err.response.data.message)
        //     }
        // })
    }

    //back to main menu
    backToMenu = () => {
        this.props.navigation.goBack()
    }

    //empty cart message view
    message = () => {
        return (
            // <View>
            //     <Text>{'Hello'}</Text>
            // </View>
            <View>
                <Image source={require('../assets/images/graphic/graphic.png')} />

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: 2 }} />
                    <Text style={styles.emptyData}>{"Your Wishlist Is Empty"}</Text>
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

    //wishlist items view
    _keyExtractor3 = (item, index) => String(item.id);
    wishlistItems = ({ item, index }) => {
        debugger
        return (

            <View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.deleteItemFromwishlist(item)}>
                            <Image source={require('../assets/images/deleteGrey/ic_delete.png')} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={9}
                        onPress={() => this.props.navigation.navigate('ProductDetailScreen', { productDetail: item })}
                        style={{ flex: 0.9, flexDirection: 'row' }}>
                        {/* <View> */}


                        {item.images && item.images[0] && item.images[0].src ?
                            <View style={{ justifyContent: 'center', flex: 0.2, borderRadius: 10, }}>
                                <ImageBackground
                                    style={[{
                                        width: 70, height: 70,
                                        borderRadius: 10,
                                    }, { zIndex: 1, backgroundColor: 'white' }]}
                                    resizeMode={'stretch'}
                                    resizeMethod={'resize'}
                                    source={item.images && item.images[0] && item.images[0].src ? { uri: item.images[0].src } : require('../assets/img/greyscale.jpg')}
                                />
                            </View>
                            :
                            null}
                        <View style={{ marginLeft: 30, flex: 0.8 }}>
                            <View><Text style={styles.productType} numberOfLines={2}>{item.name.replace(/&amp;/g, '&')}</Text></View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <Text style={styles.aedPrice} numberOfLines={1}>{`AED ${Number(item.price).toFixed(2)}`}</Text>
                                <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-end'
                            }}>
                                <TouchableOpacity onPress={() => this.addItemToCart(item)}>
                                    <View style={{
                                        borderRadius: 10,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        padding: 6,
                                        backgroundColor: colors.appColor,
                                        width: 100
                                    }}>
                                        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{'Add to cart'}</Text>

                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>

                        {/* </View> */}
                    </TouchableOpacity>


                </View>
                <View style={{ height: 0.5, backgroundColor: 'grey', marginVertical: 10 }} />
            </View>
        )
    }

    //Flatlist for wishlist
    getAllWishListItemView = () => {
        return (
            <FlatList
                bounces={false}
                extraData={this.state.wishlistData}
                showsVerticalScrollIndicator={false}
                data={this.props.wishlistData}
                keyExtractor={this._keyExtractor3}
                renderItem={this.wishlistItems}
                automaticallyAdjustContentInsets={true}
                ListEmptyComponent={
                    (this.props.wishlistData.length == 0 && !this.state.visible) ?
                        ListEmpty2({ state: this.state.visible, margin: this.state.visible ? screenDimensions.height / 3 : screenDimensions.height / 8, message: () => this.message(), loaderStyle: { height: 50, width: 50 } })
                        :
                        null
                }
            />

        )
    }

    mainComponent = () => {
        return (
            <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>
                {this.getAllWishListItemView()}
            </View>
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
        let { params } = this.props.navigation.state
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
                        style={[{ flex: 1, backgroundColor: '#ffffff' }]} >

                        {this.state.visible2 || this.state.visible ? <Spinner /> : null}

                        <Container
                            backButton={true}
                            backButtonFunction={() => this.props.navigation.goBack()}
                            scrollView={false}
                            rightItem={() => this.rightItem()}
                            title={'Favourites'}
                            viewStyle={{ marginTop: 20, height: screenDimensions.height }}
                            scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 150 }}
                            scrollProps={{ showsVerticalScrollIndicator: false }}
                            mainComponent={() => this.mainComponent()}

                        />

                    </SafeAreaView>
                </View>

            </>
        );
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        //userCommon: state.user,
        allCartItems: state.login.allCartItems,
        cartItems: state.login.cartItems,
        wishlistData: state.login.wishlistData,
        unReadMessage: state.login.unReadMessage,
        totalWishListItem: state.login.totalWishListItem,
        allTaxData: state.login.allTaxData,
        guestID: state.login.guestID

    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        wishlistActions: bindActionCreators(wishlistActions, dispatch),
        cartActions: bindActionCreators(cartActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(WishlistScreen)

