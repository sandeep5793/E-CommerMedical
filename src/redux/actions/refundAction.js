import { WooCommerce, appUrl } from '../../utilities/config'



//export all Refund

export const getAllRefunds = (order_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`order/${order_id}/refunds`, {
            page: 2,
            per_page: 5
        }).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

//create a refund
export const createRefund = (order_id, data) => {
    return (dispatch, getState) => {
        return WooCommerce.post(`order/${order_id}/refunds`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

//retreive a Refund
export const retrieveRefund = (order_id, refund_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`order/${order_id}/refunds/${refund_id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

//delete an Refund
export const deleteRefund = (order_id, refund_id, value) => {
    return (dispatch, getState) => {
        return WooCommerce.delete(`order/${order_id}/refunds/${refund_id}`, { force: value }).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

