const STORAGE_KEY = 'leperfumcg_products';
const BUSINESS_KEY = 'leperfumcg_business';
const USERS_KEY = 'leperfumcg_users';
const CATEGORIES_KEY = 'leperfumcg_categories';
const ORDERS_KEY = 'leperfumcg_orders';
const CUSTOMERS_KEY = 'leperfumcg_customers';
const REVIEWS_KEY = 'leperfumcg_reviews';
const COUPONS_KEY = 'leperfumcg_coupons';
const BANNERS_KEY = 'leperfumcg_banners';
const GITHUB_TOKEN_KEY = 'leperfumcg_github_token';
const REPO_OWNER = 'LEPERFUMCG';
const REPO_NAME = 'leperfumcg';
const REPO_BRANCH = 'main';

const defaultBusiness = {
    name: 'LE PERFUM CG', slogan: 'Perfumería Fina', phone: '+504 8888-8888',
    whatsapp: '+504 8888-8888', email: 'leperfumcg@email.com', address: 'San Pedro Sula, Honduras',
    currency: 'HNL', exchangeRate: 24.50, globalDiscount: 0,
    facebook: '', instagram: '', tiktok: '', footer: 'Todos los derechos reservados'
};

const defaultUsers = [
    { id: 1, email: 'admin@leperfumcg.com', password: 'admin123', name: 'Administrador', role: 'admin' }
];

const defaultProducts = [
    { id: 1, name: "Oud Royal", category: "perfume", type: ["arabe"], gender: "unisex", brand: "Attar Collection", price: 85, discount: 10, description: "Una fragancia misteriosa y elegante.", features: ["50ml", "Duración: 8-12 horas"], notes: { top: "Pimienta negra", heart: "Oud", base: "Ámbar oscuro" }, image: "", tags: ["nuevo", "exclusivo"], sku: "PERF-001", stock: 10, condition: "new", olfactory: "oriental", occasion: "noche", size: "50ml", concentration: "Eau de Parfum", origin: "UAE", rating: 4.8, reviewCount: 24 },
    { id: 2, name: "Bleu de Chanel", category: "perfume", type: ["disenador"], gender: "hombre", brand: "Chanel", price: 120, discount: 0, description: "Fresca, aromática y magnética.", features: ["100ml EDP", "Duración: 8-10 horas"], notes: { top: "Limón, Menta", heart: "Jengibre", base: "Sándalo" }, image: "", tags: ["bestseller"], sku: "PERF-002", stock: 5, condition: "new", olfactory: "citrico", occasion: "diario", size: "100ml", concentration: "Eau de Parfum", origin: "Francia", rating: 4.5, reviewCount: 18 }
];

const defaultCategories = [
    { id: 1, name: 'Perfume', icon: '🌸', isDefault: true }
];

// ---- Getters ----
function getProducts() { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts)); return defaultProducts; }
function saveProducts(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
function getBusiness() { const s = localStorage.getItem(BUSINESS_KEY); if (s) return JSON.parse(s); localStorage.setItem(BUSINESS_KEY, JSON.stringify(defaultBusiness)); return defaultBusiness; }
function saveBusiness(b) { localStorage.setItem(BUSINESS_KEY, JSON.stringify(b)); }
function getUsers() { const s = localStorage.getItem(USERS_KEY); if (s) return JSON.parse(s); localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers)); return defaultUsers; }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getCategories() { const s = localStorage.getItem(CATEGORIES_KEY); if (s) return JSON.parse(s); localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories)); return defaultCategories; }
function saveCategories(c) { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(c)); }
function getOrders() { const s = localStorage.getItem(ORDERS_KEY); return s ? JSON.parse(s) : []; }
function saveOrders(o) { localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); }
function getCustomers() { const s = localStorage.getItem(CUSTOMERS_KEY); return s ? JSON.parse(s) : []; }
function getReviews() { const s = localStorage.getItem(REVIEWS_KEY); return s ? JSON.parse(s) : []; }
function getCoupons() { const s = localStorage.getItem(COUPONS_KEY); return s ? JSON.parse(s) : []; }
function saveCoupons(c) { localStorage.setItem(COUPONS_KEY, JSON.stringify(c)); }
function getBanners() { const s = localStorage.getItem(BANNERS_KEY); return s ? JSON.parse(s) : []; }
function saveBanners(b) { localStorage.setItem(BANNERS_KEY, JSON.stringify(b)); }

function loginUser(email, password) { return getUsers().find(u => u.email === email && u.password === password); }
function formatPrice(p) { return 'L. ' + ((p || 0) * (getBusiness().exchangeRate || 24.50)).toFixed(2); }

// ---- Sidebar Navigation ----
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
const allSections = document.querySelectorAll('.admin-section');
const topbarTitle = document.getElementById('topbarTitle');
const sectionTitles = { dashboard:'Dashboard', products:'Productos', categories:'Categorías', orders:'Pedidos', customers:'Clientes', users:'Usuarios', coupons:'Cupones', banners:'Banners', reviews:'Reseñas', inventory:'Inventario', reports:'Reportes', business:'Mi Negocio' };

sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const sec = this.dataset.section;
        allSections.forEach(s => s.style.display = 'none');
        document.getElementById(sec + 'Section').style.display = 'block';
        topbarTitle.textContent = sectionTitles[sec] || sec;
        document.getElementById('sidebar').classList.remove('open');
        if (sec === 'dashboard') renderDashboard();
        if (sec === 'products') renderProductsTable();
        if (sec === 'categories') renderCategoriesList();
        if (sec === 'orders') renderOrdersTable();
        if (sec === 'customers') renderCustomersTable();
        if (sec === 'users') renderUsersList();
        if (sec === 'coupons') renderCouponsList();
        if (sec === 'banners') renderBannersList();
        if (sec === 'reviews') renderReviewsList();
        if (sec === 'inventory') renderInventoryTable();
        if (sec === 'reports') renderReports();
        if (sec === 'business') loadBusinessInfo();
    });
});

// Sidebar toggle (mobile)
document.getElementById('sidebarToggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('adminMain').addEventListener('click', () => document.getElementById('sidebar').classList.remove('open'));

// ---- Login ----
const loginContainer = document.getElementById('loginContainer');
const adminShell = document.getElementById('adminShell');
if (localStorage.getItem('admin_logged_in')) showAdminPanel();

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = loginUser(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
    if (user) { localStorage.setItem('admin_logged_in', 'true'); localStorage.setItem('current_user', JSON.stringify(user)); showAdminPanel(); }
    else { alert('Correo o contraseña incorrectos'); }
});

