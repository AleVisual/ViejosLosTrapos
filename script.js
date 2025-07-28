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

    // Solo inicializar el carrusel si hay elementos
    if (carouselItems.length > 0) {
        showSlide(currentIndex); // Asegurarse de que el primer slide esté activo al cargar
    }

    // Asegúrate de que los botones existan antes de añadir escuchadores de eventos
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            showSlide(currentIndex);
        });
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            showSlide(currentIndex);
        });
    }

    // Desplazamiento suave para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Verificar si el elemento de destino existe antes de intentar desplazar
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Elemento de destino no encontrado para el enlace: ${targetId}`);
            }
        });
    });

    // FUNCIONALIDAD LIGHTBOX / AMPLIAR IMAGENES
    const galleryImages = document.querySelectorAll('.gallery-image-clickable');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    // Asegúrate de que los elementos del lightbox existan antes de añadir escuchadores
    if (lightbox && lightboxImg && closeBtn) {
        galleryImages.forEach(image => {
            image.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = image.src;
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    } else {
        console.warn('Alguno de los elementos del Lightbox no se encontró en el DOM.');
    }

    // NUEVA FUNCIONALIDAD: ENVÍO DE FORMULARIO CON FETCH Y MODAL DE CONFIRMACIÓN
    const contactForm = document.querySelector('.contact-form');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationModalBtn = document.querySelector('#confirmationModal .close-button');

    // Mover las funciones del modal para que estén disponibles
    function showConfirmationModal() {
        if (confirmationModal) { // <--- ESTO ES VITAL: Verifica si el modal existe aquí
            confirmationModal.style.display = 'flex';
            setTimeout(() => {
                confirmationModal.classList.add('show');
            }, 10);
             // === AÑADE ESTA LÍNEA AQUÍ ===
            setTimeout(() => {
                hideConfirmationModal(); // Oculta el modal después de 3 segundos
            }, 3000); // 3000 milisegundos = 3 segundos
        } else {
            console.warn('confirmationModal no se encontró al intentar mostrarlo.');
        }
    }

    function hideConfirmationModal() {
        if (confirmationModal) { // <--- ESTO ES VITAL: Verifica si el modal existe aquí
            confirmationModal.classList.remove('show');
            confirmationModal.addEventListener('transitionend', function handler() {
                confirmationModal.style.display = 'none';
                confirmationModal.removeEventListener('transitionend', handler);
            }, { once: true });
        } else {
            console.warn('confirmationModal no se encontró al intentar ocultarlo.');
        }
    }

    // Asegúrate de que el formulario de contacto exista
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
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

    // Asegúrate de que el botón de cierre del modal y el modal mismo existan
    if (closeConfirmationModalBtn) {
        closeConfirmationModalBtn.addEventListener('click', hideConfirmationModal);
    }

    if (confirmationModal) {
        confirmationModal.addEventListener('click', (e) => {
            if (e.target === confirmationModal) {
                hideConfirmationModal();
            }
        });
    }
});