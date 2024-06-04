import { canvas, ctx, square } from "./constants.js";
import { allNodes, startNode } from "./drawing.js";

// let html = "";
// const listOfNumbers = [1, 2, 3, 4, 5];
// for (let i = 0; i < listOfNumbers.length; i++) {
// 	html += `<p>${i}</p>`;
// }
// document.querySelector(".container").innerHTML = html;

let isAlgorithmRunning = false;

class Queue {
	constructor() {
		this.items = {};
		this.top = 0;
		this.bottom = 0;
	}
	enqueue(item) {
		this.items[this.bottom] = item;
		this.bottom++;
		return item;
	}
	dequeue() {
		const item = this.items[this.top];
		delete this.items[this.top];
		this.top++;
		return item;
	}
	peek() {
		return this.items[this.top];
	}
	get printQueue() {
		return this.items;
	}
}

let queue = new Queue();

// // Starting node (x, y) -> (0, 0)
// const startNode = {
// 	x: 150,
// 	y: 150,
// 	width: square,
// 	height: square,
// 	weight: 1,
// };

// // End node (x, y) -> (0, 0)
const endNode = {
	x: canvas.width - 150,
	y: canvas.height - 150,
	width: square,
	height: square,
	weight: 505,
};

let timer = 2000;

// f(n) = g(n) + h(n)
// g(n) = cost from start node + cost to current node
// h(n) = heuristic cost to end node (estimated distance)
let visitedNodes = [];
let unvisitedNodes = [];
let strokeDistance = 0;
let lowestIndex = 0;
let openSet = [];

export function startAlgo() {
	isAlgorithmRunning = true;
	setInterval(() => {
		if (isAlgorithmRunning) {
			ctx.beginPath();
			ctx.moveTo(startNode.x, startNode.y);

			while (startNode.x < endNode.x && startNode.y < endNode.y) {
				traverseNodes(startNode);

				// for (let i = 1; i < allNodes.length; i++) {
				// 	for (let j = 1; j < allNodes[i].length; j++) {
				// 		currNode = allNodes[i][j];

				// 		if (currNode.neighbours.top === undefined) continue;
				// 		if (currNode.neighbours.bottom === undefined) continue;
				// 		if (currNode.neighbours.left === undefined) continue;
				// 		if (currNode.neighbours.right === undefined) continue;

				// 		// console.log("currNode => ", currNode);

				// 		traverseNodes(startNode);
				// 	}
				// }
			}
		}
	}, timer);
}

function traverseNodes(node) {
	// console.log("current node => ", node);
	switch (node) {
		case node.neighbours.top:
			if (node.neighbours.top.weight < node.weight) {
				// node.weight = node.neighbours.top.weight;
				node.color = "red";
				// Move x
				startNode.x += square;
				ctx.lineTo(startNode.x, startNode.y);
				// Move y
				startNode.y += square;
				ctx.lineTo(startNode.x, startNode.y);
				// Style path
				ctx.strokeStyle = "red";
				ctx.lineWidth = 3;
				ctx.stroke();
			}
			break;
		case node.neighbours.bottom:
			if (node.neighbours.bottom.weight < node.weight) {
				// node.weight = node.neighbours.bottom.weight;
				node.color = "red";
				// Move x
				startNode.x += square;
				ctx.lineTo(startNode.x, startNode.y);
				// Move y
				startNode.y += square;
				ctx.lineTo(startNode.x, startNode.y);
				// Style path
				ctx.strokeStyle = "red";
				ctx.lineWidth = 3;
				ctx.stroke();
			}
			break;
		case node.neighbours.left:
			if (node.neighbours.left.weight < node.weight) {
				// node.weight = node.neighbours.left.weight;
				node.color = "red";
				// Move x
				startNode.x += square;
				ctx.lineTo(startNode.x, startNode.y);
				// Move y
				startNode.y += square;
				ctx.lineTo(startNode.x, startNode.y);
				// Style path
				ctx.strokeStyle = "red";
				ctx.lineWidth = 3;
				ctx.stroke();
			}
			break;
		case node.neighbours.right:
			if (node.neighbours.right.weight < node.weight) {
				// node.weight = node.neighbours.right.weight;
				node.color = "red";
				// Move x
				startNode.x += square;
				ctx.lineTo(startNode.x, startNode.y);
				// Move y
				startNode.y += square;
				ctx.lineTo(startNode.x, startNode.y);
				// Style path
				ctx.strokeStyle = "red";
				ctx.lineWidth = 3;
				ctx.stroke();
			}
			break;
		default:
			console.log("No neighbours found");
			break;
	}
}

export function stopAlgo() {
	isAlgorithmRunning = false;
}

export function resetAlgo() {
	window.location.reload();
}

// Euclidean distance
function euclideanDistance(node) {
	return Math.sqrt(Math.pow(endNode.x - node.x, 2)) + Math.sqrt(Math.pow(endNode.y - node.y, 2));
}

// Manhattan distance
function manhattanDistance(node) {
	return Math.abs(node.x - endNode.x) + Math.abs(node.y - endNode.y);
}

// Diagnostic distance
function diagonalDistance(node) {
	const dx = Math.abs(node.x - endNode.x);
	const dy = Math.abs(node.y - endNode.y);
	const diag = Math.min(dx, dy);
	const straight = dx + dy;
	return Math.sqrt(2) * diag + straight - 2 * diag;
}

// visitedNodes.push(node);
// let html = "";
// for (let i = 0; i <= visitedNodes.length - 1; i++) {
// 	html = i;
// }
// document.getElementById("visitedNodes").innerHTML = html;

// if (startNode.weight > rightNode.weight) {
// 	// Move x
// 	startNode.x += square;
// 	ctx.lineTo(startNode.x, startNode.y);
// 	// Move y
// 	startNode.y += square;
// 	ctx.lineTo(startNode.x, startNode.y);
// 	// Style path
// 	ctx.strokeStyle = "red";
// 	ctx.lineWidth = 3;
// 	ctx.stroke();
// }
