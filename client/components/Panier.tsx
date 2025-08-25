import { StripeProvider } from '@stripe/stripe-react-native';
import { Article, getPanier, addArticlePanier, removeArticlePanier, removeOneArticlePanier, addOneArticlePanier } from '../utils/utils';
import CheckoutScreen from './CheckoutScreen';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Footer from './Footer';
import Header from './Header';
import * as SQLite from 'expo-sqlite';
import { useTheme } from '../context/DarkModeProvider';

interface PanierProps {
  navigation: any;
}

const Panier: React.FC<PanierProps> = ({ navigation }) => {
    const [panier, setPanier] = useState<Article[]>([]);
    const [total, setTotal] = useState(0);
    const stripePK = Constants.expoConfig.extra.stripePK;

    const { theme } = useTheme();
    const styles = themedStyles(theme);

    useEffect(() => {
        const fetchPanier = async () => {
            try {
                const allRows = await getPanier();
                let panierTemp = [];
                for (const row of allRows) {
                    panierTemp = [...panierTemp, { id: row.id, name: row.name, price: row.price, amount: row.amount}];
                }

                setPanier(panierTemp);
                calcTotal(panierTemp);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchPanier();
    }, []);

    const resetPanier = () => {
        setPanier([]);
        setTotal(0);
    };

    const addArticle = async (id: number, name: string, price: number) => {
        await addArticlePanier(id, name, price);

        const updatedRows = await getPanier();
        setPanier(updatedRows);
        calcTotal(updatedRows);
    };

    const removeArticle = async (id: number) => {
        await removeArticlePanier(id);

        const updatedRows = await getPanier();
        setPanier(updatedRows);
        calcTotal(updatedRows);
    }

    const removeOneArticle = async (id: number, amount: number) => {
        await removeOneArticlePanier(id, amount);

        const updatedRows = await getPanier();
        setPanier(updatedRows);
        calcTotal(updatedRows);
   }

   const addOneArticle = async (id: number) => {
       await addOneArticlePanier(id);

        const updatedRows = await getPanier();
        setPanier(updatedRows);
        calcTotal(updatedRows);
  }

  const calcTotal = (panier: Article[]) => {
      let tot = 0;
      for (const item of panier) {
          tot += (item.price / 100) * item.amount;
      }
      setTotal(tot);
  };

    return (
        <View style={styles.container}>
            <Header />
            <FlatList
                data={panier}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>{(item.price / 100).toFixed(2)} €</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => removeOneArticle(item.id, item.amount)}>
                                <Text style={styles.itemPrice}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.amountText}>{item.amount}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => addOneArticle(item.id)}>
                                <Text style={styles.itemPrice}>+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => removeArticle(item.id)}>
                                <Text style={styles.itemPrice}>DELETE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total : {total.toFixed(2)} €</Text>
            </View>

            <View style={styles.stripeContainer}>
                <StripeProvider
                 publishableKey={stripePK}
                 merchantIdentifier="merchant.com.example"
                >
                    <CheckoutScreen panier={panier} resetPanier={resetPanier} />
                </StripeProvider>
            </View>
            <Footer navigation={navigation}/>
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
            color: theme.color,
        },
        itemContainer: {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: theme.color,
        },
        itemDetails: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            color: theme.color,
        },
        itemName: {
            flex: 2,
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.color,
        },
        itemPrice: {
            flex: 1,
            fontSize: 16,
            textAlign: 'center',
            color: theme.color,
        },
        buttonContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
        },
        button: {
            padding: 10,
        },
        amountText: {
            fontSize: 16,
            fontWeight: 'bold',
            marginHorizontal: 5,
            color: theme.color,
        },
        totalContainer: {
            marginTop: 20,
            marginBottom: 10,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            color: theme.color,
        },
        totalText: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme.color,
        },
        stripeContainer: {
            marginBottom: 60,
        },
    });

export default Panier;