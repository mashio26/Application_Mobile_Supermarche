import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Button, TouchableOpacity, Modal, Alert } from 'react-native';
import { Article, getPanier, addArticlePanier } from '../utils/utils';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../context/DarkModeProvider';
import { fetchArticles, findArticleById } from '../services/ItemService';

interface ArticlesProps {
  navigation: any;
}

const Articles: React.FC<ArticlesProps> = ({ navigation }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [searchId, setSearchId] = useState(-1);

    const { theme } = useTheme();
    const styles = themedStyles(theme);

    useEffect(() => {
        const initDb = async () => {
            try {
                const data = await getPanier();
            } catch(error) {
                setError(error.message);
            }
        };

        const fetching = async () => {
            try {
                const response = await fetchArticles();
                setArticles(response.data);
            } catch(error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        initDb();
        fetching();
    }, []);

    const addArticle = async (id: number, name: string, price: number) => {
        try {
            await addArticlePanier(id, name, price);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearchId = async () => {
        try {
            if (!searchId || isNaN(Number(searchId))) {
                throw new Error('Entrer un identifiant valide.');
            }

            const response = await findArticleById(Number(searchId));
            if (!response.data) {
                throw new Error("Article non trouvé.");
            }

            const { id, name, price } = response.data;
            await addArticlePanier(id, name, price);
            setItemName(name);
            setItemPrice(price);
            setModalVisible(true);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de trouver l\'article.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Entrez l'identifiant de l'article"
                    placeholderTextColor={theme.color}
                    keyboardType="numeric"
                    value={searchId}
                    onChangeText={setSearchId}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearchId}>
                    <Text style={styles.searchButtonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={articles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            addArticle(item.id, item.name, item.price)
                            setModalVisible(true)
                            setItemName(item.name);
                            setItemPrice(item.price);
                        }}
                    >
                        <View style={styles.articleContainer}>
                            <Text style={styles.articleName}>{item.name}</Text>
                            <Text style={styles.articlePrice}>{item.price / 100}€</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Article ajouté : </Text>
                        <Text style={styles.modalText}>{itemName}</Text>
                        <Text style={styles.modalText}>Prix: {parseFloat(itemPrice)/100}€</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Ajouter un autre article</Text>
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
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            paddingHorizontal: 10,
        },
        searchInput: {
            flex: 4,
            borderWidth: 1,
            borderColor: theme.color,
            borderRadius: 5,
            padding: 10,
            color: theme.color,
            marginRight: 10,
        },
        searchButton: {
            flex: 1,
            backgroundColor: theme.color,
            borderWidth: 1,
            borderColor: theme.color,
            borderRadius: 5,
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        searchButtonText: {
            color: theme.backgroundColor,
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8d7da',
            padding: 20,
            borderRadius: 8,
            margin: 10,
        },
        errorText: {
            color: '#721c24',
            fontSize: 16,
            textAlign: 'center',
        },
        articleContainer: {
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.color === '#000000' ? '#e0e0e0' : '#555',
            borderRadius: 5,
            marginVertical: 5,
            marginHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.backgroundColor,
        },
        articleName: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.color,
        },
        articlePrice: {
            fontSize: 16,
            color: theme.color,
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
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.color,
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

export default Articles;