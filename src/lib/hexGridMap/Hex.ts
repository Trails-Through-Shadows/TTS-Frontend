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

        constructor(
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

        draw(ctx: CanvasRenderingContext2D, textureImage: HTMLImageElement, borderImage: HTMLImageElement, offset: Offset, enemyImage?: HTMLImageElement): void {
            const {x, y} = this.coords.to2D(this.hexSize);

            const texturePattern = ctx.createPattern(textureImage, 'repeat');
            const borderPattern = ctx.createPattern(borderImage, 'repeat');

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

            ctx.lineWidth = 3;

            if (texturePattern && borderPattern) {
                ctx.fillStyle = texturePattern;
                ctx.strokeStyle = borderPattern;
            }

            ctx.fill();
            ctx.stroke();

            if (enemyImage) {
                this.drawEnemy(ctx, enemyImage, offset);
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

        drawEnemy(ctx: CanvasRenderingContext2D, enemyImage: HTMLImageElement, offset: Offset): void {
            const {x, y} = this.coords.to2D(this.hexSize);

            const enemyHeight = this.hexSize * 1.2;
            const enemyWidth = (enemyImage.height / enemyImage.width) * enemyHeight;

            ctx.drawImage(enemyImage, offset.x + x - enemyWidth / 2, offset.y + y - enemyHeight / 2, enemyWidth, enemyHeight);
        }

        getNeighbor(direction: CubeCoordinate): Hex | null {
            return this.neighbors.find(hex => hex.coords.equals(this.coords.add(direction))) || null;
        }
    }