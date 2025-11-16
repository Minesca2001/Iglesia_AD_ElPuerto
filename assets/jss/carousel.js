document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll("#eventos-noticias .carousel-slide");
    const prevBtn = document.querySelector("#eventos-noticias #prevBtn");
    const nextBtn = document.querySelector("#eventos-noticias #nextBtn");

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
    }

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        showSlide(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    });

    // Auto-play opcional
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, 5000);
});
