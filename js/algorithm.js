import { ctx } from "./constants.js";
import { startNode, endNode } from "./drawing.js";

/*
	A* Pathfinding Algorithm
	Source: https://en.wikipedia.org/wiki/A*_search_algorithm

	f(n) = g(n) + h(n)
	g(n) = cost from start node + cost to current node
	h(n) = heuristic cost to end node (estimated distance, like euclidean etc.)
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

		// Add element at the correct location of the Queue
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].priority > qElement.priority) {
				this.items.splice(i, 0, qElement);
				contain = true;
				break;
			}
		}

		// If the element have the highest priority, add it to the end of the queue
		if (!contain) {
			this.items.push(qElement);
		}
	}
	dequeue() {
		if (this.isEmpty()) return "Underflow";
		return this.items.shift();
	}
	peek() {
		if (this.isEmpty()) return "No elements in Queue";
		return this.items[0];
	}
	rear() {
		if (this.isEmpty()) return "No elements in Queue";
		return this.items[this.items.length - 1];
	}
	update(element, newPriority) {
		let found = false;

		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].element === element) {
				if (this.items[i].priority > newPriority) {
					this.items.splice(i, 1);
					this.enqueue(element, newPriority);
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
	openSet.clear();
	closedSet.clear();
	path = [];
}

export function startAlgo() {
	clearPathData();
	isAlgorithmRunning = true;

	if (isAlgorithmRunning) {
		aStar(startNode, endNode);
	}
}

export function stopAlgo() {
	isAlgorithmRunning = false;
}

export function resetAlgo() {
	window.location.reload();
}

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

	while (!openSet.isEmpty()) {
		let current = openSet.dequeue().element;

		if (current.visited) continue;

		current.visited = true;

		// We have reached the goal
		if (current === goal) {
			return reconstructPath(current);
		}

		// Check all neighbors for a current node.
		// If it's a wall or already visited, skip it.
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

	window.location.reload();
}

function euclideanDistance(start, end) {
	return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
}

function manhattanDistance(start, end) {
	if (!start || !end) return Infinity;
	return Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
}

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
	drawPath(path);
	document.getElementById(
		"message"
	).innerHTML = `Found the end @ x: ${endNode.x} y: ${endNode.y}`;

	isAlgorithmRunning = false;
}

function drawPath(path) {
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
const grapIntersectSize = 5;
function drawOpenSet(openSet) {
	ctx.fillStyle = "green";

	openSet.items.forEach((qElement) => {
		const node = qElement.element;
		const xPos = node.x - grapIntersectSize / 2;
		const yPos = node.y - grapIntersectSize / 2;

		ctx.fillRect(xPos, yPos, grapIntersectSize, grapIntersectSize);
	});
}

function drawClosedSet(closedSet) {
	ctx.fillStyle = "red";

	closedSet.forEach((node) => {
		const xPos = node.x - grapIntersectSize / 2;
		const yPos = node.y - grapIntersectSize / 2;

		ctx.fillRect(xPos, yPos, grapIntersectSize, grapIntersectSize);
	});
}
