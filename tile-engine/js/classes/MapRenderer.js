import {TILE_TYPES} from "./PatternMatcher.js";

class MapRenderer {
    constructor(patternMatcher, isoCanvas) {
        this.patternMatcher = patternMatcher;
        this.isoCanvas = isoCanvas;
    }

    drawMap(map, imageStorage) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const imgSrc = (map[y][x].type === TILE_TYPES.GRASS || map[y][x].type === TILE_TYPES.NOTHING) ?
                    ((x + y) % 2 === 0 ? `assets/tiles/grass.png` : `assets/tiles/grass-alt.png`) :
                    this.patternMatcher.matchPattern(map, x, y) ?? `assets/tiles/${map[y][x].type}.png`;
                const img = imageStorage[imgSrc];

                this.isoCanvas.draw(x, y, img);
            }
        }
    }
}

export default MapRenderer;
