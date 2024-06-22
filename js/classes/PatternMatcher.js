import {ROAD_DIRECTION} from "./Road.js";

const TILE_TYPES = {
    GRASS: 'grass',
    SIDEWALK: 'sidewalk',
    ROAD: 'road',
    NEIGHBORHOOD: 'neighborhood',
    NOTHING: 'nothing',
};

const TILE_IMAGE_PATTERN_RULES = [
    {
        pattern: [
            [undefined, undefined, undefined],
            [undefined, TILE_TYPES.GRASS, undefined],
            [undefined, undefined, undefined],
        ],
        value: 'assets/tiles/grass.png'
    },
    {
        pattern: [
            [undefined, undefined, undefined],
            [undefined, TILE_TYPES.NOTHING, undefined],
            [undefined, undefined, undefined],
        ],
        value: 'assets/tiles/grass.png'
    },
    {
        pattern: [
            [undefined, undefined, undefined],
            [TILE_TYPES.SIDEWALK, TILE_TYPES.SIDEWALK, TILE_TYPES.SIDEWALK],
            [undefined, undefined, undefined],
        ],
        value: 'assets/tiles/sidewalk-horizontal.png'
    },
    {
        pattern: [
            [undefined, TILE_TYPES.SIDEWALK, undefined],
            [undefined, TILE_TYPES.SIDEWALK, undefined],
            [undefined, TILE_TYPES.SIDEWALK, undefined],
        ],
        value: 'assets/tiles/sidewalk-vertical.png'
    },
    {
        pattern: [
            [undefined, TILE_TYPES.SIDEWALK, undefined],
            [undefined, TILE_TYPES.SIDEWALK, TILE_TYPES.SIDEWALK],
            [undefined, undefined, undefined],
        ],
        value: 'assets/tiles/sidewalk-corner-0.png'
    },
    {
        pattern: [
            [undefined, TILE_TYPES.SIDEWALK, undefined],
            [TILE_TYPES.SIDEWALK, TILE_TYPES.SIDEWALK, undefined],
            [undefined, undefined, undefined],
        ],
        value: 'assets/tiles/sidewalk-corner-270.png'
    },
    {
        pattern: [
            [undefined, undefined, undefined],
            [TILE_TYPES.SIDEWALK, TILE_TYPES.SIDEWALK, undefined],
            [undefined, TILE_TYPES.SIDEWALK, undefined],
        ],
        value: 'assets/tiles/sidewalk-corner-180.png'
    },
    {
        pattern: [
            [undefined, undefined, undefined],
            [undefined, TILE_TYPES.SIDEWALK, TILE_TYPES.SIDEWALK],
            [undefined, TILE_TYPES.SIDEWALK, undefined],
        ],
        value: 'assets/tiles/sidewalk-corner-90.png'
    },
    {
        pattern: [
            [undefined, TILE_TYPES.ROAD, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.SIDEWALK],
            [undefined, TILE_TYPES.ROAD, undefined],
        ],
        value: 'assets/tiles/road-vertical-b.png'
    },
    {
        pattern: [
            [undefined, TILE_TYPES.ROAD, undefined],
            [TILE_TYPES.SIDEWALK, TILE_TYPES.ROAD, undefined],
            [undefined, TILE_TYPES.ROAD, undefined],
        ],
        value: 'assets/tiles/road-vertical-a.png'
    },
    {
        pattern: [
            [undefined, TILE_TYPES.ROAD, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.GRASS],
            [undefined, TILE_TYPES.ROAD, undefined],
        ],
        value: 'assets/tiles/road-vertical-b.png'
    },
    {
        pattern: [
            [undefined, TILE_TYPES.ROAD, undefined],
            [TILE_TYPES.GRASS, TILE_TYPES.ROAD, undefined],
            [undefined, TILE_TYPES.ROAD, undefined],
        ],
        value: 'assets/tiles/road-vertical-a.png'
    },

    {
        pattern: [
            [undefined, undefined, undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [undefined, TILE_TYPES.SIDEWALK, undefined],
        ],
        value: 'assets/tiles/road-horizontal-a.png'
    },
    {
        pattern: [
            [undefined, TILE_TYPES.SIDEWALK, undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [undefined, undefined, undefined],
        ],
        value: 'assets/tiles/road-horizontal-b.png'
    },
    {
        pattern: [
            [undefined, undefined, undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [undefined, TILE_TYPES.GRASS, undefined],
        ],
        value: 'assets/tiles/road-horizontal-a.png'
    },
    {
        pattern: [
            [undefined, TILE_TYPES.GRASS, undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [undefined, undefined, undefined],
        ],
        value: 'assets/tiles/road-horizontal-b.png'
    },
    {
        pattern: [
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.SIDEWALK],
        ],
        value: 'assets/tiles/road-cross-0.png'
    },
    {
        pattern: [
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.SIDEWALK],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
        ],
        value: 'assets/tiles/road-cross-270.png'
    },
    {
        pattern: [
            [TILE_TYPES.SIDEWALK, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
        ],
        value: 'assets/tiles/road-cross-180.png'
    },
    {
        pattern: [
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.SIDEWALK, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
        ],
        value: 'assets/tiles/road-cross-90.png'
    },
    {
        pattern: [
            [TILE_TYPES.GRASS, TILE_TYPES.GRASS, TILE_TYPES.GRASS],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.GRASS],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.GRASS],
        ],
        value: 'assets/tiles/road-corner-180.png'
    },
    {
        pattern: [
            [TILE_TYPES.GRASS, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.GRASS, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.GRASS, TILE_TYPES.GRASS, TILE_TYPES.GRASS],
        ],
        value: 'assets/tiles/road-corner-0.png'
    },
];

const ROAD_DIRECTION_PATTERN_RULES = [
    {
        pattern: [
            [undefined, undefined, undefined, undefined, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], undefined],
            [undefined, undefined, undefined, undefined, undefined],
        ],
        value: [ROAD_DIRECTION.UP, ROAD_DIRECTION.RIGHT]
    },
    {
        pattern: [
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [
                undefined,
                [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK],
                [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK],
                [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK],
                undefined
            ],
            [undefined, undefined, undefined, undefined, undefined],
        ],
        value: [ROAD_DIRECTION.UP, ROAD_DIRECTION.RIGHT]
    },
    {
        pattern: [
            [undefined, undefined, undefined, undefined, undefined],
            [undefined, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD,                   TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, undefined,                               TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, undefined, undefined, undefined, undefined],
        ],
        value: [ROAD_DIRECTION.DOWN, ROAD_DIRECTION.LEFT]
    },
    {
        pattern: [
            [undefined, undefined, undefined, undefined, undefined],
            [undefined, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined,       undefined,       TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined,       undefined,       TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
        ],
        value: [ROAD_DIRECTION.DOWN, ROAD_DIRECTION.LEFT]
    },
    {
        pattern: [
            [undefined, undefined, TILE_TYPES.ROAD, undefined, undefined],
            [undefined, undefined, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, undefined, undefined, undefined, undefined],
        ],
        value: [ROAD_DIRECTION.LEFT, ROAD_DIRECTION.UP]
    },
    {
        pattern: [
            [undefined, undefined, TILE_TYPES.ROAD, undefined, undefined],
            [undefined, undefined, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], undefined],
            [undefined, undefined, undefined, undefined, undefined],
        ],
        value: [ROAD_DIRECTION.LEFT, ROAD_DIRECTION.UP]
    },
    {
        pattern: [
            [undefined, undefined, undefined, undefined, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, [TILE_TYPES.GRASS,
                TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, undefined, undefined],
            [undefined, undefined, TILE_TYPES.ROAD, undefined, undefined],
        ],
        value: [ROAD_DIRECTION.DOWN, ROAD_DIRECTION.RIGHT],
    },
    {
        pattern: [
            [undefined, undefined, undefined, undefined, undefined],
            [undefined, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [undefined, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [undefined, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, undefined, undefined],
            [undefined, undefined,TILE_TYPES.ROAD,undefined,undefined],
        ],
        value: [ROAD_DIRECTION.DOWN, ROAD_DIRECTION.RIGHT],
    },

    {
        pattern: [
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
        ],
        value: [ROAD_DIRECTION.UP]
    },
    {
        pattern: [
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
        ],
        value: [ROAD_DIRECTION.UP]
    },

    {
        pattern: [
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
        ],
        value: [ROAD_DIRECTION.LEFT]
    },
    {
        pattern: [
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
        ],
        value: [ROAD_DIRECTION.LEFT]
    },

    {
        pattern: [
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD],
        ],
        value: [ROAD_DIRECTION.DOWN]
    },
    {
        pattern: [
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD],
        ],
        value: [ROAD_DIRECTION.DOWN]
    },

    {
        pattern: [
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
        ],
        value: [ROAD_DIRECTION.RIGHT],
    },
    {
        pattern: [
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [[TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK], [TILE_TYPES.GRASS, TILE_TYPES.SIDEWALK]],
        ],
        value: [ROAD_DIRECTION.RIGHT],
    },

    // Straight road
    {
        pattern: [
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined, undefined],
            [undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined, undefined],
        ],
        value: [ROAD_DIRECTION.UP]
    },
    {
        pattern: [
            [undefined, undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
            [undefined, undefined, TILE_TYPES.ROAD, TILE_TYPES.ROAD, undefined],
        ],
        value: [ROAD_DIRECTION.DOWN]
    },
    {
        pattern: [
            [undefined, undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined, undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [undefined, undefined, undefined, undefined, undefined],
        ],
        value: [ROAD_DIRECTION.LEFT]
    },
    {
        pattern: [
            [undefined, undefined, undefined, undefined, undefined],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD, TILE_TYPES.ROAD],
            [undefined, undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined, undefined],
        ],
        value: [ROAD_DIRECTION.RIGHT]
    },

    // {
    //     pattern: [],
    //     value: [ROAD_DIRECTION.UP, ROAD_DIRECTION.RIGHT]
    // },
];

class PatternMatcher {
    constructor(patternRules) {
        this.patternRules = patternRules;
    }

    matchPattern(map, x, y) {
        for (const rule of this.patternRules) {
            const { pattern, value } = rule;
            const patternSize = pattern.length;
            const offset = Math.floor(patternSize / 2);
            let match = true;

            for (let dy = -offset; dy <= offset; dy++) {
                for (let dx = -offset; dx <= offset; dx++) {
                    const tileX = x + dx;
                    const tileY = y + dy;
                    const patternTile = pattern[dy + offset][dx + offset];
                    const mapTile = (map[tileY] && map[tileY][tileX]) || undefined;

                    if (patternTile !== undefined) {
                        if (Array.isArray(patternTile)) {
                            if (!patternTile.includes(mapTile?.type)) {
                                match = false;
                                break;
                            }
                        } else if (patternTile !== mapTile?.type) {
                            match = false;
                            break;
                        }
                    }
                }
                if (!match) break;
            }

            if (match) {
                return value;
            }
        }

        return undefined;
    }
}

export {TILE_TYPES, TILE_IMAGE_PATTERN_RULES, ROAD_DIRECTION_PATTERN_RULES, PatternMatcher};
