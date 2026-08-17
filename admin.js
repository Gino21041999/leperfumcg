const ADMIN_PASSWORD = 'admin123';
const STORAGE_KEY = 'leperfumcg_products';
const BUSINESS_KEY = 'leperfumcg_business';

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
        description: "Una fragancia misteriosa y elegante. Notas de oud, pimienta negra y ámbar oscuro.",
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
        features: ["100ml Eau de Parfum", "Duración: 8-10 horas", "Original importado"],
        image: "",
        tags: ["bestseller"]
    }
];

function getProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function getBusiness() {
    const stored = localStorage.getItem(BUSINESS_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(defaultBusiness));
    return defaultBusiness;
}

function saveBusiness(business) {
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(business));
}

// Categories functions
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

function saveCategories(categories) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

function populateCategorySelect() {
    const categories = getCategories();
    const select = document.getElementById('productCategory');
    select.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name.toLowerCase();
        option.textContent = cat.icon + ' ' + cat.name;
        select.appendChild(option);
    });
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
const businessSection = document.getElementById('businessSection');
const businessForm = document.getElementById('businessForm');

// Image upload elements
const imageUpload = document.getElementById('imageUpload');
const productImageInput = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImage');

// Filter elements
const filterCategory = document.getElementById('filterCategory');
const filterType = document.getElementById('filterType');
const filterGender = document.getElementById('filterGender');

// Categories elements
const categoriesSection = document.getElementById('categoriesSection');
const categoriesList = document.getElementById('categoriesList');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categoryFormBox = document.getElementById('categoryFormBox');
const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const categoryNameInput = document.getElementById('categoryName');
const categoryIconInput = document.getElementById('categoryIcon');
const editCategoryId = document.getElementById('editCategoryId');

let currentImageData = '';

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
    populateCategorySelect();
    populateFilterCategory();
    renderProductsTable();
    renderCategoriesList();
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
        categoriesSection.style.display = 'none';
        businessSection.style.display = 'none';
        
        if (section === 'products') {
            productsSection.style.display = 'block';
        } else if (section === 'add') {
            resetForm();
            formSection.style.display = 'block';
        } else if (section === 'categories') {
            categoriesSection.style.display = 'block';
            renderCategoriesList();
        } else if (section === 'business') {
            businessSection.style.display = 'block';
        }
    });
});

// Show/hide type and gender based on category
document.getElementById('productCategory').addEventListener('change', function() {
    const categories = getCategories();
    const cat = categories.find(c => c.name.toLowerCase() === this.value);
    const isPerfume = cat && cat.name.toLowerCase() === 'perfume';
    document.getElementById('typeGroup').style.display = isPerfume ? 'block' : 'none';
    document.getElementById('genderGroup').style.display = isPerfume ? 'block' : 'none';
});

// Populate filter category dropdown
function populateFilterCategory() {
    const categories = getCategories();
    filterCategory.innerHTML = '<option value="all">Todas las categorías</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name.toLowerCase();
        option.textContent = cat.icon + ' ' + cat.name;
        filterCategory.appendChild(option);
    });
}

// Auto-generate description from name and brand
function generateDescription(name, brand, category, type, gender) {
    if (!name || !brand) return '';
    
    const cat = category || 'perfume';
    const types = type || [];
    const genderText = gender || 'unisex';
    
    // Type descriptions
    const typeDescriptions = {
        arabe: 'con esencias orientales y árabes',
        disenador: 'de la casa de diseñador',
        replica: 'réplica de alta calidad',
        artesanal: 'elaborado artesanalmente'
    };
    
    // Gender text
    const genderDescriptions = {
        hombre: 'para hombre',
        mujer: 'para mujer',
        unisex: 'unisex'
    };
    
    // Size/characteristics based on category
    const characteristics = {
        perfume: ['100ml', 'Fragancia premium', 'Duración: 6-8 horas'],
        libro: ['Edición de bolsillo', 'Tapa blanda', 'Páginas: 200-400']
    };
    
    // Build description
    let description = '';
    
    if (cat === 'perfume') {
        const typeDesc = types.length > 0 ? typeDescriptions[types[0]] || '' : '';
        const genderDesc = genderDescriptions[genderText] || 'unisex';
        
        description = `${brand} presenta ${name}`;
        if (typeDesc) description += `, ${typeDesc}`;
        description += `. Fragancia ${genderDesc} con notas elegantes y sofisticadas.`;
    } else if (cat === 'libro') {
        description = `${name} de ${brand}. Una obra que te transportará a mundos increíbles.`;
    } else {
        description = `${brand} - ${name}. Producto de alta calidad.`;
    }
    
    return description;
}

