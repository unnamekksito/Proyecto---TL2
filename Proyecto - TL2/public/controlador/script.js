//Porcion de codigo que se encarga del funcionamiento de la mision y la vision en la pagina
//Mostrar Mision y vision desde el JSON en el HTML
document.addEventListener("DOMContentLoaded", function () {
    // Cargar el JSON al cargar la página por primera vez
    cargarMisionYVision();
});

function cargarMisionYVision() {
    fetch("../modelo/mision.json")
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("misionText").innerText = data.mision;
            document.getElementById("visionText").innerText = data.vision;
        })
        .catch((error) => console.error("Error al cargar el archivo JSON:", error));
}

function ModificarMisionYVision() {
  // Mostrar campos de texto y ocultar párrafos
  document.getElementById("misionText").style.display = "none";
  const misionInput = document.getElementById("misionInput");
  if (misionInput) {
      misionInput.style.display = "block";
      misionInput.removeAttribute("readonly"); // Eliminar el atributo readonly
      misionInput.style.width = "80%"; // Ajustar el ancho del JTextField
      misionInput.style.height = "200px"; // Ajustar la altura del JTextField
      misionInput.style.margin = "0 auto"; // Centrar horizontalmente el JTextField
  }

  document.getElementById("visionText").style.display = "none";
  const visionInput = document.getElementById("visionInput");
  if (visionInput) {
      visionInput.style.display = "block";
      visionInput.removeAttribute("readonly"); // Eliminar el atributo readonly
      visionInput.style.width = "80%"; // Ajustar el ancho del JTextField
      visionInput.style.height = "200px"; // Ajustar la altura del JTextField
      visionInput.style.margin = "0 auto"; // Centrar horizontalmente el JTextField
  }

  // Mostrar botón Guardar y Cancelar, ocultar botón Modificar
  document.getElementById("modificarBtn").style.display = "none";
  document.getElementById("guardarBtn").style.display = "inline-block";
  document.getElementById("cancelarBtn").style.display = "inline-block";
}

function CancelarModificacion() {
  // Mostrar párrafos y ocultar campos de texto
  document.getElementById("misionText").style.display = "block";
  document.getElementById("misionInput").style.display = "none";

  document.getElementById("visionText").style.display = "block";
  document.getElementById("visionInput").style.display = "none";

  // Ocultar botón Guardar y Cancelar, mostrar botón Modificar
  document.getElementById("modificarBtn").style.display = "inline-block";
  document.getElementById("guardarBtn").style.display = "none";
  document.getElementById("cancelarBtn").style.display = "none";
}

function GuardarMisionYVision() {
  // Obtener los valores modificados
  const nuevaMision = document.getElementById("misionInput").value;
  const nuevaVision = document.getElementById("visionInput").value;

  // Actualizar los textos
  document.getElementById("misionText").innerText = nuevaMision;
  document.getElementById("visionText").innerText = nuevaVision;
  GuardarModificacion();
}

async function GuardarModificacion() {
  try {
    // Obtener los valores de la misión y visión modificados
    const nuevaMision = document.getElementById("misionInput").value;
    const nuevaVision = document.getElementById("visionInput").value;

    // Construir el objeto con los datos a enviar al servidor
    const datos = {
      mision: nuevaMision,
      vision: nuevaVision,
    };

    // Enviar los datos al servidor
    const response = await fetch("/guardarMisionYVision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (response.ok) {
      Swal.fire({
        title: "Operacion Exitosa",
        text: "La mision y la vision se han modificado exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      // Actualizar la vista con los nuevos valores
      document.getElementById("misionText").innerText = nuevaMision;
      document.getElementById("visionText").innerText = nuevaVision;
    } else {
      console.error("Error al modificar", response.statusText);
          Swal.fire({
            title: "Error",
            text: "Error al modificar",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
    }
  } catch (error) {
    console.error("Error al modificar la misión y visión:", error);
  }

CancelarModificacion();
}
//Fin porcion de codigo - Mision y vision


