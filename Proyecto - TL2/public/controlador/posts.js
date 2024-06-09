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

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const imageDataUrl = reader.result;

      const body = {
        title: title,
        content: content,
        image: imageDataUrl,
      };

      console.log(body);
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
    };
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
      const postContainer = document.createElement("div");
      postContainer.classList.add("post-container"); // Agregamos una clase para cada contenedor
      postContainer.classList.add("post"); // Agregamos clase post

      const titleElement = document.createElement("h2");
      titleElement.classList.add("post-title");
      titleElement.textContent = post.title;

      const contentElement = document.createElement("div");
      contentElement.classList.add("post-content");
      contentElement.textContent = post.content;

      const imageElement = document.createElement("img");
      imageElement.classList.add("post-image");
      imageElement.src = post.image || "../assets/images/software-login.png"; // Si no hay imagen, mostrar una de relleno

      postContainer.appendChild(titleElement);
      postContainer.appendChild(contentElement);
      postContainer.appendChild(imageElement);

      container.appendChild(postContainer);
    });
  } catch (error) {
    console.error("Error al cargar los posts:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarPosts);
