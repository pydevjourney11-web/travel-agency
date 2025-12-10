'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const strip = document.getElementById('reviews-strip');
  if (!strip) return;

  const hideStrip = () => { strip.style.display = 'none'; };

  fetch('data/reviews.json', { cache: 'no-store' })
    .then(res => (res.ok ? res.json() : []))
    .then(items => {
      if (!Array.isArray(items) || items.length === 0) {
        hideStrip();
        return;
      }

      const frag = document.createDocumentFragment();

      for (const item of items) {
        const name = (item && item.name) ? String(item.name).trim() : '';
        const text = (item && item.text) ? String(item.text).trim() : '';
        if (!text) continue; // не выводим пустые отзывы
        const ratingRaw = (item && item.rating != null) ? parseInt(item.rating, 10) : 5;
        const rating = Math.min(5, Math.max(1, isNaN(ratingRaw) ? 5 : ratingRaw));
        const date = (item && item.date) ? String(item.date).trim() : '';
        const link = (item && item.link) ? String(item.link).trim() : '';

        const card = document.createElement('article');
        card.className = 'review-card';

        const header = document.createElement('div');
        header.className = 'review-card__header';

        const nameEl = document.createElement('div');
        nameEl.className = 'review-card__name';
        nameEl.textContent = name || 'Гость';

        const starsEl = document.createElement('div');
        starsEl.className = 'review-card__stars';
        starsEl.setAttribute('aria-label', `Оценка ${rating} из 5`);
        starsEl.textContent = '★'.repeat(rating);

        header.appendChild(nameEl);
        header.appendChild(starsEl);

        const textEl = document.createElement('div');
        textEl.className = 'review-card__text';
        textEl.textContent = text;

        const meta = document.createElement('div');
        meta.className = 'review-card__meta';
        if (date && link) {
          meta.innerHTML = `${date} · <a href="${link}" target="_blank" rel="noopener">Источник</a>`;
        } else if (date) {
          meta.textContent = date;
        } else if (link) {
          meta.innerHTML = `<a href="${link}" target="_blank" rel="noopener">Источник</a>`;
        }

        card.appendChild(header);
        card.appendChild(textEl);
        card.appendChild(meta);
        frag.appendChild(card);
      }

      if (!frag.childNodes.length) {
        hideStrip();
        return;
      }

      strip.appendChild(frag);
    })
    .catch(err => {
      console.warn('Не удалось загрузить отзывы:', err);
      hideStrip();
    });
});
