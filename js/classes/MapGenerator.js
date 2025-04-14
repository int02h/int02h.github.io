import {TILE_TYPES} from './PatternMatcher.js';

class GameMap {
    constructor(size, map = undefined, roadTiles = undefined) {
        this.size = size;
        this.map = map ?? GameMap.emptyMapTiles(size);
        this.roadTiles = roadTiles ?? new Set();
    }

    getTile(x, y) {
        return this.map[y][x];
    }

    setTile(x, y, tile) {
        this.map[y][x] = tile;
        if (tile.type === TILE_TYPES.ROAD) {
            this.roadTiles.add({x, y});
        }

        if (tile.type === TILE_TYPES.NEIGHBORHOOD) {
            tile.properties.imageSrc = `assets/objects/${tile.properties.neighborhoodType}-${tile.properties.neighborhoodVariant}.png`;
        }
    }

    getRandomInvisibleRoadTile() {
        const invisibleRoads = this.getInvisibleRoads();
        return invisibleRoads[Math.floor(Math.random() * invisibleRoads.length)];
    }

    getRandomVisibleRoadTile() {
        const visibleRoads = this.getVisibleRoads();
        return visibleRoads[Math.floor(Math.random() * visibleRoads.length)];
    }

    getRandomRoadTile() {
        const roadTiles = Array.from(this.roadTiles);
        return roadTiles[Math.floor(Math.random() * roadTiles.length)];
    }

    // this method returns all road tiles that are not visible
    // because they are behind high neighborhood objects
    // and the player cannot see them
    getInvisibleRoads() {
        if (this.invisibleRoads?.length === undefined) {
            const shifts = [{x: 3, y: 3}, {x: 2, y: 3}, {x: 3, y: 2}, {x: 2, y: 2}];
            this.invisibleRoads = [];
            const roadTiles = Array.from(this.roadTiles);
            for (const {x, y} of roadTiles) {
                for (const shift of shifts) {
                    const cell = this.map[y+shift.y][x+shift.x];
                    if (cell.properties.neighborhoodType === 'house' && [1, 3, 5].includes(cell.properties.neighborhoodVariant)) {
                        this.invisibleRoads.push({x, y});
                    }
                }
            }
            console.log('invisibleRoads', this.invisibleRoads);
        }

        return this.invisibleRoads;
    }

    getVisibleRoads() {
        if (this.visibleRoads?.length === undefined) {
            this.visibleRoads = Array.from(this.roadTiles).filter(({x, y}) => !this.getInvisibleRoads().some(tile => tile.x === x && tile.y === y));
        }

        return this.visibleRoads;
    }

    static emptyMapTiles(size) {
        return Array.from(
            {length: size},
            () => Array(size).fill(MapGenerator.cell(TILE_TYPES.GRASS))
        );
    }
}

class MapGenerator {
    static neighborhoodType = {
        house: {
            probability: 0.6,
            variants: 7,
        },
        parking: {
            probability: 0.3,
            variants: 3,
        },
        park: {
            probability: 0.1,
            variants: 2,
        },
    };

    static shops = [
        {nx: 0, ny: 2},
        {nx: 1, ny: 0},
        {nx: 3, ny: 2},
    ];

    static gasStations = [
        {nx: 0, ny: 0},
        {nx: 2, ny: 3},
        {nx: 3, ny: 1},
    ];

    static offices = [
        {nx: 1, ny: 1},
    ];

    static highBuildings = [
        {nx: 0, ny: 0},
        {nx: 0, ny: 3},
        {nx: 3, ny: 0},
        {nx: 3, ny: 3},
    ];

    constructor(mapConfig, patternMatcher, objectTypes) {
        this.mapConfig = mapConfig;
        this.patternMatcher = patternMatcher;
        this.objectTypes = objectTypes;
    }

