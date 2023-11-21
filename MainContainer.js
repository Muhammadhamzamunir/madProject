// MainContainer.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import app from "../firebase/config";


import { useAuth } from './AuthContextApi';
import Colors from './assets/Colors';
import Main from './Screens/Home';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Account from './Screens/Account';
import Cart from './Screens/Cart';
import RegisterBakery from './Screens/RegisterBakery';
const homeName = 'Home';
const loginName = 'Login';
const signupName = 'Signup';
const acountName = 'Account';
const cartName = 'Cart'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    initialRouteName={homeName}
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: Colors.primaryColor,
      tabBarInactiveTintColor: 'grey',
      tabBarStyle: [{ padding: 10, height: 55 }],
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let rn = route.name;

        if (rn === homeName) {
          iconName = focused ? 'home' : 'home-outline';
        } else if (rn === cartName) {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (rn === acountName) {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name={homeName} component={Main} options={{ headerShown: false }} />
    <Tab.Screen name={cartName} component={Cart} />
    <Tab.Screen name={acountName} component={Account} options={{ headerShown: false }} />
  </Tab.Navigator>
);

function MainContainer() {
 
  const user = useAuth();

 

  return (
    <NavigationContainer>
     
      <Stack.Navigator initialRouteName={homeName}>
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name={signupName} component={Signup}  options={{ headerShown: false }}/>
        <Stack.Screen name={loginName} component={Login}  options={{ headerShown: false }}/>
        <Stack.Screen name="RegisterBakery" component={RegisterBakery}  options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