// Event listeners for auto-description
document.getElementById('productName').addEventListener('input', autoGenerateDescription);
document.getElementById('productBrand').addEventListener('input', autoGenerateDescription);

function autoGenerateDescription() {
    const name = document.getElementById('productName').value.trim();
    const brand = document.getElementById('productBrand').value.trim();
    const category = document.getElementById('productCategory').value;
    const type = [];
    document.querySelectorAll('#typeGroup input[type="checkbox"]:checked').forEach(cb => {
        type.push(cb.value);
    });
    const gender = document.getElementById('productGender').value;
    
    const descriptionField = document.getElementById('productDescription');
    
    // Only auto-generate if description is empty
    if (!descriptionField.value.trim() && name && brand) {
        descriptionField.value = generateDescription(name, brand, category, type, gender);
    }
}

// Regenerate description button
document.getElementById('regenerateDesc').addEventListener('click', function() {
    const name = document.getElementById('productName').value.trim();
    const brand = document.getElementById('productBrand').value.trim();
    const category = document.getElementById('productCategory').value;
    const type = [];
    document.querySelectorAll('#typeGroup input[type="checkbox"]:checked').forEach(cb => {
        type.push(cb.value);
    });
    const gender = document.getElementById('productGender').value;
    
    if (!name || !brand) {
        alert('Escribe primero el nombre y la marca');
        return;
    }
    
    const descriptionField = document.getElementById('productDescription');
    descriptionField.value = generateDescription(name, brand, category, type, gender);
});

// Also regenerate when type or gender changes
document.getElementById('productGender').addEventListener('change', autoGenerateDescription);
document.querySelectorAll('#typeGroup input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', autoGenerateDescription);
});

