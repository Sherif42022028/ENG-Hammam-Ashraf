document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE NAVIGATION
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            const isOpen = mainNav.classList.contains('open');
            mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        // Close mobile nav when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    /* ==========================================================================
       SCROLL EFFECTS & ACTIVE NAVIGATION LINKS
       ========================================================================== */
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header class addition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       REVEAL ON SCROLL ANIMATION
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       CERTIFICATION VAULT: FILTERS & MODAL DETAILS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certCards = document.querySelectorAll('.cert-card');
    const certModal = document.getElementById('cert-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Certification filtering logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            certCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Modal popup content mapping
    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.cert-title').textContent;
            const subtitle = card.querySelector('.cert-subtitle').textContent;
            const hours = card.getAttribute('data-hours') || '16 Hours';
            const category = card.querySelector('.cert-category-tag').textContent;
            const description = card.getAttribute('data-desc');
            const sectors = card.getAttribute('data-sectors') || '';

            // Inject content into modal elements
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-subtitle').textContent = subtitle;
            document.getElementById('modal-pill-hours').innerHTML = `<i class="fa-regular fa-clock"></i> ${hours}`;
            document.getElementById('modal-pill-scope').innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${category}`;
            document.getElementById('modal-description').textContent = description;

            // Map and inject sector list badges
            const sectorContainer = document.getElementById('modal-sectors-list');
            sectorContainer.innerHTML = '';
            
            const sectorNames = {
                'industrial': 'Industrial & Manufacturing',
                'logistics': 'Warehousing & Logistics',
                'construction': 'Construction & Projects',
                'agriculture': 'Agro-Industry & Food'
            };

            const sectorArray = sectors.split(' ').filter(s => s !== '');
            if (sectorArray.length > 0) {
                sectorArray.forEach(sector => {
                    const cleanName = sectorNames[sector] || sector;
                    const badge = document.createElement('span');
                    badge.className = 'mini-badge';
                    badge.textContent = cleanName;
                    sectorContainer.appendChild(badge);
                });
            } else {
                const badge = document.createElement('span');
                badge.className = 'mini-badge';
                badge.textContent = 'All Industrial Sectors';
                sectorContainer.appendChild(badge);
            }

            // Open Modal
            certModal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        });
    });

    // Close Modal logic
    const closeModal = () => {
        certModal.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal.classList.contains('open')) {
            closeModal();
        }
    });


    /* ==========================================================================
       SECTOR COMPATIBILITY MATCHER (WOW WIDGET LOGIC)
       ========================================================================== */
    const matcherTabs = document.querySelectorAll('.matcher-tab');
    const sectorContents = document.querySelectorAll('.sector-content');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Add a helper reset function
    const resetGlobalHighlights = () => {
        certCards.forEach(card => {
            card.classList.remove('highlight-active', 'dimmed');
        });
        timelineItems.forEach(item => {
            item.classList.remove('highlight-active', 'dimmed');
        });
    };

    const applyHighlightsForSector = (sector) => {
        resetGlobalHighlights();
        
        // Go through certificates and timeline items and check data-sectors
        certCards.forEach(card => {
            const sectorsStr = card.getAttribute('data-sectors') || '';
            const matchSectors = sectorsStr.split(' ');
            if (matchSectors.includes(sector)) {
                card.classList.add('highlight-active');
            } else {
                card.classList.add('dimmed');
            }
        });

        timelineItems.forEach(item => {
            const sectorsStr = item.getAttribute('data-sectors') || '';
            const matchSectors = sectorsStr.split(' ');
            if (matchSectors.includes(sector)) {
                item.classList.add('highlight-active');
            } else {
                item.classList.add('dimmed');
            }
        });
    };

    matcherTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSector = tab.getAttribute('data-sector');

            // Toggle active tabs
            matcherTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Switch active text block
            sectorContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('id') === `content-${targetSector}`) {
                    content.classList.add('active');
                }
            });

            // Highlight items on page!
            applyHighlightsForSector(targetSector);
        });
    });

    // Run active highlights for initial default active tab (industrial)
    const initialActiveTab = document.querySelector('.matcher-tab.active');
    if (initialActiveTab) {
        applyHighlightsForSector(initialActiveTab.getAttribute('data-sector'));
    }

    // Double-click or clicking header logo can reset highlights
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', resetGlobalHighlights);
    }


    /* ==========================================================================
       CONTACT FORM VALIDATION & MOCK SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const formSubmitBtn = document.getElementById('form-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all fields.';
                return;
            }

            // Set loading state
            formSubmitBtn.disabled = true;
            const originalBtnHtml = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-circle-notch fa-spin"></i>';

            // Simulate server request (1.5 seconds)
            setTimeout(() => {
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnHtml;

                formStatus.className = 'form-status success';
                formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your message has been sent. Hammam will get in touch with you shortly.`;

                // Reset form
                contactForm.reset();

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.innerHTML = '';
                    formStatus.className = 'form-status';
                }, 5000);

            }, 1500);
        });
    }

    /* ==========================================================================
       SMART LOADER SCREEN
       ========================================================================== */
    const loader = document.getElementById('loader');
    const hideLoader = () => {
        if (loader && !loader.classList.contains('fade-out')) {
            loader.classList.add('fade-out');
        }
    };
    
    // Auto hide loader after maximum of 1.2s to prevent artificial wait
    const loaderTimeout = setTimeout(hideLoader, 1200);
    
    // Hide immediately on window load if it loads faster than 1.2s
    window.addEventListener('load', () => {
        clearTimeout(loaderTimeout);
        hideLoader();
    });

    // Safeguard loader fade out even if DOMContentLoaded / Load has issues
    setTimeout(hideLoader, 2000);

    /* ==========================================================================
       THEME TOGGLE (LIGHT / DARK MODE) WITH STORAGE
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        
        // Retrieve cached theme or default to dark
        const currentTheme = localStorage.getItem('theme') || 'dark';
        if (currentTheme === 'light') {
            document.body.classList.add('light-theme');
            if (icon) {
                icon.className = 'fa-solid fa-sun';
            }
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            if (icon) {
                icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        });
    }

    /* ==========================================================================
       BACKGROUND PARALLAX EFFECT (0.08 SPEED)
       ========================================================================== */
    const parallaxBg = document.getElementById('parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            // Respect prefers-reduced-motion settings
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                parallaxBg.style.transform = 'translateY(0)';
                return;
            }
            const scrolled = window.scrollY;
            parallaxBg.style.transform = `translateY(${scrolled * 0.08}px)`;
        });
    }

    /* ==========================================================================
       CUSTOM CURSOR DOT & OUTLINE (FINE POINTERS ONLY)
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (cursorDot && cursorOutline) {
        // Only run on desktop/fine pointers (coarse pointers are touchscreen devices) and screen width > 992px
        if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 992) {
            
            // Add custom cursor class only after the first mouse movement
            const handleFirstMouseMove = () => {
                document.body.classList.add('has-custom-cursor');
                window.removeEventListener('mousemove', handleFirstMouseMove);
            };
            window.addEventListener('mousemove', handleFirstMouseMove);
            
            window.addEventListener('mousemove', (e) => {
                // Respect prefers-reduced-motion settings
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }
                const posX = e.clientX;
                const posY = e.clientY;
                
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;
                cursorOutline.style.left = `${posX}px`;
                cursorOutline.style.top = `${posY}px`;
            });
            
            // Mouse hover over interactives morphs outline to gold ring
            const interactives = document.querySelectorAll('a, button, .cert-card, .matcher-tab, input, textarea, [role="button"]');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorDot.classList.add('hovered');
                    cursorOutline.classList.add('hovered');
                });
                el.addEventListener('mouseleave', () => {
                    cursorDot.classList.remove('hovered');
                    cursorOutline.classList.remove('hovered');
                });
            });
        }
    }

    /* ==========================================================================
       GOLDEN RIPPLE CLICK EFFECT ON BUTTONS
       ========================================================================== */
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Respect prefers-reduced-motion settings
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
