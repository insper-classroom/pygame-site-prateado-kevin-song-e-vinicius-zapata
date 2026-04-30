const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
  });
});

const markActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

if (sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-42% 0px -46% 0px',
      threshold: 0.01,
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const revealItems = document.querySelectorAll(
  '.section, .feature-card, .screenshot, .creator-card, .controls-panel, .obstacles-panel',
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealItems.forEach((item) => {
  item.classList.add('reveal');
  revealObserver.observe(item);
});

document.querySelectorAll('.video-frame iframe').forEach((frame) => {
  const source = frame.getAttribute('src') || '';
  const youtubeShortLink = source.match(/youtu\.be\/([^?&]+)/);

  if (youtubeShortLink) {
    frame.setAttribute('src', `https://www.youtube.com/embed/${youtubeShortLink[1]}`);
  }
});

const downloadButton = document.querySelector('.download-button');
const downloadStatus = document.querySelector('#download-status');

if (downloadButton && downloadStatus) {
  downloadButton.addEventListener('click', () => {
    downloadStatus.textContent = 'Download iniciado. Se nada acontecer, verifique se o navegador bloqueou downloads.';
  });
}

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Fechar imagem">x</button>
  <figure class="lightbox-content">
    <img alt="">
    <figcaption></figcaption>
  </figure>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  document.body.classList.remove('is-locked');
  lightboxImage.removeAttribute('src');
};

document.querySelectorAll('.gallery .screenshot img').forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Abrir imagem: ${image.alt}`);

  const openLightbox = () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
    lightbox.classList.add('is-open');
    document.body.classList.add('is-locked');
  };

  image.addEventListener('click', openLightbox);
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox();
    }
  });
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox || event.target.classList.contains('lightbox-close')) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
    closeLightbox();
  }
});

const backTopButton = document.createElement('button');
backTopButton.className = 'back-top';
backTopButton.type = 'button';
backTopButton.textContent = '\u2191';
backTopButton.setAttribute('aria-label', 'Voltar ao inicio');
document.body.appendChild(backTopButton);

backTopButton.addEventListener('click', () => {
  document.querySelector('#inicio')?.scrollIntoView({ behavior: scrollBehavior });
});

window.addEventListener('scroll', () => {
  backTopButton.classList.toggle('is-visible', window.scrollY > 520);
});
