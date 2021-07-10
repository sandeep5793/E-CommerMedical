import { Dimensions } from 'react-native'

export const ISOCode = [
    { "name": "United Arab Emirates", "isoCode": "ARE", "country-code": "784" },
    { "name": "Bahrain", "isoCode": "BHR", "country-code": "048" },
    { "name": "Saudi Arabia", "isoCode": "SAU", "country-code": "682" },
]

export const colors = {
    appColor: '#00A651',
    lightfontColor: '#575755',
    titleColor: 'rgba(0,0,0,0.87)',
    gradient: ['#3579C6', '#3579C6', '#28559F', '#22438C'],
    lightColor:'rgba(255,255,255,0.66)',
    white:'#FFFFFF',
    black:"#000000",
    lightBlack:'#B3B3B3'

}

export const fonts = {
    circularStd: 'CircularStd-Medium',
    circularStdBlack: 'CircularStd-Black',
    circularStdBook: 'CircularStd-Book',
    circularStdBold: 'CircularStd-Bold',
    // myriadProRegular: 'Myriad Pro Black Italic',
    // helveticaNeueBold: 'HelveticaNeue-Black'
}

export const lineHeight = {
    normal: 16,
    medium: 18,
    large: 20,
    extraLarge: 24
}

export const fontSizes = {
    extraSmall:12,
    small: 14,
    normal: 16,
    medium: 18,
    large: 20,
    title: 24
}

export const fontWeights = {
    first: '100',
    second: '200',
    third: '300',
    fourth: '400',
    fifth: '500',
    normal: 'normal',
    bold: 'bold'
}

export const screenDimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}