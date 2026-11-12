const U = id => `https://images.unsplash.com/${id}?w=800&q=80`;
const menu = [
  { name: 'Double Smash', desc: 'Two smashed patties, American cheese, pickles, onion and secret sauce on a toasted potato bun.', price: '$8.50', img: U('photo-1568901346375-23c9450c58cd'), bg: '#ffd23f', tag: 'BEST SELLER' },
  { name: 'Classic Cheese', desc: 'One patty, sharp cheddar, lettuce, tomato and house ketchup. The one that started it all.', price: '$6.90', img: U('photo-1571091718767-18b5b1457add'), bg: '#ffb340' },
  { name: 'Chicken Crunch', desc: 'Buttermilk fried thigh, slaw, jalapeño mayo and dill pickles on a brioche bun.', price: '$7.60', img: U('photo-1606755962773-d324e0a13086'), bg: '#ffe2b8', tag: 'NEW' },
  { name: 'Crispy Fries', desc: 'Hand-cut, twice-fried and salted the second they leave the oil.', price: '$2.90', img: U('photo-1573080496219-bb080dd4f877'), bg: '#ffd23f' },
  { name: 'Slice Combo', desc: 'Two pepperoni slices and a drink of your choice. Ready in four minutes.', price: '$6.20', img: U('photo-1513104890138-7c749659a591'), bg: '#ffb340' },
  { name: 'Cola Float', desc: 'Ice-cold cola over two scoops of vanilla soft serve, served with a long spoon.', price: '$3.40', img: U('photo-1581636625402-29b2a704ef13'), bg: '#ffe2b8' },
];
const stores = [
  { name: 'Downtown', address: '412 Market St · corner of 5th', hours: '11AM – 2AM', note: 'Drive-thru' },
  { name: 'Riverside', address: '88 Pier Ave · next to the ferry', hours: '11AM – 2AM', note: 'Patio seating' },
  { name: 'Northgate Mall', address: 'Level 2, Food Court · Unit 214', hours: '10AM – 11PM', note: 'Pickup only' },
];

document.getElementById('menu-grid').innerHTML = menu.map((m, i) => `
  <article class="card reveal">
    <div class="art">
      <div class="bgc" style="background:${m.bg}"></div>
      <div class="img"><img src="${m.img}" alt="${m.name}" loading="lazy"></div>
      ${m.tag ? `<span class="tag">${m.tag}</span>` : ''}
    </div>
    <div><h3>${m.name}</h3><p>${m.desc}</p></div>
    <div class="row"><span class="price">${m.price}</span><button type="button" class="pill add" data-add="${i}"><i class="hgi hgi-stroke hgi-plus-sign" style="font-size:14px"></i>ADD</button></div>
  </article>`).join('');

document.getElementById('stores').innerHTML = stores.map(s => `
  <div class="store reveal">
    <i class="hgi hgi-stroke hgi-location-01"></i>
    <span><b>${s.name}</b><small>${s.address}</small></span>
    <span class="hrs"><b>${s.hours}</b><br><small>${s.note}</small></span>
  </div>`).join('') + `<a href="#" class="all">ALL STORES <i class="hgi hgi-stroke hgi-arrow-right-01" style="font-size:14px"></i></a>`;

const money = n => '$' + n.toFixed(2);
const toNum = p => parseFloat(p.replace('$', ''));
const FREE_OVER = 15;
const DELIVERY = 2.5;

let cart = [];
try { cart = JSON.parse(localStorage.getItem('bigbite-cart')) || []; } catch (e) { cart = []; }

const $ = id => document.getElementById(id);
const scrim = $('scrim'), drawer = $('drawer'), mnav = $('mnav');

function save() {
  try { localStorage.setItem('bigbite-cart', JSON.stringify(cart)); } catch (e) { }
}

function itemCount() { return cart.reduce((n, l) => n + l.qty, 0); }
function subtotal() { return cart.reduce((n, l) => n + toNum(menu[l.i].price) * l.qty, 0); }

function render() {
  const count = itemCount(), sub = subtotal();
  const badge = $('cart-count');
  badge.textContent = count;
  badge.classList.toggle('on', count > 0);
  $('cart-sub').textContent = count === 1 ? '1 ITEM' : count + ' ITEMS';

  const box = $('cart-items');
  if (!cart.length) {
    box.innerHTML = `<div class="empty">
      <i class="hgi hgi-stroke hgi-shopping-basket-01"></i>
      <b>Nothing here yet</b>
      <small>Add something from the menu and it will show up right here.</small>
    </div>`;
  } else {
    box.innerHTML = cart.map(l => {
      const m = menu[l.i];
      return `<div class="citem">
        <span class="thumb"><img src="${m.img}" alt="${m.name}"></span>
        <span><b>${m.name}</b><span class="unit">${m.price} each</span></span>
        <span>
          <span class="line">${money(toNum(m.price) * l.qty)}</span>
          <span class="qty">
            <button type="button" data-dec="${l.i}" aria-label="Decrease">&minus;</button>
            <span>${l.qty}</span>
            <button type="button" data-inc="${l.i}" aria-label="Increase">+</button>
          </span>
        </span>
      </div>`;
    }).join('');
  }

  const ship = sub === 0 ? 0 : (sub >= FREE_OVER ? 0 : DELIVERY);
  $('cart-subtotal').textContent = money(sub);
  $('cart-delivery').textContent = sub === 0 ? 'FREE OVER $15' : (ship === 0 ? 'FREE' : money(ship));
  $('cart-total').textContent = money(sub + ship);
  $('cart-checkout').disabled = !cart.length;
  save();
}

