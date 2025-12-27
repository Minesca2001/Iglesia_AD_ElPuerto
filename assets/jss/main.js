// This file can be used for interactive elements, animations, or other JavaScript functionalities
// specific to your sections.
// For now, it's empty, but ready for future additions.

import '@fortawesome/fontawesome-free/js/all.min.js';

console.log("main.js loaded. Ready for interactive features!");

// Get dynamic content area
const dynamicContentArea = document.getElementById('dynamic-content-area');
const mainHeader = document.getElementById('main-header');

/**
 * Loads content for a given section ID into the dynamic content area.
 * @param {string} sectionId - The ID of the section to load (e.g., 'home', 'nosotros').
 */
async function loadSection(sectionId) {
    // Validate sectionId to prevent loading arbitrary files
    const validSections = [
        'home', 'nosotros', 'doctrina', 'ministerios',
        'eventos-noticias', 'recursos', 'medios', 'contacto', 'empty-seats', 'calendary', 'eventos', 'mapa-asientos',
        // Add specific ministry pages for dynamic loading
        'femenil', 'juventud', 'varones', 'misioneritas', 'exploradores', 'danza', 'adoracion', 'musica',
        // Add general ministry pages for dynamic loading
        'escuela-dominical', 'misiones', 'evangelismo', 'desead', 'multimedia', 'missions'
    ];
    if (!validSections.includes(sectionId)) {
        console.warn(`Attempted to load invalid section: ${sectionId}. Loading home instead.`);
        sectionId = 'home';
    }

    try {
        const response = await fetch(`${sectionId}.html`);
        /* if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } */

        // ... dentro de loadSection en main.js ...
        const content = await response.text();
        dynamicContentArea.innerHTML = content;

        // NUEVA LÓGICA DE INTEGRACIÓN:
        if (sectionId === 'mapa-asientos') {
            // Esperamos un milisegundo para asegurar que el DOM se procesó
            setTimeout(() => {
                if (typeof initAuditorio === 'function') {
                    initAuditorio();
                } else {
                    console.error("La función initAuditorio no se encuentra. Revisa auditorio.js")
                }
            }, 100);
        }
        /*/ ... resto del código ...
        // Dentro de loadSection, después de dynamicContentArea.innerHTML = content;
        if (sectionId === 'mapa-asientos') {
            // Verificamos si la función existe en auditorio.js antes de llamarla
            if (typeof initMapaAsientos === 'function') {
                initMapaAsientos();
            }
        } */

        // Scroll to the top of the loaded content, accounting for sticky header
        const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;
        window.scrollTo({
            top: dynamicContentArea.offsetTop - headerHeight - 20, // 20px extra padding
            behavior: 'smooth'
        });

        // Update active class for navigation links
        document.querySelectorAll('#main-nav ul li a').forEach(link => {
            link.classList.remove('active');
            // Check if the link href matches the main section or a sub-section of 'ministerios'
            if (link.getAttribute('href') === `#${sectionId}` || (sectionId === 'ministerios' && link.getAttribute('href') === '#ministerios')) {
                link.classList.add('active');
            }
        });

        // Esta seccion es para cargar los eventos desde el json
        {
            async function loadEventCarousel() {
                try {
                    const response = await fetch('/assets/jss/eventos.json');
                    const eventos = await response.json();

                    const carousel = document.getElementById('event-carousel');
                    carousel.innerHTML = '';

                    eventos.forEach((evento, index) => {
                        const img = document.createElement('img');
                        img.src = evento.imagen;
                        img.alt = evento.titulo;

                        if (index === 0) img.classList.add('active');

                        carousel.appendChild(img);
                    });

                    startCarousel();
                } catch (error) {
                    console.error("Error cargando el carrusel:", error);
                }
            }

            function startCarousel() {
                const images = document.querySelectorAll('#event-carousel img');
                let current = 0;

                setInterval(() => {
                    images[current].classList.remove('active');
                    current = (current + 1) % images.length;
                    images[current].classList.add('active');
                }, 6000);
            }

            loadEventCarousel();

        }        // Initialize FAQ accordion functionality for newly loaded content
        initFaqAccordion();

    } catch (error) {
        console.error(`Failed to load section ${sectionId}:`, error);
        dynamicContentArea.innerHTML = `<section class="error-section"><h2>Error al cargar la sección</h2><p>No pudimos cargar el contenido de esta página. Por favor, intente de nuevo más tarde o navegue a la <a href="#home">página de inicio</a>.</p></section>`;
    } finally {
        // Close mobile nav if open after clicking a link
        const mainNav = document.getElementById('main-nav');
        const navToggle = document.getElementById('nav-toggle');
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open'); // Remove body scroll lock
        }
    }
}
/**
 * Initializes FAQ accordion functionality.
 */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.removeEventListener('click', toggleFaqAnswer); // Prevent duplicate listeners
        question.addEventListener('click', toggleFaqAnswer);
    });
}

