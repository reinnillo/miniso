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
const closebtn = document.querySelector('.close-btn');
closebtn.addEventListener('click', ()=> {
    const modal = document.getElementById('registro-modal');
    modal.style.display = 'none';

});

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
window.onclick = function (event) {
    const modal = document.getElementById('registro-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

const API_KEY = 'patDXbGfix8oKiLUn.3ccc66b77558468a6346d427bb622df70f13765afe244566d084311f0fe7efaf'; // Clave API
const BASE_ID = 'appaAwsZ5FQOfJjwl'; // ID de la base de datos
const TABLE_NAME = 'tblLdYVKTLZhE4h36'; // Nombre de la tabla en Airtable
// URL para obtener los nombres de los empleados de Airtable
const getUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

let message;
let success;

const estrellaSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#efc90c"><path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path></svg>`;

// Función para crear la tarjeta de empleado
function crearCardEmpleado(empleado) {
    // Extraer las propiedades del objeto empleado
    const { EmpleadoID, Nombre, Avatar, Estrellas, Rol } = empleado;

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
    btnEntrada.onclick = () => registrarEntrada(EmpleadoID);
    overlayDiv.appendChild(btnEntrada);

    const btnSalida = document.createElement('button');
    btnSalida.textContent = 'Salida';
    btnSalida.onclick = () => registrarSalida(EmpleadoID);
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

// Llamada a la función para probarla
fetchAPI()
.then(records => {

        // Datos de los empleados
        const EMPs = records.map(EMP => {
            if(EMP.fields){
                const EmpleadoID = EMP.fields?.EmpleadoID; // ID del empleado
                const Nombre = EMP.fields?.Nombre; // Nombre del empleado
                const Avatar = EMP.fields?.Avatar[0]?.url; // Imagen del empleado
                const Estrellas = EMP.fields?.Estrellas; // calificacion por puntualidad
                const Rol = EMP.fields?.Rol; // Cargo en la empresa
                return {
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

