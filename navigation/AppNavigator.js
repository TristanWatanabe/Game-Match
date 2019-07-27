import React from 'react';
// import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Login from '../screens/Login';
import Signup from '../screens/Signup'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import Chat from '../screens/Chat'
import Chats from '../screens/Chats'


// export default createAppContainer(
//   createSwitchNavigator({
//     // You could add another route here for authentication.
//     // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//     Login: Login,
//     Signup: Signup,
//     Main: MainTabNavigator,
//   })
// );

import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = createStackNavigator({ MainTabNavigator: MainTabNavigator, Chat:Chat, Chats:Chats});
const AuthStack = createStackNavigator({ Login: Login, Signup: Signup  });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading',
  }
));