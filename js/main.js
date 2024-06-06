import {
	setupCanvas,
	startDraw,
	stopDrawing,
	resetCanvas,
	updateNodePositions,
	drawRandomizeNodes,
} from "./drawing.js";
import { startAlgo, stopAlgo, resetAlgo } from "./algorithm.js";
import { canvas, ctx } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
	// Initialize
	setupCanvas();
	updateNodePositions();

	// Events
	const randomizeButton = document.getElementById("randomize-nodes");
	document.getElementById("start-node-x").addEventListener("change", updateNodePositions);
	document.getElementById("start-node-y").addEventListener("change", updateNodePositions);
	document.getElementById("end-node-x").addEventListener("change", updateNodePositions);
	document.getElementById("end-node-y").addEventListener("change", updateNodePositions);
	randomizeButton.addEventListener("click", drawRandomizeNodes);

	// Global
	window.startDraw = startDraw;
	window.stopDrawing = stopDrawing;
	window.resetCanvas = resetCanvas;
	window.startAlgo = startAlgo;
	window.stopAlgo = stopAlgo;
	window.resetAlgo = resetAlgo;
	window.canvas = canvas;
	window.ctx = ctx;
});
