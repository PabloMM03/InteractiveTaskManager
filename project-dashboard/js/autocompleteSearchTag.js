const tags = [
	'Trabajo',
	'Urgente',
	'Personal',
	'Salud',
	'Deportes',
	'Estudios',
	'Viajes',
	'Familia',
	'Hobbies',
	'Proyectos',
]; // Ejemplo de etiquetas

function filterTags() {
	const input = document.getElementById('tag');
	const filter = input.value.toLowerCase();
	const suggestions = document.getElementById('tags-suggestions');

	// Limpiar sugerencias previas
	suggestions.innerHTML = '';

	// Mostrar solo las sugerencias que coinciden con la búsqueda
	const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(filter));

	// Si hay resultados, mostrar las opciones
	if (filteredTags.length > 0 && filter !== '') {
		suggestions.classList.remove('hidden');
		filteredTags.forEach((tag) => {
			const li = document.createElement('li');
			li.textContent = tag;
			li.onclick = () => selectTag(tag);
			suggestions.appendChild(li);
		});
	} else {
		suggestions.classList.add('hidden');
	}
}

function selectTag(tag) {
	const input = document.getElementById('tag');
	input.value = tag; // Poner la etiqueta seleccionada en el campo de entrada
	document.getElementById('tags-suggestions').classList.add('hidden'); // Ocultar las sugerencias
}
