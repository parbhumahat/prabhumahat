/**
 * ================================================================
 * PARBHU MAHAT CHHETRY - PREMIUM PORTFOLIO INTERACTIVE SCRIPT
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Custom Cursor & Glow Follower ---
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  const mouseGlow = document.querySelector('.mouse-glow-bg');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update simple cursor and glow background
    if (cursor) {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    }
    if (mouseGlow) {
      mouseGlow.style.left = `${mouseX}px`;
      mouseGlow.style.top = `${mouseY}px`;
    }
  });
  
  // Follower smooth lag effect using requestAnimationFrame
  function updateFollower() {
    // Linear interpolation for smooth delay
    const ease = 0.12; 
    followerX += (mouseX - followerX) * ease;
    followerY += (mouseY - followerY) * ease;
    
    if (follower) {
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
    }
    
    requestAnimationFrame(updateFollower);
  }
  updateFollower();
  
  // Cursor hover interactions on buttons and links
  const interactives = document.querySelectorAll('a, button, .filter-btn, .photo-item, .portfolio-card, input, textarea');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // --- 2. Simulated Preloader with Progress Percentage ---
  const preloader = document.getElementById('preloader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-percentage');
  
  let progress = 0;
  const totalLoadTime = 1200; // milliseconds
  const intervalTime = 30;
  const step = 100 / (totalLoadTime / intervalTime);
  
  const progressInterval = setInterval(() => {
    progress += step;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      
      // Smoothly hide loader
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
          // Start page entrance transitions
          triggerHeroEntrance();
        }
      }, 300);
    }
    
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loaderText) loaderText.textContent = `${Math.round(progress)}%`;
  }, intervalTime);

  // --- 3. Hero Section Cinematic Entrance ---
  function triggerHeroEntrance() {
    const heroElements = document.querySelectorAll('.hero .reveal');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('active');
      }, index * 150); // Stagger element entrances
    });
  }

  // --- 4. Typing Effect Animation ---
  const typedSpan = document.getElementById('typed-text');
  const occupations = [
    "Full Stack Web Developer",
    "Creative Photographer",
    "Technology Expert",
    "Managing Director - Radio Sunwal"
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  
  function typeEffect() {
    const currentWord = occupations[wordIndex];
    
    if (isDeleting) {
      typedSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 40; // Erasing is faster
    } else {
      typedSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 120; // Typing speed
    }
    
    // Switch state when limits reached
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingDelay = 2200; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % occupations.length;
      typingDelay = 500; // Pause before typing next word
    }
    
    setTimeout(typeEffect, typingDelay);
  }
  
  if (typedSpan) {
    // Start typing cycle
    setTimeout(typeEffect, 1500);
  }

  // --- 5. Hero Background Canvas Particle System ---
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 110;
    
    // Resize handler
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce on borders
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.fill();
      }
    }
    
    // Init particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
    
    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();
        
        // Draw lines between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 77, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
  }

  // --- 6. Scroll Tracking: Header, Progress & Back-To-Top ---
  const header = document.querySelector('.header');
  const scrollBar = document.querySelector('.scroll-progress-bar');
  const backToTop = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Header scrolled background blur toggle
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    // Scroll progress bar width calculation
    if (scrollBar && docHeight > 0) {
      const scrolledPct = (scrollTop / docHeight) * 100;
      scrollBar.style.width = `${scrolledPct}%`;
    }
    
    // Back to top floating button visibility
    if (backToTop) {
      if (scrollTop > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });
  
  // Back to top click behavior
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 7. Intersection Observer for Scroll reveals ---
  const revealElements = document.querySelectorAll('section .reveal, .timeline-item, .about-grid .reveal, .contact-grid .reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to keep transition in place after firing once
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12, // triggers when 12% of element is in view
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // --- 8. Navigation Highlight & Smooth Scroll ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35, // Trigger when 35% of section is visible
  });
  
  sections.forEach(sec => navObserver.observe(sec));

  // Hamburger Menu navigation drawer toggle for Mobile
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close mobile drawer on clicking any option
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- 9. Skills Animated Progress Bars ---
  const skillSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const targetPct = bar.getAttribute('data-pct');
          bar.style.width = `${targetPct}%`;
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  if (skillSection) {
    skillObserver.observe(skillSection);
  }

  // --- 10. Stat Counter Animation ---
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          animateCounter(stat, target);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
  
  function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // Counter total duration in ms
    const increment = target / (duration / 16); // ~60fps step
    
    function updateCount() {
      current += increment;
      if (current >= target) {
        element.childNodes[0].nodeValue = target; // Update numeric node only
      } else {
        element.childNodes[0].nodeValue = Math.floor(current);
        requestAnimationFrame(updateCount);
      }
    }
    updateCount();
  }

  // --- 11. Portfolio Classification (Category Filtration) ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage active filter class styling
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Hide card animations
        card.style.opacity = '0';
        card.style.transform = 'scale(0.85) translateY(20px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            
            // Trigger layout entrance transition
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // --- 12. Photography Filter & Gallery Lightbox Modal ---
  const photoFilterBtns = document.querySelectorAll('.photography-filters .filter-btn');
  const photoItems = document.querySelectorAll('.photo-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  // Photography Filter logic
  photoFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      photoFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      photoItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        item.style.opacity = '0';
        item.style.transform = 'scale(0.85)';
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        }, 300);
      });
    });
  });
  
  // Lightbox overlay trigger logic
  photoItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.photo-img');
      const title = item.querySelector('.photo-title').textContent;
      const category = item.querySelector('.photo-category').textContent;
      
      if (lightbox && lightboxImg && lightboxCaption) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${title} (${category})`;
        lightbox.classList.add('active');
        
        // Disable page scroll when lightbox is up
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close lightbox
  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', closeLightboxModal);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightboxModal();
      }
    });
  }
  
  function closeLightboxModal() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // --- 13. Interactive 3D Perspective Hover Effect ---
  // Pure JS calculations mapping card coordinate space to transform rotation
  const tiltCards = document.querySelectorAll('.portfolio-card, .service-card, .about-highlight-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside the card
      const y = e.clientY - rect.top;  // y coordinate inside the card
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation offset (max 8 degrees tilt)
      const rotateX = ((centerY - y) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // --- 14. Interactive Contact Form Submission & Glass Overlay ---
  const contactForm = document.getElementById('contact-form');
  const statusOverlay = document.getElementById('form-status-overlay');
  
  if (contactForm && statusOverlay) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Select input values
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;
      
      // Standard form field validation check
      if (!name || !email || !subject || !message) return;
      
      // Trigger glowing glass feedback success modal
      statusOverlay.classList.add('active');
      
      // Reset input fields
      contactForm.reset();
      
      // Auto close feedback overlay after 4 seconds
      setTimeout(() => {
        statusOverlay.classList.remove('active');
      }, 4000);
    });
  }
});
