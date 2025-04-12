import {Path} from "./Path.js";

class Car {
    constructor(initialPosition, graphics) {
        const {shift, ...images} = graphics;

        this.position = initialPosition;
        this.images = images;
        this.shift = shift;
        this.path = new Path();
        this.currentStep = 0;
    }

    setPath(path) {
        this.path = path;
        this.currentStep = 0;
        this.direction = this.path.getInitialDirection();
    }

    move() {
        const pathSteps = this.path.getSteps();
        if (this.currentStep < pathSteps.length - 1) {
            this.position = pathSteps[this.currentStep];
            this.currentStep++;
            this.direction = this.position.direction;
            if (!this.position.direction) {
                console.warn('Direction is not set. Defaulting to UP.', this.currentStep, pathSteps);
                this.direction = 'up'; // TODO: remove this to debug
            }
        } else {
            this.path = new Path();
        }
    }

    isAtDestination() {
        return this.currentStep >= this.path.getSteps().length - 1;
    }

    getImage() {
        return this.images[this.direction];
    }
}

export default Car;