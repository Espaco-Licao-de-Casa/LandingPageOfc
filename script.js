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
     VIDEO QUALITY SWITCHER
     ========================================================================== */
  const video = document.getElementById('testimonial-video');
  const qualityButtons = document.querySelectorAll('.quality-btn');
  const videoLoader = document.getElementById('video-loader');
  const videoToast = document.getElementById('video-toast');

  if (video && qualityButtons.length > 0 && videoLoader && videoToast) {
    qualityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;

        const quality = btn.getAttribute('data-quality');
        const isPlaying = !video.paused;

        // Ativa o loader
        videoLoader.classList.add('active');
        
        // Pausa temporariamente o vídeo para simular o carregamento/ajuste de resolução
        if (isPlaying) {
          video.pause();
        }

        // Atualiza a classe ativa nos botões
        qualityButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Simula o tempo de processamento/buffering
        setTimeout(() => {
          videoLoader.classList.remove('active');

          if (quality === 'hd') {
            video.classList.add('enhanced-hd');
            videoToast.textContent = 'Qualidade melhorada para 1080p (HD + IA)! ✨';
          } else {
            video.classList.remove('enhanced-hd');
            videoToast.textContent = 'Qualidade alterada para 360p (Padrão).';
          }

          // Se estava tocando, retoma a reprodução
          if (isPlaying) {
            video.play().catch(err => console.log('Erro ao reproduzir vídeo:', err));
          }

          // Mostra a notificação toast
          videoToast.classList.add('active');
          setTimeout(() => {
            videoToast.classList.remove('active');
          }, 3000);

        }, 1200);
      });
    });
  }

});
