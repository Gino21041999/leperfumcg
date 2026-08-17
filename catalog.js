const STORAGE_KEY = 'leperfumcg_products';
const BUSINESS_KEY = 'leperfumcg_business';

const defaultProducts = [
    {
        id: 1,
        name: "Oud Royal",
        category: "perfume",
        type: ["arabe"],
        gender: "unisex",
        occasion: "noche",
        olfactory: "amaderado",
        brand: "Attar Collection",
        price: 85.00,
        discount: 10,
        description: "Una fragancia misteriosa y elegante. Notas de oud, pimienta negra, rosa Damasco y ámbar oscuro.",
        features: ["Vidrio artesanal italiano", "50ml de concentración pura", "Duración: 8-12 horas", "Edición limitada"],
        notes: { top: "Pimienta negra, Azafrán", heart: "Oud, Rosa Damasco", base: "Ámbar oscuro, almizcle" },
        image: "",
        tags: ["nuevo", "exclusivo"],
        sku: "PERF-001",
        stock: 10,
        condition: "new"
    },
    {
        id: 2,
        name: "Bleu de Chanel",
        category: "perfume",
        type: ["disenador"],
        gender: "hombre",
        occasion: "diario",
        olfactory: "amaderado",
        brand: "Chanel",
        price: 120.00,
        discount: 0,
        description: "Fresca, aromática y magnética. Notas de limón, menta, jengibre y sándalo.",
        features: ["Frasco de diseño exclusivo", "100ml Eau de Parfum", "Duración: 8-10 horas", "Original importado"],
        notes: { top: "Limón, Menta", heart: "Jengibre, Melón", base: "Sándalo, Incienso" },
        image: "",
        tags: ["bestseller"],
        sku: "PERF-002",
        stock: 5,
        condition: "new"
    },
    {
        id: 3,
        name: "FlowerBomb",
        category: "perfume",
        type: ["disenador"],
        gender: "mujer",
        occasion: "verano",
        olfactory: "floral",
        brand: "Viktor & Rolf",
        price: 95.00,
        discount: 5,
        description: "Un estallido de flores. Notas de patchouli, rosa, peonia y moscata.",
        features: ["100ml Eau de Parfum", "Duración: 10-12 horas", "Frasco icónico", "Original"],
        notes: { top: "Rosa, Peonia", heart: "Jazmín, Violeta", base: "Patchouli, Almizcle" },
        image: "",
        tags: ["popular"],
        sku: "PERF-003",
        stock: 8,
        condition: "new"
    },
    {
        id: 4,
        name: "Amber Oud Gold",
        category: "perfume",
        type: ["arabe", "replica"],
        gender: "hombre",
        occasion: "invierno",
        olfactory: "oriental",
        brand: "Al Haramain",
        price: 45.00,
        discount: 15,
        description: "Réplica de alta calidad del clásico amber oud. Notas amaderadas y especiadas.",
        features: ["100ml", "Duración: 6-8 horas", "Réplica premium", "Frasco premium"],
        notes: { top: "Geranio, Bergamota", heart: "Oud, Especias", base: "Ámbar, Ámbar gris" },
        image: "",
        tags: ["oferta"],
        sku: "PERF-004",
        stock: 12,
        condition: "new"
    },
    {
        id: 5,
        name: "Clásico Artesanal",
        category: "perfume",
        type: ["artesanal"],
        gender: "unisex",
        occasion: "diario",
        olfactory: "citrico",
        brand: "Casa Local",
        price: 35.00,
        discount: 0,
        description: "Fragancia artesanal hecha a mano con ingredientes naturales locales.",
        features: ["30ml frasco artesanal", "Ingredientes naturales", "Duración: 4-6 horas", "Edición limitada"],
        notes: { top: "Limón, Naranja", heart: "Lavanda, Hierbabuena", base: "Vainilla, Cedro" },
        image: "",
        tags: ["artesanal", "local"],
        sku: "PERF-005",
        stock: 3,
        condition: "new"
    }
];

const defaultBusiness = {
    name: 'LE PERFUM CG',
    slogan: 'Perfumes & Libros de Autor',
    phone: '+504 8888-8888',
    whatsapp: '+504 8888-8888',
    email: 'leperfumcg@email.com',
    address: 'San Pedro Sula, Honduras',
    currency: 'HNL',
    exchangeRate: 24.50,
    globalDiscount: 0,
    facebook: '',
    instagram: '',
    tiktok: '',
    footer: 'Todos los derechos reservados'
};

function getProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        let parsed = JSON.parse(stored);
        let changed = false;
        parsed = parsed.map(p => {
            if (!p.olfactory) { p.olfactory = ''; changed = true; }
            if (!p.occasion) { p.occasion = ''; changed = true; }
            if (!p.notes) { p.notes = { top: '', heart: '', base: '' }; changed = true; }
            if (!p.condition) { p.condition = 'new'; changed = true; }
            if (p.stock === undefined) { p.stock = 0; changed = true; }
            return p;
        });
        if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
}

function getBusiness() {
    const stored = localStorage.getItem(BUSINESS_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(defaultBusiness));
    return defaultBusiness;
}

const products = getProducts();
const business = getBusiness();

// Categories
const CATEGORIES_KEY = 'leperfumcg_categories';
const defaultCategories = [
    { id: 1, name: 'Perfume', icon: '🌸', isDefault: true },
    { id: 2, name: 'Libro', icon: '📚', isDefault: true }
];

function getCategories() {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
}

const categories = getCategories();
