document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     HEADER SCROLL EFFECT & ACTIVE STATE
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
    
    // Active link highlighting on scroll
    let current = '';
    const sections = document.querySelectorAll('section, header, main');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once initially

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('is-active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      }
    });
  }

  /* ==========================================================================
     SCROLL REVEAL (INTERSECTION OBSERVER) & STAGGER SETUP
     ========================================================================== */
  // Apply index variables to reveal groups for CSS animations delay
  document.querySelectorAll('.reveal-group').forEach(group => {
    Array.from(group.children).forEach((child, index) => {
      child.style.setProperty('--i', index);
    });
  });

  const revealOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // If this section contains stat counters, run them
        const counters = entry.target.querySelectorAll('.stat-num');
        if (counters.length > 0) {
          counters.forEach(counter => {
            if (!counter.classList.contains('animated')) {
              counter.classList.add('animated');
              const target = parseInt(counter.getAttribute('data-target'), 10);
              animateCountUp(counter, target);
            }
          });
        }
        
        revealObserver.unobserve(entry.target); // Animate once
      }
    });
  }, revealOptions);

  document.querySelectorAll('.reveal').forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     STATISTICS COUNT-UP ANIMATION
     ========================================================================== */
  function animateCountUp(el, target, duration = 1600) {
    const start = performance.now();
    
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      
      // cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const val = Math.round(eased * target);
      if (target === 92) {
        el.textContent = val + '%';
      } else if (target === 12) {
        el.textContent = val + '+';
      } else {
        el.textContent = val;
      }
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        if (target === 92) el.textContent = '92%';
        else if (target === 12) el.textContent = '12+';
        else el.textContent = target;
      }
    }
    
    requestAnimationFrame(tick);
  }

  /* ==========================================================================
     NEWSLETTER FORM SUBMISSION
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success');

  if (newsletterForm && newsletterSuccess) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      
      // Save newsletter submission to localStorage
      let newsletters = JSON.parse(localStorage.getItem('newsletters_licao_de_casa')) || [];
      newsletters.push({ email: email, data: new Date().toISOString() });
      localStorage.setItem('newsletters_licao_de_casa', JSON.stringify(newsletters));

      // Show success feedback
      newsletterForm.reset();
      newsletterSuccess.style.display = 'block';
      setTimeout(() => {
        newsletterSuccess.style.display = 'none';
      }, 5000);
    });
  }

  /* ==========================================================================
     ANALYTICS LOGS FOR LINKS
     ========================================================================== */
  // WhatsApp tracking
  const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log(`[Analytics] Clique no link do WhatsApp. Direcionando para tirar dúvidas do preparatório.`);
    });
  });

  // Hotmart checkout tracking
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      console.log(`[Analytics] Clique no botão de compra. Redirecionando para o checkout Hotmart.`);
    });
  }

  /* ==========================================================================
     APPROVED MARQUEE ACTIVE CENTER EFFECT
     ========================================================================== */
  const marquee = document.querySelector('.logo-marquee');
  const marqueeItems = document.querySelectorAll('.logo-marquee__item--img');
  
  if (marquee && marqueeItems.length > 0) {
    let animationFrameId;
    let isVisible = false;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          checkCenter();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.1 });
    
    function checkCenter() {
      if (!isVisible) return;
      
      const marqueeRect = marquee.getBoundingClientRect();
      const marqueeCenter = marqueeRect.left + marqueeRect.width / 2;
      
      marqueeItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(itemCenter - marqueeCenter);
        
        // If the item center is close to the marquee center (width of card is 180px + gap)
        if (distance < 110) {
          item.classList.add('in-center');
        } else {
          item.classList.remove('in-center');
        }
      });
      
      animationFrameId = requestAnimationFrame(checkCenter);
    }
    
    observer.observe(marquee);
  }

  /* ==========================================================================
     CUSTOM VIDEO PLAYER CONTROLS & QUALITY SWITCHER
     ========================================================================== */
  const video = document.getElementById('testimonial-video');
  const player = document.getElementById('video-player-container');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playCenterBtn = document.getElementById('play-center-btn');
  const iconPlay = document.querySelector('.icon-play');
  const iconPause = document.querySelector('.icon-pause');
  const progressContainer = document.getElementById('progress-container');
  const progressJuice = document.getElementById('progress-juice');
  const progressScrubber = document.getElementById('progress-scrubber');
  const muteBtn = document.getElementById('mute-btn');
  const iconVolumeUp = document.querySelector('.icon-volume-up');
  const iconVolumeMute = document.querySelector('.icon-volume-mute');
  const volumeSlider = document.getElementById('volume-slider');
  const timeDisplay = document.getElementById('time-display');
  const settingsBtn = document.getElementById('settings-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  
  const settingsMenu = document.getElementById('settings-menu');
  const menuQualityTrigger = document.getElementById('menu-item-quality-trigger');
  const currentQualityLabel = document.getElementById('current-quality-label');
  
  const qualityMenu = document.getElementById('quality-menu');
  const qualityMenuBack = document.getElementById('quality-menu-back');
  const qualityOptions = document.querySelectorAll('.quality-option-item');
  
  const videoLoader = document.getElementById('video-loader');
  const videoToast = document.getElementById('video-toast');

  if (video && player) {
    // Tocar/Pausar
    const togglePlay = () => {
      if (video.paused) {
        video.play().catch(err => console.log(err));
        player.classList.add('playing');
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      } else {
        video.pause();
        player.classList.remove('playing');
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
      closeMenus();
    };

    video.addEventListener('click', togglePlay);
    playPauseBtn.addEventListener('click', togglePlay);
    playCenterBtn.addEventListener('click', togglePlay);

    video.addEventListener('play', () => {
      player.classList.add('playing');
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
    });
    video.addEventListener('pause', () => {
      player.classList.remove('playing');
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    });

    // Barra de progresso e Tempo
    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    video.addEventListener('timeupdate', () => {
      const percentage = (video.currentTime / video.duration) * 100;
      progressJuice.style.width = `${percentage}%`;
      progressScrubber.style.left = `${percentage}%`;
      timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 0)}`;
    });

    // Scrubbing
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    });

    // Controle de volume
    const updateVolume = () => {
      video.volume = volumeSlider.value;
      video.muted = (video.volume === 0);
      if (video.muted) {
        iconVolumeUp.style.display = 'none';
        iconVolumeMute.style.display = 'block';
      } else {
        iconVolumeUp.style.display = 'block';
        iconVolumeMute.style.display = 'none';
      }
    };

    volumeSlider.addEventListener('input', updateVolume);

    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        iconVolumeUp.style.display = 'none';
        iconVolumeMute.style.display = 'block';
      } else {
        iconVolumeUp.style.display = 'block';
        iconVolumeMute.style.display = 'none';
      }
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        player.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen();
      }
    });

    // Menus
    const closeMenus = () => {
      settingsMenu.classList.remove('open');
      qualityMenu.classList.remove('open');
    };

    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (settingsMenu.classList.contains('open') || qualityMenu.classList.contains('open')) {
        closeMenus();
      } else {
        settingsMenu.classList.add('open');
      }
    });

    menuQualityTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsMenu.classList.remove('open');
      qualityMenu.classList.add('open');
    });

    qualityMenuBack.addEventListener('click', (e) => {
      e.stopPropagation();
      qualityMenu.classList.remove('open');
      settingsMenu.classList.add('open');
    });

    document.addEventListener('click', (e) => {
      if (!player.contains(e.target)) {
        closeMenus();
      }
    });

    // Controle de Qualidades
    qualityOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        if (opt.classList.contains('active')) return;

        const res = opt.getAttribute('data-res');
        const isPlaying = !video.paused;

        closeMenus();

        videoLoader.classList.add('active');

        if (isPlaying) {
          video.pause();
        }

        // Reset class
        video.className = 'depoimento-video';
        
        setTimeout(() => {
          videoLoader.classList.remove('active');

          qualityOptions.forEach(o => {
            o.classList.remove('active');
            o.querySelector('.checkmark-space').textContent = '';
          });

          opt.classList.add('active');
          opt.querySelector('.checkmark-space').textContent = '✓';

          let toastMsg = '';
          if (res === '1080p') {
            video.classList.add('quality-1080p');
            currentQualityLabel.textContent = '1080p60';
            toastMsg = 'Qualidade melhorada para 1080p (HD + IA)! ✨';
          } else if (res === '720p') {
            video.classList.add('quality-720p');
            currentQualityLabel.textContent = '720p60';
            toastMsg = 'Qualidade alterada para 720p.';
          } else if (res === '360p') {
            video.classList.add('quality-360p');
            currentQualityLabel.textContent = '360p';
            toastMsg = 'Qualidade alterada para 360p (Padrão).';
          } else if (res === '144p') {
            video.classList.add('quality-144p');
            currentQualityLabel.textContent = '144p';
            toastMsg = 'Qualidade alterada para 144p.';
          } else {
            currentQualityLabel.textContent = 'Automático';
            toastMsg = 'Qualidade configurada para Automático.';
          }

          if (isPlaying) {
            video.play().catch(err => console.log(err));
          }

          videoToast.textContent = toastMsg;
          videoToast.classList.add('active');
          setTimeout(() => {
            videoToast.classList.remove('active');
          }, 3000);

        }, 1200);
      });
    });

    let controlsTimeout;
    const controlsBar = document.getElementById('video-controls');
    
    const showControls = () => {
      controlsBar.classList.add('visible');
      player.style.cursor = 'default';
      clearTimeout(controlsTimeout);
      if (!video.paused) {
        controlsTimeout = setTimeout(() => {
          if (!settingsMenu.classList.contains('open') && !qualityMenu.classList.contains('open')) {
            controlsBar.classList.remove('visible');
            player.style.cursor = 'none';
          }
        }, 3000);
      }
    };

    player.addEventListener('mousemove', showControls);
    player.addEventListener('mouseenter', showControls);
    player.addEventListener('mouseleave', () => {
      if (!video.paused && !settingsMenu.classList.contains('open') && !qualityMenu.classList.contains('open')) {
        controlsBar.classList.remove('visible');
      }
    });

    video.addEventListener('loadedmetadata', () => {
      timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
    });
  }

});
