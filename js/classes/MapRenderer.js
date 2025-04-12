import { TILE_TYPES } from "./PatternMatcher.js";

class MapRenderer {
    constructor(patternMatcher, isoCanvas) {
        this.patternMatcher = patternMatcher;
        this.isoCanvas = isoCanvas;
        this.cacheCanvas = document.createElement('canvas');
        this.cacheCtx = this.cacheCanvas.getContext('2d');
        this.cacheImage = null;

        this.loadingFramesDrawn = 0;
    }

    drawMapCached(map, imageStorage) {
        if (!this.cacheImage) {
            this.cacheCanvas.width = this.isoCanvas.width;
            this.cacheCanvas.height = this.isoCanvas.height;

            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    const imgSrc = (map[y][x].type === TILE_TYPES.GRASS || map[y][x].type === TILE_TYPES.NOTHING) ?
                        ((x + y) % 2 === 0 ? `assets/tiles/grass.png` : `assets/tiles/grass-alt.png`) :
                        this.patternMatcher.matchPattern(map, x, y) ?? `assets/tiles/${map[y][x].type}.png`;
                    const img = imageStorage[imgSrc];

                    this.drawTileOnCache(x, y, img);
                }
            }

            this.cacheImage = new Image();
            this.cacheImage.src = this.cacheCanvas.toDataURL();
            this.isoCanvas.ctx.drawImage(this.cacheImage, 0, 0);
            console.log('Map rendered tile-by-tile');
        } else {
            this.isoCanvas.ctx.drawImage(this.cacheImage, 0, 0);
        }
    }

    drawMap(map, imageStorage) {
        if (this.loadingFramesDrawn >= 5) {
            this.drawMapCached(map, imageStorage);
            return;
        }

        this.loadingFramesDrawn++;
        console.log('Map rendered tile-by-tile old way');
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const imgSrc = (map[y][x].type === TILE_TYPES.GRASS || map[y][x].type === TILE_TYPES.NOTHING) ?
                    ((x + y) % 2 === 0 ? `assets/tiles/grass.png` : `assets/tiles/grass-alt.png`) :
                    this.patternMatcher.matchPattern(map, x, y) ?? `assets/tiles/${map[y][x].type}.png`;
                const img = imageStorage[imgSrc];

                this.isoCanvas.draw(x, y, img, 0, map[y][x].type);
            }
        }
    }

    drawTileOnCache(x, y, image) {
        const halfTileWidth = this.isoCanvas.tileSize.width / 2;
        const halfTileHeight = this.isoCanvas.tileSize.height / 2;

        if (image) {
            const isoX = this.isoCanvas.CONTENT_SHIFT + (x - y) * (halfTileWidth + 1) + (this.isoCanvas.width / 2) - halfTileWidth;
            const isoY = (x + y) * (halfTileHeight / 2 + 8) + 25;
            this.cacheCtx.drawImage(image, isoX, isoY, this.isoCanvas.tileSize.width, this.isoCanvas.tileSize.height);
        } else {
            console.error(`Missing  image for source: ${image}`);
        }
    }


}

export default MapRenderer;
