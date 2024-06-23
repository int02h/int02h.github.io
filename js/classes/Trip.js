import {Pathfinding} from "./Path.js";
import Car from "./Car.js";

class Trip {
    carStrategy = {
        taxi: new TaxiTripCar(),
        private: new PrivateTripCar(),
    }

    constructor(from, to, map, options = {}) {
        const carType = options.carType ?? 'private';

        this.from = from;
        this.to = to;

        const pathfinding = new Pathfinding(map);
        this.path = pathfinding.findShortestPath(this.from, this.to, options);
        this.car = new Car(from, this.carStrategy[carType].getImages());
        console.log("Path!!!", this.path);
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

class TaxiTripCar {
    getImages() {
        return {
            up: 'assets/objects/taxi-car-up.png',
            right: 'assets/objects/taxi-car-right.png',
            down: 'assets/objects/taxi-car-down.png',
            left: 'assets/objects/taxi-car-left.png',
        };
    }
}

class PrivateTripCar {
    getImages() {
        return {
            up: 'assets/objects/private-car-up.png',
            right: 'assets/objects/private-car-right.png',
            down: 'assets/objects/private-car-down.png',
            left: 'assets/objects/private-car-left.png',
        };
    }
}

export default Trip;