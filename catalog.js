const STORAGE_KEY = 'leperfumcg_products';
const BUSINESS_KEY = 'leperfumcg_business';
const CATEGORIES_KEY = 'leperfumcg_categories';
const GITHUB_TOKEN_KEY = 'leperfumcg_github_token';
const REPO_OWNER = 'LEPERFUMCG';
const REPO_NAME = 'leperfumcg';
const REPO_BRANCH = 'main';
const DATA_BASE = 'https://raw.githubusercontent.com/' + REPO_OWNER + '/' + REPO_NAME + '/' + REPO_BRANCH + '/data';

const defaultProducts = [
    {
        id: 1, name: "Oud Royal", category: "perfume", type: ["arabe"], gender: "unisex",
        occasion: "noche", olfactory: "amaderado", brand: "Attar Collection", price: 85.00,
        discount: 10, description: "Una fragancia misteriosa y elegante. Notas de oud, pimienta negra, rosa Damasco y ámbar oscuro.",
        features: ["Vidrio artesanal italiano", "50ml de concentración pura", "Duración: 8-12 horas", "Edición limitada"],
        notes: { top: "Pimienta negra, Azafrán", heart: "Oud, Rosa Damasco", base: "Ámbar oscuro, almizcle" },
        image: "", tags: ["nuevo", "exclusivo"], sku: "PERF-001", stock: 10, condition: "new"
    },
    {
        id: 2, name: "Bleu de Chanel", category: "perfume", type: ["disenador"], gender: "hombre",
        occasion: "diario", olfactory: "amaderado", brand: "Chanel", price: 120.00,
        discount: 0, description: "Fresca, aromática y magnética. Notas de limón, menta, jengibre y sándalo.",
        features: ["Frasco de diseño exclusivo", "100ml Eau de Parfum", "Duración: 8-10 horas", "Original importado"],
        notes: { top: "Limón, Menta", heart: "Jengibre, Melón", base: "Sándalo, Incienso" },
        image: "", tags: ["bestseller"], sku: "PERF-002", stock: 5, condition: "new"
    },
    {
        id: 3, name: "FlowerBomb", category: "perfume", type: ["disenador"], gender: "mujer",
        occasion: "verano", olfactory: "floral", brand: "Viktor & Rolf", price: 95.00,
        discount: 5, description: "Un estallido de flores. Notas de patchouli, rosa, peonia y moscata.",
        features: ["100ml Eau de Parfum", "Duración: 10-12 horas", "Frasco icónico", "Original"],
        notes: { top: "Rosa, Peonia", heart: "Jazmín, Violeta", base: "Patchouli, Almizcle" },
        image: "", tags: ["popular"], sku: "PERF-003", stock: 8, condition: "new"
    },
    {
        id: 4, name: "Amber Oud Gold", category: "perfume", type: ["arabe", "replica"], gender: "hombre",
        occasion: "invierno", olfactory: "oriental", brand: "Al Haramain", price: 45.00,
        discount: 15, description: "Réplica de alta calidad del clásico amber oud. Notas amaderadas y especiadas.",
        features: ["100ml", "Duración: 6-8 horas", "Réplica premium", "Frasco premium"],
        notes: { top: "Geranio, Bergamota", heart: "Oud, Especias", base: "Ámbar, Ámbar gris" },
        image: "", tags: ["oferta"], sku: "PERF-004", stock: 12, condition: "new"
    },
    {
        id: 5, name: "Clásico Artesanal", category: "perfume", type: ["artesanal"], gender: "unisex",
        occasion: "diario", olfactory: "citrico", brand: "Casa Local", price: 35.00,
        discount: 0, description: "Fragancia artesanal hecha a mano con ingredientes naturales locales.",
        features: ["30ml frasco artesanal", "Ingredientes naturales", "Duración: 4-6 horas", "Edición limitada"],
        notes: { top: "Limón, Naranja", heart: "Lavanda, Hierbabuena", base: "Vainilla, Cedro" },
        image: "", tags: ["artesanal", "local"], sku: "PERF-005", stock: 3, condition: "new"
    }
];

