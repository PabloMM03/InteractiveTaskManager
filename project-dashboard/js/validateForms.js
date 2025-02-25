/*Validación de formularios*/
const ERROR_CAMPO = 'error';
const ERROR_MENSAJES = 'campoError';
const MIN_CHAR = 8;


document.addEventListener('DOMContentLoaded', createListeners)

function createListeners() {

    //No validate al formulario
    document.getElementById('task-form').setAttribute('novalidate', true);

    document.getElementById('titulo').addEventListener('keyup', validateTitleEvent, false);
    document.getElementById('titulo').addEventListener('invalid', titleEventNotifyError, false);
    document.getElementById('titulo').addEventListener('input', reviewErrorsEventsTitle, false);

    document.getElementById('ttag').addEventListener('keyup', validateTtagEvent, false);
    document.getElementById('ttag').addEventListener('invalid', ttagEventNotifyError, false);
    document.getElementById('ttag').addEventListener('input', reviewErrorsEventsTtag, false);

    document.getElementById('assigned-to').addEventListener('keyup', validateAssignedEvent, false);
    document.getElementById('assigned-to').addEventListener('invalid', assignedEventNotifyError, false);
    document.getElementById('assigned-to').addEventListener('input', reviewErrorsEventsAssigned, false);

    document.getElementById('dateField').addEventListener('input', validateDateEvent, false);
    document.getElementById('dateField').addEventListener('invalid', dateEventNotifyError, false);
    document.getElementById('dateField').addEventListener('input', reviewErrorsEventsDate, false);


    document.getElementById('task-form').addEventListener('submit', validateFormEvent, false);

}

function validateTitleEvent(e) {
    const title = e.target;
    updateTitleErrors(title);
    validateField(title);
}

function validateTtagEvent(e) {
    const ttag =  e.target;
    updateTtagErrors(ttag); 
    validateField(ttag);
}

function validateAssignedEvent(e) {
    let assigned = e.target;
    updateAssignedErrors(assigned);
    validateField(assigned);
}

function validateDateEvent(e) {
    const dateField = e.target;
    updateDateErrors(dateField);
    validateField(dateField);
}

function updateTitleErrors(title) {
    const content = title.value;
    let message = '';

    if(content === '') {
        message = `El campo ${title.id} no puede estar vacío`;
    } else if((content.length < MIN_CHAR) && content.length > 0) {
        message = `El campo ${title.id} debe tener al menos ${MIN_CHAR} caracteres`;
    } else if(content.length > 25) {
        message = `El campo ${title.id} no puede tener más de 25 caracteres`;
    }

    title.setCustomValidity(message);
}

function updateTtagErrors(ttag) {
    const content = ttag.value;
    let message = '';

    if(content === '') {
        message = `El campo ${ttag.id} no puede estar vacío`;
    } else if((content.length < MIN_CHAR) && content.length > 0) {
        message = `El campo ${ttag.id} debe tener al menos ${MIN_CHAR} caracteres`;
    } else if(content.length > 25) {
        message = `El campo ${ttag.id} no puede tener más de 25 caracteres`;
    }

    ttag.setCustomValidity(message)
}

function updateAssignedErrors(assigned) {
    const content = assigned.value;
        let message = '';

        if(content === '') {
            message = `El campo ${assigned.id} no puede estar vacío`;
        } else if((content.length <MIN_CHAR) && content.length > 0) {
            message = `El camppo ${assigned.id} debe tener al nenos ${MIN_CHAR} caracteres`;
        } else if(content.length > 25) {
            message = `El campo ${assigned.id} no puede tener más de 25 caracteres`;
        }
    assigned.setCustomValidity(message);
}

// Función para actualizar los errores del campo de fecha
function updateDateErrors(dateField) {
    const content = dateField.value;
    let message = '';

    // Verificar si el campo está vacío
    if(content === '') {
        message = `El campo ${dateField.id} no puede estar vacío`;
    } else {
        const today = new Date();
        const selectedDate = new Date(content);

        // Comprobar que la fecha no sea futura
        if(selectedDate < today) {
            message = `La fecha no puede ser en el pasado`;
        }
    }

    dateField.setCustomValidity(message);
}

function reviewErrorsEventsTitle(e) {
    const title = e.target;
    updateTitleErrors(title);
    if(title.validity.valid) {
        deleteErrors(title);
    }
}

function reviewErrorsEventsTtag(e) {
    const ttag = e.target;
    updateTtagErrors(ttag);
    if(ttag.validity.valid) {
        deleteErrors(ttag);
    }
}

function reviewErrorsEventsAssigned(e) {
    const assigned = e.target;
    updateAssignedErrors(assigned);
    if(assigned.validity.valid) {
        deleteErrors(assigned);   
    }
}

// Función para revisar los errores del campo de fecha
function reviewErrorsEventsDate(e) {
    const dateField = e.target;
    updateDateErrors(dateField);
    if(dateField.validity.valid) {
        deleteErrors(dateField);
    }
}

function validateField(field) {
    deleteErrors(field);
    return field.checkValidity();   
}

function titleEventNotifyError(e) {
    const title = e.target;
    let messages = [];

    if(title.validity.customError) {
        messages.push(title.validationMessage);
    }

    showErrorMessage(messages, title);
}

function ttagEventNotifyError(e) {
    const ttag = e.target;
    let messages = [];

    if(ttag.validity.customError) {
        messages.push(ttag.validationMessage);
    }

    showErrorMessage(messages, ttag);
}

function assignedEventNotifyError(e){
    const assigned = e.target;
    let messages = [];

    if(assigned.validity.customError) {
        messages.push(assigned.validationMessage);
    }

    showErrorMessage(messages, assigned);
}

// Función para notificar el error del campo de fecha
function dateEventNotifyError(e) {
    const dateField = e.target;
    let messages = [];

    if(dateField.validity.customError) {
        messages.push(dateField.validationMessage);
    }

    showErrorMessage(messages, dateField);
}

function isErrorField(field) {
    return field.classList.contains(ERROR_CAMPO);
}

function deleteErrors(field){

    field.classList.remove(ERROR_CAMPO);

    const containerErrores = document.getElementById(`${field.name}-${ERROR_CAMPO}`);

    if(containerErrores) {
        containerErrores.parentElement.removeChild(containerErrores);
    }
}

function showErrorMessage(messages, field) {
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

function validateFormEvent(e) {
    let form = document.getElementById('task-form').querySelectorAll('input');

    for(let i = 0; i<form.length; i++) {
        if(!form[i].checkValidity()) {
            form[i].focus();
            break;
        }
    }

    let validForm = validateField(document.getElementById('titulo'));
    validForm = validateField(document.getElementById('ttag')) && validForm;
    validForm = validateField(document.getElementById('assigned-to')) && validForm;
    validForm =  validateField(document.getElementById('dateField')) && validForm;

    if(validForm) {
        console.log('Formulario válido');
    }else{
        e.preventDefault();
        console.error('El formulario no ha podidio ser validado debido a un error');
    }
}
