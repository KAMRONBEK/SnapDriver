import React, {useState} from 'react';
import {Text, View} from 'react-native';
import CustomSwitch from '@components/common/CustomSwitch';
import Icon from '@assets/icons';
import strings from '@constants/strings';
import colors from '@constants/colors';
import constStyles from '@constants/constStyles';
import styles from "./styles";

interface SettingsProps {
}

const SettingsScreenView = ({}: SettingsProps) => {
    let [darkMode, setDarkMode] = useState(false);
    let [audio, setAudio] = useState(false);
    return (
        <View style={styles.container}>
            <View style={[styles.bar, styles.bottomBorder]}>
                <Text
                    style={[
                        constStyles.bold,
                        {
                            color: darkMode ? colors.blue : colors.black,
                        },
                    ]}>
                    {!darkMode
                        ? strings.switchDarkMode
                        : strings.switchLightMode}
                </Text>
                <CustomSwitch
                    value={darkMode}
                    onValueChange={() => {
                        setDarkMode(!darkMode);
                    }}
                />
            </View>
            <View style={[styles.bar, styles.bottomBorder]}>
                <Text
                    style={[
                        styles.text,
                        constStyles.bold,
                        {
                            color: audio ? colors.blue : colors.black,
                        },
                    ]}>
                    {strings.soundGuide}
                </Text>
                <CustomSwitch
                    value={audio}
                    onValueChange={() => {
                        setAudio(!audio);
                    }}
                />
            </View>
            <View style={styles.bar}>
                <Text style={[styles.text, constStyles.bold]}>
                    {strings.appLanguage}
                </Text>
                <Icon name="angleRight" size={10} style={{paddingRight: 15}}/>
            </View>
        </View>
    );
};

export default SettingsScreenView;
