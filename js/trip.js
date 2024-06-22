import {Pathfinding} from "./classes/Path.js";
import Car from "./classes/Car.js";

function animateTrip(map, imageStorage, mapRenderer, objectRenderer, isoCanvas, from, to) {
    const pathfinding = new Pathfinding(map);
    const path = pathfinding.findShortestPath(from, to);
    const car = new Car(from, {
        up: 'assets/objects/car-up.png',
        right: 'assets/objects/car-right.png',
        down: 'assets/objects/car-down.png',
        left: 'assets/objects/car-left.png',
    });
    car.setPath(path);

    function animate() {
        if (!car.isAtDestination()) {
            car.move();

            mapRenderer.drawMap(map, imageStorage);
            const carImage = imageStorage[car.getImage()];
            isoCanvas.draw(car.position.x, car.position.y, carImage);
            objectRenderer.drawObjects(map, isoCanvas, imageStorage);

            if (!car.isAtDestination()) {
                setTimeout(animate, 150);
            }
        }
    }

    animate();
}

export default animateTrip;