import ImageLoader from './classes/ImageLoader.js';
import IsometricCanvas from "./classes/IsometricCanvas.js";
import MapGenerator from "./classes/MapGenerator.js";
import MapRenderer from './classes/MapRenderer.js';
import ObjectRenderer from './classes/ObjectRenderer.js';
import Trip from './classes/Trip.js';
import { ROAD_DIRECTION_PATTERN_RULES, TILE_IMAGE_PATTERN_RULES, PatternMatcher } from './classes/PatternMatcher.js';
import {Config} from "./config.js";

let imageLoader = new ImageLoader(Config.objectTypes);
let imagePatternMatcher;
let directionPatternMatcher;
let mapGenerator;
let objectRenderer;
let map;
let trips = [];
let mapRenderer;
let isoCanvas;
let imageStorage;

document.addEventListener('DOMContentLoaded', async () => {
    const mapData = await initializeGame();
    addEventListeners(mapData.canvas, mapData.map, mapData.isoCanvas);

    setInterval(onMapAnimationTick, 1000 / Config.animationTickPerSecond);
    setInterval(onMapCalculationTick, 1000 / Config.calculationTickPerSecond);
});

async function initializeGame() {
    imagePatternMatcher = new PatternMatcher(TILE_IMAGE_PATTERN_RULES);
    directionPatternMatcher = new PatternMatcher(ROAD_DIRECTION_PATTERN_RULES);
    mapGenerator = new MapGenerator(Config.map, directionPatternMatcher, Config.objectTypes);
    objectRenderer = new ObjectRenderer(Config.drawing.tileSize);
    map = mapGenerator.generateBaseMap(Config.map.neighborhoodCount);

    const canvas = document.getElementById('gameCanvas');
    setupCanvas(canvas, map);
    const ctx = canvas.getContext('2d');
    isoCanvas = new IsometricCanvas(ctx, {
        tileSize: Config.drawing.tileSize,
        width: canvas.width,
        height: canvas.height,
    });

    mapRenderer = new MapRenderer(imagePatternMatcher, isoCanvas);
    const filenames = imageLoader.collectFilenames();
    await preloadImages(filenames);

    imageStorage = imageLoader.getImageStorage();
    mapGenerator.fillMapMetadata(map);
    mapRenderer.drawMap(map, imageStorage);
    objectRenderer.drawObjects(map, isoCanvas, imageStorage);
    centerGameOnScreen(canvas);

    trips.push(new Trip({ x: 19, y: 33 }, { x: 32, y: 14 }, map));

    return { canvas, map, isoCanvas };
}

function setupCanvas(canvas, map) {
    canvas.width = map[0].length * Config.drawing.tileSize.width + Config.drawing.canvasMargin + Config.drawing.extraWidth;
    canvas.height = map.length * Config.drawing.tileSize.height + Config.drawing.canvasMargin;
}

function preloadImages(filenames) {
    return new Promise((resolve, reject) => {
        imageLoader.preloadImages(filenames, () => {
            resolve();
        });
    });
}

function centerGameOnScreen(canvas) {
    const gameWrapper = document.getElementById('game-container');
    document.scrollingElement.scrollLeft = (canvas.width - gameWrapper.clientWidth) / 2;
}

function onMapAnimationTick() {
    mapRenderer?.drawMap(map, imageStorage);

    for (let trip of trips) {
        const car = trip.car;
        const carImage = imageStorage[car.getImage()];
        isoCanvas?.draw(car.position.x, car.position.y, carImage);
    }

    objectRenderer?.drawObjects(map, isoCanvas, imageStorage);
}

function onMapCalculationTick() {
    for (let trip of trips) {
        trip.move();
    }
    trips = trips.filter(trip => !trip.isFinished());
}

function addEventListeners(canvas, map, isoCanvas) {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const mapCoords = isoCanvas.canvasToMapCoords(x, y);

        const start = mapGenerator.findNearestRoad(map, mapCoords.x, mapCoords.y);
        const finish = mapGenerator.findNearestRoad(map,
            Math.floor(Math.random() * map[0].length),
            Math.floor(Math.random() * map.length)
        );

        trips.push(new Trip(start, finish, map));

        console.log('Map Coordinates:', mapCoords);
        console.log('Nearest road:', start);
    });
}
