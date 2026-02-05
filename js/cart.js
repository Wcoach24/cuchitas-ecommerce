/**
 * Cuchitas - Sistema de Carrito de Compras
 * Gestiona el carrito usando localStorage
 */

class Cart {
    constructor() {
        this.storageKey = 'cuchitas_cart';
        this.items = this.load();
        this.listeners = [];
    }

    // Cargar carrito desde localStorage
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading cart:', e);
            return [];
        }
    }

    // Guardar carrito en localStorage
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
            this.notify();
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    }

    // Añadir producto al carrito
    add(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.save();
        this.showNotification(`${product.name} añadido al carrito`);
        return true;
    }

    // Eliminar producto del carrito
    remove(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        if (index > -1) {
            const item = this.items[index];
            this.items.splice(index, 1);
            this.save();
            this.showNotification(`${item.name} eliminado del carrito`);
        }
    }

    // Actualizar cantidad
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.remove(productId);
            } else {
                item.quantity = quantity;
                this.save();
            }
        }
    }

    // Incrementar cantidad
    increment(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity++;
            this.save();
        }
    }

    // Decrementar cantidad
    decrement(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
                this.save();
            } else {
                this.remove(productId);
            }
        }
    }

    // Vaciar carrito
    clear() {
        this.items = [];
        this.save();
    }

    // Obtener total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Calcular envío
    getShipping(shippingConfig = { freeThreshold: 20, standardPrice: 4.90 }) {
        const subtotal = this.getSubtotal();
        if (subtotal >= shippingConfig.freeThreshold) {
            return 0;
        }
        return shippingConfig.standardPrice;
    }

    // Obtener total
    getTotal(shippingConfig) {
        return this.getSubtotal() + this.getShipping(shippingConfig);
    }

    // Cantidad restante para envío gratis
    getRemainingForFreeShipping(threshold = 20) {
        const subtotal = this.getSubtotal();
        if (subtotal >= threshold) return 0;
        return threshold - subtotal;
    }

    // Verificar si el carrito está vacío
    isEmpty() {
        return this.items.length === 0;
    }

    // Suscribirse a cambios
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    // Notificar a los suscriptores
    notify() {
        this.listeners.forEach(callback => callback(this));
    }

    // Mostrar notificación
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <span class="notification-icon">✓</span>
            <span class="notification-message">${message}</span>
        `;

        if (!document.getElementById('cart-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'cart-notification-styles';
            style.textContent = `
                .cart-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #1a2e1a;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    z-index: 10000;
                    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
                    font-size: 14px;
                    font-weight: 500;
                }
                .notification-icon {
                    background: #9ACD32;
                    color: #1a2e1a;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Generar resumen para WhatsApp
    generateWhatsAppMessage(customerInfo = {}) {
        let message = '🌮 *Nuevo Pedido - Cuchitas*\n\n';

        if (customerInfo.name) {
            message += `👤 *Cliente:* ${customerInfo.name}\n`;
        }
        if (customerInfo.phone) {
            message += `📱 *Teléfono:* ${customerInfo.phone}\n`;
        }
        if (customerInfo.address) {
            message += `📍 *Dirección:* ${customerInfo.address}\n`;
        }

        message += '\n📦 *Productos:*\n';
        this.items.forEach(item => {
            message += `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€\n`;
        });

        message += `\n💰 *Subtotal:* ${this.getSubtotal().toFixed(2)}€`;

        const shipping = this.getShipping();
        if (shipping > 0) {
            message += `\n🚚 *Envío:* ${shipping.toFixed(2)}€`;
        } else {
            message += `\n🚚 *Envío:* GRATIS`;
        }

        message += `\n\n💵 *TOTAL:* ${this.getTotal().toFixed(2)}€`;

        return encodeURIComponent(message);
    }

    // Generar enlace de WhatsApp
    getWhatsAppLink(phoneNumber = '34600000000', customerInfo = {}) {
        const message = this.generateWhatsAppMessage(customerInfo);
        return `https://wa.me/${phoneNumber}?text=${message}`;
    }
}

// Crear instancia global del carrito
window.cart = new Cart();

// Actualizar contador del carrito en el header
function updateCartCounter() {
    const counters = document.querySelectorAll('.cart-count, .cart-counter');
    const total = window.cart.getTotalItems();

    counters.forEach(counter => {
        counter.textContent = total;
        counter.style.display = total > 0 ? 'inline-flex' : 'none';
    });
}

// Suscribirse a cambios del carrito
window.cart.subscribe(updateCartCounter);

// Actualizar al cargar la página
document.addEventListener('DOMContentLoaded', updateCartCounter);
