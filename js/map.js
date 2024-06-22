import ImageLoader from './classes/ImageLoader.js';
import IsometricCanvas from "./classes/IsometricCanvas.js";
import MapGenerator from "./classes/MapGenerator.js";
import MapRenderer from './classes/MapRenderer.js';
import ObjectRenderer from './classes/ObjectRenderer.js';
import animateTrip from './trip.js';
import { ROAD_DIRECTION_PATTERN_RULES, TILE_IMAGE_PATTERN_RULES, PatternMatcher } from './classes/PatternMatcher.js';
import {Config} from "./config.js";

const imageLoader = new ImageLoader(Config.objectTypes);

document.addEventListener('DOMContentLoaded', async () => {
    const mapData = await initializeGame();
    addEventListeners(mapData.canvas, mapData.map, mapData.isoCanvas);
});

async function initializeGame() {
    const imagePatternMatcher = new PatternMatcher(TILE_IMAGE_PATTERN_RULES);
    const directionPatternMatcher = new PatternMatcher(ROAD_DIRECTION_PATTERN_RULES);
    const mapGenerator = new MapGenerator(Config.map, directionPatternMatcher, Config.objectTypes);
    const objectRenderer = new ObjectRenderer(Config.drawing.tileSize);
    const map = mapGenerator.generateBaseMap(Config.map.neighborhoodCount);

    const canvas = document.getElementById('gameCanvas');
    setupCanvas(canvas, map);
    const ctx = canvas.getContext('2d');
    const isoCanvas = new IsometricCanvas(ctx, {
        tileSize: Config.drawing.tileSize,
        width: canvas.width,
        height: canvas.height,
    });

    const mapRenderer = new MapRenderer(imagePatternMatcher, isoCanvas);
    const filenames = imageLoader.collectFilenames();
    await preloadImages(filenames);

    const imageStorage = imageLoader.getImageStorage();
    mapGenerator.fillMapMetadata(map);
    mapRenderer.drawMap(map, imageStorage);
    objectRenderer.drawObjects(map, isoCanvas, imageStorage);
    centerGameOnScreen(canvas);

    animateTrip(map, imageStorage, mapRenderer, objectRenderer, isoCanvas, { x: 19, y: 33 }, { x: 32, y: 14 });

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

function addEventListeners(canvas, map, isoCanvas) {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const mapCoords = isoCanvas.canvasToMapCoords(x, y);
        console.log('Map Coordinates:', mapCoords);
    });
}
