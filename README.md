# WEBPACK V5 configuration pour REACT

## 1. Gestionnaire de dépendances
Utilisation du gestionnaire de dépendance `npm`. 

Allez dans le fichier et initialisez le gestionnaire de packages.

``npm init -y``

`-y`signifie "oui" à toutes les questions générales de développement posées sur la ligne de commande.

## 2. Installation de React

```npm i react react-dom```

Vos dépendances dans le fichier `package.json` auront désormais les éléments suivants :

```
"dependencies": {
    "react": "^18.1.0",
    "react-dom": "^18.1.0"
  }
```
## 3. Installation des dépendances de développement et des chargeurs

```
npm i -D @babel/core @babel/preset-env @babel/preset-react babel-loader file-loader css-loader style-loader webpack webpack-cli html-webpack-plugin cross-env
```

Vos dépendances pour le développement dans le fichier `package.json` auront désormais les éléments suivants :

```
"devDependencies": {
    "@babel/core": "^7.18.2",
    "@babel/preset-env": "^7.18.2",
    "@babel/preset-react": "^7.17.12",
    "babel-loader": "^8.2.5",
    "cross-env": "^7.0.3",
    "css-loader": "^6.7.1",
    "file-loader": "^6.2.0",
    "style-loader": "^3.3.1",
    "html-webpack-plugin": "^5.5.0",
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.9.0"
  }
```
## 4. Configuration de Webpack avec Babel

```
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
    },
    devServer: {
        port: 3000,
        hot: true,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /nodeModules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.jsx', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
    ],
}
```
Comprendre webpack.config.js :

1. `mode` option de configuration indique à Webpack d'utiliser ses optimisations intégrées en conséquence.


2. `entry` point d'entré de l'application.


3. Dans `output` nous mentionnons où les fichiers doivent être envoyés une fois qu'ils sont regroupés.
    - `path` mentionne le nom du répertoire à créer où seront stockés tous les fichiers groupés. Nous avons nommé notre dossier dist, ce qui est une pratique courante.
    - Et `filename` est le nom que nous avons défini pour le nouveau fichier groupé qui sera créé après l'exécution de Webpack, c'est magique (regroupe essentiellement tout le code js dans un seul fichier).


4. `devServer` est utilisé pour développer rapidement une application, contrairement au mode production, qui prend un peu plus de temps pour construire l'application puisqu'il minimise le fichier, ce qui n'arrive pas en mode développement
    - Avec `port` nous pouvons définir un numéro de port de notre choix. Je l'ai mis à 3000.
    - `hot` déclenche un rechargement complet de la page lorsque des modifications sont apportées à n'importe quel fichier. Il est désactivé par défaut.


5. `module` est l'endroit où vous transmettez les règles de regroupement des fichiers.
    - `test` C'est là que nous mentionnons l'extension de fichier qui doit être ciblée par le chargeur spécifique. Tous les fichiers `.js` ou `.jsx` doivent être regroupés par le chargeur babel.
    - `exclude` C'est là que nous mentionnons les fichiers qui doivent être ignorés par le bundler.
    - Il en va de même pour les fichiers `css`. Il est important de noter que le tableau `use:['style-loader', 'css-loader']` doit être écrit dans cet ordre exact.


6. Enfin, nous ajoutons un plugin appelé `HtmlWebpackPlugin` qui garantit que le webpack sait quel modèle de fichier html suivre pour exécuter l'application.


**package.json** :

```
"scripts": {
    "serve": "webpack serve",
    "build": "cross-env NODE_ENV=production webpack"
  }
```
Lancer l'application en mode développement

`npm run serve`

Lancer un build avec les fichiers minifier

`npm run build`

##5. Optimisations

Des plugins comme `MiniCssExtractPlugin` peuvent aider à séparer et à réduire les fichiers CSS et à les intégrer sous forme de lien dans le fichier HTML

`npm install --save-dev mini-css-extract-plugin`

**Modification de la config webpack** : 

D'abord `require` dans votre webpack.config.js et remplacez le chargeur `style-loader` par `MiniCssExtractPlugin` et ajoutez-le également dans le plugin.

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); <- require

module.exports = {
   ...,
   module: {
      rules: [
         ...,
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'] <- update loader
         }
      ],
   },
   ...,
   plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new MiniCssExtractPlugin() <- add plugin
   ],
}
```
##6. React Fast Refresh

Cette nouvelle fonctionnalité que j'ai expérimentée est React Fast Refresh. Il s'agit de la dernière itération du rechargement à chaud de React. Lors de la modification d'un composant React, React Fast Refresh ne mettra à jour et restituera efficacement que ce composant. Cela conduit à des temps de rechargement à chaud nettement plus rapides. De plus, React Fast Refresh conservera l'état des composants pendant les re-rendus afin que vous n'ayez pas besoin de recréer manuellement le même scénario. Ces re-rendus "rapides" et indolores créent une expérience de développeur supérieure, rendant la boucle de rétroaction entre le changement et le résultat beaucoup plus efficace.

`npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh`

**Création du fichier de configuration de babel** :

```
module.exports = function babel(api) {
   const BABEL_ENV = api.env();
   const presets = [
      "@babel/preset-env",
      "@babel/preset-react"
   ];
   const plugins = [];
   if (BABEL_ENV === 'development') {
       plugins.push('react-refresh/babel');
   }
   return {
       presets,
       plugins,
   };
};
```

**Modification de la configuration webpack** :

```
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
module.exports = {
   ...,
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: 'babel-loader',
         },
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
         }
      ],
   },
   plugins: [
      new HtmlWebpackPlugin({
      template: "./public/index.html"
      }),
      new MiniCssExtractPlugin(),
      new ReactRefreshWebpackPlugin(), <- add the react-refresh-webpack-plugin plugin to the Webpack configuration file.
   ],
}
```