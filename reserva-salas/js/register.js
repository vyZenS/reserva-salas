const DOMAINS = [
    'utalca.cl',
    'alumnos.utalca.cl',
    'gmail.com', // Para pruebas
    'outlook.com' // Para pruebas
]

// Obtener referencias a los elementos del formulario
const loginForm = document.getElementById('login-form');
const rutInput = document.getElementById('rut');
const nombreInput = document.getElementById('nombre');
const rolSelect = document.getElementById('rol');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const errorMessage = document.getElementById('.error-message');

formularioRegistro.addEventListener('submit', function(e) {
    e.preventDefault();

    errorMessage.textContent = '';

    // Obtener los valores de los campos del formulario
    const rut = rutInput.value.trim();
    const nombre = nombreInput.value.trim();
    const rol = rolSelect.value;
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!nombre) {
        errorMessage.textContent = 'El nombre completo es obligatorio';
        return;
    }
    if (!rol) {
        errorMessage.textContent = 'Debe seleccionar un rol.';
        return;
    }
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Las contraseñas no coinciden.';
        return;
    }

    const emailDomain = email.split('@')[1].toLowerCase();
    
    if (!DOMAINS.includes(emailDomain)) {
        errorMessage.textContent = 'El correo institucional debe terminar en @utalca.cl o @alumnos.utalca.cl.';
        return;
    }

    alert ('Registro exitoso. Ahora puedes iniciar sesión.');

    // Redireccionar a la página de inicio de sesión después del registro exitoso
    window.location.href = 'index.html';

});