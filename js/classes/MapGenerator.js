import { TILE_TYPES } from './PatternMatcher.js';

class MapGenerator {
    constructor(mapConfig, patternMatcher, objectTypes) {
        this.mapConfig = mapConfig;
        this.patternMatcher = patternMatcher;
        this.objectTypes = objectTypes;
    }

    generateBaseMap(neighborhoodCount) {
        const mapSize = Math.ceil(Math.sqrt(neighborhoodCount));
        const totalNeighborhoodSize = mapSize * (this.mapConfig.neighborhoodSize + this.mapConfig.sidewalkSize * 2 + this.mapConfig.roadSize) + this.mapConfig.roadSize + this.mapConfig.borderSize * 2;

        const map = Array.from(
            { length: totalNeighborhoodSize },
            () => Array(totalNeighborhoodSize).fill(this.cell(TILE_TYPES.GRASS))
        );

        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                const neighborhoodStartY = this.mapConfig.borderSize + i * (this.mapConfig.neighborhoodSize + this.mapConfig.sidewalkSize * 2 + this.mapConfig.roadSize) + this.mapConfig.roadSize + this.mapConfig.sidewalkSize;
                const neighborhoodStartX = this.mapConfig.borderSize + j * (this.mapConfig.neighborhoodSize + this.mapConfig.sidewalkSize * 2 + this.mapConfig.roadSize) + this.mapConfig.roadSize + this.mapConfig.sidewalkSize;

                for (let y = 0; y < this.mapConfig.neighborhoodSize; y++) {
                    for (let x = 0; x < this.mapConfig.neighborhoodSize; x++) {
                        map[neighborhoodStartY + y][neighborhoodStartX + x] = this.cell(TILE_TYPES.NOTHING);
                    }
                }

                for (let k = 0; k < this.mapConfig.neighborhoodSize; k += 2) {
                    for (let l = 0; l < this.mapConfig.neighborhoodSize; l += 2) {
                        if (Math.random() > 0.14) {
                            map[neighborhoodStartY + k][neighborhoodStartX + l] = this.cell(TILE_TYPES.NEIGHBORHOOD);
                        }
                    }
                }

                for (let y = -1; y <= this.mapConfig.neighborhoodSize; y++) {
                    map[neighborhoodStartY + y][neighborhoodStartX - 1] = this.cell(TILE_TYPES.SIDEWALK);
                    map[neighborhoodStartY + y][neighborhoodStartX + this.mapConfig.neighborhoodSize] = this.cell(TILE_TYPES.SIDEWALK);
                }
                for (let x = -1; x <= this.mapConfig.neighborhoodSize; x++) {
                    map[neighborhoodStartY - 1][neighborhoodStartX + x] = this.cell(TILE_TYPES.SIDEWALK);
                    map[neighborhoodStartY + this.mapConfig.neighborhoodSize][neighborhoodStartX + x] = this.cell(TILE_TYPES.SIDEWALK);
                }

                for (let roadRow = 0; roadRow < this.mapConfig.roadSize; roadRow++) {
                    const shift = this.mapConfig.sidewalkSize + roadRow;

                    for (let y = -1 - shift; y <= this.mapConfig.neighborhoodSize + shift; y++) {
                        map[neighborhoodStartY + y][neighborhoodStartX - 1 - shift] = this.cell(TILE_TYPES.ROAD);
                        map[neighborhoodStartY + y][neighborhoodStartX + this.mapConfig.neighborhoodSize + shift] = this.cell(TILE_TYPES.ROAD);
                    }
                    for (let x = -1 - shift; x <= this.mapConfig.neighborhoodSize + shift; x++) {
                        map[neighborhoodStartY - 1 - shift][neighborhoodStartX + x] = this.cell(TILE_TYPES.ROAD);
                        map[neighborhoodStartY + this.mapConfig.neighborhoodSize + shift][neighborhoodStartX + x] = this.cell(TILE_TYPES.ROAD);
                    }
                }
            }
        }

        return map;
    }

    fillMapMetadata(map) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const cell = map[y][x];
                if (cell.type === TILE_TYPES.ROAD) {
                    const possibleDirections = this.patternMatcher.matchPattern(map, x, y);
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

    findNearestRoad(map, x, y) {
        console.log('findNearestRoad', x, y, map[y]?.[x]?.type);
        if (map[y]?.[x]?.type === TILE_TYPES.ROAD) {
            return {x, y};
        }

        for (let distance = 1; distance < map.length; distance++) {
            for (let i = -distance; i <= distance; i++) {
                if (map[y + i]?.[x - distance]?.type === TILE_TYPES.ROAD) {
                    return { x: x - distance, y: y + i };
                }
                if (map[y + i]?.[x + distance]?.type === TILE_TYPES.ROAD) {
                    return { x: x + distance, y: y + i };
                }
            }
            for (let i = -distance + 1; i < distance; i++) {
                if (map[y - distance]?.[x + i]?.type === TILE_TYPES.ROAD) {
                    return { x: x + i, y: y - distance };
                }
                if (map[y + distance]?.[x + i]?.type === TILE_TYPES.ROAD) {
                    return { x: x + i, y: y + distance };
                }
            }
        }
    }

    cell(cellType) {
        return {
            type: cellType,
            properties: {
                possibleDirections: [],
                imageSrc: `/assets/tiles/${cellType}.png`,
            },
        };
    }
}

export default MapGenerator;
