// Función para habilitar o deshabilitar los campos del formulario y el botón de guardar
function toggleFormFields(enable) {
  const fields = [
    "nombre",
    "apellido",
    "username",
    "password",
    "genero",
    "fechaNacimiento",
    "correo",
    "level",
  ];
  fields.forEach((field) => {
    document.getElementById(field).disabled = !enable;
  });
  document.querySelector("button[type='submit']").disabled = !enable;
}

// Deshabilitar los campos y el botón al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  CargarDatos(); // Cargar datos al cargar la página
  toggleFormFields(false); // Deshabilitar campos y botón al inicio
});

// Función para validar nombres y apellidos
function validarNombreApellido(nombre) {
  return /^[A-Z][a-z\s.-]*$/.test(nombre);
}

// Función para validar la fecha de nacimiento y calcular la edad
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const cumpleanos = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const mes = hoy.getMonth() - cumpleanos.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad--;
  }
  return edad;
}

// Función para validar el email
function validarEmail(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|org)$/.test(email);
}

// Función principal para la validación y envío de datos al servidor
function ValidarYEditarDatos() {
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const username = document.getElementById("username").value.trim();
  const genero = document.getElementById("genero").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const email = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value.trim();
  const level =
    document.getElementById("level").options[
      document.getElementById("level").selectedIndex
    ].value;

  let isValid = true; // Variable para indicar si el formulario es válido

  // Validación del nombre
  if (!validarNombreApellido(nombre)) {
    Swal.fire({
      title: "Error",
      text: "El nombre debe comenzar con mayúscula y contener solo letras y espacios.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    isValid = false;
  }

  // Validación del apellido
  if (!validarNombreApellido(apellido)) {
    Swal.fire({
      title: "Error",
      text: "Los apellidos deben comenzar con mayúscula y contener solo letras y espacios.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    isValid = false;
  }

  if (username.length < 3) {
    Swal.fire({
      title: "Error",
      text: "El nombre de usuario debe tener al menos 3 caracteres.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    isValid = false;
  }

  // Validación de la fecha de nacimiento
  if (isNaN(Date.parse(fechaNacimiento))) {
    Swal.fire({
      title: "Error",
      text: "La fecha de nacimiento no es válida.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    isValid = false;
  } else {
    const edad = calcularEdad(fechaNacimiento);
    if (edad < 18 || edad > 100) {
      Swal.fire({
        title: "Error",
        text: "La edad debe estar entre 18 y 100 años.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      isValid = false;
    }
  }

  // Validación del correo electrónico
  if (!validarEmail(email)) {
    Swal.fire({
      title: "Error",
      text: "El email no es válido.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    isValid = false;
  }

  // Validación de la contraseña
  if (password.length < 6) {
    Swal.fire({
      title: "Error",
      text: "La contraseña debe tener al menos 6 caracteres.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    isValid = false;
  }

  // Si el formulario es válido, enviar los datos al servidor
  if (isValid) {
    const datos = {
      nombre: nombre,
      apellidos: apellido,
      username: username,
      genero: genero,
      fechaNacimiento: fechaNacimiento,
      email: email,
      password: password,
      level: level,
    };
    EnviarDatosEditadosAlServidor(datos, email);
  }
  event.preventDefault();
}

// Función para enviar los datos editados al servidor
async function EnviarDatosEditadosAlServidor(datos, email) {
  try {
    const response = await fetch(`/editarDatos/${email}`, {
      method: "PUT", // Utilizar el método PUT para editar datos en el servidor
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (response.ok) {
      Swal.fire({
        title: "Éxito",
        text: "Los datos se han editado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        location.reload(); // Recargar la página después de cerrar la alerta
      });
    } else {
      throw new Error("Error al editar los datos en el servidor");
    }
  } catch (error) {
    console.error("Error al editar los datos en el servidor:", error);
    Swal.fire({
      title: "Error",
      text: "Error al editar los datos en el servidor",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
}

// Función para cargar y mostrar los datos en la tabla
let datosOriginales = [];
let datosFiltrados = [];

async function CargarDatos() {
  try {
    const response = await fetch("/obtenerDatosTabla");
    if (response.ok) {
      const datos = await response.json();
      datosOriginales = datos; // Guardar los datos originales sin ordenar
      datosFiltrados = datos; // Inicialmente, los datos filtrados son iguales a los originales
      MostrarDatosEnTabla(datos);
    } else {
      console.error(
        "Error al cargar los datos del servidor:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error al cargar los datos del servidor:", error);
  }
}

// Función para mostrar los datos en la tabla
function MostrarDatosEnTabla(datos) {
  const datosBody = document.getElementById("datosBody");
  datosBody.innerHTML = ""; // Limpiar tabla antes de agregar nuevos datos

  datos.forEach((dato) => {
    console.log("Dato:", dato); // Agregar este registro para verificar los datos recibidos
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${dato.name}</td>
      <td>${dato.lastName}</td>
      <td>${dato.username}</td>
      <td>${dato.password}</td>
      <td>${dato.gender}</td>
      <td>${dato.birthDate}</td>
      <td>${dato.email}</td>
      <td class="acciones">
        <button onclick="BorrarDato('${dato.email}')"><i class="fas fa-trash-alt"></i></button>
        <button onclick="HabilitarCampos('${dato.email}')"><i class="fas fa-edit"></i></button>
      </td>
    `;
    fila.setAttribute("data-email", dato.email); // Agregar atributo data-email
    datosBody.appendChild(fila);
  });
}

// Función para ordenar la tabla por nombre
function ordenarTabla(orden) {
  let datosCopia = [...datosFiltrados]; // Crear una copia de los datos filtrados

  if (orden === 'asc') {
    datosCopia.sort((a, b) => a.name.localeCompare(b.name)); // Ordenar la copia por nombre ascendente
  } else if (orden === 'desc') {
    datosCopia.sort((a, b) => b.name.localeCompare(a.name)); // Ordenar la copia por nombre descendente
  } else {
    datosCopia = [...datosOriginales]; // Mostrar los datos originales sin ordenar
    datosFiltrados = datosCopia; // Actualizar los datos filtrados
  }

  MostrarDatosEnTabla(datosCopia); // Mostrar los datos ordenados en la tabla
}

// Función para buscar por nombre
function buscarPorNombre() {
  const inputBuscar = document.getElementById("buscarInput");
  const filtro = inputBuscar.value.toLowerCase();

  datosFiltrados = datosOriginales.filter((dato) =>
    dato.name.toLowerCase().includes(filtro)
  );

  MostrarDatosEnTabla(datosFiltrados);
}

// Cargar los datos inicialmente
CargarDatos();

// Función para eliminar un dato
async function BorrarDato(email) {
  try {
    const response = await fetch(`/borrarDato/${email}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Dato eliminado correctamente");
      CargarDatos(); // Recargar datos después de eliminar
    } else {
      console.error("Error al eliminar el dato:", response.statusText);
    }
  } catch (error) {
    console.error("Error al eliminar el dato:", error);
  }
}

// Función para habilitar los campos cuando se hace clic en el botón de editar
async function HabilitarCampos(email) {
  document.getElementById("formulario").style.display = "block";
  try {
    // Obtener los datos del servidor
    const response = await fetch("/obtenerDatosTabla");
    if (!response.ok) {
      throw new Error("Error al obtener los datos del servidor");
    }
    const datos = await response.json();

    // Encontrar el registro correspondiente al email proporcionado
    const datoAEditar = datos.find((dato) => dato.email === email);

    // Verificar si se encontró el registro
    if (!datoAEditar) {
      throw new Error("No se encontró el registro a editar");
    }

    // Llenar automáticamente los campos del formulario con los datos del registro
    document.getElementById("nombre").value = datoAEditar.name;
    document.getElementById("apellido").value = datoAEditar.lastName;
    document.getElementById("username").value = datoAEditar.username;
    document.getElementById("password").value = datoAEditar.password;
    document.getElementById("genero").value = datoAEditar.gender;
    document.getElementById("level").value = datoAEditar.level;

    // Crear un objeto Date utilizando el valor de fechaNacimiento
    const fechaNacimiento = new Date(datoAEditar.birthDate);
    console.log(datoAEditar.birthDate);

    // Extraer año, mes y día
    const year = fechaNacimiento.getFullYear();
    const month = String(fechaNacimiento.getMonth() + 1).padStart(2, "0");
    const day = String(fechaNacimiento.getDate()).padStart(2, "0");

    // Construir la cadena de texto en el formato esperado
    const formattedDate = `${year}-${month}-${day}`;

    console.log(formattedDate);
    // Asignar el valor formateado al campo de fecha
    document.getElementById("fechaNacimiento").value = formattedDate;

    document.getElementById("correo").value = datoAEditar.email;

    // Habilitar los campos y el botón para edición
    toggleFormFields(true);
    EliminarFilaTabla(email); // Eliminar la fila correspondiente en la tabla
  } catch (error) {
    console.error("Error al cargar los datos para editar:", error);
  }
}

// Función para eliminar una fila de la tabla
function EliminarFilaTabla(email) {
  const filaAEliminar = document.querySelector(
    `#datosBody tr[data-email="${email}"]`
  );
  if (filaAEliminar) {
    filaAEliminar.remove(); // Eliminar la fila del DOM
  } else {
    console.error("No se encontró la fila a eliminar");
  }
}
