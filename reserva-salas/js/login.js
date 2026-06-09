const DOMAINS = [
    'utalca.cl',
    'alumnos.utalca.cl',
    'gmail.com', // Para pruebas
    'outlook.com' // Para pruebas
]

// Referencias a elementos del DOM
const loginForm = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.querySelector('.error-message');

// Función para validar el dominio del correo
function validateEmailDomain(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    return DOMAINS.includes(domain);
}

// Manejo del evento de envío del formulario
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    errorMessage.textContent = '';
    const email = emailInput.value;
    const password = passwordInput.value;

    console.log('Intentando iniciar sesión con:', email, password);

    // Validar dominio del correo
    if (!validateEmailDomain(email)) {
        errorMessage.textContent = 'Solo se permiten correos institucionales @utalca.cl. Por favor, intenta con otro correo.';
        return;
    }

    const usuarioSimulado = {
        nombre: email.split('@')[0],
        rol: email.includes('admin') ? 'admin' : 'usuario'
    };


    console.log("Login exitoso:", usuarioSimulado);

    // Guardar usuario simulado en localStorage
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioSimulado));

    // Redirigir a dashboard
    window.location.href = 'dashboard.html';

});