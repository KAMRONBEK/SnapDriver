import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import {PersistGate} from 'redux-persist/lib/integration/react';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import invokeApp from 'react-native-invoke-app';
import LaunchApplication from "react-native-bring-foreground";
import createStore from './src/store/createStore';
import api from './src/services/api';
import {Linking, AppRegistry} from 'react-native';

const {store, persistor} = createStore();

const useMount = (func) => useEffect(() => func(), []);

const useInitialURL = () => {
    const [url, setUrl] = useState(null);
    const [processing, setProcessing] = useState(true);

    useMount(() => {
        const getUrlAsync = async () => {
            // Get the deep link used to open the app
            const initialUrl = await Linking.getInitialURL();

            // The setTimeout is just for testing purpose
            setTimeout(() => {
                setUrl(initialUrl);
                setProcessing(false);
            }, 1000);
        };

        getUrlAsync();
    });

    return {url, processing};
};


const App = () => {

    useEffect(() => {
        api.setToken(store);
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
        })
            .then((data) => {
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
            })
            .catch((err) => {
                // The user has not accepted to enable the location services or something went wrong during the process
                // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                // codes :
                //  - ERR00 : The user has clicked on Cancel button in the popup
                //  - ERR01 : If the Settings change are unavailable
                //  - ERR02 : If the popup has failed to open
            });

    }, []);

    const {url: initialUrl, processing} = useInitialURL();

    useEffect(() => {
        console.log('CHANGED URL: ' + initialUrl);
    }, [initialUrl]);
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppNavigator/>
            </PersistGate>
        </Provider>
    );
};

export default App;
