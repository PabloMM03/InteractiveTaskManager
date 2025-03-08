//Cambiar entre modo light o dark al hacer click en la imagen
document.addEventListener('DOMContentLoaded', () => {
    const lightModeImage = document.getElementById('darkmode-toggle');
    const body = document.body; 

    lightModeImage.addEventListener('click', () => {
        body.classList.toggle('dark-mode'); 

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }
});
