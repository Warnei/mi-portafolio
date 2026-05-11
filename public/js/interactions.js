(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'));

  const revealNow = (elements) => {
    elements.forEach((element) => element.classList.add('is-visible'));
  };

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

  const filterButtons = Array.from(document.querySelectorAll('[data-project-filter]'));
  const projectCards = Array.from(document.querySelectorAll('[data-project-card]'));
  const status = document.querySelector('[data-project-status]');

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
    status.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
  };

  const applyFilter = (filterValue) => {
    const normalizedFilter = filterValue.toLowerCase();
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const cardTags = normalizeTags(card.dataset.projectTags || '');
      const shouldShow = normalizedFilter === 'all' || cardTags.includes(normalizedFilter);

      card.hidden = !shouldShow;
      card.setAttribute('aria-hidden', String(!shouldShow));

      if (shouldShow) {
        visibleCount += 1;
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
