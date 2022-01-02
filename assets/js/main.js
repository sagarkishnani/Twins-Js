var swiper = new Swiper(".swiper", {
  freeMode: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    450: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
});

var swiperpag = new Swiper(".mySwiper", {
  loop: true,
  loopFillGroupWithBlank: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    450: {
      slidesPerView: 1,
      spaceBetween: 20,
      slidesPerGroup: 1,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3,
    },
  },
});

// const lightbox = GLightbox({
//   selector: "glightbox3",
//   touchNavigation: true,
//   loop: true,
//   autoplayVideos: true,
//   onOpen: () => {
//     console.log("Lightbox opened");
//   },
//   beforeSlideLoad: (slide, data) => {
//     // Need to execute a script in the slide?
//     // You can do that here...
//   },
// });
// const header = document.querySelector(".navbar-style");
// const nav = document.querySelector("#nav-logo");
// const navLogo = document.querySelector(".navbar-logo");
// const navLine = document.querySelector(".navbar-border");

// window.onscroll = function () {
//   let top = window.scrollY;

//   if (top >= 1700 && top <= 2100) {
//     header.style.backgroundColor = "transparent";
//     nav.style.backgroundColor = "transparent";
//     navLogo.style.color = "black";
//     navLine.style.borderBottom = "transparent";
//   } else if (top > 2100) {
//     header.style.backgroundColor = "#1d1b1c";
//     nav.style.backgroundColor = "#1d1b1c";
//     navLogo.style.color = "white";
//   } else {
//     header.style.backgroundColor = "#1d1b1c";
//     nav.style.backgroundColor = "#1d1b1c";
//   }
// };

/**
 * Initiate glightbox
 */
// const glightbox = GLightbox({
//   selector: ".glightbox",
// });

// /**
//  * Initiate gallery lightbox
//  */
// const galleryLightbox = GLightbox({
//   selector: ".gallery-lightbox",
// });

let carritoDeCompras = [];
let stockServicios = [];

const contenedorServicios = document.getElementById('contenedor-servicios');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonTerminar = document.getElementById('terminar')

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

$.getJSON('../assets/js/servicios.json', function (data) {
    console.log(data)

    data.forEach(elemento => stockServicios.push(elemento))

    mostrarServicios(stockServicios)
  })

class Servicios{
    constructor(id,name, icono1, icono2, precio,descripcion){
        this.id= id;
        this.name = name;
        this.icono1= icono1;
        this.icono2 = icono2;
        this.precio = precio;
        this.descripcion = descripcion
    }
}

function mostrarServicios(array){
  $('#contenedor-servicios').empty();
   for (const servicio of array) {
       let div = document.createElement('div');
       div.classList.add('servicio');
       div.innerHTML += `
       <div class="row justify-content-md-center item-services">
       <div class="col-lg-2 col-sm-12">
           <i id="boton${servicio.id}" class="${servicio.icono1} ${servicio.icono2} pointer"></i>
       </div>
       <div class="col-lg-3 col-sm-12">
           <h4 class="service-title">${servicio.name}</h4>
       </div>
       <div class="col-lg-4 col-sm-12">
           <p class="service-text">${servicio.descripcion}</p>
       </div>
   </div>`
       contenedorServicios.appendChild(div);
       
       let boton = document.getElementById(`boton${servicio.id}`)

       boton.addEventListener('click', ()=>{
           agregarAlCarrito(servicio.id)
       })
   }
   
}

function agregarAlCarrito(id) {
  let repetido = carritoDeCompras.find(servR => servR.id == id);
  if(repetido){
      repetido.cantidad = repetido.cantidad + 1;
      document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id="cantidad${repetido.id}">Cantidad: ${repetido.cantidad}</p>`
      actualizarCarrito()
  }else{
      let servicioAgregar = stockServicios.find(serv => serv.id == id);

      carritoDeCompras.push(servicioAgregar);

      servicioAgregar.cantidad = 1;

      actualizarCarrito()
      let div = document.createElement('div')
      div.classList.add('servicioEnCarrito')
      div.innerHTML = `
                      <p class="modal-carrito-text">${servicioAgregar.name}</p>
                      <p class="modal-carrito-text">Precio: $${servicioAgregar.precio}</p>
                      <p class="modal-carrito-text" id="cantidad${servicioAgregar.id}">Cantidad: ${servicioAgregar.cantidad}</p>
                      <button id="eliminar${servicioAgregar.id}" class="boton-eliminar"><img src="../images/icons/bin.png" width="20px" height="20px"></button>
                      `
      contenedorCarrito.appendChild(div)


      let botonEliminar = document.getElementById(`eliminar${servicioAgregar.id}`)

      botonEliminar.addEventListener('click', ()=>{
          botonEliminar.parentElement.remove()
          carritoDeCompras = carritoDeCompras.filter(servE => servE.id != servicioAgregar.id)
          localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
          actualizarCarrito()
      }) 
  }
   localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
}

function recuperar() {
  let recuperar = JSON.parse(localStorage.getItem('carrito'))
  if(recuperar){
      recuperar.forEach(el => {
          agregarAlCarrito(el.id)
      });
  }
}

function  actualizarCarrito (){
contadorCarrito.innerText = carritoDeCompras.reduce((acc, el)=> acc + el.cantidad, 0);
 precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
}