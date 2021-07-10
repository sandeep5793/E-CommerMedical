import React from 'react';
import {
    Platform,
    Image,
    Easing,
    Animated
} from 'react-native';

import {
    createAppContainer,
    createSwitchNavigator,
} from 'react-navigation';

import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';



process.env.REACT_NAV_LOGGING = true;
import styles from './styles';

//Import screens


//splash screen

import SplashScreen from './screens/SplashScreen'
//Slider screen

import StartSiderScreen from './screens/StartSliderScreen'

//Auth Screens
import LoginScreen from './screens/AuthScreens/LoginScreen'
import ForgotPasswordScreen from './screens/AuthScreens/ForgotPasswordScreen'
import SignupScreen from './screens/AuthScreens/SignupScreen'

//other Screens
import HomeScreen from './screens/HomeScreen'
import ProductDetailScreen from './screens/ProductDetail'
import OrderScreen from './screens/OrderScreen'
import ProfileScreen from './screens/ProfileScreen'
import WishlistScreen from './screens/WishlistScreen'
import NotificationSetting from './screens/NotificationSetting'
import CartScreen from './screens/CartScreen'
import CategoriesScreen from './screens/CategoriesScreen'
import ProductListingScreen from './screens/ProductListingScreen'
import ProfileSettingScreen from './screens/ProfileSetttingScreen'
import ShippingAndBilllingInfoScreen from './screens/ShippingAndBilllingInfoScreen';
import AddNewBillingAndShipping from './screens/AddNewBillingAndShipping'
import AddMoneyToWallet from './screens/AddMoneyToWallet'
import CheckOutScreen from "./screens/CheckOutScreen";
import YourOrders from "./screens/YourOrders"
import ReviewAndStarRating from "./screens/ReviewandStar"
import OrderDetailScreen from './screens/OrderDetailScreen'
import OrderDetailScreen2 from './screens/OrderDetailScreen2'

import Notification from './screens/NotificationScreen'
import TrackOrder from './screens/TrackOrder'
import RcentlyPurchased from './screens/RecentlyPurchasedItems'
import FreshChatScreen from './screens/FreshChatMessage'
import ViewUsageWalletScreen from './screens/ViewUsageWallet'
import NotificationDetail from './screens/NotificationScreenDetail'
import WebViewScreen from './screens/WebView'
import { fonts, fontWeights } from './utilities/constants';



// Tab Navigator
const TabNavigator = createBottomTabNavigator(
    {
        HomeScreen: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarLabel: "Home",
                tabBarIcon: ({ tintColor, focused }) => {
                    const image = focused
                        ? require('./assets/images/ic_home_green.png')
                        : require('./assets/images/ic_home_off.png')
                    return (
                        <Image
                            source={image}
                            style={styles.tabIcon}
                        />
                    )
                }
            }
        },
        CategoriesScreen: {
            screen: CategoriesScreen,
            navigationOptions: {
                tabBarLabel: "Categories",
                tabBarIcon: ({ tintColor, focused }) => {
                    const image = focused
                        ? require('./assets/images/ic_category_on.png')
                        : require('./assets/images/ic_category_off.png')
                    return (
                        <Image
                            source={image}
                            style={styles.tabIcon}
                        />
                    )
                }
            },

        },
        WishlistScreen: {
            screen: WishlistScreen,
            navigationOptions: {
                tabBarLabel: "Favourites",
                tabBarIcon: ({ tintColor, focused }) => {
                    const image = focused
                        ? require('./assets/images/ic_heart_on.png')
                        : require('./assets/images/ic_heart_off.png')
                    return (
                        <Image
                            source={image}
                            style={styles.tabIcon}
                        />
                    )
                }
            },
        },


        ProfileScreen: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarLabel: "My Account",
                tabBarIcon: ({ tintColor, focused }) => {
                    const image = focused
                        ?
                        require('./assets/images/ic_account_on.png')
                        :
                        require('./assets/images/ic_account_off.png')
                    return (
                        <Image
                            source={image}
                            style={styles.tabIcon}
                        />
                    )
                }
            },
            params: { isBusinessMan: true },

        },

        CartScreen: {
            screen: CartScreen,
            navigationOptions: {
                tabBarLabel: "Cart",
                tabBarIcon: ({ tintColor, focused }) => {
                    const image = focused
                        ?
                        require('./assets/images/ic_cart_on.png')
                        :
                        require('./assets/images/ic_cart_off.png')
                    return (
                        <Image
                            source={image}
                            style={styles.tabIcon}
                        />
                    )
                }
            },
            params: { isBusinessMan: true },

        },

    }, {
    tabBarOptions: {
        activeTintColor: '#01A651',
        inactiveTintColor: 'rgba(91,37,31,0.6)',
        style: {
            backgroundColor: 'white',
            padding: 8,
            height: 60

        },
        labelStyle: {
            fontWeight: fontWeights.third,
            fontSize: 12,
            fontFamily: fonts.circularStdBook,
            lineHeight: 16,
            textAlign: 'center'
            // color:'rgba(0,0,0,0.7)',
        },
        tabStyle: {
            width: 100,
        },

    }
}
);



