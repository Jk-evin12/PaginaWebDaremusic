/* ============================================================
   DAREMMUSIC — app.js
   Toda la interactividad de la web
   ============================================================ */

// Envolvemos todo en una función anónima para que las variables
// no "contaminen" el espacio global del navegador
(function () {
  "use strict"; // Modo estricto: ayuda a detectar errores más fácilmente


  /* ============================================================
     PARTÍCULAS DE FONDO
     Dibuja puntitos rosas flotantes en el canvas del fondo
     ============================================================ */

  // Buscamos el elemento <canvas> en el HTML
  const lienzo = document.getElementById("canvas-bg");

  if (lienzo) {
    const ctx = lienzo.getContext("2d"); // Herramienta para dibujar en 2D
    let ancho, alto, particulas;         // Variables de tamaño y lista de partículas

    // Ajusta el tamaño del canvas al de la ventana
    function ajustarTamano() {
      ancho = lienzo.width  = window.innerWidth;
      alto  = lienzo.height = window.innerHeight;
    }

    // Crea las partículas con posición, velocidad y opacidad aleatorias
    function crearParticulas() {
      // En móvil usamos menos partículas para ahorrar batería
      const cantidad = window.innerWidth < 600 ? 20 : 40;

      particulas = Array.from({ length: cantidad }, () => ({
        x:     Math.random() * ancho,          // Posición horizontal aleatoria
        y:     Math.random() * alto,           // Posición vertical aleatoria
        radio: Math.random() * 2.5 + 0.5,     // Tamaño entre 0.5 y 3px
        velX:  (Math.random() - 0.5) * 0.2,   // Velocidad horizontal (izq o der)
        velY:  (Math.random() - 0.5) * 0.2,   // Velocidad vertical (arriba o abajo)
        alfa:  Math.random() * 0.22 + 0.05,   // Transparencia entre 5% y 27%
      }));
    }

    // Dibuja y mueve las partículas en cada fotograma
    function animarParticulas() {
      // Borra el fotograma anterior
      ctx.clearRect(0, 0, ancho, alto);

      particulas.forEach((p) => {
        // Dibuja un círculo para cada partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 137, 122, ${p.alfa})`; // Rosa del logo
        ctx.fill();

        // Mueve la partícula según su velocidad
        p.x += p.velX;
        p.y += p.velY;

        // Si sale por un lado, reaparece por el lado contrario
        if (p.x < 0)     p.x = ancho;
        if (p.x > ancho) p.x = 0;
        if (p.y < 0)     p.y = alto;
        if (p.y > alto)  p.y = 0;
      });

      // Pide al navegador que llame a esta función en el siguiente fotograma
      requestAnimationFrame(animarParticulas);
    }

    // Arrancamos todo
    ajustarTamano();
    crearParticulas();
    animarParticulas();

    // Si el usuario cambia el tamaño de la ventana o gira el móvil,
    // esperamos 200ms antes de recalcular (evita que se ejecute mil veces)
    let temporizadorResize;
    window.addEventListener("resize", () => {
      clearTimeout(temporizadorResize);
      temporizadorResize = setTimeout(() => {
        ajustarTamano();
        crearParticulas();
      }, 200);
    });
  }


  /* ============================================================
     ANIMACIÓN AL HACER SCROLL
     Las secciones aparecen con una animación suave cuando
     el usuario llega a ellas haciendo scroll
     ============================================================ */

  // Seleccionamos todas las secciones que tienen la clase "hidden-section"
  const secciones = document.querySelectorAll(".hidden-section");

  // IntersectionObserver vigila cuándo un elemento entra en la pantalla
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        // Si la sección ya es visible en pantalla...
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible"); // ...la mostramos con animación
          observador.unobserve(entrada.target);    // ...y dejamos de vigilarla (solo una vez)
        }
      });
    },
    { threshold: 0.1 } // Se activa cuando el 10% de la sección es visible
  );

  // Le decimos al observador que vigile cada sección
  secciones.forEach((seccion) => observador.observe(seccion));


  /* ============================================================
     BOTÓN "ESCUCHAR"
     Al hacer clic, baja suavemente hasta la sección de música
     ============================================================ */

  const botonEscuchar = document.getElementById("btnVerMusica");

  if (botonEscuchar) {
    botonEscuchar.addEventListener("click", () => {
      const seccionMusica = document.getElementById("musica");
      if (seccionMusica) {
        // Scroll suave hasta la sección de música
        seccionMusica.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }


  /* ============================================================
     EFECTO PARALLAX EN EL LOGO
     El logo se mueve levemente siguiendo el ratón.
     Solo funciona en escritorio (no en móvil táctil)
     ============================================================ */

  // Detecta si el dispositivo es táctil (móvil o tablet)
  function esDispositivoTactil() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }

  const hero     = document.getElementById("hero");
  const logoHero = hero ? hero.querySelector(".hero-logo") : null;

  // Solo activamos el parallax si hay ratón (no en táctil)
  if (hero && logoHero && !esDispositivoTactil()) {

    hero.addEventListener("mousemove", (evento) => {
      // Calculamos cuánto se ha alejado el ratón del centro de la pantalla
      const centroPantallaX = window.innerWidth  / 2;
      const centroPantallaY = window.innerHeight / 2;
      const desplazX = (evento.clientX - centroPantallaX) / centroPantallaX; // Entre -1 y 1
      const desplazY = (evento.clientY - centroPantallaY) / centroPantallaY; // Entre -1 y 1

      // Movemos el logo suavemente (máx 6px en X, 4px en Y)
      logoHero.style.transform = `translate(${desplazX * 6}px, ${desplazY * 4}px)`;
    });

    // Cuando el ratón sale del hero, el logo vuelve a su posición original
    hero.addEventListener("mouseleave", () => {
      logoHero.style.transform = "translate(0, 0)";
    });
  }

})(); // Fin de la función anónima — aquí termina todo el código
