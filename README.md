# 🌿 Observatoire Environnemental de la Région Boeny • Madagascar

Plateforme géomatique interactive et observatoire territorial d'aide à la décision pour le suivi écologique, la gestion durable des ressources naturelles, la surveillance des feux de brousse et la valorisation des données géographiques (SIG / OGC GeoServer) dans la **Région Boeny**, Madagascar.

---

## 🗺️ Présentation du Projet

La **Région Boeny** (chef-lieu : Mahajanga), située sur la côte nord-ouest de Madagascar, abrite des écosystèmes d'une biodiversité exceptionnelle : les forêts sèches d'Ankarafantsika, les mangroves de la baie de Bombetoka et les zones humides du complexe Ramsar de Mahavavy-Kinkony. 

Cet observatoire environnemental réunit sur une même interface interactive les données spatiales officielles de la DREDD (Direction Régionale de l'Environnement et du Développement Durable), de Madagascar National Parks (MNP), du système de surveillance satellitaire NASA FIRMS, et des services cartographiques interopérables **OGC GeoServer**.

---

## ✨ Fonctionnalités Clés

### 1. Webmapping Interactif Haute Précision
- **Cartographie dynamique Leaflet** : Navigation fluide, zoom, recentrage rapide et identification spatiale des entités.
- **Fonds de carte interchangeables** :
  - 🛰️ Imagerie Satellite ESRI World Imagery haute résolution.
  - 🗺️ Carte topographique OpenTopoMap (relief, courbes de niveau).
  - 🏙️ OpenStreetMap standard pour le réseau routier et urbain.
  - 🌌 Thème nocturne Dark Matter optimisé pour la visualisation thématique.
- **Choroplèthes thématiques territoriales** :
  - Indice de pression écologique par district (Faible à Critique).
  - Taux de couvert forestier (% de canopée dense et secondaire).
  - Intensité et historique des feux de brousse par district.

### 2. Couches Thématiques & Données Environnementales
- **Aires Protégées de Madagascar (MNP & Ramsar)** :
  - Parc National d'Ankarafantsika (lémuriens diurnes et nocturnes, forêt caducifoliée).
  - Parc National de la Baie de Baly (habitat unique de la tortue à socte *Astrochelys yniphora*).
  - Site Ramsar du Complexe Mahavavy-Kinkony (oiseaux d'eau migrateurs).
- **Forêts de Mangroves & Carbone Bleu** :
  - Cartographie des peuplements de palétuviers (*Rhizophora*, *Avicennia*).
  - Suivi de la santé écologique des baies de Bombetoka, Boeny et du delta de la Mahavavy.
- **Surveillance des Feux de Brousse en Temps Réel** :
  - Détection thermique par capteurs satellitaires NASA FIRMS (VIIRS / MODIS).
  - Filtrage multi-annuel (2022, 2023, 2024 ou historique global).
  - Indication du niveau de confiance radiative et estimation des surfaces brûlées.
- **Réseau Hydrologique Majeur** :
  - Suivi des alluvions latéritiques du fleuve Betsiboka (« le cœur qui saigne de Madagascar »).
  - Lacs majeurs (Lac Kinkony, Lac Ravelobe) et affluents fluviaux.
- **Stations et Projets Écologiques DREDD** :
  - Postes de contrôle forestier, pépinières de restauration et brigades de patrouille.

### 3. 🌐 Intégration OGC GeoServer (WMS / WFS)
- **Publication directe de couches sur GeoServer** :
  - Assistant de publication pas-à-pas avec choix de jeux de données régionaux (ex. *Périmètres rizicoles de Marovoay*, *Corridors écologiques d'Ankarafantsika*, *Concessions carbone mangrove de Bombetoka*) ou import d'un **GeoJSON personnalisé**.
  - Définition des paramètres OGC : Workspace (`boeny_sig`, `dredd_boeny`), Datastore, Nom préfixé, Titre et SRS (`EPSG:4326`, `EPSG:3857`).
  - Éditeur de styles **SLD (Styled Layer Descriptor)** avec prévisualisation en temps réel (couleur, contour, opacité).
- **Affichage dynamique sur la carte** :
  - Mode **WFS Vectoriel** interactif avec infobulles et sélection attributaire.
  - Mode **WMS Tuilé OGC** pour les flux raster et orthophotos.
  - Contrôle d'opacité, centrage sur l'emprise (`BBOX`) et consultation des documents XML standard `GetCapabilities`.
  - Prise en charge de la connexion à des serveurs GeoServer externes.

### 4. Outils d'Analyse Spatiale & Décisionnels
- **Règle de mesure géodésique** : Calcul interactif des distances et des périmètres sur le terrain.
- **Moteur de recherche cartographique universel** : Localisation instantanée de districts, parcs, mangroves et cours d'eau.
- **Tableau de bord statistique** : Graphiques territoriaux, ratios de conservation et indicateurs clés.
- **Bilan environnemental territorial** : Synthèse d'évaluation globale téléchargeable.
- **Design d'exception « Frosted Glass »** : Interface épurée, moderne et translucide (verre dépoli, contrastes soignés, typographies lisibles).

---

## 🛠️ Stack Technique

- **Frontend** : [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool** : [Vite](https://vitejs.dev/)
- **Moteur Cartographique** : [Leaflet 1.9](https://leafletjs.com/)
- **Protocoles SIG & OGC** : WMS 1.3.0, WFS 2.0.0, Styled Layer Descriptor (SLD), GeoJSON
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Composants d'animation & Icônes** : [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/)
- **Backend Serveur** : [Express](https://expressjs.com/) (Node.js)

---

## 🚀 Installation et Lancement Local

### Prérequis
- [Node.js](https://nodejs.org/) version 18 ou supérieure
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)

### Étapes

1. **Cloner le dépôt ou récupérer le projet** :
   ```bash
   git clone <URL_DU_DEPOT>
   cd observatoire-boeny
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`.

4. **Compiler pour la production** :
   ```bash
   npm run build
   ```

5. **Démarrer en production** :
   ```bash
   npm run start
   ```

---

## 📂 Structure du Projet

```text
├── index.html                   # Point d'entrée HTML principal
├── metadata.json                # Métadonnées et permissions de l'application
├── package.json                 # Dépendances et scripts de build
├── tsconfig.json                # Configuration TypeScript
├── vite.config.ts               # Configuration Vite et Tailwind
├── src/
│   ├── App.tsx                  # Composant racine & gestion des états cartographiques
│   ├── main.tsx                 # Point de montage React
│   ├── index.css                # Styles globaux & configuration Tailwind CSS
│   ├── types.ts                 # Types TypeScript généraux (districts, couches, feux)
│   ├── types/
│   │   └── geoserver.ts         # Types et modèles de données OGC GeoServer (WMS/WFS/SLD)
│   ├── data/
│   │   ├── boenyData.ts         # Jeux de données territoriaux (Boeny, aires protégées, feux)
│   │   └── geoserverData.ts     # Données GeoServer, modèles SLD et capacités OGC
│   └── components/
│       ├── MapView.tsx          # Moteur cartographique Leaflet & couches OGC
│       ├── Navbar.tsx           # Barre de navigation, recherche et outils de mesure
│       ├── LayerControlPanel.tsx# Gestionnaire des couches SIG, thèmes et GeoServer
│       ├── GeoServerModal.tsx   # Interface de publication & gestionnaire OGC GeoServer
│       ├── Legend.tsx           # Légende cartographique dynamique
│       ├── StatsDrawer.tsx      # Tableau de bord analytique et indicateurs
│       ├── FeatureDetailModal.tsx # Inspecteur d'attributs de l'entité sélectionnée
│       └── EnvironmentalReportModal.tsx # Rapport environnemental régional
```

---

## 📤 Export et Synchronisation avec GitHub

Pour exporter ou synchroniser cette application avec votre compte GitHub depuis **Google AI Studio** :
1. Cliquez sur le menu déroulant en haut à droite de l'éditeur AI Studio.
2. Sélectionnez **« Export to GitHub »** (ou **« Download ZIP »**).
3. Choisissez le compte GitHub et le nom du dépôt souhaité, puis confirmez l'exportation.

Alternativement en ligne de commande locale :
```bash
git init
git add .
git commit -m "feat: Observatoire environnemental Région Boeny avec support GeoServer OGC"
git branch -M main
git remote add origin https://github.com/<votre-utilisateur>/<nom-du-repo>.git
git push -u origin main
```

---

## 📜 Licences et Sources de Données

- **Données cartographiques & parcs** : Madagascar National Parks (MNP), DREDD Boeny.
- **Détection des feux** : NASA FIRMS (Fire Information for Resource Management System).
- **Fonds cartographiques** : © Esri, © OpenStreetMap contributors, © CartoDB, OpenTopoMap.
- **Normes SIG** : Spécifications de l'Open Geospatial Consortium (OGC).
