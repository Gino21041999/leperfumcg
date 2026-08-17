const ADMIN_PASSWORD = 'admin123';
const STORAGE_KEY = 'leperfumcg_products';
const BUSINESS_KEY = 'leperfumcg_business';

// Default business info
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

// Default products
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

// Initialize products
function getProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Business info functions
function getBusiness() {
    const stored = localStorage.getItem(BUSINESS_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(defaultBusiness));
    return defaultBusiness;
}

function saveBusiness(business) {
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(business));
}

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const productsTableBody = document.getElementById('productsTableBody');
const productForm = document.getElementById('productForm');
const productsSection = document.getElementById('productsSection');
const formSection = document.getElementById('formSection');
const formTitle = document.getElementById('formTitle');
const navBtns = document.querySelectorAll('.nav-btn[data-section]');
const addNewBtn = document.getElementById('addNewBtn');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const emojiBtns = document.querySelectorAll('.emoji-btn');
const emojiInput = document.getElementById('productEmoji');
const businessSection = document.getElementById('businessSection');
const businessForm = document.getElementById('businessForm');

// Check if already logged in
if (sessionStorage.getItem('admin_logged_in')) {
    showAdminPanel();
}

// Login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_logged_in', 'true');
        showAdminPanel();
    } else {
        alert('Contraseña incorrecta');
    }
});

function showAdminPanel() {
    loginContainer.style.display = 'none';
    adminPanel.style.display = 'block';
    renderProductsTable();
    loadBusinessInfo();
}

// Logout
logoutBtn.addEventListener('click', function() {
    sessionStorage.removeItem('admin_logged_in');
    loginContainer.style.display = 'flex';
    adminPanel.style.display = 'none';
});

// Navigation
navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        navBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const section = this.dataset.section;
        productsSection.style.display = 'none';
        formSection.style.display = 'none';
        businessSection.style.display = 'none';
        
        if (section === 'products') {
            productsSection.style.display = 'block';
        } else if (section === 'add') {
            resetForm();
            formSection.style.display = 'block';
        } else if (section === 'business') {
            businessSection.style.display = 'block';
        }
    });
});

// Render products table
function renderProductsTable() {
    const products = getProducts();
    productsTableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.emoji}</td>
            <td><strong>${product.name}</strong></td>
            <td><span class="category-badge ${product.category}">${product.category === 'perfume' ? 'Perfume' : 'Libro'}</span></td>
            <td>${product.price}</td>
            <td class="actions-btn">
                <button class="btn-edit" onclick="editProduct(${product.id})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
}

// Emoji picker
emojiBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        emojiBtns.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        emojiInput.value = this.dataset.emoji;
    });
});

// Add new button
addNewBtn.addEventListener('click', function() {
    resetForm();
    productsSection.style.display = 'none';
    formSection.style.display = 'block';
    navBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="add"]').classList.add('active');
});

// Cancel button
cancelBtn.addEventListener('click', function() {
    productsSection.style.display = 'block';
    formSection.style.display = 'none';
    navBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="products"]').classList.add('active');
});

// Reset form
function resetForm() {
    productForm.reset();
    document.getElementById('productId').value = '';
    formTitle.textContent = 'Agregar Producto';
    emojiBtns.forEach(b => b.classList.remove('selected'));
}

// Edit product
window.editProduct = function(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productEmoji').value = product.emoji;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productFeatures').value = product.features.join('\n');
        
        formTitle.textContent = 'Editar Producto';
        
        // Select emoji
        emojiBtns.forEach(b => {
            b.classList.remove('selected');
            if (b.dataset.emoji === product.emoji) {
                b.classList.add('selected');
            }
        });
        
        productsSection.style.display = 'none';
        formSection.style.display = 'block';
        navBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-section="add"]').classList.add('active');
    }
};

// Delete product
window.deleteProduct = function(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        renderProductsTable();
    }
};

// Form submit
productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const products = getProducts();
    const productId = document.getElementById('productId').value;
    const features = document.getElementById('productFeatures').value.split('\n').filter(f => f.trim());
    
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: document.getElementById('productPrice').value,
        emoji: document.getElementById('productEmoji').value || '📦',
        description: document.getElementById('productDescription').value,
        features: features
    };
    
    if (productId) {
        // Edit existing
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        // Add new
        productData.id = Date.now();
        products.push(productData);
    }
    
    saveProducts(products);
    renderProductsTable();
    
    // Show products list
    productsSection.style.display = 'block';
    formSection.style.display = 'none';
    businessSection.style.display = 'none';
    navBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="products"]').classList.add('active');
});

// Load business info
function loadBusinessInfo() {
    const business = getBusiness();
    document.getElementById('businessName').value = business.name || '';
    document.getElementById('businessSlogan').value = business.slogan || '';
    document.getElementById('businessPhone').value = business.phone || '';
    document.getElementById('businessWhatsApp').value = business.whatsapp || '';
    document.getElementById('businessEmail').value = business.email || '';
    document.getElementById('businessAddress').value = business.address || '';
    document.getElementById('businessCurrency').value = business.currency || 'USD';
    document.getElementById('businessExchangeRate').value = business.exchangeRate || 24.50;
    document.getElementById('businessFacebook').value = business.facebook || '';
    document.getElementById('businessInstagram').value = business.instagram || '';
    document.getElementById('businessFooter').value = business.footer || '';
}

// Business form submit
businessForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const business = {
        name: document.getElementById('businessName').value,
        slogan: document.getElementById('businessSlogan').value,
        phone: document.getElementById('businessPhone').value,
        whatsapp: document.getElementById('businessWhatsApp').value,
        email: document.getElementById('businessEmail').value,
        address: document.getElementById('businessAddress').value,
        currency: document.getElementById('businessCurrency').value,
        exchangeRate: parseFloat(document.getElementById('businessExchangeRate').value) || 24.50,
        facebook: document.getElementById('businessFacebook').value,
        instagram: document.getElementById('businessInstagram').value,
        footer: document.getElementById('businessFooter').value
    };
    
    saveBusiness(business);
    alert('Información guardada correctamente');
});
