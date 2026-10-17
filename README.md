# Garage Nova — Excellence Edition

Site vitrine de démonstration public : https://schreckevan-beep.github.io/garage-nova/

Cette branche contient le bundle statique publié. Les ressources sont placées à la racine pour permettre un import groupé via l’interface GitHub. Le rendu et les interactions sont identiques à la version modulaire.

## Sources et personnalisation

Le fichier `garage-nova-excellence.zip` contient les sources complètes organisées, les photographies et leurs crédits, les polices et leurs licences, le guide de personnalisation et le rapport de contrôle.

1. Extraire l’archive, puis ouvrir le dossier `garage-nova`.
2. Modifier `content/site.json` et, si nécessaire, `src/index.template.html`, `styles.css` et `app.js`.
3. Exécuter `node tools/build.mjs`, puis `node tools/check.mjs`.
4. Prévisualiser avec `node tools/serve.mjs`.
5. Pour reproduire ce bundle de publication : `node tools/export-flat.mjs ../publication`.

GitHub Pages sert les fichiers de la racine. Aucun framework, abonnement ni service d’envoi n’est requis.

Garage Nova est fictif. Les photos sont illustratives ; les coordonnées sont des exemples. Le formulaire prépare un brouillon copiable et un lien email, sans envoyer de message ni réserver de créneau. Les informations légales doivent être complétées avant un usage réel. Aucun score Lighthouse n’est annoncé.
