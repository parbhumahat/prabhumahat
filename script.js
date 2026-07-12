
document.addEventListener('DOMContentLoaded', () => {

   const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Detect or retrieve preferred theme
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Check operating system/browser preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const currentTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }


  const menuToggleBtn = document.getElementById('menu-toggle');
  const menuCloseBtn = document.getElementById('menu-close');
  const mobileMenuOverlay = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (!mobileMenuOverlay) return;
    mobileMenuOverlay.classList.add('open');
    mobileMenuOverlay.setAttribute('aria-hidden', 'false');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    // Stop background body scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileMenuOverlay) return;
    mobileMenuOverlay.classList.remove('open');
    mobileMenuOverlay.setAttribute('aria-hidden', 'true');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    // Restore normal scrolling
    document.body.style.overflow = '';
  };

  if (menuToggleBtn && menuCloseBtn) {
    menuToggleBtn.addEventListener('click', openMobileMenu);
    menuCloseBtn.addEventListener('click', closeMobileMenu);
  }

  // Close drawer if clicking on the blurred overlay backdrop directly
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });
  }

  // Close drawer immediately when a navigation link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });


  const siteHeader = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  const onWindowScroll = () => {
    const scrollY = window.scrollY;

    // Sticky header layout adjustment
    if (siteHeader) {
      if (scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        // Prevent removing scrolled class on individual legal static subpages
        const isIndexPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
        if (isIndexPage) {
          siteHeader.classList.remove('scrolled');
        }
      }
    }

    // Scroll-to-top button threshold
    if (scrollTopBtn) {
      if (scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', onWindowScroll, { passive: true });
  onWindowScroll(); // Initial invocation on load

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  const tabButtons = document.querySelectorAll('.about-tab-btn');
  const tabPanels = document.querySelectorAll('.about-tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Deactivate all buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      // Hide all panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });

      // Activate current selection
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      
      const targetPanelId = `tab-${button.getAttribute('data-tab')}`;
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });


  // ==========================================================================
  // 5. SERVICE QUICK-CONVERT PREFILL LINKER
  // ==========================================================================
  const serviceActionBtns = document.querySelectorAll('.service-action-btn');
  const contactSubjectInput = document.getElementById('form-subject');

  serviceActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      
      if (contactSubjectInput) {
        contactSubjectInput.value = `Inquiry Regarding: ${serviceName}`;
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Focus the first form input for smooth conversion
        const nameInput = document.getElementById('form-name');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 800);
        }
      }
    });
  });


  // ==========================================================================
  // 6. PORTFOLIO GRID FILTER SYSTEM
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.classList.remove('fade-out');
          card.classList.add('fade-in');
        } else {
          card.classList.remove('fade-in');
          card.classList.add('fade-out');
        }
      });
    });
  });


  // ==========================================================================
  // 7. COLLAPSIBLE PROJECT ACCORDION DRAWERS
  // ==========================================================================
  const projectExpandBtns = document.querySelectorAll('.project-expand-btn');

  projectExpandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const detailContainer = btn.nextElementSibling;
      
      if (!detailContainer) return;

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        detailContainer.style.maxHeight = '0px';
        detailContainer.setAttribute('aria-hidden', 'true');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        // Let's set height dynamically according to real scroll heights
        detailContainer.style.maxHeight = `${detailContainer.scrollHeight}px`;
        detailContainer.setAttribute('aria-hidden', 'false');
      }
    });
  });


  // ==========================================================================
  // 8. RICH BLOG ARTICLES DATABASE & HIGH-ACCESSIBILITY READER OVERLAY
  // ==========================================================================
  const blogArticles = {
    trends: {
      title: "Optimizing Web Performance: The Shift Back to Semantic Vanilla Architectures",
      meta: "July 10, 2026 • 6 Min Read • Category: Web Standards",
      content: `
        <div class="article-content">
          <p>The modern web development landscape is undergoing a critical transition. For years, the community prioritized loading massive frontend frameworks and client-side package bundles directly onto the browser. However, this architectural design increased page latency, decreased performance on restricted cellular networks, and reduced conversion metrics.</p>
          
          <h3>The Pivot Back to Lightweight Semantics</h3>
          <p>Today, web standard compliance systems and professional developers are pivoting back to writing optimized, semantic markup. Modern browser native APIs can handle micro-interactions, responsive calculations, grid layouts, and visual transitions without any external dependency bloat.</p>
          
          <h3>Why Heavy Frameworks Hurt Small Businesses</h3>
          <p>When a customer loads a website via a 3G or 4G data packet, every kilobyte matters. Loading multiple megabytes of JavaScript libraries blocks page rendering, resulting in a blank screen during critical initial seconds. By using clean HTML5 templates and modular vanilla scripts, we deliver instantaneous visual feedback, guaranteeing lower exit rates.</p>
          
          <h3>Key Practical Advantages of Semantic Web Architecture:</h3>
          <ul>
            <li><strong>Reduced Server Latency:</strong> Clean files are parsed and drawn by browser rendering engines immediately.</li>
            <li><strong>Organic SEO Optimization:</strong> Search engine crawler bots index structured markup headers and accessibility tags with far higher readability.</li>
            <li><strong>AdSense Compatibility:</strong> Clear, readable textual structures allow advertisement engines to crawl and approve contexts instantly.</li>
            <li><strong>Lower Maintenance Overhead:</strong> Avoiding external package dependencies means no broken continuous deployment builds or continuous security patch cycles.</li>
          </ul>
          
          <p>Moving forward, the mark of true craftsmanship in web engineering will not be how many packages are installed, but how much value can be created using elegant, streamlined code.</p>
        </div>
      `
    },
    responsive: {
      title: "The Absolute Importance of Responsive Website Design in 2026",
      meta: "June 25, 2026 • 5 Min Read • Category: Responsive Layout",
      content: `
        <div class="article-content">
          <p>We live in a multi-screen ecosystem. In the early days of corporate sites, developers assumed all users sat behind high-definition desktop monitors. Today, over 60% of all global search traffic originates from mobile devices of varying proportions, ranging from narrow 320px screens up to large tablets and TV displays.</p>
          
          <h3>Understanding Mobile-First Search Indexing</h3>
          <p>Search engines such as Google rank websites primarily based on how they display and function on handheld mobile devices. If your navigation menu breaks, your images overflow, or text size forces users to manually zoom in, your organic positioning will drop automatically, regardless of how authoritative your content might be.</p>
          
          <h3>Crafting Natural Scaling Grids</h3>
          <p>Responsive design is not simply about applying a CSS media rule at the end of development. It requires thinking about fluid typography, using relative sizing, setting maximum wrapper widths, and testing mobile touch zones (requiring interactive targets to be at least 44px for safe input activation).</p>
          
          <h3>Ensuring Uniform Performance Profiles:</h3>
          <ul>
            <li><strong>Responsive Grid Alignments:</strong> Content blocks must stack naturally without pushing other containers off the layout boundary.</li>
            <li><strong>Flexible Navigation Layouts:</strong> Utilizing tidy drawer systems that open on demand, preventing menus from cluttering active text blocks.</li>
            <li><strong>Image Compression Systems:</strong> Serving small dimensions to mobile clients to avoid downloading high-resolution media unnecessarily.</li>
          </ul>
          
          <p>Providing an adaptive layout guarantees your corporate message remains legible and accessible to all potential consumers, on every device, everywhere.</p>
        </div>
      `
    },
    journey: {
      title: "My Career Journey as a Full Stack Web Developer",
      meta: "May 14, 2026 • 8 Min Read • Category: Developer Career",
      content: `
        <div class="article-content">
          <p>Entering the field of software engineering requires dedicated discipline and constant learning. My professional path as a full stack developer began with a clear mission: mastering the entire software lifecycle to build secure, robust applications from end-to-end.</p>
          
          <h3>Mastering the Fundamentals of Client Design</h3>
          <p>I dedicated my early years to learning the core elements of the browser: HTML for semantic layout structure, CSS for clean responsive grids and typography alignment, and JavaScript for structural client processing. Over time, I understood that high-performance frontends must be supported by responsive servers.</p>
          
          <h3>The Transition into Backend Engineering</h3>
          <p>To support dynamic operations like user logins, private messaging, and scheduling databases, I expanded into server engineering. I focused heavily on configuring Node.js runtimes, building structured routing networks with Express, and securing data transactions against standard injection threats.</p>
          
          <h3>Architecting Scalable Relational Schemas</h3>
          <p>Data integrity is the foundation of any application. I learned to structure relational databases, write precise SQL indexing queries, configure persistent storage schemas, and manage transaction operations to prevent performance bottlenecks as client databases grow.</p>
          
          <p>Being a full-stack developer is not simply about using multiple tools; it is about building clean systems where frontend visual elements and backend data models connect together seamlessly.</p>
        </div>
      `
    },
    business: {
      title: "How Specialized Technology Helps Modern Businesses Grow",
      meta: "April 02, 2026 • 7 Min Read • Category: Business Strategy",
      content: `
        <div class="article-content">
          <p>Many corporations view a website simply as a digital business card. However, when integrated correctly with customized business logic, modern web technology becomes a powerful driver of growth, efficiency, and long-term customer value.</p>
          
          <h3>Automating Legacy Administrative Operations</h3>
          <p>Many businesses waste hundreds of hours manually scheduling appointments, writing client reminder emails, or copying lead data between spreadsheets. A custom web application can automate these administrative tasks, allowing teams to focus on core operations.</p>
          
          <h3>Securing High Search Engine Visibility</h3>
          <p>An optimized online platform is key to organic customer acquisition. By prioritizing page speeds, structuring clear schema tags, and providing accessible content, businesses can rank higher for valuable local search terms without relying solely on expensive paid advertisements.</p>
          
          <h3>The Direct Financial Return of Performance Tuning:</h3>
          <ul>
            <li><strong>Fewer Abandoned Visits:</strong> Every fraction of a second saved in page loading speed reduces visitor bounce rates.</li>
            <li><strong>Increased Client Trust:</strong> Secure HTTPS interfaces and proper legal disclaimers demonstrate professional credibility.</li>
            <li><strong>Higher Conversion Ratios:</strong> Intuitive navigation pathways guide visitors to key conversion targets quickly and naturally.</li>
          </ul>
          
          <p>Investing in custom, high-quality web solutions is a strategic decision that drives efficiency, visibility, and measurable growth for years to come.</p>
        </div>
      `
    }
  };

  const articleModal = document.getElementById('article-modal');
  const articleModalContent = document.getElementById('article-modal-content');
  const blogReadBtns = document.querySelectorAll('.blog-read-btn');
  const modalCloseBtn = articleModal ? articleModal.querySelector('.modal-close-btn') : null;
  const modalOverlay = articleModal ? articleModal.querySelector('.modal-overlay') : null;

  // Accessibility Controls
  const fontDecreaseBtn = document.getElementById('modal-font-decrease');
  const fontIncreaseBtn = document.getElementById('modal-font-increase');
  const modalThemeToggleBtn = document.getElementById('modal-theme-toggle');

  let modalFontSize = 1; // 1rem or standard size factor

  const openModal = (articleKey) => {
    const data = blogArticles[articleKey];
    if (!data || !articleModal || !articleModalContent) return;

    articleModalContent.innerHTML = `
      <div class="article-full" style="font-size: ${modalFontSize}rem;">
        <h2>${data.title}</h2>
        <div class="modal-meta">${data.meta}</div>
        <div class="title-bar" style="margin: 1rem 0 2rem 0; width: 45px;"></div>
        ${data.content}
      </div>
    `;

    articleModal.classList.add('open');
    articleModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!articleModal) return;
    articleModal.classList.remove('open');
    articleModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  blogReadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-article');
      openModal(key);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // Escape key listener for the modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && articleModal && articleModal.classList.contains('open')) {
      closeModal();
    }
  });

  // Modal accessibility modifiers
  if (fontIncreaseBtn && fontDecreaseBtn) {
    fontIncreaseBtn.addEventListener('click', () => {
      if (modalFontSize < 1.3) {
        modalFontSize += 0.1;
        const container = articleModalContent.querySelector('.article-full');
        if (container) container.style.fontSize = `${modalFontSize}rem`;
      }
    });

    fontDecreaseBtn.addEventListener('click', () => {
      if (modalFontSize > 0.8) {
        modalFontSize -= 0.1;
        const container = articleModalContent.querySelector('.article-full');
        if (container) container.style.fontSize = `${modalFontSize}rem`;
      }
    });
  }

  // Modal local theme toggle
  if (modalThemeToggleBtn) {
    modalThemeToggleBtn.addEventListener('click', () => {
      const modalContainer = articleModal.querySelector('.modal-container');
      if (modalContainer) {
        const isReaderLight = modalContainer.style.backgroundColor === 'rgb(255, 255, 255)';
        if (isReaderLight) {
          modalContainer.style.backgroundColor = '';
          modalContainer.style.color = '';
        } else {
          modalContainer.style.backgroundColor = '#ffffff';
          modalContainer.style.color = '#0f172a';
          const articleTitle = modalContainer.querySelector('h2');
          if (articleTitle) articleTitle.style.color = '#0f172a';
        }
      }
    });
  }


  // ==========================================================================
  // 9. CONTACT PORTAL (VALIDATION & MATH CAPTCHA ENGINE)
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const captchaProblemSpan = document.getElementById('captcha-math-problem');
  const captchaInput = document.getElementById('form-captcha');
  const formSuccessBox = document.getElementById('form-success-box');
  const userEmailDisplay = document.getElementById('user-email-display');
  const formResetBtn = document.getElementById('form-reset-btn');

  let num1 = 0;
  let num2 = 0;
  let answer = 0;

  const generateCaptcha = () => {
    if (!captchaProblemSpan) return;
    num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    num2 = Math.floor(Math.random() * 8) + 1; // 1 to 8
    answer = num1 + num2;
    captchaProblemSpan.textContent = `${num1} + ${num2}`;
    if (captchaInput) captchaInput.value = '';
  };

  generateCaptcha();

  const validateField = (input) => {
    const group = input.closest('.form-group');
    if (!group) return true;

    let isValid = true;

    if (input.required && !input.value.trim()) {
      isValid = false;
    } else if (input.type === 'email') {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!pattern.test(input.value.trim())) {
        isValid = false;
      }
    } else if (input.id === 'form-captcha') {
      if (parseInt(input.value.trim(), 10) !== answer) {
        isValid = false;
      }
    }

    if (!isValid) {
      group.classList.add('invalid');
    } else {
      group.classList.remove('invalid');
    }

    return isValid;
  };

  if (contactForm) {
    const fields = contactForm.querySelectorAll('input, textarea');

    fields.forEach(field => {
      field.addEventListener('focusout', () => validateField(field));
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group && group.classList.contains('invalid')) {
          validateField(field);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isFormValid = true;

      fields.forEach(field => {
        if (!validateField(field)) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        const email = document.getElementById('form-email').value.trim();
        contactForm.style.display = 'none';
        if (userEmailDisplay) userEmailDisplay.textContent = email;
        if (formSuccessBox) formSuccessBox.style.display = 'block';

        const formArea = document.getElementById('form-container');
        if (formArea) {
          formArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        const captchaGroup = captchaInput.closest('.form-group');
        if (captchaGroup && captchaGroup.classList.contains('invalid')) {
          generateCaptcha();
        }
      }
    });
  }

  if (formResetBtn) {
    formResetBtn.addEventListener('click', () => {
      if (contactForm) {
        contactForm.reset();
        contactForm.style.display = 'block';
      }
      if (formSuccessBox) formSuccessBox.style.display = 'none';
      generateCaptcha();
    });
  }


  // ==========================================================================
  // 10. ACTIVE NAVIGATION OBSERVER (Scroll Spy)
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -55% 0px',
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const spyObserver = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(sec => spyObserver.observe(sec));

});