function showAdminPanel() { loginContainer.style.display = 'none'; adminShell.style.display = 'flex'; updateAccountInfo(); renderDashboard(); populateCategorySelect(); populateFilterCategory(); }

function updateAccountInfo() {
    const user = JSON.parse(localStorage.getItem('current_user'));
    if (!user) return;
    const initial = (user.name || 'U').charAt(0).toUpperCase();
    ['accountAvatar','dropdownAvatar','avatarMobile','ddAvatarMobile'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = initial; });
    const dn = document.getElementById('dropdownName'); if (dn) dn.textContent = user.name;
    const de = document.getElementById('dropdownEmail'); if (de) de.textContent = user.email;
    const mn = document.getElementById('ddNameMobile'); if (mn) mn.textContent = user.name;
    const me = document.getElementById('ddEmailMobile'); if (me) me.textContent = user.email;
}

// Account menus
['accountMenu','accountMenuMobile'].forEach(id => {
    const menu = document.getElementById(id);
    if (!menu) return;
    const btn = menu.querySelector('.account-btn');
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); menu.classList.toggle('open'); });
});
document.addEventListener('click', () => { document.querySelectorAll('.account-menu').forEach(m => m.classList.remove('open')); });

// Logout
['logoutBtn','logoutBtnMobile'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => { localStorage.removeItem('admin_logged_in'); localStorage.removeItem('current_user'); location.reload(); });
});

// Profile
['profileBtn','profileBtnMobile'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => {
        document.querySelectorAll('.account-menu').forEach(m => m.classList.remove('open'));
        const user = JSON.parse(localStorage.getItem('current_user'));
        if (user) { document.getElementById('profileName').value = user.name; document.getElementById('profileEmail').value = user.email; document.getElementById('profilePassword').value = ''; }
        document.getElementById('profileModal').style.display = 'flex';
    });
});

document.getElementById('closeProfileModal').addEventListener('click', () => document.getElementById('profileModal').style.display = 'none');
document.getElementById('cancelProfileBtn').addEventListener('click', () => document.getElementById('profileModal').style.display = 'none');
document.getElementById('profileModal').addEventListener('click', function(e) { if (e.target === this) this.style.display = 'none'; });

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('current_user'));
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
        users[idx].name = document.getElementById('profileName').value;
        users[idx].email = document.getElementById('profileEmail').value;
        const np = document.getElementById('profilePassword').value;
        if (np) users[idx].password = np;
        saveUsers(users);
        localStorage.setItem('current_user', JSON.stringify(users[idx]));
        updateAccountInfo();
    }
    document.getElementById('profileModal').style.display = 'none';
});

// ========================================
// DASHBOARD
// ========================================
function renderDashboard() {
    const products = getProducts();
    const orders = getOrders();
    const customers = getCustomers();
    const exchangeRate = getBusiness().exchangeRate || 24.50;

    document.getElementById('statProducts').textContent = products.length;
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statCustomers').textContent = customers.length;

    const revenue = orders.filter(o => o.status !== 'cancelado').reduce((s, o) => s + (o.total || 0), 0);
    document.getElementById('statRevenue').textContent = 'L. ' + (revenue * exchangeRate).toFixed(2);

    // Recent orders
    const recentEl = document.getElementById('recentOrdersList');
    const recentOrders = orders.slice().reverse().slice(0, 5);
    if (recentOrders.length === 0) { recentEl.innerHTML = '<p class="text-muted" style="padding:12px 0;">No hay pedidos recientes.</p>'; }
    else {
        recentEl.innerHTML = recentOrders.map(o => {
            const statusLabels = { pendiente:'Pendiente', confirmado:'Confirmado', preparando:'Preparando', enviado:'Enviado', entregado:'Entregado', cancelado:'Cancelado' };
            return '<div class="dashboard-list-item"><span><strong>#' + o.id.toString().slice(-8) + '</strong> - ' + (o.customer ? o.customer.name : 'N/A') + '</span><span class="status-badge status-' + o.status + '">' + (statusLabels[o.status] || o.status) + '</span></div>';
        }).join('');
    }

    // Low stock
    const lowStockEl = document.getElementById('lowStockList');
    const lowStock = products.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 5);
    if (lowStock.length === 0) { lowStockEl.innerHTML = '<p class="text-muted" style="padding:12px 0;">Todos los productos tienen stock suficiente.</p>'; }
    else {
        lowStockEl.innerHTML = lowStock.map(p => {
            const cls = p.stock === 0 ? 'stock-out' : 'stock-low';
            return '<div class="dashboard-list-item"><span>' + p.name + ' (' + (p.brand || '') + ')</span><span class="stock-badge ' + cls + '">' + p.stock + ' uds</span></div>';
        }).join('');
    }
}

// ========================================
// PRODUCTS TABLE
// ========================================
function populateCategorySelect() {
    const cats = getCategories();
    const sel = document.getElementById('productCategory');
    if (!sel) return;
    sel.innerHTML = '';
    cats.forEach(c => { const o = document.createElement('option'); o.value = c.name.toLowerCase(); o.textContent = (c.icon || '') + ' ' + c.name; sel.appendChild(o); });
}

function populateFilterCategory() {
    const cats = getCategories();
    const sel = document.getElementById('filterCategory');
    if (!sel) return;
    sel.innerHTML = '<option value="all">Todas</option>';
    cats.forEach(c => { const o = document.createElement('option'); o.value = c.name.toLowerCase(); o.textContent = (c.icon || '') + ' ' + c.name; sel.appendChild(o); });
}

