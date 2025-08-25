import * as SQLite from 'expo-sqlite';

export interface Article {
    id: number;
    name: string;
    price: number;
    amount: number;
}

export const getPanier = async (): [] => {
    const db = await SQLite.openDatabaseAsync('data');
    await db.execAsync('CREATE TABLE IF NOT EXISTS panier (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, price INTEGER NOT NULL, amount INTEGER NOT NULL);');

    return await db.getAllAsync('SELECT * FROM panier');
}

export const addArticlePanier = async (id: number, name: string, price: number) => {
    const db = await SQLite.openDatabaseAsync('data');
    const exist = await db.getFirstAsync('SELECT * FROM panier WHERE id=$id AND name=$name AND price=$price', {$id: id, $name: name, $price: price});

    if (exist === undefined || exist === null) {
        await db.runAsync('INSERT INTO panier (id, name, price, amount) VALUES (?, ?, ?, 1)', id, name, price);
    } else {
        await db.runAsync('UPDATE panier SET amount = amount + 1 WHERE id = ?', exist.id);
    }
};

export const removeArticlePanier = async (id: number) => {
    const db = await SQLite.openDatabaseAsync('data');
    await db.runAsync('DELETE FROM panier WHERE id = ?', id);
}

export const removeOneArticlePanier = async (id: number, amount: number) => {
    const db = await SQLite.openDatabaseAsync('data');
    if (amount === 1) {
       await db.runAsync('DELETE FROM panier WHERE id = ?', id);
    } else {
       await db.runAsync('UPDATE panier SET amount = amount - 1 WHERE id = ?', id);
    }
}

export const addOneArticlePanier = async (id: number) => {
    const db = await SQLite.openDatabaseAsync('data');
    await db.runAsync('UPDATE panier SET amount = amount + 1 WHERE id = ?', id);
}