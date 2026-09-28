// ========================================================
// ESTRUCTURA DE ÁLBUMES Y CARPETAS DE FOTOS
// ========================================================

const albumes = [
    {
        id: "running",
        tituloAlbum: "Running El Indio",
        descripcion: "Maratón desde Monteros hasta El Indio",
        precioGeneral: "\$4.500",
        // Esta es la foto que se usará como "portada" de la carpeta
        imagenPortada: "maraton1.jpg", 
        fotos: [
            { title: "Largada en Monteros", imagenUrl: "maraton1.jpg" },
            { title: "Paso por el Río", imagenUrl: "maraton2.jpg" },
            { title: "Llegada al Indio", imagenUrl: "maraton2.jpg" } // Podés sumar todas las que quieras acá
        ]
    },
    {
        id: "aves",
        tituloAlbum: "Aves de Tucumán",
        descripcion: "Fotografía de fauna y aves autóctonas",
        precioGeneral: "\$6.000",
        imagenPortada: "aves1.jpg", 
        fotos: [
            { title: "Pajarito en el tronco", imagenUrl: "aves1.jpg" }, 
            { title: "Patitos en el nido", imagenUrl: "aves2.jpg" }
        ]
    }
];

// Número de teléfono real de Florencia (Cambiá este número por el de ella)
const telefonoWhatsApp = "549123456789"; 

// ========================================================
// MOTOR LÓGICO DE LA GALERÍA INTERACTIVA
// ========================================================

function cargarVistaInicial() {
    const contenedorFiltros = document.getElementById("filtros-albumes");
    const contenedorFotos = document.getElementById("contenedor-galeria");
    
    // Limpiamos los contenedores por las dudas
    if (contenedorFiltros) contenedorFiltros.innerHTML = "";
    if (contenedorFotos) contenedorFotos.innerHTML = "";

    // Dibujamos las "Carpetas" en pantalla
    albumes.forEach(album => {
        const tarjetaCarpeta = document.createElement("div");
        tarjetaCarpeta.classList.add("foto-tarjeta");
        tarjetaCarpeta.style.cursor = "pointer"; // Hace que parezca cliqueable
        
        tarjetaCarpeta.innerHTML = `
            <img src="${album.imagenPortada}" alt="${album.tituloAlbum}">
            <div class="foto-info">
                <h3>📁 ${album.tituloAlbum}</h3>
                <p style="color: #888888; font-size: 0.9rem; margin-bottom: 15px;">${album.descripcion}</p>
                <span class="precio">${album.precioGeneral} c/u</span>
                <button class="btn-comprar" style="width: 100%; border: none;">Ver Álbum Completo</button>
            </div>
        `;

        // Al hacer clic en la carpeta, entramos a ver sus fotos por adentro
        tarjetaCarpeta.addEventListener("click", () => {
            mostrarAlbumPorDentro(album);
        });

        contenedorFotos.appendChild(tarjetaCarpeta);
    });
}

function mostrarAlbumPorDentro(album) {
    const contenedorFiltros = document.getElementById("filtros-albumes");
    const contenedorFotos = document.getElementById("contenedor-galeria");

    // 1. Creamos un botón elegante para "Volver atrás" a las carpetas principales
    contenedorFiltros.innerHTML = `
        <button class="btn-album activo" id="btn-volver">← Volver a las Carpetas</button>
        <h2 style="text-align: center; width: 100%; margin-top: 20px; color: white;">${album.tituloAlbum}</h2>
        <p style="text-align: center; width: 100%; color: #888888; font-size: 0.95rem;">Mostrando todas las muestras de calidad disponibles.</p>
    `;

    document.getElementById("btn-volver").addEventListener("click", cargarVistaInicial);

    // 2. Limpiamos la grilla y dibujamos TODAS las fotos que tiene este álbum adentro
    contenedorFotos.innerHTML = "";

    album.fotos.forEach(foto => {
        const tarjetaFoto = document.createElement("div");
        tarjetaFoto.classList.add("foto-tarjeta");

        const mensajeWhatsApp = `Hola Florencia! Vi tu catálogo web y me interesa adquirir la fotografía "${foto.title}" de la categoría ${album.tituloAlbum} (Valor: ${album.precioGeneral}).`;
        const urlWhatsAppReal = `https://wa.me{telefonoWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;

        tarjetaFoto.innerHTML = `
            <img src="${foto.imagenUrl}" alt="${foto.title}">
            <div class="foto-info">
                <h3>${foto.title}</h3>
                <span class="precio">${album.precioGeneral}</span>
                <a href="${urlWhatsAppReal}" target="_blank" class="btn-comprar">Encargar Foto</a>
            </div>
        `;

        contenedorFotos.appendChild(tarjetaFoto);
    });
}

// Inicializamos la página mostrando las carpetas al principio
document.addEventListener("DOMContentLoaded", cargarVistaInicial);