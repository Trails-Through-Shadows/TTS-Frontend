module HexGridMap {
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

        draw(ctx: CanvasRenderingContext2D, fillColor: Color, borderColor: Color, offset: Offset, textureImage: HTMLImageElement, borderImage: HTMLImageElement): void {
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
            ctx.fillStyle = texturePattern;
            ctx.strokeStyle = borderPattern;
            ctx.fill();
            ctx.stroke();
        }

        drawWall(ctx: CanvasRenderingContext2D, wallColor: Color, offset: Offset, borderImage: HTMLImageElement): void {
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

                ctx.fillStyle = borderPattern;
                ctx.fill();
            }

            ctx.restore();
        }
        /*
        drawCoordinates(ctx: CanvasRenderingContext2D, textColor: Color, offset: Offset): void {
            this.drawText(ctx, `${this.coords.q}, ${this.coords.r}, ${this.coords.s}`, textColor, offset);
        }

        drawText(ctx: CanvasRenderingContext2D, text: string, textColor: Color, offset: Offset, scale: number = 1): void {
            const {x, y} = this.coords.to2D(this.hexSize);

            ctx.fillStyle = textColor.toHEX();
            ctx.font = (12 * scale) +'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

            ctx.fillText(text, offset.x + x, offset.y + y + scale);
        }
        */

        getNeighbor(direction: CubeCoordinate): Hex {
            return this.neighbors.find(hex => hex.coords.equals(this.coords.add(direction))) || null;
        }
    }
}