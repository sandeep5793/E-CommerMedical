import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
    RefreshControl,
    ImageBackground
} from 'react-native';

//Local imports
import styles from '../styles'
import Spinner from '../components/Spinner'
import strings from '../utilities/languages'
import cart from '../assets/images/ic_cart.png'


//global libs
// import { CachedImage } from 'react-native-cached-image'
import CardView from 'react-native-cardview'
import {
    Freshchat,
    setUser
} from '../components/FreshChat'
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
import { screenDimensions } from '../utilities/constants';
import { ScrollView } from 'react-native-gesture-handler';
import IconBadge from 'react-native-icon-badge';
import { ToastMessage } from '../components/Toast';


class CategoriesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '4202, Tabuk St , Riyadh',
            cartItems: 3,
            bannerData: [
                { id: 1, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/05/smartlink-slide.jpg' },
                { id: 2, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/05/Main-slider-evacuation-chair-new.jpg' },
                { id: 3, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/05/Main-slider-staxi.jpg' },
            ],
            adesandaccessories: [],
            trainingEquipmentsroducts: [],
            allCategory: this.props && this.props.allCategoryItems.length ? this.props.allCategoryItems : [],
            allBrandsPartners: [
                { id: 1, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/Philips.png' },
                { id: 2, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/St-John.png' },
                { id: 3, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/Reliance.png' },
                { id: 4, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/gamte.png' },
                { id: 5, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/02/Life-secure.png' },
                { id: 6, image: 'https://eshop.arascamedical.com/wp-content/uploads/2019/03/Innosonian-1.png' },
            ],
            visible: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            searchedText: '',
            pageNO: 1,
            refreshing: false

        }
    }

    componentDidMount = () => {
        let { allCategory } = this.state
        // this.getAllCategory()
        // this.props.productActions.getAllCustomers().then((res)=>{
        //     console.log(res,"res")
        // }).catch((err)=>{

        // })
        if (allCategory && allCategory.length) {

        } else {
            this.getAllCategory()
        }

    }

    //freshchat SDK
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

    //get list of all category in case of no category found
    getAllCategory = () => {
        debugger
        this.setState({ visible: true })
        this.props.productActions.getAllProductsCategory({ page: this.state.pageNO, per_page: 100, order: 'asc' }).then((res) => {
            debugger
            if (res && res.status == 200) {
                console.log(res.data)

                let newArray = res.data.filter(item => item.slug != 'wallet' && item.slug != 'uncategorized')
                this.props.productActions.setAllCategory({ allCategoryItems: newArray, })

                this.setState({
                    // allCategory: newArray,
                    visible: false, refreshing: false
                })
            }
            else {
                this.setState({ visible: false, refreshing: false })

            }
        }).catch((err) => {
            this.setState({ visible: false, refreshing: false })
        })
    }



    //Pull to refresh data
    handleRefresh = () => {
        this.setState({
            refreshing: true,
            // visible: true
        }, () => {
            this.getAllCategory();
        });

    }



    //AEDs and Accessories
    _keyExtractor3 = (item, index) => index + 'flatlist3';
    adeproducts = ({ item, index }) => {
        debugger
        return (
            <TouchableOpacity activeOpacity={9} onPress={() => console.log("product list")}>
                <View index={index} style={styles.mainViewAllProducts}>
                    <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={5}
                        style={styles.cardViewAllProducts}>
                        <View style={{ backgroundColor: 'white', borderRadius: 5, height: screenDimensions.width / 2 + 20 }}>


                            <Image
                                style={[styles.imageViewAllProducts, { position: 'absolute', zIndex: 0 }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={require('../assets/img/greyscale.jpg')}
                            />

                            <Image
                                style={[styles.imageViewAllProducts, { zIndex: 1, backgroundColor: 'white' }]}
                                resizeMode={'stretch'}
                                resizeMethod={'resize'}
                                source={item.images && item.images[0] && item.images[0].src ? { uri: 'https://api.arascamedical.com/wp-content/uploads/2019/03/M5066CC.Philips-Heart-Start-Defibrillator-HS1-with-carrying-case-M5075.jpg' } : require('../assets/img/greyscale.jpg')}
                            />

                            <View style={{ marginTop: 15, padding: 5 }}>
                                <Text style={styles.productType} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.aedPrice} numberOfLines={2}>{`AED ${item.price}`}</Text>
                            </View>

                        </View>
                    </CardView>

                </View>
            </TouchableOpacity>
        )
    }

    //search for a specific category
    searchFilterFunction = (text) => {
        debugger
        // if (text != '') {
        debugger
        this.setState({ searchedText: text, visible: true })
        let data = {
            search: text,
            per_page: 100
        }
        this.props.productActions.getAllProductsCategory(data).then((res) => {
            let newArray = res.data.filter(item => item.slug != 'wallet' && item.slug != 'uncategorized')

            this.setState({ allCategory: newArray, visible: false })
        }).catch((err) => {
            this.setState({ visible: false })
            console.log(err, "error")
        })

    }

    //navigte to  productlisting screen
    navigateToProduct = (item) => {
        this.searchFilterFunction('')
        this.props.navigation.navigate('ProductListingScreen', { item: item })
    }

    render() {
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

                        {this.state.visible ? <Spinner /> : null}

                        <View style={{ flex: 1, backgroundColor: 'white' }}>

                            <View style={{ position: 'absolute' }}>
                                <ImageBackground
                                    source={require('../assets/images/Group/Group.png')}
                                    style={{ width: screenDimensions.width, height: screenDimensions.height / 3, margin: 0, }}
                                >
                                </ImageBackground>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
                                <View style={{ flex: 0.8, paddingLeft: 10 }}>
                                    {<Image source={require('../assets/images/appTopIcon/logo.png')} />}
                                </View>

                                <View style={{ flex: 0.2, flexDirection: 'row' }}>
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
                                    <TouchableOpacity onPress={() => this.openFreshChat()}>
                                        <Image source={require('../assets/images/messageIcon/ic_message.png')} />
                                    </TouchableOpacity></View>
                            </View>

                            <View style={{ backgroundColor: 'white', marginHorizontal: 10 }}>
                                <View style={styles.searchContainer}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ paddingHorizontal: 10, alignItems: 'center', flexDirection: 'row' }}>
                                            <View style={{ flex: 0.1, alignItems: 'center' }}>
                                                <Image source={require('../assets/images/greySearch/ic_search_gray.png')} />
                                            </View>
                                            <View style={{ flex: 0.9, justifyContent: 'center', alignSelf: 'center' }}>
                                                <TextInput
                                                    value={this.state.searchedText}
                                                    style={[styles.whatareyoulooking, { paddingLeft: 5 }]}
                                                    placeholder={strings.whatareyoulooking}
                                                    placeholderTextColor={'rgba(28,28,28,0.44)'}
                                                    onChangeText={(searchedText) => this.searchFilterFunction(searchedText)}
                                                    keyboardType={'default'}
                                                    returnKeyType={'done'}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>


                            <View style={{
                                marginTop: 10,
                                marginHorizontal: 5,
                                backgroundColor: 'rgba(238,238,238,0.9)',
                                flex: 1,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20
                            }}
                            >

                                <ScrollView
                                    style={{ marginTop: 10, paddingBottom: 10 }}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.handleRefresh}
                                        />}
                                >
                                    <View style={{ flexDirection: 'row', paddingBottom: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {
                                            this.state.allCategory.length ?
                                                this.state.allCategory.map((item, index) => {
                                                    //     if (index <= 6) {

                                                    return (
                                                        <TouchableOpacity
                                                            style={{
                                                                margin: 2,
                                                                borderRadius: 10,
                                                                width: screenDimensions.width / 5 + 10,
                                                                paddingBottom: 10,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                // flexWrap: 'wrap',
                                                                backgroundColor: '#ECECEC'
                                                            }}
                                                            key={index}
                                                            onPress={() => this.navigateToProduct(item)}>
                                                            <View style={{ flex: 1 }} >
                                                                <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                                                                    {item && item.image && item.image.src ?

                                                                        <Image
                                                                            style={[{ height: 75, width: 75, alignSelf: 'center' }, { zIndex: 1, }]}
                                                                            resizeMode={'stretch'}
                                                                            resizeMethod={'resize'}
                                                                            //source={{ uri: 'https://eshop.arascamedical.com/wp-content/uploads/2019/07/31515-MobileAid%C2%AE-Easy-Roll-Modular-Trauma-First-Aid-Station-with-BleedStop-Compact-200-Bleeding-Control-Kit-600x600.jpg' }}
                                                                            source={item && item.image && item.image.src ? { uri: item.image.src } : require('../assets/img/greyscale.jpg')}
                                                                        />
                                                                        :
                                                                        <View style={{ width: 48, height: 48 }} />
                                                                    }


                                                                </View>
                                                                <View style={{ flex: 0.2, }}>
                                                                    <Text style={[styles.productType, { paddingTop: 6, textAlign: 'center', fontSize: 10 }]} numberOfLines={2}>{item.name}</Text>

                                                                </View>
                                                            </View>

                                                        </TouchableOpacity>

                                                    )
                                                })
                                                :
                                                null
                                        }
                                    </View>

                                </ScrollView>
                            </View>

                        </View>


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
        userCommon: state.user,
        allCategoryItems: state.login.allCategoryItems,
        unReadMessage: state.login.unReadMessage,
    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(CategoriesScreen)

