import { WooCommerce, wishlistUrl, headerForWishlist, appUrl, header } from '../../utilities/config'
import axios from 'axios'
import { SAVE_WISHLIST_DATA, } from '../actionsType'

/***************wishlist**********/

export const setWishlistItem = (payload) => {
    debugger
    return {
        type: SAVE_WISHLIST_DATA,
        payload
    }
}

//Add item to wishlist 
export const addItemToWishlist = (data) => {
    debugger
    return (dispatch, getState) => {
        return axios.post(`${wishlistUrl}update`, data, headerForWishlist).then((res) => {
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

//get all wishlist items
export const getItemsWishlist = (data, userId) => {
    return (dispatch, getState) => {
        return axios.post(`${wishlistUrl}user`, data, headerForWishlist).then((res) => {
            if (res && res.status == 200) {
                // debugger
                debugger
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })

    }
}


//delete  wishlist items
export const deleteItemFromwishlist = (data, userId) => {
    return (dispatch, getState) => {
        return axios.delete(`${wishlistUrl}delete`, { data: data }, headerForWishlist).then((res) => {
            if (res && res.status == 200) {
                // debugger
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })

    }
}

//delete  wishlist items of guest
export const deleteItemFromwishlistExistForGuest = (data, id) => {
    return (dispatch, getState) => {
        return axios.delete(`${wishlistUrl}delete_wishlist_guest`, { data: data }, headerForWishlist).then((res) => {
            if (res && res.status == 200) {
                // debugger
                return res
            }
        }).catch((err) => {
            debugger
            return err
        })

    }
}
