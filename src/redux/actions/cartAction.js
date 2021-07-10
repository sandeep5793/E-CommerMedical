import { LOGIN_ACTION_TYPES, CART_ITEMS,TOTAL_TAX_ITEMS,ALL_COUNTRIES, TOTAL_CART_ITEMS, TOTAL_CART_ITEMS_AMOUNT, SHOW_SLIDER, REMOVE_RELATED_SEARCH, DELETE_SHIPPING_AND_BILLING, SAVE_RELATED_SEARCH } from '../actionsType'
import axios from 'axios'
import { api, cocartUrl, WooCommerce, appUrl } from '../../utilities/config'

// axios.defaults.withCredentials = true
import {decode as atob, encode as btoa} from 'base-64'

export const setAllCartItems = (cartItems) => {
    debugger
    return {
        type: CART_ITEMS,
        cartItems
    }
}

// setAllTaxData
export const setAllTaxData = (allTaxData) => {
    debugger
    return {
        type: TOTAL_TAX_ITEMS,
        allTaxData
    }
}

//Set all countries

export const setAllCountries = (allCountriesData) => {
    debugger
    return {
        type: ALL_COUNTRIES,
        allCountriesData
    }
}

//set cartItems

export const setAllCartItemsData = (allCartItems) => {
    debugger
    return {
        type: TOTAL_CART_ITEMS,
        allCartItems
    }
}

//set cartTotal

export const setAllCartItemsTotalAmount = (allCartValues) => {
    debugger
    return {
        type: TOTAL_CART_ITEMS_AMOUNT,
        allCartValues
    }
}




//Add item to cart 
export const addItemtoCart = (data, user) => {
    
    return (dispatch, getState) => {

        let header = {
            headers: {
                "Authorization": `Bearer ${user.token}`

                // 'X-WP-Nonce':user.token
            }
        }


        //    header.headers['Authorization'] = `Bearer ${user.token}`

        // header.headers['X-WP-Nonce'] = user.id
        return axios.post(`${cocartUrl}add-item`, data, header).then((res) => {
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


//remove item from cart

export const removeItemFromCart = (data, user) => {
    return (dispatch, getState) => {
        let header = {
            headers: {
                "Authorization": `Bearer ${user.token}`

                // 'X-WP-Nonce':user.token
            }
        }

        // header.headers['X-WP-Nonce'] = user.id
        return axios.delete(`${cocartUrl}item`, { data: data }, header).then((res) => {
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

//get all cart

export const updateItemInCart = (data, user) => {
    return (dispatch, getState) => {
        let header = {
            headers: {
                "Authorization": `Bearer ${user.token}`

                // 'X-WP-Nonce':user.token
            }
        }

        // header.headers['X-WP-Nonce'] = user.id
        return axios.post(`${cocartUrl}item`, data, header).then((res) => {
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


//get all items in cart

export const getAllItemInCart = (user) => {
    debugger
    return (dispatch, getState) => {
        let header = {
            headers: {
                "Authorization": `Bearer ${user.token}`

            },
        }
        console.log("header", header)
        // header.headers['X-WP-Nonce'] = user.id
        return axios.get(`${cocartUrl}get-cart/${user.id}?thumb=true&refresh_totals=true&return_cart=true`, header).then((res) => {
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

//Count all items in cart

export const getCartCount = (user) => {
    return (dispatch, getState) => {
        let header = {
            headers: {
                "Authorization": `Bearer ${user.token}`

                // 'X-WP-Nonce':user.token
                // "Cookie": name = user.token,
            },

        }
        // header.headers['X-WP-Nonce'] = user.id
        return axios.get(`${cocartUrl}count-items`, header).then((res) => {
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

//calculate cart totals
export const calculateTotalCartValue = (data, user) => {
    return (dispatch, getState) => {
        let header = {
            headers: {
                "Authorization": `Bearer ${user.token}`

                // 'X-WP-Nonce':user.token
            }
        }
        // header.headers['X-WP-Nonce'] = user.id
        return axios.post(`${cocartUrl}calculate`, data, header).then((res) => {
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

//retrieve cart totals
export const getTotalCartValue = (user) => {
    return (dispatch, getState) => {
        let header = {
            headers: {
                "Authorization": `Bearer ${user.token}`

                // "Cookie": name = user.token,
                // 'X-WP-Nonce':user.token

            },
            // withCredentials: true
        }
        // header.headers['X-WP-Nonce'] = user.id
        return axios.get(`${cocartUrl}totals`, header).then((res) => {
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

//clear cart for user
export const clearCart = (user) => {
    return (dispatch, getState) => {
        let header = {
            headers: {
                "Authorization": `Bearer ${user.token}`

                // 'X-WP-Nonce':user.token
            }
        }
        let data = {
            "id": user.id
        }
        // header.headers['X-WP-Nonce'] = user.id
        return axios.post(`${cocartUrl}clear`, data, header).then((res) => {
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


//get All Taxes

export const getAllTaxes = () => {
    debugger
    return (dispatch, getState) => {

        return WooCommerce.get(`taxes`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })


    }
}








