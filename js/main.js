import { setupCanvas, startDraw, stopDrawing, resetCanvas } from "./drawing.js";
import { startAlgo, stopAlgo, resetAlgo } from "./algorithm.js";

document.addEventListener("DOMContentLoaded", () => {
	setupCanvas();
	window.startDraw = startDraw;
	window.stopDrawing = stopDrawing;
	window.resetCanvas = resetCanvas;
	window.startAlgo = startAlgo;
	window.stopAlgo = stopAlgo;
	window.resetAlgo = resetAlgo;
});
