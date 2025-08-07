# Ready to Fly ✈️

Une application web moderne conçue pour les stewards et hôtesses de l'air pour enregistrer leurs vols, suivre leurs voyages à venir et analyser leurs statistiques.

## 🎨 Nouveau Design

L'application a été entièrement redéfinie avec :

- **Design moderne** : Interface utilisateur élégante avec shadcn/ui
- **Animations fluides** : Animations avec Framer Motion
- **Responsive** : Compatible avec tous les appareils
- **Accessibilité** : Conforme aux standards d'accessibilité
- **Performance** : Optimisé pour des performances rapides

## ✨ Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée avec email et mot de passe
- Interface moderne avec animations
- Gestion des sessions utilisateur

### 📊 Dashboard
- Statistiques en temps réel
- Graphiques interactifs
- Cartes de statistiques animées
- Vue d'ensemble des vols

### ✈️ Gestion des Vols
- Ajout de nouveaux vols
- Modification des vols existants
- Suppression de vols
- Filtrage et recherche avancée

### 📈 Statistiques
- Analyse des données de vol
- Graphiques mensuels
- Statistiques personnalisées
- Export de données

## 🛠️ Technologies

### Frontend
- **Next.js 15** - Framework React moderne
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI modernes
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes modernes
- **Chart.js** - Graphiques interactifs

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Sequelize** - ORM pour base de données
- **TypeScript** - Typage statique

### Base de Données
- **Base de données relationnelle** - Stockage des données

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd ready-to-fly
```

2. **Installer les dépendances**
```bash
# Frontend
cd ready-to-fly
npm install

# Backend
cd ../server
npm install
```

3. **Configuration**
```bash
# Copier les fichiers d'environnement
cp .env.example .env
```

4. **Lancer l'application**
```bash
# Frontend (dans le dossier ready-to-fly)
npm run dev

# Backend (dans le dossier server)
npm run dev
```

## 🎯 Composants UI

L'application utilise des composants modernes et réutilisables :

- **Button** - Boutons avec variantes et animations
- **Card** - Cartes avec ombres et animations
- **Input** - Champs de saisie stylisés
- **Modal** - Modales avec animations
- **Toast** - Notifications toast
- **Table** - Tableaux avec tri et pagination
- **Pagination** - Navigation entre pages
- **Search** - Recherche avec suggestions
- **Filter** - Filtres avancés
- **StatsCard** - Cartes de statistiques
- **Loading** - Indicateurs de chargement

## 🎨 Design System

### Couleurs
- **Primaire** : Bleu (#3B82F6)
- **Secondaire** : Rose (#EC4899)
- **Succès** : Vert (#10B981)
- **Erreur** : Rouge (#EF4444)
- **Avertissement** : Jaune (#F59E0B)

### Typographie
- **Police principale** : Inter
- **Tailles** : xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **Poids** : normal, medium, semibold, bold

### Animations
- **Durée** : 200ms, 300ms, 500ms
- **Easing** : ease-out, ease-in-out
- **Types** : fade, slide, scale, rotate

## 📱 Responsive Design

L'application est entièrement responsive avec :
- **Mobile First** : Design optimisé pour mobile
- **Breakpoints** : sm, md, lg, xl, 2xl
- **Navigation** : Menu adaptatif
- **Tableaux** : Scroll horizontal sur mobile

## 🔧 Configuration

### Variables d'environnement

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
PORT=3001
```

## 📊 Structure du Projet

```
ready-to-fly/
├── src/
│   ├── components/
│   │   ├── ui/           # Composants UI modernes
│   │   ├── modals/       # Modales
│   │   └── ...
│   ├── pages/            # Pages de l'application
│   ├── services/         # Services API
│   ├── models/           # Modèles TypeScript
│   ├── interfaces/       # Interfaces TypeScript
│   ├── styles/           # Styles globaux
│   └── lib/              # Utilitaires
├── public/               # Assets statiques
└── ...
```

## 🎯 Roadmap

- [ ] Mode sombre
- [ ] Notifications push
- [ ] Export PDF
- [ ] Intégration calendrier
- [ ] Application mobile
- [ ] API publique
- [ ] Analytics avancés

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développeur** : Antony Loussararian
- **Design** : Interface moderne avec shadcn/ui
- **Animations** : Framer Motion

---

**Ready to Fly** - Prêt à décoller vers de nouveaux horizons ! ✈️