function addToCart(i, btn) {
  const line = cart.find(l => l.i === i);
  if (line) line.qty++; else cart.push({ i, qty: 1 });
  render();
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="hgi hgi-stroke hgi-tick-02" style="font-size:14px"></i>ADDED';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="hgi hgi-stroke hgi-plus-sign" style="font-size:14px"></i>ADD';
    }, 1100);
    fly(btn, menu[i].img);
  }
}

function fly(btn, src) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const from = btn.getBoundingClientRect();
  const to = $('cart-open').getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'burst';
  el.innerHTML = `<img src="${src}" alt="">`;
  el.style.left = from.left + 'px';
  el.style.top = from.top + 'px';
  document.body.appendChild(el);
  el.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(.25)`, opacity: .2 }
  ], { duration: 650, easing: 'cubic-bezier(.4,.1,.3,1)' }).onfinish = () => el.remove();
}

function openDrawer() { drawer.classList.add('on'); scrim.classList.add('on'); document.body.style.overflow = 'hidden'; }
function closeAll() {
  drawer.classList.remove('on');
  mnav.classList.remove('on');
  scrim.classList.remove('on');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) { addToCart(+add.dataset.add, add); return; }
  const inc = e.target.closest('[data-inc]');
  if (inc) { const l = cart.find(x => x.i === +inc.dataset.inc); if (l) l.qty++; render(); return; }
  const dec = e.target.closest('[data-dec]');
  if (dec) {
    const i = +dec.dataset.dec, l = cart.find(x => x.i === i);
    if (l && --l.qty <= 0) cart = cart.filter(x => x.i !== i);
    render();
  }
});

$('cart-open').addEventListener('click', openDrawer);
$('cart-close').addEventListener('click', closeAll);
scrim.addEventListener('click', closeAll);
$('nav-open').addEventListener('click', () => { mnav.classList.add('on'); document.body.style.overflow = 'hidden'; });
$('nav-close').addEventListener('click', closeAll);
mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeAll));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

const drawerEl = $('drawer');
function setStep(step) {
  drawerEl.dataset.step = step;
  $('drawer-title').textContent = step === 'cart' ? 'YOUR ORDER' : step === 'form' ? 'YOUR DETAILS' : 'ALL DONE';
  if (step === 'form') $('form-total').textContent = $('cart-total').textContent;
}

$('cart-checkout').addEventListener('click', () => { if (cart.length) setStep('form'); });
$('step-back').addEventListener('click', () => setStep('cart'));

$('place-order').addEventListener('click', () => {
  const form = $('order-form');
  const required = ['name', 'phone', 'address'];
  let bad = null;
  required.forEach(n => {
    const f = form.elements[n];
    const ok = f.value.trim().length > 1;
    f.classList.toggle('bad', !ok);
    if (!ok && !bad) bad = f;
  });
  if (bad) { bad.focus(); return; }

  const btn = $('place-order');
  btn.classList.add('busy');
  btn.innerHTML = 'PLACING ORDER <i class="hgi hgi-stroke hgi-loading-03" style="font-size:17px"></i>';

  setTimeout(() => {
    $('ord-no').textContent = '#BB-' + String(Math.floor(1000 + Math.random() * 9000));
    $('ord-eta').textContent = (18 + Math.floor(Math.random() * 8)) + 'm';
    $('ord-total').textContent = $('cart-total').textContent;
    setStep('done');
    btn.classList.remove('busy');
    btn.innerHTML = 'ORDER NOW <i class="hgi hgi-stroke hgi-delivery-truck-01" style="font-size:17px"></i>';
  }, 900);
});

$('order-done').addEventListener('click', () => {
  cart = [];
  render();
  closeAll();
  setTimeout(() => { setStep('cart'); $('order-form').reset(); }, 450);
});

render();

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Mouse parallax in hero
const hero = document.getElementById('hero');
const layers = hero.querySelectorAll('.layer');
hero.addEventListener('mousemove', e => {
  if (window.innerWidth < 980) return;
  const r = hero.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  layers.forEach(l => {
    const d = +l.dataset.depth, dy = l.dataset.depthY ? +l.dataset.depthY : d;
    l.style.transform = `translate(${x * d}px, ${y * dy}px)`;
  });
});
hero.addEventListener('mouseleave', () => layers.forEach(l => l.style.transform = ''));

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', ev => {
  const t = a.getAttribute('href'); if (t.length < 2) { ev.preventDefault(); return; }
  const el = document.querySelector(t); if (!el) return;
  ev.preventDefault(); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
}));