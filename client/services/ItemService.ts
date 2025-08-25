import axios from 'axios';
import { Article, userId } from "../utils/utils";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const fetchArticles = async () => {
    try {
        return await axios.get(`${apiUrl}/items/`);
    } catch (error) {
        console.log(error.message);
    }
}

export const findArticleById = async (searchId: number) => {
    try {
        return await axios.get(`${apiUrl}/items/${searchId}`);
    } catch (error) {
        setError(error.message);
    }
}