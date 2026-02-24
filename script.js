// ============================
// Helper Functions
// ============================
const select = (selector, all = false) =>
  all ? document.querySelectorAll(selector) : document.querySelector(selector);

const on = (event, selector, handler, all = false) => {
  const elements = select(selector, all);
  if (all) {
    elements.forEach(el => el.addEventListener(event, handler));
  } else if (elements) {
    elements.addEventListener(event, handler);
  }
};

// ============================
// Navbar + Logout
// ============================

// Mobile nav toggle
on('click', '.hamburger', () => {
  select('.hamburger').classList.toggle('active');
  select('.nav-links').classList.toggle('active');
});

// Display username dynamically
const displayUsername = async () => {
  const usernameDisplay = select('#username-display');
  if (!usernameDisplay) return;
  try {
    const res = await fetch('/session-info');
    const data = await res.json();
    if (data.username) usernameDisplay.textContent = `Hello, ${data.username}`;
  } catch (err) {
    console.error(err);
  }
};
displayUsername();

// ============================
// Smooth Scrolling
// ============================
on('click', 'a[href^="#"]', function (e) {
  e.preventDefault();
  const target = select(this.getAttribute('href'));
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, true);

// ============================
// Navbar Scroll Shadow
// ============================
window.addEventListener('scroll', () => {
  const navbar = select('.navbar');
  if (!navbar) return;
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(255,255,255,0.98)';
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
  } else {
    navbar.style.background = 'rgba(255,255,255,0.95)';
    navbar.style.boxShadow = 'none';
  }
});

// ============================
// Booking Form Defaults
// ============================
const initBookingDates = () => {
  const checkin = select('#checkin');
  const checkout = select('#checkout');
  if (!checkin || !checkout) return;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  checkin.value = today.toISOString().split('T')[0];
  checkout.value = tomorrow.toISOString().split('T')[0];

  checkin.addEventListener('change', () => {
    const checkinDate = new Date(checkin.value);
    const checkoutDate = new Date(checkout.value);
    if (checkoutDate <= checkinDate) {
      const newCheckout = new Date(checkinDate);
      newCheckout.setDate(newCheckout.getDate() + 1);
      checkout.value = newCheckout.toISOString().split('T')[0];
    }
  });
};
initBookingDates();

// ============================
// Gallery Lightbox
// ============================
const initLightbox = () => {
  const images = select('.gallery-item img', true);
  images.forEach(img => {
    img.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <img src="${img.src}" alt="${img.alt}">
          <span class="close">&times;</span>
        </div>`;
      document.body.appendChild(lightbox);

      const removeLightbox = () => document.body.removeChild(lightbox);
      lightbox.querySelector('.close').addEventListener('click', removeLightbox);
      lightbox.addEventListener('click', e => e.target === lightbox && removeLightbox());
    });
  });
};
initLightbox();

// ============================
// Contact Form Submission
// ============================
const initContactForm = () => {
  const form = select('.contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = form.querySelectorAll('input, textarea');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#dc3545';
      } else {
        input.style.borderColor = '#ddd';
      }
    });

    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    const origText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      alert('Thank you! We will get back to you soon.');
      form.reset();
      btn.textContent = origText;
      btn.disabled = false;
    }, 2000);
  });
};
initContactForm();

// ============================
// Booking & Search Buttons
// ============================
const initBookingButtons = () => {
  on('click', '.btn-book', e => {
    const card = e.target.closest('.room-card');
    if (!card) return;
    const name = card.querySelector('h3')?.textContent;
    const price = card.querySelector('.price')?.textContent;
    alert(`Booking ${name} at ${price}. Redirecting...`);
  }, true);

  on('click', '.btn-search', () => {
    const checkin = select('#checkin')?.value;
    const checkout = select('#checkout')?.value;
    const guests = select('#guests')?.value || 1;
    if (!checkin || !checkout) return alert('Select check-in and check-out dates');
    alert(`Searching rooms for ${guests} guest(s) from ${checkin} to ${checkout}`);
    select('#rooms')?.scrollIntoView({ behavior: 'smooth' });
  });
};
initBookingButtons();

// ============================
// Hero Buttons
// ============================
on('click', '.hero-buttons button', e => {
  const btn = e.target.textContent;
  if (btn.includes('Check Availability')) select('#rooms')?.scrollIntoView({ behavior: 'smooth' });
  else if (btn.includes('Book Now')) select('.hero-booking')?.scrollIntoView({ behavior: 'smooth' });
}, true);

// ============================
// Directions Button
// ============================
on('click', '.btn-directions', () => {
  const coords = '-0.7872580262129477,35.33943285554462';
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords}`, '_blank');
});

// ============================
// Scroll Animations
// ============================
const initScrollAnimations = () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const elements = select('.room-card, .review-card, .gallery-item', true);
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
};
initScrollAnimations();

// ============================
// Lightbox Styles Injection
// ============================
const lightboxCSS = `
.lightbox {
  position: fixed; top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center;
  z-index:10000; cursor:pointer;
}
.lightbox-content { position:relative; max-width:90%; max-height:90%; }
.lightbox img { width:100%; height:auto; border-radius:10px; }
.lightbox .close {
  position:absolute; top:-40px; right:0; color:white; font-size:30px; cursor:pointer;
  background: rgba(0,0,0,0.5); width:40px; height:40px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
}
.lightbox .close:hover { background: rgba(0,0,0,0.8); }
@media (max-width:768px){
  .nav-links.active { display:flex; position:absolute; top:100%; left:0; width:100%; background:white; flex-direction:column; padding:1rem; box-shadow:0 5px 20px rgba(0,0,0,0.1);}
  .hamburger.active span:nth-child(1){ transform: rotate(-45deg) translate(-5px,6px);}
  .hamburger.active span:nth-child(2){ opacity:0;}
  .hamburger.active span:nth-child(3){ transform: rotate(45deg) translate(-5px,-6px);}
}
`;
const styleEl = document.createElement('style');
styleEl.textContent = lightboxCSS;
document.head.appendChild(styleEl);

// ============================
// Login Page Anime.js
// ============================
const loginCard = select('.login-card');
if (loginCard) {
  anime({
    targets: loginCard,
    opacity: [0, 1],
    translateY: [40, 0],
    easing: 'easeOutExpo',
    duration: 1200
  });

  const loginBtn = select('#loginBtn');
  const successMsg = select('#success');

  if (loginBtn && successMsg) {
    loginBtn.addEventListener('click', () => {
      anime({
        targets: loginCard,
        scale: [1, 0.96, 1],
        duration: 400,
        easing: 'easeInOutQuad'
      });

      setTimeout(() => {
        successMsg.style.display = 'block';
        anime({
          targets: successMsg,
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 600,
          easing: 'easeOutExpo'
        });
      }, 500);
    });
  }
}

