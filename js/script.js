import {
	renderTagChart,
	renderTasksChart,
	updateStatsUI,
	updateTaskHistory,
} from './charts.js';
import {
	loadTasksFromStorage,
	saveTasksToStorage,
	loadGoalsFromStorage,
	saveGoalsToStorage,
	deleteTaskFromStorage,
	updateGoalProgressInStorage,
	loadTaskCountsHistory,
	saveTaskCountsHistory,
} from './storage.js';

import {
	validateFormEvent
} from './validateForms.js';

//Renderizar al cargar
document.addEventListener('DOMContentLoaded', () => {
	loadTask(); 
	addTask(); 
	loadGoals(); 
	addGoals(); 
	renderTasksChart();
	slider();
});

/**
 * Lógica Tareas
 */

// Añadir tareas y guardar al enviar
function addTask() {
    const form = document.querySelector('#task-form');

    if (!form.dataset.listenerAdded) {
        form.dataset.listenerAdded = 'true'; 
        
        form.addEventListener('submit', function (e) {
            e.preventDefault(); 

            if (!validateFormEvent(e, form)) { 
                return; 
            }

            // Capturar formulario de tareas y obtener sus datos
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            const selects = document.querySelectorAll('.select');
            const priority = selects[1];
            const selected = priority.querySelector('.selected').textContent;
            data.priority = selected;

				// Datos adicionales
				data.notifications = formData.get('notifications') === 'on';
				data.isChecked = false;
				data.createTaskDate = new Date().toISOString().split('T')[0];
				data.isActive = true;

				let firtsLetter = data.title.charAt(0).toUpperCase();
				let restOfTitle = data.title.substring(1);
				data.title = firtsLetter + restOfTitle;

				let firtsLetterAssignedTo = data.assigned_to.charAt(0).toUpperCase();
				let restOfAssignedTo= data.assigned_to.substring(1);
				data.assigned_to = firtsLetterAssignedTo + restOfAssignedTo;

            const selectedGoalElement = document.querySelector('#goal-select');
            const selectedGoalId = selectedGoalElement.getAttribute('data-selected-id');

            data.goalId = selectedGoalId && selectedGoalId !== 'none' ? parseInt(selectedGoalId) : 'no-goal';

            const tasks = loadTasksFromStorage();
            tasks.push(data);
            saveTasksToStorage(tasks);

            // Actualizar historial y progreso
            updateTaskHistory(data);
            if (selectedGoalId && selectedGoalId !== 'none') {
                const goals = loadGoalsFromStorage();
                goals[selectedGoalId].totalTasks += 1;
                saveGoalsToStorage(goals);
            }

            setTimeout(() => {
				loadTask(data.goalId);
			},2150)

            updateGoalProgress(data.goalId);
	        renderTasksChart();
            renderTagChart();
		
            e.target.reset();

			//Añadir datos y animación al crear tarea 
            const taskInfoField = document.querySelector('#task-info');
            taskInfoField.value = `${data.title} - ${data.priority} - ${data.due_date}`;			

            const hiddenField = document.querySelector('#hidden-field');

            hiddenField.style.display = 'block';  
            setTimeout(() => {
                hiddenField.style.transform = 'translateX(650px) translateY(100px)';
            }, 50); 


			//Temporizador después de crear animación
			setTimeout(function() {
				Swal.fire({
					title: '¡Éxito!',
					text: 'Tarea añadida',
					icon: 'success',
					showConfirmButton: false,  
					timer: 3000,  
					width: '200px', 
					position: 'center',  
					customClass: {
						popup: 'custom-alert'  
					}
				});
			
				setTimeout(() => {
					location.reload();
				}, 3100);
			}, 2500);
			
		});
   	 }
}

// Cargar y mostrar tareas
export function loadTask(goalId) {
	const tasks = loadTasksFromStorage();
	const taskList = document.getElementById('task-list');
	taskList.innerHTML = ''; 

	tasks.sort((a, b) => new Date(b.createTaskDate) - new Date(a.createTaskDate));
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
		deleteButton.classList.add('form-buttons');
		deleteButton.textContent = 'Eliminar';
		deleteButton.addEventListener('click', (e) => {
			e.stopPropagation();
			deleteTask(index, goalId);
		});

		li.appendChild(span);
		li.appendChild(deleteButton);
		taskList.appendChild(li);
	});

	if(taskList.children.length === 0) {
		const message = document.createElement('p');
		message.textContent = 'No tienes tareas pendientes';
		message.style.color = 'gray';
		taskList.appendChild(message);

		setTimeout(() => {
			message.classList.add('show');
		},10);
	}
}

