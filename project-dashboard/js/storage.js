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
export function deleteTaskFromStorage(index, goalId) {
	const tasks = loadTasksFromStorage();
	const goals = loadGoalsFromStorage();

	const wasChecked = tasks[index].isChecked;

	if (wasChecked) {
		tasks[index].isActive = false;
	} else {
		tasks.splice(index, 1);
		goals[goalId].totalTasks -= 1;
	}

	saveTasksToStorage(tasks);
	saveGoalsToStorage(goals);
	return wasChecked;
}

// Actualizar el progreso del objetivo en el almacenamiento
export function updateGoalProgressInStorage(
	goalId,
	completedTasks,
	totalTasks
) {
	const goals = loadGoalsFromStorage();
	const progress =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
	goals[goalId].progress = progress;
	saveGoalsToStorage(goals);
}
