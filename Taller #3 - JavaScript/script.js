const API_BASE = "http://apicodersnet.runasp.net/api";

const btnCargarDatos = document.getElementById("btnFetch");
const divResultadosGet = document.getElementById("getResults");
const formularioPost = document.getElementById("postForm");
const divRespuestaPost = document.getElementById("postResponse");

btnCargarDatos.addEventListener("click", () => {
    divResultadosGet.innerHTML = "Cargando datos de géneros...";
    fetch(`${API_BASE}/generos`)
        .then(respuestaDelServidor => {
            if (!respuestaDelServidor.ok) {
                throw new Error("Algo salió mal");
            }
            return respuestaDelServidor.json();
        })
        .then(datosRecibidos => {
            divResultadosGet.innerHTML = "";

            if (Array.isArray(datosRecibidos)) {
                datosRecibidos.forEach(genero => {
                    const divGenero = document.createElement("div");
                    divGenero.textContent = `ID: ${genero.id}, Nombre: ${genero.nombre}`;
                    divResultadosGet.appendChild(divGenero);
                });
            } else {
                divResultadosGet.textContent = JSON.stringify(datosRecibidos, null, 2);
            }
        })
        .catch(error => {
            divResultadosGet.textContent = `¡Hubo un error! No pudimos obtener los datos: ${error.message}`;
            console.error("Error al obtener datos:", error);
        });
});

formularioPost.addEventListener("submit", evento => {
    evento.preventDefault();

    divRespuestaPost.textContent = "Enviando tus datos...";

    // Aquí se hace referencia a los datos de envío a la API para un nuevo Género
    // La API de Generos, según la imagen, solo parece necesitar un 'nombre' para crear uno nuevo.
    // Si la API requiere un 'id' para la creación o algún otro campo, deberías añadirlo aquí.
    const datosParaEnviar = {
        nombre: formularioPost.nombre.value, // Suponemos que el input 'nombre' se usará para el nombre del género
        // Elimina el 'email' si no es relevante para el POST de Generos
        // email: formularioPost.email.value, 
    };

    fetch(`${API_BASE}/generos`, { // Cambiado de /actores a /generos
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datosParaEnviar),
    })
        .then(respuestaDelServidor => {
            if (!respuestaDelServidor.ok) {
                return respuestaDelServidor.json().then(errData => {
                    throw new Error(errData.message || "Algo salió mal al enviar los datos.");
                }).catch(() => {
                    throw new Error("Algo salió mal al enviar los datos (respuesta no OK).");
                });
            }
            return respuestaDelServidor.json();
        })
        .then(datosRespuesta => {
            divRespuestaPost.textContent = "¡Datos enviados con éxito! Respuesta de la API: " + JSON.stringify(datosRespuesta, null, 2);
            formularioPost.reset();
        })
        .catch(error => {
            divRespuestaPost.textContent = `¡Ups! No pudimos enviar tus datos: ${error.message}`;
            console.error("Error al enviar datos:", error);
        });
});