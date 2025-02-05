import { getStats } from './storage.js';
import { loadTasksFromStorage } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
	renderChart();
	updateStatsUI();
	renderTagChart();
});

let myChart, myChart2;

//opcion 1 total tareas (Global)
// export function renderChart() {
// 	const stats = getStats();
// 	const ctx = document.getElementById('taskChart').getContext('2d');

// 	if (myChart) {
// 		myChart.destroy();
// 	}

// 	myChart = new Chart(ctx, {
// 		type: 'bar',
// 		data: {
// 			labels: ['Tareas Totales', 'Tareas Completadas'],
// 			datasets: [
// 				{
// 					label: 'Resumen de Tareas',
// 					data: [stats.totalTasks, stats.completedTasks],
// 					backgroundColor: ['#36a2eb', '#4caf50'],
// 				},
// 			],
// 		},
// 	});
// }

//Opción 2: Total tareas por mes

export function renderChart(chartData) {
	const ctx = document.getElementById('taskChart').getContext('2d');

	if (myChart) {
		myChart.destroy(); // Eliminar gráfico anterior si existe
	}

	// Crear el nuevo gráfico de barras
	myChart = new Chart(ctx, {
		type: 'bar',
		data: chartData,
		options: {
			responsive: true,
			scales: {
				y: {
					beginAtZero: true, // Asegurar que el eje Y comienza en 0
				},
			},
		},
	});
}

export function renderTasksChart() {
	const { months, taskCounts } = getTasksByMonth(); // Obtener los datos procesados

	// Crear los datos para el gráfico
	const chartData = {
		labels: months, // Meses (ej. "2025-1", "2025-2", etc.)
		datasets: [
			{
				label: 'Número de Tareas',
				data: taskCounts, // Número de tareas por mes
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		],
	};

	// Llamar a renderChart para mostrar el gráfico
	renderChart(chartData);
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

// Lógica para obtener tareas por mes
function getTasksByMonth() {
	const tasks = loadTasksFromStorage();

	// Procesamos las tareas para obtener el mes/año
	const tasksWithMonth = tasks.map((task) => {
		const taskDate = new Date(task.createTaskDate);
		const month = taskDate.getMonth(); // Obtener mes (0-11)
		const year = taskDate.getFullYear(); // Obtener año
		const monthYear = `${year}-${month + 1}`; // Mes/Año (ej. "2025-1")

		return { ...task, monthYear: monthYear };
	});

	// Agrupar las tareas por mes/año
	const tasksByMonth = tasksWithMonth.reduce((acc, task) => {
		if (!acc[task.monthYear]) {
			acc[task.monthYear] = [];
		}
		acc[task.monthYear].push(task);
		return acc;
	}, {});

	// Crear un array con los meses y el conteo de tareas por mes
	const months = Object.keys(tasksByMonth); // Obtener los meses (ej. "2025-1")
	const taskCounts = months.map((month) => tasksByMonth[month].length); // Contar tareas por mes

	return { months, taskCounts };
}
