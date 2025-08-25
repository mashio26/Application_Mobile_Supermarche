import axios from 'axios';
import { Article } from "../utils/utils";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;
const userId = Constants.expoConfig.extra.userId;

export const historiquePayment = async () => {
    return await axios.get(`${apiUrl}/payments/` + userId);
}

export const preparePayments = async (panier: Article[]) => {
    return await axios.post(`${apiUrl}/payments/`, {
               "pending_items": panier,
               "customer_id": userId
           }, {
               headers: {
                   'Content-Type': 'application/json',
               }
           });
}

export const check = async (paymentIntent: string) => {
    return await axios.post(`${apiUrl}/payments/check/${paymentIntent}`, {
               "customer_id": userId
           }, {
               headers: {
                   'Content-Type': 'application/json',
               }
           });
}