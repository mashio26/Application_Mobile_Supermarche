import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigation from './navigation/AppNavigation';
import DarkModeProvider from './context/DarkModeProvider'

export default function App() {
    return (
        <DarkModeProvider>
            <SafeAreaView style={styles.container}>
                <NavigationContainer>
                    <AppNavigation />
                </NavigationContainer>
            </SafeAreaView>
        </DarkModeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
