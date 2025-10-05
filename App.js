import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/screens/SplashScreen";
import SignInScreen from "./src/screens/SignInScreen";
import VerifyOTPScreen from "./src/screens/VerifyOTPScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import MapScreen from "./src/screens/MapScreen";
import { UserProvider } from './UserContext';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MainTabs from "./src/navigation/MainTabs";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>

        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
          </Stack.Navigator>

        </NavigationContainer>
      </GestureHandlerRootView>

    </UserProvider>

  );
}
