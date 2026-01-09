// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos importantes
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const firstVisitDateElement = document.getElementById('firstVisitDate');
    const currentDateElement = document.getElementById('currentDate');
    const photoElement = document.getElementById('ourPhoto');
    
    // Estado de la música
    let isMusicPlaying = false;
    
    // 1. Guardar fecha de primera visita usando localStorage
    function saveFirstVisitDate() {
        const now = new Date();
        const dateString = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Verificar si ya existe una fecha guardada
        if (!localStorage.getItem('firstVisitDate')) {
            localStorage.setItem('firstVisitDate', dateString);
            firstVisitDateElement.textContent = `Primera vez que abres esta carta: ${dateString}`;
        } else {
            const savedDate = localStorage.getItem('firstVisitDate');
            firstVisitDateElement.textContent = `Primera vez que abriste esta carta: ${savedDate}`;
        }
    }
    
    // 2. Configurar fecha actual en el pie de página
    function setCurrentDate() {
        const now = new Date();
        const dateString = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        currentDateElement.textContent = `Hoy es ${dateString}`;
    }
    
    // 3. Controlador de música
    function setupMusicControls() {
        // Intentar reproducir automáticamente (con manejo de errores)
        const playMusic = () => {
            backgroundMusic.play()
                .then(() => {
                    isMusicPlaying = true;
                    updateMusicButton();
                })
                .catch(error => {
                    console.log("La reproducción automática fue bloqueada:", error);
                    // Mostrar instrucciones para el usuario
                    musicToggle.innerHTML = '<i class="fas fa-play"></i><span>Click para reproducir música</span>';
                });
        };
        
        // Intentar reproducir después de la interacción del usuario
        const userInteractionHandler = () => {
            if (!isMusicPlaying) {
                playMusic();
            }
            // Remover este event listener después del primer click
            document.removeEventListener('click', userInteractionHandler);
        };
        
        // Agregar event listener para la primera interacción del usuario
        document.addEventListener('click', userInteractionHandler);
        
        // Configurar el botón de toggle de música
        musicToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevenir que el click se propague al document
            
            if (isMusicPlaying) {
                backgroundMusic.pause();
                isMusicPlaying = false;
            } else {
                backgroundMusic.play()
                    .then(() => {
                        isMusicPlaying = true;
                    })
                    .catch(error => {
                        console.log("Error al reproducir música:", error);
                        alert("Para reproducir la música, por favor haz click en 'Permitir' si tu navegador lo solicita.");
                    });
            }
            
            updateMusicButton();
        });
        
        // Actualizar el estado del botón de música
        function updateMusicButton() {
            const icon = musicToggle.querySelector('i');
            const text = musicToggle.querySelector('span');
            
            if (isMusicPlaying) {
                icon.className = 'fas fa-pause';
                text.textContent = 'Pausar música';
            } else {
                icon.className = 'fas fa-play';
                text.textContent = 'Reproducir música';
            }
        }
        
        // Actualizar el botón cuando la música termine (por si acaso)
        backgroundMusic.addEventListener('ended', function() {
            // Como tenemos loop, esto no debería pasar, pero por seguridad
            isMusicPlaying = false;
            updateMusicButton();
        });
        
        // Manejar errores de carga de música
        backgroundMusic.addEventListener('error', function() {
            console.error("Error al cargar el archivo de música.");
            musicToggle.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Error al cargar música</span>';
            musicToggle.style.backgroundColor = '#ffcccc';
        });
    }
    
    // 4. Animaciones al hacer scroll
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-text, .animate-photo');
        
        // Función para verificar si un elemento está en el viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
                rect.bottom >= 0
            );
        }
        
        // Función para manejar las animaciones al hacer scroll
        function handleScrollAnimations() {
            animatedElements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('visible');
                }
            });
        }
        
        // Asegurarse de que la foto se cargue correctamente
        if (photoElement) {
            photoElement.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            
            // En caso de que la imagen ya esté cargada (caché)
            if (photoElement.complete) {
                photoElement.classList.add('loaded');
            }
        }
        
        // Ejecutar al cargar y al hacer scroll
        handleScrollAnimations();
        window.addEventListener('scroll', handleScrollAnimations);
        window.addEventListener('resize', handleScrollAnimations);
    }
    
    // 5. Inicializar todo
    function init() {
        saveFirstVisitDate();
        setCurrentDate();
        setupMusicControls();
        setupScrollAnimations();
        
        // Pequeña animación de bienvenida para los títulos
        setTimeout(() => {
            const title = document.querySelector('.title');
            const subtitle = document.querySelector('.subtitle');
            
            if (title) title.classList.add('visible');
            if (subtitle) setTimeout(() => subtitle.classList.add('visible'), 300);
        }, 500);
        
        // Mostrar mensaje de bienvenida en consola (solo para desarrollo)
        console.log("💌 Carta de amor cargada con éxito 💌");
        console.log("Música: Boy In Luv de BTS");
        console.log("Fecha de primera visita guardada en localStorage");
    }
    
    // Iniciar la aplicación
    init();
});