import { WooCommerce, appUrl } from '../../utilities/config'

import {SAVE_ALL_COUPONS } from '../actionsType'

export const setAllCoupons = (payload) => {
    debugger
    return {
        type: SAVE_ALL_COUPONS,
        payload
    }
}
//export all coupons
export const getAllCoupons = () => {
    return (dispatch, getState) => {
        return WooCommerce.get(`coupons`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//create a Coupon
export const createCoupon = (data) => {
    return (dispatch, getState) => {
        return WooCommerce.post(`coupons`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//retreive a Coupon
export const retrieveCoupon = (coupon_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`coupons/${coupon_id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//update a Coupon
export const updateCoupon = (coupon_id, data) => {
    return (dispatch, getState) => {
        return WooCommerce.put(`coupons/${coupon_id}`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}



//delete an Coupon
export const deleteCoupon = (coupon_id, value) => {
    return (dispatch, getState) => {
        return WooCommerce.delete(`coupons/${coupon_id}`, { force: value }).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

