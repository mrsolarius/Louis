import {getElementY} from "./utils/scrollUtils";

window.addEventListener('load', ()=>{
    const navLinks: HTMLCollectionOf<Element> = document.getElementsByClassName("nav-link");
    const navToogleBtns: HTMLCollectionOf<Element> = document.getElementsByClassName("button-nav-menu")
    for (const navLink of navLinks) {
        navLink.addEventListener('click', () => {
            navLinkEvent(navLink, navLinks)
        })
    }
    for (const navToogleBtn of navToogleBtns) {
        navToogleBtn.addEventListener('click',()=>{
            responsiveNavMenu(navToogleBtn)
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

function responsiveNavMenu(button: Element){
    const navBar = document.getElementsByClassName("sections-nav-container")[0]
    button.classList.toggle('button-open');
    navBar.classList.toggle('nav-open');
}