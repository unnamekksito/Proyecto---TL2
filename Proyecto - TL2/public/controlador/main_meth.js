document.addEventListener('DOMContentLoaded', function() {
  // Verificar el nivel del usuario almacenado en localStorage
  const userLevel = localStorage.getItem('userLevel');

  // Obtener el enlace de "Usuarios"
  const usersLink = document.querySelector('.menu ul li:nth-child(2)');

  // Si el usuario es un administrador (nivel 'Admin'), mostrar el enlace de "Usuarios"
  if (userLevel === 'Admin') {
      usersLink.style.display = 'block';
  } else {
      // Si el usuario no es un administrador, ocultar el enlace de "Usuarios"
      usersLink.style.display = 'none';
  }
});

const menuLinks = document.querySelectorAll(".menu a");
const parallaxImage = document.querySelector(".parallax-image");

menuLinks.forEach((link) => {
  link.addEventListener("mouseover", () => {
    parallaxImage.style.transform = "scale(1.2)";
  });

  link.addEventListener("mouseout", () => {
    parallaxImage.style.transform = "scale(1)";
  });
});

function cerrarSesion() {
  Swal.fire({
    title: "Cerrar sesión",
    text: "¿Estás seguro de que deseas cerrar sesión?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Borrar los datos del LocalStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userLevel");
      localStorage.removeItem("username");

      // Redirigir a la página de inicio de sesión después de cerrar sesión
      Swal.fire({
        title: "Sesión cerrada",
        text: "Has cerrado sesión exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        window.location.href = "index.html"; // Redirigir a la página de inicio de sesión
      });
    }
  });
}
