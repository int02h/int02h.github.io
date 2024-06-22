import {Pathfinding} from "./Path.js";
import Car from "./Car.js";

class Trip {
    constructor(from, to, map) {
        this.from = from;
        this.to = to;

        const pathfinding = new Pathfinding(map);
        this.path = pathfinding.findShortestPath(this.from, this.to);
        this.car = new Car(from, {
            up: 'assets/objects/car-up.png',
            right: 'assets/objects/car-right.png',
            down: 'assets/objects/car-down.png',
            left: 'assets/objects/car-left.png',
        });
        console.log("Path", this.path);
        this.car.setPath(this.path);
    }

    move() {
        if (!this.car.isAtDestination()) {
            this.car.move();
        }
    }

    isFinished() {
        return this.car.isAtDestination();
    }
}

export default Trip;