//Cambiar entre modo light o dark al hacer click en la imagen
document.addEventListener('DOMContentLoaded', () => {
    const lightModeImage = document.getElementById('darkmode-toggle');
    const body = document.body; // Seleccionamos el body

    lightModeImage.addEventListener('click', () => {
        body.classList.toggle('dark-mode'); // Agrega o quita la clase

        // Guardar el modo en localStorage para mantenerlo en recargas
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Comprobar el tema guardado en localStorage al cargar la página
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }
});
