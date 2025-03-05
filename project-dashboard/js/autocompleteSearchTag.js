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

	if(!input) return;
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
function updateProgress(step, formType) {
	const progressBars = {
		//Objeto con selectores y total de pasos
		task: { element: document.querySelector('.progress-task'), totalSteps: 5 },
		goal: { element: document.querySelector('.progress-goal'), totalSteps: 4 },
	};

	// Especificar el tipo de formulario y sus elementos
	const progressBar = progressBars[formType]?.element;
	const totalSteps = progressBars[formType]?.totalSteps;

	if (progressBar) {
		progressBar.style.width = `${(step / totalSteps) * 100}%`;
	}
}

// Animaciones del formulario
function nextStep(step, formType) {
	function typeOfStep(stepActive, stepType) {
		//Siguiente paso
		let currentStep = document.querySelector(stepActive);
		let nextStep = document.getElementById(stepType + step);

		if (currentStep && nextStep) {
			currentStep.style.opacity = '0'; // Inicia la animación de desaparición
			setTimeout(() => {
				currentStep.classList.remove('active');
				currentStep.style.display = 'none';

				nextStep.style.display = 'block';
				setTimeout(() => {
					nextStep.classList.add('active');
					nextStep.style.opacity = '1'; // Muestra el nuevo paso con animación
					updateProgress(step, formType);
					updateBackButton();
				}, 50);
			}, 300); // Espera a que termine la animación antes de cambiar
		}
	}

	//Comprobar de que tipo es el formulario
	if (formType === 'task') {
		typeOfStep('.step.active', 'step-');
	} else if (formType === 'goal') {
		typeOfStep('.step-goal.active', 'step-goal-');
	}

	// Añadir event listener para evitar que el Enter haga algo
	const form = document.querySelector(`#${formType}-form`);
	form.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') {
			// Prevenir el comportamiento por defecto de Enter (que normalmente envía el formulario o pasa al siguiente campo)
			e.preventDefault();
		}
	});
}


function previousStep(formType) {
	//Paso anterior

	function typeOfPreviousStep(stepActive, stepType) {
		let currentStep = document.querySelector(stepActive);
		let previousStep = currentStep.previousElementSibling; // Paso anterior

		if (currentStep && previousStep && previousStep.id.startsWith(stepType)) {
			currentStep.style.opacity = '0'; // Inicia la animación de desaparición
			setTimeout(() => {
				currentStep.classList.remove('active');
				currentStep.style.display = 'none';

				previousStep.style.display = 'block';
				setTimeout(() => {
					previousStep.classList.add('active');
					previousStep.style.opacity = '1'; // Muestra el nuevo paso con animación
					updateProgress(previousStep.id.replace(stepType, ''), formType);
					updateBackButton();
				}, 50);
			}, 300);
		}
	}

	if (formType === 'task') {
		typeOfPreviousStep('.step.active', 'step-');
	} else if (formType === 'goal') {
		typeOfPreviousStep('.step-goal.active', 'step-goal-');
	}
}

//Mostrar el boton de volver cuando sea necesario
function updateBackButton() {
	const steps = [
		{ selector: '.step.active', button: '.back-button-task' },
		{ selector: '.step-goal.active', button: '.back-button-goal' },
	];

	steps.forEach(({ selector, button }) => {
		const currentStep = document.querySelector(selector);
		const backButton = document.querySelector(button);

		if (currentStep && backButton) {
			//Se toma el ultimo valor del selector
			const stepNumber = parseInt(currentStep.id.split('-').pop());
			backButton.style.display = stepNumber > 1 ? 'block' : 'none';
		}
	});
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

//Desplegable de selección

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
document.addEventListener("DOMContentLoaded", function () {
    const selects = document.querySelectorAll('.entryarea .select');

    selects.forEach((select) => {
        const labelline = select.querySelector('.labellineSelect');
        const selectedSpan = select.querySelector('.selected');
        const menu = select.nextElementSibling; 

        if (!menu) return; // Evitar errores si no hay menú asociado

		  // Cuando el contenedor recibe el foco
		  select.addEventListener('focus', function () {
            labelline.classList.add('active');
        });

        // Manejo de selección de opciones del menú
        menu.addEventListener('click', function (e) {
            const option = e.target;
            if (option.tagName === 'LI') {
                selectedSpan.textContent = option.dataset.priority || option.textContent; // Usa el atributo data o el texto
                labelline.classList.add('active');
                select.classList.remove('active'); 
			}
        });

        // Ocultar label si no hay valor
        select.addEventListener('blur', function () {
            setTimeout(() => {
                if (!selectedSpan.textContent.trim()) {
                    labelline.classList.remove('active');
					menu.classList.remove('menu-open');
                }
            }, 100);
        });
    });
});

//Campos inputs con animación de label
document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".entryarea input");

    inputs.forEach((input) => {
        const label = input.nextElementSibling; // La etiqueta labelline

        // Evento cuando el usuario escribe
        input.addEventListener("input", function () {
            if (this.value.trim() !== "") {
                label.classList.add("active");
            } else {
                label.classList.remove("active");
            }
        });

        // Evento cuando el campo gana el foco
        input.addEventListener("focus", function () {
            label.classList.add("active");
        });

        // Evento cuando el campo pierde el foco y está vacío
        input.addEventListener("blur", function () {
            if (this.value.trim() === "") {
                label.classList.remove("active");
            }
        });
    });
});

//Animación secciones scroll

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }else{
					// entry.target.classList.remove("visible");
				}
            });
        },
        {
            threshold: [0, 0.5, 1], // Detecta cuando el 0%, 50% o 100% del elemento es visible
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
});

//Animación de sliders sections

document.addEventListener("DOMContentLoaded", function () {

	//COnfiguracion de sliders con respectivas clases
	const slidersConfig = [
		{container: '.slider-container', slider: '.slider', slide: '.slide'},
		{container: '.slider-container-phrases', slider: '.slider-phrases', slide: '.slide-phrase'}
	]

	slidersConfig.forEach((config, index) => {
		const sliderContainer = document.querySelector(config.container);
		if(!sliderContainer) return; // SI  o existe el slider , ignoramos

		const slider = sliderContainer.querySelector(config.slider);
		const slides = sliderContainer.querySelectorAll(config.slide);
		const totalSlides = slides.length;
		let currentSlide = 0;
		let slideInterval;

		//cambiar de slide
		function moveSlide(direction = 1){
			currentSlide += direction;

			if (currentSlide >= totalSlides) currentSlide = 0;
			else if (currentSlide < 0) currentSlide = totalSlides - 1;
			slider.style.transform = `translateX(-${currentSlide * 100}%)`;
		}

		//Iniciar slider automatico
		function startSlider() {
			slideInterval = setInterval(() => moveSlide(), 3000);
		}

		//Parar slider al posar encima el ratón
		function stopSlider() {
			clearInterval(slideInterval);
		}

		sliderContainer.addEventListener('mouseover', stopSlider);
		sliderContainer.addEventListener('mouseout', startSlider);

		const prevButton = sliderContainer.querySelector('.prev');
		const nextButton = sliderContainer.querySelector('.next');

		if(prevButton) prevButton.addEventListener('click', () => moveSlide(-1));
		if(nextButton) nextButton.addEventListener('click', () => moveSlide(1));

		startSlider();
	});
});

//Menu responsive
document.querySelector('.menu-toggle').addEventListener('click', function() {
	const navMenu = document.querySelector('nav ul');
	navMenu.classList.toggle('showNav');
});	