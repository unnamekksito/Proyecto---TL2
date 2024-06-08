const express = require("express");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const port = 4200;


//MANDAR ARCHIVOS PARA QUE SE MUESTREN AL SERVER
// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Middleware para servir la carpeta 'vista'
app.use(express.static(path.join(__dirname, "public", "vista")));

// Middleware para servir la carpeta 'assets'
app.use(express.static(path.join(__dirname, "public", "assets")));

// Middleware para servir la carpeta 'controlador'
app.use(express.static(path.join(__dirname, "public", "controlador")));

// Middleware para servir la carpeta 'modelo'
app.use(express.static(path.join(__dirname, "public", "modelo")));

//INICIO MONGO DB
const uri = "mongodb://localhost:27017/"; // URI de conexión a tu base de datos MongoDB
const client = new MongoClient(uri);

async function ConectarMongoDB() {
  try {
    await client.connect();
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    throw error;
  }
}

ConectarMongoDB();

// Ruta para manejar la solicitud GET para obtener los datos
app.get("/obtenerDatos", async (req, res) => {
  try {
    // Leer el archivo JSON desde la ruta especificada
    const filePath = path.join(__dirname, "public", "modelo", "datos.json");
    const data = await fs.readFile(filePath, "utf-8");
    const datos = JSON.parse(data);

    // Conectar a la base de datos MongoDB
    const db = client.db("Harmanusoft");
    const collection = db.collection("datosPersonas");

    // Borrar todos los documentos existentes en la colección
    await collection.deleteMany({});

    // Insertar los datos del JSON en la colección
    await collection.insertMany(datos);

    console.log("Datos insertados en MongoDB:", datos);

    // Enviar una respuesta exitosa al cliente
    res.sendStatus(200);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error("Error al obtener y guardar los datos en MongoDB:", error);
    res.sendStatus(500);
  }
});

// Ruta para manejar la solicitud de registro
app.post("/registro", async (req, res) => {
  try {
    const { name, lastName, username, email, gender, birthDate, password } =
      req.body;

    const level = "User";

    // Obtener la ruta absoluta del archivo datos.json
    const filePath = path.join(__dirname, "public", "modelo", "datos.json");

    // Leer los datos actuales del archivo JSON
    let registrosExistentes = [];
    try {
      const data = await fs.readFile(filePath, "utf-8");
      registrosExistentes = JSON.parse(data);
      if (!Array.isArray(registrosExistentes)) {
        registrosExistentes = []; // Si los datos no son un array válido, inicializamos registrosExistente como un array vacío
      }
    } catch (error) {
      // Si el archivo no existe o hay un error al leerlo, dejamos los registros existentes como un array vacío
      console.error("Error al leer los datos del archivo JSON:", error);
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = registrosExistentes.find(
      (user) => user.username === username
    );
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "El nombre de usuario ya está en uso",
      });
    }

    // Guardar el nuevo usuario en el archivo JSON
    const nuevoUsuario = {
      name: name,
      lastName: lastName,
      username: username,
      email: email,
      gender: gender,
      birthDate: birthDate,
      password: password,
      level: level,
    };
    registrosExistentes.push(nuevoUsuario);

    // Escribir los datos actualizados en el archivo JSON
    await fs.writeFile(filePath, JSON.stringify(registrosExistentes, null, 2));

    // Llamar a obtenerDatos para enviar los datos a MongoDB
    await fetch("/obtenerDatos");

    // Si se llega a este punto, el usuario se registró con éxito
    return res.status(200).json({
      success: true,
      message: "Usuario registrado exitosamente",
    });
  } catch (error) {
    console.error("Error al manejar la solicitud de registro:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al registrar usuario",
    });
  }
});

