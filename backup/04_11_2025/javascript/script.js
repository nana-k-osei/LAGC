let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-item");
const totalSlides = slides.length;

function showSlide(index) {
    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;

    const carouselInner = document.querySelector(".carousel-inner");
    if (carouselInner) {
        carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    updateDots();
}

function updateDots() {
    // Find all dot indicators (they're spans with bg-gray-300 or bg-orange-500 classes)
    const dots = document.querySelectorAll(".absolute.bottom-10 span");

    dots.forEach((dot, i) => {
        if (i === currentSlide) {
            dot.classList.add("bg-orange-500");
            dot.classList.remove("bg-gray-300");
        } else {
            dot.classList.add("bg-gray-300");
            dot.classList.remove("bg-orange-500");
        }
    });
}

// Auto-play carousel every 6 seconds
setInterval(() => showSlide(currentSlide + 1), 6000);

// Add click handlers to left/right buttons
document.querySelector(".carousel-prev")?.addEventListener("click", () => {
    showSlide(currentSlide - 1);
});

document.querySelector(".carousel-next")?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
});

// Add click handlers to dots
document.querySelectorAll(".absolute.bottom-10 span").forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
    });
});