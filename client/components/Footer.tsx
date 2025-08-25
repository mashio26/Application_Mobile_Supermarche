import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/DarkModeProvider';

interface FooterProps {
  navigation: any;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = themedStyles(theme);

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('history')}>
                <FontAwesome name="history" size={32} style={[styles.icon, { color: theme.color }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('codeBar')}>
                <FontAwesome name="qrcode" size={32} style={[styles.icon, { color: theme.color }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('panier')}>
                <FontAwesome name="shopping-cart" size={32} style={[styles.icon, { color: theme.color }]} />
            </TouchableOpacity>
        </View>
    );
};

const themedStyles = (theme) =>
    StyleSheet.create({
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: theme.backgroundColor,
            paddingVertical: 6,
            position: 'absolute',
            bottom: 0,
            width: '105%',
            shadowColor: '#222',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.6,
            shadowRadius: 3,
            elevation: -6,
        },
        icon: {
            margin: 10,
        }
    });

export default Footer;
