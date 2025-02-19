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

//Función que actualiza la barra de progreso del form
function updateProgress(step) {
	const totalSteps = 6;
	const progressBar = document.querySelector('.progress');

	const percentage = (step / totalSteps) * 100;
	progressBar.style.width = `${percentage}%`;
}

// Animaciones del formulario
function nextStep(step) {
	//Siguiente paso
	let currentStep = document.querySelector('.step.active');
	let nextStep = document.getElementById('step-' + step);

	if (currentStep && nextStep) {
		currentStep.style.opacity = '0'; // Inicia la animación de desaparición
		setTimeout(() => {
			currentStep.classList.remove('active');
			currentStep.style.display = 'none';

			nextStep.style.display = 'block';
			setTimeout(() => {
				nextStep.classList.add('active');
				nextStep.style.opacity = '1'; // Muestra el nuevo paso con animación
				updateProgress(step);
				updateBackButton();
			}, 50);
		}, 300); // Espera a que termine la animación antes de cambiar
	}
}

function previousStep() {
	//Paso anterior
	let currentStep = document.querySelector('.step.active');
	let prevStepId = parseInt(currentStep.id.split('-')[1]) - 1;
	let prevStep = document.getElementById('step-' + prevStepId);

	if (prevStep) {
		currentStep.style.opacity = '0';

		setTimeout(() => {
			currentStep.classList.remove('active');
			currentStep.style.display = 'none';

			prevStep.style.display = 'block';
			setTimeout(() => {
				prevStep.classList.add('active');
				prevStep.style.opacity = '1';
				updateProgress(prevStepId);
				updateBackButton();
			}, 50);
		}, 300);
	}
}

//Mostrar el boton de volver cuando sea necesario
function updateBackButton() {
	const currentStep = document.querySelector('.step.active');
	const backButton = document.querySelector('.back-button');
	backButton.style.display =
		parseInt(currentStep.id.split('-')[1]) > 1 ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
	updateBackButton();
});

//Animación de scroll al hacer click en nav
function scrollToNav() {
	const navbarHeight = document.querySelector('#navbar').offsetHeight; // Obtener la altura de la navbar
	document.querySelectorAll('.button').forEach((button) => {
		button.addEventListener('click', function (e) {
			e.preventDefault();

			const targetId = this.getAttribute('data-target'); //Obtener target segun id
			const target = document.querySelector(targetId);

			//Obtener posicion del objetivo
			const targetPosition =
				target.getBoundingClientRect().top + window.scrollY - navbarHeight;
			const startPosition = window.scrollY;
			const duration = 1000;
			let startTime = null;

			//Realizar animación hacia el objetivo
			function animationScroll(currenTime) {
				if (!startTime) startTime = currenTime;
				const timeElapsed = currenTime - startTime;
				const progress = Math.min(timeElapsed / duration, 1);
				window.scrollTo(
					0,
					startPosition +
						(targetPosition - startPosition) * easeOutCubic(progress)
				);

				if (timeElapsed < duration) requestAnimationFrame(animationScroll);
			}

			function easeOutCubic(t) {
				return 1 - Math.pow(1 - t, 3);
			}

			requestAnimationFrame(animationScroll);
		});
	});
}

scrollToNav();

//Desplegable

const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach((dropdown) => {
	const select = dropdown.querySelector('.select');
	const caret = dropdown.querySelector('.caret');
	const menu = dropdown.querySelector('.menu');
	const options = menu.querySelectorAll('li');
	const selected = dropdown.querySelector('.selected');

	select.addEventListener('click', () => {
		select.classList.toggle('select-clicked');
		caret.classList.toggle('caret-rotate');
		menu.classList.toggle('menu-open');
	});

	options.forEach((option) => {
		option.addEventListener('click', () => {
			selected.innerHTML = option.innerHTML;
			select.classList.remove('select-clicked');
			caret.classList.remove('caret-rotate');
			menu.classList.remove('menu-open');

			options.forEach((opt) => opt.classList.remove('active'));
			option.classList.add('active');
		});
	});
});

//Campos selects con animación de label

const selects = document.querySelectorAll('.select');

selects.forEach((select) => {
	const labelline = select.querySelector('.labellineSelect');
	const selectedSpan = select.querySelector('.selected');
	// Cuando el select recibe el foco
	select.addEventListener('focus', function () {
		// Si el valor está vacío, solo muestra la animación
		if (selectedSpan.textContent !== 'Selecciona un objetivo') {
			labelline.style.transform = 'translate(-22px, -23px) scale(0.88)';
			labelline.style.zIndex = 1111;
			labelline.style.padding = '0 12px';
			labelline.style.height = '30px';
		}
	});
});
