# Gestionnaire de Combat - Vue.js

## Objectif du projet
Le **Gestionnaire de Combat** est une application web interactive développée avec **Vue.js** permettant aux utilisateurs d'explorer une bibliothèque de héros, de simuler des combats entre deux personnages et de consulter l'historique des affrontements réalisés lors de la session en cours.

L'idée principale derrière ce projet était de créer une expérience immersive où les joueurs peuvent tester la puissance de différents héros et voir leurs combats en action, tout en assurant une interface fluide et agréable grâce à des animations et un design moderne.

## Fonctionnalités principales
### Bibliothèque des héros
- Accès à une liste détaillée de héros, chacun ayant des caractéristiques spécifiques (force, agilité, intelligence, etc.).
- Affichage dynamique des informations des héros avec une interface intuitive.

### Simulation de combat
- Deux joueurs choisissent chacun un héros et s'affrontent dans un combat simulé.
- Mécanisme de calcul des attaques basé sur les statistiques des héros.
- Interface dynamique pour voir l’évolution du combat en temps réel.
- Affichage des résultats et du gagnant à la fin du duel.

### Historique des combats
- Sauvegarde et affichage de tous les combats réalisés au cours de la session.
- Détails des affrontements : noms des héros, statistiques, et résultats.
- Permet aux joueurs de suivre l’évolution de leurs combats et analyser leurs performances.

## Répartition des tâches
Le projet a été développé en collaboration entre **Joe** et **Candice**, chacun ayant contribué à des aspects spécifiques :

- **Joe** :
  - Développement de la structure des composants Vue.js.
  - Implémentation des composants permettant de choisir les héros
  - Implémentation des composants permettant la realisation des combats.
  - Proposition d’une première version fonctionnelle de ces pages.
  - Ajout des tests unitaires.

- **Candice** :
  - Amélioration de tous les composants et intégration des animations pour une meilleure expérience utilisateur.
  - Développement de la page d’historique des combats.
  - Développement de la page biblioteque des héros.
  - Ajustements UX/UI pour une navigation plus fluide et attrayante.
  - Ajout des commentaires et organisation du code

## Organisation du travail
- Le projet a été géré via **Git** pour assurer une bonne collaboration et versionner les différentes évolutions.
- Dans certains cas, lorsque des composants entiers étaient finalisés par l’un des développeurs, ils étaient directement envoyés à l’autre pour intégration, puis poussés sur le dépôt commun.
- Les revues de code et les tests ont été faits en équipe pour garantir une bonne stabilité du projet avant chaque mise à jour majeure. 

## Défis rencontrés et solutions apportées
### Problème : API lente et instable
Nous avons initialement utilisé une API pour récupérer les informations des héros, mais celle-ci posait de sérieux problèmes :
- Temps de chargement excessivement long et erreurs.
- Erreurs de requêtes affectant l’ensemble des pages du projet, car l'API initiale proposait uniquement des recherches par ID et ne permettait pas de lister les héros.

**Solution** : Après analyse, nous avons décidé de changer d’API en sélectionnant une alternative plus rapide et plus fiable. Ce changement a grandement amélioré la fluidité de l’application et réduit les erreurs.

### Optimisation du design et des animations
Nous avons voulu offrir une interface engageante avec des animations fluides. L’optimisation des transitions et des effets a été un défi technique nécessitant plusieurs itérations pour atteindre un bon équilibre entre performance et esthétique.

## Installation et lancement
### Prérequis
Avant de commencer, assurez-vous d’avoir **Node.js** et **npm** installés sur votre machine.

### Étapes d’installation
1. **Cloner le projet**
   ```bash
   git clone <URL_du_dépôt>
   cd gestionnaire-de-combat
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Lancer l’application en mode développement**
   ```bash
   npm run dev
   ```
4. **Accéder à l’application**
   Ouvrir [http://localhost:5173](http://localhost:5173) (ou un autre port si spécifié) dans votre navigateur.

5. **Activé le son !!**

## Perspectives d’amélioration
Nous avons envisagé plusieurs évolutions pour enrichir l’application à l’avenir :
- **Ajout d’un mode multijoueur en ligne** pour permettre à des joueurs distants de s’affronter.
- **Création d’un système de progression et de classement** pour suivre les performances des joueurs sur plusieurs sessions.
- **Personnalisation des héros** avec des skins et des compétences évolutives.
- **Effets sonores et animations avancées** pour renforcer l’expérience immersive des combats.

## API
https://akabab.github.io/superhero-api/api/

## ❤️ Remerciements
Ce projet a été une aventure passionnante ! 

---
**Prêts à combattre ? Sélectionnez vos héros et que le meilleur gagne !**

PS : Toute ressemblance avec le jeu Mortal Kombat ou un jeu similaire est purement fortuite.