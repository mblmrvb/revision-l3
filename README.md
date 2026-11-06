# Révisions L3 EIF — Paris-Dauphine

Site de révision personnel : cours (synthèse flash, cours détaillé, pièges, fiche mémo imprimable), QCM, flashcards à répétition espacée, exercices guidés pas à pas, banque d'annales (mode guidé et mode examen chronométré), progression, XP, séries et badges. Formules en KaTeX. Aide IA gratuite : le bouton « 💬 Demander à Claude » ouvre claude.ai avec la question déjà rédigée.

- Matière pilote : **Microéconomie** (chapitres 1 à 3, séances 1 à 5, exercices d'entraînement partie I, annales CC 2018 et 2019).
- Les autres matières apparaissent en « Contenu en préparation ». Leurs annales sont déjà repérées par `import-annales` (fiches « à traiter »).

---

## 1. Mettre le site en ligne (à faire une seule fois)

Prérequis : Node.js et Git sont installés (c'est déjà fait sur ton PC).

1. **Crée le dépôt sur GitHub.** Connecte-toi sur github.com (compte `mblmrvb`), clique sur **New repository**, nomme-le `revision-l3`, choisis **Public** (obligatoire pour GitHub Pages gratuit), ne coche rien d'autre, puis clique sur **Create repository**.
2. **Envoie le projet.** Ouvre un terminal dans le dossier du projet (`revision-l3`, dans ton dossier utilisateur) et tape, une ligne après l'autre :
   ```
   git init -b main
   git add .
   git commit -m "Premier envoi du site de révision"
   git remote add origin https://github.com/mblmrvb/revision-l3.git
   git push -u origin main
   ```
   À la première fois, une fenêtre GitHub s'ouvre pour te connecter : accepte.
3. **Active GitHub Pages.** Sur la page du dépôt : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
4. Attends 1 à 2 minutes (onglet **Actions**, la pastille devient verte ✅). Le site est en ligne à l'adresse :
   **https://mblmrvb.github.io/revision-l3/**
5. Sur ton téléphone, ouvre ce lien puis **Partager → Sur l'écran d'accueil** : le site s'ouvre comme une application.

> Le site est public mais n'est pas référencé par les moteurs de recherche (`noindex`). Aucun PDF de cours n'est publié : seul le contenu retravaillé de `content/` l'est. Le build échoue automatiquement si un fichier source ou un chemin personnel se glissait dans le site.

## 2. Mettre à jour le site

Après chaque modification (nouveau contenu, corrections), dans le dossier du projet :
```
git add .
git commit -m "Ajout de contenu"
git push
```
Le site se met à jour tout seul en 1 à 2 minutes.

Pour tester sur ton ordinateur avant d'envoyer : `npm run dev`, puis ouvre http://localhost:5173.

## 3. Relancer `import-annales` quand le Drive s'enrichit

1. Récupère la nouvelle version du dossier : soit le dossier synchronisé par Google Drive pour ordinateur, soit un **export zip** (sur drive.google.com : clic droit sur `L3_EIF_Dauphine` → Télécharger).
2. Si le chemin a changé, mets-le dans `config.local.json` (ce fichier reste sur ton PC et n'est jamais publié) :
   ```json
   { "drive": "C:\\Users\\<ton-nom>\\Downloads\\L3_EIF_Dauphine-....zip" }
   ```
   S'il y a plusieurs zips (`-001`, `-002`…), mets une liste : `{ "drive": ["...-001.zip", "...-002.zip"] }`.
   Sans ce fichier, le script cherche tout seul dans `G:\Mon Drive`, `G:\My Drive` et tes Téléchargements.
3. Lance :
   ```
   npm run import-annales
   ```
   (ou `npm run import-annales -- --dry-run` pour voir le résultat sans rien écrire).

Le script travaille **en lecture seule** sur le Drive. Il compare les empreintes (SHA-256) avec le dernier passage (enregistré dans `.local/`, non publié). Il crée une fiche « à traiter » par nouvelle annale **sans jamais écraser une fiche existante**, puis affiche un résumé : nouveaux fichiers, fichiers modifiés, fichiers non classés, fichiers Google natifs à exporter en PDF, fichiers illisibles ou disponibles seulement en ligne.

Le script **ne rédige pas** les annales. Pour transcrire une fiche « à traiter », demande à Claude : *« Transcris l'annale micro-cc-2023 à partir du Drive »*.

## 4. Sauvegarde et synchronisation ordi ↔ téléphone

Ta progression est enregistrée dans le navigateur de chaque appareil. Va dans **Réglages → Exporter ma progression**, envoie-toi le fichier, puis sur l'autre appareil **Importer → Fusionner**.

---

## 5. Format du contenu (pour ajouter des choses)

Tout le contenu est dans `content/`, séparé du code :

```
content/
  config.json                    matières, couleurs, examens (date AAAA-MM-JJ ou null, durée en minutes)
  <matiere>/
    chapitres/chN.md             un fichier par chapitre
    qcm.json                     liste de QCM
    flashcards.json              liste de flashcards
    exercices.json               exercices guidés
    annales/<id>.json            une annale par fichier
```

Formules : `$...$` dans le texte, `$$...$$` en bloc (syntaxe LaTeX). **Dans les fichiers JSON, chaque `\` s'écrit `\\`** (ex. `"$\\frac{1}{1+r}$"`).

### Chapitre (`chapitres/ch1.md`)
```markdown
---
id: micro-ch1
ordre: 1
titre: Ch. 1 — Titre du chapitre
seances: Séances 1 et 2
sources: Micro L3 chapitre 1.pdf ; diapo Séance 1 micro.pdf
---
# Synthèse flash
3 à 5 notions / formules clés.
# Cours
Cours détaillé. Citer la source : [Ch.1 p.3](src:)
# Pièges classiques
- ...
# Fiche mémo
Tableau récapitulatif (imprimable en A4).
```
Encadrés : `:::ajout` (badge « explication ajoutée »), `:::methode`, `:::attention`, `:::exemple` (exemple finance, considéré comme ajouté). Chaque encadré se ferme par `:::` seul sur une ligne.

### QCM (`qcm.json`)
```json
{ "id": "mq1-01", "chapitre": "micro-ch1", "question": "…", "choix": ["A", "B", "C", "D"],
  "bonnes": [0], "indice": "facultatif", "explication": "…", "source": "fichier, p. 3", "badge": "ajout" }
```
`bonnes` est une liste : plusieurs bonnes réponses sont possibles.

### Flashcard (`flashcards.json`)
```json
{ "id": "mf1-01", "chapitre": "micro-ch1", "recto": "…", "verso": "…", "source": "fichier, p. 2" }
```

### Exercice guidé (`exercices.json`)
```json
{ "id": "micro-ex-s2", "chapitre": "micro-ch1", "titre": "…", "enonce": "…", "source": "…",
  "quoi": "Ce qu'on cherche / pourquoi / comment",
  "etapes": [
    { "id": "e1", "type": "nombre", "consigne": "…", "reponse": 0.1, "tolerance": 0.01,
      "indices": ["indice 1", "indice 2"], "reexplication": "…", "correction": "…" }
  ] }
```
Types d'étape :
- `nombre` : réponse numérique, tolérance relative facultative. On peut taper `0,25`, `1/4` ou `25 %`.
- `choix` : champs `choix` et `bonne` (index de la bonne réponse).
- `auto` : réponse rédigée, auto-évaluée après la correction.

La correction n'est jamais affichée avant une tentative ou avant d'avoir épuisé tous les indices.

### Annale (`annales/<id>.json`)
```json
{ "id": "micro-cc-2018", "matiere": "micro", "annee": "2018-2019", "type": "CC", "titre": "…",
  "dureeMin": 120, "corrige": "officiel | propose | aucun", "horsProgramme": false,
  "statut": "pret | a-traiter", "chapitres": ["micro-ch1"], "sources": ["…"],
  "incertitudes": ["points douteux de transcription ou de corrigé"],
  "exercices": [ { "titre": "…", "points": 7, "chapitres": ["micro-ch3"], "enonce": "…",
                   "etapes": [ { "...": "même format que les exercices, + points et notion" } ] } ] }
```
- `corrige: "propose"` affiche le badge « corrigé proposé, non officiel » ; liste alors les points d'incertitude dans `incertitudes`.
- Les `chapitres` alimentent la rubrique « notions les plus tombées » et la révision du jour.

### Vérifications automatiques
- `npm run check-content` : JSON valide, identifiants uniques, chapitres existants, bonnes réponses cohérentes.
- `npm run build` : contenu, typage, construction du site, puis contrôle qu'aucun fichier source ni chemin personnel n'est publié.
