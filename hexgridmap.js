var HexGridMap;
(function (HexGridMap) {
    class Canvas {
        canvas;
        def;
        written = false;
        loading = false;
        backgroundImage;
        imageLoaded = false;
        width;
        height;
        onSizeListeners = [];
        addOnSizeListener(listener) {
            this.onSizeListeners.push(listener);
        }
        onMouseHoverListeners = [];
        addOnMouseHoverListener(listener) {
            this.onMouseHoverListeners.push(listener);
        }
        onMouseClickListeners = [];
        addOnMouseClickListener(listener) {
            this.onMouseClickListeners.push(listener);
        }
        constructor(canvas, def) {
            this.canvas = canvas;
            this.def = def;
            this.canvas = canvas;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.resize();
            // Override default screen text
            if (!def) {
                this.def = {
                    title: 'No Data',
                    subtitle: '',
                    spacer: 100
                };
            }
            // Loading animation task repeating every 10ms
            let counter = 0;
            setInterval(() => {
                if (this.loading) {
                    this.clear();
                    const top = 'Loading';
                    const bottom = '□'.repeat(15).split('');
                    bottom[counter % 15] = '■';
                    counter = (counter + 1) % 15;
                    this.title(top, bottom.join(''));
                }
            }, 100);
            // Register listeners
            this.registerListeners();
        }
        setBackgroundImage(src, callback) {
            this.backgroundImage = new Image();
            this.backgroundImage.src = src;
            this.backgroundImage.onload = () => {
                this.imageLoaded = true;
                if (callback)
                    callback();
            };
        }
        title(text, subtitle) {
            this.clear();
            const ctx = this.getContext();
            ctx.fillStyle = new HexGridMap.Color(255, 255, 255, 0.1).toRGB();
            ctx.shadowColor = new HexGridMap.Color(0, 0, 0, 0.75).toRGB();
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 6em Arial';
            ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - this.def.spacer / 2);
            if (subtitle.length > 0) {
                ctx.font = '2em Arial';
                const lines = subtitle.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + this.def.spacer / 2 + i * 30);
                }
            }
        }
        clear() {
            const ctx = this.getContext();
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.imageLoaded) {
                ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
            }
        }
        resize(width, height) {
            this.width = width || this.canvas.offsetWidth;
            this.height = height || this.canvas.offsetHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
        registerListeners() {
            const parent = this.canvas.parentElement;
            // Window resize observer
            const observer = new ResizeObserver(() => {
                this.resize();
                if (!this.written && !this.loading) {
                    this.title(this.def.title, this.def.subtitle);
                }
                this.onSizeListeners.forEach(listener => listener());
            });
            observer.observe(this.canvas);
            // Mouse hover listener
            this.canvas.addEventListener('mousemove', (event) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                this.onMouseHoverListeners.forEach(listener => listener(x, y));
            });
            // Mouse click listener
            this.canvas.addEventListener('click', (event) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                this.onMouseClickListeners.forEach(listener => listener(x, y));
            });
        }
        // ------------------------------
        getContentBoundingBox() {
            const imageData = this.getContext().getImageData(0, 0, this.canvas.width, this.canvas.height);
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            let minX = width;
            let minY = height;
            let maxX = 0;
            let maxY = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const alpha = data[(width * y + x) * 4 + 3];
                    if (alpha > 0) {
                        if (x < minX)
                            minX = x;
                        if (y < minY)
                            minY = y;
                        if (x > maxX)
                            maxX = x;
                        if (y > maxY)
                            maxY = y;
                    }
                }
            }
            return {
                minX,
                minY,
                maxX,
                maxY,
            };
        }
        getContext() {
            const ctx = this.canvas.getContext('2d');
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = HexGridMap.Color.WHITE.toRGB();
            ctx.strokeStyle = HexGridMap.Color.BLACK.toRGB();
            return ctx;
        }
        setCursor(cursor) {
            this.canvas.style.cursor = cursor;
        }
        getWidth() {
            return this.width;
        }
        getHeight() {
            return this.height;
        }
        setDrawn() {
            this.written = true;
        }
        isDrawn() {
            return this.written;
        }
        setLoading(loading) {
            this.loading = loading;
        }
        isLoading() {
            return this.loading;
        }
    }
    HexGridMap.Canvas = Canvas;
})(HexGridMap || (HexGridMap = {}));
var HexGridMap;
(function (HexGridMap) {
    class Color {
        r;
        g;
        b;
        a;
        static RED = Color.fromHEX('#FF0000');
        static GREEN = Color.fromHEX('#00FF00');
        static BLUE = Color.fromHEX('#0000FF');
        static YELLOW = Color.fromHEX('#FFFF00');
        static CYAN = Color.fromHEX('#00FFFF');
        static MAGENTA = Color.fromHEX('#FF00FF');
        static ORANGE = Color.fromHEX('#FFA500');
        static PURPLE = Color.fromHEX('#800080');
        static PINK = Color.fromHEX('#FFC0CB');
        static WHITE = Color.fromHEX('#FFFFFF');
        static LIGHT_GREY = Color.fromHEX('#c0c0c0');
        static GREY = Color.fromHEX('#808080');
        static DARK_GREY = Color.fromHEX('#404040');
        static BLACK = Color.fromHEX('#000000');
        constructor(r, g, b, a = 1) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        static fromHEX(hex) {
            hex = hex.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }
            const [r, g, b] = hex.match(/.{2}/g).map(char => parseInt(char, 16));
            return new Color(r, g, b);
        }
        toHEX() {
            return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
        }
        toRGB() {
            if (this.a != 1) {
                return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
            }
            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }
    }
    HexGridMap.Color = Color;
})(HexGridMap || (HexGridMap = {}));
var HexGridMap;
(function (HexGridMap) {
    class CubeCoordinate {
        q;
        r;
        s;
        static directions = [
            new CubeCoordinate(1, 0, -1),
            new CubeCoordinate(1, -1, 0),
            new CubeCoordinate(0, -1, 1),
            new CubeCoordinate(-1, 0, 1),
            new CubeCoordinate(-1, 1, 0),
            new CubeCoordinate(0, 1, -1)
        ];
        constructor(q, r, s) {
            this.q = q;
            this.r = r;
            this.s = s;
        }
        static from2D(x, y, hexSize) {
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
            }
            else if (yDiff > zDiff) {
                ry = -rx - rz;
            }
            else {
                rz = -rx - ry;
            }
            return new CubeCoordinate(rx, ry, rz);
        }
        to2D(hexSize) {
            const x = hexSize * (Math.sqrt(3) * this.q + Math.sqrt(3) / 2 * this.r);
            const y = hexSize * (3 / 2 * this.r);
            return { x, y };
        }
        isZero() {
            return this.q === 0 && this.r === 0 && this.s === 0;
        }
        add(other) {
            return new CubeCoordinate(this.q + other.q, this.r + other.r, this.s + other.s);
        }
        equals(other) {
            return this.q === other.q && this.r === other.r && this.s === other.s;
        }
    }
    HexGridMap.CubeCoordinate = CubeCoordinate;
})(HexGridMap || (HexGridMap = {}));
var HexGridMap;
(function (HexGridMap) {
    class Hex {
        coords;
        hexSize;
        neighbors;
        vertices = [];
        constructor(coords, hexSize = 50, neighbors = []) {
            this.coords = coords;
            this.hexSize = hexSize;
            this.neighbors = neighbors;
            this.vertices = this.calculateVertices(this.hexSize);
        }
        calculateVertices(hexSize) {
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
        draw(ctx, fillColor, borderColor, offset, textureImage, borderImage) {
            const { x, y } = this.coords.to2D(this.hexSize);
            const texturePattern = ctx.createPattern(textureImage, 'repeat');
            const borderPattern = ctx.createPattern(borderImage, 'repeat');
            // Draw hex vertices
            ctx.beginPath();
            this.vertices.forEach((vertex, index) => {
                if (index === 0) {
                    ctx.moveTo(offset.x + x + vertex.x, offset.y + y + vertex.y);
                }
                else {
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
        drawWall(ctx, wallColor, offset, borderImage) {
            const { x, y } = this.coords.to2D(this.hexSize);
            ctx.save();
            const borderPattern = ctx.createPattern(borderImage, 'repeat');
            if (this.neighbors.length != 6) {
                const borderHexes = this.calculateVertices(this.hexSize * 1.2);
                ctx.beginPath();
                borderHexes.forEach((edge, index) => {
                    if (index === 0) {
                        ctx.moveTo(offset.x + x + edge.x, offset.y + y + edge.y);
                    }
                    else {
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
        getNeighbor(direction) {
            return this.neighbors.find(hex => hex.coords.equals(this.coords.add(direction))) || null;
        }
    }
    HexGridMap.Hex = Hex;
})(HexGridMap || (HexGridMap = {}));
var HexGridMap;
(function (HexGridMap) {
    class HexGrid {
        canvas;
        hexSize;
        hexes;
        hoveredHex = null;
        textureImage;
        borderImage;
        constructor(canvas, hexSize, hexes = []) {
            this.canvas = canvas;
            this.hexSize = hexSize;
            this.hexes = hexes;
            this.canvas.addOnMouseHoverListener((x, y) => {
                const offset = this.getOffset();
                const coord = HexGridMap.CubeCoordinate.from2D(x - offset.x, y - offset.y, this.hexSize);
                let hex = this.hexes.find(hex => hex.coords.equals(coord));
                if (hex) {
                    this.hoveredHex = hex;
                }
                else {
                    this.hoveredHex = null;
                }
            });
        }
        adjustCanvasHeight() {
            let { minY, maxY } = this.getBoundingBox();
            minY = Math.abs(minY);
            maxY = Math.abs(maxY);
            this.canvas.resize(null, ((minY + maxY) * 2) + this.hexes[0].hexSize * 4);
            console.log(`HexGrid | Adjusted canvas height to ${this.canvas.getHeight()}`);
        }
        readData(url, textureImage, borderImage, callback) {
            this.canvas.setLoading(true);
            const currentTime = new Date().getTime();
            console.log(`HexGrid | Reading data from ${url}`);
            this.textureImage = textureImage;
            this.borderImage = borderImage;
            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    const data = JSON.parse(request.responseText);
                    // Map hexes
                    this.hexes = data['hexes'].map((coords) => {
                        return new HexGridMap.Hex(new HexGridMap.CubeCoordinate(coords.q, coords.r, coords.s), this.hexSize, []);
                    });
                    // Map hex neighbors
                    this.hexes.forEach(hex => this.mapNeighbors(hex));
                    const took = new Date().getTime() - currentTime;
                    console.log(`HexGrid | Data read in ${took}ms`);
                    this.canvas.setLoading(false);
                    // this.adjustCanvasHeight();
                    this.draw();
                    if (callback)
                        callback();
                }
            };
            request.open('GET', url, true);
            request.send();
        }
        draw() {
            if (this.hexes.length === 0)
                return;
            const hexSize = this.hexes[0].hexSize;
            const offset = this.getOffset();
            this.hexes.forEach(hex => {
                hex.drawWall(this.canvas.getContext(), HexGridMap.Color.fromHEX("#878787"), offset, this.borderImage);
            });
            this.hexes.forEach(hex => {
                let fillColor = HexGridMap.Color.fromHEX('#FFF');
                let borderColor = HexGridMap.Color.fromHEX('#000');
                let textColor = HexGridMap.Color.fromHEX('#000');
                /*
                if (hex.coords.isZero()) {
                    fillColor = Color.fromHEX('#F66');
                    textColor = Color.fromHEX('#FFF');
                }
                */
                hex.draw(this.canvas.getContext(), fillColor, borderColor, offset, this.textureImage, this.borderImage);
                //hex.drawCoordinates(this.canvas.getContext(), textColor, offset);
            });
            // this.drawBoundingBox(boundingBox, offset, hexSize);
            // this.canvas.took(this.took);
            this.canvas.setDrawn();
            console.log(`HexGrid | Drawn ${this.hexes.length} hexes`);
        }
        drawBoundingBox(boundingBox, offset, hexSize) {
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
        mapNeighbors(hex) {
            console.log(hex);
            hex.neighbors = HexGridMap.CubeCoordinate.directions.map(direction => {
                console.log(hex.coords);
                const neighbor = direction.add(hex.coords);
                return this.hexes.find(hex => hex.coords.equals(neighbor));
            }).filter(neighbor => neighbor !== undefined);
        }
        getBoundingBox() {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            this.hexes.forEach(hex => {
                const { x, y } = hex.coords.to2D(hex.hexSize);
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
        getOffset() {
            const boundingBox = this.getBoundingBox();
            return {
                x: this.canvas.getWidth() / 2 - ((boundingBox.minX + boundingBox.maxX) / 2),
                y: this.canvas.getHeight() / 2 - ((boundingBox.minY + boundingBox.maxY) / 2)
            };
        }
        getHexes() {
            return this.hexes;
        }
        addHexAt(CubeCoordinate) {
            const hex = new HexGridMap.Hex(CubeCoordinate, this.hexSize, []);
            this.mapNeighbors(hex);
            this.hexes.push(hex);
        }
        removeHex(Hex) {
            this.hexes.splice(this.hexes.indexOf(Hex), 1);
        }
        getHexAt(CubeCoordinate) {
            return this.hexes.find(hex => hex.coords.equals(CubeCoordinate));
        }
        getHexSize() {
            return this.hexSize;
        }
    }
    HexGridMap.HexGrid = HexGrid;
})(HexGridMap || (HexGridMap = {}));
//# sourceMappingURL=hexgridmap.js.map