document.addEventListener('DOMContentLoaded', function() {
    var productsGrid = document.getElementById('productsGrid');
    var featuredGrid = document.getElementById('featuredGrid');
    var noResults = document.getElementById('noResults');
    var cart = JSON.parse(localStorage.getItem('leperfumcg_cart')) || [];
    var wishlist = JSON.parse(localStorage.getItem('leperfumcg_wishlist')) || [];
    var currentDetailProduct = null;
    var detailQty = 1;
    var appliedCoupon = null;

    var currentCategory = 'all';
    var currentOlfactory = 'all';
    var currentGender = 'all';
    var currentOccasion = 'all';
    var currentSort = 'default';
    var currentSearch = '';

    function formatPrice(price) {
        if (typeof price !== 'number') price = parseFloat(price) || 0;
        return 'L. ' + (price * (business.exchangeRate || 24.50)).toFixed(2);
    }

    function getFinalPrice(product) {
        var price = product.price || 0;
        var discount = product.discount || 0;
        var globalDiscount = business.globalDiscount || 0;
        if (globalDiscount > discount) discount = globalDiscount;
        return { original: price, final: price * (1 - discount / 100), discount: discount };
    }

    function escapeHTML(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getCategoryEmoji(product) {
        if (product.category === 'libro') return '\uD83D\uDCDA';
        if (product.type && product.type.includes('arabe')) return '\uD83C\uDF19';
        if (product.type && product.type.includes('disenador')) return '\uD83D\uDC8E';
        return '\uD83C\uDF38';
    }

    function renderStars(rating) {
        var full = Math.floor(rating || 0);
        var html = '';
        for (var i = 0; i < 5; i++) {
            html += i < full ? '\u2605' : '\u2606';
        }
        return html;
    }

    // ---- Load Business Info ----
    function loadBusinessInfo() {
        document.getElementById('headerLogo').textContent = business.name;
        document.getElementById('headerSlogan').textContent = business.slogan;
        document.getElementById('footerLogo').textContent = business.name;
        document.getElementById('footerTagline').textContent = business.slogan;
        document.title = business.name + ' - Perfumería Fina';

        var topMsg = document.getElementById('topBarMsg');
        if (topMsg) topMsg.textContent = 'Envío Gratis en compras mayores a ' + formatPrice(business.shippingCost || 40);

        var mainNav = document.getElementById('mainNav');
        var mobileNav = document.getElementById('mobileNav');
        mainNav.innerHTML = '';
        mobileNav.innerHTML = '';

        var allBtn = document.createElement('button');
        allBtn.className = 'nav-link active';
        allBtn.dataset.filter = 'all';
        allBtn.textContent = 'Todos';
        mainNav.appendChild(allBtn);
        mobileNav.appendChild(allBtn.cloneNode(true));

        categories.forEach(function(cat) {
            var btn = document.createElement('button');
            btn.className = 'nav-link';
            btn.dataset.filter = cat.name.toLowerCase();
            btn.textContent = (cat.icon || '') + ' ' + cat.name;
            mainNav.appendChild(btn);
            mobileNav.appendChild(btn.cloneNode(true));
        });

        document.querySelectorAll('.nav-link').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.nav-link').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                currentCategory = this.dataset.filter;
                renderProducts();
                mobileNav.classList.remove('active');
            });
        });

        document.getElementById('footerText').innerHTML = '&copy; 2026 ' + business.name + ' - ' + (business.footer || '');

        var contactParts = [];
        if (business.email) contactParts.push(escapeHTML(business.email));
        if (business.phone) contactParts.push(escapeHTML(business.phone));
        if (business.whatsapp) {
            var num = business.whatsapp.replace(/[^0-9]/g, '');
            contactParts.push('<a href="https://wa.me/' + num + '" target="_blank" class="whatsapp-link">WhatsApp</a>');
        }
        if (business.address) contactParts.push(escapeHTML(business.address));
        document.getElementById('footerContact').innerHTML = contactParts.join(' &middot; ');

        var socialHTML = '';
        if (business.facebook) socialHTML += '<a href="' + business.facebook + '" target="_blank" class="social-link">Facebook</a>';
        if (business.instagram) socialHTML += '<a href="' + business.instagram + '" target="_blank" class="social-link">Instagram</a>';
        if (business.tiktok) socialHTML += '<a href="' + business.tiktok + '" target="_blank" class="social-link">TikTok</a>';
        document.getElementById('socialLinks').innerHTML = socialHTML;

        renderCategoriesHome();
        renderBrands();
        renderFeatured();
    }

    function renderCategoriesHome() {
        var grid = document.getElementById('categoriesGrid');
        if (!grid) return;
        grid.innerHTML = '';
        categories.forEach(function(cat) {
            var count = products.filter(function(p) { return p.category === cat.name.toLowerCase(); }).length;
            var card = document.createElement('a');
            card.className = 'category-card';
            card.href = '#catalog';
            card.innerHTML = '<div class="category-card-icon">' + (cat.icon || '') + '</div>' +
                '<div class="category-card-name">' + escapeHTML(cat.name) + '</div>' +
                '<div class="category-card-count">' + count + ' producto' + (count !== 1 ? 's' : '') + '</div>';
            card.addEventListener('click', function(e) {
                currentCategory = cat.name.toLowerCase();
                document.querySelectorAll('.nav-link').forEach(function(b) {
                    b.classList.toggle('active', b.dataset.filter === currentCategory);
                });
            });
            grid.appendChild(card);
        });
    }

    function renderBrands() {
        var marquee = document.getElementById('brandsMarquee');
        if (!marquee) return;
        marquee.innerHTML = '';
        var brandNames = [];
        products.forEach(function(p) {
            if (p.brand && brandNames.indexOf(p.brand) === -1) brandNames.push(p.brand);
        });
        brandNames.forEach(function(name) {
            var item = document.createElement('div');
            item.className = 'brand-item';
            item.textContent = name.toUpperCase();
            item.addEventListener('click', function() {
                currentSearch = name;
                document.getElementById('searchInput').value = name;
                renderProducts();
                document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
            });
            marquee.appendChild(item);
        });
    }

    function renderFeatured() {
        if (!featuredGrid) return;
        featuredGrid.innerHTML = '';
        var featured = products.filter(function(p) { return p.tags && (p.tags.indexOf('bestseller') !== -1 || p.tags.indexOf('nuevo') !== -1); }).slice(0, 3);
        if (featured.length === 0) featured = products.slice(0, 3);
        featured.forEach(function(product, index) {
            featuredGrid.appendChild(createProductCard(product, index));
        });
    }

    var typeLabels = { arabe: 'Árabe', disenador: 'Diseñador', replica: 'Réplica', artesanal: 'Artesanal' };
    var genderLabels = { hombre: 'Hombre', mujer: 'Mujer', unisex: 'Unisex' };

    function createProductCard(product, index) {
        var card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = (index * 0.08) + 's';

        var priceInfo = getFinalPrice(product);
        var imageHTML = product.image
            ? '<img src="' + product.image + '" alt="' + escapeHTML(product.name) + '" class="product-img">'
            : '<span class="product-emoji">' + getCategoryEmoji(product) + '</span>';

        var badgesHTML = '';
        if (priceInfo.discount > 0) badgesHTML += '<span class="badge badge-discount">-' + priceInfo.discount + '%</span>';
        if (product.tags && product.tags.length > 0) {
            product.tags.slice(0, 2).forEach(function(t) { badgesHTML += '<span class="badge badge-tag">' + escapeHTML(t) + '</span>'; });
        }
        if (product.condition === 'used') badgesHTML += '<span class="badge badge-condition">Usado</span>';
        if (product.stock !== undefined && product.stock <= 0) badgesHTML += '<span class="badge badge-condition">Agotado</span>';

        var rating = product.rating || 4.5;
        var reviewCount = product.reviewCount || 0;

        var priceHTML;
        if (priceInfo.discount > 0) {
            priceHTML = '<span class="product-price-original">' + formatPrice(priceInfo.original) + '</span>' +
                '<span class="product-price product-price-discount">' + formatPrice(priceInfo.final) + '</span>' +
                '<span class="product-discount-tag">-' + priceInfo.discount + '%</span>';
        } else {
            priceHTML = '<span class="product-price">' + formatPrice(priceInfo.original) + '</span>';
        }

        var hoverNotes = product.description ? escapeHTML(product.description.substring(0, 80)) + '...' : 'Haz clic para ver detalles';

        var isWished = wishlist.indexOf(product.id) !== -1;

        card.innerHTML =
            '<div class="product-image ' + escapeHTML(product.category) + '">' +
                imageHTML +
                '<div class="product-badges">' + badgesHTML + '</div>' +
                '<button class="wishlist-card-btn' + (isWished ? ' active' : '') + '" data-id="' + product.id + '" title="Favorito">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + (isWished ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
                '</button>' +
                '<div class="product-hover-overlay">' +
                    '<div class="hover-notes"><h4>Descripción</h4><p>' + hoverNotes + '</p></div>' +
                '</div>' +
                '<button class="quick-add-btn" data-id="' + product.id + '" title="Añadir al carrito"' + (product.stock <= 0 ? ' disabled style="opacity:0.3"' : '') + '>' +
                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
                '</button>' +
            '</div>' +
            '<div class="product-info">' +
                '<p class="product-brand">' + escapeHTML(product.brand || '') + '</p>' +
                '<h3 class="product-name">' + escapeHTML(product.name) + '</h3>' +
                '<div class="product-rating">' +
                    '<span class="stars">' + renderStars(rating) + '</span>' +
                    '<span class="rating-count">' + rating.toFixed(1) + ' (' + reviewCount + ')</span>' +
                '</div>' +
                '<div class="product-pricing">' + priceHTML + '</div>' +
            '</div>';

        card.addEventListener('click', function(e) {
            if (e.target.closest('.quick-add-btn') || e.target.closest('.wishlist-card-btn')) return;
            showDetail(product);
        });

        var addBtn = card.querySelector('.quick-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (product.stock > 0) addToCart(product);
            });
        }

        var wishBtn = card.querySelector('.wishlist-card-btn');
        if (wishBtn) {
            wishBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleWishlist(product.id);
                this.classList.toggle('active');
            });
        }

        return card;
    }

    // ---- Render Products ----
    function renderProducts() {
        productsGrid.innerHTML = '';
        var filtered = products.slice();

        if (currentCategory !== 'all') filtered = filtered.filter(function(p) { return p.category === currentCategory; });
        if (currentOlfactory !== 'all') filtered = filtered.filter(function(p) { return p.olfactory === currentOlfactory; });
        if (currentGender !== 'all') filtered = filtered.filter(function(p) { return p.gender === currentGender; });
        if (currentOccasion !== 'all') filtered = filtered.filter(function(p) { return p.occasion === currentOccasion; });
        if (currentSearch) {
            var q = currentSearch.toLowerCase();
            filtered = filtered.filter(function(p) {
                return p.name.toLowerCase().indexOf(q) !== -1 ||
                    (p.brand && p.brand.toLowerCase().indexOf(q) !== -1) ||
                    (p.description && p.description.toLowerCase().indexOf(q) !== -1);
            });
        }

        // Sort
        if (currentSort === 'newest') filtered.reverse();
        else if (currentSort === 'price-asc') filtered.sort(function(a, b) { return (a.price || 0) - (b.price || 0); });
        else if (currentSort === 'price-desc') filtered.sort(function(a, b) { return (b.price || 0) - (a.price || 0); });
        else if (currentSort === 'bestselling') filtered.sort(function(a, b) { return (b.reviewCount || 0) - (a.reviewCount || 0); });
        else if (currentSort === 'rating') filtered.sort(function(a, b) { return (b.rating || 0) - (a.rating || 0); });

        if (filtered.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        filtered.forEach(function(product, index) {
            productsGrid.appendChild(createProductCard(product, index));
        });
    }

    // ---- Product Detail ----
    function showDetail(product) {
        currentDetailProduct = product;
        detailQty = 1;
        var imageEl = document.getElementById('detailImage');
        if (product.image) {
            imageEl.innerHTML = '<img src="' + product.image + '" alt="' + escapeHTML(product.name) + '">';
        } else {
            imageEl.innerHTML = getCategoryEmoji(product);
            imageEl.style.fontSize = '5rem';
        }

        document.getElementById('detailBrand').textContent = product.brand || '';
        document.getElementById('detailName').textContent = product.name;

        var catText = product.category === 'perfume' ? 'Perfume' : product.category === 'libro' ? 'Libro' : product.category;
        if (product.type && product.type.length > 0) catText += ' \u2014 ' + product.type.map(function(t) { return typeLabels[t] || t; }).join(', ');
        if (product.gender) catText += ' | ' + (genderLabels[product.gender] || product.gender);
        document.getElementById('detailCategory').textContent = catText;

        var rating = product.rating || 4.5;
        var reviewCount = product.reviewCount || 0;
        document.getElementById('detailRating').innerHTML =
            '<span class="stars">' + renderStars(rating) + '</span> <span style="font-size:0.8rem;color:var(--text-muted);">' + rating.toFixed(1) + ' (' + reviewCount + ' reseñas)</span>';

        document.getElementById('detailDescription').textContent = product.description || '';

        document.getElementById('detailFeatures').innerHTML =
            '<h4>Características</h4><ul>' +
            (product.features || []).map(function(f) { return '<li>' + escapeHTML(f) + '</li>'; }).join('') +
            '</ul>';

        // Notes
        var notesEl = document.getElementById('detailNotes');
        if (product.notes && (product.notes.top || product.notes.heart || product.notes.base)) {
            notesEl.innerHTML = '<h4>Notas Olfativas</h4><div class="detail-notes-list">' +
                (product.notes.top ? '<div class="detail-note-item"><strong>Salida:</strong> ' + escapeHTML(product.notes.top) + '</div>' : '') +
                (product.notes.heart ? '<div class="detail-note-item"><strong>Corazón:</strong> ' + escapeHTML(product.notes.heart) + '</div>' : '') +
                (product.notes.base ? '<div class="detail-note-item"><strong>Fondo:</strong> ' + escapeHTML(product.notes.base) + '</div>' : '') +
                '</div>';
        } else {
            notesEl.innerHTML = '';
        }

        var priceInfo = getFinalPrice(product);
        if (priceInfo.discount > 0) {
            document.getElementById('detailPrice').innerHTML =
                '<span style="text-decoration:line-through;color:var(--text-muted);font-size:1rem;margin-right:10px;">' +
                formatPrice(priceInfo.original) + '</span>' + formatPrice(priceInfo.final);
        } else {
            document.getElementById('detailPrice').textContent = formatPrice(priceInfo.original);
        }

        document.getElementById('detailQtyValue').textContent = '1';

        var wishBtn = document.getElementById('detailWishlistBtn');
        if (wishlist.indexOf(product.id) !== -1) wishBtn.classList.add('active');
        else wishBtn.classList.remove('active');

        document.getElementById('productDetail').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDetailModal() {
        document.getElementById('productDetail').classList.remove('active');
        document.body.style.overflow = 'auto';
        currentDetailProduct = null;
    }

    document.getElementById('closeDetail').addEventListener('click', closeDetailModal);
    document.getElementById('productDetail').addEventListener('click', function(e) { if (e.target === document.getElementById('productDetail')) closeDetailModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeDetailModal(); closeCart(); } });

    // Detail qty
    document.getElementById('detailQtyMinus').addEventListener('click', function() {
        if (detailQty > 1) { detailQty--; document.getElementById('detailQtyValue').textContent = detailQty; }
    });
    document.getElementById('detailQtyPlus').addEventListener('click', function() {
        if (currentDetailProduct && detailQty < (currentDetailProduct.stock || 99)) { detailQty++; document.getElementById('detailQtyValue').textContent = detailQty; }
    });

    document.getElementById('detailCartBtn').addEventListener('click', function() {
        if (currentDetailProduct) { addToCart(currentDetailProduct, detailQty); closeDetailModal(); }
    });

    document.getElementById('detailBuyBtn').addEventListener('click', function() {
        if (currentDetailProduct) { addToCart(currentDetailProduct, detailQty); closeDetailModal(); window.location.hash = 'checkout'; }
    });

    document.getElementById('detailWishlistBtn').addEventListener('click', function() {
        if (!currentDetailProduct) return;
        toggleWishlist(currentDetailProduct.id);
        this.classList.toggle('active');
    });

    // Share
    document.querySelectorAll('.share-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var type = this.dataset.share;
            var url = window.location.href;
            var text = currentDetailProduct ? currentDetailProduct.name + ' - ' + business.name : business.name;
            if (type === 'whatsapp') window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url));
            else if (type === 'facebook') window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url));
            else if (type === 'copy') { navigator.clipboard.writeText(url); toast('Enlace copiado', 'info'); }
        });
    });

    // ---- Cart ----
    function addToCart(product, qty) {
        qty = qty || 1;
        var existing = cart.find(function(item) { return item.id === product.id; });
        if (existing) {
            existing.qty += qty;
        } else {
            var priceInfo = getFinalPrice(product);
            cart.push({ id: product.id, name: product.name, brand: product.brand, price: priceInfo.final, originalPrice: product.price, image: product.image, category: product.category, qty: qty });
        }
        saveCart();
        updateCartCount();
        openCart();
        toast('Producto agregado al carrito');
    }

    function removeFromCart(id) {
        cart = cart.filter(function(item) { return item.id !== id; });
        saveCart();
        renderCart();
        updateCartCount();
    }

    function updateCartQty(id, delta) {
        var item = cart.find(function(i) { return i.id === id; });
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) { removeFromCart(id); return; }
        saveCart();
        renderCart();
        updateCartCount();
    }

    function saveCart() { localStorage.setItem('leperfumcg_cart', JSON.stringify(cart)); }

    function updateCartCount() {
        var count = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
        var el = document.getElementById('cartCount');
        if (count > 0) { el.textContent = count; el.style.display = 'flex'; }
        else { el.style.display = 'none'; }
    }

    function renderCart() {
        var itemsEl = document.getElementById('cartItems');
        var footerEl = document.getElementById('cartFooter');
        var couponArea = document.getElementById('cartCouponArea');

        if (cart.length === 0) {
            itemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
            footerEl.style.display = 'none';
            couponArea.style.display = 'none';
            document.getElementById('cartItemCount').textContent = '(0)';
            return;
        }

        document.getElementById('cartItemCount').textContent = '(' + cart.reduce(function(s, i) { return s + i.qty; }, 0) + ')';
        couponArea.style.display = 'block';
        itemsEl.innerHTML = '';
        var subtotal = 0;

        cart.forEach(function(item) {
            var itemTotal = (item.price || 0) * item.qty;
            subtotal += itemTotal;

            var div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML =
                '<div class="cart-item-img">' + (item.image ? '<img src="' + item.image + '" alt="">' : '\uD83C\uDF38') + '</div>' +
                '<div class="cart-item-info">' +
                    '<div class="cart-item-name">' + escapeHTML(item.name) + '</div>' +
                    '<div class="cart-item-brand">' + escapeHTML(item.brand || '') + '</div>' +
                    '<div class="cart-item-price">' + formatPrice(itemTotal) + '</div>' +
                    '<div class="cart-item-qty">' +
                        '<button class="cart-qty-minus" data-id="' + item.id + '">-</button>' +
                        '<span>' + item.qty + '</span>' +
                        '<button class="cart-qty-plus" data-id="' + item.id + '">+</button>' +
                    '</div>' +
                '</div>' +
                '<button class="cart-item-remove" data-id="' + item.id + '">&times;</button>';
            itemsEl.appendChild(div);
        });

        itemsEl.querySelectorAll('.cart-item-remove').forEach(function(btn) {
            btn.addEventListener('click', function() { removeFromCart(parseInt(this.dataset.id)); });
        });

        itemsEl.querySelectorAll('.cart-qty-minus').forEach(function(btn) {
            btn.addEventListener('click', function() { updateCartQty(parseInt(this.dataset.id), -1); });
        });

        itemsEl.querySelectorAll('.cart-qty-plus').forEach(function(btn) {
            btn.addEventListener('click', function() { updateCartQty(parseInt(this.dataset.id), 1); });
        });

        // Discount
        var discount = 0;
        if (appliedCoupon && appliedCoupon.active) {
            if (appliedCoupon.type === 'fixed') discount = appliedCoupon.value;
            else if (appliedCoupon.type === 'percent') discount = subtotal * (appliedCoupon.value / 100);
        }

        var shipping = (business.shippingCost || 0);
        var freeMin = business.freeShippingMin || 1000;
        var exchangeRate = business.exchangeRate || 24.50;
        var subtotalHNL = subtotal * exchangeRate;
        if (subtotalHNL >= freeMin * exchangeRate) shipping = 0;

        var total = subtotalHNL - (discount * exchangeRate) + (shipping * exchangeRate);

        document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
        var discountRow = document.getElementById('cartDiscountRow');
        if (discount > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('cartDiscount').textContent = '- ' + formatPrice(discount);
        } else {
            discountRow.style.display = 'none';
        }
        document.getElementById('cartShipping').textContent = shipping === 0 ? 'Gratis' : formatPrice(shipping);
        document.getElementById('cartTotal').textContent = formatPrice(total > 0 ? total / exchangeRate : 0);
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
    document.getElementById('cartContinueBtn').addEventListener('click', closeCart);

    // Coupon
    document.getElementById('applyCouponBtn').addEventListener('click', function() {
        var code = document.getElementById('couponInput').value.trim().toUpperCase();
        if (!code) return;
        var allCoupons = JSON.parse(localStorage.getItem('leperfumcg_coupons') || '[]');
        var found = allCoupons.find(function(c) { return c.code.toUpperCase() === code && c.active; });
        if (found) {
            appliedCoupon = found;
            toast('Cupón aplicado: ' + found.code, 'success');
            renderCart();
        } else {
            toast('Cupón no válido', 'error');
        }
    });

    // Checkout button
    document.getElementById('cartCheckoutBtn').addEventListener('click', function() {
        closeCart();
        window.location.hash = 'checkout';
    });

    // ---- Wishlist ----
    function toggleWishlist(id) {
        var index = wishlist.indexOf(id);
        if (index > -1) { wishlist.splice(index, 1); toast('Eliminado de favoritos', 'info'); }
        else { wishlist.push(id); toast('Agregado a favoritos', 'success'); }
        localStorage.setItem('leperfumcg_wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    }

    function updateWishlistCount() {
        var el = document.getElementById('wishlistCount');
        if (wishlist.length > 0) { el.textContent = wishlist.length; el.style.display = 'flex'; }
        else { el.style.display = 'none'; }
    }

    // ---- Search ----
    var searchWrapper = document.getElementById('searchWrapper');
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');

    document.getElementById('searchToggle').addEventListener('click', function(e) {
        e.stopPropagation();
        searchWrapper.classList.toggle('open');
        if (searchWrapper.classList.contains('open')) searchInput.focus();
    });

    searchInput.addEventListener('input', function() {
        var q = this.value.trim().toLowerCase();
        if (!q) { searchResults.innerHTML = ''; return; }

        var results = products.filter(function(p) {
            return p.name.toLowerCase().indexOf(q) !== -1 || (p.brand && p.brand.toLowerCase().indexOf(q) !== -1);
        }).slice(0, 5);

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No se encontraron resultados</div>';
            return;
        }

        searchResults.innerHTML = '';
        results.forEach(function(p) {
            var div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML =
                '<div class="search-result-img">' + (p.image ? '<img src="' + p.image + '">' : getCategoryEmoji(p)) + '</div>' +
                '<div><div class="search-result-name">' + escapeHTML(p.name) + '</div><div class="search-result-brand">' + escapeHTML(p.brand || '') + '</div></div>';
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

    // ---- Filters ----
    function updateFilterDots() {
        var o = document.getElementById('dotOlfactory');
        var g = document.getElementById('dotGender');
        var oc = document.getElementById('dotOccasion');
        if (o) o.classList.toggle('active', currentOlfactory !== 'all');
        if (g) g.classList.toggle('active', currentGender !== 'all');
        if (oc) oc.classList.toggle('active', currentOccasion !== 'all');

        var clearBtn = document.getElementById('clearFilters');
        var anyActive = currentOlfactory !== 'all' || currentGender !== 'all' || currentOccasion !== 'all' || currentSort !== 'default';
        if (clearBtn) clearBtn.classList.toggle('visible', anyActive);
    }

    document.querySelectorAll('.filter-select[data-filter]').forEach(function(sel) {
        sel.addEventListener('change', function() {
            var filterType = this.dataset.filter;
            var value = this.value;
            if (filterType === 'olfactory') currentOlfactory = value;
            else if (filterType === 'gender') currentGender = value;
            else if (filterType === 'occasion') currentOccasion = value;
            else if (filterType === 'sort') currentSort = value;
            updateFilterDots();
            renderProducts();
        });
    });

    document.getElementById('clearFilters').addEventListener('click', function() {
        currentOlfactory = 'all';
        currentGender = 'all';
        currentOccasion = 'all';
        currentSort = 'default';
        currentSearch = '';
        document.getElementById('filterOlfactory').value = 'all';
        document.getElementById('filterGender').value = 'all';
        document.getElementById('filterOccasion').value = 'all';
        document.getElementById('filterSort').value = 'default';
        updateFilterDots();
        renderProducts();
    });

    // ---- Header Scroll ----
    window.addEventListener('scroll', function() {
        var header = document.getElementById('siteHeader');
        if (window.scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // ---- Mobile Menu ----
    document.getElementById('mobileMenuToggle').addEventListener('click', function() {
        document.getElementById('mobileNav').classList.toggle('active');
    });

    // ---- Newsletter ----
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        toast('¡Gracias por suscribirte!', 'success');
        this.reset();
    });

    // ---- Account Button (Customer) ----
    document.getElementById('accountBtnStore').addEventListener('click', function() {
        window.location.hash = 'account';
    });

    // ---- Hash Routing ----
    function handleRoute() {
        var hash = window.location.hash.slice(1);
        var homeView = document.getElementById('homeView');
        var productView = document.getElementById('productView');
        var checkoutView = document.getElementById('checkoutView');
        var accountView = document.getElementById('accountView');

        homeView.style.display = 'none';
        productView.style.display = 'none';
        checkoutView.style.display = 'none';
        accountView.style.display = 'none';

        if (hash.startsWith('product/')) {
            var id = parseInt(hash.split('/')[1]);
            var p = products.find(function(pr) { return pr.id === id; });
            if (p) { showDetail(p); homeView.style.display = 'block'; }
            else { homeView.style.display = 'block'; }
        } else if (hash === 'checkout') {
            checkoutView.style.display = 'block';
            renderCheckout(checkoutView);
        } else if (hash === 'account') {
            accountView.style.display = 'block';
            renderAccount(accountView);
        } else {
            homeView.style.display = 'block';
        }
        window.scrollTo(0, 0);
    }

    function renderCheckout(container) {
        if (cart.length === 0) {
            container.innerHTML = '<div class="container" style="padding:80px 20px;text-align:center;"><h2 style="font-family:var(--font-serif);margin-bottom:16px;">Tu carrito está vacío</h2><p style="color:var(--text-muted);margin-bottom:24px;">Agrega productos antes de continuar con la compra.</p><a href="#catalog" class="hero-cta">Ver Catálogo</a></div>';
            return;
        }

        var subtotal = cart.reduce(function(s, i) { return s + (i.price || 0) * i.qty; }, 0);
        var exchangeRate = business.exchangeRate || 24.50;
        var subtotalHNL = subtotal * exchangeRate;
        var shipping = business.shippingCost || 150;
        var freeMin = business.freeShippingMin || 1000;
        if (subtotalHNL >= freeMin * exchangeRate) shipping = 0;
        var total = subtotalHNL + shipping * exchangeRate;

        var itemsHTML = cart.map(function(item) {
            return '<div class="cart-item"><div class="cart-item-img">' + (item.image ? '<img src="' + item.image + '">' : '\uD83C\uDF38') + '</div><div class="cart-item-info"><div class="cart-item-name">' + escapeHTML(item.name) + '</div><div class="cart-item-brand">' + escapeHTML(item.brand || '') + ' &middot; x' + item.qty + '</div><div class="cart-item-price">' + formatPrice((item.price || 0) * item.qty) + '</div></div></div>';
        }).join('');

        container.innerHTML = '<div class="container" style="padding:40px 0;max-width:900px;">' +
            '<h2 style="font-family:var(--font-serif);font-size:2rem;margin-bottom:32px;">Finalizar Compra</h2>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">' +
            '<div><h3 style="font-size:1rem;margin-bottom:16px;color:var(--accent);">Datos de Envío</h3>' +
            '<form id="checkoutForm" class="product-form" style="max-width:100%;">' +
            '<div class="form-group"><label>Nombre Completo</label><input type="text" id="checkoutName" required placeholder="Tu nombre completo"></div>' +
            '<div class="form-row"><div class="form-group"><label>Teléfono</label><input type="tel" id="checkoutPhone" required placeholder="+504 XXXX-XXXX"></div><div class="form-group"><label>Correo</label><input type="email" id="checkoutEmail" required placeholder="correo@ejemplo.com"></div></div>' +
            '<div class="form-group"><label>Dirección</label><input type="text" id="checkoutAddress" required placeholder="Dirección completa"></div>' +
            '<div class="form-row"><div class="form-group"><label>Departamento</label><input type="text" id="checkoutDept" placeholder="Ej: Cortés"></div><div class="form-group"><label>Municipio</label><input type="text" id="checkoutMuni" placeholder="Ej: San Pedro Sula"></div></div>' +
            '<div class="form-group"><label>Referencia</label><input type="text" id="checkoutRef" placeholder="Punto de referencia (opcional)"></div>' +
            '<div class="form-group"><label>Método de Pago</label><select id="checkoutPayment"><option value="contra-entrega">Contra Entrega</option><option value="transferencia">Transferencia Bancaria</option><option value="pago-movil">Pago Móvil</option></select></div>' +
            '<div class="form-group"><label>Notas (opcional)</label><textarea id="checkoutNotes" rows="2" placeholder="Instrucciones especiales..."></textarea></div>' +
            '<button type="submit" class="btn-primary" style="width:100%;padding:14px;font-size:0.9rem;margin-top:8px;">Confirmar Pedido</button>' +
            '</form></div>' +
            '<div><h3 style="font-size:1rem;margin-bottom:16px;color:var(--accent);">Resumen del Pedido</h3>' +
            '<div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;">' +
            itemsHTML +
            '<div style="border-top:1px solid var(--border);margin-top:12px;padding-top:12px;">' +
            '<div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-secondary);margin-bottom:6px;"><span>Subtotal</span><span>' + formatPrice(subtotal) + '</span></div>' +
            '<div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-secondary);margin-bottom:6px;"><span>Envío</span><span>' + (shipping === 0 ? '<span style="color:var(--green);">Gratis</span>' : formatPrice(shipping)) + '</span></div>' +
            '<div style="display:flex;justify-content:space-between;font-size:1.1rem;font-weight:700;border-top:1px solid var(--border);padding-top:10px;margin-top:6px;"><span>Total</span><span style="color:var(--accent);">' + formatPrice(total / exchangeRate) + '</span></div>' +
            '</div></div>' +
            '</div></div></div>';

        document.getElementById('checkoutForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var order = {
                id: Date.now(),
                customer: {
                    name: document.getElementById('checkoutName').value,
                    phone: document.getElementById('checkoutPhone').value,
                    email: document.getElementById('checkoutEmail').value,
                    address: document.getElementById('checkoutAddress').value,
                    dept: document.getElementById('checkoutDept').value,
                    muni: document.getElementById('checkoutMuni').value,
                    ref: document.getElementById('checkoutRef').value
                },
                items: cart.slice(),
                payment: document.getElementById('checkoutPayment').value,
                notes: document.getElementById('checkoutNotes').value,
                subtotal: subtotal,
                shipping: shipping,
                total: total / exchangeRate,
                status: 'pendiente',
                date: new Date().toISOString()
            };

            var allOrders = JSON.parse(localStorage.getItem('leperfumcg_orders') || '[]');
            allOrders.push(order);
            localStorage.setItem('leperfumcg_orders', JSON.stringify(allOrders));

            // Reduce stock
            var allProducts = getProductsLocal();
            cart.forEach(function(item) {
                var p = allProducts.find(function(pr) { return pr.id === item.id; });
                if (p && p.stock) p.stock = Math.max(0, p.stock - item.qty);
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allProducts));

            cart = [];
            saveCart();
            updateCartCount();

            container.innerHTML = '<div class="container" style="padding:80px 20px;text-align:center;">' +
                '<div style="font-size:4rem;margin-bottom:16px;">✅</div>' +
                '<h2 style="font-family:var(--font-serif);font-size:2rem;margin-bottom:12px;">¡Pedido Confirmado!</h2>' +
                '<p style="color:var(--text-muted);margin-bottom:8px;">Tu número de pedido es:</p>' +
                '<p style="color:var(--accent);font-size:1.3rem;font-weight:700;margin-bottom:24px;">#' + order.id.toString().slice(-8) + '</p>' +
                '<p style="color:var(--text-secondary);max-width:480px;margin:0 auto 32px;">Recibirás un correo de confirmación. Si elegiste contra entrega, te contactaremos por WhatsApp.</p>' +
                '<a href="index.html" class="hero-cta">Volver a la Tienda</a></div>';
        });
    }

    function renderAccount(container) {
        var loggedUser = JSON.parse(localStorage.getItem('leperfumcg_customer') || 'null');
        var allOrders = JSON.parse(localStorage.getItem('leperfumcg_orders') || '[]');

        if (!loggedUser) {
            container.innerHTML = '<div class="container" style="padding:60px 0;max-width:440px;">' +
                '<h2 style="font-family:var(--font-serif);font-size:2rem;margin-bottom:24px;text-align:center;">Mi Cuenta</h2>' +
                '<div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius);padding:32px;">' +
                '<div id="accountTabLogin">' +
                '<h3 style="font-size:1rem;margin-bottom:16px;color:var(--accent);">Iniciar Sesión</h3>' +
                '<form id="customerLoginForm" class="product-form" style="max-width:100%;">' +
                '<div class="form-group"><label>Correo</label><input type="email" id="custLoginEmail" required placeholder="correo@ejemplo.com"></div>' +
                '<div class="form-group"><label>Contraseña</label><input type="password" id="custLoginPass" required placeholder="Tu contraseña"></div>' +
                '<button type="submit" class="btn-primary" style="width:100%;">Iniciar Sesión</button>' +
                '<p style="text-align:center;margin-top:16px;font-size:0.82rem;color:var(--text-muted);">¿No tienes cuenta? <a href="#" id="showRegister" style="color:var(--accent);">Crear cuenta</a></p>' +
                '</form></div>' +
                '<div id="accountTabRegister" style="display:none;">' +
                '<h3 style="font-size:1rem;margin-bottom:16px;color:var(--accent);">Crear Cuenta</h3>' +
                '<form id="customerRegisterForm" class="product-form" style="max-width:100%;">' +
                '<div class="form-group"><label>Nombre</label><input type="text" id="custRegName" required placeholder="Tu nombre"></div>' +
                '<div class="form-group"><label>Correo</label><input type="email" id="custRegEmail" required placeholder="correo@ejemplo.com"></div>' +
                '<div class="form-group"><label>Teléfono</label><input type="tel" id="custRegPhone" placeholder="+504 XXXX-XXXX"></div>' +
                '<div class="form-group"><label>Contraseña</label><input type="password" id="custRegPass" required placeholder="Mínimo 6 caracteres"></div>' +
                '<button type="submit" class="btn-primary" style="width:100%;">Crear Cuenta</button>' +
                '<p style="text-align:center;margin-top:16px;font-size:0.82rem;color:var(--text-muted);">¿Ya tienes cuenta? <a href="#" id="showLogin" style="color:var(--accent);">Iniciar sesión</a></p>' +
                '</form></div>' +
                '</div></div>';

            document.getElementById('showRegister').addEventListener('click', function(e) { e.preventDefault(); document.getElementById('accountTabLogin').style.display = 'none'; document.getElementById('accountTabRegister').style.display = 'block'; });
            document.getElementById('showLogin').addEventListener('click', function(e) { e.preventDefault(); document.getElementById('accountTabRegister').style.display = 'none'; document.getElementById('accountTabLogin').style.display = 'block'; });

            document.getElementById('customerLoginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                var email = document.getElementById('custLoginEmail').value;
                var pass = document.getElementById('custLoginPass').value;
                var customers = JSON.parse(localStorage.getItem('leperfumcg_customers') || '[]');
                var found = customers.find(function(c) { return c.email === email && c.password === pass; });
                if (found) {
                    localStorage.setItem('leperfumcg_customer', JSON.stringify(found));
                    toast('Bienvenido, ' + found.name);
                    renderAccount(container);
                } else {
                    toast('Correo o contraseña incorrectos', 'error');
                }
            });

            document.getElementById('customerRegisterForm').addEventListener('submit', function(e) {
                e.preventDefault();
                var name = document.getElementById('custRegName').value.trim();
                var email = document.getElementById('custRegEmail').value.trim();
                var phone = document.getElementById('custRegPhone').value.trim();
                var pass = document.getElementById('custRegPass').value;
                if (pass.length < 6) { toast('La contraseña debe tener al menos 6 caracteres', 'error'); return; }
                var customers = JSON.parse(localStorage.getItem('leperfumcg_customers') || '[]');
                if (customers.find(function(c) { return c.email === email; })) { toast('Ya existe una cuenta con ese correo', 'error'); return; }
                var newCust = { id: Date.now(), name: name, email: email, phone: phone, password: pass, date: new Date().toISOString() };
                customers.push(newCust);
                localStorage.setItem('leperfumcg_customers', JSON.stringify(customers));
                localStorage.setItem('leperfumcg_customer', JSON.stringify(newCust));
                toast('Cuenta creada exitosamente');
                renderAccount(container);
            });
            return;
        }

        var myOrders = allOrders.filter(function(o) { return o.customer && o.customer.email === loggedUser.email; });
        var statusLabels = { pendiente: 'Pendiente', confirmado: 'Confirmado', preparando: 'Preparando', enviado: 'Enviado', entregado: 'Entregado', cancelado: 'Cancelado' };
        var statusColors = { pendiente: 'var(--accent)', confirmado: 'var(--accent)', preparando: 'var(--accent)', enviado: 'var(--green)', entregado: 'var(--green)', cancelado: 'var(--red)' };

        var ordersHTML = myOrders.length === 0
            ? '<p style="color:var(--text-muted);text-align:center;padding:40px 0;">Aún no has realizado pedidos.</p>'
            : myOrders.reverse().map(function(o) {
                var itemsText = o.items.map(function(i) { return i.name + ' x' + i.qty; }).join(', ');
                return '<div class="category-item" style="flex-direction:column;align-items:flex-start;gap:8px;">' +
                    '<div style="display:flex;justify-content:space-between;width:100%;"><div><strong>Pedido #' + o.id.toString().slice(-8) + '</strong><br><small style="color:var(--text-muted);">' + new Date(o.date).toLocaleDateString() + '</small></div>' +
                    '<span style="color:' + (statusColors[o.status] || 'var(--text-muted)') + ';font-size:0.82rem;font-weight:600;">' + (statusLabels[o.status] || o.status) + '</span></div>' +
                    '<div style="font-size:0.82rem;color:var(--text-secondary);">' + itemsText + '</div>' +
                    '<div style="font-size:0.85rem;font-weight:600;color:var(--accent);">Total: ' + formatPrice(o.total) + '</div></div>';
            }).join('');

        container.innerHTML = '<div class="container" style="padding:40px 0;max-width:700px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;">' +
            '<div><h2 style="font-family:var(--font-serif);font-size:2rem;">Hola, ' + escapeHTML(loggedUser.name) + '</h2><p style="color:var(--text-muted);font-size:0.85rem;">' + escapeHTML(loggedUser.email) + '</p></div>' +
            '<button class="btn-secondary" id="customerLogoutBtn">Cerrar Sesión</button></div>' +
            '<h3 style="font-size:1rem;margin-bottom:16px;color:var(--accent);">Mis Pedidos</h3>' +
            ordersHTML + '</div>';

        document.getElementById('customerLogoutBtn').addEventListener('click', function() {
            localStorage.removeItem('leperfumcg_customer');
            toast('Sesión cerrada', 'info');
            renderAccount(container);
        });
    }

    window.addEventListener('hashchange', handleRoute);

    // ---- Init ----
    initCatalog().then(function() {
        loadBusinessInfo();
        renderProducts();
        updateCartCount();
        updateWishlistCount();
        handleRoute();
    });
});
