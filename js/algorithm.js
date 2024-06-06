import { ctx } from "./constants.js";
import { startNode, endNode } from "./drawing.js";

/*
	A* Pathfinding Algorithm
	Source: https://en.wikipedia.org/wiki/A*_search_algorithm
*/

class QElement {
	constructor(element, priority) {
		this.element = element;
		this.priority = priority;
	}
}

class PriorityQueue {
	constructor() {
		this.items = [];
	}

	enqueue(element, priority = 0) {
		let qElement = new QElement(element, priority);
		let contain = false;

		// iterating through the entire array to add element at the correct location of the Queue
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].priority > qElement.priority) {
				this.items.splice(i, 0, qElement);
				contain = true;
				break;
			}
		}

		// if element have the highest priority, add it to the end of the queue
		if (!contain) {
			this.items.push(qElement);
		}
	}
	dequeue() {
		// return the dequeued element and remove it
		// if the queue is empty, return Underflow
		if (this.isEmpty()) return "Underflow";
		return this.items.shift();
	}
	peek() {
		// returns the highest priority element without removing it
		if (this.isEmpty()) return "No elements in Queue";
		return this.items[0];
	}
	rear() {
		// returns the lowest priority element of the queue
		if (this.isEmpty()) return "No elements in Queue";
		return this.items[this.items.length - 1];
	}
	update(element, newPriority) {
		// Find the element in the queue
		let found = false;
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].element === element) {
				// Update only if the new priority is lower
				if (this.items[i].priority > newPriority) {
					this.items.splice(i, 1); // Remove the old item
					this.enqueue(element, newPriority); // Reinsert with new priority
				}
				found = true;
				break;
			}
		}
		if (!found) {
			this.enqueue(element, newPriority);
		}
	}
	contains(element) {
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].element === element) {
				return true;
			}
		}

		return false;
	}
	isEmpty() {
		// return true if the queue is empty.
		return this.items.length == 0;
	}
	clear() {
		console.log("Clearing items in the queue");
		this.items = [];
	}
	printQueue() {
		let str = "";
		for (let i = 0; i < this.items.length; i++) {
			str += this.items[i].element + " ";
			return str;
		}
	}
}

let isAlgorithmRunning = false;
let openSet = new PriorityQueue(); // Nodes to be visited
let closedSet = new Set(); // Nodes already visited
let path = []; // The final path

function clearPathData() {
	console.log("Clearing path data");
	openSet.clear();
	closedSet.clear();
	path = [];
	console.log("Cleared path data", { openSet: openSet, closedSet: closedSet, path: path });
}

export function startAlgo() {
	clearPathData();
	isAlgorithmRunning = true;

	if (isAlgorithmRunning) {
		console.log("Running A* algorithm");
		aStar(startNode, endNode);
	}
}

export function stopAlgo() {
	isAlgorithmRunning = false;
}

export function resetAlgo() {
	window.location.reload();
}

// f(n) = g(n) + h(n)
// g(n) = cost from start node + cost to current node
// h(n) = heuristic cost to end node (estimated distance, like euclidean etc.)
function aStar(start, goal) {
	let distanceAlgorithm = document.querySelector("#heuristic-distance").value;

	start.g = 0;
	start.h = calculateHeuristic(start, endNode, distanceAlgorithm);
	start.f = start.g + start.h;
	openSet.enqueue(start, start.f);
	closedSet.add(start);

	document.querySelector("#heuristic-distance").addEventListener("change", (e) => {
		distanceAlgorithm = e.target.value;
	});

	// While there are nodes to visit
	while (!openSet.isEmpty()) {
		let current = openSet.dequeue().element;

		if (current.visited) continue;

		current.visited = true;

		if (current === goal) {
			console.log("Goal reached, reconstructing path.");
			return reconstructPath(current);
		}

		current.neighbors.forEach((neighbor) => {
			if (neighbor.wall || neighbor.visited) {
				return;
			}

			let newCost = current.g + calculateHeuristic(current, neighbor, distanceAlgorithm);

			if (!openSet.contains(neighbor) || newCost < neighbor.g) {
				neighbor.g = newCost;
				neighbor.h = calculateHeuristic(neighbor, goal, distanceAlgorithm);
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.previous = current;

				if (!openSet.contains(neighbor)) {
					openSet.enqueue(neighbor, neighbor.f);
				} else {
					openSet.update(neighbor, neighbor.f);
				}

				closedSet.add(neighbor);
			}
		});
	}

	console.log("No path found after exhausting openSet.");
}

// Euclidean distance
function euclideanDistance(start, end) {
	return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
}

// Manhattan distance
function manhattanDistance(start, end) {
	if (!start || !end) return Infinity;
	return Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
}

// Diagnostic distance
function diagonalDistance(start, end) {
	const dx = Math.abs(start.x - end.x);
	const dy = Math.abs(start.y - end.y);
	const diag = Math.min(dx, dy);
	const straight = Math.max(dx, dy);
	return Math.sqrt(2) * diag + (straight - diag);
}

function calculateHeuristic(current, target, method) {
	switch (method) {
		case "euclidean":
			return euclideanDistance(current, target);
		case "manhattan":
			return manhattanDistance(current, target);
		case "diagonal":
			return diagonalDistance(current, target);
		default:
			return manhattanDistance(current, target);
	}
}

function reconstructPath(current) {
	let temp = current;

	while (temp) {
		path.push(temp);
		temp = temp.previous;
	}

	path.reverse();
	drawOpenSet(openSet);
	drawClosedSet(closedSet);
	animatePath(path);
	document.getElementById(
		"message"
	).innerHTML = `Found the end @ x: ${endNode.x} y: ${endNode.y}`;

	isAlgorithmRunning = false;
}

function animatePath(path) {
	let index = 0;
	let lastTimeStamp = 0;
	let speed = document.querySelector("#speed").value;
	const delay = speed > 0 ? speed * 1000 : 1000;

	function drawStep(timestamp) {
		if (index < path.length) {
			if (!lastTimeStamp || timestamp - lastTimeStamp >= delay) {
				let node = path[index];
				ctx.fillStyle = "red";
				ctx.fillRect(node.x, node.y, node.width, node.height);
				index++;
				lastTimeStamp = timestamp;
			}

			requestAnimationFrame(drawStep);
		}
	}

	requestAnimationFrame(drawStep);
}

// fillRect(x, y, width, height)
const intersectSize = 5;
function drawOpenSet(openSet) {
	ctx.fillStyle = "green";

	openSet.items.forEach((qElement) => {
		const node = qElement.element;
		const xPos = node.x - intersectSize / 2;
		const yPos = node.y - intersectSize / 2;

		ctx.fillRect(xPos, yPos, intersectSize, intersectSize);
	});
}

function drawClosedSet(closedSet) {
	ctx.fillStyle = "red";

	closedSet.forEach((node) => {
		const xPos = node.x - intersectSize / 2;
		const yPos = node.y - intersectSize / 2;

		ctx.fillRect(xPos, yPos, intersectSize, intersectSize);
	});
}

// Next, check all neighbors of the current node (top, bottom, left, right => pathfinding algorithm).
// The algorithm will check the neighbors of the current node and calculate the total f score.
// If the g score is lower than the current g score, then the current f score is updated.
// It will continue to check the neighbors of the current node until we found the end node.
// If the end node is found, we stop and draw the path.
// If the end node is not found, continue to check the neighbors of the current node.