/**
 * Toggles the visibility of the FAQ answer.
 * @param {Event} event - The click event.
 */
function toggleFaqAnswer(event) {
    const question = event.currentTarget;
    const answer = question.nextElementSibling; // The .faq-answer div
    const icon = question.querySelector('i'); // The icon inside the question

    // Close other open FAQ items within the same accordion
    const parentAccordion = question.closest('.faq-accordion');
    if (parentAccordion) {
        parentAccordion.querySelectorAll('.faq-question.active').forEach(activeQuestion => {
            if (activeQuestion !== question) { // Don't close the current one if it's already active
                activeQuestion.classList.remove('active');
                activeQuestion.nextElementSibling.classList.remove('active');
                activeQuestion.querySelector('i').style.transform = 'rotate(0deg)';
            }
        });
    }

    // Toggle current FAQ item
    question.classList.toggle('active');
    answer.classList.toggle('active');

    if (question.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Load initial section based on URL hash or default to 'home'
    const initialSection = window.location.hash ? window.location.hash.substring(1) : 'home';
    loadSection(initialSection);

    // Listen for hash changes to load new sections
    window.addEventListener('hashchange', () => {
        const newSection = window.location.hash.substring(1);
        loadSection(newSection);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the target is a dynamically loaded section
            const targetId = this.getAttribute('href').substring(1);
            const validSections = [
                'home', 'nosotros', 'doctrina', 'ministerios',
                'eventos-noticias', 'recursos', 'medios', 'contacto', 'empty-seats', 'calendary', 'eventos', 'mapa-asientos',
                'femenil', 'juventud', 'varones', 'misioneritas', 'exploradores', 'danza', 'adoracion', 'musica',
                'escuela-dominical', 'misiones', 'evangelismo', 'desead', 'multimedia', 'empty-seats', 'missions'
            ];

            if (validSections.includes(targetId)) {
                e.preventDefault(); // Prevent default only if it's a dynamic section
                loadSection(targetId);
            } else {
                // For non-dynamic anchors (e.g., within the same loaded section), allow default smooth scroll
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    e.preventDefault(); // Prevent default link behavior if it's an internal anchor
                    const header = document.getElementById('main-header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight - 20,
                        behavior: 'smooth'
                    });
                }
            }

            // Close mobile nav if open after clicking a link
            const mainNav = document.getElementById('main-nav');
            const navToggle = document.getElementById('nav-toggle');
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open'); // Remove body scroll lock
            }
        });
    });

    // Sticky header
    if (mainHeader) {
        let headerOffset = mainHeader.offsetTop;

        const stickyHeader = () => {
            if (window.scrollY > headerOffset) {
                mainHeader.classList.add('sticky');
            } else {
                mainHeader.classList.remove('sticky');
            }
        };

        window.addEventListener('scroll', stickyHeader);
    }

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open'); // Add/remove class to body to disable scroll
        });
    }

});
