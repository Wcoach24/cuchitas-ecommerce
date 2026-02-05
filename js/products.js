/**
 * Cuchitas - Sistema de Productos
 * Gestiona la carga y renderizado de productos
 */

class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.badges = {};
        this.shipping = {};
        this.loaded = false;
    }

    // Cargar productos desde JSON
    async load() {
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();

            this.products = data.products;
            this.categories = data.categories;
            this.badges = data.badges;
            this.shipping = data.shipping;
            this.loaded = true;

            return true;
        } catch (error) {
            console.error('Error loading products:', error);
            return false;
        }
    }

    // Obtener todos los productos
    getAll() {
        return this.products;
    }

    // Obtener productos por categoría
    getByCategory(categoryId) {
        if (categoryId === 'all') return this.products;
        return this.products.filter(p => p.category === categoryId);
    }

    // Obtener productos destacados
    getFeatured() {
        return this.products.filter(p => p.featured);
    }

    // Obtener producto por ID
    getById(id) {
        return this.products.find(p => p.id === id);
    }

    // Obtener producto por slug
    getBySlug(slug) {
        return this.products.find(p => p.slug === slug);
    }

    // Buscar productos
    search(query) {
        const q = query.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
    }

    // Renderizar badge
    renderBadge(badgeId) {
        const badge = this.badges[badgeId];
        if (!badge) return '';

        return `<span class="producto-badge" style="background:${badge.color};color:${badge.textColor}">
            ${badge.icon} ${badge.label}
        </span>`;
    }

    // Renderizar tarjeta de producto
    renderCard(product, options = {}) {
        const { showDescription = true, showBadges = true } = options;

        const hasDiscount = product.discount > 0;
        const isFeatured = product.featured;

        return `
            <article class="producto-card ${isFeatured ? 'destacado' : ''}" data-product-id="${product.id}">
                ${isFeatured ? '<span class="badge-featured">🔥 Más vendido</span>' : ''}
                <a href="producto.html?id=${product.id}" class="producto-link">
                    <img src="${product.image}"
                         alt="${product.name}"
                         class="producto-imagen"
                         loading="lazy"
                         width="400"
                         height="220">
                </a>
                ${showBadges && product.badges ? `
                    <div class="producto-badges">
                        ${product.badges.map(b => this.renderBadge(b)).join('')}
                    </div>
                ` : ''}
                <div class="producto-info">
                    <h3><a href="producto.html?id=${product.id}">${product.name}</a></h3>
                    ${showDescription ? `<p class="producto-desc">${product.description}</p>` : ''}
                    <div class="producto-precio">
                        <span class="precio-actual">${product.price.toFixed(2)}€</span>
                        ${hasDiscount ? `
                            <span class="precio-antes">${product.originalPrice.toFixed(2)}€</span>
                            <span class="ahorro">-${product.discount}%</span>
                        ` : ''}
                    </div>
                    <button class="producto-cta btn-add-cart" data-product-id="${product.id}">
                        🛒 Añadir al Carrito
                    </button>
                </div>
            </article>
        `;
    }

    // Renderizar grid de productos
    renderGrid(products, containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <p>No hay productos disponibles en esta categoría.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(p => this.renderCard(p, options)).join('');

        // Añadir event listeners a los botones
        container.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = btn.dataset.productId;
                const product = this.getById(productId);
                if (product) {
                    window.cart.add(product);
                }
            });
        });
    }

    // Renderizar filtros de categoría
    renderCategoryFilters(containerId, activeCategory = 'all') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.categories.map(cat => `
            <button class="category-filter ${cat.id === activeCategory ? 'active' : ''}"
                    data-category="${cat.id}">
                <span class="category-icon">${cat.icon}</span>
                <span class="category-name">${cat.name}</span>
            </button>
        `).join('');
    }
}

// Crear instancia global
window.productManager = new ProductManager();