    generateBaseMap(neighborhoodCount) {
        const mapSize = Math.ceil(Math.sqrt(neighborhoodCount));
        const totalNeighborhoodSize = mapSize * (this.mapConfig.neighborhoodSize + this.mapConfig.sidewalkSize * 2 + this.mapConfig.roadSize) + this.mapConfig.roadSize + this.mapConfig.borderSize * 2;

        const map = new GameMap(totalNeighborhoodSize);

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

        const placeSpecialObjects = (objects, type, variants=[0], offsetX=0, offsetY=0) => {
            for (let i = 0; i < objects.length; i++) {
                const nx = objects[i].nx < mapSize ? objects[i].nx : mapSize - 1;
                const ny = objects[i].ny < mapSize ? objects[i].ny : mapSize - 1;
                const neighborhoodStartX = this.mapConfig.borderSize + nx * (this.mapConfig.neighborhoodSize + this.mapConfig.sidewalkSize * 2 + this.mapConfig.roadSize) + this.mapConfig.roadSize + this.mapConfig.sidewalkSize;
                const neighborhoodStartY = this.mapConfig.borderSize + ny * (this.mapConfig.neighborhoodSize + this.mapConfig.sidewalkSize * 2 + this.mapConfig.roadSize) + this.mapConfig.roadSize + this.mapConfig.sidewalkSize;

                const variant = variants[Math.floor(Math.random() * variants.length)];
                map.setTile(
                    neighborhoodStartX + this.mapConfig.neighborhoodSize - 2 * (offsetX + 1),
                    neighborhoodStartY + this.mapConfig.neighborhoodSize - 2 * (offsetY + 1),
                    MapGenerator.cell(TILE_TYPES.NEIGHBORHOOD, {neighborhoodType: type, neighborhoodVariant: variant}),
                );
            }
        };

        placeSpecialObjects(MapGenerator.shops, 'shop');
        placeSpecialObjects(MapGenerator.gasStations, 'gas', [0], 2, 0);
        placeSpecialObjects(MapGenerator.highBuildings, 'house', [1, 3, 5], 0, 2);
        placeSpecialObjects([{nx: 1, ny: 1}], 'house', [5], 0, 1);
        placeSpecialObjects([{nx: 1, ny: 1}], 'house', [1], 1, 0);

        placeSpecialObjects([{nx: 1, ny: 2}], 'factory', [0], 0, 0);
        placeSpecialObjects([{nx: 1, ny: 2}], 'factory', [1], 0, 1);

        // an experiment
        // map top-right line
        placeSpecialObjects([{nx: 1, ny: -1}, {nx: 0, ny: -1}, {nx: 2, ny: -1}, {nx: 3, ny: -1}], 'park', [1], 1, -0.5);
        placeSpecialObjects([{nx: 1, ny: -1}, {nx: 0, ny: -1}, {nx: 2, ny: -1}, {nx: 3, ny: -1}], 'park', [0], 2, 0);
        placeSpecialObjects([{nx: 1, ny: -1}, {nx: 0, ny: -1}, {nx: 2, ny: -1}, {nx: 3, ny: -1}], 'park', [0], 3.5, 0);
        placeSpecialObjects([{nx: 1, ny: -1}, {nx: 0, ny: -1}, {nx: 2, ny: -1}, {nx: 3, ny: -1}], 'park', [2], 4.5, -0.5);

        placeSpecialObjects([{nx: 3, ny: -1}], 'park', [0], -3, 0);
        placeSpecialObjects([{nx: 3, ny: -1}], 'park', [0], -1.5, 0);
        placeSpecialObjects([{nx: 3, ny: -1}], 'park', [2], -0.5, -0.5);

        // map bottom-left line
        placeSpecialObjects([{nx: 0, ny: 3}, {nx: 1, ny: 3}, {nx: 2, ny: 3}, {nx: 3, ny: 3}], 'park', [1], 1, -3);
        placeSpecialObjects([{nx: 0, ny: 3}, {nx: 1, ny: 3}, {nx: 2, ny: 3}, {nx: 3, ny: 3}], 'park', [0], 2, -2.5);
        placeSpecialObjects([{nx: 0, ny: 3}, {nx: 1, ny: 3}, {nx: 2, ny: 3}, {nx: 3, ny: 3}], 'park', [0], 3.5, -2.5);
        placeSpecialObjects([{nx: 0, ny: 3}, {nx: 1, ny: 3}, {nx: 2, ny: 3}, {nx: 3, ny: 3}], 'park', [2], 4.5, -3);

        placeSpecialObjects([{nx: 3, ny: 3}], 'park', [0], -3, -2.5);
        placeSpecialObjects([{nx: 3, ny: 3}], 'park', [0], -1.5, -2.5);
        placeSpecialObjects([{nx: 3, ny: 3}], 'park', [2], -0.5, -3);

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
                    cell.properties.imageSrc = `assets/objects/${cell.properties.neighborhoodType}-${cell.properties.neighborhoodVariant}.png`;
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

    static cell(cellType, properties = {}) {
        if (cellType === TILE_TYPES.NEIGHBORHOOD) {
            const neighborhood = MapGenerator.randomNeighborhood();
            return {
                type: cellType,
                properties: {
                    neighborhoodType: properties.neighborhoodType ?? neighborhood.type,
                    neighborhoodVariant: properties.neighborhoodVariant ?? neighborhood.variant,
                    possibleDirections: [],
                    imageSrc: 'assets/objects/house.png',
                },
            };
        }

        return {
            type: cellType,
            properties: {
                possibleDirections: [],
                imageSrc: `/assets/tiles/${cellType}.png`,
            },
        };
    }

    static randomNeighborhood() {
        const random = Math.random();
        let sum = 0;
        for (const [type, { probability }] of Object.entries(MapGenerator.neighborhoodType)) {
            sum += probability;
            if (random < sum) {
                const variant = Math.floor(Math.random() * MapGenerator.neighborhoodType[type].variants);
                return {type, variant};
            }
        }
        console.error("a48d4217-8521-46b5-84f5-b4884ba3baad", "unexpected random value to be greater than ", sum);
        return undefined;
    }
}

export {MapGenerator, GameMap};
