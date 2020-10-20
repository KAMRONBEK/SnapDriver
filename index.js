import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import messaging from "@react-native-firebase/messaging"
import {name as appName} from './app.json';
import invokeApp from 'react-native-invoke-app';

const handler = () => async message => {
    console.log(message);
    invokeApp();
    return Promise.resolve();
};

messaging().onMessage((message) => {
    // Process your message as required
    invokeApp();
    console.log('You got message!', message);
});

AppRegistry.registerHeadlessTask(
    'ReactNativeFirebaseMessagingHeadlessTask',
    handler,
);

AppRegistry.registerComponent(appName, () => App);
