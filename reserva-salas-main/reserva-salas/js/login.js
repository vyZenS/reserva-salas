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

    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuariosRegistrados.find(u => u.email === email && u.password === password);

    let usuarioSimulado;

    // Si las credenciales no coinciden con ningún usuario registrado, se muestra un mensaje de error
    if (usuarioEncontrado) {
        if (usuarioEncontrado.password !== password || usuarioEncontrado.email !== email) {
            errorMessage.textContent = 'Correo o contraseña incorrectos. Por favor, intenta de nuevo.';
            return;
        }

        // Si el usuario es encontrado y las credenciales son correctas, se simula un inicio de sesión exitoso
        usuarioSimulado = usuarioEncontrado;
        console.log("Login exitoso:", usuarioSimulado);
    } else {
        errorMessage.textContent = 'Correo o contraseña incorrectos. Por favor, intenta de nuevo.';
        return;
    }

    console.log("Login exitoso:", usuarioSimulado);

    // Guardar usuario simulado en localStorage
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioSimulado));

    // Redirigir a dashboard
    window.location.href = 'dashboard.html';

});