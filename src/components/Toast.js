

import Toast from 'react-native-simple-toast';
import { Platform } from 'react-native';
const styles = {
    backgroundColor: "#3FB9BC",
    width: 320,
    height: Platform.OS === ("ios") ? 50 : 100,
    color: "#ffffff",
    borderRadius: 20,
    fontWeight: "bold",
    zIndex:1000
};
export const ToastMessage = (message, type) => {
    return (
        Toast.showWithGravity(message, Toast.LONG,Toast.CENTER)
    )
}
