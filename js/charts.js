import {
	getStats,
	loadTaskCountsHistory,
	saveTaskCountsHistory,
} from './storage.js';

//Renderizar al cargar
document.addEventListener('DOMContentLoaded', () => {
	renderChart();
	renderChartByDay();
	updateStatsUI();
	renderTagChart();
});

let myChart, myChart2, myChart3;

export function renderChart(chartData) {
	const ctx = document.getElementById('taskChart').getContext('2d');

	if (myChart) {
		myChart.destroy(); 
	}

	myChart = new Chart(ctx, {
		type: 'bar',
		data: chartData,
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					labels: {
						font: {
							size: 18,
							weight: 'bold',
							family: 'Segoe UI',
						},
						color: '#4B5563',
						padding: 20,
					},
					onHover: (event) => {
						event.native.target.style.cursor = 'pointer';
					},
					onLeave: (event) => {
						event.native.target.style.cursor = 'default';
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
							size: 16,
							family: 'Segoe UI',
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
							family: 'Segoe UI',
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
			}, 
			onHover: (event, elements) => {
				if (elements.length > 0) {
					event.native.target.style.cursor = 'pointer';
				} else {
					event.native.target.style.cursor = 'default';
				}
			},

			onClick: (event, elements) => {
				if (elements.length > 0) {
					const dataIndex = elements[0].index;
					renderTasksChartByDay(dataIndex, chartData);
					showModal();
				}
			},
		},
	});
}

/** Mostrar modal */
function showModal() {
	const modal = document.getElementById('modal');
	modal.style.opacity = '1';
	modal.style.visibility = 'visible';
}

window.closeModal = function () {
	const modal = document.getElementById('modal');
	modal.style.opacity = '0';
	modal.style.visibility = 'hidden';
};

/**Renderizar grafico Tareas */
export function renderTasksChart() {
	const { months, taskCounts, completedCounts } = getTasksByMonth(); 

	const chartData = {
		labels: months,
		datasets: [
			{
				label: 'Tareas añadidas',
				data: taskCounts, 
				backgroundColor: 'rgba(255, 99, 132, 0.6)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1,
			},
			{
				label: 'Tareas completadas',
				data: completedCounts,
				backgroundColor: 'rgba(255, 159, 64, 0.6)',
				borderColor: 'rgba(255, 159, 64, 1)',
				borderWidth: 1,
			},
		],
	};

	renderChart(chartData);
}
/** Renderizar gráfico etiquetas */
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
		options: {
			plugins: {
				legend: {
					labels: {
						font: {
							family: 'Segoe UI',
						},
					},
					onHover: (event) => {
						event.native.target.style.cursor = 'pointer';
					},
					onLeave: (event) => {
						event.native.target.style.cursor = 'default';
					},
				},
			},
		},
		plugins: [
			{
			  id: 'noDataMessage',
			  beforeDraw: (chart) => {
				const dataExists = chart.data.datasets.some(dataset => dataset.data.some(value => value > 0));
		  
				const noDataMessage = document.getElementById('noDataMessage');
				if (!dataExists) {
				  noDataMessage.style.opacity = 1; 
				} else {
				  noDataMessage.style.opacity = 0;  
				}
			  },
			},
		  ],
		  
	});	
}

/** Actualizar el estado de progreso */
export function updateStatsUI() {
	const stats = getStats();
	document.getElementById('totalTasks').textContent = stats.totalTasks;
	document.getElementById('completedTasks').textContent = stats.completedTasks;
	document.getElementById('completedPercentage').textContent =
		stats.completedPercentage.toFixed(2);
}

/** Obtener tareas por mes */
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

/** Actulizar el historial de tareas */
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

	let taskCountsHistory = loadTaskCountsHistory() || {}; 
	const taskDate = new Date(data.createTaskDate);
	const monthYear = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}`;

	if (!taskCountsHistory[monthYear]) {
		taskCountsHistory[monthYear] = {
			total: 0,
			completed: 0,
			label: allMonths[taskDate.getMonth()],
		};
	}

	taskCountsHistory[monthYear].total += 1;
	if (data.isChecked) {
		taskCountsHistory[monthYear].completed += 1;
	}

	saveTaskCountsHistory(taskCountsHistory);
}

/** Funcion obtener dias del mes */
function daysPerMonth(dataIndex) {
	const { taskCounts, completedCounts } = getTasksByMonth();

	const year = new Date().getFullYear();
	const month = Number(dataIndex); 
	if (isNaN(month) || month < 0 || month > 11) {
		return [];
	}

	const lastDay = new Date(year, month + 1, 0).getDate();
	const day = new Date().getDate();

	const calendar = Array.from({ length: lastDay }, (_, i) => i + 1);

	const totalTasks = taskCounts[dataIndex] || 0;
	const completedTasks = completedCounts[dataIndex] || 0;

	function distributeTasks(total, day) {
		return Array.from({ length: total }).reduce((acc, _) => {
			const randomDay = Math.floor(Math.random() * day) + 1;
			acc[randomDay] = (acc[randomDay] || 0) + 1;
			return acc;
		}, {});
	}

	const taskDays = distributeTasks(totalTasks, day);
	const completed = distributeTasks(completedTasks, day);

	return { calendar, taskDays, completed };
}

/**Renderizar gráficos obtener tareas oir dia */
function renderChartByDay(chartData, month) {
	const ctx = document.getElementById('taskChart2').getContext('2d');
	if (myChart3) {
		myChart3.destroy(); 
	}

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
							family: 'Segoe UI',
						},
						color: '#4B5563',
						padding: 20,
					},
					onHover: (event) => {
						event.native.target.style.cursor = 'pointer';
					},
					onLeave: (event) => {
						event.native.target.style.cursor = 'default';
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
							family: 'Segoe UI',
							weight: '600',
						},
						color: '#374151',
					},
					title: {
						display: true,
						text: month,
						font: {
							size: 18,
							weight: 'bold',
							family: 'Segoe UI',
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
			}, 
			onHover: (event, elements) => {
				if (elements.length > 0) {
					event.native.target.style.cursor = 'pointer';
				} else {
					event.native.target.style.cursor = 'default';
				}
			},
		},
	});
}

function renderTasksChartByDay(dataIndex, charMonth) {
	const { calendar, taskDays, completed } = daysPerMonth(dataIndex);
	const month = charMonth.labels[dataIndex];

	const chartData = {
		labels: calendar,
		datasets: [
			{
				label: 'Tareas añadidas',
				data: calendar.map((day) => taskDays[day] || 0), 
				backgroundColor: 'rgba(255, 99, 132, 0.6)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1,
			},
			{
				label: 'Tareas completadas',
				data: calendar.map((day) => completed[day] || 0),
				backgroundColor: 'rgba(255, 159, 64, 0.6)',
				borderColor: 'rgba(255, 159, 64, 1)',
				borderWidth: 1,
			},
		],
	};
	renderChartByDay(chartData, month);
}
