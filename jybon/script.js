document.addEventListener("DOMContentLoaded", function() {
    const mainHeader = document.querySelector('.main-header');
    const setParallax = () => {
        if (mainHeader) {
            const speed = 0.5; 
            mainHeader.style.backgroundPositionY = `${window.scrollY * speed}px`;
        }
    };

    setParallax();
    window.addEventListener('scroll', setParallax);

    // Animate the main header when the page loads
    if (mainHeader) mainHeader.classList.add('animate-header');
    const headerText = document.querySelector('.main-header h1');
    const headerButton = document.querySelector('.main-header button');
    if (headerText) headerText.classList.add('animate-text');
    if (headerButton) headerButton.classList.add('animate-button');

    // Animate sections when they come into view
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Animate headings and text when they come into view
    const animatedTextElements = document.querySelectorAll('.animated-text');
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-slide-up');
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedTextElements.forEach(element => {
        textObserver.observe(element);
    });

    // Service item animation
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('bounce-in');
                serviceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    serviceItems.forEach(service => {
        serviceObserver.observe(service);
    });

    // Initialize the Bootstrap carousel with consistent timing
    $('#testimonialCarousel').carousel({
        interval: 5000, 
        pause: 'hover' 
    });

    // Function to set animation for active carousel item
    const carouselItems = document.querySelectorAll('#testimonialCarousel .carousel-item');
    const setActiveAnimation = (activeItem) => {
        carouselItems.forEach(item => {
            const box = item.querySelector('.testimonial-box');
            if (item === activeItem && box) {
                box.style.animation = 'slideIn 1.5s ease-in-out forwards';
            } else if (box) {
                box.style.animation = ''; 
            }
        });
    };

    // Set the animation when the document loads initially
    setActiveAnimation(document.querySelector('.carousel-item.active'));

    $('#testimonialCarousel').on('slide.bs.carousel', function (e) {
        const activeElement = e.relatedTarget;
        setActiveAnimation(activeElement);
    });

    // Smooth scrolling for navbar links
    const navbarLinks = document.querySelectorAll(".navbar-nav a");
    navbarLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute("href"));
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // Modal handling
    const bookNowButton = document.getElementById("book-now-btn");
    const bookingModal = new bootstrap.Modal(document.getElementById("bookingModal"));
    const successModal = new bootstrap.Modal(document.getElementById("successModal"));

    if (bookNowButton) {
        bookNowButton.addEventListener("click", function () {
            bookingModal.show();
        });
    }

    //Get Receipt
    document.getElementById('getReceiptBtn').addEventListener('click', function () {
        let selectedItems = [];
        let totalAmount = 0;
    
        // Loop through all checked items
        document.querySelectorAll('input[type="checkbox"]:checked').forEach((item) => {
            const itemLabel = item.nextElementSibling;
            const itemName = itemLabel.querySelector('.font-weight-bold').innerText;
            const itemPriceText = item.value.split(' - ₱')[1]; // Extract price from value
            const itemPrice = parseFloat(itemPriceText);
            const quantityInput = itemLabel.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value);
    
            selectedItems.push({ name: itemName, quantity: quantity, price: itemPrice });
            totalAmount += itemPrice * quantity;
        });
    
        // Get the pickup date and time
        const pickupDate = document.getElementById('pickupDate').value;
        const pickupTime = document.getElementById('pickupTime').value;
    
        // Check if any items were selected and if date/time is provided
        if (selectedItems.length === 0 || !pickupDate || !pickupTime) {
            alert('Please select at least one item and specify the pickup date/time.');
            return;
        }
    
        // Build the receipt content
        let receiptContent = '<h4>Your Receipt</h4>';
        receiptContent += '<ul>';
        selectedItems.forEach((item) => {
            receiptContent += `<li>${item.name} - Quantity: ${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}</li>`;
        });
        receiptContent += `</ul><p><strong>Total Amount:</strong> ₱${totalAmount.toFixed(2)}</p>`;
    
        // Add pickup date and time to the receipt
        receiptContent += `<p><strong>Pickup Date:</strong> ${pickupDate}</p>`;
        receiptContent += `<p><strong>Pickup Time:</strong> ${pickupTime}</p>`;
    
        // Display the receipt in a new window
        displayReceipt(receiptContent);
    });
    
    // Function to display the receipt
    function displayReceipt(content) {
        const receiptWindow = window.open('', '_blank', 'width=400,height=600');
        receiptWindow.document.write(`<html><head><title>Receipt</title></head><body>${content}</body></html>`);
        receiptWindow.document.close();
    }    

    // Handle booking form submission
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            document.getElementById("paymentSection").style.display = "block";
            this.querySelector('button[type="submit"]').style.display = "none"; 
        });
    }

    // Payment Handling
    const completePaymentBtn = document.getElementById("getreceiptbtn");

    // Show GCash or PayPal based on selection
    document.getElementById("gcashPayment").addEventListener("change", function() {
        document.getElementById("gcashQR").style.display = "block";
        document.getElementById("paypalLogo").style.display = "none";
        completePaymentBtn.style.display = "block"; 
    });

    document.getElementById("paypalPayment").addEventListener("change", function() {
        document.getElementById("paypalLogo").style.display = "block";
        document.getElementById("gcashQR").style.display = "none";
        completePaymentBtn.style.display = "block"; 
    });

    // Complete payment process
    completePaymentBtn.addEventListener("click", function() {
        bookingModal.hide(); // Hide booking modal
        successModal.show(); // Show success modal
    });

    // Enhanced bubble creation with speed and trajectory variations
    const bubbleContainer = document.createElement('div');
    bubbleContainer.classList.add('bubble-container');
    document.body.appendChild(bubbleContainer);

    const popSound = new Audio('assets/pop/pop-sound.mp3');
    popSound.preload = 'auto';

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        // Randomize bubble size
        const sizeClass = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)];
        bubble.classList.add(sizeClass);

        // Randomize position and speed
        bubble.style.left = Math.random() * window.innerWidth + 'px';
        const speed = Math.random() * 10 + 5; // Speed between 5s and 15s
        bubble.style.animationDuration = `${speed}s`;

        // Randomize trajectory for natural floating effect
        bubble.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`;

        bubble.addEventListener('click', function() {
            popSound.currentTime = 0;
            popSound.play();
            bubble.classList.add('pop');
            setTimeout(() => {
                bubble.remove();
            }, 1000);
        });

        bubbleContainer.appendChild(bubble);

        // Remove the bubble after it floats out of the screen
        setTimeout(() => {
            bubble.remove();
        }, speed * 1000);
    }

    // Create bubbles with a randomized interval
    setInterval(createBubble, Math.random() * 1000 + 500);
});

// Gallery Pagination with Fancybox integration
document.addEventListener('DOMContentLoaded', function() {
    const images = [
        'assets/gallery/adobo.jpg', 'assets/gallery/beef.jpg', 'assets/gallery/chicken.jpg',
        'assets/gallery/gulay.jpg', 'assets/gallery/kawali.jpg', 'assets/gallery/octo.jpg',
        'assets/gallery/pizzapie.jpg', 'assets/gallery/porkchop1.jpg', 'assets/gallery/seafood.jpg',
        'assets/gallery/siniganghipon.jpg', 'assets/gallery/yummy.jpg',
    ];

    let imagesPerPage = 12;
    if (window.innerWidth <= 768) {
        imagesPerPage = 8; 
    }

    let currentPage = 1;

    const galleryGrid = document.getElementById('galleryGrid');
    const pageIndicator = document.getElementById('pageIndicator');

    function displayImages(page) {
        galleryGrid.innerHTML = ''; 
        const start = (page - 1) * imagesPerPage;
        const end = start + imagesPerPage;
        const pageImages = images.slice(start, end);

        pageImages.forEach((imgSrc, index) => {
            const link = document.createElement('a');
            link.href = imgSrc; 
            link.setAttribute('data-fancybox', 'gallery');
            link.setAttribute('data-caption', `Gallery Image ${start + index + 1}`); 

            const img = document.createElement('img');
            img.src = imgSrc.replace('-large', '-thumb'); 
            img.alt = `Gallery Image ${start + index + 1}`;

            link.appendChild(img);
            galleryGrid.appendChild(link);
        });

        // Update the page indicator
        pageIndicator.textContent = `Page ${page} of ${Math.ceil(images.length / imagesPerPage)}`;

        // Reinitialize Fancybox to bind the newly added images
        Fancybox.bind('[data-fancybox="gallery"]', {
            infinite: true, 
            buttons: ["zoom", "slideShow", "thumbs", "close"], 
            transitionEffect: "fade", 
            thumbs: {
                autoStart: true, 
            }
        });
    }

    // Pagination functions
    function nextPage() {
        if (currentPage < Math.ceil(images.length / imagesPerPage)) {
            currentPage++;
            displayImages(currentPage);
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayImages(currentPage);
        }
    }

    // Event listeners for pagination
    document.getElementById('nextPage').addEventListener('click', nextPage);
    document.getElementById('prevPage').addEventListener('click', prevPage);

    // Initial display of images
    displayImages(currentPage);
});

document.addEventListener("DOMContentLoaded", function() {
    const bookNowButton = document.getElementById("book-now-btn");
    const bookingModal = new bootstrap.Modal(document.getElementById("bookingModal"));
    const successModal = new bootstrap.Modal(document.getElementById("successModal"));
    const continueToPaymentBtn = document.getElementById("continueToPayment");
    const bookingForm = document.getElementById("bookingForm");
    const paymentSection = document.getElementById("paymentSection");
    const completePaymentBtn = document.getElementById("completePaymentBtn");

    const gcashOption = document.querySelector('.gcash-option');
    const paypalOption = document.querySelector('.paypal-option');

    if (bookNowButton) {
        bookNowButton.addEventListener("click", function () {
            bookingModal.show();
        });
    }

    // Handle "Continue to Payment" button click to move to the payment section
    if (continueToPaymentBtn) {
        continueToPaymentBtn.addEventListener("click", function() {
            // Validate form fields
            const pickupDate = document.getElementById("pickupDate").value;
            const pickupTime = document.getElementById("pickupTime").value;
            const pickupAddress = document.getElementById("pickupAddress").value;

            if (!pickupDate || !pickupTime || !pickupAddress) {
                alert("Please fill out all required fields.");
                return;
            }

            // Show the payment section and hide "Continue to Payment" button
            paymentSection.style.display = "block";
            continueToPaymentBtn.style.display = "none";
        });
    }

    // Payment handling logic for GCash and PayPal
    document.getElementById("gcashPayment").addEventListener("change", function() {
        document.getElementById("gcashQR").style.display = "block";
        document.getElementById("paypalLogo").style.display = "none";
        completePaymentBtn.style.display = "block"; 

        // Highlight the selected payment option
        gcashOption.classList.add('selected');
        paypalOption.classList.remove('selected');
    });

    document.getElementById("paypalPayment").addEventListener("change", function() {
        document.getElementById("paypalLogo").style.display = "block";
        document.getElementById("gcashQR").style.display = "none";
        completePaymentBtn.style.display = "block"; 
        paypalOption.classList.add('selected');
        gcashOption.classList.remove('selected');
    });

    // Completing the payment process
    if (completePaymentBtn) {
        completePaymentBtn.addEventListener("click", function() {
            // Simulate payment completion
            bookingModal.hide(); // Hide the booking modal
            successModal.show(); // Show the success modal
        });
    }

    // Get the search input element
const searchInput = document.getElementById('foodSearch');
const foodItems = document.querySelectorAll('.food-item');
function filterFoodItems() {
    const searchQuery = searchInput.value.toLowerCase();
    foodItems.forEach(function (item) {
        const foodName = item.querySelector('.font-weight-bold').textContent.toLowerCase();

        if (foodName.includes(searchQuery)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

    // Rating
    document.addEventListener('DOMContentLoaded', function () {
        // Existing code for parallax, animations, etc.
    
        // Rating System
        const stars = document.querySelectorAll('.rating .star');
        const ratingValue = document.getElementById('ratingValue');
    
        stars.forEach(star => {
            star.addEventListener('click', () => {
                // Remove active class from all stars
                stars.forEach(s => s.classList.remove('active'));
    
                // Add active class to clicked star and previous stars
                star.classList.add('active');
                let currentStar = star;
                while (currentStar.previousElementSibling) {
                    currentStar.previousElementSibling.classList.add('active');
                    currentStar = currentStar.previousElementSibling;
                }
    
                // Set the rating value
                ratingValue.value = star.getAttribute('data-value');
            });
        });
    
        // Other existing code for smooth scrolling, modals, etc.
    });
    


// Add an event listener to the search input to trigger filtering on keyup
searchInput.addEventListener('keyup', filterFoodItems);
});
