# Mon CV
## Installation
### Prérequis
* NodeJS V12+
* NPM V7+
* Vite V2+

**Installer vite :**
```shell
sudo npm i -g vite
```
### Utilisation

#### Development
Le mode developer lancera un automatiquement serveur sur le port 3000. 
Il permet d'editer le code ts et scss sans le compiler préalablement, il permet aussi de mettre automatiquement 
à jour la page si une modification s'opère.

Voici la commande de lancement :
```shell
npm run dev
```

#### Compilation
Le mode compilation permettra de fusionner et compresser dans le dossier distrib :
* les fichiers sass en un fichier css
* tous les fichiers ts en un fichier js
* toutes les images (jpeg,png,bitmap) en webm

Voici la commande de lancement :
```shell
npm run build
```

#### Production
Le mode production permet de lancer un serveur sur le port 5000. 
Il utilisera la compilation du code pour rendre des pages plus légère.
Voici la commande de lancement :

```shell
npm run serve
```
Pour finaliser une configuration de production, il faut ajouter un reverse proxy nginx pointant vers le port local du serveur.
Voici la configuration nginx à ajouter :
```nginx
#configuration de la redirection
upstream webserver{
    server localhost:5000; #localhost ou autre si votre serveur nginx n'est pas sur la même machine que l'app
}

#redirection du http vers https
server{
    listen 80;
    server_name votre-dns.fr;
    return 301 https://$host$request_uri;
}

#configuration du serveur sur le https
server{
    listen 443 ssl;
    server_name votre-dns.fr;
    
    #renvoie tous les path possible a l'app
    location / {
            include proxy_params;
            proxy_pass http://webserver;
    }

    ssl_certificate /fullchain.pem; # La cles public de votre certificat ssl
    ssl_certificate_key /privkey.pem; # La cles prive de votre certificat ssl
}
```
