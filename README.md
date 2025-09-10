# Application React Liste de courses

Une application simple de gestion de liste de courses avec authentification et connexion à une API REST.

## Fonctionnalités

- **Authentification** : Page de login avec stockage en localStorage
- **Gestion des items** : Ajouter, modifier, supprimer des items de la liste
- **Interface responsive** : Design moderne avec Tailwind CSS
- **Gestion d'état** : React Query pour les appels API et le cache
- **Environnements** : Support des environnements preprod et prod

## Technologies utilisées

- React 18 + TypeScript
- Vite (build et dev server)
- React Router (navigation)
- React Query (gestion des données)
- Tailwind CSS (styles)
- Lucide React (icônes)

## Installation et lancement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer l'environnement** (optionnel) :
   Modifiez le fichier `.env` pour changer l'environnement :
   ```
   ENVIRONMENT=preprod  # ou prod
   ```

3. **Lancer l'application** :
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur** :
   L'application sera accessible à l'adresse affichée dans le terminal (généralement http://localhost:5173)

## Utilisation

### Connexion
- Accédez à l'application
- Saisissez n'importe quel email (le mot de passe n'est pas vérifié)
- Cliquez sur "Se connecter"

### Gestion de la liste
- **Ajouter un item** : Utilisez le formulaire en haut de la page
- **Modifier un item** : Cliquez sur l'icône crayon, modifiez les champs, puis validez
- **Supprimer un item** : Cliquez sur l'icône poubelle et confirmez
- **Se déconnecter** : Cliquez sur le bouton "Se déconnecter" dans l'en-tête

## Configuration des environnements

L'application se connecte à différentes API selon l'environnement :

- **preprod** : `https://shoplist-api-preprod.cyrilmarchive.com`
- **prod** : `https://shoplist-api.cyrilmarchive.com`

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ItemForm.tsx    # Formulaire d'ajout d'item
│   ├── ItemRow.tsx     # Ligne d'item dans le tableau
│   └── ProtectedRoute.tsx # Route protégée
├── pages/              # Pages de l'application
│   ├── LoginPage.tsx   # Page de connexion
│   └── ListPage.tsx    # Page principale avec la liste
├── hooks/              # Hooks personnalisés
│   └── useAuth.ts      # Gestion de l'authentification
├── lib/                # Utilitaires
│   ├── apiBaseUrl.ts   # Configuration de l'URL de l'API
│   └── queryClient.ts  # Configuration React Query
├── services/           # Services API
│   └── items.ts        # Service pour les items
├── types/              # Types TypeScript
│   └── item.ts         # Types pour les items
├── App.tsx             # Composant principal
└── main.tsx           # Point d'entrée
```

## API

L'application utilise les endpoints suivants :

- `GET /items` - Récupérer la liste des items
- `POST /items` - Ajouter un item
- `PATCH /items/{id}` - Modifier un item
- `DELETE /items/{id}` - Supprimer un item

## Build pour la production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.