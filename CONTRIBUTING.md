# Guide de contribution

## Workflow Git

1. Créer une branche depuis `main` :
   ```bash
   git checkout -b feat/nom-de-la-fonctionnalite
   ```

2. Faire ses modifications, puis committer :
   ```bash
   git add .
   git commit -m "feat: description courte"
   ```

3. Pousser et ouvrir une Pull Request vers `main`

4. La CI (GitHub Actions) vérifie automatiquement le lint et le build

5. Après validation, merger dans `main` → déploiement automatique

---

## Convention de commits

| Prefix | Usage |
|---|---|
| `feat:` | Nouvelle fonctionnalite |
| `fix:` | Correction de bug |
| `content:` | Modification de texte ou données JSON |
| `style:` | Modification de styles CSS |
| `refactor:` | Refactoring sans changement de comportement |
| `docs:` | Documentation uniquement |

---

## Modifier uniquement le contenu

Pour ajouter des offres ou modifier des textes, éditer les fichiers dans `public/data/` directement sur GitHub — aucun merge request requis si vous avez les droits d'écriture sur `main`.

---

## Environnement local

```bash
node --version   # >= 18 requis
npm install
npm run dev      # http://localhost:5173
npm run lint     # vérifier avant de committer
npm run build    # vérifier que le build passe
```

---

## Contacts

- Repo : https://github.com/Ralialahlou/aksal-careers
- RH : careers@groupeaksal.com
