
window.addEventListener('load', ()=>{
    const navLinks: HTMLCollectionOf<Element> = document.getElementsByClassName("nav-link");
    for (const navLink of navLinks) {
        navLink.addEventListener('click', () => {
            navLinkEvent(navLink, navLinks)
        })
    }
});

function navLinkEvent(navLink :Element, navLinks: HTMLCollectionOf<Element>):void{
    for (const navLinkElement of navLinks) {
        if (navLink===navLinkElement){
            navLink.classList.add('active')
        }else {
            navLinkElement.classList.remove('active')
        }
    }
}