// Cargar tareas desde localStorage
export function loadTasksFromStorage() {
	return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Guardar tareas en localStorage
export function saveTasksToStorage(tasks) {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Cargar objetivos desde localStorage
export function loadGoalsFromStorage() {
	return JSON.parse(localStorage.getItem('goals')) || [];
}

// Guardar objetivos en localStorage
export function saveGoalsToStorage(goals) {
	localStorage.setItem('goals', JSON.stringify(goals));
}

// Eliminar tarea del almacenamiento
export function deleteTaskFromStorage(index) {
	const tasks = loadTasksFromStorage();
	const goals = loadGoalsFromStorage();

	const wasChecked = tasks[index].isChecked;
	const taskGoalId = tasks[index].goalId; // Id del objetivo relacionado con la tarea

	// Si la tarea tiene un objetivo asociado
	if (taskGoalId !== 'no-goal' && goals[taskGoalId]) {
		if (wasChecked) {
			tasks[index].isActive = false;
		} else {
			tasks.splice(index, 1);
			goals[taskGoalId].totalTasks -= 1; // Restar 1 al total de tareas del objetivo
		}
	} else {
		// Si la tarea no tiene objetivo, eliminarla normalmente
		tasks.splice(index, 1);
	}

	// Guardar tareas y objetivos actualizados
	saveTasksToStorage(tasks);
	saveGoalsToStorage(goals);

	// Actualizar el progreso del objetivo (si tiene objetivo)
	if (taskGoalId !== 'no-goal' && goals[taskGoalId]) {
		updateGoalProgressInStorage(taskGoalId);
	}

	return wasChecked;
}

// Actualizar el progreso del objetivo en el almacenamiento
export function updateGoalProgressInStorage(
	goalId,
	completedTasks,
	totalTasks
) {
	const goals = loadGoalsFromStorage();
	if (goalId === 'no-goal' || !goals[goalId]) return; // Si no tiene objetivo no actualizar nada

	const progress =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
	goals[goalId].progress = progress;
	saveGoalsToStorage(goals);
}

export function getStats() {
	const tasks = loadTasksFromStorage();

	const stats = {
		totalTasks: tasks.length,
		completedTasks: tasks.filter((task) => task.isChecked).length,
		tagCount: {},
	};

	tasks.forEach((task) => {
		if (task.ttag) {
			// Asegurar que la tarea tiene una etiqueta válida
			if (!stats.tagCount[task.ttag]) {
				stats.tagCount[task.ttag] = 0;
			}
			stats.tagCount[task.ttag]++;
		}
	});

	stats.completedPercentage =
		stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

	return stats;
}
