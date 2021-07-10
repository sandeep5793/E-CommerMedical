export const paymentOptions= [
    {
        "id": "abzer_networkonline",
        "title": "Debit/Credit Card",
        "description": "Pay via Debit or Credit card securely. we do not store your card information.",
        "order": 6,
        "enabled": false,
        "method_title": "Network Online Payment Gateway",
        "method_description": "<strong>Network Online Payment Gateway Plug-in for WooCommerce</strong>",
        "method_supports": [
            "products"
        ],
        "image": require('../../assets/images/cardPayment/ic_card.png'),
        "settings": {
            "title": {
                "id": "title",
                "label": "Title",
                "description": "This controls the title which the user see during checkout.",
                "type": "text",
                "value": "Debit/Credit Card",
                "default": "Networkonline",
                "tip": "This controls the title which the user see during checkout.",
                "placeholder": ""
            },
            "multicurrency": {
                "id": "multicurrency",
                "label": "Multi Currency",
                "description": "This controls the ability to add multiple MID & KEYS for different currencies",
                "type": "select",
                "value": "NO",
                "default": "NO",
                "tip": "This controls the ability to add multiple MID & KEYS for different currencies",
                "placeholder": "",
                "options": {
                    "NO": "NO",
                    "YES": "YES"
                }
            },
            "merchantid": {
                "id": "merchantid",
                "label": "Merchant ID",
                "description": "Please enter your Merchant ID",
                "type": "text",
                "value": "",
                "default": "",
                "tip": "Please enter your Merchant ID",
                "placeholder": ""
            },
            "merchantkey": {
                "id": "merchantkey",
                "label": "Merchant KEY",
                "description": "Please enter your Merchant KEY",
                "type": "text",
                "value": "",
                "default": "",
                "tip": "Please enter your Merchant KEY",
                "placeholder": ""
            },
            "transactionmode": {
                "id": "transactionmode",
                "label": "Transaction Mode",
                "description": "Please select Transaction Mode : TEST/LIVE",
                "type": "select",
                "value": "LIVE",
                "default": "TEST",
                "tip": "Please select Transaction Mode : TEST/LIVE",
                "placeholder": "",
                "options": {
                    "TEST": "TEST",
                    "LIVE": "LIVE"
                }
            },
            "transactiontype": {
                "id": "transactiontype",
                "label": "Transaction Type",
                "description": "Please select Transaction Type : SALES/AUTHROIZATION",
                "type": "select",
                "value": "01",
                "default": "01",
                "tip": "Please select Transaction Type : SALES/AUTHROIZATION",
                "placeholder": "",
                "options": {
                    "01": "SALES",
                    "02": "AUTHROIZATION"
                }
            },
            "bitmapsetting": {
                "id": "bitmapsetting",
                "label": "Network Online Bit Map Settings Options",
                "description": "",
                "type": "title",
                "value": "",
                "default": "",
                "tip": "",
                "placeholder": ""
            },
            "billingdatablock": {
                "id": "billingdatablock",
                "label": "Billing Data Block",
                "description": "If you enable Billing Data Block, it will pass the billing information data to Network Online.",
                "type": "select",
                "value": "1",
                "default": "1",
                "tip": "If you enable Billing Data Block, it will pass the billing information data to Network Online.",
                "placeholder": "",
                "options": {
                    "0": "NO",
                    "1": "YES"
                }
            },
            "shippingdatablock": {
                "id": "shippingdatablock",
                "label": "Shipping Data Block",
                "description": "If you enable Shipping Data Block it will pass the shipping information data to Network Online.",
                "type": "select",
                "value": "1",
                "default": "1",
                "tip": "If you enable Shipping Data Block it will pass the shipping information data to Network Online.",
                "placeholder": "",
                "options": {
                    "0": "NO",
                    "1": "YES"
                }
            },
            "merchantdatablock": {
                "id": "merchantdatablock",
                "label": "Merchant Data Block",
                "description": "If you enable Merchant Data Block it will pass the merchant information data to Network Online eg: Client IP Address , as of now we are only passing IP address.",
                "type": "select",
                "value": "1",
                "default": "1",
                "tip": "If you enable Merchant Data Block it will pass the merchant information data to Network Online eg: Client IP Address , as of now we are only passing IP address.",
                "placeholder": "",
                "options": {
                    "0": "NO",
                    "1": "YES"
                }
            },
            "otherdatablock": {
                "id": "otherdatablock",
                "label": "Other Data Block",
                "description": "If you enable Other Data Block it will pass the other information data to Network Online eg : ProductInfo , Category , ItemTotal.",
                "type": "select",
                "value": "1",
                "default": "1",
                "tip": "If you enable Other Data Block it will pass the other information data to Network Online eg : ProductInfo , Category , ItemTotal.",
                "placeholder": "",
                "options": {
                    "0": "NO",
                    "1": "YES"
                }
            }
        },
        "_links": {
            "self": [
                {
                    "href": "https://test.arascamedical.com/wp-json/wc/v3/payment_gateways/abzer_networkonline"
                }
            ],
            "collection": [
                {
                    "href": "https://test.arascamedical.com/wp-json/wc/v3/payment_gateways"
                }
            ]
        }
    },

    {
        "id": "cod",
        "title": "Cash on delivery",
        "description": "Pay with cash upon delivery.",
        "order": 2,
        "enabled": true,
        "method_title": "Cash on delivery",
        "method_description": "Have your customers pay with cash (or by other means) upon delivery.",
        "method_supports": [
            "products"
        ],
        "image": require('../../assets/images/cashOnDelivery/ic_currency.png'),
        "settings": {
            "title": {
                "id": "title",
                "label": "Title",
                "description": "Payment method description that the customer will see on your checkout.",
                "type": "text",
                "value": "Cash on delivery",
                "default": "Cash on delivery",
                "tip": "Payment method description that the customer will see on your checkout.",
                "placeholder": ""
            },
            "instructions": {
                "id": "instructions",
                "label": "Instructions",
                "description": "Instructions that will be added to the thank you page.",
                "type": "textarea",
                "value": "Pay with cash upon delivery.",
                "default": "Pay with cash upon delivery.",
                "tip": "Instructions that will be added to the thank you page.",
                "placeholder": ""
            },
            "enable_for_methods": {
                "id": "enable_for_methods",
                "label": "Enable for shipping methods",
                "description": "If COD is only available for certain methods, set it up here. Leave blank to enable for all methods.",
                "type": "multiselect",
                "value": "",
                "default": "",
                "tip": "If COD is only available for certain methods, set it up here. Leave blank to enable for all methods.",
                "placeholder": "",
                "options": {
                    "Flat rate": {
                        "flat_rate": "Any &quot;Flat rate&quot; method",
                        "flat_rate:6": "United Arab Emirates &ndash; Delivery Charges(UAE) (#6)",
                        "flat_rate:2": "Other locations &ndash; Flat rate (#2)"
                    },
                    "Free shipping": {
                        "free_shipping": "Any &quot;Free shipping&quot; method",
                        "free_shipping:1": "United Arab Emirates &ndash; Free Shipping within UAE (#1)"
                    },
                    "Local pickup": {
                        "local_pickup": "Any &quot;Local pickup&quot; method",
                        "local_pickup:3": "United Arab Emirates &ndash; Pickup from our DIP warehouse(Dubai) (#3)"
                    }
                }
            },
            "enable_for_virtual": {
                "id": "enable_for_virtual",
                "label": "Accept COD if the order is virtual",
                "description": "",
                "type": "checkbox",
                "value": "yes",
                "default": "yes",
                "tip": "",
                "placeholder": ""
            }
        },
        "_links": {
            "self": [
                {
                    "href": "https://test.arascamedical.com/wp-json/wc/v3/payment_gateways/cod"
                }
            ],
            "collection": [
                {
                    "href": "https://test.arascamedical.com/wp-json/wc/v3/payment_gateways"
                }
            ]
        }
    },
    {
        "id": "wallet_gateway",
        "title": "Wallet Payment",
        "description": "Please remit payment to Store Name upon pickup or delivery.",
        "order": 5,
        "enabled": true,
        "method_title": "wallet",
        "method_description": "Allows wallet payments. Very handy if you use your cheque gateway for another payment method, and can help with testing. Orders are marked as \"on-hold\" when received.",
        "method_supports": [
            "products"
        ],
        "image": require('../../assets/images/wallet/ic_wallet.png'),
        "settings": {
            "title": {
                "id": "title",
                "label": "Title",
                "description": "This controls the title for the payment method the customer sees during checkout.",
                "type": "text",
                "value": "Wallet Payment",
                "default": "wallet Payment",
                "tip": "This controls the title for the payment method the customer sees during checkout.",
                "placeholder": ""
            },
            "instructions": {
                "id": "instructions",
                "label": "Instructions",
                "description": "Instructions that will be added to the thank you page and emails.",
                "type": "textarea",
                "value": "Please remit payment to Store Name upon pickup or delivery.",
                "default": "",
                "tip": "Instructions that will be added to the thank you page and emails.",
                "placeholder": ""
            }
        },
        "_links": {
            "self": [
                {
                    "href": "https://test.arascamedical.com/wp-json/wc/v3/payment_gateways/wallet_gateway"
                }
            ],
            "collection": [
                {
                    "href": "https://test.arascamedical.com/wp-json/wc/v3/payment_gateways"
                }
            ]
        }
    },

]

