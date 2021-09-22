/**
 * Cette classe à pour role de crée un nouvelle element html tabs-groupe
 * Cette element permet à partir d'une shadows structure conçu pour le referancement de concevoir une autre structure
 * moins optimiser pour le moteur de recherche mais plus interactive.
 *
 * Ici on vas transformer une structure `hX article` en `div>ul>li>button article` de façon à permettre une
 * navigation tabulaire entre les différent articles.
 */
class TabsGroup extends HTMLElement {
    constructor() {
        super();

        this.state = {
            activeTabIndex: -1,
            maxIndex: 0
        };

        // Stokage des triggers et des articles
        this.triggers = [];
        this.articles = [];
    }

    async connectedCallback() {
        this.initialTriggers = [...this.querySelectorAll('[data-element="trigger"]')];
        this.initialArticles = [...this.querySelectorAll('[data-element="article"]')];

        // Lancement du rendu pour transformer les element html
        await this.render();
    }

    // Generation des nouveau composant html en rendu dans le shadow root
    render = async () => {
        const trigger = (text, index) => {
            return `
                <button class="tabs-button" data-index="${index}" data-element="trigger-button" role="tab">${text}</button>
              `;
        };

        const panel = (html, index) => {
            return `
                <article class="tabs-article" data-index="${index}" data-element="article">${html}</article>
              `;
        };

        try {
            const stylesRequest = await fetch('/src/css/components/tabs.css');

            if ([200, 304].includes(stylesRequest.status)) {
                const styles = await stylesRequest.text();
                const template = `
                  <style>${styles}</style>
                  <div class="tabs">
                    <ul role="tablist" class="tabs-triggers">
                      ${this.initialTriggers
                    .map((item, index) => `<li>${trigger(item.innerText, index)}</li>`)
                    .join('')}          
                    </ul>
                    ${this.initialArticles.map((item, index) => panel(item.innerHTML, index)).join('')}
                  </div>
                `;
                this.root = this.attachShadow({mode: 'open'});
                this.innerHTML = '';
                this.root.innerHTML = template;
                this.postRender();
            } else {
                return Promise.reject('Error while loading CSS');
            }
        } catch (ex) {
            console.error(ex);
        }
    };

    postRender() {
        this.triggers = this.root.querySelectorAll('[data-element="trigger-button"]');
        this.articles = this.root.querySelectorAll('[data-element="article"]');

        if (this.triggers.length === this.articles.length) {
            this.state.maxIndex = this.triggers.length - 1;
            this.toggle(0, true);
            this.triggers.forEach((trigger, triggerIndex) => {
                // En cliquant sur le boutton on affiche l'article associer
                trigger.addEventListener('click', evt => {
                    evt.preventDefault();

                    this.toggle(triggerIndex);
                });

                // Ajout d'une posibilité de navigations avec les touche du clavier
                trigger.addEventListener('keydown', evt => {
                    switch (evt.keyCode) {
                        // fleche droite : affiche de l'article suivant
                        case 39:
                            this.modifyIndex('up', triggerIndex);
                            break;
                        // fleche gauche : affiche de l'article précédant
                        case 37:
                            this.modifyIndex('down', triggerIndex);
                            break;
                    }
                });
            });
        } else {
            // Suppression de tous les triggers si il n'y en à pas autant que article
            // C'est mieux de laisser l'article sans trigger au dessous plutôt que d'avoir un composant casser
            this.triggers.forEach(trigger => trigger.parentNode.removeChild(trigger));
        }
    }

    toggle(index, isInitial = false) {
        //Si l'index passer et le même que l'index actif on return
        if (index === this.state.activeTabIndex) {
            return;
        }

        // Si l'on à envoyer un index superieur à l'index maximum on definis l'indice au maximum
        if (index > this.state.maxIndex) {
            index = this.state.maxIndex;
        }

        this.state.activeTabIndex = index;

        this.triggers.forEach((trigger, triggerIndex) => {
            const panel = this.articles[triggerIndex];

            if (triggerIndex === index) {
                // Definition de l'attribute select sur le boutton
                trigger.setAttribute('aria-selected', 'true');

                // Replacement du focus sur l'element pour permettre au clavier de continuer à focus les evenements
                // sur le dernier ou le première element
                if (!isInitial) {
                    trigger.focus();
                }

                // Affichez le panneau et ajoutez un tabindex pour qu'il puisse être ciblé au prochaine evenements
                panel.setAttribute('data-state', 'visible');
                panel.setAttribute('tabindex', '-1');
            } else {
                // Supprimez l'état de selection ce qui permet à l'élement d'être à nouveau focus par le clavier
                trigger.removeAttribute('aria-selected');
                trigger.setAttribute('tabindex', '-1');

                // Redfinition de l'article comme cacher pour qu'il ne puisse plus être afficher
                panel.setAttribute('data-state', 'hidden');
                panel.removeAttribute('tabindex');
            }
        });
    }

    modifyIndex(direction, triggerIndex) {
        // On change l'index que si nous sommes focus sur le tab actif
        if (triggerIndex === this.state.activeTabIndex) {
            switch (direction) {
                case 'up':
                    this.toggle(this.state.activeTabIndex >= this.state.maxIndex ? 0 : this.state.activeTabIndex + 1);
                    break;
                case 'down':
                    this.toggle(this.state.activeTabIndex <= 0 ? this.state.maxIndex : this.state.activeTabIndex - 1);
                    break;
            }
        }
    }
}

//Si l'element n'à pas déjà était definis dans la fenêtre on le definis à l'import.
if ('customElements' in window) {
    customElements.define('tabs-group', TabsGroup);
}

export default TabsGroup;