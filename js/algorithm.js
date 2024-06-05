import { canvas, ctx, square } from "./constants.js";
import { allNodes, startNode, endNode } from "./drawing.js";

/*
	A* Pathfinding Algorithm
	Source: https://en.wikipedia.org/wiki/A*_search_algorithm
*/

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

let timer = 2000;
let openSet = []; // Nodes to be visited
let closedSet = []; // Nodes already visited
let path = []; // The final path

export function startAlgo() {
	openSet.push(startNode);
	isAlgorithmRunning = true;
	if (isAlgorithmRunning) {
		aStar(startNode, endNode);
	}
}

// f(n) = g(n) + h(n)
// g(n) = cost from start node + cost to current node
// h(n) = heuristic cost to end node (estimated distance, like euclidean etc.)
function aStar(node, endNode) {
	openSet = [startNode];
	node.g = 0;
	node.h = 0;
	node.f = node.g + node.h;

	// While there are nodes to visit
	while (openSet.length > 0) {
		let lowestScore = 0;

		// First iteration is the start node.
		// If the unvisited node (openSet[i]) has a lower f score than the current node -
		// then the current node is the unvisited node.
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[lowestScore].f) {
				lowestScore = i;
				console.log("lowestScore => ", lowestScore);
			}
		}

		let current = openSet[lowestScore]; // Node with the lowest total f score

		if (current === endNode) {
			console.log("FOUND THE END NODE!");
			let temp = current;
			path.push(temp);

			while (temp.previous) {
				path.push(temp.previous);
				temp = temp.previous;
			}

			path.reverse();
			drawOptimalPath(path);
			break;
		}

		removeFromArray(openSet, current); // Remove current from unvisited nodes
		closedSet.push(current); // Add current node to already visited nodes

		// Next, check all neighbours of the current node (top, bottom, left, right => pathfinding algorithm).
		// The algorithm will check the neighbours of the current node and calculate the total f score.
		// If the g score is lower than the current g score, then the current f score is updated.
		// It will continue to check the neighbours of the current node until we found the end node.
		// If the end node is found, we stop and draw the path.
		// If the end node is not found, continue to check the neighbours of the current node.
		let neighbors = Object.values(current.neighbours);

		for (let i = 0; i < neighbors.length; i++) {
			let neighbor = neighbors[i];

			if (!closedSet.includes(neighbor) && !neighbor.wall) {
				let tentative_gScore = current.g + manhattanDistance(current, neighbor);

				if (!openSet.includes(neighbor) || tentative_gScore < neighbor.g) {
					neighbor.g = tentative_gScore;
					neighbor.h = manhattanDistance(neighbor, endNode);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;

					if (!openSet.includes(neighbor)) {
						openSet.push(neighbor);
					}

					drawOpenSet(openSet);
					drawClosedSet(closedSet);
				}
			}
		}
	}
}

// fillRect(x, y, width, height)
const intersectSize = 5;
function drawOpenSet(openSet) {
	for (let i = 0; i < openSet.length; i++) {
		const xPos = openSet[i].x - intersectSize / 2;
		const yPos = openSet[i].y - intersectSize / 2;

		ctx.fillRect(xPos, yPos, 5, 5);
		ctx.fillStyle = "green";
	}
}

function drawClosedSet(closedSet) {
	for (let i = 0; i < closedSet.length; i++) {
		const xPos = closedSet[i].x - intersectSize / 2;
		const yPos = closedSet[i].y - intersectSize / 2;

		ctx.fillRect(xPos, yPos, 5, 5);
		ctx.fillStyle = "red";
	}
}

function drawOptimalPath(path) {
	ctx.beginPath();
	ctx.moveTo(path[0].x, path[0].y);

	for (let i = 1; i < path.length; i++) {
		ctx.lineTo(path[i].x, path[i].y);
	}

	ctx.strokeStyle = "blue";
	ctx.lineWidth = 4;

	ctx.stroke();
}

function drawPath(path) {
	ctx.beginPath();
	ctx.moveTo(path[0].x, path[0].y);

	for (let i = 1; i < path.length; i++) {
		ctx.lineTo(path[i].x, path[i].y);
	}

	ctx.strokeStyle = "red";
	ctx.lineWidth = 3;

	ctx.stroke();
}

export function stopAlgo() {
	isAlgorithmRunning = false;
}

export function resetAlgo() {
	window.location.reload();
}

// Euclidean distance
function euclideanDistance(start, end) {
	return Math.sqrt(Math.pow(end.x - start.x, 2)) + Math.sqrt(Math.pow(end.y - start.y, 2));
}

// Manhattan distance
function manhattanDistance(start, end) {
	return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

// Diagnostic distance
function diagonalDistance(node) {
	const dx = Math.abs(node.x - endNode.x);
	const dy = Math.abs(node.y - endNode.y);
	const diag = Math.min(dx, dy);
	const straight = dx + dy;
	return Math.sqrt(2) * diag + straight - 2 * diag;
}

function removeFromArray(arr, element) {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (arr[i] === element) {
			arr.splice(i, 1);
		}
	}
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

// // 	// Move x
// startNode.x += square;
// ctx.lineTo(startNode.x, startNode.y);
// // 	// Move y
// startNode.y += square;
// ctx.lineTo(startNode.x, startNode.y);