// Actualizar el estado de la tarea
function stateTask(index, task, span) {
	const tasks = loadTasksFromStorage();
	const countsHistory = loadTaskCountsHistory() || {};

	task.isChecked = !task.isChecked; 
	tasks[index] = task;
	saveTasksToStorage(tasks);

	const taskDate = new Date(task.createTaskDate);
	const monthYear = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}`;

	if (task.isChecked) {
		countsHistory[monthYear].completed += 1;
	} else {
		countsHistory[monthYear].completed = Math.max(
			0,
			countsHistory[monthYear].completed - 1
		);
	}

	saveTaskCountsHistory(countsHistory);
	span.style.textDecoration = task.isChecked ? 'line-through' : 'none';

	updateGoalProgress(task.goalId);
	renderTasksChart();
	updateStatsUI();
}

// Eliminar tareas y actualizar lista
function deleteTask(index, goalId) {
	const wasChecked = deleteTaskFromStorage(index);
	loadTask(goalId);
	updateGoalProgress(goalId);
	loadGoals();

	renderTasksChart();
	renderTagChart();

	setTimeout(function() {
		Swal.fire({
			title: '¡Éxito!',
			text: 'Tarea eliminada',
			icon: 'success',
			showConfirmButton: false,  
			timer: 3000,  
			width: '200px', 
			position: 'center',  
			customClass: {
				popup: 'custom-alert'  
			}
		});
	}, 500);

	return wasChecked;
}

/**
 * Lógica Objetivos
 */

// Añadir objetivos
function addGoals() {
		const form = document.querySelector('#goal-form');

		if (!form.dataset.listenerAdded) {
			form.dataset.listenerAdded = 'true'; 
			
			form.addEventListener('submit', function (e) {
				e.preventDefault(); 

				if (!validateFormEvent(e, form)) { 
					return; 
				}

			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData.entries());
			data.startDate = new Date().toISOString().split('T')[0];
			data.progress = 0;
			data.totalTasks = 0;
			
			let firtsLetter = data.gtitle.charAt(0).toUpperCase();
			let restOfTitle = data.gtitle.substring(1);
			data.gtitle = firtsLetter + restOfTitle;


			const goals = loadGoalsFromStorage();
			goals.push(data);
			saveGoalsToStorage(goals);

			setTimeout(() => {
				loadGoals();
			}, 2200);
			
			e.target.reset();


			//Añadir datos y animación al crear tarea 
			const taskInfoField = document.querySelector('#goal-info');
			taskInfoField.value = `${data.gtitle} - ${data.gtag} - ${data.gdate}`;			

			const hiddenField = document.querySelector('#hidden-field-goal');
			hiddenField.style.display = 'block';  
			setTimeout(() => {
				hiddenField.style.transform = 'translateX(500px) translateY(150px)';
			}, 10); 

			setTimeout(function() {
				Swal.fire({
					title: '¡Éxito!',
					text: 'Objetivo añadido',
					icon: 'success',
					showConfirmButton: false,  
					timer: 3000,  
					width: '200px', 
					position: 'center',  
					customClass: {
						popup: 'custom-alert'  
					}
				});
			
				setTimeout(() => {
					location.reload();
				}, 3100);
			}, 2500);

		});
	}
}

// Cargar objetivos creados
function loadGoals() {
	const goals = loadGoalsFromStorage();
	const goalsList = document.getElementById('goals-list');
	const menu = document.querySelector('.menu');

	goalsList.innerHTML = '';
	menu.innerHTML = '';

	const createOption = (text, value = '') => {
		const li = document.createElement('li');
		li.textContent = text;
		li.dataset.value = value;
		li.addEventListener('click', () => {
			const selectedElement = document.querySelector('.selected');
			selectedElement.textContent = text;
			document
				.getElementById('goal-select')
				.setAttribute('data-selected-id', value);
			menu.classList.remove('menu-open');
		});
		return li;
	};

	menu.append(createOption('Sin objetivo', 'none'));

	goals.sort((a, b) => new Date(b.gdate) - new Date(a.gdate));

	goals.forEach((goal, index) => {
		const li = document.createElement('li');
		li.innerHTML = `<span>${goal.gtitle} - ${goal.gtag} - ${goal.gdate}</span>`;		

		// Barra de progreso 
		const div = document.createElement('div');
		div.classList.add('progressContentGoal');
		div.innerHTML = `<div class='progressGoal'></div>`;
		li.appendChild(div);

		
		setTimeout(() => {
			li.querySelector('.progressGoal').style.width = `${goal.progress}%`;
		}, 50);

		// Botón de eliminar
		const deleteButton = document.createElement('img');
		deleteButton.src = 'assets/img/delete.gif';
		deleteButton.alt = 'Eliminar';
		deleteButton.dataset.index = index;
		deleteButton.addEventListener('click', (e) => {
			e.stopPropagation();
			deleteGoal(index);
		});

		li.append(deleteButton);
		goalsList.append(li);


		menu.append(createOption(goal.gtitle, index));
	});

	//Si no hay objetivos mostrar el mensaje
	if(goalsList.children.length === 0) {
		const message = document.createElement('p');
		message.textContent = 'No tienes objetivos pendientes';
		message.style.color = 'gray';
		goalsList.appendChild(message);

		setTimeout(() => {
			message.classList.add('show');
		},10);
	}

	menu.addEventListener('change', loadTask);
}

// Eliminar objetivos
function deleteGoal(index) {
	const goals = loadGoalsFromStorage();
	const tasks = loadTasksFromStorage();

	const goalId = index; 

	const updatedGoals = goals.filter((_, i) => i !== index);
	const updatedTasks = tasks.filter((task) => task.goalId !== goalId);

	saveGoalsToStorage(updatedGoals);
	saveTasksToStorage(updatedTasks);
	renderTagChart();

	loadGoals();
	loadTask(goalId);

	setTimeout(function() {
		Swal.fire({
			title: '¡Éxito!',
			text: 'Objetivo eliminado',
			icon: 'success',
			showConfirmButton: false,  
			timer: 3000,  
			width: '200px', 
			position: 'center',  
			customClass: {
				popup: 'custom-alert'  
			}
		});
	}, 500);
}

// Actualizar progreso de objetivos
function updateGoalProgress(goalId) {
	const tasks = loadTasksFromStorage();
	const goals = loadGoalsFromStorage();

	if (goalId === 'no-goal' || !goals[goalId]) return; 

	const relatedTasks = tasks.filter((task) => task.goalId == goalId);
	const completedTasks = relatedTasks.filter((task) => task.isChecked);

	if (goals[goalId]) {
		updateGoalProgressInStorage(
			goalId,
			completedTasks.length,
			goals[goalId].totalTasks
		);
		loadGoals();
	}
}

/**Eliminar por fecha de vencimiento pasada */
function deleteByDueDate() {
	//Tasks
	const tasks = loadTasksFromStorage();
	const today = new Date(); 
	const formattedToday = today.toISOString().split('T')[0];

	const activeTasks = tasks.filter((task) => task.due_date >= formattedToday);

	//Goals
	const goals = loadGoalsFromStorage();
	const activeGoals = goals.filter((goal) => goal.gdate >= formattedToday);

	saveTasksToStorage(activeTasks);
	saveGoalsToStorage(activeGoals);
	loadGoals()
}
//Intervalo que compruba cada minuto
setInterval(deleteByDueDate, 60000); 

/*Mostrar notificaciones de vencimiento x dias antes de su finalización */
function dueDateNotifications() {
	const tasks = loadTasksFromStorage();

	const tasksNotCompleted = tasks.filter(task => !task.isChecked && task.notifications && !task.notified);

	const today = new Date();
	const todayStr = today.toISOString().split('T')[0];

	// Almacenar tareas por fechas 
	const tasksReminder5days = [];
	const tasksReminder2days = [];
	const tasksReminder1day = [];

	tasksNotCompleted.forEach(task => {
		if (!task.due_date) return;

		const dueDate = new Date(task.due_date);

		// Calcular recordatorios
		const reminder5Days = new Date(dueDate);
		reminder5Days.setDate(dueDate.getDate() - 5);

		const reminder2Days = new Date(dueDate);
		reminder2Days.setDate(dueDate.getDate() - 2);

		const reminder1Day = new Date(dueDate);
		reminder1Day.setDate(dueDate.getDate() - 1);

		// Almacenar tareas con fechas de notificación
		tasksReminder5days.push({ task, reminderDate: reminder5Days });
		tasksReminder2days.push({ task, reminderDate: reminder2Days });
		tasksReminder1day.push({ task, reminderDate: reminder1Day });
	});

	function checkNotifications() {
		const notificationsList = document.querySelector('.notifications-dueDate ul');
		if (!notificationsList) {
			return;
		}

		// Limpiar mensajes previos antes de añadir nuevos
		notificationsList.innerHTML = '';

		// Función para añadir mensajes
		function addNotification(task, days) {
			const li = document.createElement('li');
			li.textContent = `🔔 ${task.title} (vence en ${days} días)`;
			notificationsList.appendChild(li);
		}

		let hasNotifications = false;
		// Agregar notificaciones según la fecha
		tasksReminder5days.forEach(({ task, reminderDate }) => {
			if (reminderDate.toISOString().split('T')[0] === todayStr) {
				addNotification(task, 5);
				hasNotifications = true;
			}
		});

		tasksReminder2days.forEach(({ task, reminderDate }) => {
			if (reminderDate.toISOString().split('T')[0] === todayStr) {
				addNotification(task, 2);
				hasNotifications = true;
			}
		});

		tasksReminder1day.forEach(({ task, reminderDate }) => {
			if (reminderDate.toISOString().split('T')[0] === todayStr) {
				addNotification(task, 1);
				hasNotifications = true;
			}
		});

		//Si no hay notificaciones, mostrar mensaje
		if(!hasNotifications) {
			const noNotificationsMessage = document.createElement('li');
			noNotificationsMessage.textContent = 'Sin notificaciones';
			notificationsList.appendChild(noNotificationsMessage);
		}


	}

	checkNotifications();
}

dueDateNotifications();

//Eliminar notificaciones 
document.getElementById("clearNotifications").addEventListener("click", () => {
    const notificationsList = document.querySelector(".notifications-dueDate ul");

    notificationsList.innerHTML = "";

    const tasks = loadTasksFromStorage().map(task => {
        if (task.notifications && !task.isChecked) {
            task.notified = true;  
        }
        return task;
    });

  	 saveTasksToStorage(tasks);

	 setTimeout(function() {
		Swal.fire({
			title: '¡Éxito!',
			text: 'Panel vacio',
			icon: 'success',
			showConfirmButton: false,  
			timer: 1000,  
			width: '200px', 
			position: 'center',  
			customClass: {
				popup: 'custom-alert'  
			}
		});
	
		setTimeout(() => {
			location.reload();
		}, 1000);
	}, 500);
});

/** Cargar tipos de datos en sliders */
function slider() {
	const tasks = loadTasksFromStorage();

	let ulElements = {
		priorityHigh: document.querySelector('.priorityHigh'),
		noChecked: document.querySelector('.noChecked'),
		dueDateWeekly: document.querySelector('.dueDateWeekly'),
	};

	 const today = new Date();
	 const inOneWeek = new Date();
	 inOneWeek.setDate(today.getDate() + 7);
	
	 const categorizedTasks = {
		priorityHigh: [],
		noChecked: [],
		dueDateWeekly: [],
	 };

	 //Comprobar el tipo de tarea
	 tasks.forEach((task) => {
		if(task.priority === 'Alta') {
			categorizedTasks.priorityHigh.push(task);
		}
		if(!task.isChecked) {
			categorizedTasks.noChecked.push(task);
		}
		const taskDate = new Date(task.due_date);
		if(taskDate >= today && taskDate <= inOneWeek) {
			categorizedTasks.dueDateWeekly.push(task);
		}
	 })

	 //Función interna para mostrar datos
	function optimizedSliderData(iterator, ul) {
		if(!ul) return;
		ul.innerHTML = '';

		let fragment = document.createDocumentFragment();

		iterator.forEach((task) => {
			const li = document.createElement('li');
			const span = document.createElement('span');
			const img = document.createElement('img');

			span.textContent = `${task.title}, ${task.due_date}, ${task.ttag}, ${task.assigned_to}`;
			img.src = task.notifications ? `/assets/img/check-mark.png` : `/assets/img/error.png`;
			img.alt = 'Notificación';
			Object.assign(img.style, {width: '20px', height: '20px', marginLeft: '20px'});


			li.appendChild(span);
			li.appendChild(img);
			fragment.appendChild(li);
		});

		ul.appendChild(fragment);
	}

	Object.entries(categorizedTasks).forEach(([key, iterator]) => {
		optimizedSliderData(iterator, ulElements[key]);
	})
}

