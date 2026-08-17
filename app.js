document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('productsGrid');
    const navBtns = document.querySelectorAll('.nav-btn');
    const productDetail = document.getElementById('productDetail');
    const closeDetail = document.getElementById('closeDetail');
    const noResults = document.getElementById('noResults');
    const advancedFilters = document.getElementById('advancedFilters');

    let currentCategory = 'all';
    let currentType = 'all';
    let currentGender = 'all';

    // Format price based on currency
    function formatPrice(price) {
        if (typeof price !== 'number') price = parseFloat(price) || 0;
        
        const globalDiscount = business.globalDiscount || 0;
        
        if (business.currency === 'HNL') {
            const hnlPrice = price * (business.exchangeRate || 24.50);
            return `L. ${hnlPrice.toFixed(2)}`;
        }
        return `$ ${price.toFixed(2)}`;
    }

    // Calculate final price with discounts
    function getFinalPrice(product) {
        let price = product.price || 0;
        let discount = product.discount || 0;
        const globalDiscount = business.globalDiscount || 0;
        
        // Use the higher discount (product or global)
        if (globalDiscount > discount) {
            discount = globalDiscount;
        }
        
        const finalPrice = price * (1 - discount / 100);
        return { original: price, final: finalPrice, discount: discount };
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
        if (business.tiktok) socialHTML += `<a href="${business.tiktok}" target="_blank" class="social-link">TikTok</a>`;
        document.getElementById('socialLinks').innerHTML = socialHTML;
    }

    // Type labels
    const typeLabels = {
        arabe: 'Árabe',
        disenador: 'Diseñador',
        replica: 'Réplica',
        artesanal: 'Artesanal'
    };

    const genderLabels = {
        hombre: 'Hombre',
        mujer: 'Mujer',
        unisex: 'Unisex'
    };

    // Render products
    function renderProducts() {
        productsGrid.innerHTML = '';
        
        let filteredProducts = products;
        
        // Filter by category
        if (currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
        }
        
        // Filter by type
        if (currentType !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.type && p.type.includes(currentType));
        }
        
        // Filter by gender
        if (currentGender !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.gender === currentGender);
        }

        // Show/hide advanced filters based on category
        if (currentCategory === 'perfume' || currentCategory === 'all') {
            advancedFilters.style.display = 'block';
        } else {
            advancedFilters.style.display = 'none';
        }

        if (filteredProducts.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';

        filteredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            const priceInfo = getFinalPrice(product);
            
            // Image or placeholder
            const imageHTML = product.image 
                ? `<img src="${product.image}" alt="${product.name}" class="product-img">`
                : `<span class="product-emoji">${getCategoryEmoji(product)}</span>`;
            
            // Badges
            let badgesHTML = '';
            if (product.type && product.type.length > 0) {
                badgesHTML += product.type.map(t => `<span class="badge badge-type">${typeLabels[t] || t}</span>`).join('');
            }
            if (product.gender && product.gender !== 'unisex') {
                badgesHTML += `<span class="badge badge-gender">${genderLabels[product.gender]}</span>`;
            }
            if (product.brand) {
                badgesHTML += `<span class="badge badge-brand">${product.brand}</span>`;
            }
            
            // Price
            let priceHTML = '';
            if (priceInfo.discount > 0) {
                priceHTML = `
                    <div class="price-container">
                        <span class="price-original">${formatPrice(priceInfo.original)}</span>
                        <span class="price-final">${formatPrice(priceInfo.final)}</span>
                        <span class="price-discount-badge">-${priceInfo.discount}%</span>
                    </div>
                `;
            } else {
                priceHTML = `<p class="product-price">${formatPrice(priceInfo.original)}</p>`;
            }

            card.innerHTML = `
                <div class="product-image ${product.category}">
                    ${imageHTML}
                    ${badgesHTML ? `<div class="product-badges">${badgesHTML}</div>` : ''}
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category === 'perfume' ? 'Perfume' : 'Libro'}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    ${priceHTML}
                </div>
            `;
            card.addEventListener('click', () => showDetail(product));
            productsGrid.appendChild(card);
        });
    }

    function getCategoryEmoji(product) {
        if (product.category === 'libro') return '📚';
        if (product.type && product.type.includes('arabe')) return '🌙';
        if (product.type && product.type.includes('disenador')) return '💎';
        if (product.type && product.type.includes('replica')) return '🔄';
        if (product.type && product.type.includes('artesanal')) return '🌿';
        return '🌸';
    }

    // Show product detail
    function showDetail(product) {
        const imageEl = document.getElementById('detailImage');
        if (product.image) {
            imageEl.innerHTML = `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">`;
        } else {
            imageEl.innerHTML = getCategoryEmoji(product);
        }
        imageEl.className = `detail-image product-image ${product.category}`;
        
        document.getElementById('detailBrand').textContent = product.brand || '';
        document.getElementById('detailName').textContent = product.name;
        
        let categoryText = product.category === 'perfume' ? 'Perfume' : 'Libro';
        if (product.type && product.type.length > 0) {
            categoryText += ' — ' + product.type.map(t => typeLabels[t] || t).join(', ');
        }
        if (product.gender) {
            categoryText += ' | ' + (genderLabels[product.gender] || product.gender);
        }
        document.getElementById('detailCategory').textContent = categoryText;
        
        document.getElementById('detailDescription').textContent = product.description;
        
        const priceInfo = getFinalPrice(product);
        if (priceInfo.discount > 0) {
            document.getElementById('detailPrice').innerHTML = `
                <span class="detail-price-original">${formatPrice(priceInfo.original)}</span>
                <span class="detail-price-final">${formatPrice(priceInfo.final)}</span>
            `;
        } else {
            document.getElementById('detailPrice').textContent = formatPrice(priceInfo.original);
        }
        
        const featuresList = document.getElementById('detailFeatures');
        featuresList.innerHTML = `
            <h4>Características</h4>
            <ul>
                ${(product.features || []).map(f => `<li>${f}</li>`).join('')}
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

    // Category filter buttons
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.filter;
            renderProducts();
        });
    });

    // Type filter chips
    document.querySelectorAll('.filter-chip[data-type]').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.filter-chip[data-type]').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentType = this.dataset.type;
            renderProducts();
        });
    });

    // Gender filter chips
    document.querySelectorAll('.filter-chip[data-gender]').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.filter-chip[data-gender]').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentGender = this.dataset.gender;
            renderProducts();
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
