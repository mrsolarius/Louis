// Initialisation de nos boutons - crée un event listener sur le cliques de tous elements ayant pour class anchor-link
function init(){
    const anchorLinks = document.getElementsByClassName("anchor-link");
    Array.from(anchorLinks).forEach(function(element) {
        element.addEventListener('click', anchorLinkEvent);
    });
}
window.addEventListener("load",init);

// Lancement de animation vers la cible -  Utilise le href de l'element actuel l'utilise comme id afin de lancer l'animation vers l'element cible
// Cette fonction doit être appeler depuis un eventListener l'element doit aussi disposer être le lien d'une ancre
function anchorLinkEvent() {
    // Ici le this represente l'attribue cliquer
    const href = this.getAttribute("href")
    if (!href.startsWith('#')) throw new Error("This link does not refer to an anchor")
    const target = document.querySelector(href)
    if (!target) throw new Error(href+" does not refer to an existing anchor")
    scrollToTarget(target, 1000);
}

// Génération de notre animation de scroll - Prend en parameter la duree et calcule la diférense entre le
function scrollToTarget(element, duration) {
    if (isNaN(duration)) throw new TypeError("Duration need to be a number")
    const startingY = window.pageYOffset;
    const targetY = getElementY(element)
    const diff = targetY - startingY
    let start;

    // Amorçage de l'animation - la fonction sera appelé juste avant le rendu de la prochaine image
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        // Millisecondes écoulées depuis le début du scroll
        let time = timestamp - start;
        // Récupération du pourcentage d'avancement de l'animation entre [0, 1]
        let percent = Math.min(time / duration, 1);

        percent = easing(percent);

        window.scrollTo(0, startingY + diff * percent);

        // Appel recursif de l'animation aussi longtemps que nécésaire
        if (time < duration) {
            window.requestAnimationFrame(step);
        }
    })
}

// Récupération de la position Y - Renvoie la positon y relative à la position du curseur sur la page
function getElementY(element) {
    return window.pageYOffset + element.getBoundingClientRect().top
}

// Fonction de transition entre [0,1] : easeInOutCubic
// Récupérer ici : https://gist.github.com/gre/1650294
function easing(t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }