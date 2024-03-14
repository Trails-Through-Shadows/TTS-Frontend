import { Canvas } from "./Canvas";
import { CubeCoordinate } from "./Coordinate";
import { Hex, type Offset } from "./Hex";
import { Color } from "./Color";

export interface BoundingBox {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

type HexEntity = {
    title: string;
    coords: CubeCoordinate;
    url: string;
    image: HTMLImageElement;
}

export class HexGrid {
    public hoveredHex: Hex | null = null;
    public entities: HexEntity[] = [];

    constructor(
        public id: number,
        private canvas: Canvas,
        private hexes: Hex[] = [],
        private textureImage: any,
        private borderImage: any,
        private hexSize: number = 50,
    ) {
        /*
        this.canvas.addOnMouseHoverListener((x: number, y: number) => {
            if (this.canvas.isLoading()) {
                return;
            }

            const offset: Offset = this.getOffset();
            const coords = CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexSize);
            const hex = this.getHexAt(coords);

            // It's the same hex, ignore

            if (this.hoveredHex === hex) {
                return;
            }

            if (hex) {
                this.hoveredHex = hex;
            } else {
                this.hoveredHex = null;
            }
        });
        */
        this.canvas.addOnMouseClickListener((x: number, y: number) => {
            if (this.canvas.isLoading()) {
                return;
            }
            const offset: Offset = this.getOffset();
            const coords = CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexSize);
            console.log("Clicked coordinates:", coords);
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

    addHexes(hexes: Hex[]): void {
        this.hexes.push(...hexes);
    }

    setTextures(textureImage: HTMLImageElement, borderImage: HTMLImageElement): void {
        this.textureImage = textureImage;
        this.borderImage = borderImage;
    }

    setEntities(entities: HexEntity[]): void {
        this.entities = entities;
    }

    addEntity(entity: HexEntity): void {
        this.entities.push(entity);
    }

    addStartHex(hex: CubeCoordinate): void {
        const startHex = this.getHexAt(hex);
        if (startHex) {
            startHex.isStart = true;
        }
    }
/*
    readData(url: string, callback?: () => void): void {
        this.canvas.setLoading(true);
        const currentTime = new Date().getTime();

        console.log(`HexGrid | Reading data from ${url}`);

        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                const data = JSON.parse(request.responseText);

                // Map enemies and obstacles
                this.entities = data['enemies'].map((enemy: any) => {
                    return {
                        title: enemy.title,
                        tag: enemy.tag,
                        coords: new CubeCoordinate(enemy.hex.q, enemy.hex.r, enemy.hex.s)
                    }
                });

                this.entities = data['obstacles'].map((obstacle: any) => {
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

    //mapData();
*/    
    getImages(): void {
        // get all unique enemy names
        const entityTitles = this.entities.map(entity => entity.title);

        let loaded = 0;

        // for each unique enemy name, get the image
        entityTitles.forEach(title => {
            const entity = this.entities.filter(entity => entity.title === title);
            if (entity) {
                const image = new Image();
                image.src = entity[0].url;
                image.onload = () => {
                    entity.forEach(e => e.image = image);
                    loaded++;

                    if (loaded === entityTitles.length) {
                        this.bindImages();
                    }
                }
            }
        });

        console.log('HexGrid | Images loaded');
    }

    bindImages(): void {
        this.entities.forEach((entity: HexEntity) => {
            const hex = this.hexes.find(hex => hex.coords.equals(entity.coords));
            if (hex) {
                hex.setEntityImage(entity.image);
                console.log(`HexGrid | ${entity.title} mapped to hex`);
            }
        });

        console.log('HexGrid | Entities mapped to hexes');
    }

    draw(): void {
        if (this.hexes.length === 0) return;
        const offset: Offset = this.getOffset();

        this.hexes.forEach(hex => {
            hex.drawWall(this.canvas.getContext(), this.borderImage, offset);
        });

        this.hexes.forEach(hex => {
            if (this.hoveredHex && this.hoveredHex.coords.equals(hex.coords)) {
                console.log('HexGrid | Hovered hex at', hex.coords);
            }

            hex.draw(this.canvas.getContext(), this.textureImage, this.borderImage, offset);
        });

        // this.drawBoundingBox(boundingBox, offset, hexSize);
        this.canvas.setDrawn();
    }

    drawBoundingBox(boundingBox: BoundingBox, offset: Offset, hexSize: number): void {
        const ctx = this.canvas.getContext();
        ctx.lineWidth = 2;
        ctx.strokeStyle = Color.RED.toRGB();

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
        ctx.fillStyle = Color.RED.toRGB();
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${width} x ${height}`, xPosition, yPosition);

        ctx.stroke();
    }

    private mapNeighbors(hex: Hex) {
        hex.neighbors = CubeCoordinate.directions.map(direction => {
            return this.getHexAt(hex.coords.add(direction));
        }).filter(neighbor => neighbor !== undefined && neighbor !== null) as Hex[];

        // Append hex to neighbors if not already present
        hex.neighbors.forEach(neighbor => {
            if (!neighbor.neighbors.find(n => n.coords.equals(hex.coords))) {
                neighbor.neighbors.push(hex);
            }
        });
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

    getHex(id: number): Hex | undefined {
        return this.hexes.find(hex => hex.id === id);
    }

    getHexAt(CubeCoordinate: CubeCoordinate): Hex | undefined {
        return this.hexes.find(hex => hex.coords.equals(CubeCoordinate));
    }

    getHexSize(): number {
        return this.hexSize;
    }
}