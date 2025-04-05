// script.js

// Mobile Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const bars = menuBtn.querySelectorAll('.bar');
        if (bars.length > 0) {
            bars[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(8px, 6px)' : '';
            bars[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
            bars[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -5px)' : '';
        }
    });
}

// Testimonial Slider
const testimonialSlider = document.getElementById('testimonialSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const testimonials = document.querySelectorAll('.testimonial');

let currentSlide = 0;

function showSlide(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    });

    // Initialize first slide
    showSlide(currentSlide);
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// Contact Form Submission Function
async function submitContactForm(formData) {
    try {
        const response = await fetch('http://localhost:3000/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) // Convert form data to JSON
        });

        const data = await response.json();

        if (response.ok) {
            alert('Message sent!');
        } else {
            alert('Error sending message: ' + data.error);
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        alert('Error sending message due to a network problem.');
    }
}

// Contact Form Submission Event Listener
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        console.log('Form submitted:', data); // Replace with your actual form handling

        submitContactForm(data);

        contactForm.reset();
    });
}

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.program-card, .feature-card, .result-card, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Blog Post Form Submission (Admin Panel)
const addBlogPostForm = document.getElementById('addBlogPostForm');
const blogCardsContainer = document.getElementById('blogCards');

if (addBlogPostForm && blogCardsContainer) {

    // Function to sanitize input
    function sanitizeInput(str) {
        return str.replace(/[^\w. ]/gi, function (c) {
            return '&#' + c.charCodeAt(0) + ';';
        });
    }
    let cardIndex = 0; // Track which card to update
    // Function to add blog post to the backend
    async function addBlogPost(user_id, title, content) {
        try {
            const response = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id,
                    title,
                    content
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Blog post created successfully!');
                return data.post_id; // Return the post_id from the response
            } else {
                alert('Failed to create blog post: ' + data.error);
                return null;
            }
        } catch (error) {
            console.error('Error creating blog post:', error);
            alert('Failed to create blog post due to a network error.');
            return null;
        }
    }

    addBlogPostForm.addEventListener('submit', async function (event) {
        event.preventDefault();
         // Retrieve the user_id from localStorage
        const user_id = localStorage.getItem('user_id');

        if (!user_id) {
            alert('You must be logged in to create a blog post.');
            return;
        }
        const title = sanitizeInput(document.getElementById('blogTitle').value);

        const content = sanitizeInput(document.getElementById('blogContent').value);

        // Call the addBlogPost function
        const newPostId = await addBlogPost(user_id, title, content);

        if (newPostId) {
            // Get all the existing glass-card elements
            const existingCards = blogCardsContainer.querySelectorAll('.glass-card');

            // Check if there are any cards to update
            if (existingCards.length > 0) {
                // Update the current card, cycling through the cards
                const currentCard = existingCards[cardIndex % existingCards.length];

                // Update individual elements within the card
                const titleElement = currentCard.querySelector('h2');
                const contentElement = currentCard.querySelector('p');

                if (titleElement) titleElement.textContent = title;

                if (contentElement) contentElement.textContent = content;
            } else {
                // If no cards exist, create one
                const newCard = document.createElement('div');
                newCard.classList.add('glass-card');
                newCard.innerHTML = `
                <h2>${title}</h2>

                <p>${content}</p>
                <div class="author">Author</div>
            `;
                blogCardsContainer.appendChild(newCard);
            }

            cardIndex++; // Increment the index to update the next card
            addBlogPostForm.reset(); // Clear the form
        }
    });
}