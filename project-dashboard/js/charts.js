import { getStats } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
	renderChart();
	updateStatsUI();
	renderTagChart();
});

let myChart, myChart2;

export function renderChart() {
	const stats = getStats();
	const ctx = document.getElementById('taskChart').getContext('2d');

	if (myChart) {
		myChart.destroy();
	}

	myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Tareas Totales', 'Tareas Completadas'],
			datasets: [
				{
					label: 'Resumen de Tareas',
					data: [stats.totalTasks, stats.completedTasks],
					backgroundColor: ['#36a2eb', '#4caf50'],
				},
			],
		},
	});
}

function renderTagChart() {
	const stats = getStats();
	const ctx = document.getElementById('tagChart').getContext('2d');

	if (myChart2) {
		myChart2.destroy();
	}

	myChart2 = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: Object.keys(stats.tagCount),
			datasets: [
				{
					data: Object.values(stats.tagCount),
					backgroundColor: [
						'#ff6384',
						'#36a2eb',
						'#ffce56',
						'#4caf50',
						'#9966ff',
					],
				},
			],
		},
	});
}

function updateStatsUI() {
	const stats = getStats();
	document.getElementById('totalTasks').textContent = stats.totalTasks;
	document.getElementById('completedTasks').textContent = stats.completedTasks;
	document.getElementById('completedPercentage').textContent =
		stats.completedPercentage.toFixed(2);
}

renderTagChart();
