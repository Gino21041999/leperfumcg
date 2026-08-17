document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('productsGrid');
    const navBtns = document.querySelectorAll('.nav-btn');
    const productDetail = document.getElementById('productDetail');
    const closeDetail = document.getElementById('closeDetail');

    // Format price based on currency
    function formatPrice(priceStr) {
        const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        if (isNaN(numericPrice)) return priceStr;
        
        if (business.currency === 'HNL') {
            const hnlPrice = numericPrice * (business.exchangeRate || 24.50);
            return `L. ${hnlPrice.toFixed(2)}`;
        }
        return `$ ${numericPrice.toFixed(2)}`;
    }

    // Load business info
    function loadBusinessInfo() {
        document.getElementById('headerLogo').textContent = business.name;
        document.getElementById('headerSlogan').textContent = business.slogan;
        document.title = business.name + ' - Catálogo';
        
        let footerHTML = `&copy; 2026 ${business.name} - ${business.footer}`;
        document.getElementById('footerText').innerHTML = footerHTML;
        
        let contactParts = [];
        if (business.email) contactParts.push(`📧 ${business.email}`);
        if (business.phone) contactParts.push(`📱 ${business.phone}`);
        if (business.whatsapp) contactParts.push(`💬 WhatsApp: ${business.whatsapp}`);
        if (business.address) contactParts.push(`📍 ${business.address}`);
        document.getElementById('footerContact').textContent = contactParts.join(' | ');
        
        let socialHTML = '';
        if (business.facebook) socialHTML += `<a href="${business.facebook}" target="_blank" class="social-link">Facebook</a>`;
        if (business.instagram) socialHTML += `<a href="${business.instagram}" target="_blank" class="social-link">Instagram</a>`;
        document.getElementById('socialLinks').innerHTML = socialHTML;
    }

    // Render products
    function renderProducts(filter = 'all') {
        productsGrid.innerHTML = '';
        
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(p => p.category === filter);

        filteredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="product-image ${product.category}">
                    ${product.emoji}
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category === 'perfume' ? 'Perfume' : 'Libro'}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">${formatPrice(product.price)}</p>
                </div>
            `;
            card.addEventListener('click', () => showDetail(product));
            productsGrid.appendChild(card);
        });
    }

    // Show product detail
    function showDetail(product) {
        document.getElementById('detailImage').innerHTML = product.emoji;
        document.getElementById('detailImage').className = `detail-image product-image ${product.category}`;
        document.getElementById('detailName').textContent = product.name;
        document.getElementById('detailCategory').textContent = product.category === 'perfume' ? 'Perfume Artesanal' : 'Libro de Autor';
        document.getElementById('detailDescription').textContent = product.description;
        document.getElementById('detailPrice').textContent = formatPrice(product.price);
        
        const featuresList = document.getElementById('detailFeatures');
        featuresList.innerHTML = `
            <h4>Características</h4>
            <ul>
                ${product.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        `;
        
        productDetail.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close detail
    function closeDetailModal() {
        productDetail.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Filter buttons
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProducts(this.dataset.filter);
        });
    });

    // Close modal
    closeDetail.addEventListener('click', closeDetailModal);
    productDetail.addEventListener('click', function(e) {
        if (e.target === productDetail) {
            closeDetailModal();
        }
    });

    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDetailModal();
        }
    });

    // Initial render
    loadBusinessInfo();
    renderProducts();
});
