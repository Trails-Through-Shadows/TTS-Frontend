module HexGridMap {
    export class Color {
        static readonly RED = Color.fromHEX('#FF0000');
        static readonly GREEN = Color.fromHEX('#00FF00');
        static readonly BLUE = Color.fromHEX('#0000FF');
        static readonly YELLOW = Color.fromHEX('#FFFF00');
        static readonly CYAN = Color.fromHEX('#00FFFF');
        static readonly MAGENTA = Color.fromHEX('#FF00FF');
        static readonly ORANGE = Color.fromHEX('#FFA500');
        static readonly PURPLE = Color.fromHEX('#800080');
        static readonly PINK = Color.fromHEX('#FFC0CB');
        static readonly WHITE = Color.fromHEX('#FFFFFF');
        static readonly LIGHT_GREY = Color.fromHEX('#c0c0c0');
        static readonly GREY = Color.fromHEX('#808080');
        static readonly DARK_GREY = Color.fromHEX('#404040');
        static readonly BLACK = Color.fromHEX('#000000');

        constructor(
            public r: number,
            public g: number,
            public b: number,
            private a: number = 1
        ) {}

        static fromHEX(hex: string): Color {
            hex = hex.replace('#', '');

            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }

            const [r, g, b] = hex.match(/.{2}/g).map(char => parseInt(char, 16));
            return new Color(r, g, b);
        }

        toHEX(): string {
            return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
        }

        toRGB(): string {
            if (this.a != 1) {
                return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
            }

            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }
    }
}