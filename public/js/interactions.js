(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'));
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const header = document.querySelector('.site-header');
  const profileCard = document.querySelector('.profile-card');
  const filterButtons = Array.from(document.querySelectorAll('[data-project-filter]'));
  const projectCards = Array.from(document.querySelectorAll('[data-project-card]'));
  const status = document.querySelector('[data-project-status]');
  const languageButtons = Array.from(document.querySelectorAll('[data-language-option]'));
  const hideTimers = new WeakMap();
  const delayResetTimers = new WeakMap();
  let currentLanguage = localStorage.getItem('portfolio-language') || 'es';
  let currentFilter = 'all';

  const translations = {
    es: {
      htmlLang: 'es',
      title: 'Jhonatan Muentes Sanchez | Fullstack, Diseño y Marketing',
      description:
        'Portafolio profesional de Jhonatan Muentes Sanchez, ingeniero de sistemas, desarrollador fullstack, diseñador y estratega digital.',
      skipLink: 'Saltar al contenido',
      brandAria: 'Inicio de Jhonatan Muentes Sanchez',
      navAria: 'Navegación principal',
      languageAria: 'Selector de idioma',
      heroActionsAria: 'Acciones principales',
      statsAria: 'Resumen profesional',
      profileAria: 'Resumen del perfil',
      filterAria: 'Filtrar áreas',
      brandRole: 'Fullstack Developer',
      nav: ['Portafolio', 'Servicios', 'Sobre mí', 'Contacto'],
      hero: {
        eyebrow: 'Ingeniería, diseño y estrategia digital',
        title: 'Desarrollo soluciones web con código sólido, criterio visual y enfoque en resultados.',
        lede:
          'Soy Jhonatan Muentes Sanchez, Ingeniero de Sistemas y Tecnólogo en Sistemas. Combino desarrollo fullstack, diseño gráfico, edición audiovisual y marketing digital para crear experiencias que funcionan técnicamente y comunican con claridad.',
        actions: ['Ver enfoque de trabajo', 'Hablemos de tu proyecto'],
      },
      stats: [
        ['Fullstack', 'Node.js, JavaScript, arquitectura de software y buenas prácticas'],
        ['Creativo', 'Diseño gráfico, identidad visual y edición de video profesional'],
        ['Estratégico', 'Marketing digital, conversión y comunicación orientada a negocio'],
      ],
      profile: {
        kicker: 'Perfil integral para proyectos digitales',
        title: 'Desarrollador fullstack con visión de diseño y negocio',
        description:
          'No solo escribo código: conecto requerimientos técnicos, estética visual y objetivos comerciales para construir productos digitales más completos.',
        facts: [
          'Formación: Universidad Antonio José de Sucre',
          'Experiencia: 1 año en la empresa Raimbow',
          'Foco: webs escalables, marca, contenido y crecimiento digital',
        ],
      },
      work: {
        eyebrow: 'Portafolio híbrido',
        title: 'Un perfil puente entre desarrollo, creatividad y marketing.',
        description:
          'Mi valor está en conectar equipos y decisiones: puedo entender al área técnica, dialogar con el equipo creativo y mantener presente el objetivo comercial del proyecto.',
        filters: ['Todo', 'Desarrollo', 'Diseño', 'Estrategia'],
        empty: 'No hay áreas que coincidan con este filtro.',
        status: (count) => `Mostrando ${count} área${count === 1 ? '' : 's'}`,
        cards: [
          {
            type: 'Desarrollo',
            tag: 'Fullstack',
            title: 'Aplicaciones web escalables',
            description:
              'Desarrollo soluciones con Node.js, JavaScript y estructuras pensadas para crecer sin perder claridad técnica.',
            points: [
              'Arquitectura de software ordenada',
              'Clean Code para facilitar mantenimiento',
              'Interfaces rápidas, responsivas y funcionales',
            ],
          },
          {
            type: 'Diseño y multimedia',
            tag: 'Identidad visual',
            title: 'Marcas con presencia visual consistente',
            description:
              'Diseño piezas gráficas, identidades y contenido audiovisual que refuerzan la percepción profesional de cada proyecto.',
            points: [
              'Diseño gráfico para marcas y campañas',
              'Edición de video profesional',
              'Prototipos visuales conectados con el producto final',
            ],
          },
          {
            type: 'Estrategia',
            tag: 'Conversión',
            title: 'Experiencias orientadas a crecimiento',
            description:
              'Aplico marketing digital para que la web no sea solo una vitrina, sino una herramienta que ayude a atraer, convencer y convertir.',
            points: [
              'Mensajes claros para usuarios y clientes',
              'Optimización de conversión en llamados a la acción',
              'Contenido alineado con objetivos de negocio',
            ],
          },
        ],
      },
      services: {
        eyebrow: 'Servicios',
        title: 'Soluciones digitales completas para ideas que necesitan verse bien y funcionar mejor.',
        description:
          'Trabajo desde la estructura técnica hasta la comunicación visual, cuidando que cada entrega tenga sentido para el usuario y para el negocio.',
        items: [
          [
            'Desarrollo web escalable',
            'Sitios y aplicaciones con base técnica limpia, responsive design y estructura preparada para evolucionar.',
          ],
          [
            'Identidad visual de marca',
            'Diseño gráfico, dirección visual y piezas que hacen que una marca se perciba profesional y coherente.',
          ],
          [
            'Contenido audiovisual',
            'Edición de video y recursos multimedia para redes, presentaciones, campañas y comunicación digital.',
          ],
          [
            'Estrategias de crecimiento digital',
            'Marketing digital, optimización de conversión y mensajes pensados para convertir visitas en oportunidades.',
          ],
        ],
      },
      about: {
        eyebrow: 'Sobre mí',
        title: 'Formación técnica con sensibilidad creativa y mentalidad de negocio.',
        paragraphs: [
          'Soy Ingeniero de Sistemas graduado de la Universidad Antonio José de Sucre y también Tecnólogo en Sistemas. Mi experiencia incluye 1 año en la empresa Raimbow, donde fortalecí mi criterio para trabajar con requerimientos reales, tiempos de entrega y soluciones prácticas.',
          'Me interesa construir productos digitales que se sientan profesionales desde el primer contacto. Por eso combino código limpio, estética visual y estrategia: una web debe cargar bien, verse bien, ser fácil de mantener y ayudar a que el usuario tome acción.',
        ],
      },
      methodology: {
        eyebrow: 'Metodología',
        title: 'Clean Code como inversión, no como detalle técnico.',
        description:
          'Un proyecto bien escrito reduce costos futuros porque es más fácil de corregir, ampliar y entregar a otros desarrolladores. La mantenibilidad evita rehacer trabajo; la escalabilidad permite crecer con orden; y la claridad técnica mejora la velocidad de cada cambio.',
        items: [
          [
            'Mantenibilidad',
            'Código claro para detectar errores, agregar funciones y trabajar sin depender de soluciones improvisadas.',
          ],
          [
            'Escalabilidad',
            'Estructuras pensadas para que el proyecto pueda crecer sin volverse lento, confuso o costoso de modificar.',
          ],
          [
            'Ahorro a largo plazo',
            'Menos deuda técnica significa menos tiempo perdido en correcciones y mayor capacidad de evolucionar el producto.',
          ],
        ],
      },
      contact: {
        eyebrow: 'Contacto',
        title: 'Llevemos tu idea al siguiente nivel con tecnología, diseño y estrategia.',
      },
    },
    en: {
      htmlLang: 'en',
      title: 'Jhonatan Muentes Sanchez | Fullstack, Design and Marketing',
      description:
        'Professional portfolio of Jhonatan Muentes Sanchez, systems engineer, fullstack developer, designer, and digital strategist.',
      skipLink: 'Skip to content',
      brandAria: 'Jhonatan Muentes Sanchez home',
      navAria: 'Main navigation',
      languageAria: 'Language selector',
      heroActionsAria: 'Primary actions',
      statsAria: 'Professional summary',
      profileAria: 'Profile summary',
      filterAria: 'Filter areas',
      brandRole: 'Fullstack Developer',
      nav: ['Portfolio', 'Services', 'About', 'Contact'],
      hero: {
        eyebrow: 'Engineering, design, and digital strategy',
        title: 'I build web solutions with solid code, strong visual judgment, and a results-focused mindset.',
        lede:
          'I am Jhonatan Muentes Sanchez, a Systems Engineer and Systems Technologist. I combine fullstack development, graphic design, audiovisual editing, and digital marketing to create experiences that work technically and communicate clearly.',
        actions: ['See my work approach', "Let's talk about your project"],
      },
      stats: [
        ['Fullstack', 'Node.js, JavaScript, software architecture, and best practices'],
        ['Creative', 'Graphic design, visual identity, and professional video editing'],
        ['Strategic', 'Digital marketing, conversion, and business-oriented communication'],
      ],
      profile: {
        kicker: 'Integrated profile for digital projects',
        title: 'Fullstack developer with design and business vision',
        description:
          "I don't just write code: I connect technical requirements, visual aesthetics, and business goals to build more complete digital products.",
        facts: [
          'Education: Universidad Antonio José de Sucre',
          'Experience: 1 year at Raimbow',
          'Focus: scalable websites, brand, content, and digital growth',
        ],
      },
      work: {
        eyebrow: 'Hybrid portfolio',
        title: 'A bridge profile between development, creativity, and marketing.',
        description:
          "My value is in connecting teams and decisions: I can understand the technical side, speak with the creative team, and keep the project's business goal in focus.",
        filters: ['All', 'Development', 'Design', 'Strategy'],
        empty: 'No areas match this filter.',
        status: (count) => `Showing ${count} area${count === 1 ? '' : 's'}`,
        cards: [
          {
            type: 'Development',
            tag: 'Fullstack',
            title: 'Scalable web applications',
            description:
              'I develop solutions with Node.js, JavaScript, and structures designed to grow without losing technical clarity.',
            points: [
              'Well-organized software architecture',
              'Clean Code for easier maintenance',
              'Fast, responsive, and functional interfaces',
            ],
          },
          {
            type: 'Design and multimedia',
            tag: 'Visual identity',
            title: 'Brands with consistent visual presence',
            description:
              "I design graphic assets, identities, and audiovisual content that strengthen each project's professional perception.",
            points: [
              'Graphic design for brands and campaigns',
              'Professional video editing',
              'Visual prototypes connected to the final product',
            ],
          },
          {
            type: 'Strategy',
            tag: 'Conversion',
            title: 'Growth-oriented experiences',
            description:
              'I apply digital marketing so a website is not just a showcase, but a tool that helps attract, persuade, and convert.',
            points: [
              'Clear messaging for users and clients',
              'Conversion optimization in calls to action',
              'Content aligned with business goals',
            ],
          },
        ],
      },
      services: {
        eyebrow: 'Services',
        title: 'Complete digital solutions for ideas that need to look good and work even better.',
        description:
          'I work from the technical structure to the visual communication, making sure every delivery makes sense for both the user and the business.',
        items: [
          [
            'Scalable web development',
            'Websites and applications with a clean technical foundation, responsive design, and a structure ready to evolve.',
          ],
          [
            'Brand visual identity',
            'Graphic design, visual direction, and assets that make a brand feel professional and consistent.',
          ],
          [
            'Audiovisual content',
            'Video editing and multimedia resources for social media, presentations, campaigns, and digital communication.',
          ],
          [
            'Digital growth strategies',
            'Digital marketing, conversion optimization, and messaging designed to turn visits into opportunities.',
          ],
        ],
      },
      about: {
        eyebrow: 'About',
        title: 'Technical education with creative sensitivity and a business mindset.',
        paragraphs: [
          'I am a Systems Engineer graduated from Universidad Antonio José de Sucre and also a Systems Technologist. My experience includes 1 year at Raimbow, where I strengthened my judgment for working with real requirements, delivery timelines, and practical solutions.',
          'I care about building digital products that feel professional from the first interaction. That is why I combine clean code, visual aesthetics, and strategy: a website should load well, look good, be easy to maintain, and help users take action.',
        ],
      },
      methodology: {
        eyebrow: 'Methodology',
        title: 'Clean Code as an investment, not a technical detail.',
        description:
          'A well-written project reduces future costs because it is easier to fix, expand, and hand off to other developers. Maintainability prevents rework; scalability allows the product to grow in an organized way; and technical clarity improves the speed of every change.',
        items: [
          [
            'Maintainability',
            'Clear code to detect errors, add features, and work without relying on improvised solutions.',
          ],
          [
            'Scalability',
            'Structures designed so the project can grow without becoming slow, confusing, or expensive to modify.',
          ],
          [
            'Long-term savings',
            'Less technical debt means less time lost on fixes and greater ability to evolve the product.',
          ],
        ],
      },
      contact: {
        eyebrow: 'Contact',
        title: "Let's take your idea to the next level with technology, design, and strategy.",
      },
    },
  };

  const setRevealDelays = () => {
    revealTargets.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index, 10) * 70}ms`);
    });
  };

  const revealAboveFold = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    revealTargets.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isAboveFold = rect.top < viewportHeight * 1.08 && rect.bottom > 0;

      if (isAboveFold) {
        element.classList.add('is-visible');
      }
    });
  };

  const revealNow = (elements) => {
    elements.forEach((element) => element.classList.add('is-visible'));
  };

  const setText = (selector, value, index = 0) => {
    const element = document.querySelectorAll(selector)[index];
    if (element) element.textContent = value;
  };

  const setTexts = (selector, values) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (values[index] !== undefined) element.textContent = values[index];
    });
  };

  const setListTexts = (selector, values) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (values[index] !== undefined) element.textContent = values[index];
    });
  };

  const setLanguageButtons = (language) => {
    languageButtons.forEach((button) => {
      const isActive = button.dataset.languageOption === language;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  const applyLanguage = (language) => {
    const copy = translations[language] || translations.es;
    currentLanguage = translations[language] ? language : 'es';
    localStorage.setItem('portfolio-language', currentLanguage);

    document.documentElement.lang = copy.htmlLang;
    document.title = copy.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.description);
    document.querySelector('.brand')?.setAttribute('aria-label', copy.brandAria);
    document.querySelector('.site-nav')?.setAttribute('aria-label', copy.navAria);
    document.querySelector('.language-switcher')?.setAttribute('aria-label', copy.languageAria);
    document.querySelector('.hero-actions')?.setAttribute('aria-label', copy.heroActionsAria);
    document.querySelector('.stats')?.setAttribute('aria-label', copy.statsAria);
    document.querySelector('.hero-panel')?.setAttribute('aria-label', copy.profileAria);
    document.querySelector('.filter-group')?.setAttribute('aria-label', copy.filterAria);

    setText('.skip-link', copy.skipLink);
    setText('.brand-text span', copy.brandRole);
    setTexts('.site-nav a', copy.nav);
    setText('.hero-copy .eyebrow', copy.hero.eyebrow);
    setText('#hero-title', copy.hero.title);
    setText('.lede', copy.hero.lede);
    setTexts('.hero-actions .button', copy.hero.actions);
    setTexts('.stats dt', copy.stats.map(([title]) => title));
    setTexts('.stats dd', copy.stats.map(([, description]) => description));

    setText('.panel-kicker', copy.profile.kicker);
    setText('.profile-meta h2', copy.profile.title);
    setText('.profile-meta p', copy.profile.description, 1);
    setListTexts('.availability-list li', copy.profile.facts);

    setText('#work .section-heading .eyebrow', copy.work.eyebrow);
    setText('#work-title', copy.work.title);
    setText('#work .section-heading .body-copy', copy.work.description);
    setTexts('.filter-button', copy.work.filters);
    document.querySelectorAll('.project-card').forEach((card, index) => {
      const cardCopy = copy.work.cards[index];
      if (!cardCopy) return;
      card.querySelector('.project-type').textContent = cardCopy.type;
      card.querySelector('.project-tag').textContent = cardCopy.tag;
      card.querySelector('h3').textContent = cardCopy.title;
      card.querySelector('p:not(.project-type)').textContent = cardCopy.description;
      card.querySelectorAll('.project-points li').forEach((point, pointIndex) => {
        point.textContent = cardCopy.points[pointIndex];
      });
    });

    setText('#services .section-heading .eyebrow', copy.services.eyebrow);
    setText('#services-title', copy.services.title);
    setText('#services .section-heading .body-copy', copy.services.description);
    document.querySelectorAll('#services .service-item').forEach((item, index) => {
      const itemCopy = copy.services.items[index];
      if (!itemCopy) return;
      item.querySelector('h3').textContent = itemCopy[0];
      item.querySelector('p').textContent = itemCopy[1];
    });

    setText('#about .section-heading .eyebrow', copy.about.eyebrow);
    setText('#about-title', copy.about.title);
    setListTexts('#about .about-copy p', copy.about.paragraphs);

    setText('[aria-labelledby="method-title"] .section-heading .eyebrow', copy.methodology.eyebrow);
    setText('#method-title', copy.methodology.title);
    setText('[aria-labelledby="method-title"] .section-heading .body-copy', copy.methodology.description);
    document.querySelectorAll('[aria-labelledby="method-title"] .service-item').forEach((item, index) => {
      const itemCopy = copy.methodology.items[index];
      if (!itemCopy) return;
      item.querySelector('h3').textContent = itemCopy[0];
      item.querySelector('p').textContent = itemCopy[1];
    });

    setText('#contact .eyebrow', copy.contact.eyebrow);
    setText('#contact-title', copy.contact.title);
    setLanguageButtons(currentLanguage);
  };

  applyLanguage(currentLanguage);
  setRevealDelays();

  if (revealTargets.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealNow(revealTargets);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        {
          rootMargin: '0px 0px -12% 0px',
          threshold: 0.18,
        }
      );

      revealTargets.forEach((element) => observer.observe(element));
      window.requestAnimationFrame(revealAboveFold);
    }
  }

  if (header) {
    const updateHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    let ticking = false;

    updateHeaderState();

    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;

        window.requestAnimationFrame(() => {
          updateHeaderState();
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  if (navLinks.length) {
    const sections = navLinks
      .map((link) => {
        const target = document.querySelector(link.getAttribute('href'));
        return target ? { link, target } : null;
      })
      .filter(Boolean);

    const setActiveLink = (activeId) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    if (sections.length) {
      const initialId = window.location.hash ? window.location.hash.slice(1) : sections[0].target.id;
      setActiveLink(initialId);

      if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (!visible.length) return;
            setActiveLink(visible[0].target.id);
          },
          {
            rootMargin: '-22% 0px -58% 0px',
            threshold: [0.15, 0.3, 0.5],
          }
        );

        sections.forEach(({ target }) => sectionObserver.observe(target));
      }
    }
  }

  if (profileCard && !reduceMotion) {
    const resetPointer = () => {
      profileCard.style.setProperty('--pointer-x', '50%');
      profileCard.style.setProperty('--pointer-y', '42%');
    };

    resetPointer();

    profileCard.addEventListener('pointermove', (event) => {
      const rect = profileCard.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      profileCard.style.setProperty('--pointer-x', `${Math.max(0, Math.min(100, x)).toFixed(2)}%`);
      profileCard.style.setProperty('--pointer-y', `${Math.max(0, Math.min(100, y)).toFixed(2)}%`);
    });

    profileCard.addEventListener('pointerleave', resetPointer);
  }

  if (!filterButtons.length || !projectCards.length) {
    return;
  }

  const normalizeTags = (value) =>
    value
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

  const setActiveButton = (activeValue) => {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.projectFilter === activeValue;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  const updateStatus = (visibleCount) => {
    if (!status) return;
    const copy = translations[currentLanguage] || translations.es;

    if (visibleCount === 0) {
      status.textContent = copy.work.empty;
      return;
    }

    status.textContent = copy.work.status(visibleCount);
  };

  const clearHideTimer = (card) => {
    const timer = hideTimers.get(card);
    if (timer) {
      window.clearTimeout(timer);
      hideTimers.delete(card);
    }
  };

  const clearDelayResetTimer = (card) => {
    const timer = delayResetTimers.get(card);
    if (timer) {
      window.clearTimeout(timer);
      delayResetTimers.delete(card);
    }
  };

  const scheduleDelayReset = (card) => {
    clearDelayResetTimer(card);

    const timer = window.setTimeout(() => {
      if (!card.classList.contains('is-filtered-out')) {
        card.style.transitionDelay = '0ms';
      }
      delayResetTimers.delete(card);
    }, 620);

    delayResetTimers.set(card, timer);
  };

  const showCard = (card, orderIndex) => {
    clearHideTimer(card);
    clearDelayResetTimer(card);
    card.hidden = false;
    card.setAttribute('aria-hidden', 'false');
    card.style.transitionDelay = `${Math.min(orderIndex, 8) * 45}ms`;

    window.requestAnimationFrame(() => {
      card.classList.remove('is-filtered-out');
      scheduleDelayReset(card);
    });
  };

  const hideCard = (card) => {
    clearHideTimer(card);
    clearDelayResetTimer(card);
    card.style.transitionDelay = '0ms';
    card.classList.add('is-filtered-out');
    card.setAttribute('aria-hidden', 'true');

    const timer = window.setTimeout(() => {
      if (card.classList.contains('is-filtered-out')) {
        card.hidden = true;
      }
    }, 220);

    hideTimers.set(card, timer);
  };

  const applyFilter = (filterValue) => {
    const normalizedFilter = filterValue.toLowerCase();
    currentFilter = normalizedFilter;
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const cardTags = normalizeTags(card.dataset.projectTags || '');
      const shouldShow = normalizedFilter === 'all' || cardTags.includes(normalizedFilter);

      if (shouldShow) {
        visibleCount += 1;
        showCard(card, visibleCount - 1);
      } else {
        hideCard(card);
      }
    });

    setActiveButton(normalizedFilter);
    updateStatus(visibleCount);
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyFilter(button.dataset.projectFilter || 'all');
    });
  });

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyLanguage(button.dataset.languageOption || 'es');
      applyFilter(currentFilter);
    });
  });

  applyFilter('all');
})();

