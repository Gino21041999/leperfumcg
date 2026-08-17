const STORAGE_KEY = 'leperfumcg_products';
const BUSINESS_KEY = 'leperfumcg_business';
const USERS_KEY = 'leperfumcg_users';

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

// Users system
const defaultUsers = [
    { id: 1, email: 'admin@leperfumcg.com', password: 'admin123', name: 'Administrador', role: 'admin' }
];

function getUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loginUser(email, password) {
    const users = getUsers();
    return users.find(u => u.email === email && u.password === password);
}

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
        brand: "Chanel",
        price: 120.00,
        discount: 0,
        description: "Fresca, aromática y magnética. Notas de limón, menta, jengibre y sándalo.",
        features: ["100ml Eau de Parfum", "Duración: 8-10 horas", "Original importado"],
        image: "",
        tags: ["bestseller"],
        sku: "PERF-002",
        stock: 5,
        condition: "new"
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
const navTabs = document.querySelectorAll('.nav-tab[data-section]');
const addNewBtn = document.getElementById('addNewBtn');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const businessSection = document.getElementById('businessSection');
const businessForm = document.getElementById('businessForm');
const emptyProducts = document.getElementById('emptyProducts');

// Account menu
const accountMenu = document.getElementById('accountMenu');
const accountBtn = document.getElementById('accountBtn');
const profileModal = document.getElementById('profileModal');
const panelModal = document.getElementById('panelModal');

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

// Sections for navigation
const ordersSection = document.getElementById('ordersSection');
const customersSection = document.getElementById('customersSection');
const reportsSection = document.getElementById('reportsSection');

// Users elements
const usersSection = document.getElementById('usersSection');
const usersList = document.getElementById('usersList');
const addUserBtn = document.getElementById('addUserBtn');
const userFormBox = document.getElementById('userFormBox');
const cancelUserBtn = document.getElementById('cancelUserBtn');
const saveUserBtn = document.getElementById('saveUserBtn');
const userEmailInput = document.getElementById('userEmail');
const userPasswordInput = document.getElementById('userPassword');
const userNameInput = document.getElementById('userName');
const userRoleInput = document.getElementById('userRole');
const editUserId = document.getElementById('editUserId');

let currentImageData = '';

// Check if already logged in
if (localStorage.getItem('admin_logged_in')) {
    showAdminPanel();
}

// Login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = loginUser(email, password);
    if (user) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('current_user', JSON.stringify(user));
        showAdminPanel();
    } else {
        alert('Correo o contraseña incorrectos');
    }
});

function showAdminPanel() {
    loginContainer.style.display = 'none';
    adminPanel.style.display = 'block';
    populateCategorySelect();
    populateFilterCategory();
    renderProductsTable();
    renderCategoriesList();
    renderUsersList();
    loadBusinessInfo();
    updateAccountInfo();
}

// Logout
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('current_user');
    loginContainer.style.display = 'flex';
    adminPanel.style.display = 'none';
    accountMenu.classList.remove('open');
});

// Account menu toggle
accountBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    accountMenu.classList.toggle('open');
});

document.addEventListener('click', function() {
    accountMenu.classList.remove('open');
});

// Update account info
function updateAccountInfo() {
    const user = JSON.parse(localStorage.getItem('current_user'));
    if (user) {
        const initial = (user.name || 'U').charAt(0).toUpperCase();
        document.getElementById('accountAvatar').textContent = initial;
        document.getElementById('dropdownAvatar').textContent = initial;
        document.getElementById('dropdownName').textContent = user.name;
        document.getElementById('dropdownEmail').textContent = user.email;
    }
}

