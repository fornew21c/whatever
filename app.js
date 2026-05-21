const IMG_PARAMS = '?auto=format&fit=crop&w=720&h=540&q=80';

const products = [
  {
    id: 'lv-pf-multiple',
    name: '멀티플 카드 홀더 · 모노그램',
    image: 'https://images.unsplash.com/photo-1614330316567-11d8e572db16' + IMG_PARAMS,
    priceKrw: 540000,
    tags: ['luxury', 'leather'],
    gradient: 'linear-gradient(135deg, #6b4f2a 0%, #2b1d10 100%)'
  },
  {
    id: 'gucci-marmont',
    name: 'GG 카드케이스 · 블랙',
    image: 'https://images.unsplash.com/photo-1614267119077-51bdcbf9f77a' + IMG_PARAMS,
    priceKrw: 480000,
    tags: ['luxury', 'leather'],
    gradient: 'linear-gradient(135deg, #1f1f1f 0%, #3a3a3a 100%)'
  },
  {
    id: 'prada-saffiano',
    name: '사피아노 카드홀더 · 네이비',
    image: 'https://images.unsplash.com/photo-1570431118100-c24a54fdeab0' + IMG_PARAMS,
    priceKrw: 395000,
    tags: ['luxury', 'leather', 'minimal'],
    gradient: 'linear-gradient(135deg, #1c2a45 0%, #0f1424 100%)'
  },
  {
    id: 'bv-intrecciato',
    name: '인트레치아토 카드케이스',
    image: 'https://images.unsplash.com/photo-1532033375034-a29004ea9769' + IMG_PARAMS,
    priceKrw: 620000,
    tags: ['luxury', 'leather'],
    gradient: 'linear-gradient(135deg, #3a2419 0%, #1a0f08 100%)'
  },
  {
    id: 'ysl-monogram',
    name: '모노그램 카드홀더 · 블랙',
    image: 'https://images.unsplash.com/photo-1579014134953-1580d7f123f3' + IMG_PARAMS,
    priceKrw: 410000,
    tags: ['luxury', 'minimal'],
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)'
  },
  {
    id: 'bellroy-note',
    name: '노트 슬리브 · RFID 차단',
    image: 'https://images.unsplash.com/photo-1608125395317-c307a7f00d8f' + IMG_PARAMS,
    priceKrw: 119000,
    tags: ['leather', 'rfid', 'minimal'],
    gradient: 'linear-gradient(135deg, #5a3f2a 0%, #2c1f15 100%)'
  },
  {
    id: 'secrid-slim',
    name: '슬림월렛 · RFID 알루미늄',
    image: 'https://images.unsplash.com/photo-1676276550349-580c49631496' + IMG_PARAMS,
    priceKrw: 145000,
    tags: ['rfid', 'minimal'],
    gradient: 'linear-gradient(135deg, #8a8d94 0%, #3a3d44 100%)'
  },
  {
    id: 'tumi-id-lock',
    name: 'Alpha · ID Lock 카드케이스',
    image: 'https://images.unsplash.com/photo-1658255307973-1a3aab57a539' + IMG_PARAMS,
    priceKrw: 215000,
    tags: ['rfid', 'minimal'],
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
      <div class="thumb" style="background:${p.gradient}">
        <img class="thumb-img" src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="body">
        <h3>${p.name}</h3>
        <div class="tags">
          ${p.tags.map(t => `<span class="tag">${tagLabels[t] || t}</span>`).join('')}
        </div>
        <div class="meta">
          <div class="price">₩${krw.format(p.priceKrw)}</div>
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
  const idInput = document.getElementById('product-id');
  const nameEl = document.getElementById('selected-product-name');
  const priceEl = document.getElementById('selected-product-price');
  const box = document.getElementById('selected-product');
  const btnText = document.getElementById('pay-button-text');

  document.getElementById('product-grid').addEventListener('click', e => {
    const link = e.target.closest('[data-product]');
    if (!link) return;
    const product = products.find(p => p.id === link.dataset.product);
    if (!product) return;
    idInput.value = product.id;
    nameEl.textContent = product.name;
    priceEl.textContent = `₩${krw.format(product.priceKrw)}`;
    box.removeAttribute('data-empty');
    btnText.textContent = `₩${krw.format(product.priceKrw)} 결제하기`;
  });
}

function setupForm() {
  const form = document.getElementById('order-form');
  const status = document.getElementById('form-status');
  const box = document.getElementById('selected-product');
  const nameEl = document.getElementById('selected-product-name');
  const priceEl = document.getElementById('selected-product-price');
  const btnText = document.getElementById('pay-button-text');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const productId = form.elements.productId.value;
    if (!productId) {
      status.textContent = '먼저 상품 목록에서 결제할 상품을 선택해 주세요.';
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = data.get('name');
    const product = products.find(p => p.id === productId);
    const payLabel = {
      card: '신용카드', kakao: '카카오페이', naver: '네이버페이', bank: '무통장 입금'
    }[data.get('payment')] || '선택한 결제 수단';
    status.textContent = `${name}님, 결제가 완료되었습니다 ✓  ${product.name} (₩${krw.format(product.priceKrw)}) · ${payLabel} — 영수증을 이메일로 보내드렸으며, 익일 출고됩니다.`;
    form.reset();
    box.setAttribute('data-empty', 'true');
    nameEl.textContent = '상품 목록에서 "주문 →"을 눌러주세요';
    priceEl.textContent = '-';
    btnText.textContent = '결제하기';
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

function setupMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  if (!btn || !menu) return;
  const toggle = (open) => {
    const isOpen = open ?? !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', isOpen);
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };
  btn.addEventListener('click', () => toggle());
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') toggle(false);
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
renderProducts();
setupFilter();
setupOrderShortcut();
setupForm();
observeReveals();
setupCardTilt();
setupMenu();
