import { canvas, ctx, square } from "./constants.js";

let isDrawing = false;
let customNode = {};
export let allNodes = [];
export let startNode = {};
export let endNode = {};

export function setupCanvas() {
	ctx.strokeStyle = "lightgray";
	ctx.lineWidth = 1;
	drawGrid();
	drawObstacles();
	initializeNodes();
	initializeNeighbors();
}

export function paint() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawGrid();
	drawObstacles();
	drawStartEndNodes();
}

export function updateNodePositions() {
	const startNodeX = parseInt(document.getElementById("start-node-x").value);
	const startNodeY = parseInt(document.getElementById("start-node-y").value);
	const endNodeX = parseInt(document.getElementById("end-node-x").value);
	const endNodeY = parseInt(document.getElementById("end-node-y").value);
	const offset = 2 * square;
	const boundsX = (canvas.width / square) * square - offset;
	const boundsY = (canvas.height / square) * square - offset;

	if (
		startNodeX < 1 ||
		startNodeX > boundsX ||
		startNodeY < 1 ||
		startNodeY > boundsY ||
		endNodeX < 1 ||
		endNodeX > boundsX ||
		endNodeY < 1 ||
		endNodeY > boundsY
	) {
		window.alert("Node was out of bounds. Please enter a valid node.");
		return;
	}

	if (allNodes.length > 0) {
		startNode = allNodes[startNodeY][startNodeX];
		endNode =
			allNodes[endNodeY + Math.floor(startNodeY / 2)][endNodeX + Math.floor(startNodeX / 2)];

		paint();
	}
}

export function drawRandomizeNodes() {
	const gridSize = square;

	let randomStartX = Math.floor(Math.random() * (gridSize - 2)) + 1;
	let randomStartY = Math.floor(Math.random() * (gridSize - 2)) + 1;
	let randomEndX = Math.floor(Math.random() * (gridSize - 2)) + 1;
	let randomEndY = Math.floor(Math.random() * (gridSize - 2)) + 1;

	document.getElementById("start-node-x").value = randomStartX;
	document.getElementById("start-node-y").value = randomStartY;
	document.getElementById("end-node-x").value = randomEndX;
	document.getElementById("end-node-y").value = randomEndY;

	clearPathData();
	initializeNodes();
	initializeNeighbors();
	updateNodePositions();
}

function drawStartEndNodes() {
	if (startNode && endNode) {
		// Ensure start node is always above the end node for nice visuals
		if (startNode.y > endNode.y) {
			let temp = startNode;
			startNode = endNode;
			endNode = temp;
		}

		ctx.fillStyle = "#ffa742"; // Start node
		ctx.fillRect(startNode.x, startNode.y, square, square);

		ctx.fillStyle = "#08bd05"; // End node
		ctx.fillRect(endNode.x, endNode.y, square, square);

		// Text
		ctx.font = "12px Arial";
		ctx.fillStyle = "black";
		const center = square / 2;

		// ctx.fillText(startNode.text, startNode.x + center, startNode.y + center);
		// ctx.fillText(endNode.text, endNode.x + center, endNode.y + center);
	}
}

// Grid lines
function drawGrid() {
	ctx.beginPath();
	ctx.fillStyle = "#8a8a8a";

	for (let i = 0; i <= canvas.height; i += square) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, canvas.height);
		ctx.moveTo(0, i);
		ctx.lineTo(canvas.width, i);

		ctx.fillStyle = "#8a8a8a";
		ctx.fillRect(i, 0, square, square); // Edge Top
		ctx.fillRect(0, i, square, square); // Edge Left
		ctx.fillRect(i, canvas.height - square, square, square); // Edge Bottom
		ctx.fillRect(canvas.width - square, i, square, square); // Edge Right
	}
	ctx.stroke();

	ctx.font = "12px Arial";
	ctx.fillStyle = "lightgray";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	// for (let i = square; i <= canvas.width - 2 * square; i += square) {
	// 	ctx.fillText((i / square).toString(), square / 2, i - square / 2 + square); // Vertical
	// 	ctx.fillText((i / square).toString(), i - square / 2 + square, square / 2); // Horizontal
	// }
}

// fillRect(x, y, width, height)
function drawObstacles() {
	for (let i = 1; i < allNodes.length; i++) {
		for (let j = 1; j < allNodes[i].length; j++) {
			let currentNode = allNodes[i][j];

			if (currentNode.wall === true && currentNode !== startNode && currentNode !== endNode) {
				ctx.fillStyle = "#2477b3";
				ctx.fillRect(currentNode.x, currentNode.y, square, square);
			}
		}
	}
}

function initializeNodes() {
	let row = 1;
	let col = 1;
	let wallProbability = 0.15;

	for (let i = square; i < canvas.height - square; i += square) {
		allNodes[row] = [];
		col = 1;

		for (let j = square; j < canvas.width - square; j += square) {
			let random = Math.floor(Math.random() * 1000);
			let wall = false;

			// First node
			if (row === 1 && col === 1) {
				random = 0;
			}

			// Generate random walls
			if (!(row === 1 && col === 1) && !(row === endNode && col === endNode)) {
				wall = Math.random() < wallProbability;
			}

			customNode = {
				x: j,
				y: i,
				neighbors: [],
				width: square,
				height: square,
				weight: random,
				text: random,
				color: "black",
				visited: false,
				f: Infinity,
				g: Infinity,
				h: 0,
				previous: null,
				wall: wall,
			};

			allNodes[row][col] = customNode;

			col++;
		}

		row++;
	}
}

function initializeNeighbors() {
	for (let y = 1; y < allNodes.length; y++) {
		for (let x = 1; x < allNodes[y].length; x++) {
			let neighbors = [];

			if (x - 1 >= 1) neighbors.push(allNodes[y][x - 1]); // Left
			if (y - 1 >= 1) neighbors.push(allNodes[y - 1][x]); // Top
			if (x + 1 < allNodes[y].length) neighbors.push(allNodes[y][x + 1]); // Right
			if (y + 1 < allNodes.length) neighbors.push(allNodes[y + 1][x]); // Bottom

			allNodes[y][x].neighbors = neighbors;
		}
	}
}

function clearPathData() {
	for (let y = 1; y < allNodes.length; y++) {
		for (let x = 1; x < allNodes[y].length; x++) {
			let node = allNodes[y][x];
			node.f = Infinity;
			node.g = Infinity;
			node.h = 0;
			node.previous = null;
		}
	}
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
