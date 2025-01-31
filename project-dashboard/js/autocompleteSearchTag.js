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
	'Educación',
	'Desarrollo personal',
	'Cultura',
	'Finanzas',
	'Relaciones',
	'Liderazgo',
	'Motivación',
	'Tecnología',
	'Innovación',
	'Entretenimiento',
	'Festejos',
	'Arte',
	'Música',
	'Lectura',
	'Videojuegos',
	'Cocina',
	'Mascotas',
	'Medicina',
	'Ciencia',
	'Emprendimiento',
	'Sostenibilidad',
	'Aventura',
	'Productividad',
	'Networking',
	'Hogar',
	'Voluntariado',
	'Programar',
];

document.addEventListener('DOMContentLoaded', () => {
	// Llamadas a la función para los dos inputs
	document
		.getElementById('gtag')
		?.addEventListener('input', () => filterTags('gtag', 'gtags-suggestions'));

	document
		.getElementById('ttag')
		?.addEventListener('input', () => filterTags('ttag', 'ttags-suggestions'));
});

function filterTags(inputId, suggestionsId) {
	const input = document.getElementById(inputId);
	const filter = input.value.toLowerCase();
	const suggestions = document.getElementById(suggestionsId);

	// Limpiar sugerencias previas
	suggestions.innerHTML = '';

	if (!input || !suggestions) return; //Verificar si existen

	// Mostrar solo las sugerencias que coinciden con la búsqueda
	const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(filter));

	// Si hay resultados, mostrar las opciones
	if (filteredTags.length > 0 && filter !== '') {
		suggestions.classList.remove('hidden');
		filteredTags.forEach((tag) => {
			const li = document.createElement('li');
			li.textContent = tag;
			li.onclick = () => selectTag(tag, inputId, suggestionsId);
			suggestions.appendChild(li);
		});
	} else {
		suggestions.classList.add('hidden');
	}
}

// Poner la etiqueta seleccionada en el campo de entrada
function selectTag(tag, inputId, suggestionsId) {
	const input = document.getElementById(inputId);
	input.value = tag;
	document.getElementById(suggestionsId).classList.add('hidden'); // Ocultar las sugerencias
}
