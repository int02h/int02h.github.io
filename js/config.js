const Config = {
    map: {
        neighborhoodCount: 16,
        neighborhoodSize: 6,
        sidewalkSize: 1,
        roadSize: 2,
        borderSize: 3,
    },
    objectTypes: [
        'house-0.png',
        'house-1.png',
        'house-2.png',
        'house-3.png',
        'house-4.png',
        'house-5.png',
        'house-6.png',
        'parking-0.png',
        'parking-1.png',
        'parking-2.png',
        'park-0.png',
        'park-1.png',
        'shop-0.png',
        'gas-0.png',
        'office-0.png',
        'factory-0.png',
        'factory-1.png',
    ],
    drawing: {
        tileSize: { width: 62, height: 32 },
        canvasMargin: 100,
        extraWidth: 200,
    },
    animationTickPerSecond: 10,
    calculationTickPerSecond: 5,
}

export {Config};