function renderProductsTable() {
    let products = getProducts();
    const catF = document.getElementById('filterCategory').value;
    const typeF = document.getElementById('filterType').value;
    const genderF = document.getElementById('filterGender').value;

    if (catF !== 'all') products = products.filter(p => p.category === catF);
    if (typeF !== 'all') products = products.filter(p => p.type && p.type.includes(typeF));
    if (genderF !== 'all') products = products.filter(p => p.gender === genderF);

    const tbody = document.getElementById('productsTableBody');
    const empty = document.getElementById('emptyProducts');
    const table = document.querySelector('#productsSection .products-table');
    tbody.innerHTML = '';

    if (products.length === 0) { table.style.display = 'none'; empty.style.display = 'block'; return; }
    table.style.display = 'block'; empty.style.display = 'none';

    const typeLabels = { arabe:'Árabe', disenador:'Diseñador', replica:'Réplica', artesanal:'Artesanal' };
    const genderLabels = { hombre:'Hombre', mujer:'Mujer', unisex:'Unisex' };
    const olfactoryLabels = { amaderado:'Amaderado', citrico:'Cítrico', floral:'Floral', oriental:'Oriental', gourmand:'Gourmand', cuero:'Cuero' };
    const occasionLabels = { noche:'Noche', diario:'Diario', verano:'Verano', invierno:'Invierno' };

    products.forEach(p => {
        const photo = p.image ? '<img src="' + p.image + '" class="table-thumb">' : '<div class="no-photo">🌸</div>';
        const types = (p.type || []).map(t => '<span class="type-tag">' + (typeLabels[t] || t) + '</span>').join(' ');
        const priceHTML = p.discount > 0
            ? '<span class="price-original">L. ' + p.price.toFixed(2) + '</span><span class="price-discount">L. ' + (p.price * (1 - p.discount / 100)).toFixed(2) + '</span>'
            : '<span class="price-normal">L. ' + p.price.toFixed(2) + '</span>';
        const stock = p.stock || 0;
        let stockCls = 'stock-ok', stockLbl = stock + ' disp.';
        if (stock === 0) { stockCls = 'stock-out'; stockLbl = 'Agotado'; } else if (stock <= 5) { stockCls = 'stock-low'; stockLbl = stock + ' disp.'; }
        const condCls = p.condition === 'used' ? 'condition-used' : 'condition-new';
        const condLbl = p.condition === 'used' ? 'Usado' : 'Nuevo';

        const row = document.createElement('tr');
        row.innerHTML = '<td>' + photo + '</td><td><strong>' + p.name + '</strong><br><small class="text-muted">' + (p.brand || '') + '</small></td><td>' + (types || '<span class="text-muted">-</span>') + '</td><td>' + (genderLabels[p.gender] || '-') + '</td><td>' + priceHTML + '</td><td>' + (p.discount > 0 ? p.discount + '%' : '<span class="text-muted">-</span>') + '</td><td>' + (p.sku || '<span class="text-muted">-</span>') + '</td><td><span class="stock-badge ' + stockCls + '">' + stockLbl + '</span></td><td><span class="condition-badge ' + condCls + '">' + condLbl + '</span></td><td>' + (olfactoryLabels[p.olfactory] || '<span class="text-muted">-</span>') + '</td><td>' + (occasionLabels[p.occasion] || '<span class="text-muted">-</span>') + '</td><td class="actions-btn"><button class="btn-edit" onclick="editProduct(' + p.id + ')">Editar</button><button class="btn-delete" onclick="deleteProduct(' + p.id + ')">Eliminar</button></td>';
        tbody.appendChild(row);
    });
}

document.getElementById('filterCategory').addEventListener('change', renderProductsTable);
document.getElementById('filterType').addEventListener('change', renderProductsTable);
document.getElementById('filterGender').addEventListener('change', renderProductsTable);

// ---- Product Form ----
let currentImageData = '';

document.getElementById('addNewBtn').addEventListener('click', () => { resetProductForm(); showSection('formSection'); });
document.getElementById('mobileAddBtn').addEventListener('click', () => { resetProductForm(); showSection('formSection'); });
document.getElementById('cancelBtn').addEventListener('click', () => { showSection('productsSection'); sidebarLinks.forEach(l => l.classList.remove('active')); document.querySelector('[data-section="products"]').classList.add('active'); renderProductsTable(); });

function showSection(id) { allSections.forEach(s => s.style.display = 'none'); document.getElementById(id).style.display = 'block'; }

function resetProductForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('formTitle').textContent = 'Agregar Producto';
    currentImageData = '';
    document.getElementById('imagePreview').innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    document.getElementById('removeImage').style.display = 'none';
    document.getElementById('productSku').value = '';
    document.getElementById('productStock').value = '0';
    document.getElementById('productCondition').value = 'new';
    document.getElementById('productOlfactory').value = '';
    document.getElementById('productOccasion').value = '';
    document.getElementById('productNotesTop').value = '';
    document.getElementById('productNotesHeart').value = '';
    document.getElementById('productNotesBase').value = '';
    document.getElementById('productSize').value = '';
    document.getElementById('productConcentration').value = '';
    document.getElementById('productOrigin').value = '';
    document.querySelectorAll('input[name="productType"]').forEach(cb => cb.checked = false);
}

// Image upload
document.getElementById('imageUpload').addEventListener('click', () => document.getElementById('productImage').click());
document.getElementById('productImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500000) { alert('Máximo 500KB.'); return; }
    const reader = new FileReader();
    reader.onload = function(ev) { currentImageData = ev.target.result; document.getElementById('imagePreview').innerHTML = '<img src="' + currentImageData + '">'; document.getElementById('removeImage').style.display = 'block'; };
    reader.readAsDataURL(file);
});

document.getElementById('removeImage').addEventListener('click', function() {
    currentImageData = '';
    document.getElementById('imagePreview').innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    document.getElementById('productImage').value = '';
    this.style.display = 'none';
});

// Auto description
function generateDescription(name, brand, category, type, gender) {
    if (!name || !brand) return '';
    const typeDesc = { arabe:'con esencias orientales y árabes', disenador:'de la casa de diseñador', replica:'réplica de alta calidad', artesanal:'elaborado artesanalmente' };
    const genderDesc = { hombre:'para hombre', mujer:'para mujer', unisex:'unisex' };
    if (category === 'perfume') {
        const td = type.length > 0 ? typeDesc[type[0]] || '' : '';
        const gd = genderDesc[gender] || 'unisex';
        return brand + ' presenta ' + name + (td ? ', ' + td : '') + '. Fragancia ' + gd + ' con notas elegantes y sofisticadas.';
    }
    return brand + ' - ' + name + '. Producto de alta calidad.';
}

function autoGenerateDescription() {
    const name = document.getElementById('productName').value.trim();
    const brand = document.getElementById('productBrand').value.trim();
    const cat = document.getElementById('productCategory').value;
    const types = Array.from(document.querySelectorAll('#typeGroup input:checked')).map(cb => cb.value);
    const gender = document.getElementById('productGender').value;
    const desc = document.getElementById('productDescription');
    if (!desc.value.trim() && name && brand) desc.value = generateDescription(name, brand, cat, types, gender);
}

document.getElementById('productName').addEventListener('input', autoGenerateDescription);
document.getElementById('productBrand').addEventListener('input', autoGenerateDescription);
document.getElementById('productGender').addEventListener('change', autoGenerateDescription);
document.querySelectorAll('#typeGroup input[type="checkbox"]').forEach(cb => cb.addEventListener('change', autoGenerateDescription));
document.getElementById('regenerateDesc').addEventListener('click', () => {
    const name = document.getElementById('productName').value.trim();
    const brand = document.getElementById('productBrand').value.trim();
    if (!name || !brand) { alert('Escribe nombre y marca primero.'); return; }
    const types = Array.from(document.querySelectorAll('#typeGroup input:checked')).map(cb => cb.value);
    document.getElementById('productDescription').value = generateDescription(name, brand, document.getElementById('productCategory').value, types, document.getElementById('productGender').value);
});

