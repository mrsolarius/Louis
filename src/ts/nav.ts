import {getElementY} from "./utils/scrollUtils";

window.addEventListener('load', ()=>{
    const navLinks: HTMLCollectionOf<Element> = document.getElementsByClassName("nav-link");
    for (const navLink of navLinks) {
        navLink.addEventListener('click', () => {
            navLinkEvent(navLink, navLinks)
        })
    }
    initAutoActive(navLinks)
});

function initAutoActive(navLinks: HTMLCollectionOf<Element>){
    window.onscroll = function () {
        for (const navLink of navLinks) {
            // @ts-ignore
            console.log(`Windows : ${window.scrollY} ${navLink}: ${getElementY(navLink)}`)
        }
    };
}

function navLinkEvent(navLink :Element, navLinks: HTMLCollectionOf<Element>):void{
    for (const navLinkElement of navLinks) {
        if (navLink===navLinkElement){
            navLink.classList.add('active')
        }else {
            navLinkElement.classList.remove('active')
        }
    }
}