import {ROAD_DIRECTION} from "./Road.js";
import {TILE_TYPES} from "./PatternMatcher.js";

class Path {
    constructor() {
        this.path = [];
    }

    setPath(path) {
        this.path = path;
    }

    getSteps() {
        return this.path;
    }

    getInitialDirection() {
        return this.path[0].direction;
    }
}

class Pathfinding {
    constructor(map) {
        this.map = map;
        this.directions = {
            up: { x: 0, y: -1, name: ROAD_DIRECTION.UP },
            right: { x: 1, y: 0, name: ROAD_DIRECTION.RIGHT },
            down: { x: 0, y: 1, name: ROAD_DIRECTION.DOWN },
            left: { x: -1, y: 0, name: ROAD_DIRECTION.LEFT },
        };
    }

    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    isWalkable(x, y, fromDirection) {
        const tile = this.map[y] && this.map[y][x];
        return tile && tile.type === TILE_TYPES.ROAD && tile.properties.possibleDirections.includes(fromDirection);
    }

    findShortestPath(start, end) {
        const openSet = [start];
        const cameFrom = new Map();
        const gScore = new Map([[this.key(start), 0]]);
        const fScore = new Map([[this.key(start), this.heuristic(start, end)]]);

        while (openSet.length > 0) {
            openSet.sort((a, b) => fScore.get(this.key(a)) - fScore.get(this.key(b)));
            const current = openSet.shift();
            if (current.x === end.x && current.y === end.y) {
                return this.reconstructPath(cameFrom, current);
            }

            for (const direction of Object.values(this.directions)) {
                const neighbor = { x: current.x + direction.x, y: current.y + direction.y };
                if (!this.isWalkable(neighbor.x, neighbor.y, direction.name)) continue;

                const tentativeGScore = gScore.get(this.key(current)) + 1;
                if (tentativeGScore < (gScore.get(this.key(neighbor)) || Infinity)) {
                    cameFrom.set(this.key(neighbor), { ...current, direction: direction.name });
                    gScore.set(this.key(neighbor), tentativeGScore);
                    fScore.set(this.key(neighbor), tentativeGScore + this.heuristic(neighbor, end));
                    if (!openSet.some(p => p.x === neighbor.x && p.y === neighbor.y)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }

        return new Path(); // Return an empty path if no path is found
    }

    key(point) {
        return `${point.x},${point.y}`;
    }

    reconstructPath(cameFrom, current) {
        const pathSteps = [current];
        const path = new Path();
        while (cameFrom.has(this.key(current))) {
            current = cameFrom.get(this.key(current));
            pathSteps.unshift(current);
        }
        path.setPath(pathSteps);
        return path;
    }
}

export {Path, Pathfinding};