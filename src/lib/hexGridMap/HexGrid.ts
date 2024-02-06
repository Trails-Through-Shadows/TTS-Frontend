import { Canvas } from "./Canvas";
import { CubeCoordinate } from "./Coordinate";
import { Hex, type Offset } from "./Hex";

export interface BoundingBox {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

type HexEnemy = {
    title: string;
    tag: string | null;
    coords: CubeCoordinate;
    image: HTMLImageElement;
}

type HexObstacle = {
    title: string;
    tag: string | null;
    coords: CubeCoordinate;
    image: HTMLImageElement;
}

export class HexGrid {
    private hoveredHex: Hex | null = null;
    private textureImage: any;
    private borderImage : any;
    private enemies: HexEnemy[] = [];
    private obstacles: HexObstacle[] = [];

    constructor(
        private canvas: Canvas,
        private hexSize: number,
        private hexes: Hex[] = [],
    ) {
        this.canvas.addOnMouseHoverListener((x: number, y: number) => {
            const offset: Offset = this.getOffset();

            const coord = CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexSize);
            let hex = this.hexes.find(hex => hex.coords.equals(coord));

            if (hex) {
                this.hoveredHex = hex;
            } else {
                this.hoveredHex = null;
            }
        });
    }

    adjustCanvasHeight(): void {
        let {minY, maxY} = this.getBoundingBox();
        minY = Math.abs(minY);
        maxY = Math.abs(maxY);

        this.canvas.resize(undefined, ((minY + maxY) * 2) + this.hexes[0].hexSize * 4);
        console.log(`HexGrid | Adjusted canvas height to ${this.canvas.getHeight()}`);
    }

    setHexes(hexes: Hex[]): void {
        this.hexes = hexes;
    }

    setTextures(textureImage: HTMLImageElement, borderImage: HTMLImageElement): void {
        this.textureImage = textureImage;
        this.borderImage = borderImage;
    }

