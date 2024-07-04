import {cloneDeep} from 'https://esm.sh/lodash-es@4.17.21';
import ImageLoader from './classes/ImageLoader.js';
import IsometricCanvas from "./classes/IsometricCanvas.js";
import {GameMap, MapGenerator} from "./classes/MapGenerator.js";
import MapRenderer from './classes/MapRenderer.js';
import ObjectRenderer from './classes/ObjectRenderer.js';
import Trip from './classes/Trip.js';
import {ROAD_DIRECTION_PATTERN_RULES, TILE_IMAGE_PATTERN_RULES, PatternMatcher} from './classes/PatternMatcher.js';
import {Config} from "./config.js";

let imageLoader = new ImageLoader(Config.objectTypes);
let imagePatternMatcher;
let directionPatternMatcher;
let mapGenerator;
let objectRenderer;
let map;
export let trips = [];
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
    localStorage.game_map = "";

    imagePatternMatcher = new PatternMatcher(TILE_IMAGE_PATTERN_RULES);
    directionPatternMatcher = new PatternMatcher(ROAD_DIRECTION_PATTERN_RULES);
    mapGenerator = new MapGenerator(Config.map, directionPatternMatcher, Config.objectTypes);
    objectRenderer = new ObjectRenderer(Config.drawing.tileSize);

    const savedGameMap = localStorage.game_map;
    if (!!savedGameMap) {
        try {
            map = deserializeGameMap(savedGameMap)
            console.log(map);
        } catch (error) {
            console.warn('Error parsing map from local storage:', error);
            map = mapGenerator.generateBaseMap(Config.map.neighborhoodCount);
            mapGenerator.fillMapMetadata(map.map);
            localStorage.game_map = serializeGameMap(map);
        }
    } else {
        map = mapGenerator.generateBaseMap(Config.map.neighborhoodCount);
        mapGenerator.fillMapMetadata(map.map);
        localStorage.game_map = serializeGameMap(map);
    }

    const canvas = document.getElementById('gameCanvas');
    setupCanvas(canvas, map.map);
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
    mapRenderer.drawMap(map.map, imageStorage);
    objectRenderer.drawObjects(map.map, isoCanvas, imageStorage);
    centerGameOnScreen(canvas);

    trips.push(new Trip({ x: 19, y: 33 }, { x: 32, y: 14 }, map.map));
    setInterval(() => {
        trips.push(createRandomTrip());
    }, 500);

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
    mapRenderer?.drawMap(map.map, imageStorage);

    for (let trip of trips.filter(trip => !!trip)) {
        try {
            const car = trip.car;
            const carImage = imageStorage[car.getImage()];
            isoCanvas?.draw(car.position.x, car.position.y, carImage, car.shift);
        } catch (error) {
            console.log(trips);
            console.warn('Error rendering trip:', error);
        }
    }

    objectRenderer?.drawObjects(map.map, isoCanvas, imageStorage);
}

function onMapCalculationTick() {
    for (let trip of trips.filter(trip => !!trip)) {
        try {
            trip.move();
        } catch (error) {
            console.warn('Error calculating trip:', error);
        }
    }
    trips = trips.filter(trip => !trip?.isFinished());
}

export function createRandomTrip(carType = 'private') {
    const retries = 5;
    for (let i = 0; i < retries; i++) {
        try {
            const start = map.getRandomInvisibleRoadTile();
            const finish = map.getRandomInvisibleRoadTile();
            const trip = new Trip(start, finish, map.map, {
                fromIdleSteps: 1,
                toIdleSteps: 1,
                carType: carType,
            });
            if (trip.path.path.length > 0) {
                return trip;
            }
        } catch (error) {
        }
    }
}

function addEventListeners(canvas, map, isoCanvas) {
    canvas.addEventListener('click', (event) => {
        // const rect = canvas.getBoundingClientRect();
        // const x = event.clientX - rect.left;
        // const y = event.clientY - rect.top;
        // const mapCoords = isoCanvas.canvasToMapCoords(x, y);

        for (let i = 0; i < 10; i++) {
            const start = map.getRandomInvisibleRoadTile();
            const finish = map.getRandomInvisibleRoadTile();
            const trip = new Trip(start, finish, map.map, {
                fromIdleSteps: 1,
                toIdleSteps: 1,
            });
            if (trip.path.path.length > 0) {
                trips.push(trip);
            }
        }

        // console.log('Map Coordinates:', mapCoords);
        // console.log('Nearest road:', start);
    });


}

function serializeGameMap(gameMap) {
    const clonedMap = cloneDeep(gameMap);
    clonedMap.roadTiles = Array.from(clonedMap.roadTiles);
    return JSON.stringify(clonedMap);
}

function deserializeGameMap(gameMap) {
    const parsedMap = JSON.parse(gameMap);
    parsedMap.roadTiles = new Set(parsedMap.roadTiles);
    return new GameMap(parsedMap.size, parsedMap.map, parsedMap.roadTiles);
}
