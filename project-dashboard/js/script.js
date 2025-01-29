document.addEventListener('DOMContentLoaded', () => {
	loadTask(); // Cargar tareas guardadas al iniciar
	addTask(); // Agregar eventos al formulario
});

// Añadir tareas y guardar al enviar
function addTask() {
	document.querySelector('form').addEventListener('submit', function (e) {
		e.preventDefault(); // Previene el envío por defecto

		// ✅ Capturar formulario completo y convertir a objeto
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		data.notifications = formData.get('notifications') === 'on';
		data.isChecked = false;

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
