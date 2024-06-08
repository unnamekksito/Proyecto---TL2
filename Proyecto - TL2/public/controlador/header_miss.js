// Función para alternar la clase activa del menú hamburguesa
function toggleMenu() {
    const menu = document.querySelector('.menu');
    const navi = document.querySelector('.navbar');
    const menuIcon = menu.querySelector('.fas.fa-bars');
    const closeIcon = menu.querySelector('.fas.fa-times');
    const menuText = menu.querySelector('span');
  
    menu.addEventListener('click', () => {
      navi.classList.toggle('open');
      menu.classList.toggle('open');
      if (menu.classList.contains('open')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'inline';
        menuText.textContent = 'Cerrar';
      } else {
        menuIcon.style.display = 'inline';
        closeIcon.style.display = 'none';
        menuText.textContent = 'Menú';
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    toggleMenu();
    setSlider(); // Para iniciar el slider cuando se carga la página

    const userLevel = localStorage.getItem("userLevel");
    const modificarBtn = document.getElementById("modificarBtn");
    const RegistroMenu = document.getElementById("Registro");
  
    if (userLevel !== "Admin") {
      modificarBtn.style.display = "none";
      RegistroMenu.style.display = "none";
    }
  });
  
  function setSlider() {
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');
  
    nextButton.addEventListener('click', () => {
      const items = document.querySelectorAll('.slide .item');
      document.querySelector('.slide').appendChild(items[0]);
    });
  
    prevButton.addEventListener('click', () => {
      const items = document.querySelectorAll('.slide .item');
      document.querySelector('.slide').prepend(items[items.length - 1]);
    });
  }
  
  function nextSlide() {
    const items = document.querySelectorAll('.slide .item');
    document.querySelector('.slide').appendChild(items[0]);
  }