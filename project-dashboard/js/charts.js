import { getStats } from './storage.js';
import { loadTasksFromStorage } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
	renderChart();
	updateStatsUI();
	renderTagChart();
	// renderChart2();
});

let myChart, myChart2;

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
			responsive: true, // Se ajusta automáticamente al tamaño del contenedor
			maintainAspectRatio: true, // Permite cambiar el tamaño manualmente
			plugins: {
				legend: {
					display: true,
					labels: {
						font: {
							size: 16, // Aumenta el tamaño de la fuente de la leyenda
							weight: 'bold',
						},
						color: '#4B5563',
						padding: 20, // Más espacio alrededor de la leyenda
					},
				},
				tooltip: {
					backgroundColor: '#1F2937',
					titleColor: '#F9FAFB',
					bodyColor: '#D1D5DB',
					cornerRadius: 5,
					padding: 15, // Un poco más de espacio en el tooltip
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
							size: 14, // Aumenta el tamaño de las etiquetas en eje X
							family: 'Arial',
							weight: '600',
						},
						color: '#374151',
					},
					title: {
						display: true,
						text: 'Meses',
						font: {
							size: 18, // Título más grande
							weight: 'bold',
						},
						color: '#111827',
					},
				},
				y: {
					ticks: {
						display: false, // Ocultar los números del eje Y
					},
					grid: {
						drawTicks: false,
						color: 'transparent',
					},
				},
			},
			// Tienes que definir un tamaño adecuado en el contenedor de tu gráfico
			// Esto lo puedes hacer en CSS
		},
	});
}

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
				backgroundColor: '(rgba(75, 192,192,0.6)',
				borderColor: 'rgba(75,192,192,1)',
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

// renderTagChart();

// Lógica para obtener tareas por mes
function getTasksByMonth() {
	const tasks = loadTasksFromStorage();

	// Lista con todos los meses
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

	// Objeto con todos los meses inicializados en 0
	const year = new Date().getFullYear(); // Año actual

	const tasksByMonth = allMonths.reduce((acc, month, index) => {
		const monthYear = `${year}-${index + 1}`; // Formato "2025-1"
		acc[monthYear] = {
			total: 0,
			completed: 0,
			label: month,
		}; // Inicializa en 0 tareas
		return acc;
	}, {});

	// Procesar las tareas existentes
	tasks.forEach((task) => {
		const taskDate = new Date(task.createTaskDate);
		const monthYear = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}`;

		// Sumar la tarea al mes correspondiente
		if (tasksByMonth[monthYear]) {
			tasksByMonth[monthYear].total += 1;
			if (task.isChecked) {
				tasksByMonth[monthYear].completed += 1;
			}
		}
	});

	const months = allMonths;
	const taskCounts = months.map(
		(_, index) => tasksByMonth[`${year}-${index + 1}`].total
	);
	const completedCounts = months.map(
		(_, index) => tasksByMonth[`${year}-${index + 1}`].completed
	);

	return { months, taskCounts, completedCounts };
}
