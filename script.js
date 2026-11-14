const canvas = document.getElementById("labCanvas");
const ctx = canvas.getContext("2d");

const vertices = [
	{ x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
	{ x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
	{ x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
	{ x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
];

const edges = [
	[0, 1], [1, 2], [2, 3], [3, 0],
	[4, 5], [5, 6], [6, 7], [7, 4],
	[0, 4], [1, 5], [2, 6], [3, 7]
];

let angleX = 0;
let angleY = 0;
let isDragging = false;
let prevMouseX = 0;
let prevMouseY = 0;

// Listen for mouse clicks and movement on the canvas
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  prevMouseX = e.clientX;
  prevMouseY = e.clientY;
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - prevMouseX;
  const dy = e.clientY - prevMouseY;
  
  angleY += dx * 0.01;
  angleX += dy * 0.01;
  
  prevMouseX = e.clientX;
  prevMouseY = e.clientY;
});

function project(point) {
	const x1 = point.x * Math.cos(angleY) - point.z * Math.sin(angleY);
	const z1 = point.x * Math.sin(angleY) + point.z * Math.cos(angleY);
	const y2 = point.y * Math.cos(angleX) - z1 * Math.sin(angleX);
	const z2 = point.y * Math.sin(angleX) + z1 * Math.cos(angleX);

	const fov = 400;
	const distance = 4;
	const scale = fov / (z2 + distance);

	return {
		x: x1 * scale + canvas.width / 2,
		y: y2 * scale + canvas.height / 2
	};
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
     if (!isDragging) {
	angleX += 0.015;
	angleY += 0.02;
     }
	const projectedPoints = vertices.map(project);
	ctx.strokeStyle = "#38bdf8";
	ctx.lineWidth = 2;

	for (const edge of edges) {
		const p1 = projectedPoints[edge[0]];
		const p2 = projectedPoints[edge[1]];
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.stroke();
	}

	ctx.fillStyle = "#f8fafc";
	for (const point of projectedPoints) {
		ctx.beginPath();
		ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
		ctx.fill();
	}

	requestAnimationFrame(render);
}

render();
