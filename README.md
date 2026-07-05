# Sistema de Reserva de Salas - Dashboard Interactivo

Este proyecto es una aplicación web interactiva desarrollada para la gestión y reserva de salas de estudio. Permite a los usuarios visualizar la disponibilidad de espacios en distintas vistas (mensual, semanal y diaria), crear nuevas reservas y gestionar las existentes de manera dinámica.

Proyecto desarrollado para el módulo de Desarrollo de Aplicaciones Web I.

## Tecnologías Utilizadas

El proyecto fue construido y refactorizado desde un proyecto anterior, cumpliendo con el requerimiento de no utilizar frameworks visuales ni soluciones prefabricadas:

*   **HTML5:** Estructura semántica.
*   **CSS:** Sistema de diseño modular, uso de variables CSS (`:root`) para theming (Modo Claro/Oscuro) y diseño adaptativo (Grid y Flexbox).
*   **JavaScript (Vanilla):** Manipulación dinámica del DOM, gestión de eventos y almacenamiento persistente simulado.
*   **LocalStorage:** Almacenamiento local de datos del usuario y registro de reservas activas en el navegador.

## Funcionalidades Principales

1.  **Vistas Dinámicas del Calendario:** Alternancia entre vista mensual, semanal y detalle diario, calculando automáticamente los días y meses en base al reloj del sistema.
2.  **Gestión de Reservas (CRUD):** 
    *   Creación de reservas con validación de horarios y reglas de negocio (ej. máximo 4 horas de reserva, validación de horas pasadas).
    *   Visualización de detalles en tarjetas interactivas.
    *   Modificación y eliminación de reservas existentes.
3.  **UI/UX y Accesibilidad:**
    *   Modo Oscuro/Claro integrado nativamente.
    *   Sistema de notificaciones (*Toasts*) no intrusivas para confirmar acciones del usuario.
    *   Diseño responsive para adaptación a dispositivos móviles.

## Instrucciones de Ejecución

Dado que es una aplicación web *Client-Side* pura (Vanilla CSS/JS), no requiere instalación de dependencias ni levantar un servidor local para su ejecución básica.

1. Clonar el repositorio en tu máquina local:
   ```bash
   git clone [URL_DE_TU_REPOSITORIO]

2. Abrir el archivo `index.html` (para la vista de login) o `dashboard.html` (para la vista del dashboard inicial) directamente en cualquier navegador.

**Nota:** Para una mejor experiencia probando el almacenamiento de sesión, se recomienda iniciar desde `index.html`

## Autores / Integrantes del grupo
- Martin Castro
- Vicente Durán
