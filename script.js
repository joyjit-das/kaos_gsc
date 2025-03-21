// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // ===== SMOOTH SCROLLING NAVIGATION =====
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only prevent default behavior for internal links (those starting with '#')
            if (href.startsWith('#')) {
                e.preventDefault();

                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to clicked link
                this.classList.add('active');

                // Get the target section id from href attribute
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Smooth scroll to target section
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Also add smooth scrolling to the Learn More button
    const learnMoreButton = document.querySelector('.hero-buttons .button');
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target section from href attribute
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Smooth scroll to target section
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // ===== CONTACT FORM FUNCTIONALITY =====
    // Get references to form elements
    const contactForm = document.querySelector('.contact-form form');
    console.log("Contact form found:", contactForm !== null); // Debug info
    
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const submitButton = document.querySelector('.contact-form button');
        
        console.log("Form inputs found:", {
            name: nameInput !== null,
            email: emailInput !== null,
            message: messageInput !== null,
            submitButton: submitButton !== null
        }); // Debug info

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = 'Message received!';
        notification.style.display = 'none';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.marginTop = '20px';
        notification.style.borderRadius = '8px';
        notification.style.textAlign = 'center';
        notification.style.transition = 'all 0.5s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';

        // Add notification to the form
        contactForm.appendChild(notification);

        // Function to check if all fields are filled
        function validateForm() {
            return nameInput.value.trim() !== '' &&
                emailInput.value.trim() !== '' &&
                messageInput.value.trim() !== '';
        }

        // Validate email format
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // Add input event listeners to form fields
        nameInput.addEventListener('input', checkFormValidity);
        emailInput.addEventListener('input', checkFormValidity);
        messageInput.addEventListener('input', checkFormValidity);

        // Check form validity and update button state
        function checkFormValidity() {
            if (validateForm()) {
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
                submitButton.disabled = false;
            } else {
                submitButton.style.opacity = '0.6';
                submitButton.style.cursor = 'not-allowed';
                submitButton.disabled = true;
            }
        }

        // Initially disable the submit button
        submitButton.disabled = true;
        submitButton.style.opacity = '0.6';
        submitButton.style.cursor = 'not-allowed';

        // Handle form submission
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log("Form submitted"); // Debug info
            
            if (!validateForm()) {
                console.log("Form validation failed"); // Debug info
                return;
            }

            // Additional validation for email
            if (!validateEmail(emailInput.value.trim())) {
                showNotification('Please enter a valid email address.', 'error');
                console.log("Email validation failed"); // Debug info
                return;
            }

            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';

            // Get form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };
            
            console.log("Sending form data:", formData); // Debug info

            // Send email with form data
            sendEmail(formData)
                .then(response => {
                    console.log("Server response:", response); // Debug info
                    
                    // Reset submit button
                    submitButton.textContent = 'Send Message';

                    if (response.success) {
                        // Show success notification
                        showNotification('Message sent successfully!', 'success');

                        // Reset form
                        contactForm.reset();

                        // Disable button after submission
                        submitButton.disabled = true;
                        submitButton.style.opacity = '0.6';
                        submitButton.style.cursor = 'not-allowed';
                    } else {
                        // Show error notification
                        showNotification('Failed to send message: ' + response.message, 'error');
                        submitButton.disabled = false;
                        submitButton.style.opacity = '1';
                        submitButton.style.cursor = 'pointer';
                    }
                })
                .catch(error => {
                    console.error('Email sending error:', error); // Debug info
                    
                    // Reset submit button
                    submitButton.textContent = 'Send Message';
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';

                    // Show error notification
                    showNotification('Failed to send message. Please try again.', 'error');
                });
        });

        // Enhanced notification function that supports different types (success/error)
        function showNotification(message, type) {
            console.log("Showing notification:", message, type); // Debug info
            
            // Update notification properties
            notification.textContent = message;
            notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';

            // Show the notification with animation
            notification.style.display = 'block';

            // Use setTimeout to allow the browser to recognize the element is displayed
            // before applying the transition effects
            setTimeout(function () {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);

            // Hide notification after 3 seconds
            setTimeout(function () {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';

                // After animation completes, hide the element
                setTimeout(function () {
                    notification.style.display = 'none';
                }, 500);
            }, 3000);
        }
    }

    // Add active class to navigation based on scroll position
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;

        // Get all sections
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for better UX
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));

                // Find the corresponding nav link (if it exists)
                const navLink = document.querySelector('nav a[href="#' + sectionId + '"]');
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });
});

// Function to send email using our Python backend
function sendEmail(formData) {
    console.log("In sendEmail function, preparing to send to server"); // Debug info
    
    // The endpoint should match the route in your Flask app
    const emailEndpoint = 'http://127.0.0.1:5500/send-email';

    return fetch(emailEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        console.log("Raw server response:", response); // Debug info
        
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
    });
}