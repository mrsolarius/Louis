import styles from '../scss/components/_tabs.scss';

/**
 * Cette classe à pour role de crée un nouvelle element html tabs-groupe
 * Cette element permet à partir d'une shadows structure conçu pour le referancement de concevoir une autre structure
 * moins optimiser pour le moteur de recherche mais plus interactive.
 *
 * Ici on vas transformer une structure `hX article` en `div>ul>li>button article` de façon à permettre une
 * navigation tabulaire entre les différent articles.
 */
class TabsGroup extends HTMLElement {
    private state: { maxIndex: number; activeTabIndex: number };
    private triggers: NodeListOf<any> | undefined;
    private articles: NodeListOf<any> | undefined;
    private initialTriggers: Element[] | undefined;
    private initialArticles: Element[] | undefined;
    private root: ShadowRoot | undefined;

    constructor() {
        super();
        this.state = {
            activeTabIndex: -1,
            maxIndex: 0
        };
        this.connectedCallback().then()
    }

    async connectedCallback(): Promise<void> {
        this.initialTriggers = [...this.querySelectorAll('[data-element="trigger"]')];
        this.initialArticles = [...this.querySelectorAll('[data-element="article"]')];

        // Lancement du rendu pour transformer les element html
        await this.render();
    }

    // Generation des nouveau composant html en rendu dans le shadow root
    async render(): Promise<void> {

        const trigger = (text: any, index: number) => {
            return `<button class="tabs-button" data-index="${index}" data-element="trigger-button" role="tab">${text}</button>`;
        };

        const panel = (html: any, index: number) => {
            return `<article class="tabs-article" data-index="${index}" data-element="article">${html}</article>`;
        };
        let template;
        if (this.initialTriggers && this.initialArticles) {
            template = `
              <style>${styles}</style>
              <div class="tabs">
                <ul role="tablist" class="tabs-triggers">
                  ${this.initialTriggers
                .map((item, index) => `<li>${trigger(item.textContent, index)}</li>`)
                .join('')}          
                </ul>
                ${this.initialArticles.map((item, index) => panel(item.innerHTML, index)).join('')}
              </div>`;
        }
        this.root = this.attachShadow({mode: 'open'});
        this.innerHTML = '';
        if (template)
            this.root.innerHTML = template;
        this.postRender();
    };

    postRender(): void {
        if (this.root) {
            this.triggers = this.root.querySelectorAll('[data-element="trigger-button"]');
            this.articles = this.root.querySelectorAll('[data-element="article"]');

            if (this.triggers.length === this.articles.length) {
                this.state.maxIndex = this.triggers.length - 1;
                this.toggle(0, true);
                this.triggers.forEach((trigger, triggerIndex) => {
                    // En cliquant sur le boutton on affiche l'article associer
                    trigger.addEventListener('click', (evt: { preventDefault: () => void; }) => {
                        evt.preventDefault();

                        this.toggle(triggerIndex);
                    });

                    // Ajout d'une posibilité de navigations avec les touche du clavier
                    trigger.addEventListener('keydown', (evt: { keyCode: any; }) => {
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
            }
        } else {
            // Suppression de tous les triggers si il n'y en à pas autant que article
            // C'est mieux de laisser l'article sans trigger au dessous plutôt que d'avoir un composant casser
            if (this.triggers)
                this.triggers.forEach(trigger => trigger.parentNode.removeChild(trigger));
        }
    }

    toggle(index: number, isInitial = false): void {
        //Si l'index passer et le même que l'index actif on return
        if (index === this.state.activeTabIndex) {
            return;
        }

        // Si l'on à envoyer un index superieur à l'index maximum on definis l'indice au maximum
        if (index > this.state.maxIndex) {
            index = this.state.maxIndex;
        }

        this.state.activeTabIndex = index;

        if (this.triggers) {
            this.triggers.forEach((trigger, triggerIndex) => {
                if (this.articles) {
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
                }
            });
        }
    }

    modifyIndex(direction: string, triggerIndex: number): void {
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