const AuthStack = (isLanguage) => {
    return createStackNavigator({

        LoginScreen: LoginScreen,
        SignupScreen: SignupScreen,
        ForgotPasswordScreen: ForgotPasswordScreen,
    }, {
        headerMode: 'none',
        initialRouteName: 'LoginScreen',
        navigationOptions: {
            headerVisible: false,
        },
        defaultNavigationOptions: {
            gesturesEnabled: false,
        },
        transitionConfig: () => ({
            transitionSpec: {
                duration: 300,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
            },
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;
                const width = layout.initWidth;
                const translateX = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [width, 0, 0],
                });
                /*
                 const height = layout.initHeight;
                 const translateY = position.interpolate({
                 inputRange: [index - 1, index, index + 1],
                 outputRange: [height, 0, 0],
                 });
                 */

                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index],
                    outputRange: [0, 1, 1],
                });

                return { opacity, transform: [{ translateX: translateX }] };
            },
        })
    });

}


// Authorised App Stack
export const createAppStack = (isQuestion) => {
    return createStackNavigator({
        app: TabNavigator,
        WishlistScreen2: WishlistScreen,
        CartScreen2: CartScreen,
        ProductListingScreen: ProductListingScreen,
        ProductDetailScreen: ProductDetailScreen,
        ProfileSettingScreen: ProfileSettingScreen,
        ShippingAndBilllingInfoScreen: ShippingAndBilllingInfoScreen,
        AddNewBillingAndShipping: AddNewBillingAndShipping,
        AddMoneyToWallet: AddMoneyToWallet,
        NotificationSetting: NotificationSetting,
        CheckOutScreen: CheckOutScreen,
        YourOrders: YourOrders,
        OrderDetailScreen: OrderDetailScreen,
        OrderDetailScreen2: OrderDetailScreen2,
        ReviewAndStarRating: ReviewAndStarRating,
        Notification: Notification,
        TrackOrder: TrackOrder,
        RcentlyPurchased: RcentlyPurchased,
        FreshChatScreen: FreshChatScreen,
        ViewUsageWalletScreen: ViewUsageWalletScreen,
        NotificationDetail: NotificationDetail,
        WebViewScreen:WebViewScreen
        // NotificationSetting:NotificationSetting
        // HomeScreen: HomeScreen,
    },
        {
            // initialRouteName:'ViewUsageWalletScreen',
            headerMode: 'none',

            navigationOptions: {
                headerVisible: false,
            },
            defaultNavigationOptions: {
                gesturesEnabled: false,
            },
            transitionConfig: () => ({
                transitionSpec: {
                    duration: 300,
                    easing: Easing.out(Easing.poly(4)),
                    timing: Animated.timing,
                },
                screenInterpolator: sceneProps => {
                    const { layout, position, scene } = sceneProps;
                    const { index } = scene;
                    const width = layout.initWidth;
                    const translateX = position.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [width, 0, 0],
                    });
                    const opacity = position.interpolate({
                        inputRange: [index - 1, index - 0.99, index],
                        outputRange: [0, 1, 1],
                    });

                    return { opacity, transform: [{ translateX: translateX }] };
                },
            })
        }
    );
}


//StartSLider scrreen
export const createSplashStack = (isQuestion) => {
    return createStackNavigator({
        SplashScreen: SplashScreen,
    },
        {
            headerMode: 'none',

            navigationOptions: {
                headerVisible: false,
            },
            defaultNavigationOptions: {
                gesturesEnabled: false,
            },
            transitionConfig: () => ({
                transitionSpec: {
                    duration: 300,
                    easing: Easing.out(Easing.poly(4)),
                    timing: Animated.timing,
                },
                screenInterpolator: sceneProps => {
                    const { layout, position, scene } = sceneProps;
                    const { index } = scene;
                    const width = layout.initWidth;
                    const translateX = position.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [width, 0, 0],
                    });
                    const opacity = position.interpolate({
                        inputRange: [index - 1, index - 0.99, index],
                        outputRange: [0, 1, 1],
                    });

                    return { opacity, transform: [{ translateX: translateX }] };
                },
            })
        }
    );
}


//StartSLider scrreen
export const createSliderStack = (isQuestion) => {
    return createStackNavigator({
        StartSiderScreen: StartSiderScreen,
    },
        {
            headerMode: 'none',

            navigationOptions: {
                headerVisible: false,
            },
            defaultNavigationOptions: {
                gesturesEnabled: false,
            },
            transitionConfig: () => ({
                transitionSpec: {
                    duration: 300,
                    easing: Easing.out(Easing.poly(4)),
                    timing: Animated.timing,
                },
                screenInterpolator: sceneProps => {
                    const { layout, position, scene } = sceneProps;
                    const { index } = scene;
                    const width = layout.initWidth;
                    const translateX = position.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [width, 0, 0],
                    });
                    const opacity = position.interpolate({
                        inputRange: [index - 1, index - 0.99, index],
                        outputRange: [0, 1, 1],
                    });

                    return { opacity, transform: [{ translateX: translateX }] };
                },
            })
        }
    );
}

// App Navigator 
export const Layout = createAppContainer(createSwitchNavigator(
    {
        App: createAppStack(),
        Auth: AuthStack(),
        slider: createSliderStack(),
        splash: createSplashStack()
    },
    {
        initialRouteName: Platform.OS == 'android' ? 'splash' : 'slider',
        //  initialRouteName: 'slider',

        // initialRouteName: (user) ? isSaleMan ?  'SaleApp' : 'App' : 'Auth',
        headerMode: 'none',
        mode: Platform.OS === 'ios' ? 'modal' : 'card',

    }
));




