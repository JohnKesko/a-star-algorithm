import { canvas, ctx, square } from "./constants.js";

let isDrawing = false;
let counter = 1;
export let allNodes = [];
export let startNode = {};

export function setupCanvas() {
	ctx.strokeStyle = "lightgray";
	ctx.lineWidth = 1;
	drawGrid();
	drawObstacles();
	drawNodes();
	drawText();
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

function drawObstacles() {
	for (let i = square; i <= canvas.height; i += square) {
		ctx.fillStyle = "#2477b3";
		ctx.fillRect(i * 4 - square, i * 3 - square, square, square);
		ctx.fillRect(i * 7 - square, i * 3 - square, square, square);
		ctx.fillRect(i * 6 - square, i * 4 - square, square, square);
		ctx.fillRect(i * 2 - square, i * 4 - square, square, square);
	}
}

function drawNodes() {
	ctx.fillStyle = "#c4910e";
	ctx.fillRect(square, square, square, square); // Start node
	ctx.fillStyle = "#0e824a";
	ctx.fillRect(canvas.width - square * 3, canvas.height - square * 3, square, square); // End node
}

function drawText() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "lightgray";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	let row = 1;
	let col = 1;
	let customNode = {};

	for (let i = square; i < canvas.height - square; i += square) {
		allNodes[row] = [];
		col = 1;
		for (let j = square; j < canvas.width - square; j += square) {
			const random = Math.floor(Math.random() * 1000);
			customNode = {
				x: j + square / 2,
				y: i + square / 2,
				width: square,
				height: square,
				weight: random,
				// text: counter++,
				text: random,
				color: "black",
				visited: false,
				f: 0,
				g: 0,
				h: 0,
			};

			allNodes[row][col] = customNode;
			ctx.fillText(customNode.text, customNode.x, customNode.y);
			col++;
		}

		// Edge row text
		ctx.fillText(row, 20, square * row + square / 2);
		row++;
	}

	for (let row = 1; row < allNodes.length; row++) {
		for (let col = 1; col < allNodes[row].length; col++) {
			customNode = allNodes[row][col];
			customNode.neighbours = {
				top: row - 1 >= 1 ? allNodes[row - 1][col] : undefined,
				bottom: row + 1 < allNodes.length ? allNodes[row + 1][col] : undefined,
				left: col - 1 >= 1 ? allNodes[row][col - 1] : undefined,
				right: col + 1 < allNodes[row].length ? allNodes[row][col + 1] : undefined,
			};
		}
	}

	// Edge col text
	for (let j = square; j < canvas.width - square; j += square) {
		let colIndex = (j - square) / square + 1;
		ctx.fillText(colIndex, square * colIndex + square / 2, 20);
	}

	// console.log(allNodes);
	startNode = allNodes[1][1];
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
