import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    TouchableOpacity,
    RefreshControl
} from 'react-native';

//global libs
import moment from 'moment'
import axios from 'axios';
import IconBadge from 'react-native-icon-badge';

//Local imports
import styles from '../styles'
import Spinner from '../components/Spinner'
import Container from '../components/Container'
import { walletUrl, key, sec, } from '../utilities/config'
import {
    Freshchat,
    setUser
} from '../components/FreshChat'

//Redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component';


//Actions
import * as userActions from '../redux/actions/userAction';
import * as customerActions from '../redux/actions/customerAction'
import { colors, screenDimensions } from '../utilities/constants';
import * as productActions from '../redux/actions/productAction'


class ViewUsageWalletScreen extends Component {
    constructor(props) {
        super(props);
        let userInfo = this.props && this.props.user ? this.props.user : null
        this.state = {
            visible: false,
            refreshing: false,
            userWalletAmount: this.props.userWalletAmount,
            tableHead: ['Order \nID', 'Previous \n Bal.', 'Current\n Bal.', 'Date', 'Status'],
            tableData: this.props.allwalletUsage
        };


    }
    componentDidMount() {

    }


    getWalletHistory = () => {
        let userInfo = this.props.user ? this.props.user : null

        debugger
        // this.setState({visible:true})
        axios.get(`${walletUrl}history/user/${userInfo.id}?key=${key}&sec=${sec}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res && res.status == 200) {
                var officersIds = [];
                res.data.forEach(function (item) {
                    officersIds.push([
                        `${item.order_id != 0 ? '#' + item.order_id : '_'}`,
                        `AED ${item.before_amount}`,
                        `AED ${item.after_amount}`,
                        moment(item.added_on).format('DD-MM-YY'),
                        `${item.order_id != 0 ? 'Debit' : 'Credit'}`
                    ]);
                });

                this.props.productActions.saveWalletUsage({ allwalletUsage: officersIds })

                this.setState({ visible: false, refreshing: false })
                debugger
            }
            else {
                this.setState({ tableData: [], visible: false, refreshing: false })
            }
        }).catch((err) => {
            debugger
            this.setState({ tableData: [], visible: false, refreshing: false })
        })

    }


    walletFirstComponent = () => {
        const state = this.state;

        const element = (data, index) => (
            <View style={styles.btn}>
                <Text style={[styles.text2, { color: data == 'Debit' ? 'red' : colors.appColor }]}>{data}</Text>
            </View>
        );

        return (
            <View>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/wallet/ic_wallet.png')} />
                </View>
                <View style={{ paddingHorizontal: 10, paddingTop: 10, }}>

                    {
                        this.state.tableData.length ?
                            <View style={styles.container2}>
                                <Table borderStyle={{ borderWidth: 0.5, borderColor: colors.lightfontColor }}>
                                    <Row data={state.tableHead} style={styles.head} textStyle={styles.text} />

                                    {
                                        state.tableData.map((rowData, index) => (
                                            <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                                                {
                                                    rowData.map((cellData, cellIndex) => (
                                                        <Cell key={cellIndex} data={cellIndex === 4 ? element(cellData, index) : cellData} textStyle={styles.text2} />
                                                    ))
                                                }
                                            </TableWrapper>
                                        ))
                                    }
                                </Table>
                            </View>
                            :
                            null
                    }

                </View>


            </View>

        )
    }



    handleRefresh = () => {
        this.setState({
            refreshing: true,
            // visible: true
        }, () => {
            this.getWalletHistory();
        });

    }

    mainComponent = () => {
        return (
            <View style={{
                paddingTop: 20,
            }}>
                {this.walletFirstComponent()}
            </View>
        )
    }


    //open freshchat
    openFreshChat = () => {
        setUser(this.props.user)
        Freshchat.showConversations()
    }



    rightItem = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Notification')}>
                        <IconBadge
                            MainElement={
                                <Image source={require('../assets/images/notificationIcon/ic_notification.png')} style={{ marginRight: 10 }} />
                            }
                            BadgeElement={
                                <Text style={{ color: 'white', fontSize: 10 }}>{this.props.unReadMessage}</Text>
                            }
                            IconBadgeStyle={{
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
                            }}
                            Hidden={this.props.unReadMessage == 0 || this.props.unReadMessage == null}
                        />
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity onPress={() => this.openFreshChat()}>
                        <Image source={require('../assets/images/messageIcon/ic_message.png')} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    render() {
        return (
            <View style={[styles.container, styles.AndroidSafeArea]}>
                <SafeAreaView style={{ flex: 0, backgroundColor: '#00A651' }} />
                <StatusBar
                    translucent
                    barStyle={"dark-content"}
                    backgroundColor={'#00A651'}
                />
                <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }}
                    style={[{ flex: 1, backgroundColor: '#ffffff' }]} >
                    {this.state.visible ? <Spinner /> : null}
                    <Container
                        backButton={true}
                        scrollView={true}
                        backButtonFunction={() => this.props.navigation.goBack()}
                        rightItem={() => this.rightItem()}
                        title={'Your wallet'}
                        subtitileFontSize={14}
                        subtitile={'View usage'}
                        viewStyle={{ marginTop: 20, height: screenDimensions.height }}
                        scrollStyle={{ flex: 1, marginTop: 10, paddingBottom: 150 }}
                        scrollProps={{
                            showsVerticalScrollIndicator: false,
                            keyboardShouldPersistTaps: 'handled',
                            refreshControl: <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }}
                        mainComponent={() => this.mainComponent()}
                    />
                </SafeAreaView>
            </View>


        );
    }
}

//mapping reducer states to component
function mapStateToProps(state) {

    return {
        user: state.login.user,
        userCommon: state.user,
        allwalletUsage: state.login.allwalletUsage,
        userWalletAmount: state.login.userWalletAmount,
        unReadMessage: state.login.unReadMessage,

    }
}

//mapping dispatcheable actions to component
function mapDispathToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch),
        customerActions: bindActionCreators(customerActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),

    };
    //return bindActionCreators({logInUser,showOptionsAlert}, dispatch);
}

//Connecting component with redux structure to get or dispatch data
export default connect(mapStateToProps, mapDispathToProps)(ViewUsageWalletScreen)

