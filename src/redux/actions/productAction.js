import { WooCommerce, appUrl, recentlyPurchasedUrl, headerForWishlist } from '../../utilities/config'
import axios from 'axios'
import { SAVE_CATEGORY_DATA, SAVE__WALLET_AMONT_USER,SAVE_USAGE_WALLET_DATA, SAVE_RECENTLY_PURDATA, SAVE_WALLET_DATA } from '../actionsType'


/***************wishlist**********/

export const setAllCategory = (payload) => {
    debugger
    return {
        type: SAVE_CATEGORY_DATA,
        payload
    }
}

export const setWalletAmount = (payload) => {
    debugger
    return {
        type: SAVE_WALLET_DATA,
        payload
    }
}

export const saveWalletUsage = (payload) => {
    debugger
    return {
        type: SAVE_USAGE_WALLET_DATA,
        payload
    }
}

export const saveWalletAmountForUser = (payload) => {
    debugger
    return {
        type: SAVE__WALLET_AMONT_USER,
        payload
    }
}



export const saveRecentlyPurchasedItems = (payload) => {
    debugger
    return {
        type: SAVE_RECENTLY_PURDATA,
        payload
    }
}







/***************products**********/

//export all products
export const getAllProducts = (data) => {
    debugger
    return (dispatch, getState) => {
        return WooCommerce.get(`products`, data).then(res => {
            debugger
            console.log("All products", res.data)
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//create a product
export const createProduct = (data) => {
    return (dispatch, getState) => {
        return WooCommerce.post(`products`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//retreive a product
export const retrieveProduct = (product_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`products/${product_id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//update a product
export const updateProduct = (product_id, data) => {
    return (dispatch, getState) => {
        return WooCommerce.put(`products/${product_id}`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}



//delete an Product
export const deleteProduct = (product_id, value) => {
    return (dispatch, getState) => {
        return WooCommerce.delete(`products/${product_id}`, { force: value }).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

/***********Ends**********/



/*****************Product Category *****************/

//export all products category
export const getAllProductsCategory = (data) => {
    debugger
    return (dispatch, getState) => {
        return WooCommerce.get(`products/categories`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//create a product category
export const createProductCategory = (data) => {
    return (dispatch, getState) => {
        return WooCommerce.post(`products/categories`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//retreive a product category
export const retrieveProductCategory = (category_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`products/categories/${category_id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//update a product category
export const updateProductCategory = (category_id, data) => {
    return (dispatch, getState) => {
        return WooCommerce.put(`products/categories/${category_id}`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}



//delete an Product category
export const deleteProductCategory = (category_id, value) => {
    return (dispatch, getState) => {
        return WooCommerce.delete(`products/categories/${category_id}`, { force: value }).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}

/***********Ends********* */



/**************Product reviews*********** */

//export all products reviews
export const getAllProductsReview = () => {
    return (dispatch, getState) => {
        return WooCommerce.get(`products/reviews`, {
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


//create a product Review
export const createProductReview = (data) => {
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


//retreive a product Review
export const retrieveProductReview = (review_id) => {
    return (dispatch, getState) => {
        return WooCommerce.get(`products/reviews/${review_id}`, {}).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//update a product Review
export const updateProductReview = (review_id, data) => {
    return (dispatch, getState) => {
        return WooCommerce.put(`products/reviews/${review_id}`, data).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}



//delete an Product Review
export const deleteProductReview = (review_id, value) => {
    return (dispatch, getState) => {
        return WooCommerce.delete(`products/reviews/${review_id}`, { force: value }).then(res => {
            debugger
            return res
        }).catch((error) => {
            debugger
            return error
        })
    }
}


//get All recently purchases items

//get all wishlist items
export const getAllRecentlyPurchasedItems = (data, userId) => {
    return (dispatch, getState) => {
        return axios.get(`${recentlyPurchasedUrl}?id=${userId}`, {
            params: data
        }, headerForWishlist).then((res) => {
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