// Type/gender show/hide
document.getElementById('productCategory').addEventListener('change', function() {
    const isPerfume = this.value === 'perfume';
    document.getElementById('typeGroup').style.display = isPerfume ? 'block' : 'none';
    document.getElementById('genderGroup').style.display = isPerfume ? 'block' : 'none';
});

// Edit product
window.editProduct = function(id) {
    const p = getProducts().find(pr => pr.id === id);
    if (!p) return;
    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name;
    document.getElementById('productBrand').value = p.brand || '';
    document.getElementById('productCategory').value = p.category;
    document.getElementById('productPrice').value = p.price;
    document.getElementById('productDiscount').value = p.discount || 0;
    document.getElementById('productDescription').value = p.description || '';
    document.getElementById('productFeatures').value = (p.features || []).join('\n');
    document.getElementById('productTags').value = (p.tags || []).join(', ');
    document.getElementById('productGender').value = p.gender || 'unisex';
    document.getElementById('productSku').value = p.sku || '';
    document.getElementById('productStock').value = p.stock || 0;
    document.getElementById('productCondition').value = p.condition || 'new';
    document.getElementById('productOlfactory').value = p.olfactory || '';
    document.getElementById('productOccasion').value = p.occasion || '';
    document.getElementById('productNotesTop').value = (p.notes && p.notes.top) || '';
    document.getElementById('productNotesHeart').value = (p.notes && p.notes.heart) || '';
    document.getElementById('productNotesBase').value = (p.notes && p.notes.base) || '';
    document.getElementById('productSize').value = p.size || '';
    document.getElementById('productConcentration').value = p.concentration || '';
    document.getElementById('productOrigin').value = p.origin || '';
    document.querySelectorAll('input[name="productType"]').forEach(cb => cb.checked = (p.type || []).includes(cb.value));
    if (p.image) { currentImageData = p.image; document.getElementById('imagePreview').innerHTML = '<img src="' + p.image + '">'; document.getElementById('removeImage').style.display = 'block'; }
    else { currentImageData = ''; document.getElementById('imagePreview').innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'; document.getElementById('removeImage').style.display = 'none'; }
    const isPerfume = p.category === 'perfume';
    document.getElementById('typeGroup').style.display = isPerfume ? 'block' : 'none';
    document.getElementById('genderGroup').style.display = isPerfume ? 'block' : 'none';
    document.getElementById('formTitle').textContent = 'Editar Producto';
    showSection('formSection');
};

window.deleteProduct = function(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    saveProducts(getProducts().filter(p => p.id !== id));
    renderProductsTable();
};

document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const products = getProducts();
    const pid = document.getElementById('productId').value;
    const features = document.getElementById('productFeatures').value.split('\n').filter(f => f.trim());
    const tags = document.getElementById('productTags').value.split(',').map(t => t.trim()).filter(t => t);
    const selectedTypes = Array.from(document.querySelectorAll('input[name="productType"]:checked')).map(cb => cb.value);

    const data = {
        name: document.getElementById('productName').value,
        brand: document.getElementById('productBrand').value,
        category: document.getElementById('productCategory').value,
        type: selectedTypes,
        gender: document.getElementById('productGender').value,
        price: parseFloat(document.getElementById('productPrice').value),
        discount: parseInt(document.getElementById('productDiscount').value) || 0,
        description: document.getElementById('productDescription').value,
        features: features,
        notes: { top: document.getElementById('productNotesTop').value, heart: document.getElementById('productNotesHeart').value, base: document.getElementById('productNotesBase').value },
        image: currentImageData,
        tags: tags,
        sku: document.getElementById('productSku').value,
        stock: parseInt(document.getElementById('productStock').value) || 0,
        condition: document.getElementById('productCondition').value,
        olfactory: document.getElementById('productOlfactory').value,
        occasion: document.getElementById('productOccasion').value,
        size: document.getElementById('productSize').value,
        concentration: document.getElementById('productConcentration').value,
        origin: document.getElementById('productOrigin').value,
    };

    if (pid) {
        const idx = products.findIndex(p => p.id === parseInt(pid));
        if (idx !== -1) products[idx] = { ...products[idx], ...data };
    } else {
        data.id = Date.now();
        data.rating = 0;
        data.reviewCount = 0;
        products.push(data);
    }

    saveProducts(products);
    showSection('productsSection');
    sidebarLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-section="products"]').classList.add('active');
    renderProductsTable();
});

// ========================================
// CATEGORIES
// ========================================
function renderCategoriesList() {
    const cats = getCategories();
    const products = getProducts();
    const list = document.getElementById('categoriesList');
    list.innerHTML = '';
    cats.forEach(c => {
        const count = products.filter(p => p.category === c.name.toLowerCase()).length;
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = '<div class="category-item-info"><div class="category-item-icon">' + (c.icon || '📦') + '</div><div><div class="category-item-name">' + c.name + (c.isDefault ? '<span class="category-item-default">(default)</span>' : '') + '</div><div class="category-item-count">' + count + ' producto' + (count !== 1 ? 's' : '') + '</div></div></div><div class="category-item-actions"><button class="btn-edit" onclick="editCategory(' + c.id + ')">Editar</button><button class="btn-delete" onclick="deleteCategory(' + c.id + ')">Eliminar</button></div>';
        list.appendChild(item);
    });
}

document.getElementById('addCategoryBtn').addEventListener('click', () => { document.getElementById('categoryFormBox').style.display = 'block'; document.getElementById('categoryName').value = ''; document.getElementById('categoryIcon').value = ''; document.getElementById('editCategoryId').value = ''; document.getElementById('addCategoryBtn').style.display = 'none'; });
document.getElementById('cancelCategoryBtn').addEventListener('click', () => { document.getElementById('categoryFormBox').style.display = 'none'; document.getElementById('addCategoryBtn').style.display = 'block'; });

