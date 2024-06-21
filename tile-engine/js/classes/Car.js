import {Path} from "./Path.js";

class Car {
    constructor(initialPosition, images) {
        this.position = initialPosition;
        this.images = images;
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