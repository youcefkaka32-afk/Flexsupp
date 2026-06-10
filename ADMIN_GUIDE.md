# Guide du panneau d'administration

## Accès

1. Accédez à `/admin` dans votre navigateur (par exemple : `http://localhost:5173/admin`)
2. Entrez le code PIN : **1234** (par défaut)
3. Vous êtes connecté jusqu'à ce que vous fermiez la session

## Changer le code PIN

Pour modifier le code PIN, ouvrez le fichier :
```
src/pages/AdminPage.jsx
```

Modifiez la ligne 7 :
```javascript
const ADMIN_PIN = '1234'  // Changez cette valeur
```

## Fonctionnalités

### 1. Gestion des Produits
- ✅ Ajouter de nouveaux produits
- ✅ Modifier le nom, marque, catégorie, prix
- ✅ Basculer disponibilité (En stock / Épuisé)
- ✅ Marquer comme produit vedette (Featured)
- ✅ Supprimer des produits

### 2. Gestion des Catégories
- ✅ Créer de nouvelles catégories
- ✅ Modifier ID et nom
- ✅ Supprimer des catégories

### 3. Gestion des Marques
- ✅ Ajouter des marques
- ✅ Modifier nom et logo (URL)
- ✅ Supprimer des marques

### 4. Codes Promo
- ✅ Créer des codes promotionnels
- ✅ Définir réduction en pourcentage ou montant fixe
- ✅ Activer/désactiver les codes
- ✅ Supprimer les codes expirés

## Sauvegarder les données

### Télécharger le fichier JSON
1. Cliquez sur **💾 Télécharger JSON** dans l'en-tête
2. Un fichier `flexsupps-data-YYYY-MM-DD.json` sera téléchargé
3. Gardez ce fichier en sécurité comme sauvegarde

### Importer un fichier JSON
1. Cliquez sur **📤 Importer JSON**
2. Sélectionnez le fichier JSON précédemment téléchargé
3. Les données seront immédiatement chargées dans l'interface

### Mettre à jour le site avec les nouvelles données
Pour que les changements apparaissent sur le site en production :

1. Téléchargez le fichier JSON depuis l'admin
2. Remplacez le fichier dans votre projet :
   ```
   public/data/products.json
   ```
3. Déployez le site mis à jour

## Workflow recommandé

1. **Avant de faire des changements importants** : Téléchargez le JSON comme sauvegarde
2. **Modifiez** les produits, catégories, etc.
3. **Téléchargez** le nouveau JSON
4. **Remplacez** `public/data/products.json` avec le nouveau fichier
5. **Redéployez** votre site

## Sécurité

⚠️ **Important** :
- Changez le code PIN par défaut avant la mise en production
- Ne partagez pas le code PIN
- La session reste active jusqu'à la fermeture du navigateur
- Le panneau d'administration ne nécessite pas de backend

## Notes techniques

- Les données sont gérées côté client uniquement
- Aucune API backend n'est nécessaire
- Les modifications sont prévisualisées en temps réel
- Le fichier JSON peut être édité manuellement si nécessaire
- Format de stockage : JSON standard, lisible et éditable

## Structure des données

```json
{
  "products": [...],     // Liste des produits
  "categories": [...],   // Catégories de produits
  "brands": [...],       // Marques disponibles
  "promoCodes": [...]    // Codes promotionnels
}
```

Chaque objet suit un schéma cohérent défini dans `public/data/products.json`.
