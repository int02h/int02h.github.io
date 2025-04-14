class IsometricCanvas {
    CONTENT_SHIFT = 200;

    constructor(ctx, geometry) {
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;

        this.width = geometry.width;
        this.height = geometry.height;

        this.tileSize = geometry.tileSize;
    }

    draw(x, y, image, shift, type) {
        const halfTileWidth = this.tileSize.width / 2;
        const halfTileHeight = this.tileSize.height / 2;

        if (image) {
            const isoX = this.CONTENT_SHIFT + (x - y) * (halfTileWidth + 1) + (this.width / 2) - halfTileWidth;
            const isoY = (x + y) * (halfTileHeight / 2 + 8) + 25;
            this.ctx.drawImage(image, isoX, isoY - shift, this.tileSize.width, this.tileSize.height + shift);
        } else {
            console.error(`Missing canvas image for source: ${image}, ${x}, ${y}`);
            console.log(type);
        }
    }

    drawObject(x, y, image) {
        const halfTileWidth = this.tileSize.width / 2;
        const halfTileHeight = this.tileSize.height / 2;

        if (image) {
            const isoX = this.CONTENT_SHIFT + (x - y) * (halfTileWidth + 1) + (this.width / 2) - halfTileWidth;
            const isoY = (x + y) * (halfTileHeight / 2 + 8) + 25;
            this.ctx.drawImage(image, Math.floor(isoX - image.width / 4), isoY - 137, image.width, image.height);
        } else {
            console.error(`Missing object image for source: ${image}`);
        }
    }

    canvasToMapCoords(isoX, isoY) {
        const halfTileWidth = this.tileSize.width / 2;
        const halfTileHeight = this.tileSize.height / 2;

        const i = halfTileWidth + 1;
        const j = halfTileHeight / 2 + 8;

        const mapX = ((isoX + halfTileWidth - (this.width / 2 + this.CONTENT_SHIFT)) / (this.tileSize.width / 2 + 2) + (isoY - 40) / ((this.tileSize.height + 1) / 2 )) / 1.94;
        const mapY = ( (isoY - 8) / (this.tileSize.height / 2) - (isoX + halfTileWidth - (this.width / 2 + this.CONTENT_SHIFT)) / (this.tileSize.width / 2 + 2) * 1.035 ) / 2;

        return { x: Math.floor(mapX), y: Math.floor(mapY) };
    }


    getHashColor(x, y) {
        const str = (x * x + 1).toString() + ',' + (y * y + 1).toString();

        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }

        let color = '#';
        for (let i = 0; i < 3; i++) {
            color += ('00' + ((hash >> (i * 8)) & 0xFF).toString(16)).slice(-2);
        }

        return color + '1a';
    }

    drawMarkup() {
        for (let isoY = 0; isoY < this.height; isoY+=4) {
            for (let isoX = 0; isoX < this.width; isoX+=4) {
                const {x, y} = this.canvasToMapCoords(isoX, isoY);
                this.ctx.fillStyle = this.getHashColor(x + 10, y);
                this.ctx.fillRect(isoX - 2, isoY - 2, 4, 4);
            }
        }
    }
}

export default IsometricCanvas;