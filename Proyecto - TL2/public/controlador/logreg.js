document.addEventListener("DOMContentLoaded", function () {
  const formContainer = document.getElementById("form-container");
  const loginButton = document.getElementById("login-button");
  const registerButton = document.getElementById("register-button");

  loginButton.addEventListener("click", function () {
    toggleForm("login");
  });

  registerButton.addEventListener("click", function () {
    toggleForm("register");
  });

  function toggleForm(type) {
    formContainer.innerHTML = ""; // Limpiar el contenedor antes de cargar el nuevo formulario

    if (type === "login") {
      loginButton.style.display = "none";
      registerButton.style.display = "block";
      formContainer.innerHTML = `
        <form id="login-form" class="form">
          <h2>Iniciar sesión</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" class="input" id="username" name="username" placeholder="Nombre de Usuario">
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input type="password" class="input" id="password" name="password" placeholder="Contraseña" >
          </div>
          <button type="button" class="submit" onclick="IniciarSesion()">Iniciar sesión</button>
        </form>
      `;
    } else if (type === "register") {
      registerButton.style.display = "none";
      loginButton.style.display = "block";
      formContainer.innerHTML = `
        <div class="form">
          <h2>Registro</h2>
          <div class="inline-fields">
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" class="input" id="name" name="name" placeholder="Nombre">
            </div>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" class="input" id="last-name" name="last-name" placeholder="Apellidos">
            </div>
          </div>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" class="input" id="username" name="username" placeholder="Nombre de Usuario">
          </div>
          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input type="email" class="input" id="email" name="email" placeholder="Correo">
          </div>
          <div class="inline-fields">
            <div class="input-field">
              <i class="fas fa-venus-mars"></i>
              <select class="input" id="gender" name="gender">
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="input-field">
              <i class="fas fa-calendar-alt"></i>
              <input type="date" class="input" id="date" name="date">
            </div>
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input type="password" class="input" id="password" name="password" placeholder="Contraseña">
          </div>
          <button type="button" class="submit" onclick="RegistrarUsuario()">Registrar</button>
        </div>
      `;
    }
  }
  //Fin form login o registro

  //Logica para registrar usuario
  // Definir la función RegistrarUsuario en el ámbito global o adjuntarla a window
  window.RegistrarUsuario = function () {
    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const gender = document.getElementById("gender").value;
    const date = document.getElementById("date").value;
    const password = document.getElementById("password").value.trim();
    const level = "User";

    // Validar los datos antes de enviarlos
    if (
      ValidarYEnviarDatos(
        name,
        lastName,
        username,
        email,
        gender,
        date,
        password,
        level
      )
    ) {
      // Crear objeto con los datos del usuario
      const usuario = {
        name: name,
        lastName: lastName,
        username: username,
        email: email,
        gender: gender,
        birthDate: date,
        password: password,
        level: level,
      };

      // Enviar datos al servidor para el registro
      fetch("/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              title: "Registro Exitoso",
              text: "Usuario registrado exitosamente",
              icon: "success",
              confirmButtonText: "Aceptar",
            }).then(() => {
              location.reload(); // Recargar la página después de aceptar el mensaje
            });
          } else {
            console.error("Error en la respuesta:", response.statusText);
            throw new Error("Error al registrarse");
          }
        })
        .catch((error) => {
          console.error("Error al registrar usuario:", error);
          Swal.fire({
            title: "Error",
            text: "Error al registrar usuario",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        });
    }
    CargarDatos();
  };

  window.IniciarSesion = function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Crear objeto con los datos del inicio de sesión
    const credentials = { username: username, password: password };

    // Enviar datos al servidor para el inicio de sesión
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Convertir la respuesta a JSON
        } else {
          console.error("Error al iniciar sesión:", response.statusText);
          throw new Error("Error al iniciar sesión");
        }
      })
      .then((data) => {
        // Almacenar el token en el localStorage
        // Almacenar el token en el localStorage
        localStorage.setItem("token", data.token);

        // Decodificar el token para obtener el nivel de usuario
        const decodedToken = jwtDecode(data.token);
        const userToken =decodedToken.username;
        const userLevel = decodedToken.level;

        // Almacenar el usuario y nivel de usuario en el localStorage
        localStorage.setItem("username", userToken);
        localStorage.setItem("userLevel", userLevel);

        // Redirigir a la página principal
        Swal.fire({
          title: "Inicio de sesión exitoso",
          text: "Redirigiendo a la página principal...",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          window.location.href = "../vista/main.html"; // Redirigir a main.html
        });
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        Swal.fire({
          title: "Error",
          text: "Error al iniciar sesión",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      });
  };

  function validarNombreApellido(nombre) {
    return /^[A-Z][a-z\s.-]*$/.test(nombre);
  }

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

  function validarEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|org)$/.test(email);
  }

  function ValidarYEnviarDatos(
    name,
    lastName,
    username,
    email,
    gender,
    date,
    password,
    level
  ) {
    let isValid = true; // Variable para indicar si el formulario es válido

    // Validación del nombre
    if (!validarNombreApellido(name)) {
      Swal.fire({
        title: "Error",
        text: "El nombre debe comenzar con mayúscula y contener solo letras y espacios.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      isValid = false;
    }

    // Validación del apellido
    if (!validarNombreApellido(lastName)) {
      Swal.fire({
        title: "Error",
        text: "Los apellidos deben comenzar con mayúscula y contener solo letras y espacios.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      isValid = false;
    }

    // Validación del nombre de usuario
    if (username.length < 3) {
      Swal.fire({
        title: "Error",
        text: "El nombre de usuario debe tener al menos 3 caracteres.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      isValid = false;
    }

    // Validación del correo electrónico
    if (!validarEmail(email)) {
      Swal.fire({
        title: "Error",
        text: "El email no es válido.",
        icon: "error",
        confirmButtontext: "El email no es válido.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      isValid = false;
    }

    // Validación de la fecha de nacimiento
    if (isNaN(Date.parse(date))) {
      Swal.fire({
        title: "Error",
        text: "La fecha de nacimiento no es válida.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      isValid = false;
    } else {
      const edad = calcularEdad(date);
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
        name: name,
        lastName: lastName,
        username: username,
        email: email,
        gender: gender,
        birthDate: date,
        password: password,
        level,
      };
      EnviarDatosAlServidor(datos);
    }
    event.preventDefault();
  }

  // Función para enviar los datos al servidor
  async function EnviarDatosAlServidor(datos) {
    try {
      const response = await fetch("/guardarDatos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        Swal.fire({
          title: "Éxito",
          text: "Los datos se han enviado correctamente al servidor",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          location.reload(); // Recargar la página después de cerrar la alerta
        });
      } else {
        throw new Error("Error al enviar los datos al servidor");
      }
    } catch (error) {
      console.error("Error al enviar los datos al servidor:", error);
      Swal.fire({
        title: "Error",
        text: "Error al enviar los datos al servidor",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  }
  async function CargarDatos() {
    try {
      const response = await fetch("/obtenerDatos");
      if (response.ok) {
        const datos = await response.json();
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
});
