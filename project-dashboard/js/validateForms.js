/*Validación de formularios*/
const ERROR_CAMPO = 'error';
const ERROR_MENSAJES = 'campoError';
const MIN_CHAR = 5;


document.addEventListener('DOMContentLoaded', createListeners)

function createListeners() {
    // Obtenemos todos los formularios
    const forms = document.querySelectorAll('form');

    // Recorremos cada formulario y añadimos los listeners correspondientes
    forms.forEach(form => {
        // No validar al formulario
        form.setAttribute('novalidate', true);

        const fields = form.querySelectorAll('input');

        fields.forEach(field => {     
            field.addEventListener('keyup', validateField, false);
            field.addEventListener('invalid', notifyFieldError, false);
            field.addEventListener('input', reviewFieldErrors, false); 
        });

        // Añadir el listener de submit para cada formulario
        form.addEventListener('submit', (e) => validateFormEvent(e, form), false);
    });
}



function validateField(e) {
    const field = e.target;
    updateFieldErrors(field);
    validateField1(field);
}


function updateFieldErrors(field) {
    const content = field.value;
    let messages = [];

    // si los campos tienen estos dos ids no mostrar errores
    if(field.id === 'task-info' || field.id === 'notifications' ||field.id === 'goal-info') { return; }

    if(field.id === 'dateField' || field.id === 'gdate') {
        validateDateField(content, messages);
    }else  {
        validateTextField(field, content, messages);
    }

    field.setCustomValidity(messages.length > 0 ? messages.join('. ') : '')
  
    // Mostrar mensaje de error personalizado en el DOM
    if (messages.length > 0) {
        showErrorMessage(messages, field);
    } else {
        deleteErrors(field);
    }
}

function validateDateField(content, messages) {
   
    if (content === '') {
        messages.push(`El campo no puede estar vacío`);
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignorar la hora para comparación correcta
        const selectedDate = new Date(content);

        if (selectedDate < today) {
            messages.push(`La fecha no puede ser en el pasado`);
        }
     }
    
}

function validateTextField(field, content, messages) {
    const minLength = field.id === 'ttag' || field.id === 'assigned-to' || field.id === 'gtag' ? 3: MIN_CHAR;

    if (content === '') {
        messages.push(`El campo no puede estar vacío`);
    } else if (content.length < minLength) {
        messages.push(`El campo debe tener al menos ${minLength} caracteres`);
    } else if (content.length > 25) {
        messages.push(`El campo no puede tener más de 25 caracteres`);
    }
}

function reviewFieldErrors(e) {
    const field =  e.target;
    updateFieldErrors(field);
    if(field.validity.valid) {
        deleteErrors(field);
    }
}

function validateField1(field) {
    deleteErrors(field);
    return field.checkValidity();   
}

function notifyFieldError(e) {
    const field = e.target;
    let messages = [];

    if(field.validity.customError) {
        messages.push(field.validationMessage);
    }

    showErrorMessage(messages, field);
}


export function deleteErrors(field){

    field.classList.remove(ERROR_CAMPO);

    const containerErrores = document.getElementById(`${field.name}-${ERROR_CAMPO}`);

    if(containerErrores) {
        containerErrores.parentElement.removeChild(containerErrores);
    }
}

export function showErrorMessage(messages, field) {
    deleteErrors(field);

    if(messages.length === 0){
        return;
    } 

    field.classList.add(ERROR_CAMPO)

    let containerMessages = document.createElement('div');

    containerMessages.classList.add(ERROR_MENSAJES);
    containerMessages.setAttribute('aria-labelledby', field.id);

    containerMessages.id = `${field.name}-${ERROR_CAMPO}`;
    for(let message of messages) {
        let p = document.createElement('p');
        p.textContent = message;
        containerMessages.appendChild(p);
    }

    insertAfter(field, containerMessages);
}

function insertAfter(referencefield, fieldAdd) {
    if(referencefield.nextSibling) {
        referencefield.parentNode.insertBefore(fieldAdd, referencefield.nextSibling);
    } else {
        referencefield.parentNode.appendChild(fieldAdd);
    }
}

export function validateFormEvent(e, form) {
    let validForm = true;

    // Verificar la validez de cada campo
    form.querySelectorAll('input').forEach(field => {
        if (updateFieldErrors(field)) {
            validForm = false;
            field.focus(); // Focalizar en el primer campo inválido
        }
    });

    // Validar campos específicos según el formulario
    if (form.id === 'task-form') {
        validForm = validateField1(document.getElementById('titulo')) && validForm;
        validForm = validateField1(document.getElementById('ttag')) && validForm;
        validForm = validateField1(document.getElementById('assigned-to')) && validForm;
        validForm = validateField1(document.getElementById('dateField')) && validForm;
    }

    if (form.id === 'goal-form') {
        // Validar campos específicos de otro formulario (Ejemplo)
        validForm = validateField1(document.getElementById('gtitle')) && validForm;
        validForm = validateField1(document.getElementById('gdate')) && validForm;
        validForm = validateField1(document.getElementById('gtag')) && validForm;

    }

    if (!validForm) {
        e.preventDefault(); // Prevenir el envío si hay errores
    }

    return validForm;
}