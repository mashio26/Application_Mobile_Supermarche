import React, { useState, useEffect } from 'react';
import { Modal, View, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import * as SQLite from 'expo-sqlite';
import Header from './Header';
import Articles from './Articles';
import Footer from './Footer';
import { Article, getPanier, addArticlePanier } from '../utils/utils';
import { useTheme } from '../context/DarkModeProvider';

interface CodeBarProps {
  navigation: any;
}

const CodeBar: React.FC<CodeBarProps> = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState({ id: '', name: '', price: '' });
    const [modalVisible, setModalVisible] = useState(false);

    const { theme } = useTheme();
    const styles = themedStyles(theme);

    useEffect(() => {
        const initDb = async () => {
            try {
                const data = await getPanier();
            } catch(error) {
                console.log(error.message);
            }
        };
        const checkPerm = async () => {
            const CameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasPermission(CameraStatus.status === 'granted');
        }

        checkPerm();
        initDb();
      }, []);

    const addArticle = async(id: number, name: string, price: number) => {
        try {
            await addArticlePanier(id, name, price);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        const [id, name, price] = data.split('-');

        if (id && name && price) {
            setScannedData({ id, name, price });
            addArticle(id, name, price);
            setModalVisible(true);
        } else {
            alert("Erreur de lecture du code-barres, réessayez !");
            setScanned(false);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Articles navigation={navigation} />;
    }

    return (
        <View style={styles.container}>
            <Header />
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["code128", "ean13"],
                }}
                style={styles.camera}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Article scanné : </Text>
                        <Text style={styles.modalText}>{scannedData.name}</Text>
                        <Text style={styles.modalText}>Prix: {parseFloat(scannedData.price)/100}€</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                setScanned(false);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Scanner un autre article</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Footer navigation={navigation} />
        </View>
    );
};

const themedStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: theme.backgroundColor,
        },
        camera: {
            flex: 1,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.backgroundColor,
        },
        modalContent: {
            width: 300,
            padding: 20,
            borderWidth: 1,
            borderColor: theme.color,
            borderRadius: 10,
            alignItems: 'center',
            backgroundColor: theme.backgroundColor,
        },
        modalText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.color,
        },
        modalButton: {
            marginTop: 20,
            padding: 10,
            borderRadius: 5,
            backgroundColor: theme.color,
        },
        modalButtonText: {
            color: theme.backgroundColor,
            fontSize: 16,
        },
    });

export default CodeBar;