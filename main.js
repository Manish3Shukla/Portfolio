// Mobile nav toggle
const navToggleButton = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggleButton && navList) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Smooth scroll for internal links
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target instanceof HTMLAnchorElement && target.getAttribute('href')?.startsWith('#')) {
    const id = target.getAttribute('href');
    if (id && id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navList?.classList.contains('open')) {
          navList.classList.remove('open');
          navToggleButton?.setAttribute('aria-expanded', 'false');
        }
      }
    }
  }
});

// IntersectionObserver to reveal elements
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach((el) => revealObserver.observe(el));

// Animate skill bars when visible
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const skill = entry.target;
      const level = Number(skill.getAttribute('data-level') || '0');
      const bar = skill.querySelector('.skill-bar span');
      if (bar) {
        requestAnimationFrame(() => {
          bar.style.width = Math.max(0, Math.min(100, level)) + '%';
        });
      }
      skillObserver.unobserve(skill);
    }
  });
}, { threshold: 0.35 });

document.querySelectorAll('.skill').forEach((el) => skillObserver.observe(el));

// Animated counters in hero
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const stat = entry.target;
    const targetValue = Number(stat.getAttribute('data-count') || '0');
    const valueEl = stat.querySelector('.stat-value');
    if (!valueEl) return;
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (targetValue - start) * eased);
      valueEl.textContent = String(value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    statObserver.unobserve(stat);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach((el) => statObserver.observe(el));
/*
// Contact form handling with SendGrid API
const contactForm = document.querySelector('.contact-form');
const statusEl = document.querySelector('.form-status');

// SendGrid configuration - Replace with your actual API key
const SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY_HERE';
const SENDGRID_ENDPOINT = 'https://api.sendgrid.com/v3/mail/send';

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    
    if (!name || !email || !message) {
      if (statusEl) statusEl.textContent = 'Please fill out all fields.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (statusEl) statusEl.textContent = 'Please enter a valid email address.';
      return;
    }
    
    try {
      if (statusEl) statusEl.textContent = 'Sending…';
      
      // Prepare SendGrid email data
      const emailData = {
        personalizations: [{
          to: [{ email: 'manishshukla7395@gmail.com', name: 'Manish Shukla' }],
          subject: `Portfolio Contact: ${name}`
        }],
        from: { email: 'noreply@yourdomain.com', name: 'Portfolio Contact Form' },
        reply_to: { email: email, name: name },
        content: [{
          type: 'text/plain',
          value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        }]
      };
      
      // Send email via SendGrid API
      const response = await fetch(SENDGRID_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        if (statusEl) statusEl.textContent = 'Thanks! Your message has been sent.';
        form.reset();
      } else {
        const errorData = await response.json();
        console.error('SendGrid error:', errorData);
        if (statusEl) statusEl.textContent = 'Failed to send message. Please try again.';
      }
    } catch (err) {
      console.error('Contact form error:', err);
      if (statusEl) statusEl.textContent = 'Something went wrong. Please try again later.';
    }
  });
}
*/
// Dynamic year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// Theme toggle with persistence
const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const applyTheme = (mode) => {
  if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeToggle?.setAttribute('aria-pressed', 'true');
  } else {
    root.removeAttribute('data-theme');
    themeToggle?.setAttribute('aria-pressed', 'false');
  }
};
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
themeToggle?.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

// Cursor follower and mouse-tracked gradient center
const cursorDot = document.querySelector('.cursor-dot');
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let rafId;
const updatePointerVars = () => {
  root.style.setProperty('--pointer-x', pointerX + 'px');
  root.style.setProperty('--pointer-y', pointerY + 'px');
  const gx = (pointerX / window.innerWidth) * 100;
  const gy = (pointerY / window.innerHeight) * 100;
  root.style.setProperty('--grad-x', gx + '%');
  root.style.setProperty('--grad-y', gy + '%');
};
const startPointerLoop = () => {
  const loop = () => {
    if (cursorDot) {
      cursorDot.style.left = pointerX + 'px';
      cursorDot.style.top = pointerY + 'px';
    }
    updatePointerVars();
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
};
const stopPointerLoop = () => { if (rafId) cancelAnimationFrame(rafId); };

const isHoverCapable = matchMedia('(hover: hover)').matches;
if (isHoverCapable) startPointerLoop();

window.addEventListener('mousemove', (e) => {
  if (!isHoverCapable) return;
  pointerX = e.clientX;
  pointerY = e.clientY;
  cursorDot?.classList.add('active');
  clearTimeout((cursorDot)._hideT);
  (cursorDot)._hideT = setTimeout(() => cursorDot?.classList.remove('active'), 120);
});
window.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  if (!t) return;
  pointerX = t.clientX;
  pointerY = t.clientY;
});

// Scroll-driven gradient blending
const onScroll = () => {
  const doc = document.documentElement;
  const total = doc.scrollHeight - doc.clientHeight;
  const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
  root.style.setProperty('--scroll-progress', String(progress));
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();



