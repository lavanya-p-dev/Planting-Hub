// Planting Hub – small interactions
document.documentElement.classList.add('js');

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const toTop = document.getElementById('toTop');
const links = [...navLinks.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.firstElementChild.className = open ? 'fas fa-xmark' : 'fas fa-bars';
});
links.forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.firstElementChild.className = 'fas fa-bars';
}));

// Navbar shadow, back-to-top button, active link highlight
function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    toTop.classList.toggle('show', window.scrollY > 500);

    const pos = window.scrollY + 120;
    let current = 0;
    sections.forEach((s, i) => { if (s && s.offsetTop <= pos) current = i; });
    links.forEach((a, i) => a.classList.toggle('active', i === current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Count-up numbers
function countUp(el) {
    const target = +el.dataset.target;
    const plain = el.dataset.plain === 'true';   // no thousands separator (e.g. a year)
    const start = performance.now();
    const duration = 1400;
    (function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const value = Math.round(target * (1 - Math.pow(1 - t, 3)));
        el.textContent = plain ? value : value.toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
    })(start);
}

// Reveal on scroll (+ trigger counters)
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.counter').forEach(countUp);
        io.unobserve(entry.target);
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Blog images come from an external site – use a green fallback if they fail
document.querySelectorAll('.blog-card img').forEach(img => {
    img.addEventListener('error', () => { img.classList.add('img-failed'); });
});
