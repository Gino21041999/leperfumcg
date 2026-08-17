const STORAGE_KEY = 'leperfumcg_products';
const BUSINESS_KEY = 'leperfumcg_business';

const defaultProducts = [
    {
        id: 1,
        name: "Élise Noir",
        category: "perfume",
        price: "$85.00",
        description: "Una fragancia misteriosa y elegante. Notas de pimienta negra, rosa Damasco y ámbar oscuro.",
        emoji: "🌹",
        features: ["Vidrio artesanal italiano", "50ml de concentración pura", "Duración: 8-12 horas", "Edición limitada"]
    },
    {
        id: 2,
        name: "Jardín Secreto",
        category: "perfume",
        price: "$72.00",
        description: "Un viaje a un jardín mediterráneo. Notas frescas de bergamota, jazmín y madera de cedro.",
        emoji: "🌸",
        features: ["Frasco de diseño exclusivo", "75ml Eau de Parfum", "Duración: 6-8 horas", "Ideal para uso diario"]
    },
    {
        id: 3,
        name: "El Arte de Sentir",
        category: "libro",
        price: "$28.00",
        description: "Una colección de poemas que exploran las emociones humanas a través de metáforas sensoriales.",
        emoji: "📚",
        features: ["240 páginas", "Tapa dura con barniz especial", "Edición ilustrada", "Papel premium"]
    }
];

const defaultBusiness = {
    name: 'LE PERFUM CG',
    slogan: 'Perfumes & Libros de Autor',
    phone: '+505 8888-8888',
    whatsapp: '+505 8888-8888',
    email: 'leperfumcg@email.com',
    address: 'Managua, Nicaragua',
    currency: 'USD',
    exchangeRate: 24.50,
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
