// document.addEventListener('DOMContentLoaded', () => {
//     const lightModeImage = document.querySelector('.lightmode');
//     const nav = document.querySelector('nav');
//     const titlePage = document.querySelector('.logo li');

//     lightModeImage.addEventListener('click', () => {
//         nav.classList.toggle('dark-mode');

//         if (nav.classList.contains('dark-mode')) {
//             titlePage.style.color = 'white';
//         } else {
//             titlePage.style.color = 'black';
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const lightModeImage = document.querySelector('.lightmode');
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
