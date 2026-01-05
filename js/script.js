// TypeWriter Class
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 200;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Set dynamic year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Animation on scroll observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-card, .edu-card, .project-card').forEach(el => {
        observer.observe(el);
    });

    // Contact Form Handling (Dynamic with EmailJS)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerText;

            // Show loading state
            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Prepare template parameters
            // These IDs should be replaced with your actual EmailJS Service ID and Template ID
            const serviceID = 'service_s8eflb1';
            const templateID = 'template_kdqgvh9';

            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                to_name: 'Shanmugam Gowtham' // Or your name
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    btn.innerText = 'Message Sent!';
                    btn.style.backgroundColor = '#00ff66';
                    btn.style.color = '#000';
                    contactForm.reset();

                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    }, 3000);
                }, (err) => {
                    btn.innerText = 'Failed to Send';
                    btn.style.backgroundColor = '#ff4444';

                    console.error('EmailJS Error:', JSON.stringify(err));

                    // Show specific error message to help debug
                    const errorMessage = err.text || "Unknown Error";
                    alert(`EmailJS Failed: ${errorMessage}\n\nPlease check your Service ID, Template ID, and Public Key in the code.`);

                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                        btn.style.backgroundColor = '';
                    }, 3000);
                });
        });
    }

    // Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === category) {
                        card.style.display = 'flex';
                        // Add fade in animation
                        card.animate([
                            { opacity: 0, transform: 'translateY(10px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ], {
                            duration: 300,
                            easing: 'ease-out'
                        });
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
            // Email Copy to Clipboard
            const emailLink = document.getElementById('email-link');
            if (emailLink) {
                emailLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    const email = this.getAttribute('href').replace('mailto:', '');

                    navigator.clipboard.writeText(email).then(() => {
                        // Visual feedback
                        const originalText = this.innerText;
                        this.innerText = 'Copied!';
                        this.style.color = '#00ff66'; // Success green

                        setTimeout(() => {
                            this.innerText = originalText;
                            this.style.color = '';
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy email:', err);
                    });
                });
            }
        });
    }
});
