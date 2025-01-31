document.addEventListener('DOMContentLoaded', () => {
	loadTask(); // Cargar tareas guardadas al iniciar
	addTask(); // Agregar eventos al formulario
	loadGoals(); // Cargar objetivos guardados al iniciar
	addGoals(); // Agregar ebentos al formulario
});

/**
 * Lógica Tareas
 */

// Añadir tareas y guardar al enviar
function addTask() {
	document.querySelector('#task-form').addEventListener('submit', function (e) {
		e.preventDefault(); // Previene el envío por defecto

		// ✅ Capturar formulario completo y convertir a objeto
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		data.notifications = formData.get('notifications') === 'on';
		data.isChecked = false;

		const createTaskDate = new Date().toISOString().split('T')[0];
		data.createTaskDate = createTaskDate;

		// Verificar los datos capturados
		if (Object.keys(data).length > 0) {
			// Obtener tareas previas de localStorage o inicializar un array vacío
			const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

			tasks.push(data);
			localStorage.setItem('tasks', JSON.stringify(tasks)); // Añadir a localStorage la nueva tarea

			loadTask();
			e.target.reset(); // Limpiar el formulario después de enviar
		}
	});
}

// Cargar y mostrar tareas
function loadTask() {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	const taskList = document.getElementById('task-list');
	taskList.innerHTML = ''; // Limpiar lista antes de cargar

	//Añadir li por cada tarea
	tasks.forEach((task, index) => {
		const li = document.createElement('li');
		const span = document.createElement('span');

		span.textContent = `${task.title} - ${task.priority} - ${task.due_date}`;

		// Comprobar estado de tarea y añadir evento para cambiarlo
		if (task.isChecked) span.style.textDecoration = 'line-through';
		li.addEventListener('click', () => {
			stateTask(index, task, span);
		});

		// Botón para eliminar
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

	//Cambia su estado y actualiza la tarea en el array
	task.isChecked = !task.isChecked;
	tasks[index] = task;

	localStorage.setItem('tasks', JSON.stringify(tasks));
	span.style.textDecoration = task.isChecked ? 'line-through' : 'none';
}

// Eliminar tareas y actualizar lista
function deleteTask(index) {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	tasks.splice(index, 1); // Eliminar por índice de tarea
	localStorage.setItem('tasks', JSON.stringify(tasks));
	loadTask(); // Recargar la lista sin refrescar la página
}

/**
 * Lógica Objetivos
 */

// Añadir objetivos
function addGoals() {
	document.querySelector('#goal-form').addEventListener('submit', function (e) {
		e.preventDefault(); //Prevenir envio del formulario por defecto

		//Caspturar todo el formulario, obtener sus datos y añadirle una fecha de creación
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		const startDate = new Date().toISOString().split('T')[0];

		data.startDate = startDate;

		//Comprobar que hay objetivos, obtener el localStorage y añadirlos al él
		if (Object.keys(data).length > 0) {
			const goals = JSON.parse(localStorage.getItem('goals')) || [];

			goals.push(data);

			localStorage.setItem('goals', JSON.stringify(goals));

			console.log(goals);
			loadGoals();

			e.target.reset();
		}
	});
}

// Cargar objetivos creados
function loadGoals() {
	//Obtener json con objetivos y pasarlo a objetos
	const goals = JSON.parse(localStorage.getItem('goals')) || [];
	const goalsList = document.getElementById('goals-list');
	goalsList.innerHTML = '';

	// Recorrer los objetivos e ir añadiendo a elementos creados dinamicamente
	goals.forEach((goal, index) => {
		const span = document.createElement('span');
		const li = document.createElement('li');

		span.textContent = `${goal.gtitle} - ${goal.gtag} - ${goal.gdate}`;

		// Añadir boton de eliminar por indice de objetivo, añadiendo un evento
		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Eliminar';
		deleteButton.dataset.index = index; // Asigna el índice correctamente

		deleteButton.addEventListener('click', (e) => {
			e.stopPropagation();
			const goalIndex = parseInt(e.target.dataset.index);
			deleteGoal(goalIndex);
		});

		li.appendChild(span);
		li.appendChild(deleteButton);
		goalsList.appendChild(li);
	});
}

// Eliminar objetivos
function deleteGoal(index) {
	const goals = JSON.parse(localStorage.getItem('goals')) || [];

	//Comprobar que es un indice correcto y eliminarlo
	const updatedGoals = goals.filter((_, i) => i !== index); // Filtra el elemento por índice
	localStorage.setItem('goals', JSON.stringify(updatedGoals));

	loadGoals();
}
