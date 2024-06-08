//Porcion de codigo del slide.
let slideIndex = 0;

function showSlides() {
  const slides = document.querySelectorAll(".slider img");
  if (slideIndex >= slides.length) {
    slideIndex = 0;
  } else if (slideIndex < 0) {
    slideIndex = slides.length - 1;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex].style.display = "block";
}

function nextSlide() {
  slideIndex++;
  showSlides();
}

function prevSlide() {
  slideIndex--;
  showSlides();
}

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

const $next = document.querySelector('.next');
const $prev = document.querySelector('.prev');

$next.addEventListener('click',()=>{
  const items = document.querySelectorAll('item');
  document.querySelector('slide').appendChild(items[0]);
},
);

$prev.addEventListener('click',()=>{
  const items = document.querySelectorAll('item');
  document.querySelector('slide').prepend(items[items.length-1]);
},
);

document.addEventListener("DOMContentLoaded", function () {
  toggleMenu();
  showSlides(); // Para iniciar el slider cuando se carga la página
  setInterval(nextSlide, 5000); // Llama a nextSlide cada 5 segundos (5000 milisegundos)

  const userLevel = localStorage.getItem("userLevel");
    const RegistroMenu = document.getElementById("Registro");
  
    if (userLevel !== "Admin") {
      RegistroMenu.style.display = "none";
    }
});
