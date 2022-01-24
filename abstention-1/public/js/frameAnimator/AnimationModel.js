const { Observable } = require("../utils");

class AnimationModel extends Observable {
    constructor(animations, container, actions) {
        super();

        if (typeof container === 'string') {
            container = document.querySelector(container);
        }

        this.scroll = undefined;
        this.currentAction = undefined;
        this.animations = animations;
        this.container = container;
        this.actions = actions;
    }

    updateScroll(){
        this.scroll = this.getContainerVisibility();
        this.currentAction = this.actions.find(
            ({ visibility }) => this.scroll >= visibility[0] && this.scroll <= visibility[1],
        )

        if (this.currentAction !== undefined) {
            this.setChanged();
        }

        this.notifyObservers();
    }

    getContainerVisibility() {
        // Get the bounding box for the lottie player or container
        // top : distance entre le haut de l'écran et le haut de l'élément
        // positif quand l'élément est en dessous de l'écran, négatif au dessus
        // height : hauteur (en pixel) de l'élément
        const { top, height } = this.container.getBoundingClientRect();
    
        // Calculate current view percentage
        // current : Distance entre le haut de l'élément et le bas de l'écran
        // positif quand l'élément est au dessus de l'écran, négatif en dessous
        const current = window.innerHeight - top;
        // max : valeur à partir de laquelle on ne voit plus l'élément à l'écran
        const max = window.innerHeight + height;
    
        // L'élément est visible quand : 0 < current < max
        // En prenant le ratio r de current / max on peut distinguer 3 cas :
        // r < 0 : L'élément n'est pas encore apparu
        // 0 <= r <= 1 : L'élément est visible à l'écran
        // r > 1 : L'élément est apparu et n'est plus visible
        return current / max;
    }

}

module.exports = AnimationModel;