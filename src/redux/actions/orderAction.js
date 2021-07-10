import { WooCommerce, appUrl, getNotifications } from '../../utilities/config'
import axios from 'axios'

import { SAVE_ORDERS_DATA } from '../actionsType'

export const saveUsersOrders = (payload) => {
    debugger
    return {
        type: SAVE_ORDERS_DATA,
        payload
    }
}

//crete notes in order
export const updateNotes = (order_id, data) => {
    return (dispatch, getState) => {
        return WooCommerce.post(`orders/${order_id}/notes`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

//export all orders
export const getAllOrders = (user) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`orders?customer=${user.id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

//create an order

export const createOrder = (data) => {
    return (dispatch, getState) => {
        return WooCommerce.post(`orders`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            console.log("error order place json", JSON.stringify(error))
            console.log("error order place", JSON.stringify(error.response))
            return error.response
        })
    }
}

//retreive an order


export const retrieveOrder = (order_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`orders/${order_id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

//update an order


export const updateOrder = (order_id, data) => {
    return (dispatch, getState) => {
        return WooCommerce.put(`orders/${order_id}`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

//delete an order

export const deleteOrder = (order_id, value) => {
    return (dispatch, getState) => {
        return WooCommerce.delete(`orders/${order_id}`, { force: value }).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}



//All order note related apis


//export all order notes

export const getAllOrderNotes = () => {
    return (dispatch, getState) => {
        return WooCommerce.get(`orders/${order_id}/notes`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//create an order note

export const createOrderNote = (data) => {
    return (dispatch, getState) => {
        return WooCommerce.post(`orders/${order_id}/notes`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

//retreive an order note


export const retrieveOrderNote = (order_id, note_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`orders/${order_id}/notes/${note_id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//delete an order note

export const deleteOrderNote = (order_id, note_id, value) => {
    return (dispatch, getState) => {
        return WooCommerce.delete(`orders/${order_id}/notes/${note_id}`, { force: value }).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

// getAllNotifications

export const getAllNotifications = (user) => {
    return (dispatch, getState) => {


    }
}


// getAllNotifications

export const trackOrder = (user, data) => {

    return (dispatch, getState) => {
        return WooCommerce.get(`orders/${data.id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })

    }
}



