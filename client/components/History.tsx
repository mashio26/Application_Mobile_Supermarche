import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import Header from './Header'
import Footer from './Footer';
import axios from 'axios';
import { userId } from "../utils/utils";
import { List, Provider as PaperProvider, Colors } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/DarkModeProvider';
import { historiquePayment } from '../services/PaymentService';

interface HistoryProps {
  navigation: any;
}

const History: React.FC<HistoryProps> = ({ navigation }) => {
    const [historique, setHistorique] = useState<Article[][]>([]);
    const [total, setTotal] = useState<float[]>(0);

    const { theme } = useTheme();
    const styles = themedStyles(theme);

     useEffect(() => {
            const fetchHistorique = async () => {
                try {
                    const response = await historiquePayment();
                    let histoTemp = [];
                    let totalTemp = [];
                    for (const row of response.data) {
                        let panierTemp = [];
                        for (const item of row.purchased_items) {
                            panierTemp = [...panierTemp, { id: item.item.id, name: item.item.name, price: item.item.price, amount: item.amount}];
                        }
                        const tot = calcTotal(panierTemp);
                        totalTemp = [...totalTemp, tot];
                        histoTemp = [...histoTemp, { id: row.id, date: row.checkout_date, panier: panierTemp }];
                    }

                    setTotal(totalTemp);
                    setHistorique(histoTemp);
                } catch (error) {
                    console.error("Erreur lors de la récupération des données :", error);
                }
            };

            fetchHistorique();
        }, []);

    const calcTotal = (panier: Article[]) : float => {
        let tot = 0;
        for (const item of panier) {
          tot += (item.price / 100) * item.amount;
        }
        return tot;
    };

    return (
        <PaperProvider style={styles.paper}>
          <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {[...historique].reverse().map((transaction, index) => (
                <List.Accordion
                  key={transaction.id}
                  title={`${transaction.date ? new Date(transaction.date).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  }) : 'Pas de date précisée'}`}
                  description={`Total: ${total[historique.length - 1 - index].toFixed(2)} €`}
                  style={styles.accordion}
                  titleStyle={styles.accordionTitle}
                  descriptionStyle={styles.accordionDescription}
                  left={(props) => <FontAwesome {...props} name="shopping-bag" size={24} style={[styles.icon, { color: theme.color }]} />}
                >
                  {transaction.panier.map((item) => (
                    <View key={item.id} style={styles.articleContainer}>
                      <Text style={styles.articleName}>{item.name}</Text>
                      <Text style={styles.articleDetails}>Quantité : {item.amount}</Text>
                      <Text style={styles.articleDetails}>Prix unitaire : {(item.price / 100).toFixed(2)} €</Text>
                    </View>
                  ))}
                </List.Accordion>
              ))}
            </ScrollView>
            <Footer navigation={navigation} />
          </View>
        </PaperProvider>
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
      scrollContainer: {
        paddingBottom: 80,
        marginTop: 20,
        backgroundColor: theme.backgroundColor,
      },
      accordion: {
        backgroundColor: theme.backgroundColor,
        borderWidth: 1,
        borderColor: theme.color,
        padding: 8,
      },
      accordionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.color,
      },
      accordionDescription: {
        fontSize: 14,
        color: theme.color,
      },
      articleContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: theme.backgroundColor,
        borderRadius: 6,
        marginVertical: 4,
      },
      articleName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.color,
      },
      articleDetails: {
        fontSize: 14,
        color: theme.color,
      },
      icon: {
        margin: 10,
      },
      paper: {
          backgroundColor: theme.backgroundColor,
      },
    });

export default History;