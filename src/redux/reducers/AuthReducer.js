import { SAVE_CATEGORY_DATA, SAVE_GUEST_ID,SAVE_ARASCA_EMAIL,SAVE_ARASCA_PHONE, TOTAL_TAX_ITEMS, SAVE__WALLET_AMONT_USER, SAVE_ALL_COUPONS, SET_USER_SHIPPING, SET_USER_BILLING, SAVE_RECENTLY_PURDATA, SAVE_ORDERS_DATA, SAVE_WALLET_DATA, SAVE_USAGE_WALLET_DATA, SIGNUP_ACTION_TYPES, TOTAL_CART_ITEMS, TOTAL_CART_ITEMS_AMOUNT, SET_USER_TOKEN, SET_USER_NOTIFICATION, LOGIN_ACTION_TYPES, CART_ITEMS, SHOW_SLIDER, SAVE_WISHLIST_DATA, SAVE_RELATED_SEARCH, REMOVE_RELATED_SEARCH, DELETE_SHIPPING_AND_BILLING, SET_USER_TOKEN_ADMIN, SET_USER_UNREAD_NOTIFICATION, ALL_COUNTRIES } from '../actionsType'
import { REHYDRATE } from 'redux-persist/lib/constants'
const INITIAL_STATE = {
    user: null,
    cartItems: 0,
    slider: true,
    guestID: null,
    saveRelated: [],
    wishlistData: [],
    allCategoryItems: [],
    totalWishListItem: 0,
    userToken: null,
    userTokenAdmin: null,
    userNotification: {},
    allCartItems: [],
    allTaxData: [],
    allwalletAmounts: [],
    allwalletUsage: [],
    allCartValues: {
        "totalAmount": 0,
        "totalVat": 0
    },
    usersOrders: {
        "pendingOrders": [],
        "completedOrders": []
    },
    arascaPhone:'',
    arascaEmail:'',
    recentlyPurchasedItems: [],
    userBilling: {
        billingaddress: []
    },

    userShipping: {
        shippingaddress: []
    },
    allCoupons: [],
    userWalletAmount: 0,
    unReadMessage: 0,
    allCountriesData: []
}

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case LOGIN_ACTION_TYPES.LOGIN_REQUEST:
            return { ...state, }
        case LOGIN_ACTION_TYPES.LOGIN_REQUEST_FAIL:
            return { ...state, user: null }
        case LOGIN_ACTION_TYPES.LOGIN_REQUEST_SUCCESS:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                user: action.payload
            }


        case SAVE_WISHLIST_DATA:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                wishlistData: action.payload.wishlistData,
                totalWishListItem: action.payload.totalWishlistItem
            }


        case SAVE_CATEGORY_DATA:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                allCategoryItems: action.payload.allCategoryItems,
            }



        case SAVE_WALLET_DATA:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                allwalletAmounts: action.payload.allwalletAmounts,
            }

        case SET_USER_UNREAD_NOTIFICATION:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                unReadMessage: action.payload,
            }



        case SAVE_USAGE_WALLET_DATA:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                allwalletUsage: action.payload.allwalletUsage,
            }


        case SAVE__WALLET_AMONT_USER:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                userWalletAmount: action.payload.userWalletAmount,
            }



        case SAVE_ARASCA_PHONE:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                arascaPhone: action.payload.arascaPhone,
            }


        case SAVE_ARASCA_EMAIL:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                arascaEmail: action.payload.arascaEmail,
            }


        case SAVE_ORDERS_DATA:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                usersOrders: action.payload.usersOrders,
            }


        case SAVE_RECENTLY_PURDATA:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                recentlyPurchasedItems: action.payload,
            }


        case SAVE_ALL_COUPONS:
            // let user = action.payload
            debugger
            return {
                ...state,
                // user: { ...state.user, ...action.payload }
                allCoupons: action.payload.allCoupons,
            }



        case DELETE_SHIPPING_AND_BILLING:
            debugger
            let newData = state.user

            // if (action.payload.type == 'shipping') {
            //     var dataAfterRemoveFromSippingAndBilling = newData.meta_data.filter(item => {
            //         if (item.key == "shipping") {
            //             item.value.filter((itm, inx) => {
            //                 if (itm.id != action.payload.id) {
            //                     return itm
            //                 }
            //             })
            //         }
            //         return item // return all the items not matching the action.id
            //     })
            // }
            // else {
            //     var dataAfterRemoveFromSippingAndBilling = newData.meta_data.filter(item => {
            //         if (item.key == "billing") {
            //             item.value.filter((itm, inx) => {
            //                 if (itm.id != action.payload.id) {
            //                     return itm
            //                 }
            //             })
            //         }
            //         return item // return all the items not matching the action.id
            //     })
            // }


            debugger
            return {
                ...state,
                //user: dataAfterRemoveFromSippingAndBilling

            }

        case SAVE_RELATED_SEARCH:

            return {
                ...state,
                saveRelated: [...state.saveRelated, action.payload]
                //saveRelated:[]
            }


        case REMOVE_RELATED_SEARCH:
            const dataAfterRemoveFromSearch = state.saveRelated.filter(item => {
                return item.id !== action.payload // return all the items not matching the action.id
            })
            return {
                ...state,
                saveRelated: dataAfterRemoveFromSearch
            }

        case CART_ITEMS:
            debugger
            return {
                ...state,
                cartItems: action.cartItems
            }

        case TOTAL_CART_ITEMS:
            debugger
            return {
                ...state,
                allCartItems: action.allCartItems
            }


        case TOTAL_CART_ITEMS_AMOUNT:
            debugger
            return {
                ...state,
                allCartValues: action.allCartValues
            }

        case TOTAL_TAX_ITEMS:
            debugger
            return {
                ...state,
                allTaxData: action.allTaxData
            }

        case ALL_COUNTRIES:
            debugger
            return {
                ...state,
                allCountriesData: action.allCountriesData
            }


        case SHOW_SLIDER:
            debugger
            return {
                ...state,
                slider: action.slider
            }


        case SAVE_GUEST_ID:
            debugger
            return {
                ...state,
                guestID: action.guestID
            }

        case SET_USER_TOKEN:
            debugger
            return {
                ...state,
                userToken: action.payload
            }

        case SET_USER_TOKEN_ADMIN:
            debugger
            return {
                ...state,
                userTokenAdmin: action.payload
            }


        case SET_USER_NOTIFICATION:
            debugger
            return {
                ...state,
                userNotification: action.payload
            }

        case SET_USER_SHIPPING:
            debugger
            return {
                ...state,
                userShipping: action.payload
            }

        case SET_USER_BILLING:
            debugger
            return {
                ...state,
                userBilling: action.payload
            }

        case LOGIN_ACTION_TYPES.LOGOUT_REQUEST_SUCCESS:
            debugger
            return {
                ...state,
                user: null,
                cartItems: 0,
                saveRelated: [],
                wishlistData: [],
                totalWishListItem: 0,
                userToken: null,
                userNotification: {},
                allCartItems: [],
                allCartValues: {
                    "totalAmount": 0,
                    "totalVat": 0
                },
                userTokenAdmin: null,
                allCategoryItems: [],
                allwalletUsage: [],
                usersOrders: {
                    "pendingOrders": [],
                    "completedOrders": []
                },
                userWalletAmount: 0,
                recentlyPurchasedItems: []
            }

        case SIGNUP_ACTION_TYPES.SIGNUP_REQUEST:
            return { ...state, }
        case SIGNUP_ACTION_TYPES.SIGNUP_REQUEST_FAIL:
            return { ...state, user: null }
        case SIGNUP_ACTION_TYPES.SIGNUP_REQUEST_SUCCESS:
            return { ...state, user: action.payload }
        case SIGNUP_ACTION_TYPES.LOGOUT_REQUEST_SUCCESS:
            return { ...state, user: null }

        case REHYDRATE: {
            //  console.log(action.payload ,"useruseruseruseruseruseruseruseruseruser")
            // return { ...state, ...action.payload.login }
        }
        default:
            return state;


    }

    return state;
}