// Navigation
navTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        navTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const allSections = [productsSection, formSection, categoriesSection, usersSection, ordersSection, customersSection, reportsSection, businessSection];
        allSections.forEach(s => { if (s) s.style.display = 'none'; });
        
        const section = this.dataset.section;
        if (section === 'products') {
            productsSection.style.display = 'block';
            renderProductsTable();
        } else if (section === 'categories') {
            categoriesSection.style.display = 'block';
            renderCategoriesList();
        } else if (section === 'users') {
            usersSection.style.display = 'block';
            renderUsersList();
        } else if (section === 'orders') {
            ordersSection.style.display = 'block';
        } else if (section === 'customers') {
            customersSection.style.display = 'block';
        } else if (section === 'reports') {
            reportsSection.style.display = 'block';
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
                <button class="btn-delete" onclick="deleteCategory(${cat.id})">Eliminar</button>
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
    if (!cat) return;
    
    const products = getProducts();
    const productCount = products.filter(p => p.category === cat.name.toLowerCase()).length;
    
    const fallbackCategory = categories.find(c => c.id !== id);
    const fallbackName = fallbackCategory ? fallbackCategory.name.toLowerCase() : 'perfume';
    
    if (productCount > 0) {
        if (!confirm(`Hay ${productCount} producto(s) en "${cat.name}". Si eliminas esta categoría, los productos se moverán a "${fallbackCategory ? fallbackCategory.name : fallbackName}". ¿Continuar?`)) {
            return;
        }
        products.forEach(p => {
            if (p.category === cat.name.toLowerCase()) {
                p.category = fallbackName;
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

// Users management
function renderUsersList() {
    const users = getUsers();
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <div class="category-item-info">
                <div class="category-item-icon">${user.role === 'admin' ? '👑' : '👤'}</div>
                <div>
                    <div class="category-item-name">${user.name}</div>
                    <div class="category-item-count">${user.email} • ${user.role === 'admin' ? 'Administrador' : 'Editor'}</div>
                </div>
            </div>
            <div class="category-item-actions">
                <button class="btn-edit" onclick="editUser(${user.id})">Editar</button>
                <button class="btn-delete" onclick="deleteUser(${user.id})">Eliminar</button>
            </div>
        `;
        usersList.appendChild(item);
    });
}

addUserBtn.addEventListener('click', function() {
    userFormBox.style.display = 'block';
    userEmailInput.value = '';
    userPasswordInput.value = '';
    userNameInput.value = '';
    userRoleInput.value = 'editor';
    editUserId.value = '';
    addUserBtn.style.display = 'none';
    document.getElementById('userFormTitle').textContent = 'Nuevo Usuario';
});

cancelUserBtn.addEventListener('click', function() {
    userFormBox.style.display = 'none';
    addUserBtn.style.display = 'block';
});

saveUserBtn.addEventListener('click', function() {
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value;
    const name = userNameInput.value.trim();
    const role = userRoleInput.value;
    const editId = editUserId.value;
    
    if (!email || !password || !name) {
        alert('Completa todos los campos');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Ingresa un correo válido');
        return;
    }
    
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    const users = getUsers();
    
    if (editId) {
        const index = users.findIndex(u => u.id === parseInt(editId));
        if (index !== -1) {
            users[index].email = email;
            users[index].password = password;
            users[index].name = name;
            users[index].role = role;
        }
    } else {
        const exists = users.some(u => u.email === email);
        if (exists) {
            alert('Ya existe un usuario con ese correo');
            return;
        }
        users.push({
            id: Date.now(),
            email: email,
            password: password,
            name: name,
            role: role
        });
    }
    
    saveUsers(users);
    renderUsersList();
    
    userFormBox.style.display = 'none';
    addUserBtn.style.display = 'block';
});

window.editUser = function(id) {
    const users = getUsers();
    const user = users.find(u => u.id === id);
    if (user) {
        userEmailInput.value = user.email;
        userPasswordInput.value = user.password;
        userNameInput.value = user.name;
        userRoleInput.value = user.role;
        editUserId.value = user.id;
        userFormBox.style.display = 'block';
        addUserBtn.style.display = 'none';
        document.getElementById('userFormTitle').textContent = 'Editar Usuario';
    }
};

window.deleteUser = function(id) {
    const users = getUsers();
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    
    if (currentUser && currentUser.id === id) {
        alert('No puedes eliminar tu propia cuenta');
        return;
    }
    
    if (users.length <= 1) {
        alert('Debe haber al menos un usuario');
        return;
    }
    
    if (confirm('¿Eliminar este usuario?')) {
        const newUsers = users.filter(u => u.id !== id);
        saveUsers(newUsers);
        renderUsersList();
    }
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
    imagePreview.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
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
    
    if (products.length === 0) {
        document.querySelector('.products-table').style.display = 'none';
        emptyProducts.style.display = 'block';
    } else {
        document.querySelector('.products-table').style.display = 'block';
        emptyProducts.style.display = 'none';
    }
    
    products.forEach(product => {
        const typeLabels = (product.type || []).map(t => {
            const labels = { arabe: 'Árabe', disenador: 'Diseñador', replica: 'Réplica', artesanal: 'Artesanal' };
            return labels[t] || t;
        });
        
        const genderLabels = { hombre: 'Hombre', mujer: 'Mujer', unisex: 'Unisex' };
        const genderLabel = genderLabels[product.gender] || '-';
        
        const photoCell = product.image 
            ? `<img src="${product.image}" class="table-thumb" alt="${product.name}">`
            : '<div class="no-photo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
        
        const priceHTML = product.discount > 0 
            ? `<span class="price-original">$${product.price.toFixed(2)}</span><span class="price-discount">$${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>`
            : `<span class="price-normal">$${product.price.toFixed(2)}</span>`;
        
        const stock = product.stock || 0;
        let stockClass = 'stock-ok';
        let stockLabel = stock + ' disp.';
        if (stock === 0) { stockClass = 'stock-out'; stockLabel = 'Agotado'; }
        else if (stock <= 5) { stockClass = 'stock-low'; stockLabel = stock + ' disp.'; }
        
        const conditionClass = product.condition === 'used' ? 'condition-used' : 'condition-new';
        const conditionLabel = product.condition === 'used' ? 'Usado' : 'Nuevo';

        const olfactoryLabels = { amaderado: 'Amaderado', citrico: 'Cítrico', floral: 'Floral', oriental: 'Oriental', gourmand: 'Gourmand', cuero: 'Cuero' };
        const occasionLabels = { noche: 'Noche', diario: 'Diario', verano: 'Verano', invierno: 'Invierno' };
        const olfactoryLabel = product.olfactory ? (olfactoryLabels[product.olfactory] || product.olfactory) : '<span class="text-muted">-</span>';
        const occasionLabel = product.occasion ? (occasionLabels[product.occasion] || product.occasion) : '<span class="text-muted">-</span>';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${photoCell}</td>
            <td><strong>${product.name}</strong><br><small class="text-muted">${product.brand || ''}</small></td>
            <td>${typeLabels.map(t => '<span class="type-tag">' + t + '</span>').join(' ') || '<span class="text-muted">-</span>'}</td>
            <td>${genderLabel}</td>
            <td>${priceHTML}</td>
            <td>${product.discount > 0 ? product.discount + '%' : '<span class="text-muted">-</span>'}</td>
            <td>${product.sku || '<span class="text-muted">-</span>'}</td>
            <td><span class="stock-badge ${stockClass}">${stockLabel}</span></td>
            <td><span class="condition-badge ${conditionClass}">${conditionLabel}</span></td>
            <td>${olfactoryLabel}</td>
            <td>${occasionLabel}</td>
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
    const allSections = [productsSection, categoriesSection, usersSection, ordersSection, customersSection, reportsSection, businessSection];
    allSections.forEach(s => { if (s) s.style.display = 'none'; });
    formSection.style.display = 'block';
    formTitle.textContent = 'Agregar Producto';
});

// Cancel button
cancelBtn.addEventListener('click', function() {
    formSection.style.display = 'none';
    productsSection.style.display = 'block';
    navTabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-section="products"]').classList.add('active');
    renderProductsTable();
});

// Reset form
function resetForm() {
    productForm.reset();
    document.getElementById('productId').value = '';
    formTitle.textContent = 'Agregar Producto';
    currentImageData = '';
    imagePreview.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    removeImageBtn.style.display = 'none';
    document.getElementById('typeGroup').style.display = 'block';
    document.getElementById('genderGroup').style.display = 'block';
    document.querySelectorAll('input[name="productType"]').forEach(cb => cb.checked = false);
    document.getElementById('productSku').value = '';
    document.getElementById('productStock').value = '0';
    document.getElementById('productCondition').value = 'new';
    document.getElementById('productOlfactory').value = '';
    document.getElementById('productOccasion').value = '';
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
        document.getElementById('productSku').value = product.sku || '';
        document.getElementById('productStock').value = product.stock || 0;
        document.getElementById('productCondition').value = product.condition || 'new';
        document.getElementById('productOlfactory').value = product.olfactory || '';
        document.getElementById('productOccasion').value = product.occasion || '';
        
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
            imagePreview.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
            removeImageBtn.style.display = 'none';
        }
        
        // Show/hide type and gender
        const isPerfume = product.category === 'perfume';
        document.getElementById('typeGroup').style.display = isPerfume ? 'block' : 'none';
        document.getElementById('genderGroup').style.display = isPerfume ? 'block' : 'none';
        
        formTitle.textContent = 'Editar Producto';
        const allSections = [productsSection, categoriesSection, usersSection, ordersSection, customersSection, reportsSection, businessSection];
        allSections.forEach(s => { if (s) s.style.display = 'none'; });
        formSection.style.display = 'block';
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
        tags: tags,
        sku: document.getElementById('productSku').value,
        stock: parseInt(document.getElementById('productStock').value) || 0,
        condition: document.getElementById('productCondition').value,
        olfactory: document.getElementById('productOlfactory').value,
        occasion: document.getElementById('productOccasion').value
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
    
    formSection.style.display = 'none';
    productsSection.style.display = 'block';
    navTabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-section="products"]').classList.add('active');
});

// ---- Export / Import ----
document.getElementById('exportDataBtn').addEventListener('click', function() {
    const data = {
        products: getProducts(),
        business: getBusiness(),
        categories: getCategories(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leperfumcg-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('importDataBtn').addEventListener('click', function() {
    document.getElementById('importFileInput').click();
});

document.getElementById('importFileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        try {
            const data = JSON.parse(ev.target.result);
            if (data.products) {
                if (confirm('Esto reemplazará todos los productos actuales (' + getProducts().length + ' productos) con los del archivo (' + data.products.length + ' productos). ¿Continuar?')) {
                    saveProducts(data.products);
                    renderProductsTable();
                    alert('Productos importados correctamente: ' + data.products.length + ' productos');
                }
            }
            if (data.business) {
                localStorage.setItem(BUSINESS_KEY, JSON.stringify(data.business));
            }
            if (data.categories) {
                localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data.categories));
            }
        } catch (err) {
            alert('Error al leer el archivo: ' + err.message);
        }
    };
    reader.readAsText(file);
    this.value = '';
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

// Profile settings modal
document.getElementById('profileSettingsBtn').addEventListener('click', function() {
    accountMenu.classList.remove('open');
    const user = JSON.parse(localStorage.getItem('current_user'));
    if (user) {
        document.getElementById('profileName').value = user.name || '';
        document.getElementById('profileEmail').value = user.email || '';
        document.getElementById('profilePassword').value = '';
    }
    profileModal.style.display = 'flex';
});

document.getElementById('closeProfileModal').addEventListener('click', function() {
    profileModal.style.display = 'none';
});

document.getElementById('cancelProfileBtn').addEventListener('click', function() {
    profileModal.style.display = 'none';
});

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('current_user'));
    if (!user) return;
    
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index].name = document.getElementById('profileName').value;
        users[index].email = document.getElementById('profileEmail').value;
        const newPass = document.getElementById('profilePassword').value;
        if (newPass) users[index].password = newPass;
        saveUsers(users);
        localStorage.setItem('current_user', JSON.stringify(users[index]));
        updateAccountInfo();
    }
    profileModal.style.display = 'none';
    alert('Perfil actualizado');
});

// Panel settings modal
document.getElementById('panelSettingsBtn').addEventListener('click', function() {
    accountMenu.classList.remove('open');
    const business = getBusiness();
    document.getElementById('panelCompanyName').value = business.name || '';
    document.getElementById('panelSlogan').value = business.slogan || '';
    panelModal.style.display = 'flex';
});

document.getElementById('closePanelModal').addEventListener('click', function() {
    panelModal.style.display = 'none';
});

document.getElementById('cancelPanelBtn').addEventListener('click', function() {
    panelModal.style.display = 'none';
});

document.getElementById('panelSettingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const business = getBusiness();
    business.name = document.getElementById('panelCompanyName').value;
    business.slogan = document.getElementById('panelSlogan').value;
    saveBusiness(business);
    panelModal.style.display = 'none';
    alert('Configuración del panel actualizada');
});

// Close modals on overlay click
[profileModal, panelModal].forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
    });
});
