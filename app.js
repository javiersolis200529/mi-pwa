const prendas = [
  { 
    id: 1, 
    nombre: "Chamarra de Mezclilla", 
    descripcion: "Corte clásico denim, ideal para cualquier temporada.", 
    precio: 899, 
    imagen: "https://douxdenim.com/cdn/shop/files/chamarra-de-mezclilla-brillos-dxj0532-blue-frontal.jpg" 
  },
  { 
    id: 2, 
    nombre: "Playera Casual Blanco", 
    descripcion: "Algodón 100% fresco, suave y cómodo.", 
    precio: 299, 
    imagen: "https://playerasmty.com/wp-content/uploads/2025/05/playera-blanca-basica-hombre-mujer.webp" 
  },
  { 
    id: 3, 
    nombre: "Pantalón Slim Fit", 
    descripcion: "Diseño moderno y flexible para el día a día.", 
    precio: 699, 
    imagen: "https://pantalonesdemezclilla.mx/cdn/shop/files/Regular-Desgastados-Slim-Jeans-Azules-Para-Hombre_2_3546e893-e802-42bf-a1dc-39db1fdc6506.jpg" 
  },
  { 
    id: 4, 
    nombre: "Sudadera Oversize", 
    descripcion: "Estilo urbano gris con capucha.", 
    precio: 599, 
    imagen: "https://http2.mlstatic.com/D_NQ_NP_709605-MLM94168170384_102025-O-sudadera-con-capucha-oversize-lisa-gris-para-hombre.webp" 
  },
  { 
    id: 5, 
    nombre: "Vestido Casual", 
    descripcion: "Diseño fresco y floreado para verano.", 
    precio: 749, 
    imagen: "https://http2.mlstatic.com/D_NQ_NP_675589-CBT108881364263_032026-O-vestidos-largos-casuales-de-fiesta-floreado-para-mujer.webp" 
  },
  { 
    id: 6, 
    nombre: "Camisa Formal Elegante", 
    descripcion: "Manga larga blanca de corte impecable.", 
    precio: 549, 
    imagen: "https://http2.mlstatic.com/D_NQ_NP_777880-MLM108437007299_032026-O.webp" 
  }
];

const listaRopa = document.querySelector("#listaRopa");
const buscarPrenda = document.querySelector("#buscarPrenda");
const mensajeVacio = document.querySelector("#mensajeVacio");
const btnNotificaciones = document.querySelector("#btnNotificaciones");
const estadoConexion = document.querySelector("#estadoConexion");

function mostrarRopa(filtro = "") {
  const texto = filtro.trim().toLowerCase();
  const encontrados = prendas.filter(prenda =>
    prenda.nombre.toLowerCase().includes(texto) ||
    prenda.descripcion.toLowerCase().includes(texto)
  );

  listaRopa.innerHTML = encontrados.map(prenda => `
    <article class="tarjeta">
      <div class="prenda-imagen">
        <img class="imagen-prenda" src="${prenda.imagen}" alt="${prenda.nombre}" loading="lazy">
      </div>
      <div class="tarjeta-contenido">
        <h3>${prenda.nombre}</h3>
        <p>${prenda.descripcion}</p>
        <div class="tarjeta-pie">
          <span class="precio">$${prenda.precio.toFixed(2)} MXN</span>
          <button class="boton-pequeno" type="button" data-id="${prenda.id}">Me interesa</button>
        </div>
      </div>
    </article>
  `).join("");

  mensajeVacio.hidden = encontrados.length !== 0;
}

buscarPrenda.addEventListener("input", evento => {
  mostrarRopa(evento.target.value);
});

listaRopa.addEventListener("click", evento => {
  const boton = evento.target.closest("button[data-id]");
  if (!boton) return;

  const prenda = prendas.find(item => item.id === Number(boton.dataset.id));
  if (prenda) {
    if (!navigator.onLine) {
      alert(`No se puede completar la compra de "${prenda.nombre}". Estás en modo offline (sin conexión a internet).`);
    } else {
      alert(`¡"${prenda.nombre}" se ha añadido correctamente a tu carrito! Total: $${prenda.precio.toFixed(2)} MXN.`);
    }
  }
});

btnNotificaciones.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    alert("Este navegador no admite notificaciones.");
    return;
  }

  if (!("serviceWorker" in navigator)) {
    alert("Este navegador no admite Service Worker.");
    return;
  }

  try {
    const permiso = await Notification.requestPermission();
    if (permiso === "granted") {
      const registro = await navigator.serviceWorker.ready;
      await registro.showNotification("Moda & Estilo 👗", {
        body: "¡Gracias por visitarnos! Descubre nuestras prendas destacadas.",
        icon: prendas[0].imagen,
        badge: prendas[0].imagen
      });
    } else {
      alert("No se concedió permiso para mostrar notificaciones.");
    }
  } catch (error) {
    console.error("Error al mostrar la notificación:", error);
    alert("No se pudo mostrar la notificación. Verifica que estés usando localhost o HTTPS.");
  }
});

function actualizarConexion() {
  estadoConexion.textContent = navigator.onLine ? "Conectado" : "Sin conexión";
}
window.addEventListener("online", actualizarConexion);
window.addEventListener("offline", actualizarConexion);

document.querySelector("#anio").textContent = new Date().getFullYear();
mostrarRopa();
actualizarConexion();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registrado correctamente.");
    } catch (error) {
      console.error("No se pudo registrar el Service Worker:", error);
    }
  });
}

// Evento para habilitar la instalación de la PWA
let eventoInstalacion;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  eventoInstalacion = e;
  console.log("La PWA de Moda & Estilo está lista para instalarse.");
});