document.getElementById('saveCategoryBtn').addEventListener('click', function() {
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value.trim() || '📦';
    if (!name) { alert('Ingresa un nombre'); return; }
    const cats = getCategories();
    const editId = document.getElementById('editCategoryId').value;
    if (editId) {
        const idx = cats.findIndex(c => c.id === parseInt(editId));
        if (idx !== -1) { const oldName = cats[idx].name.toLowerCase(); cats[idx].name = name; cats[idx].icon = icon; if (oldName !== name.toLowerCase()) { getProducts().forEach(p => { if (p.category === oldName) p.category = name.toLowerCase(); }); saveProducts(getProducts()); } }
    } else {
        if (cats.some(c => c.name.toLowerCase() === name.toLowerCase())) { alert('Ya existe'); return; }
        cats.push({ id: Date.now(), name: name, icon: icon, isDefault: false });
    }
    saveCategories(cats); populateCategorySelect(); populateFilterCategory(); renderCategoriesList();
    document.getElementById('categoryFormBox').style.display = 'none';
    document.getElementById('addCategoryBtn').style.display = 'block';
});

window.editCategory = function(id) {
    const cat = getCategories().find(c => c.id === id);
    if (!cat) return;
    document.getElementById('categoryName').value = cat.name;
    document.getElementById('categoryIcon').value = cat.icon || '';
    document.getElementById('editCategoryId').value = cat.id;
    document.getElementById('categoryFormBox').style.display = 'block';
    document.getElementById('addCategoryBtn').style.display = 'none';
};

window.deleteCategory = function(id) {
    const cats = getCategories();
    const cat = cats.find(c => c.id === id);
    if (!cat) return;
    const count = getProducts().filter(p => p.category === cat.name.toLowerCase()).length;
    const fallback = cats.find(c => c.id !== id);
    if (count > 0 && !confirm('Hay ' + count + ' productos en "' + cat.name + '". Se moverán a "' + (fallback ? fallback.name : 'Sin categoría') + '". ¿Continuar?')) return;
    if (count > 0) { getProducts().forEach(p => { if (p.category === cat.name.toLowerCase()) p.category = fallback ? fallback.name.toLowerCase() : 'sin-categoria'; }); saveProducts(getProducts()); }
    saveCategories(cats.filter(c => c.id !== id)); populateCategorySelect(); populateFilterCategory(); renderCategoriesList(); renderProductsTable();
};