    readData(url: string, textureImage: HTMLImageElement, borderImage: HTMLImageElement, callback?: () => void): void {
        this.canvas.setLoading(true);
        const currentTime = new Date().getTime();

        console.log(`HexGrid | Reading data from ${url}`);

        this.textureImage = textureImage;
        this.borderImage = borderImage;

        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                const data = JSON.parse(request.responseText);

                // Map enemies and obstacles
                this.enemies = data['enemies'].map((enemy: any) => {
                    return {
                        title: enemy.title,
                        tag: enemy.tag,
                        coords: new CubeCoordinate(enemy.hex.q, enemy.hex.r, enemy.hex.s)
                    }
                });

                this.obstacles = data['obstacles'].map((obstacle: any) => {
                    return {
                        title: obstacle.title,
                        tag: obstacle.tag,
                        coords: new CubeCoordinate(obstacle.hex.q, obstacle.hex.r, obstacle.hex.s)
                    }
                });

                // Map hexes
                this.hexes = data['hexes'].map((coords: CubeCoordinate) => {
                    return new Hex(new CubeCoordinate(coords.q, coords.r, coords.s), this.hexSize, []);
                })

                // Map hex neighbors
                this.hexes.forEach(hex => this.mapNeighbors(hex));

                const took = new Date().getTime() - currentTime;
                console.log(`HexGrid | Data read in ${took}ms`);

                this.getImages();

                this.canvas.setLoading(false);
                // this.adjustCanvasHeight();
                this.draw();

                if (callback) callback();
            }
        };

        request.open('GET', url, true);
        request.send();
    }
    
    getImages(): void {
        // get all unique enemy names
        const enemyTitles = [...new Set(this.enemies.map(enemy => enemy.title))];
        const obstacleTitles = [...new Set(this.obstacles.map(obstacle => obstacle.title))];

        let loaded = 0;

        // for each unique enemy name, get the image
        enemyTitles.forEach(title => {
            const image = new Image();
            //image.src = `./assets/${title}.png`;
            image.src = `./assets/enemy.png`;
            image.onload = () => {
                this.enemies.filter(enemy => enemy.title === title).map(enemy => {
                    enemy.image = image;
                    console.log(`Image loaded for enemy: ${enemy.title}`);
                });
                if (++loaded === enemyTitles.length + obstacleTitles.length) this.bindImages();
            }
        });

        // for each unique obstacle name, get the image
        obstacleTitles.forEach(title => {
            const image = new Image();
            //image.src = `./assets/${title}.png`;
            image.src = `./assets/obstacle.png`;
            console.log(image.src);
            image.onload = () => {
                this.obstacles.filter(obstacle => obstacle.title === title).map(obstacle => {
                    obstacle.image = image;
                    console.log(`Image loaded for obstacle: ${obstacle.title}`);
                });
                if (++loaded === enemyTitles.length + obstacleTitles.length) this.bindImages();
            }
        });

        console.log('HexGrid | Images loaded');
    }

    bindImages(): void {
        this.enemies.forEach(enemy => {
            const hex = this.hexes.find(hex => hex.coords.equals(enemy.coords));
            if (hex) {
                hex.entityImage = enemy.image;
                console.log('HexGrid | Enemy mapped to hex');
            }
        });

        this.obstacles.forEach(obstacle => {
            const hex = this.hexes.find(hex => hex.coords.equals(obstacle.coords));
            if (hex) {
                hex.entityImage = obstacle.image;
            }
        });

        console.log('HexGrid | Entities mapped to hexes');
    }

    draw(): void {
        if (this.hexes.length === 0) return;

        const hexSize = this.hexes[0].hexSize;
        const offset: Offset = this.getOffset();

        this.hexes.forEach(hex => {
            hex.drawWall(this.canvas.getContext(), this.borderImage, offset);
        });

        this.hexes.forEach(hex => {
            hex.draw(this.canvas.getContext(), this.textureImage, this.borderImage, offset);
        });

        this.canvas.setDrawn();
        console.log(`HexGrid | Drawn ${this.hexes.length} hexes`);
    }

    drawBoundingBox(boundingBox: BoundingBox, offset: Offset, hexSize: number): void {
        const ctx = this.canvas.getContext();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#F00';

        // Draw bounding box
        ctx.beginPath();
        ctx.moveTo(offset.x + boundingBox.minX - hexSize, offset.y + boundingBox.minY - hexSize);
        ctx.lineTo(offset.x + boundingBox.minX - hexSize, offset.y + boundingBox.maxY + hexSize);
        ctx.lineTo(offset.x + boundingBox.maxX + hexSize, offset.y + boundingBox.maxY + hexSize);
        ctx.lineTo(offset.x + boundingBox.maxX + hexSize, offset.y + boundingBox.minY - hexSize);
        ctx.closePath();

        const width = Math.floor(boundingBox.maxX - boundingBox.minX);
        const height = Math.floor(boundingBox.maxY - boundingBox.minY);

        const xPosition = offset.x + boundingBox.maxX + hexSize;
        const yPosition = offset.y + boundingBox.maxY + hexSize * 1.5;

        // Draw bounding box dimensions
        ctx.fillStyle = '#F00';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${width} x ${height}`, xPosition, yPosition);

        ctx.stroke();
    }

    private mapNeighbors(hex: Hex) {
        console.log(hex);

        hex.neighbors = CubeCoordinate.directions.map(direction => {
            console.log(hex.coords);

            const neighbor = direction.add(hex.coords);
            return this.hexes.find(hex => hex.coords.equals(neighbor));
        }).filter(neighbor => neighbor !== undefined) as Hex[];
    }

    getBoundingBox(): BoundingBox {
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;

        this.hexes.forEach(hex => {
            const {x, y} = hex.coords.to2D(hex.hexSize);

            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        });

        return {
            minX: minX - this.hexSize + 3,
            maxX: maxX + this.hexSize - 3,
            minY: minY - this.hexSize,
            maxY: maxY + this.hexSize,
        };
    }

    getOffset(): Offset {
        const boundingBox = this.getBoundingBox();

        return {
            x: this.canvas.getWidth() / 2 - ((boundingBox.minX + boundingBox.maxX) / 2),
            y: this.canvas.getHeight() / 2 - ((boundingBox.minY + boundingBox.maxY) / 2)
        };
    }

    getHexes(): Hex[] {
        return this.hexes;
    }

    addHexAt(CubeCoordinate: CubeCoordinate): void {
        const hex = new Hex(CubeCoordinate, this.hexSize, []);
        this.mapNeighbors(hex);
        this.hexes.push(hex);
    }

    removeHex(Hex: Hex): void {
        this.hexes.splice(this.hexes.indexOf(Hex), 1);
    }

    getHexAt(CubeCoordinate: CubeCoordinate): Hex | undefined {
        return this.hexes.find(hex => hex.coords.equals(CubeCoordinate));
    }

    getHexSize(): number {
        return this.hexSize;
    }
}