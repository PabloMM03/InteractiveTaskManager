/** Cargar tareas desde localStorage */
export function loadTasksFromStorage() {
	return JSON.parse(localStorage.getItem('tasks')) || [];
}

/** Guardar tareas en localStorage */
export function saveTasksToStorage(tasks) {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

/** Cargar objetivos desde localStorage */
export function loadGoalsFromStorage() {
	return JSON.parse(localStorage.getItem('goals')) || [];
}

/** Guardar objetivos en localStorage */
export function saveGoalsToStorage(goals) {
	localStorage.setItem('goals', JSON.stringify(goals));
}

/** Obtener el contador histórico de tareas */
export function loadTaskCountsHistory() {
	return JSON.parse(localStorage.getItem('taskCountsHistory')) || {};
}

/** Guardar el contador histórico de tareas */
export function saveTaskCountsHistory(counts) {
	localStorage.setItem('taskCountsHistory', JSON.stringify(counts));
}

/** Eliminar tarea del almacenamiento */
export function deleteTaskFromStorage(index) {
	const tasks = loadTasksFromStorage();
	const goals = loadGoalsFromStorage();
	const countsHistory = loadTaskCountsHistory() || {};

	const wasChecked = tasks[index].isChecked;
	const taskGoalId = tasks[index].goalId; 

	const taskDate = new Date(tasks[index].createTaskDate);
	const monthYear = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}`;

	if (taskGoalId !== 'no-goal' && goals[taskGoalId]) {
		if (wasChecked) {
			tasks[index].isActive = false;
		} else {
			tasks.splice(index, 1);
			goals[taskGoalId].totalTasks -= 1; 
			countsHistory[monthYear].total -= 1;
		}
	} else {
		if (wasChecked) {
			tasks[index].isActive = false;
		} else {
			tasks.splice(index, 1);
			countsHistory[monthYear].total -= 1;
		}
	}

	saveTasksToStorage(tasks);
	saveGoalsToStorage(goals);
	saveTaskCountsHistory(countsHistory);

	if (taskGoalId !== 'no-goal' && goals[taskGoalId]) {
		updateGoalProgressInStorage(taskGoalId);
	}
	return wasChecked;
}

/** Actualizar el progreso del objetivo en el almacenamiento */
export function updateGoalProgressInStorage(
	goalId,
	completedTasks,
	totalTasks
) {
	const goals = loadGoalsFromStorage();
	if (goalId === 'no-goal' || !goals[goalId]) return; 

	const progress =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
	goals[goalId].progress = progress;
	saveGoalsToStorage(goals);
}

/** Obtener estadísticas de tareas */
export function getStats() {
	const tasks = loadTasksFromStorage();

	const stats = {
		totalTasks: tasks.length,
		completedTasks: tasks.filter((task) => task.isChecked).length,
		tagCount: {},
	};

	tasks.forEach((task) => {
		if (task.ttag) {
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
