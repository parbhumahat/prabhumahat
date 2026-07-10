

document.addEventListener('DOMContentLoaded', () => {
  
  // --- APPLICATION STATE ---
  const state = {
    lang: localStorage.getItem('sunwal_lang') || 'en',
    audioUrl: 'https://uk20freenew.listen2myradio.com/live.mp3?typeportmount=ice_35826_stream',
    audio: null,
    isPlaying: false,
    isMuted: false,
    volume: parseFloat(localStorage.getItem('sunwal_volume')) || 0.8,
    savedTime: 0,
    playbackSeconds: 0,
    statsAnimated: false,
    listenerCount: Math.floor(Math.random() * (2500 - 800 + 1)) + 800
  };

  let playbackTimer = null;

  // --- INITIALIZE AUDIO ---
  function initAudio() {
    state.audio = new Audio(state.audioUrl);
    state.audio.preload = 'none';
    state.audio.volume = state.isMuted ? 0 : state.volume;

    // Synchronize sliders
    updateVolumeSliders(state.volume);

    // Audio Event Listeners for robust state tracking
    state.audio.addEventListener('waiting', () => {
      updatePlaybackStatus('connecting');
      stopPlaybackTimer();
    });

    state.audio.addEventListener('playing', () => {
      state.isPlaying = true;
      updatePlaybackStatus('connected');
      document.body.classList.add('playing');
      const vinyl = document.querySelector('.player-vinyl-wrap');
      if (vinyl) vinyl.classList.add('playing');
      updatePlayButtons(true);
      startPlaybackTimer();
    });

    state.audio.addEventListener('pause', () => {
      state.isPlaying = false;
      updatePlaybackStatus('paused');
      document.body.classList.remove('playing');
      const vinyl = document.querySelector('.player-vinyl-wrap');
      if (vinyl) vinyl.classList.remove('playing');
      updatePlayButtons(false);
      stopPlaybackTimer();
    });

    state.audio.addEventListener('error', (e) => {
      console.warn("Audio element encountered an error. Reconnecting stream...", e);
      updatePlaybackStatus('error');
      stopPlaybackTimer();
      // Attempt reconnection after a short delay
      setTimeout(() => {
        if (state.isPlaying) {
          reconnectAudio();
        }
      }, 3000);
    });
  }

  // --- PLAYBACK CONTROLS ---
  function playAudio() {
    if (!state.audio) {
      initAudio();
    }
    
    if (state.savedTime > 0) {
      try {
        state.audio.currentTime = state.savedTime;
      } catch (err) {
        // Ignore live stream currentTime errors
      }
    }

    updatePlaybackStatus('connecting');

    const playPromise = state.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          state.isPlaying = true;
          localStorage.setItem('sunwal_played_once', 'true');
        })
        .catch(error => {
          console.log("Autoplay blocked or stream connection failed:", error);
          showAutoplayOverlay();
          updatePlaybackStatus('paused');
        });
    }
  }

  function pauseAudio() {
    if (state.audio) {
      state.audio.pause();
      state.savedTime = state.audio.currentTime;
      state.isPlaying = false;
      document.body.classList.remove('playing');
      const vinyl = document.querySelector('.player-vinyl-wrap');
      if (vinyl) vinyl.classList.remove('playing');
      updatePlayButtons(false);
      updatePlaybackStatus('paused');
      stopPlaybackTimer();
    }
  }

  function togglePlay() {
    if (state.isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function reconnectAudio() {
    if (state.audio) {
      state.audio.src = '';
      state.audio.load();
      state.audio.src = state.audioUrl;
      state.audio.volume = state.isMuted ? 0 : state.volume;
      state.audio.play().catch(e => console.log("Reconnection playback blocked:", e));
    }
  }

  // --- PLAYBACK ELAPSED TIMER ---
  function startPlaybackTimer() {
    if (playbackTimer) clearInterval(playbackTimer);
    playbackTimer = setInterval(() => {
      state.playbackSeconds++;
      const minutes = Math.floor(state.playbackSeconds / 60);
      const seconds = state.playbackSeconds % 60;
      const formattedTime = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      const timerEl = document.getElementById('player-time-elapsed');
      if (timerEl) {
        timerEl.textContent = formattedTime;
      }
    }, 1000);
  }

  function stopPlaybackTimer() {
    if (playbackTimer) {
      clearInterval(playbackTimer);
      playbackTimer = null;
    }
  }

  // --- VOLUME CONTROLS ---
  function setVolume(val) {
    state.volume = val;
    localStorage.setItem('sunwal_volume', val);
    if (state.audio) {
      state.audio.volume = state.isMuted ? 0 : val;
    }
    updateVolumeSliders(val);
  }

  function toggleMute() {
    state.isMuted = !state.isMuted;
    if (state.audio) {
      state.audio.volume = state.isMuted ? 0 : state.volume;
    }
    updateMuteButtons();
  }

  // --- UI UPDATERS ---
  const mainStatusLabelEn = document.getElementById('main-status-label-en');
  const mainStatusLabelNe = document.getElementById('main-status-label-ne');
  const stickyStatusLabelEn = document.getElementById('sticky-status-label-en');
  const stickyStatusLabelNe = document.getElementById('sticky-status-label-ne');

  function updatePlaybackStatus(status) {
    const texts = {
      connecting: { en: 'Connecting...', ne: 'सम्पर्क हुँदैछ...' },
      connected: { en: 'Connected Live', ne: 'सम्पर्क भयो' },
      paused: { en: 'Paused', ne: 'रोकिएको' },
      error: { en: 'Reconnecting...', ne: 'पुनः जडान हुँदै...' }
    };

    const currentText = texts[status] || texts['paused'];

    if (mainStatusLabelEn) mainStatusLabelEn.textContent = currentText.en;
    if (mainStatusLabelNe) mainStatusLabelNe.textContent = currentText.ne;
    if (stickyStatusLabelEn) stickyStatusLabelEn.textContent = currentText.en;
    if (stickyStatusLabelNe) stickyStatusLabelNe.textContent = currentText.ne;

    // Adjust live-dot pulsing class based on state
    const dots = document.querySelectorAll('.live-dot');
    if (status === 'connected') {
      dots.forEach(dot => dot.style.backgroundColor = '#10B981'); // Vibrant active green
    } else if (status === 'connecting' || status === 'error') {
      dots.forEach(dot => dot.style.backgroundColor = '#FFD700'); // Gold
    } else {
      dots.forEach(dot => dot.style.backgroundColor = '#E30613'); // Red
    }
  }

  function updatePlayButtons(isPlaying) {
    const playBtns = document.querySelectorAll('.btn-play-toggle, .btn-sticky-play, .btn-hero-primary');
    playBtns.forEach(btn => {
      if (isPlaying) {
        btn.classList.add('playing');
        const textSpanEn = btn.querySelector('.btn-hero-text-en');
        const textSpanNe = btn.querySelector('.btn-hero-text-ne');
        if (textSpanEn) textSpanEn.textContent = 'Pause Broadcast';
        if (textSpanNe) textSpanNe.textContent = 'प्रसारण रोक्नुहोस्';
      } else {
        btn.classList.remove('playing');
        const textSpanEn = btn.querySelector('.btn-hero-text-en');
        const textSpanNe = btn.querySelector('.btn-hero-text-ne');
        if (textSpanEn) textSpanEn.textContent = 'Play Live Radio';
        if (textSpanNe) textSpanNe.textContent = 'प्रत्यक्ष रेडियो सुन्नुहोस्';
      }
    });
  }

  function updateVolumeSliders(val) {
    const sliders = document.querySelectorAll('.volume-slider');
    const progresses = document.querySelectorAll('.volume-progress');
    sliders.forEach(slider => slider.value = val);
    progresses.forEach(prog => prog.style.width = `${val * 100}%`);

    // Update percentage indicators
    const pct = Math.round(val * 100);
    const mainLabel = document.getElementById('vol-percentage-main');
    const stickyLabel = document.getElementById('vol-percentage-sticky');
    if (mainLabel) mainLabel.textContent = `${pct}%`;
    if (stickyLabel) stickyLabel.textContent = `${pct}%`;
  }

  function updateMuteButtons() {
    const muteBtns = document.querySelectorAll('.btn-mute');
    muteBtns.forEach(btn => {
      const volumeIcon = btn.querySelector('.vol-icon');
      const muteIcon = btn.querySelector('.mute-icon');
      if (state.isMuted) {
        if (volumeIcon) volumeIcon.style.display = 'none';
        if (muteIcon) muteIcon.style.display = 'block';
      } else {
        if (volumeIcon) volumeIcon.style.display = 'block';
        if (muteIcon) muteIcon.style.display = 'none';
      }
    });
    // Sync slider layouts
    updateVolumeSliders(state.isMuted ? 0 : state.volume);
  }

  // --- STICKY BOTTOM PLAYER VISIBILITY ---
  const heroSection = document.querySelector('.hero');
  const stickyPlayer = document.getElementById('sticky-player');

  window.addEventListener('scroll', () => {
    if (heroSection && stickyPlayer) {
      const heroHeight = heroSection.offsetHeight;
      const scrollPos = window.scrollY;

      // Show bottom player when user scrolls past the hero or if playing
      if (scrollPos > heroHeight - 100 || (state.isPlaying && scrollPos > 150)) {
        stickyPlayer.classList.add('show');
      } else {
        stickyPlayer.classList.remove('show');
      }
    }
  });

  // --- EVENT ATTACHMENTS (PLAYERS) ---
  const playButtons = document.querySelectorAll('.btn-play-toggle, .btn-sticky-play, .btn-hero-primary');
  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      togglePlay();
    });
  });

  const volumeSliders = document.querySelectorAll('.volume-slider');
  volumeSliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      setVolume(parseFloat(e.target.value));
    });
  });

  const muteButtons = document.querySelectorAll('.btn-mute');
  muteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleMute();
    });
  });

  // --- BILINGUAL LANGUAGE TOGGLE SYSTEM ---
  const langBtns = document.querySelectorAll('.lang-btn');
  
  function applyLanguage(lang) {
    state.lang = lang;
    localStorage.setItem('sunwal_lang', lang);

    if (lang === 'ne') {
      document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.lang-ne').forEach(el => {
        if (el.tagName === 'SPAN') {
          el.style.display = 'inline-block';
        } else if (el.tagName === 'DIV' || el.tagName === 'P' || el.tagName === 'SECTION') {
          el.style.display = 'block';
        } else {
          el.style.display = 'initial';
        }
      });
      langBtns.forEach(btn => btn.innerHTML = '🇬🇧 EN');
    } else {
      document.querySelectorAll('.lang-ne').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.lang-en').forEach(el => {
        if (el.tagName === 'SPAN') {
          el.style.display = 'inline-block';
        } else if (el.tagName === 'DIV' || el.tagName === 'P' || el.tagName === 'SECTION') {
          el.style.display = 'block';
        } else {
          el.style.display = 'initial';
        }
      });
      langBtns.forEach(btn => btn.innerHTML = '🇳🇵 नेपाली');
    }

    // Update active nav-link display if any language changes
    updateActiveNavLink();
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextLang = state.lang === 'en' ? 'ne' : 'en';
      applyLanguage(nextLang);
    });
  });

  // --- AUTOPLAY MANAGEMENT ---
  const autoplayOverlay = document.getElementById('autoplay-overlay');
  const overlayBtn = document.getElementById('overlay-start-btn');
  const overlayPulse = document.querySelector('.overlay-pulse');

  function showAutoplayOverlay() {
    if (autoplayOverlay) {
      autoplayOverlay.classList.remove('hidden');
    }
  }

  function dismissOverlayAndPlay() {
    if (autoplayOverlay) {
      autoplayOverlay.classList.add('hidden');
    }
    if (!state.audio) {
      initAudio();
    }
    playAudio();
  }

  if (overlayBtn) overlayBtn.addEventListener('click', dismissOverlayAndPlay);
  if (overlayPulse) overlayPulse.addEventListener('click', dismissOverlayAndPlay);

  // Auto-tune attempt on startup
  initAudio();
  
  setTimeout(() => {
    const playPromise = state.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          state.isPlaying = true;
          updatePlaybackStatus('connected');
          document.body.classList.add('playing');
          const vinyl = document.querySelector('.player-vinyl-wrap');
          if (vinyl) vinyl.classList.add('playing');
          updatePlayButtons(true);
          startPlaybackTimer();
        })
        .catch(err => {
          console.log("Autoplay on startup blocked by security policies. Showing prompt overlay.");
          showAutoplayOverlay();
        });
    }
  }, 1000);

  // --- SMART PROGRAM SCHEDULE SYSTEM (VANILLA JS) ---
  function updateSmartSchedule() {
    const now = new Date();
    const currentHour = now.getHours();
    let activeProgram = null;

    const rows = document.querySelectorAll('#dynamic-schedule-list .schedule-row');
    rows.forEach(row => {
      const start = parseInt(row.getAttribute('data-start'), 10);
      const end = parseInt(row.getAttribute('data-end'), 10);
      let isCurrent = false;

      if (start > end) {
        // Night Music (22 to 6)
        if (currentHour >= start || currentHour < end) {
          isCurrent = true;
        }
      } else {
        if (currentHour >= start && currentHour < end) {
          isCurrent = true;
        }
      }

      const badge = row.querySelector('.status-badge');
      if (isCurrent) {
        activeProgram = row;
        row.classList.add('live');
        if (badge) {
          badge.className = 'status-badge status-live';
          badge.innerHTML = `<span class="lang-en">ON AIR NOW</span><span class="lang-ne">अहिले प्रत्यक्ष</span>`;
        }
      } else {
        row.classList.remove('live');
        let isPast = false;
        if (start > end) {
          if (currentHour >= end && currentHour < start) {
            isPast = true;
          }
        } else {
          if (currentHour >= end) {
            isPast = true;
          }
        }

        if (badge) {
          if (isPast) {
            badge.className = 'status-badge status-done';
            badge.innerHTML = `<span class="lang-en">COMPLETED</span><span class="lang-ne">सकियो</span>`;
          } else {
            badge.className = 'status-badge status-upcoming';
            badge.innerHTML = `<span class="lang-en">UPCOMING</span><span class="lang-ne">आउँदैछ</span>`;
          }
        }
      }
    });

    // Update top player labels dynamically
    if (activeProgram) {
      const activeTitleEn = activeProgram.querySelector('.row-program .lang-en').innerText;
      const activeTitleNe = activeProgram.querySelector('.row-program .lang-ne').innerText;
      const activeHostEn = activeProgram.querySelector('.row-host .lang-en').innerText;
      const activeHostNe = activeProgram.querySelector('.row-host .lang-ne').innerText;

      // Find Next Program
      let nextProgramRow = activeProgram.nextElementSibling;
      if (!nextProgramRow) {
        nextProgramRow = document.querySelector('#dynamic-schedule-list .schedule-row:first-child');
      }

      const nextTitleEn = nextProgramRow.querySelector('.row-program .lang-en').innerText;
      const nextTitleNe = nextProgramRow.querySelector('.row-program .lang-ne').innerText;
      const nextStart = nextProgramRow.getAttribute('data-start');

      const formatHour = (h) => {
        const hr = parseInt(h, 10);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const displayHr = hr % 12 === 0 ? 12 : hr % 12;
        return `${displayHr < 10 ? '0' + displayHr : displayHr}:00 ${ampm}`;
      };

      const showNameEl = document.querySelector('.player-show-name');
      if (showNameEl) {
        showNameEl.innerHTML = `
          <span class="lang-en">${activeTitleEn} with ${activeHostEn}</span>
          <span class="lang-ne">${activeTitleNe} (${activeHostNe} सँग)</span>
        `;
      }

      const nextValEl = document.querySelectorAll('.player-secondary-info .info-block')[1].querySelector('.info-block-val');
      if (nextValEl) {
        nextValEl.innerHTML = `
          <span class="lang-en">${nextTitleEn} (${formatHour(nextStart)})</span>
          <span class="lang-ne">${nextTitleNe} (${formatHour(nextStart)})</span>
        `;
      }
    }

    applyLanguage(state.lang);
  }

  // Run immediately and then check every 10 seconds
  updateSmartSchedule();
  setInterval(updateSmartSchedule, 10000);

  // --- LIVE LISTENER COUNTER ---
  function toNepaliDigits(num) {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().replace(/[0-9]/g, (digit) => nepaliDigits[parseInt(digit, 10)]);
  }

  function updateLiveListeners() {
    // Fluctuates between 800 and 2500, with a step of ±1 to ±15
    const fluctuation = Math.floor(Math.random() * 31) - 15; // -15 to +15
    state.listenerCount = Math.min(2500, Math.max(800, state.listenerCount + fluctuation));

    const formattedEn = state.listenerCount.toLocaleString();
    const formattedNe = toNepaliDigits(formattedEn);

    const enLabel = document.getElementById('listener-count-en');
    const neLabel = document.getElementById('listener-count-ne');

    if (enLabel) enLabel.textContent = `${formattedEn} Active`;
    if (neLabel) neLabel.textContent = `${formattedNe} सक्रिय`;
  }

  updateLiveListeners();
  setInterval(updateLiveListeners, 4000);

  // --- STATS COUNTERS ANIMATION (INTERSECTION OBSERVER) ---
  const statsSection = document.querySelector('.section-stats');
  const statNumbers = document.querySelectorAll('.stat-number');

  const runCounters = () => {
    statNumbers.forEach(elem => {
      const target = parseInt(elem.getAttribute('data-target'), 10);
      const suffix = elem.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      const intervalTime = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          elem.textContent = target + suffix;
          clearInterval(timer);
        } else {
          elem.textContent = Math.floor(current) + suffix;
        }
      }, intervalTime);
    });
  };

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !state.statsAnimated) {
          state.statsAnimated = true;
          runCounters();
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }

  // --- STICKY NAVBAR BACKDROP ---
  const navbar = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // --- SCROLL PROGRESS & BACK TO TOP ---
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      if (scrollProgressBar) {
        scrollProgressBar.style.width = `${progress}%`;
      }
    }

    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- SCROLL REVEAL (INTERSECTION OBSERVER) ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));

  // --- RESPONSIVE MOBILE MENU ---
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu-list');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const openIcon = hamburger.querySelector('.menu-open');
      const closeIcon = hamburger.querySelector('.menu-close');
      if (navMenu.classList.contains('active')) {
        openIcon.style.display = 'none';
        closeIcon.style.display = 'block';
      } else {
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const openIcon = hamburger.querySelector('.menu-open');
        const closeIcon = hamburger.querySelector('.menu-close');
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    });
  });

  // --- CONTACT FORM SUBMISSION & TOAST NOTIFICATION ---
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        alert(state.lang === 'en' ? 'Please fill out all fields.' : 'कृपया सबै क्षेत्रहरू भर्नुहोस्।');
        return;
      }

      const btn = contactForm.querySelector('.btn-submit');
      const originalTextEn = btn.querySelector('.lang-en').textContent;
      const originalTextNe = btn.querySelector('.lang-ne').textContent;

      btn.disabled = true;
      btn.querySelector('.lang-en').textContent = 'Sending...';
      btn.querySelector('.lang-ne').textContent = 'पठाउँदै...';

      setTimeout(() => {
        contactForm.reset();
        btn.disabled = false;
        btn.querySelector('.lang-en').textContent = originalTextEn;
        btn.querySelector('.lang-ne').textContent = originalTextNe;

        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 4000);
        }
      }, 1500);
    });
  }

  // --- ACTIVE NAVBAR LINK HIGHLIGHT ON SCROLL ---
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');
    let scrollPosition = window.scrollY + 200;

    sections.forEach(sec => {
      const id = sec.getAttribute('id');
      if (id) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveNavLink);

  // --- INITIALIZE THE TRANSLATION SYSTEM (APPLY SAVED LANG) ---
  applyLanguage(state.lang);

  // --- LOADING SCREEN DISMISSAL ---
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
    }
  }, 1000);

});