const defaultBusiness = {
    name: 'LE PERFUM CG', slogan: 'Perfumes & Libros de Autor',
    phone: '+504 8888-8888', whatsapp: '+504 8888-8888',
    email: 'leperfumcg@email.com', address: 'San Pedro Sula, Honduras',
    currency: 'HNL', exchangeRate: 24.50, globalDiscount: 0,
    facebook: '', instagram: '', tiktok: '', footer: 'Todos los derechos reservados'
};

const defaultCategories = [
    { id: 1, name: 'Perfume', icon: '🌸', isDefault: true },
    { id: 2, name: 'Libro', icon: '📚', isDefault: true }
];

function migrateProduct(p) {
    if (!p.olfactory) p.olfactory = '';
    if (!p.occasion) p.occasion = '';
    if (!p.notes) p.notes = { top: '', heart: '', base: '' };
    if (!p.condition) p.condition = 'new';
    if (p.stock === undefined) p.stock = 0;
    return p;
}

async function fetchJSON(url) {
    try {
        const res = await fetch(url + '?t=' + Date.now());
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { return null; }
}

async function loadProducts() {
    const remote = await fetchJSON(DATA_BASE + '/products.json');
    if (remote && Array.isArray(remote)) {
        const migrated = remote.map(migrateProduct);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored).map(migrateProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
}

async function loadBusiness() {
    const remote = await fetchJSON(DATA_BASE + '/business.json');
    if (remote && remote.name) {
        localStorage.setItem(BUSINESS_KEY, JSON.stringify(remote));
        return remote;
    }
    const stored = localStorage.getItem(BUSINESS_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(defaultBusiness));
    return defaultBusiness;
}

async function loadCategories() {
    const remote = await fetchJSON(DATA_BASE + '/categories.json');
    if (remote && Array.isArray(remote)) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(remote));
        return remote;
    }
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
}

function getProductsLocal() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored).map(migrateProduct);
    return defaultProducts;
}

function getBusinessLocal() {
    const stored = localStorage.getItem(BUSINESS_KEY);
    if (stored) return JSON.parse(stored);
    return defaultBusiness;
}

function getCategoriesLocal() {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) return JSON.parse(stored);
    return defaultCategories;
}

let products = getProductsLocal();
let business = getBusinessLocal();
let categories = getCategoriesLocal();

async function initCatalog() {
    products = await loadProducts();
    business = await loadBusiness();
    categories = await loadCategories();
    return { products, business, categories };
}

async function pushToGitHub(path, data, message) {
    const token = localStorage.getItem(GITHUB_TOKEN_KEY);
    if (!token) return { ok: false, error: 'No hay token de GitHub configurado' };

    const apiBase = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + path;

    let sha = null;
    try {
        const existing = await fetch(apiBase, {
            headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' }
        });
        if (existing.ok) {
            const fileData = await existing.json();
            sha = fileData.sha;
        }
    } catch (e) {}

    const body = {
        message: message,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
        branch: REPO_BRANCH
    };
    if (sha) body.sha = sha;

    try {
        const res = await fetch(apiBase, {
            method: 'PUT',
            headers: {
                'Authorization': 'token ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(body)
        });
        if (res.ok) return { ok: true };
        const err = await res.json();
        return { ok: false, error: err.message || 'Error desconocido' };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

async function saveAndPublish() {
    const results = [];
    const r1 = await pushToGitHub('data/products.json', products, 'Update products from admin panel');
    results.push('Productos: ' + (r1.ok ? 'OK' : r1.error));
    const r2 = await pushToGitHub('data/business.json', business, 'Update business info from admin panel');
    results.push('Negocio: ' + (r2.ok ? 'OK' : r2.error));
    const r3 = await pushToGitHub('data/categories.json', categories, 'Update categories from admin panel');
    results.push('Categorías: ' + (r3.ok ? 'OK' : r3.error));
    return results;
}
