import {getLikedElementFromLink} from "./utils/scrollUtils";

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
    let sections: Element[] = [];
    for (const navLink of navLinks) {
        sections.push(getLikedElementFromLink(navLink))
    }
    window.onscroll = function () {
        let current='';
        for (const section of sections) {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.clientHeight;
            //console.log(`Windows : ${window.scrollY} ${section.getAttribute("id")} : top${sectionTop} height${sectionHeight}`)
            if (window.scrollY >= (sectionTop - sectionHeight / 5)){
                const id = section.getAttribute('id')
                if (id!==null) current = id
            }
        }
        for (const navLink of navLinks) {
            if (navLink.getAttribute("href")?.substr(1,current.length)===current){
                navLink.classList.add('active');
            }else{
                navLink.classList.remove('active');
            }
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