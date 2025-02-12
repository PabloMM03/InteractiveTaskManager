import {
	getStats,
	loadTaskCountsHistory,
	saveTaskCountsHistory,
} from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
	renderChart();
	renderChartByDay();
	updateStatsUI();
	renderTagChart();
});

let myChart, myChart2, myChart3;

//Total tareas por mes

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
			maintainAspectRatio: true,
			plugins: {
				legend: {
					display: true,
					labels: {
						font: {
							size: 16,
							weight: 'bold',
						},
						color: '#4B5563',
						padding: 20,
					},
				},
				tooltip: {
					backgroundColor: '#1F2937',
					titleColor: '#F9FAFB',
					bodyColor: '#D1D5DB',
					cornerRadius: 5,
					padding: 15,
				},
				animation: {
					duration: 800,
					easing: 'easeInOutQuad',
				},
			},
			scales: {
				x: {
					ticks: {
						font: {
							size: 14,
							family: 'Arial',
							weight: '600',
						},
						color: '#374151',
					},
					title: {
						display: true,
						text: 'Meses',
						font: {
							size: 18,
							weight: 'bold',
						},
						color: '#111827',
					},
				},
				y: {
					ticks: {
						display: false,
					},
					grid: {
						drawTicks: false,
						color: 'transparent',
					},
				},
			}, //Cambiar cursor al haber información
			onHover: (event, elements) => {
				if (elements.length > 0) {
					event.native.target.style.cursor = 'pointer';
				} else {
					event.native.target.style.cursor = 'default';
				}
			},

			onClick: (event, elements) => {
				// Mostrar detalles por mes
				if (elements.length > 0) {
					const datasetIndex = elements[0].datasetIndex;
					const dataIndex = elements[0].index;

					const month = chartData.labels[dataIndex];
					const tasks = chartData.datasets[datasetIndex].data[dataIndex];

					const days = renderTasksChartByDay(dataIndex);
					showModal(month, tasks, days);
				}
			},
		},
	});
}

//Mostrar y cerrar modal con detalles
function showModal(month, tasks) {
	const modal = document.getElementById('modal');
	const modalText = document.getElementById('modal-text');
	// Generar el segundo gráfico
	//modalText.innerHTML = `${month} - ${tasks} Tareas`;
	modal.style.opacity = '1';
	modal.style.visibility = 'visible';
}

window.closeModal = function () {
	const modal = document.getElementById('modal');
	modal.style.opacity = '0';
	modal.style.visibility = 'hidden';
};

