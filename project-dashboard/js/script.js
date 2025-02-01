document.addEventListener('DOMContentLoaded', () => {
	loadTask(); // Cargar tareas guardadas al iniciar
	addTask(); // Agregar eventos al formulario
	loadGoals(); // Cargar objetivos guardados al iniciar
	addGoals(); // Agregar eventos al formulario
});

/**
 * Lógica Tareas
 */

// Añadir tareas y guardar al enviar
function addTask() {
	document.querySelector('#task-form').addEventListener('submit', function (e) {
		e.preventDefault();

		//Capturar formulario de tareas y obtener sus datos
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());

		// Datos externos al formulario para info
		data.notifications = formData.get('notifications') === 'on';
		data.isChecked = false;
		data.createTaskDate = new Date().toISOString().split('T')[0];
		data.isActive = true;

		const selectedGoalId = document.getElementById('goal-select').value;
		if (!selectedGoalId) {
			alert('Por favor, selecciona un objetivo.');
			return;
		}
		//Añadir id del campo seleccionable de objetivos
		data.goalId = parseInt(selectedGoalId);

		const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
		tasks.push(data);
		localStorage.setItem('tasks', JSON.stringify(tasks));

		// Incrementar el total de tareas del objetivo
		const goals = JSON.parse(localStorage.getItem('goals')) || [];
		goals[selectedGoalId].totalTasks += 1;
		localStorage.setItem('goals', JSON.stringify(goals));

		loadTask();
		updateGoalProgress(data.goalId);
		e.target.reset();
	});
}

// Cargar y mostrar tareas
function loadTask() {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	const taskList = document.getElementById('task-list');
	taskList.innerHTML = '';

	// Mostrar cada tarea creando campos dinamicos
	tasks.forEach((task, index) => {
		if (!task.isActive) return; // Mostrar solo las activas

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
			deleteTask(index);
		});

		li.appendChild(span);
		li.appendChild(deleteButton);
		taskList.appendChild(li);
	});
}

// Actualizar el estado de la tarea
function stateTask(index, task, span) {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	task.isChecked = !task.isChecked;
	tasks[index] = task;
	localStorage.setItem('tasks', JSON.stringify(tasks));

	span.style.textDecoration = task.isChecked ? 'line-through' : 'none';
	updateGoalProgress(task.goalId);
}

// Eliminar tareas y actualizar lista
function deleteTask(index) {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	const selectedGoalId = document.getElementById('goal-select').value;
	tasks[index].isActive = false;
	// tasks.splice(index, 1);
	localStorage.setItem('tasks', JSON.stringify(tasks));
	loadTask(); // Recargar la lista
	updateGoalProgress(selectedGoalId); // Actualizar el progreso del objetivo
}

/**
 * Lógica Objetivos
 */

// Añadir objetivos
function addGoals() {
	document.querySelector('#goal-form').addEventListener('submit', function (e) {
		e.preventDefault();
		//Obtener datos del formulario y añadir campos de ayuda
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		data.startDate = new Date().toISOString().split('T')[0];
		data.progress = 0;
		data.totalTasks = 0; // Inicializar totalTasks

		const goals = JSON.parse(localStorage.getItem('goals')) || [];
		goals.push(data);
		localStorage.setItem('goals', JSON.stringify(goals));
		loadGoals();
		e.target.reset();
	});
}

// Cargar objetivos creados
function loadGoals() {
	const goals = JSON.parse(localStorage.getItem('goals')) || [];
	const goalsList = document.getElementById('goals-list');
	const goalSelect = document.getElementById('goal-select');
	goalsList.innerHTML = '';

	// Campo para seleccionar un objetivo creado
	goalSelect.innerHTML = '<option value="">Selecciona un objetivo</option>';

	//Mostrar información de los objetivos y su progreso
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

		const option = document.createElement('option');
		option.value = index;
		option.textContent = goal.gtitle;
		goalSelect.appendChild(option);
	});

	goalSelect.addEventListener('change', loadTask);
}

// Eliminar objetivos
function deleteGoal(index) {
	const goals = JSON.parse(localStorage.getItem('goals')) || [];
	const updatedGoals = goals.filter((_, i) => i !== index);

	localStorage.setItem('goals', JSON.stringify(updatedGoals));
	loadGoals();
}

// Actualizar progreso de objetivos
function updateGoalProgress(goalId) {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	const goals = JSON.parse(localStorage.getItem('goals')) || [];

	const relatedTasks = tasks.filter((task) => task.goalId == goalId);
	const completedTasks = relatedTasks.filter((task) => task.isChecked);

	// Redondear el % del progreso calculado

	const progress =
		goals[goalId].totalTasks >= 0
			? Math.round((completedTasks.length / goals[goalId].totalTasks) * 100)
			: 0;
	goals[goalId].progress = progress;
	localStorage.setItem('goals', JSON.stringify(goals));
	loadGoals();
}
