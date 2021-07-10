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
    Keyboard,
    Alert,
    ImageBackground
} from 'react-native';

//Local imports
import styles from '../styles'
import Spinner from '../components/Spinner'
import Container from '../components/Container'
import CustomeButton from '../components/Button'
import location from '../assets/images/ic_location.png'
import strings from '../utilities/languages'
import cart from '../assets/images/ic_cart.png'
import { ListEmpty2 } from '../components/noDataFound'
import { ToastMessage } from '../components/Toast'
//global libs
// import { CachedImage } from 'react-native-cached-image'
import IconBadge from 'react-native-icon-badge';
import CardView from 'react-native-cardview'
import Modal from 'react-native-modal'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import HTML from 'react-native-render-html';
import Video from 'react-native-video';
import axios from 'axios';
import { key, sec } from '../utilities/config'
import { Rating, AirbnbRating } from 'react-native-ratings';

//contants
const sliderWidth = Dimensions.get("window").width;
const itemWidth = Dimensions.get("window").width;


//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//Actions
import * as userActions from '../redux/actions/userAction'
import * as productActions from '../redux/actions/productAction'
import * as cartActions from '../redux/actions/cartAction'
import * as wishlistActions from '../redux/actions/wishlistAction'
import * as reviewActions from '../redux/actions/reviewAction'

import { screenDimensions, colors } from '../utilities/constants'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
const cloneDeep = require('clone-deep');



class ProductDetailScreen extends Component {
    constructor(props) {
        super(props);
        let { productDetail } = this.props.navigation.state.params
        this.state = {
            showTextInput: false,
            productDetail: null,
            slider1ActiveSlide: 0,
            relatedProducts: [],
            allselectedItemToWishList: [],
            cartCount: 0,
            starReviews: [1, 2, 3, 4, 5],
            allReviewForProduct: [],
            payAndCheckoutButton: false,
            isModalUp: false,
            allDataToSave: this.props && this.props.allCartItems.length ? this.props.allCartItems : []
        }
        debugger
    }

    componentDidMount = () => {
        this.setState({ visible2: true })
        Promise.all([
            this.getAllData(),
            // this.getCartCount(),
            this.getAllReview()
        ]).then((res) => {
            this.setState({ visible2: false })
        }).catch((err) => {
            this.setState({ visible2: false })
        })

    }

    getAllReview = () => {
        let { productDetail, productInfoFromBanner } = this.props.navigation.state.params
        let productIdForReiew = null
        if (productDetail && productDetail.pro_id) {
            productIdForReiew = productDetail.pro_id
        } else {
            productIdForReiew = productDetail.id
        }
        let newArray = []
        this.props.reviewActions.getAllReviews().then((res) => {
            if (res && res.status == 200) {
                if (res && res.data.length) {

                    newArray = res.data.filter(item => item.product_id == productIdForReiew)
                    if (newArray.length) {
                        this.setState({
                            allReviewForProduct: newArray
                        })
                    }
                }
                console.log("this.satte.allReviewForProduct", this.state.allReviewForProduct)
            }
        }).catch((err) => {
            console.log(err, "err from review")
        })
    }


    getAllReviewForRelatedProductSelect = (productIdForReiew) => {
        console.log("productIdForReiew", productIdForReiew)
        let newArray = []
        this.props.reviewActions.getAllReviews().then((res) => {
            if (res && res.status == 200) {
                if (res && res.data.length) {

                    newArray = res.data.filter(item => item.product_id == productIdForReiew)
                    if (newArray.length) {
                        this.setState({
                            allReviewForProduct: newArray
                        }, () => {
                            console.log("this.satte.allReviewForProductFrom ", this.state.allReviewForProduct)
                        })
                    }
                    else {
                        this.setState({
                            allReviewForProduct: []
                        }, () => {
                            console.log("this.satte.allReviewForProductFrom ", this.state.allReviewForProduct)
                        })
                    }
                }

            }
        }).catch((err) => {
            console.log(err, "err from review")
        })
    }


    getAllData = () => {
        let { productDetail, productInfoFromBanner } = this.props.navigation.state.params
        // console.log(JSON.stringify(productDetail), "productDetail")

        // this.getAllRelatedProducts(productDetail)
        if (productDetail && productDetail.pro_id) {
            let item = {
                "id": productDetail.pro_id
            }
            this.getProductDetail(item)
        } else {
            this.getProductDetail(productDetail)
        }
    }


    getCartCount = () => {
        this.props.cartActions.getCartCount(this.props.user).then((res) => {
            debugger
            if (res && res.status == 200) {
                this.props.cartActions.setAllCartItems(res.data)

            }
            console.log(res)
        }).catch((err) => {
            console.log("Errr", err)
        })
    }



    // componentDidMount() {


    // }

