import colors from '@constants/colors';
import SCREENS from '@constants/screens';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import BackgroundTimer from 'react-native-background-timer';

import NetInfo from '@react-native-community/netinfo';
import {StackNavigationProp} from '@react-navigation/stack';
import IAction from '@store/types/IAction';
import React, {useEffect, useState} from 'react';
import {Alert, StatusBar, Linking} from 'react-native';
import MainScreenView from './view';
import messaging from "@react-native-firebase/messaging";

const PushNotification = require('react-native-push-notification');

interface IProps {
    navigation: StackNavigationProp<any>;
    SetDriverStatusOnline: IAction;
    SetDriverStatusOffline: IAction;
    NewOrder: IAction;
    SetNetConnection: IAction;
    driver: any;
    newOrder: any;
    isNetConnected: boolean;
    car: any;
    UpdateLocation: IAction;
    GetProfile: IAction;
    SendPush: any;
}

const MainScreenController = (
    {
        navigation,
        driver,
        SetDriverStatusOffline,
        SetDriverStatusOnline,
        NewOrder,
        newOrder,
        SetNetConnection,
        isNetConnected,
        car,
        UpdateLocation,
        GetProfile,
        SendPush,
    }: IProps) => {
    const [showTariff, setShowTariff] = useState(false);
    const [intervalId, setIntervalId] = useState<any>();

    let configureBackgroundGeolocation = () => {
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Snap Taxi',
            notificationText: 'Рабоает в фоновом режиме',
            debug: false,
            startOnBoot: false,
            stopOnTerminate: true,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            stopOnStillActivity: false,
        });

        BackgroundGeolocation.on('location', ({latitude, longitude}) => {
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
            UpdateLocation({
                lat: `${latitude}`,
                lng: `${longitude}`,
            });


            console.log('GOT THE LOCATION');

            BackgroundGeolocation.startTask((taskKey) => {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask

                BackgroundGeolocation.endTask(taskKey);
            });
        });

        BackgroundGeolocation.on('stationary', (stationaryLocation) => {
            // handle stationary locations here
            // Actions.sendLocation(stationaryLocation);
        });

        BackgroundGeolocation.on('error', (error) => {
            console.log('[ERROR] BackgroundGeolocation error:', error);
        });

        BackgroundGeolocation.on('start', () => {
            console.log(
                '[INFO] BackgroundGeolocation service has been started',
            );
        });

        BackgroundGeolocation.on('stop', () => {
            console.log(
                '[INFO] BackgroundGeolocation service has been stopped',
            );
        });

        BackgroundGeolocation.on('authorization', (status) => {
            console.log(
                '[INFO] BackgroundGeolocation authorization status: ' + status,
            );
            if (status !== BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(
                    () =>
                        Alert.alert(
                            'App requires location tracking permission',
                            'Would you like to open app settings?',
                            [
                                {
                                    text: 'Yes',
                                    onPress: () =>
                                        BackgroundGeolocation.showAppSettings(),
                                },
                                {
                                    text: 'No',
                                    onPress: () => console.log('No Pressed'),
                                    style: 'cancel',
                                },
                            ],
                        ),
                    1000,
                );
            }
        });

        BackgroundGeolocation.on('background', () => {
            // BackgroundTimer.runBackgroundTimer(() => {
            //     console.log('fuck')
            // }, 3000);
            console.log('[INFO] App is in background')
        });

        BackgroundGeolocation.on('foreground', () => {
            // BackgroundTimer.stopBackgroundTimer();
            console.log('[INFO] App is in foreground');
        });

        BackgroundGeolocation.on('abort_requested', () => {
            console.log(
                '[INFO] Server responded with 285 Updates Not Required',
            );

            // Here we can decide whether we want stop the updates or not.
            // If you've configured the server to return 285, then it means the server does not require further update.
            // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
            // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
        });

        BackgroundGeolocation.on('http_authorization', () => {
            console.log('[INFO] App needs to authorize the http requests');
        });

        BackgroundGeolocation.checkStatus((status) => {
            console.log(
                '[INFO] BackgroundGeolocation service is running',
                status.isRunning,
            );
            console.log(
                '[INFO] BackgroundGeolocation services enabled',
                status.locationServicesEnabled,
            );
            console.log(
                '[INFO] BackgroundGeolocation auth status: ' +
                status.authorization,
            );

            // you don't need to check status before start (this is just the example)
            if (!status.isRunning) {
                BackgroundGeolocation.start(); //triggers start on start event
            }
        });

        // you can also just start without checking for status
        // BackgroundGeolocation.start();
    };

    useEffect(() => {
        navigation.addListener('focus', () => {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor(colors.white);
            GetProfile();
        });

        NetInfo.addEventListener((state) => {
            SetNetConnection(state.isConnected && state.isInternetReachable);
        });

        // setInterval(() => {
        //     if (!driver.isBusy) {
        //         Geolocation.getCurrentPosition(position => {
        //             const {coords: {latitude, longitude}} = position;
        //             UpdateLocation({
        //                 lat: `${latitude}`,
        //                 lng: `${longitude}`
        //             })
        //         })
        //     }
        // }, 10000);

        // setIntervalId(null);

        configureBackgroundGeolocation();

        PushNotification.configure({
            onNotification: (notification: any) => {
                if (notification.title === 'message') {
                    SendPush({
                        id: notification.data.notification_id,
                        message: notification.message,
                    });
                }
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
        // return () => clearInterval(intervalId);
    }, []);

    const routeTo = (screen: string) => () => {
        navigation.navigate(screen);
    };

    const changeDriverStatus = () => {
        if (driver.status) {
            SetDriverStatusOffline();
        } else {
            SetDriverStatusOnline(
                {
                    carId: car.id,
                },
                (bookingInfo) => {
                    !driver.isBusy && NewOrder(bookingInfo);
                },
            );
        }
    };

    return (
        <MainScreenView
            isNetConnected={isNetConnected}
            goToChat={routeTo(SCREENS.NOTIFICATIONS)}
            setShowTariff={setShowTariff}
            showTariff={showTariff}
            driverStatus={driver.status}
            changeDriverStatus={changeDriverStatus}
            isModalVisible={newOrder.isModalVisible}
            rates={car.rates}
        />
    );
};

export default MainScreenController;
