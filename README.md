# 📱 Projet : Barcode Scanner

## 📌 Présentation

Ce projet consiste à développer une application mobile d’achat d’articles intégrant un système de paiement avec Stripe.
L’application permet de scanner des codes-barres, gérer un panier, consulter un historique d’achats, et propose un mode jour/nuit.

## 🚀 Fonctionnalités

L’application fournit :

- Scan de codes-barres :

    - Accès au panier depuis la page de scan

    - Ajout manuel des articles si l’appareil photo est indisponible

    - Vérification des articles via une API

- Panier :

    - Contient l’ensemble des articles scannés

    - Suppression d’articles et gestion des quantités

    - Indication du nombre d’exemplaires pour un même article

    - Paiement sécurisé via Stripe

    - Sauvegarde du panier pour de futurs achats

- Historique

    - Consultation des articles déjà payés

- Personnalisation

- Thème jour/nuit configurable

## 🛠️ Technologies

Client : React Native (Expo, Expo.SQLite pour la persistance)

Serveur : FastAPI (API de gestion et intégration Stripe)

Outils : Android Studio, Docker, Node.js, Stripe

## 📂 Fichiers

/server → API FastAPI pour l’intégration Stripe (configurer avant le client)

/client → Application mobile React Native (point principal du développement)

## 🎯 Objectif pédagogique

Ce projet est avant tout un exercice pratique permettant de manipuler :

- La création d’interfaces mobiles avec React Native

- L’intégration d’un système de paiement avec Stripe

- La gestion des données locales avec Expo.SQLite

- Les principes d’architecture logicielle (services, composants, types, interfaces, classes)

- Le code asynchrone et la communication client-serveur

- Le versionnement avec Git et la gestion de projet en équipe
