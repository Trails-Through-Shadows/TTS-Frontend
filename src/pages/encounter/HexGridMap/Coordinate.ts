    export interface Pixel {
        x: number;
        y: number;
    }

    export class CubeCoordinate {
        public static directions: CubeCoordinate[] = [
            new CubeCoordinate(1, 0, -1),
            new CubeCoordinate(1, -1, 0),
            new CubeCoordinate(0, -1, 1),
            new CubeCoordinate(-1, 0, 1),
            new CubeCoordinate(-1, 1, 0),
            new CubeCoordinate(0, 1, -1)
        ];

        constructor(
            public readonly q: number,
            public readonly r: number,
            public readonly s: number,
        ) {}

        public static from2D(x: number, y: number, hexSize: number): CubeCoordinate {
            const q = (Math.sqrt(3) / 3 * x - 1. / 3 * y) / hexSize;
            const r = (2. / 3 * y) / hexSize;
            const s = -q - r;

            // Round to nearest cube coordinate
            // https://www.redblobgames.com/grids/hexagons/#rounding
            // -------------------------------

            let rx = Math.round(q);
            let ry = Math.round(r);
            let rz = Math.round(s);

            const xDiff = Math.abs(rx - q);
            const yDiff = Math.abs(ry - r);
            const zDiff = Math.abs(rz - s);

            if (xDiff > yDiff && xDiff > zDiff) {
                rx = -ry - rz;
            } else if (yDiff > zDiff) {
                ry = -rx - rz;
            } else {
                rz = -rx - ry;
            }

            return new CubeCoordinate(rx, ry, rz);
        }

        public to2D(hexSize: number): Pixel {
            const x = hexSize * (Math.sqrt(3) * this.q + Math.sqrt(3) / 2 * this.r);
            const y = hexSize * (3 / 2 * this.r);
            return {x, y};
        }

        public isZero(): boolean {
            return this.q === 0 && this.r === 0 && this.s === 0;
        }

        public add(other: CubeCoordinate): CubeCoordinate {
            return new CubeCoordinate(this.q + other.q, this.r + other.r, this.s + other.s);
        }

        public equals(other: CubeCoordinate): boolean {
            return this.q === other.q && this.r === other.r && this.s === other.s;
        }
    }