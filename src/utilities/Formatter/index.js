//use this as $("your value")
import Intl from 'intl'
import 'intl/locale-data/jsonp/en';
export const formatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    currency: 'AED',
    // maximumSignificantDigits:1
    
})