import { canvas, ctx, square } from "./constants.js";

let isDrawing = false;
let counter = 1;
let random = 0;
let customNode = {};
export let allNodes = [];
export let startNode = {};
export let endNode = {};

export function setupCanvas() {
	ctx.strokeStyle = "lightgray";
	ctx.lineWidth = 1;
	drawGrid();
	drawText();
	initializeNodes();
	drawObstacles();
	drawStartEndNodes();
}

function drawGrid() {
	ctx.beginPath();
	for (let i = 0; i <= canvas.height; i += square) {
		// Vertical and Horizontal lines
		ctx.moveTo(i, 0);
		ctx.lineTo(i, canvas.height);
		ctx.moveTo(0, i);
		ctx.lineTo(canvas.width, i);

		// Edge Nodes
		ctx.fillStyle = "#8a8a8a";
		ctx.fillRect(i, 0, square, square); // Top
		ctx.fillRect(0, i, square, square); // Left
		ctx.fillRect(i, canvas.height - square, square, square); // Bottom
		ctx.fillRect(canvas.width - square, i, square, square); // Right
	}
	ctx.stroke();
}

// fillRect(x, y, width, height)
function drawObstacles() {
	for (let i = 1; i < allNodes.length; i++) {
		for (let j = 1; j < allNodes[i].length; j++) {
			let currentNode = allNodes[i][j];

			if (currentNode.wall === true) {
				ctx.fillStyle = "#2477b3";
				ctx.fillRect(currentNode.x, currentNode.y, square, square);
				ctx.fillStyle = "darkgray";
				ctx.fillText(currentNode.text, currentNode.x + square / 2, currentNode.y + square / 2);
			}
		}
	}
}

function drawText() {
	let row = 1;
	let col = 1;
	let wallProbability = 0.15;

	for (let i = square; i < canvas.height - square; i += square) {
		allNodes[row] = [];
		col = 1;

		for (let j = square; j < canvas.width - square; j += square) {
			random = Math.floor(Math.random() * 1000);
			let wall = false;

			// First node
			if (row === 1 && col === 1) {
				random = 0;
			}

			if (!(row === 1 && col === 1) && !(row === 20 && col === 13)) {
				wall = Math.random() < wallProbability;
			}

			customNode = {
				x: j,
				y: i,
				width: square,
				height: square,
				weight: random,
				text: random,
				color: "black",
				visited: false,
				f: 0,
				g: 0,
				h: 0,
				previous: null,
				wall: wall,
			};

			ctx.font = "16px Arial";
			ctx.fillStyle = "lightgray";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			allNodes[row][col] = customNode;
			ctx.fillText(customNode.text, customNode.x + square / 2, customNode.y + square / 2);
			col++;
		}

		row++;
	}

	startNode = allNodes[1][1];
	endNode = allNodes[23][15];
}

function initializeNodes() {
	for (let row = 1; row < allNodes.length; row++) {
		for (let col = 1; col < allNodes[row].length; col++) {
			customNode = allNodes[row][col];
			customNode.neighbours = [];
			if (row - 1 >= 1) customNode.neighbours.push(allNodes[row - 1][col]);
			if (row + 1 < allNodes.length) customNode.neighbours.push(allNodes[row + 1][col]);
			if (col - 1 >= 1) customNode.neighbours.push(allNodes[row][col - 1]);
			if (col + 1 < allNodes[row].length) customNode.neighbours.push(allNodes[row][col + 1]);
		}

		// Edge row text
		ctx.fillText(row, 20, square * row + square / 2);
	}

	// Edge col text
	for (let j = square; j < canvas.width - square; j += square) {
		let colIndex = (j - square) / square + 1;
		ctx.fillText(colIndex, square * colIndex + square / 2, 20);
	}
}

function drawStartEndNodes() {
	ctx.fillStyle = "#c4910e";
	ctx.fillRect(startNode.x, startNode.y, square, square);

	ctx.fillStyle = "#0e824a";
	ctx.fillRect(endNode.x, endNode.y, square, square);

	ctx.font = "16px Arial";
	ctx.fillStyle = "lightgray";
	const center = square / 2;
	ctx.fillText(startNode.text, startNode.x + center, startNode.y + center);
	ctx.fillText(endNode.text, endNode.x + center, endNode.y + center);
}

function handleMouseDown() {
	isDrawing = true;
}

function handleMouseUp() {
	isDrawing = false;
}

function handleMouseMove(e) {
	if (!isDrawing) return;

	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;

	console.log(x, y);

	ctx.beginPath();
	ctx.lineWidth = 5;
	ctx.lineCap = "round";
	ctx.strokeStyle = "black";
	ctx.lineTo(x, y);
	ctx.stroke();
}

export function startDraw() {
	canvas.addEventListener("mousedown", handleMouseDown);
	canvas.addEventListener("mouseup", handleMouseUp);
	canvas.addEventListener("mouseleave", handleMouseUp);
	canvas.addEventListener("mousemove", handleMouseMove);
}
export function stopDrawing() {
	canvas.removeEventListener("mousedown", handleMouseDown);
	canvas.removeEventListener("mouseup", handleMouseUp);
	canvas.removeEventListener("mouseleave", handleMouseUp);
	canvas.removeEventListener("mousemove", handleMouseMove);
	ctx.beginPath();
}
export function resetCanvas() {
	window.location.reload();
}
