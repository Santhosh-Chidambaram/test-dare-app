/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react'
import MainState from './src/MainContext/MainState';

const RootApp = () => <MainState>
    <App/>
</MainState>
AppRegistry.registerComponent(appName, () => RootApp);
