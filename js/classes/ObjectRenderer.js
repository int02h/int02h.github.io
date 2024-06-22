import { TILE_TYPES } from './PatternMatcher.js';

class ObjectRenderer {
    constructor() {}

    drawObjects(map, isoCanvas, imageStorage) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x].type === TILE_TYPES.NEIGHBORHOOD) {
                    const img = imageStorage[map[y][x].properties.imageSrc];
                    isoCanvas.drawObject(x, y, img);
                }
            }
        }
    }
}

export default ObjectRenderer;