// ========================================
// ORDERS
// ========================================
function renderOrdersTable() {
    const orders = getOrders();
    const filter = document.getElementById('filterOrderStatus').value;
    let filtered = orders.slice();
    if (filter !== 'all') filtered = filtered.filter(o => o.status === filter);
    filtered.reverse();

    const tbody = document.getElementById('ordersTableBody');
    const empty = document.getElementById('emptyOrders');
    const table = document.querySelector('#ordersSection .products-table');
    tbody.innerHTML = '';

    if (filtered.length === 0) { table.style.display = 'none'; empty.style.display = 'block'; return; }
    table.style.display = 'block'; empty.style.display = 'none';

    const statusLabels = { pendiente:'Pendiente', confirmado:'Confirmado', preparando:'Preparando', enviado:'Enviado', entregado:'Entregado', cancelado:'Cancelado' };

    filtered.forEach(o => {
        const itemsText = (o.items || []).map(i => i.name + ' x' + i.qty).join(', ');
        const row = document.createElement('tr');
        row.innerHTML = '<td><strong>#' + o.id.toString().slice(-8) + '</strong></td><td>' + (o.customer ? o.customer.name : 'N/A') + '</td><td>' + (o.customer ? o.customer.phone || '-' : '-') + '</td><td><small>' + itemsText + '</small></td><td>' + formatPrice(o.total) + '</td><td><select class="filter-select order-status-select" data-id="' + o.id + '" style="min-width:100px;font-size:0.72rem;padding:5px 28px 5px 8px;">' + Object.entries(statusLabels).map(([k, v]) => '<option value="' + k + '"' + (o.status === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select></td><td><small>' + new Date(o.date).toLocaleDateString() + '</small></td><td class="actions-btn"><button class="btn-delete" onclick="deleteOrder(' + o.id + ')">Eliminar</button></td>';
        tbody.appendChild(row);
    });

    tbody.querySelectorAll('.order-status-select').forEach(sel => {
        sel.addEventListener('change', function() {
            const oid = parseInt(this.dataset.id);
            const orders = getOrders();
            const order = orders.find(o => o.id === oid);
            if (order) { order.status = this.value; saveOrders(orders); renderOrdersTable(); renderDashboard(); }
        });
    });
}

document.getElementById('filterOrderStatus').addEventListener('change', renderOrdersTable);

window.deleteOrder = function(id) {
    if (!confirm('¿Eliminar este pedido?')) return;
    saveOrders(getOrders().filter(o => o.id !== id));
    renderOrdersTable();
    renderDashboard();
};

// ========================================
// CUSTOMERS
// ========================================
function renderCustomersTable() {
    const customers = getCustomers();
    const orders = getOrders();
    const tbody = document.getElementById('customersTableBody');
    const empty = document.getElementById('emptyCustomers');
    const table = document.querySelector('#customersSection .products-table');
    tbody.innerHTML = '';

    if (customers.length === 0) { table.style.display = 'none'; empty.style.display = 'block'; return; }
    table.style.display = 'block'; empty.style.display = 'none';

    customers.forEach(c => {
        const custOrders = orders.filter(o => o.customer && o.customer.email === c.email);
        const totalSpent = custOrders.reduce((s, o) => s + (o.total || 0), 0);
        const row = document.createElement('tr');
        row.innerHTML = '<td><strong>' + (c.name || 'N/A') + '</strong></td><td>' + (c.email || '-') + '</td><td>' + (c.phone || '-') + '</td><td>' + custOrders.length + '</td><td>' + formatPrice(totalSpent) + '</td><td><small>' + new Date(c.date).toLocaleDateString() + '</small></td>';
        tbody.appendChild(row);
    });
}

// ========================================
// USERS
// ========================================
function renderUsersList() {
    const users = getUsers();
    const list = document.getElementById('usersList');
    list.innerHTML = '';
    users.forEach(u => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = '<div class="category-item-info"><div class="category-item-icon">' + (u.role === 'admin' ? '👑' : '👤') + '</div><div><div class="category-item-name">' + u.name + '</div><div class="category-item-count">' + u.email + ' • ' + (u.role === 'admin' ? 'Admin' : 'Editor') + '</div></div></div><div class="category-item-actions"><button class="btn-edit" onclick="editUser(' + u.id + ')">Editar</button><button class="btn-delete" onclick="deleteUser(' + u.id + ')">Eliminar</button></div>';
        list.appendChild(item);
    });
}

document.getElementById('addUserBtn').addEventListener('click', () => { document.getElementById('userFormBox').style.display = 'block'; document.getElementById('userEmail').value = ''; document.getElementById('userPassword').value = ''; document.getElementById('userName').value = ''; document.getElementById('userRole').value = 'editor'; document.getElementById('editUserId').value = ''; document.getElementById('addUserBtn').style.display = 'none'; document.getElementById('userFormTitle').textContent = 'Nuevo Usuario'; });
document.getElementById('cancelUserBtn').addEventListener('click', () => { document.getElementById('userFormBox').style.display = 'none'; document.getElementById('addUserBtn').style.display = 'block'; });

document.getElementById('saveUserBtn').addEventListener('click', function() {
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const name = document.getElementById('userName').value.trim();
    const role = document.getElementById('userRole').value;
    const editId = document.getElementById('editUserId').value;
    if (!email || !password || !name) { alert('Completa todos los campos'); return; }
    if (password.length < 6) { alert('Contraseña mínima 6 caracteres'); return; }
    const users = getUsers();
    if (editId) {
        const idx = users.findIndex(u => u.id === parseInt(editId));
        if (idx !== -1) { users[idx].email = email; users[idx].password = password; users[idx].name = name; users[idx].role = role; }
    } else {
        if (users.some(u => u.email === email)) { alert('Ya existe'); return; }
        users.push({ id: Date.now(), email, password, name, role });
    }
    saveUsers(users); renderUsersList();
    document.getElementById('userFormBox').style.display = 'none';
    document.getElementById('addUserBtn').style.display = 'block';
});

window.editUser = function(id) {
    const user = getUsers().find(u => u.id === id);
    if (!user) return;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = user.password;
    document.getElementById('userName').value = user.name;
    document.getElementById('userRole').value = user.role;
    document.getElementById('editUserId').value = user.id;
    document.getElementById('userFormBox').style.display = 'block';
    document.getElementById('addUserBtn').style.display = 'none';
    document.getElementById('userFormTitle').textContent = 'Editar Usuario';
};

window.deleteUser = function(id) {
    const curr = JSON.parse(localStorage.getItem('current_user'));
    if (curr && curr.id === id) { alert('No puedes eliminar tu cuenta'); return; }
    if (getUsers().length <= 1) { alert('Debe haber al menos un usuario'); return; }
    if (!confirm('¿Eliminar?')) return;
    saveUsers(getUsers().filter(u => u.id !== id)); renderUsersList();
};

// ========================================
// COUPONS
// ========================================
function renderCouponsList() {
    const coupons = getCoupons();
    const list = document.getElementById('couponsList');
    const empty = document.getElementById('emptyCoupons');
    list.innerHTML = '';

    if (coupons.length === 0) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    coupons.forEach(c => {
        const valText = c.type === 'percent' ? c.value + '%' : 'L. ' + c.value.toFixed(2);
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = '<div class="category-item-info"><div class="category-item-icon">🎟️</div><div><div class="category-item-name"><strong>' + c.code + '</strong> - ' + valText + '</div><div class="category-item-count">Mín: ' + (c.minOrder ? 'L. ' + c.minOrder : 'Sin mínimo') + (c.expiry ? ' • Exp: ' + c.expiry : '') + ' • ' + (c.active ? '✅ Activo' : '❌ Inactivo') + '</div></div></div><div class="category-item-actions"><button class="btn-edit" onclick="editCoupon(' + c.id + ')">Editar</button><button class="btn-delete" onclick="deleteCoupon(' + c.id + ')">Eliminar</button></div>';
        list.appendChild(item);
    });
}

document.getElementById('addCouponBtn').addEventListener('click', () => { document.getElementById('couponFormBox').style.display = 'block'; document.getElementById('couponCode').value = ''; document.getElementById('couponType').value = 'percent'; document.getElementById('couponValue').value = ''; document.getElementById('couponMinOrder').value = '0'; document.getElementById('couponExpiry').value = ''; document.getElementById('editCouponId').value = ''; document.getElementById('addCouponBtn').style.display = 'none'; });
document.getElementById('cancelCouponBtn').addEventListener('click', () => { document.getElementById('couponFormBox').style.display = 'none'; document.getElementById('addCouponBtn').style.display = 'block'; });

document.getElementById('saveCouponBtn').addEventListener('click', function() {
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    const type = document.getElementById('couponType').value;
    const value = parseFloat(document.getElementById('couponValue').value);
    const minOrder = parseFloat(document.getElementById('couponMinOrder').value) || 0;
    const expiry = document.getElementById('couponExpiry').value;
    if (!code || isNaN(value) || value <= 0) { alert('Completa código y valor'); return; }
    const coupons = getCoupons();
    const editId = document.getElementById('editCouponId').value;
    if (editId) {
        const idx = coupons.findIndex(c => c.id === parseInt(editId));
        if (idx !== -1) { coupons[idx].code = code; coupons[idx].type = type; coupons[idx].value = value; coupons[idx].minOrder = minOrder; coupons[idx].expiry = expiry; }
    } else {
        if (coupons.some(c => c.code === code)) { alert('Ya existe'); return; }
        coupons.push({ id: Date.now(), code, type, value, minOrder, expiry, active: true });
    }
    saveCoupons(coupons); renderCouponsList();
    document.getElementById('couponFormBox').style.display = 'none';
    document.getElementById('addCouponBtn').style.display = 'block';
});

window.editCoupon = function(id) {
    const c = getCoupons().find(cp => cp.id === id);
    if (!c) return;
    document.getElementById('couponCode').value = c.code;
    document.getElementById('couponType').value = c.type;
    document.getElementById('couponValue').value = c.value;
    document.getElementById('couponMinOrder').value = c.minOrder || 0;
    document.getElementById('couponExpiry').value = c.expiry || '';
    document.getElementById('editCouponId').value = c.id;
    document.getElementById('couponFormBox').style.display = 'block';
    document.getElementById('addCouponBtn').style.display = 'none';
};

window.deleteCoupon = function(id) {
    if (!confirm('¿Eliminar cupón?')) return;
    saveCoupons(getCoupons().filter(c => c.id !== id)); renderCouponsList();
};

// ========================================
// BANNERS
// ========================================
function renderBannersList() {
    const banners = getBanners();
    const list = document.getElementById('bannersList');
    const empty = document.getElementById('emptyBanners');
    list.innerHTML = '';
    if (banners.length === 0) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    banners.forEach(b => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = '<div class="category-item-info"><div class="category-item-icon">🖼️</div><div><div class="category-item-name"><strong>' + b.title + '</strong></div><div class="category-item-count">' + (b.subtitle || 'Sin subtítulo') + ' • ' + (b.active ? '✅ Activo' : '❌ Inactivo') + '</div></div></div><div class="category-item-actions"><button class="btn-edit" onclick="editBanner(' + b.id + ')">Editar</button><button class="btn-delete" onclick="deleteBanner(' + b.id + ')">Eliminar</button></div>';
        list.appendChild(item);
    });
}

