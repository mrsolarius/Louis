/**
 * Ce fichier permet de crée une animation de scroll entre un lien et une ancre
 */
import {easing} from "./utils/easing";
import {getElementY, getLikedElementFromLink} from "./utils/scrollUtils";

// Initialisation de nos boutons - crée un event listener sur le cliques de tous elements ayant pour class anchor-link
window.addEventListener("load", ()=>{
    const anchorLinks: HTMLCollectionOf<Element> = document.getElementsByClassName("anchor-link");
    for (let anchorLink of anchorLinks) {
        anchorLink.addEventListener('click', () => {
            anchorLinkEvent(anchorLink)
        })
    }
});

// Lancement de animation vers la cible -  Utilise le href de l'element actuel l'utilise comme id afin de lancer l'animation vers l'element cible
// Cette fonction doit être appeler depuis un eventListener l'element doit aussi disposer être le lien d'une ancre
function anchorLinkEvent(e: Element) {
    // Ici le this represent l'attribue cliquer
    const target = getLikedElementFromLink(e)
    scrollToTarget(target, 1000);
}

// Génération de notre animation de scroll - Prend en parameter la duree et calcule la diférense entre le
function scrollToTarget(element: Element, duration: number) {
    if (isNaN(duration)) throw new TypeError("Duration need to be a number")
    const startingY: number = window.scrollY;
    const targetY: number = getElementY(element)
    const diff: number = targetY - startingY
    let start: number;

    // Amorçage de l'animation - la fonction sera appelé juste avant le rendu de la prochaine image
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        // Millisecondes écoulées depuis le début du scroll
        let time: number = timestamp - start;
        // Récupération du pourcentage d'avancement de l'animation entre [0, 1]
        let percent: number = Math.min(time / duration, 1);

        percent = easing(percent);

        window.scrollTo(0, startingY + diff * percent);

        // Appel recursif de l'animation aussi longtemps que nécésaire
        if (time < duration) {
            window.requestAnimationFrame(step);
        }
    })
}