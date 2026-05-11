(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'));
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const header = document.querySelector('.site-header');
  const profileCard = document.querySelector('.profile-card');
  const filterButtons = Array.from(document.querySelectorAll('[data-project-filter]'));
  const projectCards = Array.from(document.querySelectorAll('[data-project-card]'));
  const status = document.querySelector('[data-project-status]');
  const hideTimers = new WeakMap();
  const delayResetTimers = new WeakMap();

  const setRevealDelays = () => {
    revealTargets.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index, 10) * 70}ms`);
    });
  };

  const revealNow = (elements) => {
    elements.forEach((element) => element.classList.add('is-visible'));
  };

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

    if (visibleCount === 0) {
      status.textContent = 'No projects match this filter.';
      return;
    }

    status.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
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

  applyFilter('all');
})();