    producDetailImagesBanners = ({ item, index }) => {

        let imageUrl = item.src
        // if (item && item.src) {
        //     imageUrl = item.src.slice(0, item.src.lastIndexOf('.')) + '-300x300' + item.src.slice(item.src.lastIndexOf('.'))

        // } else {
        //     imageUrl = null

        // }

        return (
            <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                {imageUrl ?
                    <ImageBackground
                        source={imageUrl ? { uri: imageUrl } : ''}
                        resizeMode={'contain'}
                        style={{ width: 275, height: 275, alignItems: 'center', justifyContent: 'center' }}
                    />
                    :
                    <View style={{ width: 250, height: 250 }}
                    />}

            </View>

        )
    }




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
                console.log(res)
                debugger
            }
        }).catch((err) => {
            console.log("wishlist errotr", err)
        })
    }

    //Select item to wish list
    selectItemToWishListForRelatedProducts = (value, fromHeader) => {



        if (this.props.wishlistData && this.props.wishlistData.length) {
            let wishlistExist = this.props.wishlistData.find(item => item.prod_id == value.id)
            if (wishlistExist) {
                if (fromHeader) {
                    ToastMessage("Item is already added in wishlist")
                } else { this.deleteItemFromwishlist(wishlistExist) }


            }
            else {
                this.selectWishList(value)
            }
        }
        else {
            this.selectWishList(value)
        }


    }

    selectWishList = (value) => {

        let userInfo = this.props && this.props.user ? this.props.user : null
        let guestID = this.props && this.props.guestID ? this.props.guestID : null

        debugger
        // if(userInfo){
        this.setState({ visible: true })
        let data = {
            'key': key,
            'sec': sec,
            'prod_id': value.id,
            'quantity': 1,
            'user_id': userInfo ? userInfo.id : guestID ? guestID : null
        }
        this.props.wishlistActions.addItemToWishlist(data).then((res) => {
            if (res && res.status == 200) {
                this.getAllWishListItem('Add')
                console.log(res, "wishlist response")
                debugger
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
        // }else{
        //     ToastMessage('You need to login to access this feature')
        // }

    }




    getAllRelatedProducts = (productDetail) => {
        console.log(productDetail.related_ids,"productDetail-productDetail")
        // related_ids
        productDetail && productDetail.related_ids ?
            productDetail.related_ids.map((item, index) => {
                this.props.productActions.retrieveProduct(item).then((res) => {
                  console.log(res.data,"res.data>>>>>")
                    this.setState({ 
                        relatedProducts: [...this.state.relatedProducts, res.data] })
                }).catch((err) => {
                    //
                })
            })
            :
            null

        console.log(productDetail, "productDetail")
    }


    getProductDetail = (item) => {

        this.setState({ visible: true })
        this.props.productActions.retrieveProduct(item.id).then((res) => {
            console.log("Product detail", res.data)
            debugger
            this.setState({ productDetail: res.data, tab2: true, visible: false ,relatedProducts:[]}, () => {
                this.getAllReviewForRelatedProductSelect(this.state.productDetail.id)
                this.getAllRelatedProducts(this.state.productDetail)
            })
        }).catch((err) => {
            //
            this.setState({ visible: false })
        })
    }

    _keyExtractor4 = (item, index) => index + 'flatlist4';
    allReviewForProduct = ({ item, index }) => {
        let imageArray = []
        if (item && item.reviewer_avatar_urls && item.reviewer_avatar_urls) {
            imageArray = Object.values(item.reviewer_avatar_urls)
        }
        console.log("imageArray", imageArray)
        return (
            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {
                        imageArray && imageArray.length ?
                            <Image
                                style={{ height: 24, width: 24 }}
                                source={{ uri: imageArray[0] }} />
                            :
                            null
                    }
                </View>


                {/* <Image source={{ uri: imageArray[0] }} /> */}

                <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                    <HTML html={`${item.review}`} />

                    {/* <Text style={{paddingLeft:10,fontSize:14,color:colors.lightBlack}}>{item.}</Text> */}
                    <Text style={{ fontSize: 12, fontStyle: 'italic', color: colors.lightfontColor }}>{`by ${item.reviewer}`}</Text>

                </View>
            </View>
        )
    }

    _keyExtractor3 = (item, index) => index + 'flatlist3';
    products = ({ item, index }) => {
        let imageUrl
        let wishlistExist = null
        if (item.images && item.images[0] && item.images[0].src) {
            imageUrl = item.images[0].src.slice(0, item.images[0].src.lastIndexOf('.')) + '-300x300' + item.images[0].src.slice(item.images[0].src.lastIndexOf('.'))

        } else {
            imageUrl = null

        }

        if (this.props.wishlistData && this.props.wishlistData.length) {
            wishlistExist = this.props.wishlistData.find(itm => itm.prod_id == item.id)
            // console.log(wishlistExist, "wishlistExist     -------    wishlistExist exist")

            if (wishlistExist != null && wishlistExist != undefined) {
                item['check'] = true
            }
            else {
                item['check'] = false
            }
        }

        return (
            <TouchableOpacity activeOpacity={9} onPress={() => this.setState({ visible: true }, () => this.getProductDetail(item))}>
                <View index={index} style={styles.mainViewAllProducts2}>
                    <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={10}
                        style={styles.cardViewAllProductsCategory}>
                        <View style={{ backgroundColor: 'white', borderRadius: 10, height: screenDimensions.width / 2 + 40 }}>


                            <Image
                                style={[styles.imageViewAllProductsCategory, { position: 'absolute', zIndex: 0 }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={require('../assets/img/greyscale.jpg')}
                            />

                            {imageUrl ?

                                <ImageBackground
                                    style={[styles.imageViewAllProductsCategory, { zIndex: 1, backgroundColor: 'white' }]}
                                    resizeMode={'stretch'}
                                    resizeMethod={'resize'}
                                    source={imageUrl ? { uri: imageUrl } : require('../assets/img/greyscale.jpg')}
                                >
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', top: 120 }} onPress={() => this.selectItemToWishListForRelatedProducts(item)}>
                                        {/* <View> */}

                                        <Image source={item && item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />

                                        {/* </View> */}
                                    </TouchableOpacity>
                                </ImageBackground> :
                                <View style={[styles.imageViewAllProductsCategory, { zIndex: 1, backgroundColor: 'white' }]} />
                            }

                            <View style={{ marginTop: 8, padding: 5 }}>

                                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => this.selectItemToWishListForRelatedProducts(item)}>
                                        <Image source={item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>
                                </View> */}


                                <Text style={styles.productType} numberOfLines={2}>{item.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.aedPrice} numberOfLines={2}>{`AED ${Number(item.price).toFixed(2)}`}</Text>
                                    <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                                </View>

                            </View>

                        </View>
                    </CardView>

                </View>
            </TouchableOpacity>
        )
    }

    openModalForQualitySelector = (item) => {
        this.setState({
            isModalVisible: true
        })



    }

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

    getAllCartItems = (cartData) => {
        if (this.props.allCartItems) {
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
        else {
            let data = Object.keys(cartData).map(val => {
                return { ...cartData[val], parentId: val };
            });

            debugger

            let allData = data.map((item, index) => {
                return (this.getProductData(item))
            })
            Promise.all(allData).then((result) => {
                console.log(result, "result")
                return this.props.cartActions.setAllCartItemsData(result)

            }).catch((error) => {

            })

            return true


        }
        // this.setState({ visible: true })


    }


    getProductData = (item) => {

        return this.props.productActions.retrieveProduct(item.product_id).then((response) => {
            if (response && (response.status == 200 || response.status == 201)) {
                item.stock_quantity = response.data.stock_quantity
                item.stock_status = response.data.stock_status
                // key: "c79bb048121bbc1d20d79c6b83ef17b5"
                // product_id: 28661
                // variation_id: 0
                // variation: []
                // quantity: 1
                // data: {}
                // data_hash: "b5c1d5ca8bae6d4896cf1807cdf763f0"
                // line_tax_data: {subtotal: {…}, total: {…}}
                // line_subtotal: 2.5
                // line_subtotal_tax: 0.125
                // line_total: 2.5
                // line_tax: 0.125
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

    getAllWishListItem = (type) => {

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
                        return (this.getProductDataWishList(item))
                    })

                    Promise.all(allData).then((result) => {

                        // result.reduce((a, x) => a.includes(x) ? a : [...a, x], []).sort()
                        console.log(result, "result")
                        this.props.wishlistActions.setWishlistItem({ wishlistData: result, totalWishlistItem: result.length })
                        this.setState({ wishlistItems: result, visible: false })

                        if (type == 'Add') {
                            ToastMessage("Item added successfully to wishlist")

                        }
                        if (type == 'DELETE') {
                            ToastMessage("Item removed from the wishlist successfully")

                        }
                    }).catch((error) => {
                        this.setState({ visible: false })
                        console.log(`Error in promises ${error}`)
                    })

                }

            } else {
                this.setState({ visible: false })
                debugger
            }
        }).catch((err) => {
            this.setState({ visible: false })
            console.log("wishlist error", err)
        })
    }

    getProductDataWishList = (item) => {
        return this.props.productActions.retrieveProduct(item.prod_id).then((response) => {
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


    addItemToCart = (itm) => {

        if (this.state.cartCount >= 1) {
            this.setState({ visible: true, isModalVisible: false, })

            if (this.props.allCartItems.length) {
                let found = null
                debugger
                console.log(this.props.allCartItems, "allDataToSave new .....")

                found = this.props.allCartItems.find(x => x.id == itm.id)
                console.log(found, "found found")

                if (found != null) {

                    let newData = cloneDeep(this.props.allCartItems);

                    const newArray = newData.map(val => {

                        if (val.id === found.id) {
                            val['price'] = (val.quantity + this.state.cartCount) * Number(val.regular_price)
                            val['quantity'] = val.quantity + Number(this.state.cartCount)
                            return val
                        }
                        return val
                    })



                    // this.setState({ allDataToSave: newArray }, () => {

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
                    console.log(totalItemsInCart, "totalItemsInCart")


                    this.props.cartActions.setAllCartItemsTotalAmount({
                        "totalAmount": total,
                        "totalVat": totatVat,
                    })

                    this.props.cartActions.setAllCartItems(totalItemsInCart)


                    setTimeout(() => {
                        this.setState({
                            isModalVisible: false,
                            visible: false,
                            payAndCheckoutButton: true,
                            cartCount: 0
                        }, () => {
                            ToastMessage("Item added succesfully to cart")
                            this.props.cartActions.setAllCartItemsData(newArray)
                        })
                    }, 1000);

                    // })
                } else {





                    itm['price'] = this.state.cartCount > 1 ? this.state.cartCount * Number(itm.price) : Number(itm.price)
                    itm['quantity'] = this.state.cartCount

                    let newData = cloneDeep(this.props.allCartItems);
                    newData.push(itm)

                    const newArray = newData.map(val => {
                        return val
                    })
                    console.log(newArray, "newArray")

                    // this.setState({
                    //     allDataToSave: [...this.state.allDataToSave, itm]
                    // }, () => {
                    console.log(this.state.allDataToSave, "allDataToSave")
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
                                totatVat += newArray[i].tax_value
                                // totatVat += (Number(newArray[i].price) * (Number(taxexist.rate) / 100))
                            }
                        }
                        total += Number(newArray[i].price);
                        totalItemsInCart += Number(newArray[i].quantity);

                    }
                    console.log(totalItemsInCart, "totalItemsInCart")

                    console.log(total, "sum---sum---sum")

                    this.props.cartActions.setAllCartItemsTotalAmount({
                        "totalAmount": total,
                        "totalVat": totatVat,
                    })

                    this.props.cartActions.setAllCartItems(totalItemsInCart)

                    setTimeout(() => {
                        this.setState({
                            isModalVisible: false,
                            visible: false,
                            payAndCheckoutButton: true,
                            cartCount: 0
                        }, () => {
                            ToastMessage("Item added succesfully to cart")
                            this.props.cartActions.setAllCartItemsData(newArray)
                        })
                    }, 1000);
                    // })
                }

            } else {
                debugger
                itm['price'] = this.state.cartCount > 1 ? this.state.cartCount * Number(itm.price) : Number(itm.price)
                itm['quantity'] = this.state.cartCount


                let newData = cloneDeep(this.props.allCartItems);
                newData.push(itm)

                const newArray = newData.map(val => {
                    return val
                })
                console.log(newArray, "newArray")


                // this.setState({
                //     allDataToSave: [...this.state.allDataToSave, itm]
                // }, () => {
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
                            totatVat += newArray[i].tax_value
                        }
                    }
                    total += Number(newArray[i].price);
                    totalItemsInCart += Number(newArray[i].quantity);
                }

                console.log(total, "sum---sum---sum")
                console.log(totatVat, "totatVat---totatVat---totatVat")

                console.log(totalItemsInCart, "totalItemsInCart")


                this.props.cartActions.setAllCartItemsTotalAmount({
                    "totalAmount": total,
                    "totalVat": totatVat,
                })
                this.props.cartActions.setAllCartItems(totalItemsInCart)



                console.log(newArray, "allDataToSave")

                setTimeout(() => {
                    this.setState({
                        isModalVisible: false,
                        visible: false,
                        payAndCheckoutButton: true,
                        cartCount: 0
                    }, () => {
                        ToastMessage("Item added succesfully to cart")
                        this.props.cartActions.setAllCartItemsData(newArray)
                    })
                }, 1000);
                // })
            }



            // if (this.props.allCartItems.length) {

            //     const newArray = this.props.allCartItems.map(item => {
            //         if (item.id === itm.id) {
            //             return Object.assign({}, item, { quantity: item.quantity + this.state.quantity });
            //         }
            //         return item
            //     })
            //     console.log(newArray, "newArray")
            //     this.setState({ allDataToSave: newArray })


            //     // found = this.props.allCartItems.find(x => x.id == item.id)
            //     // console.log(found, "found---found")

            // } else {
            //     let datatosave = [...this.props.allCartItems,]
            //     this.setState({ allDataToSave: newArray })

            //     // this.props.cartActions.setAllCartItemsData(result)
            // }

            // let data = {
            //     "product_id": item.id,
            //     "quantity": this.state.cartCount,
            //     "refresh_totals": true,
            //     "return_cart": true,
            //     "thumb": true
            // }



            // this.props.cartActions.addItemtoCart(data, this.props.user).then((res) => {
            //     if (res && res.status == 200) {
            //         debugger
            //         console.log("here in:", res)
            //         ToastMessage("Item added succesfully to cart")
            //         // this.getCartCount()

            //         setTimeout(() => {
            //             this.setState({
            //                 isModalVisible: false,
            //                 visible: false,
            //                 payAndCheckoutButton: true,
            //                 cartCount: 0
            //             }, () => {
            //                 // this.props.navigation.navigate('CartScreen')
            //             })
            //         }, 1000);


            //         // Promise.all([
            //         //     this.getAllCartItems(res.data),
            //         //     this.getTotalCartValue(),
            //         //     this.getCartCount()
            //         // ]).then(() => {
            //         //     debugger
            //         //     // console.log('All promices are resolved');
            //         //     setTimeout(() => {
            //         //         this.setState({
            //         //             isModalVisible: false,
            //         //             visible: false,
            //         //             payAndCheckoutButton: true,
            //         //             cartCount: 0
            //         //         }, () => {
            //         //             // this.props.navigation.navigate('CartScreen')
            //         //         })
            //         //     }, 1000);
            //         // }).catch((error) => {
            //         //     console.log('promise all error: ', error);
            //         //     setTimeout(() => {
            //         //         this.setState({
            //         //             isModalVisible: false,
            //         //             visible: false,
            //         //             payAndCheckoutButton: true,
            //         //             cartCount: 0
            //         //         }, () => {
            //         //             // this.props.navigation.navigate('CartScreen')
            //         //         })
            //         //     }, 1000);
            //         // });
            //     } else {
            //         debugger
            //         if (res && res.response && res.response.data && res.response.data.message) {
            //             alert(res.response.data.message)
            //             setTimeout(() => {
            //                 this.setState({
            //                     isModalVisible: false,
            //                     visible: false,
            //                     cartCount: 0
            //                 }, () => { })
            //                 // alert(res.response.data.message)
            //             }, 2000);
            //         }
            //         else {
            //             setTimeout(() => {
            //                 this.setState({
            //                     isModalVisible: false,
            //                     visible: false,
            //                     cartCount: 0
            //                 })
            //             }, 1500);
            //         }

            //     }
            // }).catch((err) => {
            //     debugger
            //     if (err && err.response && err.response.data && err.response.data.message) {
            //         alert(err.response.data.message)
            //         setTimeout(() => {
            //             this.setState({
            //                 isModalVisible: false,
            //                 visible: false
            //             }, () => { })
            //             // alert(err.response.data.message)
            //         }, 2000);
            //     }
            //     else {
            //         setTimeout(() => {
            //             this.setState({
            //                 isModalVisible: false,
            //                 visible: false
            //             })
            //         }, 1500);
            //     }
            //     console.log(err, "Err")

            // })

        } else {
            ToastMessage("Please select the quantity")
        }
    }

    increaseQuanitiy = (item) => {
        console.log(this.state.cartCount,"this.state.cartCount)")
        if (item && item.stock_status == "onbackorder") {
            this.setState({

                cartCount: JSON.stringify(Number(this.state.cartCount) + 1)
            }, () => {

            })
        }
        else if (item && item.stock_quantity == this.state.cartCount) {

            if (item && item.backorders_allowed) {
                this.setState({
                    cartCount: JSON.stringify(Number(this.state.cartCount) + 1)
                }, () => {
                })
            } else {
                ToastMessage('Stock limit reached')

            }

        } else {
            this.setState({

                cartCount: JSON.stringify(Number(this.state.cartCount) + 1)
            }, () => {

            })
        }

    }

    removeItemFromtheCart = (item) => {
        this.setState({
            ...this.state,
            cartCount: JSON.stringify(Number(this.state.cartCount) - 1),
            isModalVisible: false
        }, () => {

        })
    }

    decreaseQuanitity = () => {
        {
            this.state.cartCount == 1 ?
                Alert.alert(
                    strings.warning,
                    strings.areyousureremove,
                    [
                        {
                            text: strings.cancel,
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: strings.OK, onPress: () => this.removeItemFromtheCart() },
                    ],
                    { cancelable: false },
                )
                :
                (this.state.cartCount != 0) ?
                    this.setState({
                        ...this.state,
                        cartCount: JSON.stringify(Number(this.state.cartCount) -1)
                    }, () => {

                    })
                    :
                    null

        }
    }

    setCartValue = (cartCount) => {
        console.log(cartCount, "cartCount-cartCount")
        let item = this.state.productDetail
        if (cartCount == 0) {
            this.setState({
                cartCount: 0
            })
        } else {

            if (item && item.stock_status == "onbackorder") {
                this.setState({
                    cartCount: cartCount
                }, () => {
                })
            }
            else if (item && ((item.stock_quantity == cartCount) || (item.stock_quantity < cartCount))) {

                if (item && item.backorders_allowed) {
                    this.setState({
                        cartCount: cartCount
                    }, () => {
                    })
                } else {
                    if (item.stock_quantity < cartCount) {
                        this.setState({ cartCount: 0, showTextInput: false })
                        Keyboard.dismiss()
                        ToastMessage('Stock limit reached')

                    } else {
                        // Keyboard.dismiss()
                        this.setState({ cartCount: cartCount })
                        // ToastMessage('Stock limit reached---')
                        // Keyboard.dismiss()
                    }
                }
            } else {
                this.setState({

                    cartCount: cartCount
                }, () => {

                })
            }
        }
    }
    renderModal = () => {

        return (
            <ScrollView keyboardShouldPersistTaps={'always'}>
                <Modal
                    isVisible={this.state.isModalVisible}
                    backdropColor={'white'}
                    backdropOpacity={0.6}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={500}
                    backdropTransitionOutTiming={500}
                    onBackButtonPress={() => this.setState({ isModalVisible: false.valueOf, showTextInput: false, isModalUp: false })}
                    onBackdropPress={() => this.setState({ isModalVisible: false, showTextInput: false, isModalUp: false })}
                    style={{ margin: 0, justifyContent: 'flex-end' }}
                >


                    <View style={{
                        backgroundColor: colors.appColor,
                        // justifyContent: 'flex-end',
                        paddingHorizontal: 20,
                        paddingVertical: 30,
                        // position: 'absolute',
                        borderRadius: 20,
                        marginHorizontal: 20,
                        marginVertical: 20
                        // left: 20,
                        // right: 20,
                        // bottom: 20,
                        // padding: 10,
                        // top: Platform.OS == 'ios' ? screenDimensions.height / 2 + 50 : screenDimensions.height / 2 + 50
                    }}>
                        <View>
                            <Text style={{ color: colors.white, fontSize: 18, fontWeight: 'bold' }}
                                numberOfLines={2}>
                                {this.state.productDetail && this.state.productDetail.name ? this.state.productDetail.name : ''}</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Qty.'}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>

                                <TouchableOpacity onPress={() => this.decreaseQuanitity(this.state.productDetail)}>
                                    <Image source={require('../assets/images/addMinusWhite/ic_minus_white.png')} />
                                </TouchableOpacity>

                                {this.state.showTextInput ?
                                    <View style={{ justifyContent: 'center', marginHorizontal: 10, height: 54, borderWidth: 2, borderColor: 'white', borderRadius: 15, width: screenDimensions.width / 2 - 10 }}>
                                        {/* <View style={{ marginVertical: 2, width: screenDimensions.width / 2 -10 ,justifyContent: 'center', }}> */}
                                        <TextInput
                                            autoFocus={this.state.showTextInput}
                                            value={this.state.cartCount}
                                            // onBlur={()=>this.setState({showTextInput:false})}
                                            placeholder={`Stock limit ${this.state.productDetail.stock_quantity}`}
                                            keyboardType={'number-pad'}
                                            style={{ textAlign: 'center', color: colors.white, fontWeight: 'bold', fontSize: 16, }}
                                            onChangeText={(valueData) => this.setCartValue(valueData)}
                                        // onChange={(event) => this.setCartValue(event.nativeEvent.text)}
                                        // onSubmitEditing={()=>alert("123")}
                                        // onSubmitEditing={(event) => { this.setState({ showTextInput: false }) }}
                                        />
                                        {/* </View> */}

                                    </View>

                                    :
                                    <TouchableOpacity onPress={() => this.setState({ showTextInput: true, isModalUp: true })} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, height: 54, borderWidth: 2, borderColor: 'white', borderRadius: 15, width: screenDimensions.width / 2 - 10 }}>
                                        <Text onPress={() => this.setState({ showTextInput: true, isModalUp: true })} style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>{this.state.cartCount}</Text>
                                    </TouchableOpacity>
                                }


                                <TouchableOpacity onPress={() => this.increaseQuanitiy(this.state.productDetail)}>
                                    <Image source={require('../assets/images/addPlusWhite/ic_plus_white.png')} />
                                </TouchableOpacity>

                            </View>

                            <View style={{ marginTop: 20, }}>


                                <CustomeButton
                                    // enabled={this.state.visible ? false : true}
                                    buttonStyle={styles.buttonStyle}
                                    backgroundColor={'white'}
                                    title={"ADD TO CART"}
                                    borderColor={'#01A651'}
                                    fontWeight={'bold'}
                                    fontSize={16}
                                    lineHeight={16}
                                    activeOpacity={9}
                                    onPress={() => this.addItemToCart(this.state.productDetail)}
                                    textColor={colors.appColor}
                                    icon={require('../assets/images/addPlus/ic_add.png')}
                                />

                            </View>
                        </View>





                    </View>
                </Modal>
            </ScrollView>
        )
    }

    renderComponent1 = () => {
        let { productDetail } = this.state

        let { params } = this.props.navigation.state
        return (
            <View style={{ alignItems: 'center', paddingBottom: 0, backgroundColor: 'white' }}>
                {this.state.productDetail && this.state.productDetail.images && this.state.productDetail.images.length ?

                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.productDetail && this.state.productDetail.images && this.state.productDetail.images.length ? this.state.productDetail.images : []}
                        renderItem={this.producDetailImagesBanners}
                        autoplay={true}
                        loop={true}
                        autoplayInterval={2000}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                    />
                    :
                    <Image
                        style={[{ marginBottom: 10, width: screenDimensions.width, height: 250, zIndex: 0, }]}
                        resizeMode={'stretch'}
                        resizeMethod={'resize'}
                        source={require('../assets/img/greyscale.jpg')}
                    />
                }



                <Pagination
                    dotsLength={this.state.productDetail && this.state.productDetail.images && this.state.productDetail.images.length ? this.state.productDetail.images.length : 0}
                    activeDotIndex={this.state.slider1ActiveSlide}
                    containerStyle={{ paddingTop: 10 }}
                    dotColor={'rgba(0, 0, 0, 0.92)'}
                    dotStyle={{ height: 12, width: 12, borderRadius: 12 / 2 }}
                    inactiveDotColor={'black'}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.8}

                />
            </View>

        )
    }

    // renderComponent2 = () => {
    //     let { productDetail } = this.state

    //     let { params } = this.props.navigation.state
    //     return (

    //     )
    // }

    renderComponent3 = () => {
        let { productDetail } = this.state

        let { params } = this.props.navigation.state
        if (productDetail) {

            var diff = (Number(this.state.productDetail.regular_price) - Number(this.state.productDetail.sale_price))
            var div = (diff * 100) / Number(this.state.productDetail.regular_price)
            if (productDetail && (productDetail.date_on_sale_from != null) && (productDetail.date_on_sale_to != null)) {

                var countDownDate = new Date(productDetail.date_on_sale_to_gmt).getTime()

                // Update the count down every 1 second
                var days = null
                var hours = null
                var minutes = null
                var seconds = null

                // var x = setInterval(() => {
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                days = Math.floor(distance / (1000 * 60 * 60 * 24));
                hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // var datetoPass = `${days}D : ${hours}H : ${minutes}M : ${seconds}S`
                var datetoPass = `${hours}H : ${minutes}M : ${seconds}S`

            }



            // }
        }


        return (
            <View>
                <View style={{ marginHorizontal: 20, marginVertical: 0 }}>

                    <Text numberOfLines={2} style={{ color: colors.appColor, fontSize: 18, fontWeight: 'bold' }}>{productDetail && productDetail.name ? productDetail.name.replace(/&amp;/g, '&') : ''}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ width: screenDimensions.width / 2, flexDirection: 'row' }}>
                            {productDetail && productDetail.sku != null && productDetail.sku != "" ?
                                <Text style={{ color: colors.lightfontColor, paddingTop: 10, fontWeight: 'bold', fontSize: 12 }}>{`SKU : ${productDetail.sku}`}</Text>
                                :
                                null}

                        </View>




                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 5 }}>
                        <Text>

                            {productDetail && productDetail.stock_status != null && productDetail.stock_status != "" ?

                                productDetail.stock_status == 'outofstock' ?
                                    <Text style={{ color: 'red', fontSize: 14, fontWeight: 'bold' }}>{'Out of stock'}</Text>

                                    :
                                    productDetail.stock_status == 'instock' ?
                                        <Text style={{ color: colors.appColor, fontSize: 14, fontWeight: 'bold' }}>{productDetail.stock_status}</Text>
                                        :
                                        productDetail.stock_status == 'onbackorder' ?
                                            <Text style={{ color: 'red', fontSize: 14, fontWeight: 'bold' }}>{'Currently Out of Stock. You can still order it but it will be delivered in 30 to 45 days.'}</Text>
                                            :
                                            null
                                :
                                null
                            }

                            {productDetail && productDetail.stock_quantity != "" && productDetail.stock_quantity != null ?

                                productDetail && productDetail.stock_status == 'instock' ?
                                    <Text style={{ color: colors.appColor, fontSize: 14, fontWeight: 'bold' }}>{'(' + productDetail.stock_quantity + ')'}</Text>

                                    :


                                    null
                                :
                                null
                            }
                        </Text>


                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                        <View style={{ width: screenDimensions.width / 2, flexDirection: 'row' }}>
                            {productDetail && productDetail.price_html ?
                                <HTML html={`<h3>${productDetail.price_html}</h3>`} />


                                :
                                null
                            }

                            <View style={{ width: 10 }} />
                        </View>

                        {
                            productDetail && productDetail.sale_price != "" && productDetail.sale_price != null ?
                                <View style={{ backgroundColor: colors.appColor, padding: 10, borderRadius: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{`Offer ${Number(div).toFixed(0)}% `}</Text>
                                </View>
                                :
                                null
                        }


                    </View>
                    {this.state.visible ? null : <HTML html={`<h4>Description</h4>`} />}

                    {
                        productDetail && productDetail && productDetail.short_description ?
                            <HTML html={`${productDetail.short_description}`} imagesMaxWidth={screenDimensions.width} />

                            :
                            this.state.visible ?
                                <View />
                                :
                                <View>

                                    <Text>{'No Description for this product'}</Text>
                                    <View style={{ height: 40 }} />
                                </View>
                    }

                    {params && params.dealofTheDayProduct ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ width: screenDimensions.width / 2, flexDirection: 'row' }}>

                                <Text style={{ fontSize: 12 }}>{"DON'T MISS OUT! THIS PROMOTION WILL EXPIRES IN"}</Text>
                                <View style={{ width: 10 }} />


                            </View>

                            {
                                datetoPass ?
                                    <View style={{ backgroundColor: 'red', padding: 10 }}>
                                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{datetoPass}</Text>
                                    </View>
                                    :
                                    null
                            }


                        </View>


                        :
                        null}


                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <View style={{ width: screenDimensions.width / 2, flexDirection: 'row', alignItems: 'center' }}>


                            {productDetail && productDetail.average_rating ?
                                <AirbnbRating
                                    count={5}
                                    selectedColor={colors.appColor}
                                    reviews={[]}
                                    defaultRating={productDetail.average_rating}
                                    size={20}
                                    showRating={false}
                                    isDisabled={true}
                                />
                                :
                                null
                            }

                            <View style={{ width: 10 }} />
                            {this.state.visible ? null :
                                <TouchableOpacity onPress={() => this.setState({ showReview: !this.state.showReview })}>
                                    <View style={{ paddingLeft: 10, borderRadius: 10, alignItems: 'center' }}>
                                        <Text style={{ color: colors.lightfontColor, fontWeight: 'bold', fontSize: 16 }}>
                                            {this.state.allReviewForProduct && this.state.allReviewForProduct.length ?
                                                `${this.state.allReviewForProduct.length} Reviews`
                                                : `0 Reviews`
                                            }
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }


                        </View>

                    </View>

                    {
                        this.state.allReviewForProduct.length && this.state.showReview ?
                            <FlatList
                                bounces={false}
                                extraData={this.state.allReviewForProduct}
                                // pagingEnabled={true}
                                // snapToInterval={300}
                                // numColumns={2}
                                // showsHorizontalScrollIndicator={false}
                                data={this.state.allReviewForProduct}
                                keyExtractor={this._keyExtractor4}
                                renderItem={this.allReviewForProduct}
                            // automaticallyAdjustContentInsets={true}


                            />
                            :
                            null
                    }








                </View>


                <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 15 }}>

                    {this.state.visible ? null : <Text style={styles.accountSetting}>{'Related products'}</Text>}
                    <FlatList
                        bounces={false}
                        extraData={this.state}
                        pagingEnabled={true}
                        autoplay={true}
                        horizontal={true}
                        snapToInterval={300}
                        // numColumns={2}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.relatedProducts}
                        keyExtractor={this._keyExtractor3}
                        renderItem={this.products}
                        automaticallyAdjustContentInsets={true}

                        ListEmptyComponent={
                            (this.state.relatedProducts.length == 0) ?
                                ListEmpty2({ state: this.state.visible2, margin: 50 })
                                :
                                null
                        }
                    />

                </View>


            </View>
        )
    }


    proceedToCheckOut = () => {
        // let data = {
        //     "totalAmount": this.props.allCartValues.totalAmount,
        //     "totalVat": this.props.allCartValues.totalVat,
        //     "lineItems": this.props.allCartItems,
        // }
        // console.log(data, "data data data")

        let lineItems = this.props.allCartItems.map((item, index) => {
            return {

                "product_id": item.id,
                "quantity": item.quantity

            }
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

    render() {
        let { productDetail } = this.state

        let { params } = this.props.navigation.state


        return (
            <View style={[styles.AndroidSafeArea, { flex: 1 }]} >
                <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                {/* <Video source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}   // Can be a URL or a local file.
                    ref={(ref) => {
                        this.player = ref
                    }}                                      // Store reference
                   /> */}
                <SafeAreaView
                    style={{ flex: 1, backgroundColor: colors.white }} >
                    <StatusBar
                        translucent
                        barStyle={"dark-content"}
                        backgroundColor={'white'}
                    />
                    {this.state.visible2 || this.state.visible ? <Spinner /> : null}
                    <View style={{ backgroundColor: 'white', paddingBottom: 5, }}>
                        <ScrollView
                            stickyHeaderIndices={[1]}
                            ref={ref => this.scrollView = ref}
                            onContentSizeChange={() => {
                                this.state.tab2 ?
                                    this.scrollView.scrollTo({ x: 0, y: 0, animated: true })
                                    :
                                    null;
                            }}>

                            {this.renderComponent1()}
                            {<View style={{ zIndex: 10000, position: 'absolute', left: 0, right: 0, backgroundColor: 'transparent', marginTop: 15, marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >

                                <View style={{ zIndex: 10000, position: 'relative', left: 0, right: 0, backgroundColor: 'transparent', marginTop: 15, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                                    <TouchableOpacity
                                        // hitSlop={{ height: 25, width: 25 }}
                                        style={{ justifyContent: 'center', flex: 0.2 }}
                                        onPress={() => this.props.navigation.goBack()}>
                                        <View >
                                            <Image source={require('../assets/images/backArrowGreen/ic_back_green.png')} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={true}>

                                        <View style={{ flexDirection: 'row', flex: 0.8 }}>
                                            <TouchableOpacity
                                                onPress={() => this.selectItemToWishListForRelatedProducts(productDetail, true)}>
                                                {/* onPress={() => this.props.navigation.navigate('WishlistScreen2', { fromWishlist: true, productDetail: productDetail })}> */}
                                                <Image source={require('../assets/images/wishlistGreen/ic_wishlist.png')} />

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.setState({ payAndCheckoutButton: false }, () => { this.props.navigation.navigate('CartScreen2') })}>

                                                {/* <Image style={{ marginLeft: 10 }} source={require('../assets/images/cart/ic_cart.png')} /> */}
                                                <IconBadge
                                                    MainElement={
                                                        <Image style={{ marginLeft: 10 }} source={require('../assets/images/cart/ic_cart.png')} />
                                                    }
                                                    BadgeElement={
                                                        <Text style={{ color: 'white' }}>{this.props.cartItems}</Text>
                                                    }
                                                    IconBadgeStyle={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        left: 0,
                                                        width: 30,
                                                        height: 30,
                                                        borderRadius: 15,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderColor: 'white',
                                                        borderWidth: 2,
                                                        backgroundColor: 'grey'
                                                    }}
                                                    Hidden={this.props.cartItems == 0 || this.props.cartItems == null}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>


                                </View>
                            </View>
                            }

                            {
                                this.renderComponent3()
                            }

                        </ScrollView>
                    </View>



                    {this.state.isModalVisible ?
                        this.renderModal() :
                        null
                    }
                </SafeAreaView>
                {
                    // this.state.productDetail && this.state.productDetail.stock_status == "outofstock" ?
                    //     null
                    //     :
                    <View style={{
                        justifyContent: 'flex-end',
                        paddingVertical: 15,
                        marginHorizontal: 40,
                        backgroundColor: 'transparent',

                    }}>
                        {this.state.visible ?
                            null
                            :
                            this.state.productDetail && this.state.productDetail.stock_status == "outofstock" ?
                                null
                                :
                                this.state.payAndCheckoutButton ?
                                    null :


                                    // (!this.state.payAndCheckoutButton && this.props.cartItems.length == 0)
                                    <CustomeButton
                                        // enabled={this.state.visible ? false : true}
                                        buttonStyle={styles.buttonStyle}
                                        backgroundColor={'#01A651'}
                                        title={"ADD TO CART"}
                                        borderColor={'#01A651'}
                                        fontWeight={'bold'}
                                        fontSize={14}
                                        // lineHeight={16}
                                        activeOpacity={9}
                                        onPress={() => this.openModalForQualitySelector()}
                                        textColor={'#FFFFFF'}
                                        icon={require('../assets/images/addPlus/ic_add.png')}
                                    />



                        }





                        {this.state.payAndCheckoutButton ?

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>



                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('app')}
                                    // onPress={() => this.setState({ payAndCheckoutButton: false }, () => { this.proceedToCheckOut() })}
                                    style={{
                                        paddingVertical: 12,
                                        borderWidth: 1,
                                        borderRadius: 15, borderColor: 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: screenDimensions.width / 2 - 20, backgroundColor: '#01A651'
                                    }}>

                                    <Image source={require('../assets/images/addProfile/ic_profile-add.png')} />
                                    <View style={{ paddingLeft: 3 }}>
                                        <Text numberOfLines={2} style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' }}>
                                            {'CONTINUE\nSHOPPING'}
                                        </Text>
                                    </View>


                                </TouchableOpacity>

                                <View style={{ width: 5 }} />
                                <TouchableOpacity
                                    onPress={() => this.setState({ payAndCheckoutButton: false }, () => { this.props.navigation.navigate('CartScreen2') })}
                                    style={{
                                        paddingVertical: 12,
                                        borderWidth: 1,
                                        borderRadius: 15, borderColor: 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                        width: this.state.productDetail && this.state.productDetail.stock_status == "outofstock" ? screenDimensions.width / 2 : screenDimensions.width / 2 - 20,
                                        backgroundColor: '#01A651'
                                    }}>

                                    <Image
                                        source={require('../assets/images/addProfile/ic_profile-add.png')}
                                    />
                                    <View style={{ paddingLeft: 3 }}>
                                        <Text numberOfLines={2} style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' }}>
                                            {'CHECKOUT'}
                                        </Text>
                                    </View>


                                </TouchableOpacity>

                            </View>
                            :
                            null



                        }




                    </View>

                }

            </View>

        )
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        userCommon: state.user,
        allCartItems: state.login.allCartItems,
        wishlistData: state.login.wishlistData,
        totalWishListItem: state.login.totalWishListItem,
        allCartValues: state.login.allCartValues,
        cartItems: state.login.cartItems,
        allTaxData: state.login.allTaxData,
        guestID: state.login.guestID


    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        cartActions: bindActionCreators(cartActions, dispatch),
        wishlistActions: bindActionCreators(wishlistActions, dispatch),
        reviewActions: bindActionCreators(reviewActions, dispatch),
    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(ProductDetailScreen)

