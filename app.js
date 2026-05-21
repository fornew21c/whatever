const products = [
  {
    id: 'lv-pf-multiple',
    brand: 'Louis Vuitton',
    name: '멀티플 카드 홀더 · 모노그램',
    priceKrw: 540000,
    priceLocal: '€340',
    tags: ['luxury', 'leather'],
    badges: ['파리 픽업'],
    gradient: 'linear-gradient(135deg, #6b4f2a 0%, #2b1d10 100%)'
  },
  {
    id: 'gucci-marmont',
    brand: 'Gucci',
    name: 'GG 마몽 카드케이스 · 블랙',
    priceKrw: 480000,
    priceLocal: '€320',
    tags: ['luxury', 'leather'],
    badges: ['밀라노 픽업'],
    gradient: 'linear-gradient(135deg, #1f1f1f 0%, #3a3a3a 100%)'
  },
  {
    id: 'prada-saffiano',
    brand: 'Prada',
    name: '사피아노 카드홀더 · 네이비',
    priceKrw: 395000,
    priceLocal: '€260',
    tags: ['luxury', 'leather', 'minimal'],
    badges: ['밀라노 픽업'],
    gradient: 'linear-gradient(135deg, #1c2a45 0%, #0f1424 100%)'
  },
  {
    id: 'bv-intrecciato',
    brand: 'Bottega Veneta',
    name: '인트레치아토 카드케이스',
    priceKrw: 620000,
    priceLocal: '€410',
    tags: ['luxury', 'leather'],
    badges: ['신상품'],
    gradient: 'linear-gradient(135deg, #3a2419 0%, #1a0f08 100%)'
  },
  {
    id: 'ysl-monogram',
    brand: 'Saint Laurent',
    name: '모노그램 카드홀더 · 블랙',
    priceKrw: 410000,
    priceLocal: '€275',
    tags: ['luxury', 'minimal'],
    badges: ['파리 픽업'],
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)'
  },
  {
    id: 'bellroy-note',
    brand: 'Bellroy',
    name: '노트 슬리브 · RFID 차단',
    priceKrw: 119000,
    priceLocal: '$89',
    tags: ['leather', 'rfid', 'minimal'],
    badges: ['미국 픽업'],
    gradient: 'linear-gradient(135deg, #5a3f2a 0%, #2c1f15 100%)'
  },
  {
    id: 'secrid-slim',
    brand: 'Secrid',
    name: '슬림월렛 · RFID 알루미늄',
    priceKrw: 145000,
    priceLocal: '€95',
    tags: ['rfid', 'minimal'],
    badges: ['네덜란드 픽업'],
    gradient: 'linear-gradient(135deg, #8a8d94 0%, #3a3d44 100%)'
  },
  {
    id: 'tumi-id-lock',
    brand: 'Tumi',
    name: 'Alpha · ID Lock 카드케이스',
    priceKrw: 215000,
    priceLocal: '$165',
    tags: ['rfid', 'minimal'],
    badges: ['미국 픽업'],
    gradient: 'linear-gradient(135deg, #1b1f2a 0%, #0c0e14 100%)'
  }
];

const tagLabels = {
  luxury: '럭셔리',
  leather: '가죽',
  minimal: '미니멀',
  rfid: 'RFID'
};

const krw = new Intl.NumberFormat('ko-KR');

function renderProducts(filter = 'all') {
  const grid = document.getElementById('product-grid');
  const list = filter === 'all'
    ? products
    : products.filter(p => p.tags.includes(filter));

  grid.innerHTML = list.map((p, i) => `
    <article class="product reveal" data-id="${p.id}" data-delay="${i * 40}">
      <div class="thumb" style="background:${p.gradient}"></div>
      <div class="body">
        <div class="brand-tag">${p.brand}</div>
        <h3>${p.name}</h3>
        <div class="tags">
          ${p.tags.map(t => `<span class="tag">${tagLabels[t] || t}</span>`).join('')}
          ${p.badges.map(b => `<span class="tag">${b}</span>`).join('')}
        </div>
        <div class="meta">
          <div class="price">₩${krw.format(p.priceKrw)} <small>· ${p.priceLocal}</small></div>
          <a href="#order" class="btn btn-ghost btn-sm" data-product="${p.id}">주문 →</a>
        </div>
      </div>
    </article>
  `).join('');

  observeReveals();
}

function setupFilter() {
  const buttons = document.querySelectorAll('.chip-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderProducts(btn.dataset.filter);
    });
  });
}

function setupOrderShortcut() {
  document.getElementById('product-grid').addEventListener('click', e => {
    const link = e.target.closest('[data-product]');
    if (!link) return;
    const product = products.find(p => p.id === link.dataset.product);
    if (!product) return;
    const notes = document.querySelector('textarea[name="notes"]');
    if (notes && !notes.value.includes(product.name)) {
      notes.value = `[관심 상품] ${product.brand} ${product.name} (₩${krw.format(product.priceKrw)})\n` + notes.value;
    }
  });
}

function setupForm() {
  const form = document.getElementById('order-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = data.get('name');
    status.textContent = `${name}님, 견적 신청이 접수되었습니다 ✓  1영업일 이내에 이메일로 회신드릴게요.`;
    form.reset();
  });
}

let revealObserver;
function observeReveals() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0, 10);
          setTimeout(() => entry.target.classList.add('in-view'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  document.querySelectorAll('.reveal:not(.in-view)').forEach(el => revealObserver.observe(el));
}

function setupCardTilt() {
  const stack = document.querySelector('.card-stack');
  if (!stack) return;
  const card = stack.querySelector('.card-3');
  if (!card) return;
  stack.addEventListener('mousemove', (e) => {
    const rect = stack.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(20px)`;
  });
  stack.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
renderProducts();
setupFilter();
setupOrderShortcut();
setupForm();
observeReveals();
setupCardTilt();