//Login Con MongoDB
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar el usuario en la base de datos MongoDB
    const db = client.db("Harmanusoft");
    const usuarios = db.collection("datosPersonas");
    const usuario = await usuarios.findOne({ username: username });

    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Si las credenciales son válidas, generar el token de autenticación
    const token = jwt.sign({ username: usuario.username, level: usuario.level }, "clave-secreta");

    // Devolver el token como parte de la respuesta
    res.status(200).json({ mensaje: "Inicio de sesión exitoso", token: token });
  } catch (error) {
    console.error("Error al manejar la solicitud de inicio de sesión:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

//FIN MONGODB

//INICIO JSON
// Ruta para manejar la solicitud POST para guardar datos
app.post("/guardarDatos", async (req, res) => {
  try {
    const datos = req.body;
    // Obtener la ruta absoluta del archivo datos.json
    const filePath = path.join(__dirname, "public", "modelo", "datos.json");

    let registrosExistente = [];
    try {
      // Intentar leer los datos actuales del archivo JSON
      const data = await fs.readFile(filePath, "utf-8");
      registrosExistente = JSON.parse(data);
      if (!Array.isArray(registrosExistente)) {
        registrosExistente = []; // Si los datos no son un array válido, inicializamos registrosExistente como un array vacío
      }
    } catch (error) {
      // Si el archivo no existe o hay un error al leerlo, dejamos los registros existentes como un array vacío
      console.error("Error al leer los datos del archivo JSON:", error);
    }

    // Agregar el nuevo registro
    registrosExistente.push(datos);

    // Escribir los datos actualizados en el archivo JSON
    await fs.writeFile(filePath, JSON.stringify(registrosExistente, null, 2));

    console.log("Datos agregados correctamente al archivo JSON.");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al guardar los datos en el archivo JSON:", error);
    res.sendStatus(500);
  }
});

app.get("/obtenerDatosTabla", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "public", "modelo", "datos.json");
    const data = await fs.readFile(filePath, "utf-8");
    const datos = JSON.parse(data);
    res.json(datos);
  } catch (error) {
    console.error("Error al obtener los datos del archivo JSON:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.put("/editarDatos/:oldEmail", async (req, res) => {
  try {
    const oldEmail = req.params.oldEmail; // Obtener el antiguo correo electrónico
    const {
      nombre,
      apellidos,
      username,
      genero,
      fechaNacimiento,
      password,
      email,
      level
    } = req.body;

    // Leer el archivo JSON y parsearlo para obtener los datos actuales
    const filePath = path.join(__dirname, "public", "modelo", "datos.json");
    const data = await fs.readFile(filePath, "utf-8");
    let datos = JSON.parse(data);

    // Buscar el registro que se desea editar en base al correo electrónico antiguo
    const indiceRegistro = datos.findIndex(
      (registro) => registro.email === oldEmail
    );

    if (indiceRegistro === -1) {
      return res.status(404).json({
        success: false,
        message: "El registro no se encontró",
      });
    }

    // Verificar si el correo electrónico ha cambiado
    if (oldEmail !== email) {
      // Verificar si el nuevo correo electrónico ya existe en otro registro
      const emailExistente = datos.some((registro) => registro.email === email);
      if (emailExistente) {
        return res.status(400).json({
          success: false,
          message: "El nuevo correo electrónico ya está en uso",
        });
      }
    }

    // Actualizar los campos del registro con los nuevos valores proporcionados
    datos[indiceRegistro] = {
      ...datos[indiceRegistro],
      name: nombre,
      lastName: apellidos,
      username: username,
      gender: genero,
      birthDate: fechaNacimiento,
      password: password,
      email: email,
      level: level,
    };

    // Escribir los datos actualizados de vuelta al archivo JSON
    await fs.writeFile(filePath, JSON.stringify(datos, null, 2));

    // Enviar una respuesta exitosa
    res.status(200).json({
      success: true,
      message: "Datos editados exitosamente",
    });
  } catch (error) {
    console.error("Error al manejar la solicitud de edición:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al editar datos",
    });
  }
});

// Ruta para manejar la solicitud DELETE para borrar un dato
app.delete("/borrarDato/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const filePath = path.join(__dirname, "public", "modelo", "datos.json");
    let datos = JSON.parse(await fs.readFile(filePath, "utf-8"));
    datos = datos.filter((dato) => dato.email !== email);
    await fs.writeFile(filePath, JSON.stringify(datos, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al borrar el dato del archivo JSON:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para manejar la solicitud POST para guardar la misión y la visión
app.post("/guardarMisionYVision", async (req, res) => {
  try {
    const datos = req.body;
    // Obtener la ruta absoluta del archivo mision.json
    const filePath = path.join(__dirname, "public", "modelo", "mision.json");

    // Escribir los datos actualizados en el archivo JSON
    await fs.writeFile(filePath, JSON.stringify(datos, null, 2));

    console.log("Misión y visión guardadas correctamente.");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al guardar la misión y la visión:", error);
    res.sendStatus(500);
  }
});
//FIN JSON

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  // Abrir login.html en una nueva ventana cuando el servidor se inicie
});