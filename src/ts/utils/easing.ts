// Fonction de transition entre [0,1] : easeInOutCubic
// Récupérer ici : https://gist.github.com/gre/1650294
export function easing(t: number): number {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}