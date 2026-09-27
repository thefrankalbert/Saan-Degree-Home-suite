# Sãan Degree · Smart TV Conciergerie & Hospitality Kiosk

> **Système d'affichage d'accueil Smart TV et conciergerie digitale pour résidences de haut standing Sãan Degree à Ouaga 2000, Ouagadougou.**

---

## 🌟 Présentation

Ce projet fournit une solution complète de **kiosque d'accueil Smart TV** pour résidences hôtelières et appartements meublés de luxe. Conçu pour éliminer le besoin de livrets d'accueil papier, il offre aux voyageurs une expérience digne des plus grands palaces dès leur entrée dans l'appartement.

### Points Clés
- 📺 **Affichage TV 100% Adapté (Zero-Clipping) :** Interface optimisée pour écrans 1080p et 4K, sans débordement vertical, sans scrollbar indésirable, et sans bouton d'administration visible par les clients.
- ⚡ **Synchronisation Instantanée en Direct (SSE) :** Dès qu'un hôte met à jour le nom du voyageur ou les codes dans le tableau de bord (sur smartphone ou PC), la télévision s'actualise en moins d'une seconde partout dans le monde.
- 📶 **Connexion Wi-Fi Directe par QR Code :** Génération automatique d'un QR code Wi-Fi conforme (`WIFI:S:...;T:WPA;P:...;;`) permettant aux clients de se connecter au réseau fibre en un scan, sans saisie de mot de passe.
- 🎮 **Contrôle à la Télécommande :** Navigation fluide au clavier ou à la télécommande Smart TV (flèches `◀` `▶`, `OK`, ou touches numériques `[1]` à `[5]`).
- 📱 **Livret d'Accueil Mobile Déporté :** Un deuxième QR code permet au voyageur d'embarquer l'intégralité du guide de l'appartement (climatisation, digicode, contacts d'urgence) sur son smartphone.
- 🌍 **Bilingue Français / Anglais :** Bascule instantanée de toute l'interface.

---

## 🏛️ Architecture Technique

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│        Tableau de Bord Hôte     │       │       Télévision Smart TV       │
│  (Mobile, Tablette, Ordinateur) │       │   (Navigateur TV 1080p / 4K)    │
└────────────────┬────────────────┘       └────────────────▲────────────────┘
                 │                                         │
                 │ POST /api/properties                    │ SSE Stream
                 ▼                                         │ GET /api/properties/stream
┌──────────────────────────────────────────────────────────┴────────────────┐
│                           Serveur Node / Express                          │
│                      (properties-data.json persistant)                    │
└───────────────────────────────────────────────────────────────────────────┘
```

- **Frontend :** React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons, Vite.
- **Backend & Temps Réel :** Node.js, Express, Server-Sent Events (SSE) avec fallback automatique (polling 4s si navigateur TV ancien).
- **Persistance :** Fichier `properties-data.json` géré côté serveur avec mise en cache locale de secours (`localStorage`).

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- **Node.js** >= 18.0.0
- **npm** ou **yarn** / **pnpm**

### 2. Installation
```bash
git clone https://github.com/<votre-organisation>/saan-degree-smart-tv.git
cd saan-degree-smart-tv
npm install
```

### 3. Lancement en Développement
```bash
npm run dev
```
L'application démarre sur `http://localhost:3000`.

### 4. Build de Production & Démarrage
```bash
npm run build
npm start
```

---

## 📋 Vues & Navigation

| Route / Paramètre | Description |
| :--- | :--- |
| `/?view=tv` ou `/kiosk` | Mode Kiosque Smart TV plein écran (Accueil, Wi-Fi, Équipements, Recommandations, Urgences). |
| `/?view=admin` | Tableau de bord de gestion pour l'hôte (modification des textes d'accueil, noms des voyageurs, Wi-Fi, etc.). |
| `/?view=guest` | Vue mobile pour le voyageur (accessible après scan du QR code de conciergerie). |

### Raccourcis Télécommande TV
- **Flèches Gauche / Droite (`◀` / `▶`)** : Changement d'onglet.
- **Touches 1 à 5** : Accès direct aux rubriques :
  - `[1]` Bienvenue & Accès Wi-Fi
  - `[2]` Guide des Équipements
  - `[3]` Bonnes Adresses Ouaga 2000
  - `[4]` Conciergerie & Contacts
  - `[5]` Formalités de Départ
- **Touche `F`** : Bascule plein écran.

---

## 🛡️ Sécurité & Bonnes Pratiques

- **Aucun secret exposé :** Les variables sensibles sont isolées dans `.env` (modèle `.env.example`).
- **Mode Standalone / TV Sécurisé :** Les accès administrateur sont découplés de l'affichage TV pour éviter toute manipulation accidentelle par les clients.
- **Vérification du code :** 
  ```bash
  npm run lint   # Vérification TypeScript sans émission d'erreurs
  npm run build  # Validation du packaging de production
  ```

---

## 🏢 Résidence Concernée
- **Propriété :** Sãan Degree · Genesis
- **Localisation :** Avenue Pascal Zagré, Secteur 15, Ouaga 2000, Ouagadougou, Burkina Faso
- **Services :** Gardiennage 24h/24, Fibre Optique Haut Débit, Climatisation inverter, Énergie de secours.

---

## 📄 Licence
Projet privé et propriétaire · Tous droits réservés **Sãan Degree** © 2026.
