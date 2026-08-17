const STORAGE_KEY = 'leperfumcg_products';
const BUSINESS_KEY = 'leperfumcg_business';

const defaultProducts = [
    {
        id: 1,
        name: "Oud Royal",
        category: "perfume",
        type: ["arabe"],
        gender: "unisex",
        brand: "Attar Collection",
        price: 85.00,
        discount: 10,
        description: "Una fragancia misteriosa y elegante. Notas de oud, pimienta negra, rosa Damasco y ámbar oscuro.",
        features: ["Vidrio artesanal italiano", "50ml de concentración pura", "Duración: 8-12 horas", "Edición limitada"],
        image: "",
        tags: ["nuevo", "exclusivo"]
    },
    {
        id: 2,
        name: "Bleu de Chanel",
        category: "perfume",
        type: ["disenador"],
        gender: "hombre",
        brand: "Chanel",
        price: 120.00,
        discount: 0,
        description: "Fresca, aromática y magnética. Notas de limón, menta, jengibre y sándalo.",
        features: ["Frasco de diseño exclusivo", "100ml Eau de Parfum", "Duración: 8-10 horas", "Original importado"],
        image: "",
        tags: ["bestseller"]
    },
    {
        id: 3,
        name: "FlowerBomb",
        category: "perfume",
        type: ["disenador"],
        gender: "mujer",
        brand: "Viktor & Rolf",
        price: 95.00,
        discount: 5,
        description: "Un estallido de flores. Notas de patchouli, rosa, peonia y moscata.",
        features: ["100ml Eau de Parfum", "Duración: 10-12 horas", "Frasco icónico", "Original"],
        image: "",
        tags: ["popular"]
    },
    {
        id: 4,
        name: "Amber Oud Gold",
        category: "perfume",
        type: ["arabe", "replica"],
        gender: "hombre",
        brand: "Al Haramain",
        price: 45.00,
        discount: 15,
        description: "Réplica de alta calidad del clásico amber oud. Notas amaderadas y especiadas.",
        features: ["100ml", "Duración: 6-8 horas", "Réplica premium", "Frasco premium"],
        image: "",
        tags: ["oferta"]
    },
    {
        id: 5,
        name: "Clásico Artesanal",
        category: "perfume",
        type: ["artesanal"],
        gender: "unisex",
        brand: "Casa Local",
        price: 35.00,
        discount: 0,
        description: "Fragancia artesanal hecha a mano con ingredientes naturales locales.",
        features: ["30ml frasco artesanal", "Ingredientes naturales", "Duración: 4-6 horas", "Edición limitada"],
        image: "",
        tags: ["artesanal", "local"]
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
    footer: 'Todos los derechos reservados'
};

function getProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
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
