import { useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView } from "react-native";
import { Article, getPanier, removeArticlePanier } from "../utils/utils";
import { preparePayments, check } from "../services/PaymentService";

interface CheckoutProps {
  panier: Article[];
  resetPanier: () => void;
}

const CheckoutScreen: React.FC<CheckoutProps> = ({ panier, resetPanier }) => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");

    const fetchPaymentSheetParams = async () => {
        const response = await preparePayments(panier);

        const { paymentIntent, ephemeralKey, customer } = response.data;

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });

        if (!error) {
            setPaymentIntentId(paymentIntent);
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            const paymentIntent = `pi_${paymentIntentId.split("_")[1]}`;
            const response = await check(paymentIntent);

            if (response.status == 200) {
                Alert.alert('Success', 'Your order is confirmed!');
                resetPanier();
                const allRows = await getPanier();
                for (const row of allRows) {
                    await removeArticlePanier(row.id);
                }
            }
        }
    };

    useEffect(() => {
        if (panier.length > 0) initializePaymentSheet();
    }, [panier]);

    return (
        <SafeAreaView>
            <Button
                disabled={!loading}
                title="Checkout"
                onPress={openPaymentSheet}
            />
        </SafeAreaView>
    );
}

export default CheckoutScreen;