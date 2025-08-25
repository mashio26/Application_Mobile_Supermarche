import React, { useState, useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/DarkModeProvider'

export default Header = () => {
    const { theme, darkMode, toggleDarkMode } = useTheme();

    return (
        <View style={[ styles.header, { backgroundColor: theme.backgroundColor, transform: [{ translateX: -8 }] } ]}>
            <View style={styles.titleContainer}>
                <FontAwesome name="bug" size={24} style={[styles.icon, { color: theme.color }]} />
                <Text style={[styles.headerTitle, { color: theme.color }]}>Ladybug</Text>
            </View>
            <Switch
                style={styles.switch}
                trackColor={{ true: "#4a5c82", false: "#e5ce885" }}
                thumbColor={darkMode ? "#2f3b55" : "#dfc976"}
                onValueChange={toggleDarkMode}
                value={darkMode}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 25,
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
        shadowColor: '#222',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 6,
        width: '105%',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        marginTop: 8,
        textAlign: 'left',
        fontSize: 18,
        paddingLeft: 10,
        fontWeight: 'bold',
    },
    icon: {
        marginTop: 10,
    },
    switch: {
        borderRadius: 5,
    },
});