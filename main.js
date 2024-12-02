// Función para mostrar el modal
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

// Función para cerrar el modal
const closebtn = document.querySelector('.close-btn');
closebtn.addEventListener('click', () => {
    const modal = document.getElementById('registro-modal');
    modal.style.display = 'none';

});

// Funciones para manejar el registro de entrada y salida
function registrarEntrada(ID, empID, callback1, callback2, name) {
    // Simular una operación exitosa o fallida
    const EMPLEADO_ID = empID;
    const HENTRADA = callback1;
    const EMPLEADOS = ID;
    const FECHA = callback2;

    // Lógica para registrar la entrada (a implementar)
    // ...
    const fields = {
        EmpleadoID: EMPLEADO_ID,
        Empleados: [
            EMPLEADOS
        ],
        HEntrada: HENTRADA,
        Fecha: FECHA
    };

    enviarRegistroAirtable(fields, name);
}

function registrarSalida(empID, callback, name) {
    // Simular una operación exitosa o fallida
    const EMPLEADO_ID = empID;
    const SALIDA = callback;

    // Lógica para registrar la salida (a implementar)
    // ...
    actualizarRegistroAirtable(SALIDA, EMPLEADO_ID, name);
}

// Cerrar el modal al hacer clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('registro-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

//
// AIRTABLE
const API_KEY = 'patDXbGfix8oKiLUn.3ccc66b77558468a6346d427bb622df70f13765afe244566d084311f0fe7efaf'; // Clave API
const BASE_ID = 'appaAwsZ5FQOfJjwl'; // ID de la base de datos Empleados
//

// CODIGO PARA OBTENER DATOS DE EMPLEADOS
const EMPLEADO_TABLE = 'tblLdYVKTLZhE4h36'; // Nombre de la tabla en Airtable
// URL para obtener los nombres de los empleados de Airtable
const getUrl = `https://api.airtable.com/v0/${BASE_ID}/${EMPLEADO_TABLE}`;

let message;
let success;

const estrellaSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#efc90c"><path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path></svg>`;

// Función para crear la tarjeta de empleado
function crearCardEmpleado(empleado) {
    // Extraer las propiedades del objeto empleado
    const { recordID, EmpleadoID, Nombre, Avatar, Estrellas, Rol } = empleado;

    // Crear el elemento principal de la tarjeta
    const card = document.createElement('div');
    card.className = 'card';

    // Crear la imagen del avatar
    const img = document.createElement('img');
    img.src = Avatar;
    img.alt = `Empleado ${EmpleadoID}`;
    img.className = 'avatar';
    card.appendChild(img);

    // Crear el contenedor de la información
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';

    // Crear el elemento para el ID
    const idP = document.createElement('p');
    idP.innerHTML = `<strong>ID:</strong> ${EmpleadoID}`;
    infoDiv.appendChild(idP);

    // Crear el contenedor de las estrellas
    const starsDiv = document.createElement('div');
    starsDiv.className = 'stars';

    // Añadir las estrellas al contenedor
    for (let i = 0; i < Estrellas; i++) {
        starsDiv.innerHTML += estrellaSVG;
    }
    infoDiv.appendChild(starsDiv);

    // Añadir el nombre del empleado
    const nombreP = document.createElement('p');
    nombreP.innerHTML = `<strong>Nombre:</strong> ${Nombre}`;
    infoDiv.appendChild(nombreP);

    // Opcional: Añadir el rol del empleado
    if (Rol) {
        const rolP = document.createElement('p');
        rolP.innerHTML = `<strong>Rol:</strong> ${Rol}`;
        infoDiv.appendChild(rolP);
    }

    card.appendChild(infoDiv);

    // Crear el overlay con los botones
    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay';

    const btnEntrada = document.createElement('button');
    btnEntrada.textContent = 'Entrada';
    btnEntrada.onclick = () => registrarEntrada(recordID, EmpleadoID, getHour(), obtenerFechaActual(), Nombre);
    overlayDiv.appendChild(btnEntrada);

    const btnSalida = document.createElement('button');
    btnSalida.textContent = 'Salida';
    btnSalida.onclick = () => registrarSalida(EmpleadoID, getHour(), Nombre);
    overlayDiv.appendChild(btnSalida);

    card.appendChild(overlayDiv);

    // Devolver la tarjeta completa
    return card;
}



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
                const Estrellas = EMP.fields?.Estrellas; // calificacion por puntualidad
                const Rol = EMP.fields?.Rol; // Cargo en la empresa
                return {
                    recordID,
                    EmpleadoID,
                    Nombre,
                    Avatar,
                    Estrellas,
                    Rol
                }
            }
            return null;
        }).filter(item => item !== null)

        console.log('los datos son: ', EMPs);

        const cardContainer = document.querySelector('.card-container');
        EMPs.forEach(empleado => {
            const card = crearCardEmpleado(empleado);
            cardContainer.appendChild(card);
        });



    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });



// lo que tengo que enviar cuando creo un nuevo registro de asistencia
//    {
//        "id": "recviwd2Mc0v4bgG0",
//        "createdTime": "2024-11-27T08:58:26.000Z",
//        "fields": {
//            "EmpleadoID": "EMP004",
//            "HSalida": "10:00 PM",
//            "Turno": "cierre",
//            "Empleados": [
//                "recAyQ0IuEaXYYDxv"
//            ],
//            "HEntrada": "1:30 PM",
//            "Nota": "Trabajó horas extra.",
//            "Fecha": "2024-11-18",
//            "HExtras": 1,
//            "Nombre (from Empleados)": [
//                "Alexander Reina"
//            ]
//        }
//    }

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

function enviarRegistroAirtable(datos, name) {
    const TABLE_ASIS = 'tblXwl47C13NxbdUi'; // tabla de asistencia
    const URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_ASIS)}`;

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

async function actualizarRegistroAirtable(nuevoDato, EMPLEADO_ID, name) {
    const TABLE_ASIS = 'tblXwl47C13NxbdUi'; // tabla de asistencia
    // Construir la fórmula de filtro para buscar por EmpleadoID
    // Construir la fórmula de filtro para buscar por EmpleadoID y HSalida en blanco
  const filterFormula = `AND({EmpleadoID}="${EMPLEADO_ID}", {HSalida}=BLANK())`;
  const encodedFilterFormula = encodeURIComponent(filterFormula);

  // URL para consultar el registro existente con HSalida en blanco
  const urlConsultar = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ASIS}?filterByFormula=${encodedFilterFormula}&sort[0][field]=HEntrada&sort[0][direction]=desc&maxRecords=1`;

  try {
    // Consultar si existe un registro con EMPLEADO_ID y HSalida en blanco
    const respuestaConsulta = await fetch(urlConsultar, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const datosConsulta = await respuestaConsulta.json();

    if (datosConsulta.records && datosConsulta.records.length > 0) {
      const registroExistente = datosConsulta.records[0];
      const recordId = registroExistente.id;

      // Actualizar el registro existente con el nuevo dato
      const urlActualizar = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ASIS}/${recordId}`;

      const datosActualizados = {
        fields: {
          HSalida: nuevoDato
        }
      };

      const respuestaActualizar = await fetch(urlActualizar, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      });

      const datosActualizacion = await respuestaActualizar.json();

      console.log('Registro actualizado exitosamente:', datosActualizacion);
    } else {
      console.log('No se encontró un registro para actualizar.');
      mostrarModal('sin registro', 'salida', name);
      // No se realiza ninguna acción adicional.
    }
  } catch (error) {
    console.error('Error al interactuar con Airtable:', error);
    mostrarModal('error', 'salida', name)
  }
};