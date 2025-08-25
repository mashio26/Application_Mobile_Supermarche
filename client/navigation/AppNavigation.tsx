import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CodeBar from '../components/CodeBar';
import History from '../components/History';
import Panier from '../components/Panier';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="codeBar">
                {props => <CodeBar {...props} />}
            </Stack.Screen>
            <Stack.Screen name="panier">
                {props => <Panier {...props} />}
            </Stack.Screen>
            <Stack.Screen name="history">
                {props => <History {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default AppNavigation;