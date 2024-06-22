import { TILE_TYPES, TILE_IMAGE_PATTERN_RULES } from './PatternMatcher.js';

class ImageLoader {
    constructor(objectTypes) {
        this.objectTypes = objectTypes;
        this.imageStorage = {};
    }

    collectFilenames() {
        const filenames = new Set();

        // Collect filenames from TILE_TYPES
        for (const type in TILE_TYPES) {
            filenames.add(`assets/tiles/${TILE_TYPES[type]}.png`);
        }

        // Collect filenames from PATTERN_RULES
        for (const rule of TILE_IMAGE_PATTERN_RULES) {
            filenames.add(rule.value);
        }

        // Collect filenames for objects
        this.objectTypes.forEach(type => {
            filenames.add(`assets/objects/${type}`);
        });

        filenames.add('assets/objects/car-up.png');
        filenames.add('assets/objects/car-down.png');
        filenames.add('assets/objects/car-left.png');
        filenames.add('assets/objects/car-right.png');

        filenames.add('assets/objects/car.png');
        filenames.add('assets/tiles/grass-alt.png');

        return Array.from(filenames);
    }

    preloadImages(filenames, callback) {
        let loadedImages = 0;
        const totalImages = filenames.length;

        filenames.forEach(filename => {
            const img = new Image();
            img.src = filename;
            img.onload = () => {
                if (++loadedImages >= totalImages) {
                    callback();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${filename}`);
            };
            this.imageStorage[filename] = img;
        });
    }

    getImageStorage() {
        return this.imageStorage;
    }
}

export default ImageLoader;
