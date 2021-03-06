import {StyleSheet} from "react-native";
import colors from "@constants/colors";
import constStyles from "@constants/constStyles";

export default StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        zIndex: -1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {
        resizeMode: 'contain',
        width: 35,
        height: 35,
    },
    buttonWrapper: {
        bottom: 100,
        right: 10,
        position: 'absolute',
        zIndex: 1,
        padding: 10,
    },
    currentLocationMarker: {
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: colors.white,
        height: 35,
        width: 35,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        ...constStyles.shadow,
    }
});
