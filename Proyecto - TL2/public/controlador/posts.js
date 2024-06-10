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

async function cargarPosts() {
  try {
    const response = await fetch("/obtenerPosts");
    const posts = await response.json();

    const container = document.getElementById("post-container");
    container.innerHTML = ""; // Limpiar el contenedor

    const userLevel = localStorage.getItem("userLevel");

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      const headerElement = document.createElement("div");
      headerElement.classList.add("post-header");

      const userElement = document.createElement("p");
      userElement.classList.add("post-user");
      userElement.textContent = "Públicado por: ";
      const usernameElement = document.createElement("span");
      usernameElement.textContent = post.user;

      userElement.appendChild(usernameElement);
      headerElement.appendChild(userElement);

      // Agregar botón de borrado solo para administradores
      if (userLevel === "Admin") {
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => borrarPost(post._id);
        headerElement.appendChild(deleteButton);
      }

      postElement.appendChild(headerElement);

      const titleElement = document.createElement("h2");
      titleElement.classList.add("post-title");
      titleElement.textContent = post.title;
      postElement.appendChild(titleElement);

      const contentElement = document.createElement("div");
      contentElement.classList.add("post-content");
      contentElement.textContent = post.content;
      postElement.appendChild(contentElement);

      if (post.image) {
        const imageElement = document.createElement("img");
        imageElement.classList.add("post-image");
        imageElement.src = post.image;
        imageElement.addEventListener("click", () =>
          openImageModal(post.image)
        );
        postElement.appendChild(imageElement);
      }

      const likeButton = document.createElement("button");
      likeButton.classList.add("like-button");
      likeButton.innerHTML = `<i class="fas fa-thumbs-up"></i> <span>${post.likes ?? 0}</span>`;
      likeButton.addEventListener("click", () => handleLike(post._id));
      headerElement.appendChild(likeButton);

      const commButton = document.createElement("button");
      commButton.classList.add("comment-button");
      commButton.innerHTML = `<i class="fas fa-comments"></i> <span>${post.comments.length ?? 0}</span>`;
      commButton.addEventListener("click", () => {
        openCommentModal(post._id);
      });
      headerElement.appendChild(commButton);

      // Mostrar los comentarios debajo del post
      const commentsContainer = document.createElement("div");
      commentsContainer.classList.add("comments-container");
      post.comments.forEach(comment => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");

        const commentUser = document.createElement("p");
        commentUser.classList.add("comment-user");
        commentUser.textContent = `Usuario: ${comment.user}`;

        const commentContent = document.createElement("p");
        commentContent.classList.add("comment-content");
        commentContent.textContent = comment.content;

        commentElement.appendChild(commentUser);
        commentElement.appendChild(commentContent);
        commentsContainer.appendChild(commentElement);
      });
      postElement.appendChild(commentsContainer);

      container.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error al cargar los posts:", error);
  }
}


async function handleLike(postId) {
  const user = localStorage.getItem("username");

  try {
    const response = await fetch(`/likePost/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });

    if (response.ok) {
      const postElement = document.querySelector(`[data-post-id="${postId}"]`);
      const likeButton = postElement.querySelector(".like-button");
      const likeCount = likeButton.querySelector("span");
      const isLiked = likeButton.classList.toggle("liked");

      if (isLiked) {
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
      } else {
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
      }
    } else {
      const result = await response.json();
      alert(result.message);
    }
  } catch (error) {
    console.error("Error al dar like:", error);
  }
  location.reload();
}

async function borrarPost(postId) {
  try {
    const response = await fetch(`/borrarPost/${postId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al borrar el post.");
    }

    location.reload(); // Recargar la página después de borrar el post
  } catch (error) {
    console.error("Error al borrar el post:", error);
  }
}
async function openCommentModal(postId) {
  try {
    const { value: commentContent } = await Swal.fire({
      title: "Nuevo Comentario",
      input: "textarea",
      inputLabel: "Ingresa tu comentario",
      inputPlaceholder: "Escribe tu comentario aquí...",
      showCancelButton: true,
      confirmButtonText: "Publicar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Debes ingresar un comentario";
        }
      },
    });

    if (commentContent) {
      const user = localStorage.getItem("username");

      const commentData = {
        postId: postId,
        content: commentContent,
        user: user,
      };

      await saveComment(commentData);
      Swal.fire({
        title: "Éxito",
        text: "Los datos se han editado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        location.reload(); // Recargar la página después de cerrar la alerta
      });
    }
  } catch (error) {
    console.error("Error al abrir el modal de comentario:", error);
  }
  
}
async function saveComment(commentData) {
  try {
    const response = await fetch("/crearComentario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error("Error al guardar el comentario.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al guardar el comentario:", error);
    throw error;
  }
  
}

// Función para obtener y mostrar comentarios para un post específico
async function obtenerComentarios(commentIds) {
  try {
    const container = document.getElementById("small-posts-container");
    container.innerHTML = ""; // Limpiar el contenedor

    const comments = await Promise.all(commentIds.map(async (commentId) => {
      const response = await fetch(`/obtenerComentario/${commentId}`);
      return response.json();
    }));

    comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("small-post");

      const userElement = document.createElement("p");
      userElement.textContent = `Usuario: ${comment.user}`;
      commentElement.appendChild(userElement);

      const contentElement = document.createElement("p");
      contentElement.textContent = comment.content;
      commentElement.appendChild(contentElement);

      container.appendChild(commentElement);
      
    });
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
  }
}


document.addEventListener("DOMContentLoaded", cargarPosts);
