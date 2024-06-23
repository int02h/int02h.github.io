import {TILE_TYPES} from './PatternMatcher.js';

class Map {
    constructor(size) {
        this.size = size;
        this.map = Map.emptyMapTiles(size);
        this.roadTiles = new Set();
    }

    getTile(x, y) {
        return this.map[y][x];
    }

    setTile(x, y, tile) {
        this.map[y][x] = tile;
        if (tile.type === TILE_TYPES.ROAD) {
            this.roadTiles.add({x, y});
        }
    }

    getRandomRoadTile() {
        const roadTiles = Array.from(this.roadTiles);
        return roadTiles[Math.floor(Math.random() * roadTiles.length)];
    }

    static emptyMapTiles(size) {
        return Array.from(
            { length: size },
            () => Array(size).fill(MapGenerator.cell(TILE_TYPES.GRASS))
        );
    }
}

class MapGenerator {
    constructor(mapConfig, patternMatcher, objectTypes) {
        this.mapConfig = mapConfig;
        this.patternMatcher = patternMatcher;
        this.objectTypes = objectTypes;
    }

    generateBaseMap(neighborhoodCount) {
        const mapSize = Math.ceil(Math.sqrt(neighborhoodCount));
        const totalNeighborhoodSize = mapSize * (this.mapConfig.neighborhoodSize + this.mapConfig.sidewalkSize * 2 + this.mapConfig.roadSize) + this.mapConfig.roadSize + this.mapConfig.borderSize * 2;

        const map = new Map(totalNeighborhoodSize);

        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                const neighborhoodStartY = this.mapConfig.borderSize + i * (this.mapConfig.neighborhoodSize + this.mapConfig.sidewalkSize * 2 + this.mapConfig.roadSize) + this.mapConfig.roadSize + this.mapConfig.sidewalkSize;
                const neighborhoodStartX = this.mapConfig.borderSize + j * (this.mapConfig.neighborhoodSize + this.mapConfig.sidewalkSize * 2 + this.mapConfig.roadSize) + this.mapConfig.roadSize + this.mapConfig.sidewalkSize;

                for (let y = 0; y < this.mapConfig.neighborhoodSize; y++) {
                    for (let x = 0; x < this.mapConfig.neighborhoodSize; x++) {
                        map.setTile(neighborhoodStartX + x, neighborhoodStartY + y, MapGenerator.cell(TILE_TYPES.NOTHING));
                    }
                }

                for (let k = 0; k < this.mapConfig.neighborhoodSize; k += 2) {
                    for (let l = 0; l < this.mapConfig.neighborhoodSize; l += 2) {
                        if (Math.random() > 0.14) {
                            map.setTile(neighborhoodStartX + l, neighborhoodStartY + k, MapGenerator.cell(TILE_TYPES.NEIGHBORHOOD));
                        }
                    }
                }

                for (let y = -1; y <= this.mapConfig.neighborhoodSize; y++) {
                    map.setTile(neighborhoodStartX - 1, neighborhoodStartY + y, MapGenerator.cell(TILE_TYPES.SIDEWALK));
                    map.setTile(neighborhoodStartX + this.mapConfig.neighborhoodSize, neighborhoodStartY + y, MapGenerator.cell(TILE_TYPES.SIDEWALK));
                }
                for (let x = -1; x <= this.mapConfig.neighborhoodSize; x++) {
                    map.setTile(neighborhoodStartX + x, neighborhoodStartY - 1, MapGenerator.cell(TILE_TYPES.SIDEWALK));
                    map.setTile(neighborhoodStartX + x, neighborhoodStartY + this.mapConfig.neighborhoodSize, MapGenerator.cell(TILE_TYPES.SIDEWALK));
                }

                for (let roadRow = 0; roadRow < this.mapConfig.roadSize; roadRow++) {
                    const shift = this.mapConfig.sidewalkSize + roadRow;

                    for (let y = -1 - shift; y <= this.mapConfig.neighborhoodSize + shift; y++) {
                        map.setTile(neighborhoodStartX - 1 - shift, neighborhoodStartY + y, MapGenerator.cell(TILE_TYPES.ROAD));
                        map.setTile(neighborhoodStartX + this.mapConfig.neighborhoodSize + shift, neighborhoodStartY + y, MapGenerator.cell(TILE_TYPES.ROAD));
                    }
                    for (let x = -1 - shift; x <= this.mapConfig.neighborhoodSize + shift; x++) {
                        map.setTile(neighborhoodStartX + x, neighborhoodStartY - 1 - shift, MapGenerator.cell(TILE_TYPES.ROAD));
                        map.setTile(neighborhoodStartX + x, neighborhoodStartY + this.mapConfig.neighborhoodSize + shift, MapGenerator.cell(TILE_TYPES.ROAD));
                    }
                }
            }
        }

        console.log(map.map);
        return map;
    }

    fillMapMetadata(mapTiles) {
        for (let y = 0; y < mapTiles.length; y++) {
            for (let x = 0; x < mapTiles[y].length; x++) {
                const cell = mapTiles[y][x];
                if (cell.type === TILE_TYPES.ROAD) {
                    const possibleDirections = this.patternMatcher.matchPattern(mapTiles, x, y);
                    if (possibleDirections) {
                        cell.properties.possibleDirections = possibleDirections;
                    }
                }
                if (cell.type === TILE_TYPES.NEIGHBORHOOD) {
                    cell.properties.imageSrc = `assets/objects/${this.objectTypes[Math.floor(Math.random() * this.objectTypes.length)]}`;
                }
            }
        }
    }

    findNearestRoad(mapTiles, x, y) {
        console.log('findNearestRoad', x, y, mapTiles[y]?.[x]?.type);
        if (mapTiles[y]?.[x]?.type === TILE_TYPES.ROAD) {
            return {x, y};
        }

        for (let distance = 1; distance < mapTiles.length; distance++) {
            for (let i = -distance; i <= distance; i++) {
                if (mapTiles[y + i]?.[x - distance]?.type === TILE_TYPES.ROAD) {
                    return { x: x - distance, y: y + i };
                }
                if (mapTiles[y + i]?.[x + distance]?.type === TILE_TYPES.ROAD) {
                    return { x: x + distance, y: y + i };
                }
            }
            for (let i = -distance + 1; i < distance; i++) {
                if (mapTiles[y - distance]?.[x + i]?.type === TILE_TYPES.ROAD) {
                    return { x: x + i, y: y - distance };
                }
                if (mapTiles[y + distance]?.[x + i]?.type === TILE_TYPES.ROAD) {
                    return { x: x + i, y: y + distance };
                }
            }
        }
    }

    static cell(cellType) {
        return {
            type: cellType,
            properties: {
                possibleDirections: [],
                imageSrc: `/assets/tiles/${cellType}.png`,
            },
        };
    }
}

export {MapGenerator, Map};