//renderizar las tareas
export function renderTasksChart() {
	const { months, taskCounts, completedCounts } = getTasksByMonth(); // Obtener los datos procesados

	// Crear los datos para el gráfico
	const chartData = {
		labels: months, // Meses (ej. "2025-1", "2025-2", etc.)
		datasets: [
			{
				label: 'Tareas añadidas',
				data: taskCounts, // Número de tareas por mes
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
			{
				label: 'Tareas completadas',
				data: completedCounts,
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		],
	};

	// Llamar a renderChart para mostrar el gráfico
	renderChart(chartData);
}

export function renderTagChart() {
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

//Actualizar estado del global de tareas y %
export function updateStatsUI() {
	const stats = getStats();
	document.getElementById('totalTasks').textContent = stats.totalTasks;
	document.getElementById('completedTasks').textContent = stats.completedTasks;
	document.getElementById('completedPercentage').textContent =
		stats.completedPercentage.toFixed(2);
}

//renderTagChart();

// Lógica para obtener tareas por mes
export function getTasksByMonth() {
	const allMonths = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];

	const year = new Date().getFullYear();
	let taskCountsHistory = loadTaskCountsHistory();

	const months = allMonths;
	const taskCounts = months.map(
		(_, index) => taskCountsHistory[`${year}-${index + 1}`]?.total || 0
	);
	const completedCounts = months.map(
		(_, index) => taskCountsHistory[`${year}-${index + 1}`]?.completed || 0
	);

	return { months, taskCounts, completedCounts };
}

export function updateTaskHistory(data) {
	const allMonths = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];

	let taskCountsHistory = loadTaskCountsHistory() || {}; // Cargar historial

	const taskDate = new Date(data.createTaskDate);
	const monthYear = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}`;

	// Si el mes no existe en el historial, lo inicializamos
	if (!taskCountsHistory[monthYear]) {
		taskCountsHistory[monthYear] = {
			total: 0,
			completed: 0,
			label: allMonths[taskDate.getMonth()],
		};
	}

	// Actualizar solo el mes de la tarea que se acaba de crear
	taskCountsHistory[monthYear].total += 1;
	if (data.isChecked) {
		taskCountsHistory[monthYear].completed += 1;
	}

	// Guardar historial actualizado en localStorage
	saveTaskCountsHistory(taskCountsHistory);
}

//Funcion obtener dias del mes
function daysPerMonth(dataIndex) {
	const year = new Date().getFullYear();
	const month = Number(dataIndex); // Asegurar que sea número válido
	if (isNaN(month) || month < 0 || month > 11) {
		return [];
	}

	const lastDay = new Date(year, month + 1, 0).getDate();
	const calendar = Array.from({ length: lastDay }, (_, i) => i + 1);

	return calendar;
}

function renderChartByDay(chartData) {
	const ctx = document.getElementById('taskChart2').getContext('2d');
	if (myChart3) {
		myChart3.destroy(); // Eliminar gráfico anterior si existe
	}

	// Crear el nuevo gráfico de barras
	myChart3 = new Chart(ctx, {
		type: 'bar',
		data: chartData,
		options: {
			responsive: true,
			maintainAspectRatio: true,
			plugins: {
				legend: {
					display: true,
					labels: {
						font: {
							size: 16,
							weight: 'bold',
						},
						color: '#4B5563',
						padding: 20,
					},
				},
				tooltip: {
					backgroundColor: '#1F2937',
					titleColor: '#F9FAFB',
					bodyColor: '#D1D5DB',
					cornerRadius: 5,
					padding: 15,
				},
				animation: {
					duration: 800,
					easing: 'easeInOutQuad',
				},
			},
			scales: {
				x: {
					ticks: {
						font: {
							size: 14,
							family: 'Arial',
							weight: '600',
						},
						color: '#374151',
					},
					title: {
						display: true,
						text: 'Días',
						font: {
							size: 18,
							weight: 'bold',
						},
						color: '#111827',
					},
				},
				y: {
					ticks: {
						display: false,
					},
					grid: {
						drawTicks: false,
						color: 'transparent',
					},
				},
			}, //Cambiar cursor al haber información
			onHover: (event, elements) => {
				if (elements.length > 0) {
					event.native.target.style.cursor = 'pointer';
				} else {
					event.native.target.style.cursor = 'default';
				}
			},

			// onClick: (event, elements) => {
			// 	// Mostrar detalles por mes
			// 	if (elements.length > 0) {
			// 		const datasetIndex = elements[0].datasetIndex;
			// 		const dataIndex = elements[0].index;

			// 		const month = chartData.labels[dataIndex];
			// 		const tasks = chartData.datasets[datasetIndex].data[dataIndex];

			// 		const calendar = daysPerMonth(dataIndex);

			// 		showModal(`Mes: ${month}<br>Tareas: ${tasks}`);
			// 		// showModal(`${calendar.join('')}`);
			// 	}
			// },
		},
	});
}

function renderTasksChartByDay(dataIndex) {
	const calendar = daysPerMonth(dataIndex);
	// Crear los datos para el gráfico
	const chartData = {
		labels: calendar,
		datasets: [
			{
				label: 'Tareas añadidas',
				data: [1, 2, 2], // Número de tareas por mes
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
			{
				label: 'Tareas completadas',
				data: [1, 2, 3, 4],
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		],
	};

	// Llamar a renderChart para mostrar el gráfico
	renderChartByDay(chartData);
}
