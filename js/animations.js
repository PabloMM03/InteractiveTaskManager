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

document.addEventListener('DOMContentLoaded', function () {
	document
		.getElementById('gtag')
		?.addEventListener('input', () => filterTags('gtag', 'gtags-suggestions'));

	document
		.getElementById('ttag')
		?.addEventListener('input', () => filterTags('ttag', 'ttags-suggestions'));

		/**Actuazliza el botón devolver en forlumarios */
	updateBackButton();

	//Animaciónes varias 
	dropdownsAnimations();
	selectsAnimations();
	inputsAnimations();
	scrollSectionsAnimation();
	sliderAnimation();
});

/** Filtrar tareas */
function filterTags(inputId, suggestionsId) {
	const input = document.getElementById(inputId);

	if(!input) return;
	const filter = input.value.toLowerCase();
	const suggestions = document.getElementById(suggestionsId);

	suggestions.innerHTML = '';

	if (!input || !suggestions) return;

	const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(filter));

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

/** Añadir la etiqueta seleccionada en el campo de entrada */
function selectTag(tag, inputId, suggestionsId) {
	const input = document.getElementById(inputId);
	input.value = tag;
	document.getElementById(suggestionsId).classList.add('hidden'); 
}

/** Actualizar la barra de progreso de formularios */
function updateProgress(step, formType) {
	const progressBars = {
		task: { element: document.querySelector('.progress-task'), totalSteps: 5 },
		goal: { element: document.querySelector('.progress-goal'), totalSteps: 4 },
	};

	const progressBar = progressBars[formType]?.element;
	const totalSteps = progressBars[formType]?.totalSteps;

	if (progressBar) {
		progressBar.style.width = `${(step / totalSteps) * 100}%`;
	}
}

/** Animaciones del formulario */
function nextStep(step, formType) {
	function typeOfStep(stepActive, stepType) {
		let currentStep = document.querySelector(stepActive);
		let nextStep = document.getElementById(stepType + step);

		if (currentStep && nextStep) {
			currentStep.style.opacity = '0'; 
			setTimeout(() => {
				currentStep.classList.remove('active');
				currentStep.style.display = 'none';

				nextStep.style.display = 'block';
				setTimeout(() => {
					nextStep.classList.add('active');
					nextStep.style.opacity = '1'; 
					updateProgress(step, formType);
					updateBackButton();
				}, 50);
			}, 300); 
		}
	}

	if (formType === 'task') {
		typeOfStep('.step.active', 'step-');
	} else if (formType === 'goal') {
		typeOfStep('.step-goal.active', 'step-goal-');
	}

	const form = document.querySelector(`#${formType}-form`);
	form.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	});
}

function previousStep(formType) {
	function typeOfPreviousStep(stepActive, stepType) {
		let currentStep = document.querySelector(stepActive);
		let previousStep = currentStep.previousElementSibling; 

		if (currentStep && previousStep && previousStep.id.startsWith(stepType)) {
			currentStep.style.opacity = '0';
			setTimeout(() => {
				currentStep.classList.remove('active');
				currentStep.style.display = 'none';

				previousStep.style.display = 'block';
				setTimeout(() => {
					previousStep.classList.add('active');
					previousStep.style.opacity = '1'; 
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

function updateBackButton() {
	const steps = [
		{ selector: '.step.active', button: '.back-button-task' },
		{ selector: '.step-goal.active', button: '.back-button-goal' },
	];

	steps.forEach(({ selector, button }) => {
		const currentStep = document.querySelector(selector);
		const backButton = document.querySelector(button);

		if (currentStep && backButton) {
			const stepNumber = parseInt(currentStep.id.split('-').pop());
			backButton.style.display = stepNumber > 1 ? 'block' : 'none';
		}
	});
}

/*Animación de scroll en Nav*/
function scrollToNav() {
	const navbarHeight = document.querySelector('#navbar').offsetHeight;
	document.querySelectorAll('.button').forEach((button) => {
		button.addEventListener('click', function (e) {
			e.preventDefault();

			const targetId = this.getAttribute('data-target'); 
			const target = document.querySelector(targetId);

			const targetPosition =
				target.getBoundingClientRect().top + window.scrollY - navbarHeight;
			const startPosition = window.scrollY;
			const duration = 1000;
			let startTime = null;

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

	/**Animación de desplegables */
function dropdownsAnimations() {
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
}

/**Animación de campos select de formularios */
function selectsAnimations() {
		const selects = document.querySelectorAll('.entryarea .select');
	
		selects.forEach((select) => {
			const labelline = select.querySelector('.labellineSelect');
			const selectedSpan = select.querySelector('.selected');
			const menu = select.nextElementSibling; 
	
			if (!menu) return; 
	
			  select.addEventListener('focus', function () {
				labelline.classList.add('active');
			});
	
			menu.addEventListener('click', function (e) {
				const option = e.target;
				if (option.tagName === 'LI') {
					selectedSpan.textContent = option.dataset.priority || option.textContent;
					labelline.classList.add('active');
					select.classList.remove('active'); 
				}
			});
			select.addEventListener('blur', function () {
				setTimeout(() => {
					if (!selectedSpan.textContent.trim()) {
						labelline.classList.remove('active');
						menu.classList.remove('menu-open');
					}
				}, 100);
			});
		});
	
}


/**Animación de campos inputs de formularios */
function inputsAnimations() {
    const inputs = document.querySelectorAll(".entryarea input");

    inputs.forEach((input) => {
        const label = input.nextElementSibling; 

        input.addEventListener("input", function () {
            if (this.value.trim() !== "") {
                label.classList.add("active");
            } else {
                label.classList.remove("active");
            }
        });

        input.addEventListener("focus", function () {
            label.classList.add("active");
        });

        input.addEventListener("blur", function () {
            if (this.value.trim() === "") {
                label.classList.remove("active");
            }
        });
	});
}

/**Animación de scroll sections */
function scrollSectionsAnimation() {
	const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        {
            threshold: [0, 0.5, 1], 
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
}

/**Animación de sliders */
function sliderAnimation() {
		const slidersConfig = [
			{container: '.slider-container', slider: '.slider', slide: '.slide'},
			{container: '.slider-container-phrases', slider: '.slider-phrases', slide: '.slide-phrase'}
		]
	
		slidersConfig.forEach((config, index) => {
			const sliderContainer = document.querySelector(config.container);
			if(!sliderContainer) return; 
	
			const slider = sliderContainer.querySelector(config.slider);
			const slides = sliderContainer.querySelectorAll(config.slide);
			const totalSlides = slides.length;
			let currentSlide = 0;
			let slideInterval;
	
			function moveSlide(direction = 1){
				currentSlide += direction;
	
				if (currentSlide >= totalSlides) currentSlide = 0;
				else if (currentSlide < 0) currentSlide = totalSlides - 1;
				slider.style.transform = `translateX(-${currentSlide * 100}%)`;
			}
	
			function startSlider() {
				slideInterval = setInterval(() => moveSlide(), 3000);
			}
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
}

/**Menú del navbar responsive */
document.querySelector('.menu-toggle').addEventListener('click', function() {
	const navMenu = document.querySelector('nav ul');
	navMenu.classList.toggle('showNav');
});	