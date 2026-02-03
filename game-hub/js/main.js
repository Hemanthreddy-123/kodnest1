// Main website logic

document.addEventListener('DOMContentLoaded', () => {
    console.log('Game Hub Loaded');

    // Navigation Active State
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Dark Mode Toggle (Conceptual - since our default is dark neon, maybe "Light Mode" or "Zen Mode")
    // For now, we will add a simple toggle if requested, but the theme is heavily dark-first.
    
    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
