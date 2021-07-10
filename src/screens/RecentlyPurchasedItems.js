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
    ImageBackground,
    RefreshControl,
    ActivityIndicator
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
import { formatter } from '../utilities/Formatter'
import { ToastMessage } from '../components/Toast';
import {
    Freshchat,
    setUser
} from '../components/FreshChat'
//global libs
// import { CachedImage } from 'react-native-cached-image'
import CardView from 'react-native-cardview'
import Modal from 'react-native-modal'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import axios from 'axios';
import { key, sec } from '../utilities/config'

//contants
const sliderWidth = Dimensions.get("window").width - 100;
const itemWidth = Dimensions.get("window").width - 100;

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
//Actions
import * as userActions from '../redux/actions/userAction';
import * as productActions from '../redux/actions/productAction'
import * as customerActions from '../redux/actions/customerAction'
import * as wishlistActions from '../redux/actions/wishlistAction'

import { screenDimensions, colors } from '../utilities/constants';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import IconBadge from 'react-native-icon-badge';


class RcentlyPurchased extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '4202, Tabuk St , Riyadh',
            cartItems: 3,
            products: this.props.recentlyPurchasedItems,
            trainingEquipmentsroducts: [],
            allCategory: [],
            allselectedItemToWishList: [],
            openFilter: false,
            openSearchTrue: false,
            shortByMixed: [
                { id: 1, title: 'Sort by popularity', value: 'popularity' },
                { id: 2, title: 'Sort by average rating', value: 'rating' },
                { id: 3, title: 'Short by latest', value: 'date' },
                // { id: 4, title: 'Low to high', value: 'price' },
                // { id: 5, title: 'High to low', value: 'price-desc' }

            ],
            shortByPrice: [
                { id: 4, title: 'Low to high', value: 'price' },
                { id: 5, title: 'High to low', value: 'price-desc' }
            ],
            sortByReview: [
                { id: 1, title: '5 star', value: 5 },
                { id: 2, title: '4 star', value: 4 }
            ],
            selectedRangeIndex: null,
            selectedRange: null,
            selectedshortByMixedIndex: null,
            selectedshortByMixed: null,
            selectedsortByReviewIndex: null,
            selectedsortByReview: null,
            minPrice: null,
            maxPrice: null,
            visible: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            searchedText: '',
            pageno: 1,
            dataExit: false,
            isRefreshing: false,
            refreshing: false,
            visible2: false
        }
    }
    componentDidMount = () => {
        // this.setState({visible5:true})
        // this.getAllProductsforCategory()
        Promise.all([
            this.getAllWishListItem(),
            // /this.getAllCategory()
            // this.getALlRecentlyPurchasedItems()
        ]).then(() => {
            // console.log('All promices are resolved');
            this.setState({ visible5: false });
        }).catch((error) => {
            // console.log('promise all error: ', error);
            this.setState({ visible5: false });
        });

        // this.getAllWishListItem()
        // // /this.getAllCategory()
        // this.getALlRecentlyPurchasedItems()
    }

    getALlRecentlyPurchasedItems = () => {
        let userInfo = this.props && this.props.user ? this.props.user : null
        let data = {
            'key': key,
            'sec': sec,
            'user_id': userInfo ? userInfo.id : null
        }
        return this.props.productActions.getAllRecentlyPurchasedItems(data, userInfo.id).then((res) => {
            if (res && res.status == 200) {
                debugger
                let data = Object.keys(res.data).map(val => {
                    return { ...res.data[val], parentId: val };
                });
                console.log("recently", data)
                this.props.productActions.saveRecentlyPurchasedItems(data)


                this.setState({
                    visible: false,
                    refreshing: false,
                    // dataExit: data.length ? true : false,
                    // products: this.state.pageno == 1 ? data : [...this.state.products, ...data],
                })

            } else {

                this.setState({ visible: false, refreshing: false })

            }
        }).catch((err) => {
            //
            this.setState({ visible: false, refreshing: false })
        })
    }
    //Get products for particular category
    getAllProductsforCategory = () => {
        this.setState({ visible: true })
        let { params } = this.props.navigation.state
        let id = params && params.categotry && params.categotry.term_id ? (params.categotry.term_id) :
            params && params.item && params.item.id ?
                params.item.id :
                null
        debugger
        let data = {}
        if (params && params.onsale) {

            data = {
                page: 1,
                per_page: 100,
                on_sale: true,
                status: 'publish'
            }
        } else {
            data = {
                category: id,
                page: this.state.pageno,
                per_page: 20,
                search: this.state.searchedText,
                status: 'publish'
            }

        }


        this.props.productActions.getAllProducts(data).then((res) => {

            console.log('get all products listing', res)
            if (res && res.status == 200) {

                this.setState({
                    visible: false,
                    dataExit: res.data.length ? true : false,
                    products: this.state.pageno == 1 ? res.data : [...this.state.products, ...res.data],
                })

            } else {

                this.setState({ visible: false, })

            }
        }).catch((err) => {
            //
            this.setState({ visible: false })
        })
    }

    getProductData = (item) => {
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


    getAllWishListItem = (type) => {

        let userInfo = this.props && this.props.user ? this.props.user : null
        let guestID = this.props && this.props.guestID ? this.props.guestID : null

        let data = {
            'key': key,
            'sec': sec,
            'user_id': userInfo ? userInfo.id : guestID ? guestID : null

        }
        let userId = userInfo ? userInfo.id : guestID ? guestID : null

        return this.props.wishlistActions.getItemsWishlist(data, userId).then((res) => {
            if (res && res.status == 200) {
                console.log(res.data)
                if (res && res.data && res.data.length) {
                    let allData = res.data.map((item, index) => {
                        return (this.getProductData(item))
                    })

                    Promise.all(allData).then((result) => {

                        // result.reduce((a, x) => a.includes(x) ? a : [...a, x], []).sort()
                        console.log(result, "result")
                        this.props.wishlistActions.setWishlistItem({ wishlistData: result, totalWishlistItem: result.length })
                      
                        if (type == 'Add') {
                            ToastMessage("Item added successfully to wishlist")

                        }
                        if (type == 'DELETE') {
                            ToastMessage("Item removed from the wishlist successfully")

                        }
                        this.setState({ wishlistItems: result, visible: false })


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


    selectWishList = (value) => {
        debugger
        let userInfo = this.props && this.props.user ? this.props.user : null

        let guestID = this.props && this.props.guestID ? this.props.guestID : null

        debugger
        // if (userInfo) {

        this.setState({ visible: true })
        let data = {
            'key': key,
            'sec': sec,
            'prod_id': value.prod_id,
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

        // } else {
        //     ToastMessage('You need to login to access this feature')
        // }

    }



    //Select item to wish list for Featured values
    selectItemToWishList = (value) => {


        if (this.props.wishlistData && this.props.wishlistData.length) {
            let wishlistExist = this.props.wishlistData.find(item => item.prod_id == value.prod_id)
            if (wishlistExist) {
                // ToastMessage("Item is already added in wishlist")
                this.deleteItemFromwishlist(wishlistExist)

            }
            else {
                this.selectWishList(value)
            }
        }
        else {
            this.selectWishList(value)
        }


        // if (this.props.wishlistData && this.props.wishlistData.length) {
        //     let wishlistExist = this.props.wishlistData.find(item => item.prod_id == value.pro_id)
        //     if (wishlistExist) {
        //         ToastMessage("Item is already added in wishlist")
        //     }
        //     else {
        //         this.selectWishList(value)
        //     }
        // }
        // else {
        //     this.selectWishList(value)
        // }
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


    redirectToProductScreen = () => {
        // this.props.productActions.retrieveProduct(item.id).then((res) => {
        //     console.log("Product detail", res.data)
        //     debugger
        //     this.setState({ productDetail: res.data, tab2: true, visible: false }, () => {

        //         this.getAllRelatedProducts(this.state.productDetail)
        //     })
        // }).catch((err) => {
        //     //
        //     this.setState({ visible: false })
        // })
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
            wishlistExist = this.props.wishlistData.find(itm => itm.prod_id == item.prod_id)
            // console.log(wishlistExist, "wishlistExist     -------    wishlistExist exist")

            if (wishlistExist != null && wishlistExist != undefined) {
                item['check'] = true
            }
            else {
                item['check'] = false
            }
        }


        return (
            // <TouchableOpacity activeOpacity={9} onPress={() => this.props.navigation.navigate('ProductDetailScreen', { productDetail: item })}>
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

                            <ImageBackground
                                style={[styles.imageViewAllProductsCategory, { zIndex: 1, backgroundColor: 'white' }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={item && item.img ? { uri: item.img } : require('../assets/img/greyscale.jpg')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', top: 120 }}>
                                    <TouchableOpacity onPress={() => this.selectItemToWishList(item)}>
                                        <Image source={item && item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>

                                </View>
                            </ImageBackground>

                            <View style={{ marginTop: 8, padding: 5 }}>

                                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => this.selectItemToWishList(item)}>
                                        <Image source={item.check ? require('../assets/images/heartFilledWishList/ic_fav.png') : require('../assets/images/heartUnfilledWishList/ic_heart_unfilled.png')} />
                                    </TouchableOpacity>
                                </View> */}


                                <Text style={styles.productType} numberOfLines={2}>{item.name.replace(/&amp;/g, '&')}</Text>

                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <Text style={styles.aedPrice} numberOfLines={2}>{`AED ${Number(item.price).toFixed(2)}`}</Text>
                                    <Text style={[styles.excVat, { paddingLeft: 10 }]} numberOfLines={2}>{`exc. VAT`}</Text>

                                </View>

                            </View>

                        </View>
                    </CardView>

                </View>
            // </TouchableOpacity>
        )
    }


    //Apply filter

    applyFilter = () => {
        let { params } = this.props.navigation.state
        let data = {}
        data['category'] = params.item.id
        data['per_page'] = 20
        data['page'] = this.state.pageno,
            data['status'] = 'publish'
        if (this.state.searchedText != '' || this.state.searchedText != null) {
            data['search'] = this.state.searchedText
        }

        if (this.state.selectedshortByMixed) {
            if (this.state.selectedshortByMixed == 'price' || this.state.selectedshortByMixed == 'price-desc') {

            }
            else {
                data['orderby'] = this.state.selectedshortByMixed
            }


        }
        if (this.state.minPrice && this.state.maxPrice) {
            data['min_price'] = Number(this.state.minPrice)
            data['max_price'] = Number(this.state.maxPrice)
        }
        if (this.state.selectedsortByReview) {
            data['rating_filter'] = this.state.selectedsortByReview
        }
        debugger
        // this.setState({ visible: true })


        this.props.productActions.getAllProducts(data).then((res) => {
            console.log('filtered Data', res.data)
            if (res && res.status == 200) {

                if (this.state.selectedshortByMixed == 'price') {

                    let filterDataArray = res.data.sort(function (a, b) {
                        debugger
                        return parseFloat(a.price) - parseFloat(b.price)
                    })
                    this.setState({
                        visible: false,
                        refreshing: false,
                        isRefreshing: false,
                        dataExit: res.data.length ? true : false,
                        products: this.state.pageno == 1 ? filterDataArray : [...this.state.products, ...filterDataArray],
                        openFilter: false,

                    })
                }
                if (this.state.selectedshortByMixed == 'price-desc') {
                    debugger
                    let filterDataArray = res.data.sort(function (a, b) {
                        debugger
                        return parseFloat(a.price) < parseFloat(b.price)
                    })
                    debugger
                    this.setState({
                        visible: false,
                        refreshing: false,
                        isRefreshing: false,
                        dataExit: res.data.length ? true : false,
                        products: this.state.pageno == 1 ? filterDataArray : [...this.state.products, ...filterDataArray],
                        openFilter: false,

                    })
                }
                this.setState({

                    visible: false,
                    refreshing: false,
                    isRefreshing: false,
                    dataExit: res.data.length ? true : false,
                    products: this.state.pageno == 1 ? res.data : [...this.state.products, ...res.data],
                    openFilter: false,

                })
            } else {
                this.setState({ visible: false, openFilter: false, })
            }

        }).catch((err) => {
            //
            this.setState({ visible: false, openFilter: false, })
        })
        // if()
    }



    handleRefresh = () => {
        let { params } = this.props.navigation.state
        params && params.onsale ?
            null
            :

            this.setState({
                pageno: 1,
                refreshing: true,
                visible: true
            }, () => {
                this.getALlRecentlyPurchasedItems();
                this.getAllWishListItem()
            });
    }

    handleLoadMore = () => {
        debugger


        if (this.state.dataExit) {
            this.setState({
                pageno: this.state.pageno + 1
            }, () => {
                this.getALlRecentlyPurchasedItems();
            });
        }
    }
    renderFooter = () => {
        let { params } = this.props.navigation.state
        return (
            // !this.state.isRefreshing && this.state.dataExit ?
            //     <View>
            //         <ActivityIndicator animating size="large" color={colors.appColor} />
            //     </View>
            //     :
            //     null
            this.state.dataExit ?
                params && params.onsale ?
                    null :
                    <View style={styles.footer}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => this.setState({ pageno: this.state.pageno + 1, isRefreshing: true }, () => this.getALlRecentlyPurchasedItems())}
                            //On Click of button calling loadMoreData function to load more data
                            style={styles.loadMoreBtn}>
                            <Text style={styles.btnText}>Load More</Text>
                            {this.state.isRefreshing ? (
                                <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
                            ) : null}
                        </TouchableOpacity>
                    </View>
                :
                null


        )
    }

    mainComponent = () => {
        let { params } = this.props.navigation.state

        return (
            <View style={{ alignItems: 'center', marginTop: 10, }}>

                <FlatList
                    bounces={true}
                    extraData={this.state}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    data={this.state.products}
                    keyExtractor={this._keyExtractor3}
                    renderItem={this.products}
                    automaticallyAdjustContentInsets={true}
                    refreshing={this.state.isRefreshing}
                    // onRefresh={this.handleRefresh}
                    // onEndReached={this.handleLoadMore}
                    // onEndReachedThreshold={1}
                    // ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={
                        (this.state.products.length == 0) ?
                            ListEmpty2({ state: this.state.visible2, margin: 50 })
                            :
                            null
                    }
                />
            </View>
        )
    }

    filterComponent = () => {
        return (
            <ScrollView>
                <View style={{ paddingBottom: 200 }}>

                    {/* sort by mixed */}
                    {this.state.shortByMixed.length ?
                        <View style={{ paddingBottom: 10, paddingTop: 20, marginHorizontal: 20 }}>
                            <View><Text style={styles.shortByPrice}>{'Sort by'}</Text></View>
                            <View style={{ marginTop: 20 }}>
                                {
                                    this.state.shortByMixed.map((item, index) => {
                                        return (
                                            <TouchableOpacity key={index} activeOpacity={9} onPress={() => this.setState({ selectedshortByMixedIndex: item.id, selectedshortByMixed: item.value })}>
                                                <View key={index} style={{ flexDirection: 'row', paddingBottom: 8, alignItems: 'center' }}>
                                                    {this.state.selectedshortByMixedIndex == item.id ?
                                                        <Image source={require('../assets/images/radioOn/ic_radio_on.png')} />
                                                        : <Image source={require('../assets/images/radioOff/ic_radio_off.png')} />
                                                    }
                                                    <Text style={[styles.range, { paddingLeft: 10 }]}>{item.title}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>


                            <View style={{ height: 1, backgroundColor: colors.lightBlack, marginVertical: 10 }} />

                        </View>

                        :
                        null
                    }


                    {/* sort by price */}
                    {this.state.shortByPrice.length ?
                        <View style={{ paddingBottom: 5, marginHorizontal: 20 }}>
                            <View><Text style={[styles.shortByPrice, { fontWeight: 'bold' }]}>{'Sort by price'}</Text></View>
                            <View style={{ marginTop: 10 }}>
                                {
                                    this.state.shortByPrice.map((item, index) => {
                                        return (
                                            <TouchableOpacity key={index} activeOpacity={9} onPress={() => this.setState({ selectedshortByMixedIndex: item.id, selectedshortByMixed: item.value })}>
                                                <View key={index} style={{ flexDirection: 'row', paddingBottom: 8, alignItems: 'center' }}>
                                                    {this.state.selectedshortByMixedIndex == item.id ?
                                                        <Image source={require('../assets/images/radioOn/ic_radio_on.png')} />
                                                        : <Image source={require('../assets/images/radioOff/ic_radio_off.png')} />
                                                    }
                                                    <Text style={[styles.range, { paddingLeft: 10 }]}>{item.title}</Text>
                                                </View>

                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            <View style={{ height: 25 }} />
                            <Text style={{ fontSize: 14, color: 'grey', paddingBottom: 20 }}>{'Other price'}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', flexDirection: 'row', marginHorizontal: 20 }}>

                                <View style={{ padding: 5, height: 45, width: screenDimensions.width / 3, backgroundColor: 'white' }}>
                                    <TextInput
                                        value={this.state.minPrice}
                                        onChangeText={(value) => this.setState({ minPrice: value })}
                                        placeholder={'From'}
                                        placeholderTextColor={'grey'}
                                        style={{ fontSize: 12, height: 40, color: 'grey' }}
                                        returnKeyType={'next'}
                                        keyboardType={'number-pad'}
                                        ref={(ref) => { this.minPrice = ref }}
                                        onSubmitEditing={(event) => { Keyboard.dismiss() }}

                                    />
                                </View>
                                <View style={{ width: 20 }} />
                                <View style={{ padding: 5, height: 45, width: screenDimensions.width / 3, backgroundColor: 'white' }}>
                                    <TextInput
                                        value={this.state.maxPrice}
                                        onChangeText={(value) => this.setState({ maxPrice: value })}
                                        placeholder={'To'}
                                        placeholderTextColor={'grey'}
                                        style={{ fontSize: 12, height: 40, color: 'grey' }}
                                        returnKeyType={'next'}
                                        keyboardType={'number-pad'}
                                        ref={(ref) => { this.maxPrice = ref }}
                                        onSubmitEditing={(event) => { Keyboard.dismiss() }}

                                    />
                                </View>

                            </View>
                            <View style={{ height: 1, backgroundColor: colors.lightBlack, marginVertical: 10 }} />

                        </View>
                        :
                        null}


                    {/* sort by review */}

                    {this.state.sortByReview.length ?
                        <View style={{ paddingBottom: 5, marginHorizontal: 20 }}>
                            <View><Text style={[styles.shortByPrice, { fontWeight: 'bold' }]}>{'By review'}</Text></View>
                            <View style={{ marginTop: 10 }}>
                                {
                                    this.state.sortByReview.map((item, index) => {
                                        return (
                                            <TouchableOpacity key={index} activeOpacity={9} onPress={() => this.setState({ selectedsortByReviewIndex: index, selectedsortByReview: item.value })}>
                                                <View key={index} style={{ flexDirection: 'row', paddingBottom: 7, alignItems: 'center' }}>
                                                    {this.state.selectedsortByReviewIndex == index ?
                                                        <Image source={require('../assets/images/radioOn/ic_radio_on.png')} />
                                                        : <Image source={require('../assets/images/radioOff/ic_radio_off.png')} />
                                                    }
                                                    <Text style={[styles.range, { paddingLeft: 10 }]}>{item.title}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>

                            <View style={{ height: 0, backgroundColor: colors.lightBlack, marginVertical: 10 }} />

                        </View>

                        :
                        null}




                </View>
            </ScrollView>
        )
    }


    searchFilterFunction = (text) => {
        this.setState({ visible: true })
        this.setState({ searchedText: text }, () => {
            this.getALlRecentlyPurchasedItems()
        })


    }

    textInputProps = () => {
        return {
            value: this.state.searchedText,
            style: [styles.whatareyoulooking, { paddingLeft: 5 }],
            placeholder: strings.whatareyoulooking,
            placeholderTextColor: 'rgba(28,28,28,0.44)',
            onChangeText: (searchedText) => this.searchFilterFunction(searchedText),
            keyboardType: 'default',
            returnKeyType: 'done'
        }
    }

    closeFilterModal = () => {
        this.setState({
            selectedRangeIndex: null,
            selectedRange: null,
            selectedshortByMixedIndex: null,
            selectedshortByMixed: null,
            selectedsortByReviewIndex: null,
            selectedsortByReview: null,
            minPrice: null,
            maxPrice: null,
            openFilter: false

        }, () => {
            this.getALlRecentlyPurchasedItems()
        })
    }

    openFreshChat = () => {
        setUser(this.props.user)
        Freshchat.showConversations()
    }

    render() {
        let { params } = this.props.navigation.state
        console.log(params, "[params")
        return (
            <View style={[styles.container, styles.AndroidSafeArea]}>
                <SafeAreaView style={{ flex: 0, backgroundColor: '#00A651' }} />
                <StatusBar
                    translucent
                    barStyle={"dark-content"}
                    backgroundColor={'#00A651'}
                />
                <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }}
                    style={[{ flex: 1, backgroundColor: '#ffffff' }]} >

                    {this.state.visible || this.state.visible5 ? <Spinner /> : null}

                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <Container
                            header={true}
                            scrollView={true}
                            viewStyle={{ marginTop: 20, height: screenDimensions.height }}
                            // viewStyle={[{ marginTop: 20, }, this.state.openFilter ? { paddingBottom: 150 } : { height: screenDimensions.height, alignItems: 'center' }]}
                            scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 150 }}
                            scrollProps={{
                                showsVerticalScrollIndicator: false,
                                // height: screenDimensions.height,
                                keyboardShouldPersistTaps: 'handled',
                                refreshControl:
                                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />

                            }}

                            leftItem1={require('../assets/images/arrowLeftBackWhite/ic_back_arrow.png')}
                            rightItem1={this.state.openFilter ? false : require('../assets/images/notificationIcon/ic_notification.png')}
                            rightItem2={this.state.openFilter ? false : require('../assets/images/messageIcon/ic_message.png')}
                            rightItem3={this.state.openFilter ? 'clear all' : false}
                            rightItem1Press={() => this.props.navigation.navigate('Notification')}
                            rightItem2Press={() => this.openFreshChat()}
                            notificationCount={this.props.unReadMessage}
                            rightItem3Press={() => this.closeFilterModal()}
                            leftItem2={'Recently Purchased'}
                            leftItem1Press={() => this.props.navigation.goBack()}
                            mainComponent={() => this.mainComponent()}
                            textInputProps={() => this.textInputProps()}
                            searchProps={this.state.openSearchTrue}
                        />
                    </View>


                </SafeAreaView>

                {

                    this.state.openFilter ?
                        <View style={{
                            justifyContent: 'flex-end',
                            paddingVertical: 5,
                            // marginHorizontal: 40,
                            backgroundColor: 'transparent',

                        }}>
                            {
                                <View style={{ flexDirection: 'row', marginHorizontal: 30, justifyContent: 'space-between', paddingBottom: 40 }}>

                                    <TouchableOpacity onPress={() => this.setState({ visible: true, pageno: 1 }, () => { this.getALlRecentlyPurchasedItems() })}>
                                        <View style={{ borderRadius: 10, alignItems: 'center', backgroundColor: colors.appColor, width: screenDimensions.width / 3 + 10, padding: 10, flexDirection: 'row' }}>
                                            <Image source={require('../assets/images/smallCheck/ic_check_small.png')} />
                                            <Text style={{ paddingLeft: 15, fontSize: 14, textAlign: 'center', color: colors.white }}>{'Apply'}</Text>
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity onPress={() => this.setState({ openFilter: false })}>
                                        <View style={{ borderRadius: 10, alignItems: 'center', backgroundColor: colors.appColor, width: screenDimensions.width / 3 + 10, padding: 10, flexDirection: 'row' }}>
                                            <Image source={require('../assets/images/smallCross/ic_cross.png')} />

                                            <Text style={{ paddingLeft: 15, fontSize: 14, textAlign: 'center', color: colors.white }}>{'Cancel'}</Text>


                                        </View>
                                    </TouchableOpacity>

                                </View>
                            }


                        </View>

                        :
                        null
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
        wishlistData: state.login.wishlistData,
        totalWishListItem: state.login.totalWishListItem,
        recentlyPurchasedItems: state.login.recentlyPurchasedItems,
        unReadMessage: state.login.unReadMessage,
        guestID: state.login.guestID

    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        wishlistActions: bindActionCreators(wishlistActions, dispatch),
    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(RcentlyPurchased)

