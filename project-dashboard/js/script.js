import { renderChart, renderTasksChart } from './charts.js';
import {
	loadTasksFromStorage,
	saveTasksToStorage,
	loadGoalsFromStorage,
	saveGoalsToStorage,
	deleteTaskFromStorage,
	updateGoalProgressInStorage,
} from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
	loadTask(); // Cargar tareas guardadas al iniciar
	addTask(); // Agregar eventos al formulario
	loadGoals(); // Cargar objetivos guardados al iniciar
	addGoals(); // Agregar eventos al formulario
	renderTasksChart();

	//addSampleTask(); // Añadir tarea simulada
});

/**
 * Lógica Tareas
 */

// Añadir tareas y guardar al enviar
function addTask() {
	document.querySelector('#task-form').addEventListener('submit', function (e) {
		e.preventDefault();

		// Capturar formulario de tareas y obtener sus datos
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());

		// Datos externos al formulario para info
		data.notifications = formData.get('notifications') === 'on';
		data.isChecked = false;
		data.createTaskDate = new Date().toISOString().split('T')[0];
		data.isActive = true;

		const selectedGoalId = document.getElementById('goal-select').value;
		if (!selectedGoalId) {
			// alert('Por favor, selecciona un objetivo.');
			// return;
			data.goalId = 'no-goal';
		} else {
			// Añadir id del campo seleccionable de objetivos
			data.goalId = parseInt(selectedGoalId);
		}

		const tasks = loadTasksFromStorage();
		tasks.push(data);
		saveTasksToStorage(tasks);

		// Incrementar el total de tareas del objetivo
		const goals = loadGoalsFromStorage();
		goals[selectedGoalId].totalTasks += 1;
		saveGoalsToStorage(goals);

		loadTask(data.goalId);
		updateGoalProgress(data.goalId);

		//Actualizar gráficos después de añadir tarea
		renderTasksChart();

		e.target.reset();
	});
}

// Cargar y mostrar tareas
export function loadTask(goalId) {
	const tasks = loadTasksFromStorage();
	const taskList = document.getElementById('task-list');
	taskList.innerHTML = '';

	tasks.forEach((task, index) => {
		if (!task.isActive) return;

		const li = document.createElement('li');
		const span = document.createElement('span');
		span.textContent = `${task.title} - ${task.priority} - ${task.due_date}`;

		if (task.isChecked) span.style.textDecoration = 'line-through';
		li.addEventListener('click', () => {
			stateTask(index, task, span);
		});

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Eliminar';
		deleteButton.addEventListener('click', (e) => {
			e.stopPropagation();
			deleteTask(index, goalId);
		});

		li.appendChild(span);
		li.appendChild(deleteButton);
		taskList.appendChild(li);
	});
}

// Actualizar el estado de la tarea
function stateTask(index, task, span) {
	const tasks = loadTasksFromStorage();
	task.isChecked = !task.isChecked; //Cambiar estado
	tasks[index] = task;
	saveTasksToStorage(tasks);

	span.style.textDecoration = task.isChecked ? 'line-through' : 'none';
	updateGoalProgress(task.goalId);

	//Actualizar gráficos después de añadir tarea
	// renderChart();
	renderTasksChart();
}

// Eliminar tareas y actualizar lista
function deleteTask(index, goalId) {
	const wasChecked = deleteTaskFromStorage(index);
	loadTask(goalId);
	updateGoalProgress(goalId);

	//Actualizar gráficos después de añadir tarea
	// renderChart();
	renderTasksChart();

	return wasChecked;
}

/**
 * Lógica Objetivos
 */

// Añadir objetivos
function addGoals() {
	document.querySelector('#goal-form').addEventListener('submit', function (e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		data.startDate = new Date().toISOString().split('T')[0];
		data.progress = 0;
		data.totalTasks = 0;
		data.completedTasks = 0;

		const goals = loadGoalsFromStorage();
		goals.push(data);
		saveGoalsToStorage(goals);

		loadGoals();
		e.target.reset();
	});
}

// Cargar objetivos creados
function loadGoals() {
	const goals = loadGoalsFromStorage();
	const goalsList = document.getElementById('goals-list');
	const goalSelect = document.getElementById('goal-select');

	//Añadir campo de seleccion al crear tarea
	goalsList.innerHTML = '';
	goalSelect.innerHTML = '<option value="">Selecciona un objetivo</option>';

	// Obtener objetivos y crear lista dinámica para mostrar
	goals.forEach((goal, index) => {
		const span = document.createElement('span');
		const li = document.createElement('li');
		span.textContent = `${goal.gtitle} - ${goal.gtag} - ${goal.gdate} - Progreso: ${goal.progress}%`;

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Eliminar';
		deleteButton.dataset.index = index;
		deleteButton.addEventListener('click', (e) => {
			e.stopPropagation();
			deleteGoal(index);
		});

		li.appendChild(span);
		li.appendChild(deleteButton);
		goalsList.appendChild(li);

		//Añadir el objetivo a las opciones del form-task
		const option = document.createElement('option');
		option.value = index;
		option.textContent = goal.gtitle;
		goalSelect.appendChild(option);
	});

	goalSelect.addEventListener('change', loadTask);
}

// Eliminar objetivos
function deleteGoal(index) {
	const goals = loadGoalsFromStorage();
	const tasks = loadTasksFromStorage();

	const goalId = index; //Id del objetivo a eliminar

	//Filtrar objetivos y tareas relacionadas para al mismo
	const updatedGoals = goals.filter((_, i) => i !== index);
	const updatedTasks = tasks.filter((task) => task.goalId !== goalId);

	//Guardar almacenamiento y actualizar
	saveGoalsToStorage(updatedGoals);
	saveTasksToStorage(updatedTasks);
	loadGoals();
	loadTask(goalId);
}

// Actualizar progreso de objetivos
function updateGoalProgress(goalId) {
	const tasks = loadTasksFromStorage();
	const goals = loadGoalsFromStorage();

	if (goalId === 'no-goal' || !goals[goalId]) return; //Si la tarea no tiene objetivo, no hace nada

	const relatedTasks = tasks.filter((task) => task.goalId == goalId);
	const completedTasks = relatedTasks.filter((task) => task.isChecked);

	// Asegurar que el goalId asignado a la tarea pertenece a un objetivo
	if (goals[goalId]) {
		updateGoalProgressInStorage(
			goalId,
			completedTasks.length,
			goals[goalId].totalTasks
		);
		loadGoals();
	}
}

//Silmular una tarea
function addSampleTask() {
	const sampleTask = {
		title: 'Tarea simulada Marzo',
		priority: 'Alta',
		due_date: '2025-01-15',
		notifications: true,
		isChecked: false,
		createTaskDate: '2025-12-15',
		isActive: true,
		goalId: 'no-goal',
	};

	const tasks = loadTasksFromStorage();
	tasks.push(sampleTask); // Añadir la tarea simulada al array de tareas

	saveTasksToStorage(tasks); // Guardar las tareas en el localStorage
}
