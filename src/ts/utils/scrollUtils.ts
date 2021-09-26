// Récupération de la position Y - Renvoie la positon y relative à la position du curseur sur la page
export function getElementY(element: Element): number {
    return window.scrollY + element.getBoundingClientRect().top
}

export function getLikedElementFromLink(e:Element){
    const href = e.getAttribute("href")
    if (href === null) throw new Error("href can't be null")
    if (!href.startsWith('#')) throw new Error("This link does not refer to an anchor")
    const target = document.querySelector(href)
    if (!target) throw new Error(href + " does not refer to an existing anchor")
    return target;
}