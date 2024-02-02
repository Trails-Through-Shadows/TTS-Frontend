import { Color } from "./Color";
import type { BoundingBox } from "./HexGrid";

    interface ScreenText {
        title: string;
        subtitle: string;
        spacer: number;
    }

    export class Canvas {
        private written = false;
        private loading = false;

        private backgroundImage: any;
        private imageLoaded = false;

        private width: number;
        private height: number;

        private onSizeListeners: (() => void)[] = [];
        public addOnSizeListener(listener: () => void): void {
            this.onSizeListeners.push(listener);
        }

        private onMouseHoverListeners: ((x: number, y: number) => void)[] = [];
        public addOnMouseHoverListener(listener: (x: number, y: number) => void): void {
            this.onMouseHoverListeners.push(listener);
        }

        private onMouseClickListeners: ((x: number, y: number) => void)[] = [];
        public addOnMouseClickListener(listener: (x: number, y: number) => void): void {
            this.onMouseClickListeners.push(listener);
        }

        constructor(
            private readonly canvas: HTMLCanvasElement,
            private def?: ScreenText
        ) {
            this.canvas = canvas;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.resize();

            this.width = this.canvas.width;
            this.height = this.canvas.height;

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

        public setBackgroundImage(src: string, callback?: () => void): void {
            this.backgroundImage = new Image();
            this.backgroundImage.src = src;
            this.backgroundImage.onload = () => {
                this.imageLoaded = true;
                if (callback) callback();
            };
        }

        public title(text: string, subtitle: string): void {
            this.clear();

            const ctx = this.getContext();
            ctx.fillStyle = new Color(255, 255, 255, 0.1).toRGB();
            ctx.shadowColor = new Color(0, 0, 0, 0.75).toRGB();
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.font = 'bold 6em Arial';
            ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - (this.def?.spacer ?? 0) / 2);

            if (subtitle.length > 0) {
                ctx.font = '2em Arial';

                const lines = subtitle.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + (this.def?.spacer ?? 0) / 2 + i * 30);
                }
            }
        }

        public clear(): void {
            const ctx = this.getContext();
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.imageLoaded) {
                ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
            }
        }

        public resize(width?: number, height?: number): void {
            this.width = width || this.canvas.offsetWidth;
            this.height = height || this.canvas.offsetHeight;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

        private registerListeners(): void {
            const parent = this.canvas.parentElement;

            // Window resize observer
            const observer = new ResizeObserver(() => {
                this.resize();

                if (!this.written && !this.loading && this.def) {
                    this.title(this.def.title, this.def.subtitle);
                }

                this.onSizeListeners.forEach(listener => listener());
            });
            observer.observe(this.canvas);

            // Mouse hover listener
            this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                this.onMouseHoverListeners.forEach(listener => listener(x, y));
            });

            // Mouse click listener
            this.canvas.addEventListener('click', (event: MouseEvent) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                this.onMouseClickListeners.forEach(listener => listener(x, y));
            });
        }

        // ------------------------------

        public getContentBoundingBox(): BoundingBox {
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
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
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

        public getContext(): CanvasRenderingContext2D {
            const ctx =  this.canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context is null');
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = Color.WHITE.toRGB();
            ctx.strokeStyle = Color.BLACK.toRGB();

            return ctx;
        }

        public setCursor(cursor: string): void {
            this.canvas.style.cursor = cursor;
        }

        public getWidth(): number {
            return this.width;
        }

        public getHeight(): number {
            return this.height;
        }

        public setDrawn(): void {
            this.written = true;
        }

        public isDrawn(): boolean {
            return this.written;
        }

        public setLoading(loading: boolean): void {
            this.loading = loading;
        }

        public isLoading(): boolean {
            return this.loading;
        }
    }