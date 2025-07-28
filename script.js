document.addEventListener('DOMContentLoaded', () => {
    // Animación de desplazamiento (Scroll Reveal)
    const sections = document.querySelectorAll('[data-aos]');

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target); // Dejar de observar una vez que se muestra
            }
        });
    };

    // Solo crear el IntersectionObserver si hay secciones para observar
    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver(revealSection, {
            root: null, // Observa el viewport
            threshold: 0.15 // Al menos el 15% de la sección debe estar visible
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }


    // Carrusel de Presentación
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;

    function showSlide(index) {
        // Asegúrate de que haya elementos en el carrusel antes de intentar manipularlos
        if (carouselItems.length === 0) return;

        carouselItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
            showSlide(currentIndex);
        });
        showSlide(currentIndex); // Mostrar el primer slide al cargar
    } else {
        console.warn('Botones de carrusel (prevBtn, nextBtn) o ítems no encontrados. El carrusel no funcionará.');
    }


    // Lightbox para la Galería de Imágenes
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.close-btn');

    document.querySelectorAll('.gallery-grid img.gallery-image-clickable').forEach(image => {
        image.addEventListener('click', () => {
            lightbox.style.display = 'flex'; // Usamos flex para centrar
            lightboxImg.src = image.src;
            // Opcional: añadir clase para animaciones CSS
            lightbox.classList.add('active');
        });
    });

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            lightbox.classList.remove('active');
        });
    }

    // Cerrar lightbox haciendo clic fuera de la imagen
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                lightbox.classList.remove('active');
            }
        });
    }


    // Modal de Confirmación para el Formulario de Contacto
    const contactForm = document.querySelector('.contact-form');
    const confirmationModal = document.getElementById('confirmationModal');
    // Si tienes un botón de cierre dentro del modal, búscalo aquí:
    // const closeConfirmationModalBtn = confirmationModal ? confirmationModal.querySelector('.close-button') : null;

    function showConfirmationModal() {
        if (confirmationModal) {
            confirmationModal.classList.remove('hide'); // Asegura que no tenga la clase hide
            confirmationModal.style.display = 'flex';
            // Pequeño retardo para asegurar que la propiedad display se aplique antes de la transición de opacidad
            setTimeout(() => {
                confirmationModal.classList.add('show');
            }, 10);
        }
    }

    function hideConfirmationModal() {
        if (confirmationModal) {
            confirmationModal.classList.remove('show');
            confirmationModal.classList.add('hide'); // Añade la clase hide para la animación de salida
            // Espera a que termine la animación antes de ocultar
            confirmationModal.addEventListener('transitionend', function handler() {
                if (!confirmationModal.classList.contains('show')) { // Solo si no se ha vuelto a mostrar
                    confirmationModal.style.display = 'none';
                    confirmationModal.classList.remove('hide'); // Limpia la clase hide
                }
                confirmationModal.removeEventListener('transitionend', handler);
            });
        }
    }


    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar el envío predeterminado del formulario

            const formEndpoint = contactForm.action; // Obtiene la URL de action del formulario
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(formEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showConfirmationModal();
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        alert('Error al enviar el mensaje: ' + data.errors.map(err => err.message).join(', '));
                    } else {
                        alert('Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.');
                    }
                }
            } catch (error) {
                console.error('Error de red al enviar el formulario:', error);
                alert('No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta de nuevo.');
            }
        });
    } else {
        console.warn('El formulario de contacto (.contact-form) no se encontró en el DOM.');
    }

    // Asegúrate de que el modal exista y añade un listener para cerrarlo al hacer clic fuera
    if (confirmationModal) {
        confirmationModal.addEventListener('click', (e) => {
            if (e.target === confirmationModal) {
                hideConfirmationModal();
            }
        });
    }

    // NUEVA FUNCIONALIDAD: Menú de Navegación Responsivo (Menú Hamburguesa)
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('open'); // Para animar el icono de hamburguesa
        });

        // Cerrar el menú cuando se hace clic en un enlace de navegación
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('open');
            });
        });
    } else {
        console.warn('Botón de hamburguesa o enlaces de navegación no encontrados.');
    }

});