document.getElementById('addBannerBtn').addEventListener('click', () => { document.getElementById('bannerFormBox').style.display = 'block'; ['bannerTitle','bannerSubtitle','bannerBtnText','bannerBtnUrl','bannerImage'].forEach(id => document.getElementById(id).value = ''); document.getElementById('editBannerId').value = ''; document.getElementById('addBannerBtn').style.display = 'none'; });
document.getElementById('cancelBannerBtn').addEventListener('click', () => { document.getElementById('bannerFormBox').style.display = 'none'; document.getElementById('addBannerBtn').style.display = 'block'; });

document.getElementById('saveBannerBtn').addEventListener('click', function() {
    const title = document.getElementById('bannerTitle').value.trim();
    if (!title) { alert('Ingresa un título'); return; }
    const data = { title, subtitle: document.getElementById('bannerSubtitle').value, btnText: document.getElementById('bannerBtnText').value || 'Ver Más', btnUrl: document.getElementById('bannerBtnUrl').value || '#catalog', image: document.getElementById('bannerImage').value, active: true };
    const banners = getBanners();
    const editId = document.getElementById('editBannerId').value;
    if (editId) { const idx = banners.findIndex(b => b.id === parseInt(editId)); if (idx !== -1) { banners[idx] = { ...banners[idx], ...data }; } }
    else { data.id = Date.now(); banners.push(data); }
    saveBanners(banners); renderBannersList();
    document.getElementById('bannerFormBox').style.display = 'none';
    document.getElementById('addBannerBtn').style.display = 'block';
});

window.editBanner = function(id) {
    const b = getBanners().find(bn => bn.id === id);
    if (!b) return;
    document.getElementById('bannerTitle').value = b.title;
    document.getElementById('bannerSubtitle').value = b.subtitle || '';
    document.getElementById('bannerBtnText').value = b.btnText || '';
    document.getElementById('bannerBtnUrl').value = b.btnUrl || '';
    document.getElementById('bannerImage').value = b.image || '';
    document.getElementById('editBannerId').value = b.id;
    document.getElementById('bannerFormBox').style.display = 'block';
    document.getElementById('addBannerBtn').style.display = 'none';
};

window.deleteBanner = function(id) {
    if (!confirm('¿Eliminar banner?')) return;
    saveBanners(getBanners().filter(b => b.id !== id)); renderBannersList();
};

// ========================================
// REVIEWS
// ========================================
function renderReviewsList() {
    const reviews = getReviews();
    const products = getProducts();
    const filter = document.getElementById('filterReviewProduct').value;
    const list = document.getElementById('reviewsList');
    const empty = document.getElementById('emptyReviews');

    // Populate filter
    const filterSel = document.getElementById('filterReviewProduct');
    if (filterSel.options.length <= 1) {
        products.forEach(p => { const o = document.createElement('option'); o.value = p.id; o.textContent = p.name; filterSel.appendChild(o); });
    }

    let filtered = reviews.slice();
    if (filter !== 'all') filtered = filtered.filter(r => r.productId === parseInt(filter));

    list.innerHTML = '';
    if (filtered.length === 0) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    filtered.reverse().forEach(r => {
        const prod = products.find(p => p.id === r.productId);
        const stars = '★'.repeat(r.rating || 0) + '☆'.repeat(5 - (r.rating || 0));
        const item = document.createElement('div');
        item.className = 'category-item';
        item.style.flexDirection = 'column';
        item.style.alignItems = 'flex-start';
        item.style.gap = '8px';
        item.innerHTML = '<div style="display:flex;justify-content:space-between;width:100%;"><div><strong>' + (r.author || 'Anónimo') + '</strong> <span style="color:var(--accent);">' + stars + '</span></div><small class="text-muted">' + new Date(r.date).toLocaleDateString() + '</small></div><div style="font-size:0.82rem;color:var(--text-secondary);">Producto: ' + (prod ? prod.name : 'N/A') + '</div><div style="font-size:0.85rem;">' + (r.comment || '') + '</div>';
        list.appendChild(item);
    });
}

document.getElementById('filterReviewProduct').addEventListener('change', renderReviewsList);

// ========================================
// INVENTORY
// ========================================
function renderInventoryTable() {
    let products = getProducts();
    const filter = document.getElementById('filterInventoryStock').value;
    if (filter === 'out') products = products.filter(p => (p.stock || 0) === 0);
    else if (filter === 'low') products = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5);
    else if (filter === 'ok') products = products.filter(p => (p.stock || 0) > 5);

    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';
    products.forEach(p => {
        const stock = p.stock || 0;
        let cls = 'stock-ok', lbl = 'En stock';
        if (stock === 0) { cls = 'stock-out'; lbl = 'Agotado'; }
        else if (stock <= 5) { cls = 'stock-low'; lbl = 'Stock bajo'; }
        const row = document.createElement('tr');
        row.innerHTML = '<td><strong>' + p.name + '</strong><br><small class="text-muted">' + (p.brand || '') + '</small></td><td>' + (p.sku || '-') + '</td><td><span class="stock-badge ' + cls + '">' + stock + ' uds</span></td><td><span class="text-muted">' + lbl + '</span></td><td><button class="btn-stock" onclick="openStockModal(' + p.id + ')">Actualizar</button></td>';
        tbody.appendChild(row);
    });
}

document.getElementById('filterInventoryStock').addEventListener('change', renderInventoryTable);

window.openStockModal = function(id) {
    const p = getProducts().find(pr => pr.id === id);
    if (!p) return;
    document.getElementById('stockProductName').textContent = p.name + ' (' + (p.brand || '') + ')';
    document.getElementById('stockInput').value = p.stock || 0;
    document.getElementById('stockProductId').value = p.id;
    document.getElementById('stockModal').style.display = 'flex';
};

document.getElementById('closeStockModal').addEventListener('click', () => document.getElementById('stockModal').style.display = 'none');
document.getElementById('cancelStockBtn').addEventListener('click', () => document.getElementById('stockModal').style.display = 'none');
document.getElementById('stockModal').addEventListener('click', function(e) { if (e.target === this) this.style.display = 'none'; });

