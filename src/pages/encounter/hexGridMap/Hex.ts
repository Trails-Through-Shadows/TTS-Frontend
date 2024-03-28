import { CubeCoordinate } from "./Coordinate";

    export interface Vertex {
        x: number;
        y: number;
    }

    export interface Edge {
        start: Vertex;
        end: Vertex;
    }

    export interface Offset {
        x: number;
        y: number;
    }

    export class Hex {
        public vertices: Vertex[] = [];
        public isStart: boolean = false;
        public isDoor: boolean = false;
        public entityImage?: HTMLImageElement;

        constructor(
            public readonly idPart: number,
            public readonly id: number,
            public readonly coords: CubeCoordinate,
            public readonly hexSize: number = 50,
            public neighbors: Hex[] = [],
        ) {
            this.vertices = this.calculateVertices(this.hexSize);
        }

        calculateVertices(hexSize: number): Vertex[] {
            const vertices = [];

            for (let i = 0; i < 6; i++) {
                const angleDegrees = 60 * i + 30;
                const angleRadians = Math.PI / 180 * angleDegrees;

                vertices.push({
                    x: hexSize * Math.cos(angleRadians),
                    y: hexSize * Math.sin(angleRadians)
                });
            }

            return vertices;
        }

        draw(ctx: CanvasRenderingContext2D, textureImage: HTMLImageElement, borderImage: HTMLImageElement, offset: Offset): void {
            const {x, y} = this.coords.to2D(this.hexSize);

            // Draw hex vertices
            ctx.beginPath();
            this.vertices.forEach((vertex, index) => {
                if (index === 0) {
                    ctx.moveTo(offset.x + x + vertex.x, offset.y + y + vertex.y);
                } else {
                    ctx.lineTo(offset.x + x + vertex.x, offset.y + y + vertex.y);
                }
            });
            ctx.closePath();
            
            const texturePattern = ctx.createPattern(textureImage, 'repeat');
            const borderPattern = ctx.createPattern(borderImage, 'repeat');

            ctx.lineWidth = 3;

            if (texturePattern) {
                ctx.fillStyle = texturePattern;
            }
            
            if (borderPattern) {
                ctx.strokeStyle = borderPattern;
            }

            if (this.isStart) {
                ctx.fillStyle = 'rgba(186, 255, 140, 0.5)';
            }

            if (this.isDoor) {
                ctx.fillStyle = 'rgba(123, 90, 163, 0.5)';
            }

            ctx.fill();
            ctx.stroke();

            if (this.isDoor) {
                this.drawDoor(ctx, offset);
            }
            else if (this.entityImage) {
                this.drawEntity(ctx, this.entityImage, offset);
            }
        }

        drawWall(ctx: CanvasRenderingContext2D, borderImage: HTMLImageElement, offset: Offset): void {
            const {x, y} = this.coords.to2D(this.hexSize);
            ctx.save();

            const borderPattern = ctx.createPattern(borderImage, 'repeat');

            if (this.neighbors.length != 6) {
                const borderHexes = this.calculateVertices(this.hexSize * 1.2);

                ctx.beginPath();
                borderHexes.forEach((edge, index) => {
                    if (index === 0) {
                        ctx.moveTo(offset.x + x + edge.x, offset.y + y + edge.y);
                    } else {
                        ctx.lineTo(offset.x + x + edge.x, offset.y + y + edge.y);
                    }
                });
                ctx.closePath();

                if (borderPattern) {
                    ctx.fillStyle = borderPattern;
                }
                ctx.fill();
            }

            ctx.restore();
        }

        drawDoor(ctx: CanvasRenderingContext2D, offset: Offset): void {
            if (!this.entityImage) return;

            const {x, y} = this.coords.to2D(this.hexSize);

            const doorHeight = this.hexSize * 1.5;
            const doorWidth = this.hexSize * 1.1;

            ctx.drawImage(this.entityImage, offset.x + x - doorWidth / 2, offset.y + y - doorHeight / 2 - 5, doorWidth, doorHeight);
        }

        drawEntity(ctx: CanvasRenderingContext2D, entityImage: HTMLImageElement, offset: Offset): void {
            const {x, y} = this.coords.to2D(this.hexSize);

            const enemyHeight = this.hexSize * 1.2;
            const enemyWidth = (entityImage.height / entityImage.width) * enemyHeight;

            ctx.drawImage(entityImage, offset.x + x - enemyWidth / 2, offset.y + y - enemyHeight / 2, enemyWidth, enemyHeight);
        }

        setEntityImage(image: HTMLImageElement): void {
            this.entityImage = image;
        }

        getNeighbor(direction: CubeCoordinate): Hex | null {
            return this.neighbors.find(hex => hex.coords.equals(this.coords.add(direction))) || null;
        }
    }