import { WooCommerce, appUrl } from '../../utilities/config'
import { LOGIN_ACTION_TYPES,SAVE_GUEST_ID,SET_USER_SHIPPING,SET_USER_BILLING, SET_USER_TOKEN_ADMIN,SET_USER_NOTIFICATION,CART_ITEMS, SET_USER_TOKEN, SHOW_SLIDER, REMOVE_RELATED_SEARCH, DELETE_SHIPPING_AND_BILLING, SAVE_RELATED_SEARCH, SET_USER_UNREAD_NOTIFICATION } from '../actionsType'
import axios from 'axios'
import { api } from '../../utilities/config';

//Saving to store
export const logInUserActionype = (payload) => {
    debugger
    return {
        type: LOGIN_ACTION_TYPES.LOGIN_REQUEST_SUCCESS,
        payload
    }
}


export const deleteBillingAndShipping = (payload) => {
    debugger
    return {
        type: DELETE_SHIPPING_AND_BILLING,
        payload
    }
}


export const saveRelatedSearch = (payload) => {
    debugger
    return {
        type: SAVE_RELATED_SEARCH,
        payload
    }
}

export const deleteRelatedSearch = (payload) => {
    debugger
    return {
        type: REMOVE_RELATED_SEARCH,
        payload
    }
}


export const setUserToken = (payload) => {
    debugger
    return {
        type: SET_USER_TOKEN,
        payload
    }
}


export const setUserPassword = (payload) => {
    debugger
    return {
        type: SET_USER_PASS,
        payload
    }
}



export const setUserTokenFromAdmin = (payload) => {
    debugger
    return {
        type: SET_USER_TOKEN_ADMIN,
        payload
    }
}


export const setUserNotification = (payload) => {
    debugger
    return {
        type: SET_USER_NOTIFICATION,
        payload
    }
}


export const setUserUnreadNotification = (payload) => {
    debugger
    return {
        type: SET_USER_UNREAD_NOTIFICATION,
        payload
    }
}



//save users shipping address
export const setUserShipping= (payload) => {
    debugger
    return {
        type: SET_USER_SHIPPING,
        payload
    }
}

//save user billing address
export const setUserBilling = (payload) => {
    debugger
    return {
        type: SET_USER_BILLING,
        payload
    }
}






export const logOutUser = () => {
    debugger
    return {
        type: LOGIN_ACTION_TYPES.LOGOUT_REQUEST_SUCCESS,
    }
}


//total cart value
export const totatCartItem = (cartItems) => {
    debugger
    return {
        type: CART_ITEMS,
        cartItems
    }
}

//to show the slider value
export const toShowSliderOrNot = (slider) => {
    debugger
    return {
        type: SHOW_SLIDER,
        slider
    }
}

export const saveGuestUserToken = (guestID) => {
    debugger
    return {
        type: SAVE_GUEST_ID,
        guestID
    }
}



export const userInfo = (data) => {
    return (dispatch, getState) => {
        return axios.post(`https://test.arascamedical.com/wp-json/jwt-auth/v1/token`, payload, Appurl.headers).then((res) => {
            if (res && res.status == 200) {
                debugger
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })

    }
}

//export all customer

export const getAllCustomers = (data) => {
    return (dispatch, getState) => {

        // return api.get(`customers`).then((res) => {
        //     if (res ) {
        //         debugger
        //         return res
        //     }
        // }).catch((err) => {
        //     debugger
        //     return err
        // })
        return WooCommerce.get(`customers`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

//create a product
export const createCustomer = (data) => {
    return (dispatch, getState) => {
        return WooCommerce.post(`customers`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//retreive a Customer
export const retrieveCustomer = (customer_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`customers/${customer_id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//update a Customer
export const updateCustomer = (customer_id, data) => {
    debugger
    return (dispatch, getState) => {
        return WooCommerce.put(`customers/${customer_id}`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}



//delete an Customer
export const deleteCustomer = (customer_id, value) => {
    return (dispatch, getState) => {
        return WooCommerce.delete(`customers/${customer_id}`, { force: value }).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

