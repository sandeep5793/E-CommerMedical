
import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
const { width, height } = Dimensions.get('window')
import { fonts, colors, lineHeight, fontSizes, fontWeights, screenDimensions } from '../utilities/constants'
export default container = StyleSheet.create({
    AndroidSafeArea: {

        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1,
    },
    //login
    tabIcon: {
        // height: 20,
        // width: 20,
        // color: ''
    },
    container2: { padding: 5, paddingTop: 30, },
    head: { height: 40, backgroundColor: colors.appColor },
    text: { margin: 2,color:'white',textAlign:'center' },
    text2: { margin: 4,color:colors.lightfontColor,fontSize:12,textAlign:'center' },
    emptyData: {
        color: colors.appColor,
        fontSize: 20,
        fontWeight: 'bold',
        // lineHeight:20,
        textAlign: 'center'
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: colors.appColor,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
      },
    emptyDataSubLabel: {
        color: colors.lightfontColor,
        fontSize: 14,
        fontWeight: '600',
        // lineHeight:20,
        textAlign: 'center'
    },
    labelText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold'

    },
    profileItemText: {
        color: '#575859',
        fontSize: 14
    },

    aedPrice: {
        fontFamily: fonts.circularStdBold,
        color: colors.titleColor,
        fontSize: fontSizes.extraSmall,
        lineHeight: lineHeight.extraLarge
    },
    excVat: {
        fontFamily: fonts.circularStdBold,
        color: colors.lightBlack,
        fontSize: fontSizes.extraSmall,
        lineHeight: lineHeight.extraLarge
    },
    sliderOne: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    titleSlider: {
        color: 'white',
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center'

    },
    textSlider: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    forgotPass: {
        color: '#717171',
        fontSize: fontSizes.small,
        fontWeight: fontWeights.fifth,
        fontFamily: fonts.helveticaNeue
    },

    newArascaAndSignupText: {
        color: colors.appColor,
        fontSize: fontSizes.small
    },

    individualAndBusiness: {
        fontFamily: fonts.helveticaNeue,
        fontWeight: 'bold',
        fontSize: 14
    },






    homeLogo: { alignItems: 'center', marginTop: screenDimensions.height / 4 },
    homelogo2: { alignItems: 'center', marginTop: screenDimensions.height / 10, },
    homelogo3: { alignItems: 'center', marginTop: screenDimensions.height / 18, },
    hoemBottomView: { marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' },
    bottomStyle: { justifyContent: 'flex-end', marginBottom: 20, marginTop: 20 },
    backButtonImage: {
        marginHorizontal: 20,
        paddingTop: 40
    },
    activityLevel: {
        color: 'white',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        fontWeight: 'bold',
        lineHeight: lineHeight.normal,
    },
    whyorderCancel: {
        color: '#77797A',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        // fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    modalTextStyle: {
        color: 'black',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        fontWeight: 'bold',
        lineHeight: lineHeight.normal,
    },
    orderNumberStyle: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
        // textAlign: 'center'
    },
    searchContainer: {
        backgroundColor: 'white',
        borderRadius: 3,
        height: 40,
        justifyContent: 'center',

    },
    whatareyoulooking: {

        color: 'rgba(28,28,28,0.44)',
        fontSize: 13,
        fontFamily: fonts.circularStdBook,
        // lineHeight: lineHeight.extraLarge,
        fontWeight: '300'
    },
    orderNumberStyle2: {
        color: '#A7A9AC',
        fontFamily: fonts.circularStdBook,
        fontSize: 14,
        // fontWeight:'bold',
        lineHeight: lineHeight.medium,
        // textAlign: 'center'
    },
    // forgotPassView: {
    //     justifyContent: 'flex-end',
    //     alignItems: 'flex-end'
    // },
    // forgotPassView2: {
    //     justifyContent: 'flex-start',
    //     alignItems: 'flex-start'
    // },
    orView: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dontHaveAnAccountView: {
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    continueButton: {
        justifyContent: 'flex-end',
        marginBottom: 20,
        marginTop: 30
    },
    signInAgreeView: {
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    unlock: {
        color: 'black',
        fontSize: 18,
        lineHeight: 24,
        fontFamily: fonts.circularStdBook,
        fontWeight: 'bold'
    },
    unlock2: {
        color: 'black',
        fontSize: 12,
        lineHeight: 20,
        textAlign: 'center',
        fontFamily: fonts.circularStd
    },
    firstNameLastNameView: { flexDirection: 'row', justifyContent: 'space-between' },
    mainModalView: {
        flex: 1,
        backgroundColor: 'white'
    },
    buttonStyle: {
        marginHorizontal: 35,

        // borderColor: '#F6871C',
        borderWidth: 1,
        borderRadius: 15,
        // justifyContent: 'center',
        //  alignItems: 'center',
        flexDirection: 'row',

    },
    buttonStyleAddAndProceed: {
        marginHorizontal: 10,

        // borderColor: '#F6871C',
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'space-between',
        // alignItems: 'center',
        flexDirection: 'row',

    },

    buttonStyleCheckOut: {
        marginHorizontal: 35,

        // borderColor: '#F6871C',
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'row',

    },

    buttonStylePet: {
        marginHorizontal: 20,

        // borderColor: '#F6871C',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'row',

    },

    buttonStyle4: {
        // marginHorizontal: 10,

        // borderColor: '#F6871C',
        borderWidth: 1,
        borderRadius: 30,
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'row',

    },

    buttonStylefacebok: {
        marginHorizontal: 20,
        // borderColor: '#F6871C',
        borderWidth: 1,
        borderRadius: 5,
        // justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'row',
    },
    modalCloseView: {
        marginHorizontal: 20,
        marginTop: 30,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    modalIllustrationView: { paddingTop: 50, justifyContent: 'center', alignItems: 'center' },
    requestSubmittedView: {
        marginHorizontal: 20,
        paddingTop: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    requestSubmittedViewMessage: { marginHorizontal: 40, paddingTop: 30, justifyContent: 'center', alignItems: 'center' },
    buttonStyle3: {
        marginHorizontal: 2,
        width: screenDimensions.width / 4 + 10,
        // borderColor: '#F6871C',
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',

    },
    buttonStyle2: {
        marginHorizontal: 20,
        // borderColor: '#F6871C',
        borderWidth: 1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    buttonStyleNew: {
        marginHorizontal: 20,
        // borderColor: '#F6871C',
        borderWidth: 1,
        borderRadius: 30,
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'row',
    },
    becomePartner: {
        color: colors.appColor,
        fontFamily: fonts.circularStdBook,
        lineHeight: lineHeight.large,
        fontSize: fontSizes.normal
    },
    whatisPetPartner: {
        color: colors.lightfontColor,
        fontFamily: fonts.circularStdBook,
        lineHeight: lineHeight.large,
        fontSize: fontSizes.small
    },
    loginText: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        lineHeight: lineHeight.extraLarge,
        fontSize: fontSizes.title
    },
    viewTextStyle: {
        backgroundColor: 'white',

        // height:40,
        borderWidth: 1,
        borderRadius: 5

    },
    cardViewDropDownWallet:{
        marginTop: 1,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
        height: 120,
        width: screenDimensions.width / 2 - 50,
    },
    cardViewDropDownWallet2 :{
        width: screenDimensions.width / 2 - 20,
        height: 35,
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 22,
        justifyContent: 'center',
        paddingLeft: 10
    },
    addBalance:{ color: colors.appColor, fontWeight: 'bold', fontSize: 18, marginVertical: 12 },
    iconBadgeStyle:{
        position: 'absolute',
        top: -8,
        left: 8,
        width: 22,
        height: 22,
        borderRadius: 22 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'red'
    },
    requestSubmited: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        lineHeight: lineHeight.extraLarge,
        fontWeight: fontWeights.bold
    },
    requestScreenMessage: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.large,
        textAlign: 'center'
        // fontWeight:fontWeights.bold
    },
    aboutustext: {
        color: colors.titleColor,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'justify'

    },
    cartNumberStyle: {
        zIndex: 1000,
        position: 'absolute',
        backgroundColor: '#E36732',
        borderRadius: 20 / 2,
        width: 20,
        height: 20,
        bottom: 25,
        right: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartStyle: {
        zIndex: -1000,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 8,
    },
    locationColor: {
        color: colors.white,
        fontFamily: fonts.circularStdBook,
        fontSize: 13,
        fontWeight: '300',
        lineHeight: lineHeight.extraLarge
    },
    location: {
        color: colors.lightColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.extraSmall,
        lineHeight: lineHeight.extraLarge,
        textAlign: 'center'
    },
    petDemand: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.extraLarge,
        // textAlign: 'center'
    },
    itemName: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.normal,
    },
    trending: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBold,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.extraLarge,
    },

    notificationTitle: {
        color: colors.black,
        fontFamily: fonts.circularStdBold,
        fontSize: fontSizes.large,
        lineHeight: lineHeight.extraLarge,
    },


    viewAll: {
        color: colors.appColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 12,
        lineHeight: lineHeight.extraLarge,
        fontWeight: fontWeights.bold
    },
    clearAll: {
        color: colors.appColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.extraLarge,
        fontWeight: fontWeights.bold
    },
    productType: {
        color: colors.titleColor,
        fontFamily: fonts.myriadProRegular,
        fontSize: 12,
        lineHeight: lineHeight.normal,
        fontWeight: fontWeights.bold
    },
    briefInfo: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.extraLarge,
        // fontWeight:fontWeights.bold
    },
    title: {
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.extraLarge,
        textAlign: 'justify',
        fontWeight: fontWeights.bold
    },
    notificationMessage: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 15,
        lineHeight: lineHeight.medium,
        textAlign: 'justify',

    },
    time: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: 13,
        lineHeight: lineHeight.normal,
        textAlign: 'right'
    },
    mobileNumberText: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.normal,

    },
    accountSetting: {
        color: colors.black,
        fontFamily: fonts.circularStdBold,
        fontSize: fontSizes.medium,
        lineHeight: lineHeight.extraLarge,
        // fontWeight: fontWeights.bold
    },
    titleOneText: {
        color: 'rgba(0,0,0,0.56)',
        fontFamily: fonts.circularStdBold,
        fontSize: 15,
        lineHeight: lineHeight.extraLarge,
        // fontWeight: fontWeights.bold
    },


    titleTwoText: {
        color: colors.black,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.large,
        fontWeight: fontWeights.third
    },
    productTitle: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        lineHeight: lineHeight.extraLarge,
    },
    productTitle2: {
        color: colors.lightfontColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.large,
    },
    resetTitle: {
        color: colors.appColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.extraLarge,
        fontWeight: fontWeights.bold
    },
    labelTextStyle: {
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.extraLarge,
    },
    productPrice: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeight.extraLarge,
    },

    quantity: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        // fontWeight: fontWeights.bold,
        lineHeight: lineHeight.extraLarge,
    },

    filterButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: screenDimensions.height - 100,
        bottom: 0
    },
    filterButton2: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: screenDimensions.height - 120,
        bottom: 0
    },
    filterText: {
        color: '#455F6C',
        fontFamily: fonts.circularStdBook,
        fontSize: 16,
        // fontWeight: fontWeights.bold,
        lineHeight: lineHeight.normal,
    },
    shortByPrice: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeight.large,
    },
    range: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 16,
        // lineHeight: 20,
    },
    quantityText: {
        color: '#4A4A4A',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.normal,
        fontWeight: fontWeights.bold,
    },
    previousText: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: 15,
        lineHeight: lineHeight.extraLarge,
        fontWeight: fontWeights.bold,
    },
    plusMinus: { paddingHorizontal: 5, paddingVertical: 5, backgroundColor: colors.appColor, alignItems: 'center', justifyContent: 'center' },
    searchText: {
        color: '#5B251F',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        lineHeight: lineHeight.extraLarge,
    },

    proceedTocheckOut: {
        color: '#FFFFFF',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.large,
        fontWeight: fontWeights.bold
    },
    placeOrder: {
        color: '#FFFFFF',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: 32,
        fontWeight: fontWeights.bold
    },
    change: {
        color: '#F6871C',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: 24,
        fontWeight: 'bold'
    },
    profileLabel: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: 15,
        lineHeight: lineHeight.extraLarge,
        fontWeight: 'bold'
    },
    profileInfo: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.large,
        // fontWeight: 'bold'
    },
    notes: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.extraLarge,
    },
    amountMoney: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.large,
    },
    address: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.large,
    },
    inputField: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.extraLarge,
    },
    foodType: {
        color: colors.appColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.normal,
        fontWeight: fontWeights.bold
    },
    productDescription: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.large,
        lineHeight: lineHeight.extraLarge,

    },
    productCost: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.title,
        lineHeight: lineHeight.extraLarge,
        fontWeight: fontWeights.bold
    },
    freeDelivery: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.extraLarge,
        // fontWeight:fontWeights.bold 
    },
    description: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: 15,
        lineHeight: lineHeight.extraLarge,
        fontWeight: fontWeights.bold
    },
    detailproductDescription: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.large,
        // fontWeight:fontWeights.bold 
    },
    similarProductTextTitle: {
        color: colors.appColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 12,
        lineHeight: lineHeight.normal,
        fontWeight: fontWeights.bold
    },
    leaveMessage: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.normal,
        textAlign: 'center'
    },
    contactText: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        lineHeight: lineHeight.extraLarge,
        textAlign: 'left'
    },
    petImageView: {
        height: 112,
        width: 112,
        borderWidth: 1,
        borderColor: colors.appColor,
        borderRadius: 8,
        backgroundColor: 'transparent'
    },
    addImage: {
        color: colors.appColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 13,
        lineHeight: 17,
        textAlign: 'center'
    },
    petName: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        lineHeight: lineHeight.extraLarge,
        fontWeight: 'bold'

    },
    petAge: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        lineHeight: lineHeight.extraLarge,

    },
    petTypeBreed: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.extraLarge,
    },
    cardNumber: {
        color: '#212121',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.normal,
    },
    cardBank: {
        color: '#212121',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.large,
        lineHeight: 32,
    },
    cardHolderName: {
        color: '#212121',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.extraLarge,
    },
    cardHolderNameLabel: {
        color: 'rgba(33,33,33,0.25)',
        fontFamily: fonts.circularStdBook,
        fontSize: 10,
        lineHeight: lineHeight.normal,
    },
    enterCVV: {
        color: '#9E9E9E',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.extraLarge,
        textAlign: 'center'
    },
    topTextAddNewCard: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.large,

    },
    blog_title: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 24,
        lineHeight: 28,
        fontWeight: 'bold'
    },
    blog_date: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.extraLarge,
    },
    blog_desc: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 15,
        lineHeight: lineHeight.large,
    },
    listView: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1
    },
    productStatus: {
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    customerInfo: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: 15,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    profileName: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    transist: {
        color: colors.appColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    expectedTobeDelieved: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        // fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    statusCreatedDate: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    statusCreatedTime: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        // fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    deliveryStatusLocation: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: 12,
        // fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    searchField: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        // fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    customerName: {
        color: '#5B251F',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    customerContact: {
        color: '#5B251F',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        // fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    customerAddress: {
        color: '#5B251F',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        // fontWeight: 'bold',
        lineHeight: lineHeight.large,
    },
    notesForCustomer: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        // fontWeight: 'bold',
        textAlign: 'justify',
        lineHeight: lineHeight.medium,
    },
    refer: {
        color: '#5B251F',
        fontFamily: fonts.circularStdBook,
        fontSize: 15,
        lineHeight: lineHeight.normal,
    },
    forWhom: {
        color: '#353E40',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.extraLarge,
    },
    customerOrslef: {
        color: '#353E40',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        // lineHeight: 56,
        textAlign: 'center'
    },
    editdeletpet: {
        color: '#353E40',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.large,
        lineHeight: 56,
        // fontWeight:'bold',
        textAlign: 'center'
    },
    orderAsService: {
        color: '#5B251F',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    customerName: {
        color: '#5B251F',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    totalProfitOverSale: {
        color: '#5B251F',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.normal,
    },
    profitAndSale: {
        color: '#455F6C',
        fontFamily: fonts.circularStdBook,
        fontSize: 32,
        lineHeight: 32,
    },
    saleandprofittext: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: 14,
        lineHeight: lineHeight.extraLarge,
    },
    productSoldOn: {
        color: 'rgba(91,37,31,0.56)',
        fontFamily: fonts.circularStdBook,
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: lineHeight.extraLarge,
    },
    headingPrice: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 13,
        lineHeight: lineHeight.normal,
    },
    headingPriceValue: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 16,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeight.extraLarge,
    },
    forgetPassMessage: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 16,
        // fontWeight: fontWeights.bold,
        lineHeight: lineHeight.extraLarge,
    },
    requetSubmitted: {
        marginTop: 10,
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeight.extraLarge,
        textAlign: 'center'
    },
    requestSubmitedMessage: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.large,
        textAlign: 'center'
    },
    moreDetail: {
        color: '#455F6C',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.extraLarge,
        textAlign: 'center'
    },
    whentogetrefund: {
        color: colors.appColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.medium,
    },
    refundMessage: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.small,
        lineHeight: lineHeight.medium,
        // textAlign: 'center'
    },
    refundMessage2: {
        color: '#56840D',
        fontFamily: fonts.circularStdBook,
        fontSize: fontSizes.normal,
        lineHeight: lineHeight.medium,
    },
    returnrecieved: {
        color: colors.titleColor,
        fontFamily: fonts.circularStdBook,
        fontSize: 12,
        lineHeight: lineHeight.extraLarge,
    },
    modalView2: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 20 : 10,
    },
    modalViewInside: {
        marginTop: Platform.OS == 'ios' ? 20 : 10,
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    resetView: { alignItems: 'center', justifyContent: 'center', },
    trendingProductsView: {
        paddingHorizontal: 20,
        marginTop: 60,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cardViewStyle: {
        alignItems: 'center',
        height: 180,
        width: screenDimensions.width - 20,
        // marginRight: 20
    },
    cardViewStyle3: {
        alignItems: 'center',
        justifyContent: 'center',
        // height: 175,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        // width: screenDimensions.width/3,
        height: screenDimensions.width / 2 + 20,
        width: screenDimensions.width / 2 - 50,
        // marginRight: 20,
        backgroundColor: 'white'
    },
    cardViewStyle2: {
        alignItems: 'center',
        height: screenDimensions.height / 4,
        width: screenDimensions.width - 20
    },
    cardMainView: {
        alignItems: 'center',
        // paddingTop: 10,
        height: 200,
        paddingBottom: 5,
        // borderRadius: 10,
        backgroundColor: 'white'
    },
    cardMainViewOffers: {
        // alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },

    bottomLine: {
        // borderRadius: 1,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1.0,
        shadowRadius: 2,
        height: 1,
        elevation: 1,
    },
    petItemCategoryView: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        alignItems: 'center'

    },
    searchFieldView: {
        // paddingHorizontal: 20,
        // paddingBottom: 10,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // marginTop: 10,

    },
    locationView: { flexDirection: 'row', alignItems: 'center' },
    headerViewHome: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,

    },
    previousandRecentSearchline: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(91,37,31,0.12)',
        marginTop: 10
    },
    imageViewAllProducts: {
        // height:100,
        // width:100,
        height: screenDimensions.width / 3,
        width: screenDimensions.width / 2 - 60,
        borderRadius: 10
    },

    imageViewAllProductsCategory: {
        width: 135, height: 135,
        // height: screenDimensions.width / 3 - 10,
        // width: screenDimensions.width / 2 - 50,
        borderRadius: 10,
        alignSelf: 'center'
    },

    imageViewAllWishlist: {
        height: screenDimensions.width / 3,
        width: screenDimensions.width / 2 - 40
    },

    cardViewAllWishlist: { height: screenDimensions.width / 2 + 20, width: screenDimensions.width / 2 - 20 },

    cardViewAllProducts: { height: screenDimensions.width / 2 + 20, width: screenDimensions.width / 2 - 60 },
    cardViewAllProductsCategory: {
        height: screenDimensions.width / 2 + 40,
        width: screenDimensions.width / 2 - 40
    },

    mainViewAllProducts: { marginLeft: 10, marginVertical: 10, width: screenDimensions.width / 2 - 60 },
    mainViewAllProducts2: {
        marginHorizontal: 10,
        marginVertical: 5,
        width: screenDimensions.width / 2 - 40,
        borderRadius: 10
    },

    mainViewAllWishlist: { marginVertical: 10 },

    bannerImages: {
        width: screenDimensions.width, height: screenDimensions.height / 4
    },

    showAllPetProductsView: { flex: 1, },

    topHeaderProductLiting: {
        marginTop: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
    },
    titleView: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: 20
    },

    titleSearchView: {
        alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        // marginLeft: 20
    },

    cardViewFilters: {
        backgroundColor: 'white',
        height: 40,
        width: 104,
        alignItems: 'center',
        justifyContent: "center"
    },
    filterDotView: { marginLeft: 5, backgroundColor: '#F6871C', height: 6, width: 6, borderRadius: 3 },

    filtersView: { alignItems: 'center', justifyContent: 'center', marginLeft: 20 },

    filterModalView: {
        marginTop: Platform.OS == 'ios' ? 20 : 10,
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    filterModalViewTop: { flex: 1, paddingTop: Platform.OS == 'ios' ? 20 : 10, },

    customButtonStyleApply: {
        marginHorizontal: screenDimensions.width / 3,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    addToCart: {

        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: colors.appColor
    },
    noDataFoundCenter: { justifyContent: 'center', alignItems: 'center', flex: 1 },

    topOfProductDetail: { flex: 1, paddingTop: 20, backgroundColor: 'white' },

    bottomSpaceProfile: { borderBottomWidth: 8, borderBottomColor: '#F5F8FA' },

    bottomSpace2: { borderBottomWidth: 8, borderBottomColor: '#F5F8FA', },

    profileView: { marginTop: 40, paddingHorizontal: 30, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },

    contactUsView: { paddingVertical: 15, borderBottomColor: 'rgba(91,37,31,0.09)', borderBottomWidth: StyleSheet.hairlineWidth },

    selectAddresBtnView: {

        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: colors.appColor,
        marginHorizontal: 20,
        marginVertical: 20
    },
    submitView: { alignItems: 'center', justifyContent: 'center' },

    selectAddressForPickup: { justifyContent: 'space-between', flexDirection: 'row' },

    selectAddress: { alignItems: 'center', justifyContent: 'center', marginLeft: 20 },

    profitProducts: {
        flexDirection: 'row',
        marginVertical: 20,
        marginHorizontal: 20,
    },
    orderDetailView: { justifyContent: 'center', alignItems: 'center' },

    containerStyleforProfit: { width: screenDimensions.width / 3, paddingHorizontal: 5 },

    mainviewOrderDetail: { flexDirection: 'row', justifyContent: 'space-between' },

    totalProfitOverSales: { marginTop: 30, marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' },

    borderSalesReport: { height: 8, backgroundColor: '#F5F8FA', marginVertical: 5, marginVertical: 10 },

    totalProfiTotalSale: { marginTop: 20, marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' },

    totalprofitView: { marginHorizontal: 20, marginVertical: 10 },

    salesReportView: { alignItems: 'center', justifyContent: 'center', marginLeft: 20 },

    topHeaderSales: { marginTop: 15, paddingHorizontal: 30, marginBottom: 10, flexDirection: 'row', },

    requestViewMain: { flex: 1, paddingTop: 20, backgroundColor: 'white' },

    requestSubmittedView2: { marginHorizontal: 20, justifyContent: 'center', alignItems: 'center' },

    topViewCardSection: { marginTop: Platform.OS == 'ios' ? 20 : 20, paddingHorizontal: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },

    topViewCard: { flex: 1, paddingTop: Platform.OS == 'ios' ? 20 : 20, },

    cardTitileView: { alignItems: 'center', justifyContent: 'center', marginLeft: 20 },

    addNewView: { alignItems: 'center', justifyContent: 'center', },

    bottomLineCardScreen: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(91,37,31,0.12)' },

    flatliStCardView: { padding: 10, marginBottom: 20, borderColor: '#E7E7E7', borderRadius: 8, borderWidth: 1 },

    enterCVV: { flex: 0.3, paddingHorizontal: 10, backgroundColor: '#F5F5F5', borderRadius: 4, alignItems: 'center', justifyContent: 'center', },

    cardHolderAndCvvView: { flex: 0.9, justifyContent: 'space-between', flexDirection: 'row', marginTop: 30 },

    cardHolderName: { alignItems: 'flex-start', flex: 0.8, },

    bankInfoView: { flex: 0.9, justifyContent: 'space-between', flexDirection: 'row' },

    cardImage: { flex: 0.1, alignItems: 'center', },

    BanknamaAndNumber: { alignItems: 'flex-start', flex: 0.8, },

    cardImageView: { alignItems: 'center', flex: 0.1, justifyContent: 'center' },

    flatliStCardViewMain: { flexDirection: 'row', justifyContent: 'space-between', },

    OrderSuccessFullViewTitleMessge: { marginHorizontal: 20, marginTop: 20, justifyContent: 'center', alignItems: 'center' },

    mainViewOrderSuccess: { flex: 1, paddingTop: 20, backgroundColor: 'white' },

    orderAsSaleView: { paddingHorizontal: 30, marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' },

    orderAsServiceView: { paddingHorizontal: 30, marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' },

    borderBottom: { height: 1, backgroundColor: '#F5F8FA', marginVertical: 5, },

    ordertitle: { alignItems: 'center', justifyContent: 'center', marginLeft: 20 },

    orderHeaderView: { marginTop: 15, paddingHorizontal: 30, marginBottom: 10, flexDirection: 'row', },

    orderForPetMainView: { flex: 1, paddingTop: 20, backgroundColor: 'white' },

    orderAsServiceViewFlat: {
        flexDirection: 'row',
        marginVertical: 20,
    },

    orderAsServiceViewFlatFirstSection: { flex: 0.3, paddingLeft: 2, flexWrap: 'wrap' },

    mainViewNotifications: { flex: 1, paddingTop: 20, paddingHorizontal: 20 },

    notificationHeaderView: { marginTop: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },

    cardViewNotification: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.20,
        shadowRadius: 5,
        // elevation: 0.5,
        // marginLeft: 5,
        // marginRight: 5,
        // marginTop: 10,
    },

    cardViewMainForNotification: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    notificationTimeView: { justifyContent: 'flex-end', alignItems: 'flex-end' },

    mainTopViewPet: { flex: 1, paddingTop: 20, backgroundColor: 'white' },

    mainTopViewMyCutomersmargin: { marginTop: Platform.OS == 'ios' ? 20 : 20, paddingHorizontal: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },

    mainTopViewPetmargin: { marginTop: Platform.OS == 'ios' ? 20 : 10, paddingHorizontal: 20, marginBottom: 10, flexDirection: 'row', },

    myPetTextView: { alignItems: 'center', justifyContent: 'center', marginLeft: 20 },

    addNewPetButtonView: {

        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: colors.appColor,
        marginHorizontal: 20,
        marginVertical: 20,
        borderRadius: 30
    },

    addNewpetTextView: { alignItems: 'center', justifyContent: 'center', },

    petImagebackground: { //flex: 1,
        width: screenDimensions.width / 2 - 30,
        height: 112,
        position: 'absolute'
        // zIndex: -1,
        // backgroundColor:"red",
        // alignItems: 'flex-start',
        // justifyContent: 'flex-end'
    },


    petImagebackground2: { //flex: 1,
        width: screenDimensions.width / 2 - 30,
        height: 112,
        // position:'absolute',
        // zIndex: -1,
        // backgroundColor:"red",
        alignItems: 'flex-start',
        justifyContent: 'flex-end'
    },


    petDetailView: { flexDirection: 'row', justifyContent: 'space-between' },

    allCustomersFlatlistView: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },

    imageViewCheckUncheck: { flex: 0.1, justifyContent: 'flex-end', alignItems: 'flex-end', },

    customersTextView: { alignItems: 'center', justifyContent: 'center', marginLeft: 20 },

    borderBottomMyCustomers: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(91,37,31,0.12)' },

    searchCustomerView: { backgroundColor: '#F9F8F8', borderRadius: 4, marginHorizontal: 10, marginTop: 20, flexDirection: 'row' },

    searchImageView: { flex: 0.1, justifyContent: 'center', alignItems: 'center' },

    selectAndProceddButton: {

        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: colors.appColor,
        marginHorizontal: 20,
        marginVertical: 20,
        borderRadius: 30
    },

    topHeaderViewInTransist: { marginTop: 15, paddingHorizontal: 30, marginBottom: 10, flexDirection: 'row', },

    ordersTextView: { alignItems: 'center', justifyContent: 'center', marginLeft: 20 },

    borderBottomInTrans: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(91,37,31,0.12)' },

    customerInfoView: { marginTop: 20, justifyContent: 'space-between', flexDirection: 'row' },

    InTransistView: { height: 1, marginHorizontal: 20, backgroundColor: 'rgba(91,37,31,0.09)', marginTop: 10 },

    emailView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        marginHorizontal: 20,
        borderColor: 'rgba(91,37,31,0.22)',
        borderWidth: 1,
        borderRadius: 4,
        flex: 1,
    },

    emailViewImage: {
        // flex: 0.2,
        position: 'absolute',
        // bottom: -25,
        left: -50,

        width: 120,
        height: 120,
        backgroundColor: colors.appColor,
        // justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 120 / 2,
        position: 'absolute',
        // zIndex:-1000
    },

    emailView2: { flex: 0.8, paddingLeft: 10, paddingVertical: 20, },

    phoneView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginHorizontal: 20,
        borderColor: 'rgba(91,37,31,0.22)',
        borderWidth: 1,
        borderRadius: 4,
        flex: 1,
    },

    phoneViewImage: {
        // flex: 0.2,
        position: 'absolute',
        // bottom: -25,
        left: -50,

        width: 120,
        height: 120,
        backgroundColor: colors.appColor,
        // justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 120 / 2,
        position: 'absolute',
        // zIndex:-1000
    },

    phoneView2: { flex: 0.8, paddingLeft: 10, paddingVertical: 20, },

    modal: {
        zIndex: 100,
        width: screenDimensions.width / 2,
        position: 'absolute',
        top: 20,
        marginHorizontal: 16,
        right: 0,
        borderRadius: 2,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
    },
    buttonText: {
        color: colors.titleColor,
        fontSize: fontSizes.normal,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    button: {
        // backgroundColor: 'green',
        alignItems: 'flex-start',
        marginHorizontal: 5,
        justifyContent: 'flex-start',
        paddingVertical: 5,

    },

    floatingActionsView: { justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' },
    floatingItemsText: { borderRadius: 5, backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 10 },

    floatingText: { color: 'black', fontFamily: fonts.circularStd },
    floatingItemImageView: { height: 40, width: 40, borderRadius: 20, backgroundColor: '#E36C09', alignItems: 'center', marginLeft: 15, justifyContent: 'center' },

    viewAllView: {
        backgroundColor: colors.appColor,
        borderRadius: 25,
        alignItems: 'center',
        paddingHorizontal: 5, paddingVertical: 2
    },

    viewAllView2: {
        backgroundColor: colors.appColor,
        borderRadius: 25,
        alignItems: 'center',
        paddingHorizontal: 5, paddingVertical: 2,
        width: 100
    },






    container3: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderColor: '#ebebeb',
        borderWidth: 1,
        borderRadius: 8,
        shadowColor: '#fcfcfc',
        shadowOpacity: 1,
        marginTop: 10,
        // height:100,
        shadowOffset: {
          width: 0,
          height: 5
        },
      },
      scrollView: {
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
      },
      bullets: {
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingTop: 5,
      },
      bullet: {
        paddingHorizontal: 5,
        fontSize: 20,
      },

      stat: {
        // paddingHorizontal: 20,
        paddingBottom: 10,
        paddingTop: 10,
        flexBasis: '33%',
        flex: 1,
        // maxWidth: '33%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
      },
      statText: {
        width: '100%',
        textAlign: 'left',
        color: colors.titleColor,
        fontFamily: fonts.myriadProRegular,
        fontSize: 10,
        lineHeight: lineHeight.normal,
        fontWeight: fontWeights.bold
      },
      statHold: {
        width: '100%',
        marginBottom: 8,
      },
      statLabel: {
       
        color: colors.titleColor,
        fontFamily: fonts.myriadProRegular,
        fontSize: 10,
        lineHeight: lineHeight.normal,
        fontWeight: fontWeights.bold
      },


});