document.getElementById('saveStockBtn').addEventListener('click', function() {
    const id = parseInt(document.getElementById('stockProductId').value);
    const newStock = parseInt(document.getElementById('stockInput').value) || 0;
    const products = getProducts();
    const p = products.find(pr => pr.id === id);
    if (p) { p.stock = newStock; saveProducts(products); renderInventoryTable(); renderProductsTable(); renderDashboard(); }
    document.getElementById('stockModal').style.display = 'none';
});

// ========================================
// REPORTS
// ========================================
function renderReports() {
    const products = getProducts();
    const orders = getOrders();
    const exchangeRate = getBusiness().exchangeRate || 24.50;

    document.getElementById('reportTotalProducts').textContent = products.length;
    document.getElementById('reportTotalStock').textContent = products.reduce((s, p) => s + (p.stock || 0), 0);
    const avgPrice = products.length > 0 ? products.reduce((s, p) => s + (p.price || 0), 0) / products.length : 0;
    document.getElementById('reportAvgPrice').textContent = 'L. ' + (avgPrice * exchangeRate).toFixed(2);
    document.getElementById('reportTotalOrders').textContent = orders.length;

    // By category
    const catCounts = {};
    products.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
    const catEl = document.getElementById('reportByCategory');
    catEl.innerHTML = Object.entries(catCounts).map(([cat, count]) => '<div class="dashboard-list-item"><span>' + cat + '</span><span class="type-tag">' + count + '</span></div>').join('') || '<p class="text-muted">Sin datos</p>';

    // Top products
    const topProducts = products.slice().sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5);
    const topEl = document.getElementById('reportTopProducts');
    topEl.innerHTML = topProducts.map(p => '<div class="dashboard-list-item"><span>' + p.name + '</span><span class="text-muted">' + (p.reviewCount || 0) + ' reseñas</span></div>').join('') || '<p class="text-muted">Sin datos</p>';
}

// ========================================
// BUSINESS
// ========================================
function loadBusinessInfo() {
    const b = getBusiness();
    document.getElementById('businessName').value = b.name || '';
    document.getElementById('businessSlogan').value = b.slogan || '';
    document.getElementById('businessPhone').value = b.phone || '';
    document.getElementById('businessWhatsApp').value = b.whatsapp || '';
    document.getElementById('businessEmail').value = b.email || '';
    document.getElementById('businessAddress').value = b.address || '';
    document.getElementById('businessExchangeRate').value = b.exchangeRate || 24.50;
    document.getElementById('businessGlobalDiscount').value = b.globalDiscount || 0;
    document.getElementById('businessFacebook').value = b.facebook || '';
    document.getElementById('businessInstagram').value = b.instagram || '';
    document.getElementById('businessTiktok').value = b.tiktok || '';
    document.getElementById('businessFooter').value = b.footer || '';
    document.getElementById('githubToken').value = localStorage.getItem(GITHUB_TOKEN_KEY) || '';
}

document.getElementById('businessForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('businessName').value,
        slogan: document.getElementById('businessSlogan').value,
        phone: document.getElementById('businessPhone').value,
        whatsapp: document.getElementById('businessWhatsApp').value,
        email: document.getElementById('businessEmail').value,
        address: document.getElementById('businessAddress').value,
        currency: 'HNL',
        exchangeRate: parseFloat(document.getElementById('businessExchangeRate').value) || 24.50,
        globalDiscount: parseInt(document.getElementById('businessGlobalDiscount').value) || 0,
        facebook: document.getElementById('businessFacebook').value,
        instagram: document.getElementById('businessInstagram').value,
        tiktok: document.getElementById('businessTiktok').value,
        footer: document.getElementById('businessFooter').value
    };
    saveBusiness(data);
    const token = document.getElementById('githubToken').value.trim();
    if (token) localStorage.setItem(GITHUB_TOKEN_KEY, token);
    alert('Guardado correctamente');
});

// ========================================
// EXPORT / IMPORT
// ========================================
document.getElementById('exportDataBtn').addEventListener('click', function() {
    const data = { products: getProducts(), business: getBusiness(), categories: getCategories(), coupons: getCoupons(), banners: getBanners(), orders: getOrders(), customers: getCustomers(), reviews: getReviews(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leperfumcg-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('importDataBtn').addEventListener('click', () => document.getElementById('importFileInput').click());
document.getElementById('importFileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        try {
            const data = JSON.parse(ev.target.result);
            if (data.products) { saveProducts(data.products); }
            if (data.business) { saveBusiness(data.business); }
            if (data.categories) { saveCategories(data.categories); }
            if (data.coupons) { saveCoupons(data.coupons); }
            if (data.banners) { saveBanners(data.banners); }
            if (data.orders) { saveOrders(data.orders); }
            alert('Importado correctamente');
            location.reload();
        } catch (err) { alert('Error: ' + err.message); }
    };
    reader.readAsText(file);
    this.value = '';
});

// ========================================
// GITHUB PUBLISH
// ========================================
async function pushToGitHub(path, data, message) {
    const token = localStorage.getItem(GITHUB_TOKEN_KEY);
    if (!token) return { ok: false, error: 'No hay token configurado' };
    const api = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + path;
    let sha = null;
    try { const res = await fetch(api, { headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' } }); if (res.ok) { const d = await res.json(); sha = d.sha; } } catch (e) {}
    const body = { message, content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))), branch: REPO_BRANCH };
    if (sha) body.sha = sha;
    try {
        const res = await fetch(api, { method: 'PUT', headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' }, body: JSON.stringify(body) });
        if (res.ok) return { ok: true };
        const err = await res.json(); return { ok: false, error: err.message || 'Error' };
    } catch (e) { return { ok: false, error: e.message }; }
}

async function saveAndPublish() {
    const results = [];
    const r1 = await pushToGitHub('data/products.json', getProducts(), 'Update products'); results.push('Productos: ' + (r1.ok ? 'OK' : r1.error));
    const r2 = await pushToGitHub('data/business.json', getBusiness(), 'Update business'); results.push('Negocio: ' + (r2.ok ? 'OK' : r2.error));
    const r3 = await pushToGitHub('data/categories.json', getCategories(), 'Update categories'); results.push('Categorías: ' + (r3.ok ? 'OK' : r3.error));
    return results;
}

document.getElementById('publishBtn').addEventListener('click', async function() {
    if (!localStorage.getItem(GITHUB_TOKEN_KEY)) { alert('Configura tu GitHub Token en Mi Negocio.'); return; }
    this.disabled = true; this.textContent = 'Publicando...';
    try { const results = await saveAndPublish(); alert('Resultado:\n\n' + results.join('\n')); }
    catch (err) { alert('Error: ' + err.message); }
    this.disabled = false; this.innerHTML = 'Publicar en Tienda';
});
