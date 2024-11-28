// Función para mostrar el modal
  function mostrarModal(exito, accion, empID) {
    const modal = document.getElementById('registro-modal');
    const titulo = document.getElementById('modal-titulo');
    const mensaje = document.getElementById('modal-mensaje');

    if (exito) {
      titulo.textContent = '¡Registro Exitoso!';
      mensaje.textContent = 'Se ha registrado la ' + accion + ' para el empleado ' + empID + '.';
    } else {
      titulo.textContent = 'Error en el Registro';
      mensaje.textContent = 'Hubo un problema al registrar la ' + accion + ' para el empleado ' + empID + '.';
    }

    modal.style.display = 'block';
  }

  // Función para cerrar el modal
  function cerrarModal() {
    const modal = document.getElementById('registro-modal');
    modal.style.display = 'none';
  }

  // Funciones para manejar el registro de entrada y salida
  function registrarEntrada(empID) {
    // Simular una operación exitosa o fallida
    const exito = true; // Cambia esto según la lógica real

    // Lógica para registrar la entrada (a implementar)
    // ...

    // Mostrar el modal con el resultado
    mostrarModal(exito, 'entrada', empID);
  }

  function registrarSalida(empID) {
    // Simular una operación exitosa o fallida
    const exito = true; // Cambia esto según la lógica real

    // Lógica para registrar la salida (a implementar)
    // ...

    // Mostrar el modal con el resultado
    mostrarModal(exito, 'salida', empID);
  }

  // Cerrar el modal al hacer clic fuera de él
  window.onclick = function(event) {
    const modal = document.getElementById('registro-modal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
}
