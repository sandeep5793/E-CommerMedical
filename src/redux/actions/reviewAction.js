import { LOGIN_ACTION_TYPES, CART_ITEMS, SHOW_SLIDER, REMOVE_RELATED_SEARCH, DELETE_SHIPPING_AND_BILLING, SAVE_RELATED_SEARCH } from '../actionsType'
import axios from 'axios'
import { api, cocartUrl, WooCommerce, appUrl } from '../../utilities/config'


/***************products**********/

//export all reviews
export const getAllReviews = () => {
    debugger
    return (dispatch, getState) => {
        return WooCommerce.get(`products/reviews`, {}).then(res => {
            debugger
            console.log("All products", res.data)
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//create a review
export const createAReview = (data) => {
    return (dispatch, getState) => {
        return WooCommerce.post(`products/reviews`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//retreive a review
export const retrieveAReview = (product_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`products/reviews/${product_id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}
