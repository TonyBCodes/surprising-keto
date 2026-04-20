/* ============================================================
   app.js — Shared components: nav, footer, subscribe, utils
   ============================================================ */

/* ---------- Navigation ---------- */
function renderNav(activePage) {
  const nav = [
    { href: '/recipes/', label: 'Recipes' },
    { href: '/blog/', label: 'Blog' },
    { href: '/submit/', label: 'Submit a Recipe' },
    { href: '/about/', label: 'Our Story' },
    { href: '/getting-started/', label: 'Getting Started' },
    { href: '/where-to-shop/', label: 'Where to Shop' },
  ];

  const links = nav.map(n => {
    const active = activePage === n.label ? 'active' : '';
    return `<li><a href="${n.href}" class="${active}">${n.label}</a></li>`;
  }).join('');

  document.getElementById('site-nav').innerHTML = `
    <div class="nav-inner">
      <a href="/" class="nav-brand">The <span>Surprising</span> Keto Journey</a>
      <button class="nav-hamburger" onclick="toggleMobileNav()" aria-label="Menu">&#9776;</button>
      <ul class="nav-links" id="navLinks">
        ${links}
        <li><a href="/subscribe/" class="nav-subscribe">Subscribe</a></li>
      </ul>
    </div>
  `;
}

function toggleMobileNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

/* ---------- Footer ---------- */
function renderFooter() {
  document.getElementById('site-footer').innerHTML = `
    <div class="footer-inner">
      <div class="footer-subscribe-bar">
        <p>Get notified when new recipes are added — free, no spam, unsubscribe anytime.</p>
        <input type="email" id="footerEmail" placeholder="Your email address" style="max-width:220px;">
        <button class="btn btn-primary btn-sm" onclick="footerSubscribe()">Subscribe</button>
      </div>
      <div class="footer-grid">
        <div class="footer-brand">
          <h3>The Surprising Keto Journey</h3>
          <p>Real food. Real cuisines. Real results. A Mediterranean-ketogenic approach built on flavor, culture, and cooking technique — not deprivation.</p>
        </div>
        <div class="footer-col">
          <h4>Recipes</h4>
          <ul>
            <li><a href="/recipes/">Browse all</a></li>
            <li><a href="/recipes/?cat=Dinner">Dinner</a></li>
            <li><a href="/recipes/?cat=Breakfast">Breakfast</a></li>
            <li><a href="/recipes/?cat=Sides">Side dishes</a></li>
            <li><a href="/recipes/?cat=Sauces">Sauces</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Site</h4>
          <ul>
            <li><a href="/about/">Our story</a></li>
            <li><a href="/getting-started/">Getting started</a></li>
            <li><a href="/where-to-shop/">Where to shop</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/submit/">Submit a recipe</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy/">Privacy policy</a></li>
            <li><a href="/terms/">Terms of use</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} The Surprising Keto Journey. All rights reserved.</span>
        <span>surprisingketo.com</span>
      </div>
    </div>
  `;
}

/* ---------- Inline Subscribe Component ---------- */
function renderSubscribeInline(containerId, context) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="subscribe-inline">
      <div class="section-label">Stay in the loop</div>
      <h3>New recipes added regularly</h3>
      <p>Get notified when we add new dishes. We batch our emails — no spam, just real updates.</p>
      <div class="subscribe-form-row" id="subRow_${containerId}">
        <input type="text"  id="subName_${containerId}"  placeholder="First name" style="max-width:160px;">
        <input type="email" id="subEmail_${containerId}" placeholder="Email address">
        <button class="btn btn-primary" onclick="inlineSubscribe('${containerId}')">Notify me</button>
      </div>
      <div class="alert alert-success" id="subSuccess_${containerId}">
        You're on the list! We'll notify you when new recipes are published.
      </div>
    </div>
  `;
}

/* ---------- Subscribe Logic ---------- */
async function inlineSubscribe(containerId) {
  const name  = document.getElementById(`subName_${containerId}`).value.trim();
  const email = document.getElementById(`subEmail_${containerId}`).value.trim();
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }

  try {
    await submitSubscriber({ name, email });
    document.getElementById(`subRow_${containerId}`).style.display = 'none';
    showAlert(`subSuccess_${containerId}`);
  } catch (e) {
    alert('Something went wrong. Please try again.');
    console.error(e);
  }
}

async function footerSubscribe() {
  const email = document.getElementById('footerEmail').value.trim();
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  try {
    await submitSubscriber({ email });
    document.getElementById('footerEmail').value = '';
    alert('You\'re subscribed! We\'ll notify you when new recipes are published.');
  } catch (e) {
    alert('Something went wrong. Please try again.');
  }
}

/* ---------- Supabase Integration ---------- */
// Replace these with your actual Supabase project URL and anon key after setup
const SUPABASE_URL  = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';

async function supabaseFetch(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

async function submitSubscriber(data) {
  return supabaseFetch('subscribers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function submitRecipe(data) {
  return supabaseFetch('submissions', {
    method: 'POST',
    body: JSON.stringify({ ...data, status: 'pending' }),
  });
}

/* ---------- Utilities ---------- */
function showAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('visible');
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ---------- Recipe Card Builder ---------- */
function buildRecipeCard(r) {
  const methods = (r.methods || []).map(m => `<span class="method-pill">${m}</span>`).join('');
  const yeast   = r.yeast_flag ? `<span class="badge badge-yeast">verify label</span>` : '';
  return `
    <a href="/recipe/?id=${r.id}" class="recipe-card card" style="text-decoration:none;">
      <div class="card-body">
        <div class="card-meta">
          <span class="badge badge-cuisine">${r.cuisine}</span>
          ${r.protein ? `<span class="badge badge-method">${r.protein}</span>` : ''}
          ${yeast}
        </div>
        <div class="card-title">${r.title}</div>
        <div class="card-sub">${r.description || ''}</div>
      </div>
      <div class="card-footer">
        <span class="carb-val">${r.net_carbs} net carbs</span>
        <div class="method-list">${methods}</div>
      </div>
    </a>
  `;
}
