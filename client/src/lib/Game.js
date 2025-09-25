import { getExistingShapes } from './api';

const BACKGROUND_COLOR = "#0f172a";

export class Game {
    constructor(canvas, container, roomId, socket) {
        this.canvas = canvas;
        this.container = container;
        this.ctx = canvas.getContext("2d");
        this.roomId = roomId;
        this.socket = socket;

        this.existingShapes = [];
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
        this.selectedTool = "pencil";

        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

        this.init();
        this.initSocketHandlers();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    setTool(tool) {
        console.log('[Game.js] Tool set to:', tool);
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.redrawCanvas();
    }

    initSocketHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "draw") {
                this.existingShapes.push(message.shape);
                this.redrawCanvas();
            }
        };
    }

    redrawCanvas() {
        this.ctx.fillStyle = BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.existingShapes.forEach((shape) => this.drawShape(shape));
    }

    drawShape(shape) {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.fillStyle = "#ffffff";

        if (shape.type === "rect") {
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            this.ctx.beginPath();
            this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
            this.ctx.stroke();
        } else if (shape.type === "pencil") {
            this.ctx.beginPath();
            this.ctx.moveTo(shape.startX, shape.startY);
            this.ctx.lineTo(shape.endX, shape.endY);
            this.ctx.stroke();
        } else if (shape.type === "eraser") {
            this.ctx.lineWidth = 50;
            this.ctx.strokeStyle = BACKGROUND_COLOR;
            this.ctx.beginPath();
            this.ctx.moveTo(shape.startX, shape.startY);
            this.ctx.lineTo(shape.endX, shape.endY);
            this.ctx.stroke();
        }
    }

    mouseDownHandler(e) {
        console.log('[Game.js] Mouse down detected. Current tool:', this.selectedTool);
        this.isDrawing = true;
        this.startX = e.offsetX;
        this.startY = e.offsetY;
    }

    mouseUpHandler(e) {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        if (this.selectedTool === 'pencil' || this.selectedTool === 'eraser') return;

        const width = e.offsetX - this.startX;
        const height = e.offsetY - this.startY;
        let shape = null;

        if (this.selectedTool === "rect") {
            shape = { type: "rect", x: this.startX, y: this.startY, width, height };
        } else if (this.selectedTool === "circle") {
            const radius = Math.sqrt(width ** 2 + height ** 2);
            shape = { type: "circle", centerX: this.startX, centerY: this.startY, radius };
        }

        if (shape) {
            this.broadcastShape(shape);
        }
    }

    mouseMoveHandler(e) {
        if (!this.isDrawing) return;

        if (this.selectedTool === 'pencil' || this.selectedTool === 'eraser') {
            const shape = {
                type: this.selectedTool,
                startX: this.startX,
                startY: this.startY,
                endX: e.offsetX,
                endY: e.offsetY,
            };
            this.broadcastShape(shape);
            this.startX = e.offsetX;
            this.startY = e.offsetY;
        }
    }
    
    broadcastShape(shape) {
        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({ type: "draw", roomId: this.roomId, shape }));
        this.redrawCanvas();
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }
}

