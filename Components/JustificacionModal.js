// Variables globales del modal
const BTN_abrirJustificacionModal = document.getElementById('abrirJustificacionModal');
const BTN_cerrarJustificacionModal = document.getElementById('cerrarJustificacionModal');
const BTN_enviarJustificacion = document.getElementById('enviarJustificacion');
//
// AIRTABLE
const API_KEY = 'patDXbGfix8oKiLUn.3ccc66b77558468a6346d427bb622df70f13765afe244566d084311f0fe7efaf'; // Clave API
const BASE_ID = 'appaAwsZ5FQOfJjwl'; // ID de la base de datos Empleados
//
const EMPLEADO_TABLE = 'tblLdYVKTLZhE4h36'; // Tabla de empleados
const getUrl = `https://api.airtable.com/v0/${BASE_ID}/${EMPLEADO_TABLE}`;
//
const TABLE_ASIS = 'tblXwl47C13NxbdUi'; // Tabla de asistencia
const URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_ASIS)}`;
//
//

// Funcion fetch para obtener los datos de los empleados
async function fetchAPI(options = {}) {

    const headers = {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };

    const fetchOptions = {
        ...options,
        headers
    };

    try {
        const res = await fetch(getUrl, fetchOptions);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        const records = data.records || data;
        return records;
    } catch (error) {
        console.error('Hubo un error:', error);
        throw error;
    }
};


//
// Funcion para enviar un registro nuevo en la asistencia (solo si llega tarde y esta justificado).
function enviarRegistroAirtable(datos, name) {

    fetch(URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            records: [
                {
                    fields: datos
                }
            ]
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorInfo => Promise.reject(errorInfo));
            }
            return response.json();
        })
        .then(data => {
            console.log('Registro enviado exitosamente:', data);
            mostrarModal('exito', 'entrada', name)
        })
        .catch(error => {
            console.error('Error al enviar el registro:', error);
            mostrarModal('error', 'entrada', name)
        });
};

// Funcion para crear la hora de entrada
function getHour() {

    const date = new Date();
    let hour = date.getHours();
    const minute = date.getMinutes();

    // Determinar si es AM o PM
    const ampm = hour >= 12 ? 'PM' : 'AM';

    // Convertir la hora al formato de 12 horas
    hour = hour % 12;
    hour = hour ? hour : 12; // La hora '0' debe ser '12'

    return `${hour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
};

// Funcion para crear la fecha de asistencia
function obtenerFechaActual() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    let mes = fecha.getMonth() + 1; // Los meses van de 0 (enero) a 11 (diciembre)
    let dia = fecha.getDate();

    // Asegurar que el mes y el día tengan dos dígitos
    if (mes < 10) mes = '0' + mes;
    if (dia < 10) dia = '0' + dia;

    return `${año}-${mes}-${dia}`;
};


// Función para mostrar el modal de mensajes de exito o errores
function mostrarModal(exito, accion, name) {
    const modal = document.getElementById('registro-modal');
    const titulo = document.getElementById('modal-titulo');
    const mensaje = document.getElementById('modal-mensaje');

    if (exito === 'exito') {
        titulo.textContent = '¡Registro Exitoso!';
        mensaje.textContent = 'Se ha registrado la ' + accion + ' para ' + name + '.';
    } else if(exito === 'error') {
        titulo.textContent = 'Error en el Registro';
        mensaje.textContent = 'Hubo un problema al registrar la ' + accion + ' para ' + name + '.';
    } else if( exito === 'sin registro') {
        titulo.textContent = 'Mensaje'
        mensaje.textContent = 'Sin hora de entrada o tu salida ya fue registrada.';
    }

    modal.style.display = 'block';
}













// Función para abrir el modal de justificación
BTN_abrirJustificacionModal.addEventListener('click', () => {
    const modal = document.getElementById('justificacion-modal');
    modal.style.display = 'block';
});

// Función para cerrar el modal de justificación
const F_cerrarJustificacionModal = () => {

    BTN_cerrarJustificacionModal.addEventListener('click', () => {
        const modal = document.getElementById('justificacion-modal');
        modal.style.display = 'none';
        // Opcional: Limpiar el formulario al cerrar
        document.getElementById('justificacion-form').reset();
    });
}
F_cerrarJustificacionModal();

//
// Función para enviar la justificación
function enviarJustificacion() {

    async function fetchAPI(options = {}) {

        const headers = {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        };
    
        const fetchOptions = {
            ...options,
            headers
        };
    
        try {
            const res = await fetch(getUrl, fetchOptions);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
    
            const records = data.records || data;
            return records;
        } catch (error) {
            console.error('Hubo un error:', error);
            throw error;
        }
    };
    
    // Llamada a la función
    fetchAPI()
        .then(records => {
    
            // Datos de los empleados
            const EMPs = records.map(EMP => {
                if (EMP.fields) {
                    const recordID = EMP.id; // ID de registro
                    const EmpleadoID = EMP.fields?.EmpleadoID; // ID del empleado
                    const Nombre = EMP.fields?.Nombre; // Nombre del empleado
                    const Avatar = EMP.fields?.Avatar[0]?.url; // Imagen del empleado
                    const Puntos = EMP.fields?.Puntos; // calificacion por puntualidad
                    const Rol = EMP.fields?.Rol; // Cargo en la empresa
                    return {
                        recordID,
                        EmpleadoID,
                        Nombre,
                        Avatar,
                        Puntos,
                        Rol
                    }
                }
                return null;
            }).filter(item => item !== null);

            console.log("justificacion empleado: ", EMPs);

            const EMPLEADO_ID = document.getElementById('empleado-id').value;
            const NOTA = document.getElementById('nota-justificacion').value;

            console.log('ID y Nota: ', NOTA)
            if (EMPLEADO_ID && NOTA) {
                // capturar datos a enviar 
                const HENTRADA = getHour();
                const FECHA = obtenerFechaActual();
                const fields = {
                    EmpleadoID: EMPLEADO_ID,
                    //Empleados: [EMPLEADOS],
                    HEntrada: HENTRADA,
                    Fecha: FECHA,
                    Nota: NOTA
                };
                // Enviar los datos al servidor.
                enviarRegistroAirtable(fields, EMPLEADO_ID);
        
                // Mostrar mensaje de éxito (puedes usar tu modal de confirmación)
                alert(`Justificación enviada para ${EMPLEADO_ID}.`);
        
                // Cerrar el modal y limpiar el formulario
                F_cerrarJustificacionModal();
            } else {
                // Mostrar mensaje de error si faltan campos
                alert('Por favor, completa todos los campos.');
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

BTN_enviarJustificacion.addEventListener('click', enviarJustificacion);



// Cerrar el modal al hacer clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('justificacion-modal');
    if (event.target.off == modal) {
        F_cerrarJustificacionModal();
    }
}
