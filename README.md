# 🌮 Cuchitas - Ecommerce de Tortillas Artesanales

Tienda online de productos mexicanos artesanales. Tortillas de maíz nixtamalizado hechas a mano en España.

## 🚀 Demo

**[Ver demo en vivo →](https://wcoach24.github.io/cuchitas-ecommerce/)**

## ✨ Características

- ✅ **Landing page optimizada** para conversión
- ✅ **Carrito de compras** con localStorage (sin backend)
- ✅ **Sistema de productos** con JSON (fácil de editar)
- ✅ **Checkout funcional** con múltiples opciones de pago
- ✅ **Integración WhatsApp** para pedidos directos
- ✅ **Diseño responsive** (móvil, tablet, desktop)
- ✅ **SEO optimizado** con Schema.org
- ✅ **Imágenes WebP** para mejor rendimiento
- ✅ **Sin dependencias** - HTML/CSS/JS puro

## 📁 Estructura del Proyecto

```
cuchitas-ecommerce/
├── index.html          # Landing page principal
├── tienda.html         # Catálogo de productos
├── carrito.html        # Carrito de compras
├── checkout.html       # Proceso de pago
├── css/
│   └── styles.css      # Estilos globales
├── js/
│   ├── cart.js         # Sistema de carrito
│   └── products.js     # Gestión de productos
├── data/
│   └── products.json   # Datos de productos
├── images/
│   └── *.webp          # Imágenes optimizadas
└── README.md
```

## 🛠️ Instalación Local

1. **Clona el repositorio:**
```bash
git clone https://github.com/Wcoach24/cuchitas-ecommerce.git
cd cuchitas-ecommerce
```

2. **Abre con un servidor local:**
```bash
# Con Python
python -m http.server 8000

# O con Node.js
npx serve
```

3. **Abre en el navegador:**
```
http://localhost:8000
```

## ⚙️ Configuración

### Productos
Edita `data/products.json` para añadir/modificar productos.

### WhatsApp
Cambia el número de WhatsApp en `carrito.html` y `checkout.html`:

```javascript
const WHATSAPP_NUMBER = '34XXXXXXXXX'; // Tu número
```

### Envío Gratuito
Modifica el umbral en los archivos JS:

```javascript
const SHIPPING_CONFIG = {
    freeThreshold: 20,    // Mínimo para envío gratis
    standardPrice: 4.90   // Precio del envío
};
```

## 🚀 Despliegue

### GitHub Pages (Recomendado)

1. Sube el código a GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main` y carpeta `/ (root)`
4. ¡Listo! Tu sitio estará en `https://usuario.github.io/cuchitas-ecommerce/`

---

Hecho con ❤️ para [Cuchitas](https://cuchitas.com) - Saben a México 🇲🇽