// ===============================
// EmailJS Initialize
// ===============================
emailjs.init({
    publicKey: "B4rL9QddFRMW2_r9t",
});

// ===============================
// Elements
// ===============================
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const successBox = document.getElementById("form-success-box");
const emailDisplay = document.getElementById("user-email-display");
const resetBtn = document.getElementById("form-reset-btn");

// ===============================
// Submit Form
// ===============================
contactForm.addEventListener("submit", function (e) {

    e.preventDefault();

    // Browser validation
    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    const name = document.getElementById("form-name").value.trim();
    const email = document.getElementById("form-email").value.trim();
    const subject = document.getElementById("form-subject").value.trim();
    const message = document.getElementById("form-message").value.trim();
    const captcha = document.getElementById("form-captcha").value.trim();

    // Captcha
    if (captcha !== "9") {
        document.getElementById("form-captcha").value = "";
        document.getElementById("form-captcha").focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    emailjs.send(
        "service_uc9f26b",
        "template_fmq34f4",
        {
            name: name,
            email: email,
            subject: subject,
            message: message
        }
    )

    .then(function () {

        emailDisplay.textContent = email;

        contactForm.style.display = "none";
        successBox.style.display = "flex";

        contactForm.reset();

        submitBtn.disabled = false;
        submitBtn.textContent = "Send Secure Message";

    })

    .catch(function (error) {

        console.error(error);

        submitBtn.disabled = false;
        submitBtn.textContent = "Send Secure Message";

    });

});

// ===============================
// Reset Form
// ===============================
if (resetBtn) {

    resetBtn.addEventListener("click", function () {

        contactForm.reset();

        successBox.style.display = "none";
        contactForm.style.display = "block";

    });

}
