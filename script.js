// ========================================================
// ESTRUCTURA DE ÁLBUMES DINÁMICA (CONECTADA AL CMS)
// ========================================================

let albumes = [];

// Número de teléfono real de Florencia para consultas y pedidos
const telefonoWhatsApp = "5493865260159"; 

// Función para leer los datos automáticos que crea el panel
async function cargarDatosDesdeCMS() {
    try {
        const respuesta = await fetch('albumes.json');
        
        if (!respuesta.ok) {
            throw new Error("No se encontró el archivo albumes.json");
        }
        
        const datos = await respuesta.json();
        
        // Guardamos los datos y cargamos la vista
        albumes = datos.albumes || [];
        cargarVistaInicial();
    } catch (error) {
        console.error("Aún no hay álbumes cargados o hubo un error:", error);
    }
}

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

    // 1. Creamos un botón para "Volver atrás" a las carpetas principales
    contenedorFiltros.innerHTML = `
        <button class="btn-album activo" id="btn-volver">← Volver a las Carpetas</button>
        <h2 style="text-align: center; width: 100%; margin-top: 20px; color: white;">${album.tituloAlbum}</h2>
        <p style="text-align: center; width: 100%; color: #888888; font-size: 0.95rem;">Mostrando todas las muestras de calidad disponibles.</p>
    `;

    document.getElementById("btn-volver").addEventListener("click", cargarVistaInicial);

    // 2. Limpiamos la grilla y dibujamos TODAS las fotos que tiene este álbum adentro
    contenedorFotos.innerHTML = "";

    // Verificamos si hay fotos para evitar errores
    if (album.fotos && album.fotos.length > 0) {
        album.fotos.forEach(foto => {
            const tarjetaFoto = document.createElement("div");
            tarjetaFoto.classList.add("foto-tarjeta");

            const mensajeWhatsApp = `Hola Florencia! Vi tu catálogo web y me interesa adquirir la fotografía "${foto.title}" de la categoría ${album.tituloAlbum} (Valor: ${album.precioGeneral}).`;
            const urlWhatsAppReal = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;

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
    } else {
        contenedorFotos.innerHTML = `<p style="color: white; text-align: center; width: 100%;">Este álbum aún no tiene fotos cargadas.</p>`;
    }
}

// Inicializamos la página llamando a la nueva función que busca los datos automáticos
document.addEventListener("DOMContentLoaded", cargarDatosDesdeCMS);


// ========================================================
// PROTECCIÓN DE IMÁGENES Y GALERÍA (Corregido)
// ========================================================

// Bloquea el menú del clic derecho en fotos y dentro de las tarjetas de la galería
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' || e.target.closest('.foto-tarjeta')) {
        e.preventDefault();
    }
});

// Evita que arrastren la imagen al escritorio o a otra pestaña
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});


// ========================================================
// ENVÍO DE FORMULARIO AL WEBHOOK (AGENTE IA)
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
    const formEspecial = document.getElementById("form-servicio-especial");

    if (formEspecial) {
        formEspecial.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evitamos que la página se recargue

            const btnSubmit = document.getElementById("btn-enviar-presupuesto");
            const textoOriginalBtn = btnSubmit.innerText;
            btnSubmit.innerText = "Enviando solicitud...";
            btnSubmit.disabled = true;

            // Recolectamos los datos del formulario
            const datosPedido = {
                nombre: document.getElementById("nombre-cliente").value,
                telefono: document.getElementById("telefono-cliente").value,
                descripcion: document.getElementById("descripcion-evento").value,
                expectativas: document.getElementById("expectativas-servicio").value,
                fechaEnvio: new Date().toLocaleString("es-AR")
            };

            try {
                // AQUÍ: Reemplaza esta URL por la de tu Webhook en Make.com
                const urlWebhook = "https://hook.us1.make.com/TU_WEBHOOK_AQUI"; 
                
                const respuesta = await fetch(urlWebhook, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosPedido)
                });

                if (respuesta.ok) {
                    alert("¡Solicitud enviada con éxito! Florencia se pondrá en contacto a la brevedad.");
                    formEspecial.reset(); // Limpiamos el formulario
                } else {
                    alert("Hubo un detalle al enviar. Intentalo nuevamente.");
                }
            } catch (error) {
                console.error("Error al enviar el pedido:", error);
                alert("Ocurrió un error de conexión. Por favor, verifica tu internet.");
            } finally {
                // Restauramos el botón a su estado normal
                btnSubmit.innerText = textoOriginalBtn;
                btnSubmit.disabled = false;
            }
        });
    }
});
