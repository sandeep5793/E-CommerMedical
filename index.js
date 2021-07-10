
import 'react-native-gesture-handler';

import {AppRegistry,Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import KeyboardManager from 'react-native-keyboard-manager';



// if(Platform.OS=='ios') {
//     KeyboardManager.setToolbarPreviousNextButtonEnable(true);
// }

// Current main application
// New task registration
AppRegistry.registerComponent(appName, () => App);