// Categories management
function renderCategoriesList() {
    const categories = getCategories();
    const products = getProducts();
    categoriesList.innerHTML = '';
    
    categories.forEach(cat => {
        const productCount = products.filter(p => p.category === cat.name.toLowerCase()).length;
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <div class="category-item-info">
                <div class="category-item-icon">${cat.icon}</div>
                <div>
                    <div class="category-item-name">${cat.name}${cat.isDefault ? '<span class="category-item-default">(default)</span>' : ''}</div>
                    <div class="category-item-count">${productCount} producto${productCount !== 1 ? 's' : ''}</div>
                </div>
            </div>
            <div class="category-item-actions">
                <button class="btn-edit" onclick="editCategory(${cat.id})">Editar</button>
                ${!cat.isDefault ? `<button class="btn-delete" onclick="deleteCategory(${cat.id})">Eliminar</button>` : ''}
            </div>
        `;
        categoriesList.appendChild(item);
    });
}

addCategoryBtn.addEventListener('click', function() {
    categoryFormBox.style.display = 'block';
    categoryNameInput.value = '';
    categoryIconInput.value = '';
    editCategoryId.value = '';
    addCategoryBtn.style.display = 'none';
});

cancelCategoryBtn.addEventListener('click', function() {
    categoryFormBox.style.display = 'none';
    addCategoryBtn.style.display = 'block';
});

saveCategoryBtn.addEventListener('click', function() {
    const name = categoryNameInput.value.trim();
    const icon = categoryIconInput.value.trim() || '📦';
    
    if (!name) {
        alert('Ingresa un nombre para la categoría');
        return;
    }
    
    const categories = getCategories();
    const editId = editCategoryId.value;
    
    if (editId) {
        const index = categories.findIndex(c => c.id === parseInt(editId));
        if (index !== -1) {
            const oldName = categories[index].name.toLowerCase();
            categories[index].name = name;
            categories[index].icon = icon;
            
            // Update products with old category name
            if (oldName !== name.toLowerCase()) {
                const products = getProducts();
                products.forEach(p => {
                    if (p.category === oldName) {
                        p.category = name.toLowerCase();
                    }
                });
                saveProducts(products);
            }
        }
    } else {
        const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase());
        if (exists) {
            alert('Ya existe una categoría con ese nombre');
            return;
        }
        categories.push({
            id: Date.now(),
            name: name,
            icon: icon,
            isDefault: false
        });
    }
    
    saveCategories(categories);
    populateCategorySelect();
    populateFilterCategory();
    renderCategoriesList();
    renderProductsTable();
    
    categoryFormBox.style.display = 'none';
    addCategoryBtn.style.display = 'block';
});

window.editCategory = function(id) {
    const categories = getCategories();
    const cat = categories.find(c => c.id === id);
    if (cat) {
        categoryNameInput.value = cat.name;
        categoryIconInput.value = cat.icon;
        editCategoryId.value = cat.id;
        categoryFormBox.style.display = 'block';
        addCategoryBtn.style.display = 'none';
    }
};

window.deleteCategory = function(id) {
    const categories = getCategories();
    const cat = categories.find(c => c.id === id);
    if (!cat || cat.isDefault) return;
    
    const products = getProducts();
    const productCount = products.filter(p => p.category === cat.name.toLowerCase()).length;
    
    if (productCount > 0) {
        if (!confirm(`Hay ${productCount} producto(s) en "${cat.name}". Si eliminas esta categoría, los productos se cambiarán a "Perfume". ¿Continuar?`)) {
            return;
        }
        products.forEach(p => {
            if (p.category === cat.name.toLowerCase()) {
                p.category = 'perfume';
            }
        });
        saveProducts(products);
    }
    
    const newCategories = categories.filter(c => c.id !== id);
    saveCategories(newCategories);
    populateCategorySelect();
    populateFilterCategory();
    renderCategoriesList();
    renderProductsTable();
};

// Image upload
imageUpload.addEventListener('click', function() {
    productImageInput.click();
});

productImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 500000) {
            alert('La imagen es muy grande. Máximo 500KB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageData = event.target.result;
            imagePreview.innerHTML = `<img src="${currentImageData}" alt="Preview">`;
            removeImageBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

removeImageBtn.addEventListener('click', function() {
    currentImageData = '';
    imagePreview.innerHTML = '<span class="preview-placeholder">📷 Click para subir foto</span>';
    productImageInput.value = '';
    removeImageBtn.style.display = 'none';
});

// Filters
filterCategory.addEventListener('change', renderProductsTable);
filterType.addEventListener('change', renderProductsTable);
filterGender.addEventListener('change', renderProductsTable);

// Render products table with filters
function renderProductsTable() {
    let products = getProducts();
    
    const catFilter = filterCategory.value;
    const typeFilter = filterType.value;
    const genderFilter = filterGender.value;
    
    if (catFilter !== 'all') {
        products = products.filter(p => p.category === catFilter);
    }
    if (typeFilter !== 'all') {
        products = products.filter(p => p.type && p.type.includes(typeFilter));
    }
    if (genderFilter !== 'all') {
        products = products.filter(p => p.gender === genderFilter);
    }
    
    productsTableBody.innerHTML = '';
    
    products.forEach(product => {
        const typeLabels = (product.type || []).map(t => {
            const labels = { arabe: 'Árabe', disenador: 'Diseñador', replica: 'Réplica', artesanal: 'Artesanal' };
            return labels[t] || t;
        }).join(', ');
        
        const genderLabels = { hombre: 'Hombre', mujer: 'Mujer', unisex: 'Unisex' };
        const genderLabel = genderLabels[product.gender] || '-';
        
        const photoCell = product.image 
            ? `<img src="${product.image}" class="table-thumb" alt="${product.name}">`
            : '<span class="no-photo">📷</span>';
        
        const priceHTML = product.discount > 0 
            ? `<span class="price-original">$${product.price.toFixed(2)}</span> <span class="price-discount">$${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>`
            : `$${product.price.toFixed(2)}`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${photoCell}</td>
            <td><strong>${product.name}</strong><br><small class="text-muted">${product.brand || ''}</small></td>
            <td><span class="type-tags">${typeLabels || '-'}</span></td>
            <td>${genderLabel}</td>
            <td>${priceHTML}</td>
            <td>${product.discount > 0 ? product.discount + '%' : '-'}</td>
            <td class="actions-btn">
                <button class="btn-edit" onclick="editProduct(${product.id})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
}

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
    currentImageData = '';
    imagePreview.innerHTML = '<span class="preview-placeholder">📷 Click para subir foto</span>';
    removeImageBtn.style.display = 'none';
    document.getElementById('typeGroup').style.display = 'block';
    document.getElementById('genderGroup').style.display = 'block';
    document.querySelectorAll('input[name="productType"]').forEach(cb => cb.checked = false);
}

// Edit product
window.editProduct = function(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand || '';
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDiscount').value = product.discount || 0;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productFeatures').value = (product.features || []).join('\n');
        document.getElementById('productTags').value = (product.tags || []).join(', ');
        document.getElementById('productGender').value = product.gender || 'unisex';
        
        // Type checkboxes
        document.querySelectorAll('input[name="productType"]').forEach(cb => {
            cb.checked = (product.type || []).includes(cb.value);
        });
        
        // Image
        if (product.image) {
            currentImageData = product.image;
            imagePreview.innerHTML = `<img src="${product.image}" alt="Preview">`;
            removeImageBtn.style.display = 'block';
        } else {
            currentImageData = '';
            imagePreview.innerHTML = '<span class="preview-placeholder">📷 Click para subir foto</span>';
            removeImageBtn.style.display = 'none';
        }
        
        // Show/hide type and gender
        const isPerfume = product.category === 'perfume';
        document.getElementById('typeGroup').style.display = isPerfume ? 'block' : 'none';
        document.getElementById('genderGroup').style.display = isPerfume ? 'block' : 'none';
        
        formTitle.textContent = 'Editar Producto';
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
    const tags = document.getElementById('productTags').value.split(',').map(t => t.trim()).filter(t => t);
    
    const selectedTypes = [];
    document.querySelectorAll('input[name="productType"]:checked').forEach(cb => {
        selectedTypes.push(cb.value);
    });
    
    const productData = {
        name: document.getElementById('productName').value,
        brand: document.getElementById('productBrand').value,
        category: document.getElementById('productCategory').value,
        type: selectedTypes,
        gender: document.getElementById('productGender').value,
        price: parseFloat(document.getElementById('productPrice').value),
        discount: parseInt(document.getElementById('productDiscount').value) || 0,
        description: document.getElementById('productDescription').value,
        features: features,
        image: currentImageData,
        tags: tags
    };
    
    if (productId) {
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        productData.id = Date.now();
        products.push(productData);
    }
    
    saveProducts(products);
    renderProductsTable();
    
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
    document.getElementById('businessGlobalDiscount').value = business.globalDiscount || 0;
    document.getElementById('businessFacebook').value = business.facebook || '';
    document.getElementById('businessInstagram').value = business.instagram || '';
    document.getElementById('businessTiktok').value = business.tiktok || '';
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
        globalDiscount: parseInt(document.getElementById('businessGlobalDiscount').value) || 0,
        facebook: document.getElementById('businessFacebook').value,
        instagram: document.getElementById('businessInstagram').value,
        tiktok: document.getElementById('businessTiktok').value,
        footer: document.getElementById('businessFooter').value
    };
    
    saveBusiness(business);
    alert('Información guardada correctamente');
});
