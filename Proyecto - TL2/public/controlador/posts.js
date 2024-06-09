function openPostModal() {
  Swal.fire({
    title: "Nuevo Post",
    html: `
        <input id="postTitle" class="swal2-input" placeholder="Título del post">
        <textarea id="postContent" class="swal2-textarea" placeholder="Contenido del post"></textarea>
        <input id="postImage" type="file" class="swal2-file" accept="image/*" placeholder="Subir imagen (opcional)">
      `,
    showCancelButton: true,
    confirmButtonText: "Publicar",
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    preConfirm: () => {
      const title = Swal.getPopup().querySelector("#postTitle").value;
      const content = Swal.getPopup().querySelector("#postContent").value;
      const image = Swal.getPopup().querySelector("#postImage").files[0]; // Obtener el archivo de la imagen
      if (!title || !content) {
        Swal.showValidationMessage("Por favor complete todos los campos");
      }
      return [title, content, image]; // Devolver un array con los datos
    },
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(result.value);
      // Aquí puedes enviar el post al servidor con los datos obtenidos
      submitPost(result.value);
    }
  });
}

async function submitPost(postData) {
  try {
    const [title, content, image] = postData; // Desestructuramos el array
    const body = {
      title: title,
      content: content,
      image: image || null, // Si no hay imagen, establecemos null
    };

    console.log(body);
    const response = await fetch("/crearPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indicamos que el cuerpo es JSON
      },
      body: JSON.stringify(body), // Convertimos el objeto a JSON
    });

    if (!response.ok) {
      throw new Error("Error al publicar el post.");
    }

    // location.reload();
  } catch (error) {
    console.error(error.message);
  }
}

// Esta función carga los posts del servidor y los muestra en el contenedor
async function cargarPosts() {
    try {
      const response = await fetch("/obtenerPosts");
      const posts = await response.json();
  
      const container = document.getElementById("post-container");
      container.innerHTML = ""; // Limpiamos el contenedor
  
      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
  
        const titleElement = document.createElement("h2");
        titleElement.classList.add("post-title");
        titleElement.textContent = post.title;
  
        const contentElement = document.createElement("div");
        contentElement.classList.add("post-content");
        contentElement.textContent = post.content;
  
        const imageElement = document.createElement("img");
        imageElement.classList.add("post-image");
        imageElement.src = post.image || "../assets/images/software-login.png"; // Si no hay imagen, mostrar una de relleno
  
        postElement.appendChild(titleElement);
        postElement.appendChild(contentElement);
        postElement.appendChild(imageElement);
  
        container.appendChild(postElement);
      });
    } catch (error) {
      console.error("Error al cargar los posts:", error);
    }
  }
  
  // Llamamos a la función para cargar los posts cuando se cargue la página
  document.addEventListener("DOMContentLoaded", cargarPosts);
