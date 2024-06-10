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
      return { title, content, image }; // Devolver un objeto con los datos
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
    const { title, content, image } = postData;
    const user = localStorage.getItem("username");

    // Crear el cuerpo del post sin imagen inicialmente
    const body = {
      title: title,
      content: content,
      image: null,
      user: user,
    };

    // Si se proporciona una imagen, convertirla a base64
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        body.image = reader.result;

        // Enviar el post con la imagen
        await sendPost(body);
      };
    } else {
      // Enviar el post sin imagen
      await sendPost(body);
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function sendPost(body) {
  try {
    const response = await fetch("/crearPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error al publicar el post.");
    }

    location.reload(); // Recargar la página después de enviar el post
  } catch (error) {
    console.error("Error al enviar el post:", error);
  }
}

// Esta función carga los posts del servidor y los muestra en el contenedor
async function cargarPosts() {
  try {
    const response = await fetch("/obtenerPosts");
    const posts = await response.json();

    const container = document.getElementById("post-container");
    container.innerHTML = ""; // Limpiar el contenedor

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      const userElement = document.createElement("p");
      userElement.classList.add("post-user");
      userElement.textContent = `Posted by: ${post.user}`;

      const titleElement = document.createElement("h2");
      titleElement.classList.add("post-title");
      titleElement.textContent = post.title;

      const contentElement = document.createElement("div");
      contentElement.classList.add("post-content");
      contentElement.textContent = post.content;

      postElement.appendChild(userElement);
      postElement.appendChild(titleElement);
      postElement.appendChild(contentElement);

      if (post.image) {
        const imageElement = document.createElement("img");
        imageElement.classList.add("post-image");
        imageElement.src = post.image;
        postElement.appendChild(imageElement);
      }

      container.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error al cargar los posts:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarPosts);
