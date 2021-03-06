import React from 'react';
import HatCutout from "@components/common/HatCutout";
import colors from "@constants/colors";
import {Image, Text, TouchableWithoutFeedback, View} from "react-native";
import images from "@assets/images";
import Icon from "@assets/icons";
import styles from "./styles";
import Button from "@components/common/Button";
import strings from "@constants/strings";
import PauseIcon from "@assets/icons/PauseIcon";

interface IProps {
    changeOrderStatus: () => void;
    isLoading: boolean;
    drivingTo: string;
    duration: string;
    distance: string;
    openGoogleMaps: () => void;
    goToChat: () => void;
    wait: () => void;
    isWaiting: boolean;
    isVisible: boolean
}

const CurrentTripPanelView = (
    {
        changeOrderStatus,
        isLoading,
        drivingTo,
        distance,
        duration,
        openGoogleMaps,
        isWaiting,
        wait,
        isVisible,
        goToChat
    }: IProps) => {
    return (
        <View>
            <HatCutout style={styles.hatCutOut}/>
            <View style={styles.wrapper}>
                <View style={styles.innerWrapper}>

                    <View style={styles.imgWrapper}>
                        <Image style={styles.img} source={images.location}/>
                        <View style={styles.infoWrapper}>
                            {isVisible && <Text style={styles.info}>{distance} км - {duration} мин в пути</Text>}
                            <Text style={styles.text}>{drivingTo}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomWrapper}>
                    {
                        isVisible &&
                        <TouchableWithoutFeedback onPress={openGoogleMaps}>
                            <View style={styles.bottomIconWrapper}>
                                <Icon name="path" size={25} color={colors.black}/>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    <TouchableWithoutFeedback onPress={wait}>
                        <View style={styles.bottomIconWrapper}>
                            <PauseIcon
                                active={isWaiting}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={goToChat}>
                        <View style={styles.bottomIconWrapper}>
                            <Icon name="chat" size={25} color={colors.blue}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Button
                    onPress={changeOrderStatus}
                    text={strings.finish as string}
                    isLoading={isLoading}
                />
            </View>
        </View>
    );
};

export default CurrentTripPanelView;
