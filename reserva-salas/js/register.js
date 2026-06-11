const DOMAINS = [
    'utalca.cl',
    'alumnos.utalca.cl',
    'gmail.com', // Para pruebas
    'outlook.com' // Para pruebas
]

// Obtener referencias a los elementos del formulario
const loginForm = document.getElementById('form');
const rutInput = document.getElementById('reg-rut');
const nombreInput = document.getElementById('reg-nombre');
const rolSelect = document.getElementById('reg-rol');
const emailInput = document.getElementById('reg-email');
const passwordInput = document.getElementById('reg-password');
const confirmPasswordInput = document.getElementById('reg-confirm');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

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

    const nuevoUsuario = {
        rut: rut,
        nombre: nombre,
        rol: rol,
        email: email,
        password: password
    };

    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Evitar registros duplicados por RUT
    if (usuariosRegistrados.some(u => u.rut === rut)) {
        errorMessage.textContent = 'Ya existe un usuario registrado con este RUT.';
        return;
    }
    // Evitar registros duplicados por correo
    if (usuariosRegistrados.some(u => u.email === email)) {
        errorMessage.textContent = 'Ya existe un usuario registrado con este correo.';
        return;
    }

    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));

    alert ('Registro exitoso. Ahora puedes iniciar sesión.');

    // Redireccionar a la página de inicio de sesión después del registro exitoso
    window.location.href = 'index.html';
});