document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('productsGrid');
    const productDetail = document.getElementById('productDetail');
    const closeDetail = document.getElementById('closeDetail');
    const noResults = document.getElementById('noResults');

    // Cart & Wishlist state
    let cart = JSON.parse(localStorage.getItem('leperfumcg_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('leperfumcg_wishlist')) || [];
    let currentDetailProduct = null;

    let currentCategory = 'all';
    let currentOlfactory = 'all';
    let currentGender = 'all';
    let currentOccasion = 'all';
    let currentSearch = '';

    // ---- Price Formatting ----
    function formatPrice(price) {
        if (typeof price !== 'number') price = parseFloat(price) || 0;
        if (business.currency === 'HNL') {
            return 'L. ' + (price * (business.exchangeRate || 24.50)).toFixed(2);
        }
        return '$ ' + price.toFixed(2);
    }

    function getFinalPrice(product) {
        let price = product.price || 0;
        let discount = product.discount || 0;
        const globalDiscount = business.globalDiscount || 0;
        if (globalDiscount > discount) discount = globalDiscount;
        return { original: price, final: price * (1 - discount / 100), discount: discount };
    }

    // ---- Load Business Info ----
    function loadBusinessInfo() {
        document.getElementById('headerLogo').textContent = business.name;
        document.getElementById('headerSlogan').textContent = business.slogan;
        document.getElementById('footerLogo').textContent = business.name;
        document.getElementById('footerTagline').textContent = business.slogan;
        document.title = business.name + ' - Perfumería Fina';

        // Currency label
        document.getElementById('currencyLabel').textContent = business.currency === 'HNL' ? 'L.' : '$';

        // Category nav
        const mainNav = document.getElementById('mainNav');
        const mobileNav = document.getElementById('mobileNav');
        mainNav.innerHTML = '';
        mobileNav.innerHTML = '';

        const allBtn = document.createElement('button');
        allBtn.className = 'nav-link active';
        allBtn.dataset.filter = 'all';
        allBtn.textContent = 'Todos';
        mainNav.appendChild(allBtn);

        const allBtnMobile = allBtn.cloneNode(true);
        mobileNav.appendChild(allBtnMobile);

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'nav-link';
            btn.dataset.filter = cat.name.toLowerCase();
            btn.textContent = cat.icon + ' ' + cat.name;
            mainNav.appendChild(btn);

            const btnMobile = btn.cloneNode(true);
            mobileNav.appendChild(btnMobile);
        });

        // Attach nav listeners
        document.querySelectorAll('.nav-link').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.filter;
                renderProducts();
                // Close mobile nav
                mobileNav.classList.remove('active');
            });
        });

        // Footer
        document.getElementById('footerText').innerHTML = '&copy; 2026 ' + business.name + ' - ' + business.footer;

        let contactParts = [];
        if (business.email) contactParts.push(business.email);
        if (business.phone) contactParts.push(business.phone);
        if (business.whatsapp) {
            const num = business.whatsapp.replace(/[^0-9]/g, '');
            contactParts.push('<a href="https://wa.me/' + num + '" target="_blank" class="whatsapp-link">WhatsApp</a>');
        }
        if (business.address) contactParts.push(business.address);
        document.getElementById('footerContact').innerHTML = contactParts.join(' &middot; ');

        let socialHTML = '';
        if (business.facebook) socialHTML += '<a href="' + business.facebook + '" target="_blank" class="social-link">Facebook</a>';
        if (business.instagram) socialHTML += '<a href="' + business.instagram + '" target="_blank" class="social-link">Instagram</a>';
        if (business.tiktok) socialHTML += '<a href="' + business.tiktok + '" target="_blank" class="social-link">TikTok</a>';
        document.getElementById('socialLinks').innerHTML = socialHTML;
    }

    // ---- Type & Gender Labels ----
    const typeLabels = { arabe: 'Árabe', disenador: 'Diseñador', replica: 'Réplica', artesanal: 'Artesanal' };
    const genderLabels = { hombre: 'Hombre', mujer: 'Mujer', unisex: 'Unisex' };

    // ---- Render Products ----
    function renderProducts() {
        productsGrid.innerHTML = '';
        let filtered = products;

        if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
        if (currentOlfactory !== 'all') filtered = filtered.filter(p => p.olfactory === currentOlfactory);
        if (currentGender !== 'all') filtered = filtered.filter(p => p.gender === currentGender);
        if (currentOccasion !== 'all') filtered = filtered.filter(p => p.occasion === currentOccasion);
        if (currentSearch) {
            const q = currentSearch.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.brand && p.brand.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }

        if (filtered.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        filtered.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animationDelay = (index * 0.08) + 's';

            const priceInfo = getFinalPrice(product);
            const imageHTML = product.image
                ? '<img src="' + product.image + '" alt="' + product.name + '" class="product-img">'
                : '<span class="product-emoji">' + getCategoryEmoji(product) + '</span>';

            // Badges
            let badgesHTML = '';
            if (priceInfo.discount > 0) {
                badgesHTML += '<span class="badge badge-discount">-' + priceInfo.discount + '%</span>';
            }
            if (product.tags && product.tags.length > 0) {
                product.tags.slice(0, 2).forEach(t => {
                    badgesHTML += '<span class="badge badge-tag">' + t + '</span>';
                });
            }
            if (product.condition === 'used') {
                badgesHTML += '<span class="badge badge-condition">Usado</span>';
            }

            // Rating (random for demo)
            const rating = (4 + Math.random()).toFixed(1);
            const reviewCount = Math.floor(Math.random() * 50) + 5;

            // Price
            let priceHTML;
            if (priceInfo.discount > 0) {
                priceHTML = '<span class="product-price-original">' + formatPrice(priceInfo.original) + '</span>' +
                    '<span class="product-price product-price-discount">' + formatPrice(priceInfo.final) + '</span>' +
                    '<span class="product-discount-tag">-' + priceInfo.discount + '%</span>';
            } else {
                priceHTML = '<span class="product-price">' + formatPrice(priceInfo.original) + '</span>';
            }

            // Hover notes
            const hoverNotes = product.description ? product.description.substring(0, 80) + '...' : 'Haz clic para ver detalles';

            card.innerHTML =
                '<div class="product-image ' + product.category + '">' +
                    imageHTML +
                    '<div class="product-badges">' + badgesHTML + '</div>' +
                    '<div class="product-hover-overlay">' +
                        '<div class="hover-notes">' +
                            '<h4>Descripción</h4>' +
                            '<p>' + hoverNotes + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<button class="quick-add-btn" data-id="' + product.id + '" title="Añadir al carrito">' +
                        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
                    '</button>' +
                '</div>' +
                '<div class="product-info">' +
                    '<p class="product-brand">' + (product.brand || '') + '</p>' +
                    '<h3 class="product-name">' + product.name + '</h3>' +
                    '<div class="product-rating">' +
                        '<span class="stars">\u2605\u2605\u2605\u2605\u2605</span>' +
                        '<span class="rating-count">' + rating + ' (' + reviewCount + ')</span>' +
                    '</div>' +
                    '<div class="product-pricing">' + priceHTML + '</div>' +
                '</div>';

            // Click to open detail
            card.addEventListener('click', function(e) {
                if (e.target.closest('.quick-add-btn')) return;
                showDetail(product);
            });

            // Quick add to cart
            const addBtn = card.querySelector('.quick-add-btn');
            addBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                addToCart(product);
            });

            productsGrid.appendChild(card);
        });
    }

    function getCategoryEmoji(product) {
        if (product.category === 'libro') return '\uD83D\uDCDA';
        if (product.type && product.type.includes('arabe')) return '\uD83C\uDF19';
        if (product.type && product.type.includes('disenador')) return '\uD83D\uDC8E';
        return '\uD83C\uDF38';
    }

    // ---- Product Detail ----
    function showDetail(product) {
        currentDetailProduct = product;
        const imageEl = document.getElementById('detailImage');
        if (product.image) {
            imageEl.innerHTML = '<img src="' + product.image + '" alt="' + product.name + '">';
        } else {
            imageEl.innerHTML = getCategoryEmoji(product);
            imageEl.style.fontSize = '5rem';
        }

        document.getElementById('detailBrand').textContent = product.brand || '';
        document.getElementById('detailName').textContent = product.name;

        let catText = product.category === 'perfume' ? 'Perfume' : 'Libro';
        if (product.type && product.type.length > 0) catText += ' \u2014 ' + product.type.map(t => typeLabels[t] || t).join(', ');
        if (product.gender) catText += ' | ' + (genderLabels[product.gender] || product.gender);
        document.getElementById('detailCategory').textContent = catText;

        const rating = (4 + Math.random()).toFixed(1);
        const reviewCount = Math.floor(Math.random() * 50) + 5;
        document.getElementById('detailRating').innerHTML =
            '<span class="stars">\u2605\u2605\u2605\u2605\u2605</span> <span style="font-size:0.8rem;color:var(--text-muted);">' + rating + ' (' + reviewCount + ' reseñas)</span>';

        document.getElementById('detailDescription').textContent = product.description;

        document.getElementById('detailFeatures').innerHTML =
            '<h4>Características</h4><ul>' +
            (product.features || []).map(f => '<li>' + f + '</li>').join('') +
            '</ul>';

        const priceInfo = getFinalPrice(product);
        if (priceInfo.discount > 0) {
            document.getElementById('detailPrice').innerHTML =
                '<span style="text-decoration:line-through;color:var(--text-muted);font-size:1rem;margin-right:10px;">' +
                formatPrice(priceInfo.original) + '</span>' + formatPrice(priceInfo.final);
        } else {
            document.getElementById('detailPrice').textContent = formatPrice(priceInfo.original);
        }

        // Wishlist button state
        const wishBtn = document.getElementById('detailWishlistBtn');
        if (wishlist.includes(product.id)) {
            wishBtn.classList.add('active');
        } else {
            wishBtn.classList.remove('active');
        }

        productDetail.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDetailModal() {
        productDetail.classList.remove('active');
        document.body.style.overflow = 'auto';
        currentDetailProduct = null;
    }

    closeDetail.addEventListener('click', closeDetailModal);
    productDetail.addEventListener('click', function(e) { if (e.target === productDetail) closeDetailModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeDetailModal(); closeCart(); } });

    // Detail actions
    document.getElementById('detailCartBtn').addEventListener('click', function() {
        if (currentDetailProduct) addToCart(currentDetailProduct);
    });

    document.getElementById('detailWishlistBtn').addEventListener('click', function() {
        if (!currentDetailProduct) return;
        toggleWishlist(currentDetailProduct.id);
        this.classList.toggle('active');
    });

    // ---- Cart ----
    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.image, category: product.category, qty: 1 });
        }
        saveCart();
        updateCartCount();
        openCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
        updateCartCount();
    }

    function saveCart() {
        localStorage.setItem('leperfumcg_cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        const el = document.getElementById('cartCount');
        if (count > 0) { el.textContent = count; el.style.display = 'flex'; }
        else { el.style.display = 'none'; }
    }

    function renderCart() {
        const itemsEl = document.getElementById('cartItems');
        const footerEl = document.getElementById('cartFooter');

        if (cart.length === 0) {
            itemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
            footerEl.style.display = 'none';
            return;
        }

        itemsEl.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const priceInfo = getFinalPrice(item);
            const itemTotal = priceInfo.final * item.qty;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML =
                '<div class="cart-item-img">' +
                    (item.image ? '<img src="' + item.image + '" alt="">' : '\uD83C\uDF38') +
                '</div>' +
                '<div class="cart-item-info">' +
                    '<div class="cart-item-name">' + item.name + '</div>' +
                    '<div class="cart-item-brand">' + (item.brand || '') + ' &middot; x' + item.qty + '</div>' +
                    '<div class="cart-item-price">' + formatPrice(itemTotal) + '</div>' +
                '</div>' +
                '<button class="cart-item-remove" data-id="' + item.id + '">Eliminar</button>';
            itemsEl.appendChild(div);
        });

        itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() { removeFromCart(parseInt(this.dataset.id)); });
        });

        document.getElementById('cartTotal').textContent = formatPrice(total);
        footerEl.style.display = 'block';
    }

    function openCart() {
        document.getElementById('cartPanel').classList.add('active');
        document.getElementById('cartOverlay').classList.add('active');
        renderCart();
    }

    function closeCart() {
        document.getElementById('cartPanel').classList.remove('active');
        document.getElementById('cartOverlay').classList.remove('active');
    }

    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('cartClose').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', closeCart);

    // ---- Wishlist ----
    function toggleWishlist(id) {
        const index = wishlist.indexOf(id);
        if (index > -1) wishlist.splice(index, 1);
        else wishlist.push(id);
        localStorage.setItem('leperfumcg_wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    }

    function updateWishlistCount() {
        const el = document.getElementById('wishlistCount');
        if (wishlist.length > 0) { el.textContent = wishlist.length; el.style.display = 'flex'; }
        else { el.style.display = 'none'; }
    }

    // ---- Currency Toggle ----
    document.getElementById('currencyToggle').addEventListener('click', function() {
        if (business.currency === 'HNL') business.currency = 'USD';
        else business.currency = 'HNL';
        document.getElementById('currencyLabel').textContent = business.currency === 'HNL' ? 'L.' : '$';
        renderProducts();
    });

    // ---- Search ----
    const searchWrapper = document.getElementById('searchWrapper');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    document.getElementById('searchToggle').addEventListener('click', function(e) {
        e.stopPropagation();
        searchWrapper.classList.toggle('open');
        if (searchWrapper.classList.contains('open')) {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('input', function() {
        const q = this.value.trim().toLowerCase();
        if (!q) { searchResults.innerHTML = ''; return; }

        const results = products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.brand && p.brand.toLowerCase().includes(q))
        ).slice(0, 5);

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No se encontraron resultados</div>';
            return;
        }

        searchResults.innerHTML = '';
        results.forEach(p => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML =
                '<div class="search-result-img">' + (p.image ? '<img src="' + p.image + '">' : getCategoryEmoji(p)) + '</div>' +
                '<div><div class="search-result-name">' + p.name + '</div><div class="search-result-brand">' + (p.brand || '') + '</div></div>';
            div.addEventListener('click', function() {
                searchWrapper.classList.remove('open');
                searchInput.value = '';
                searchResults.innerHTML = '';
                showDetail(p);
            });
            searchResults.appendChild(div);
        });
    });

    document.addEventListener('click', function(e) {
        if (!searchWrapper.contains(e.target)) searchWrapper.classList.remove('open');
    });

    // ---- Quick Filters ----
    document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => {
        chip.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const value = this.dataset.value;

            // Update active state within the same filter group
            this.closest('.filter-chips').querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            if (filterType === 'olfactory') currentOlfactory = value;
            else if (filterType === 'gender') currentGender = value;
            else if (filterType === 'occasion') currentOccasion = value;

            renderProducts();
        });
    });

    // ---- Header Scroll ----
    window.addEventListener('scroll', function() {
        const header = document.getElementById('siteHeader');
        if (window.scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // ---- Mobile Menu ----
    document.getElementById('mobileMenuToggle').addEventListener('click', function() {
        document.getElementById('mobileNav').classList.toggle('active');
    });

    // ---- Quiz Button ----
    document.getElementById('quizBtn').addEventListener('click', function() {
        alert('Próximamente: Encuentra tu aroma ideal con nuestro quiz interactivo');
    });

    // ---- Init ----
    loadBusinessInfo();
    renderProducts();
    updateCartCount();
    updateWishlistCount();
});
