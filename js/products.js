const API_BASE_URL = 'https://honore-cakes-website.onrender.com';
const FALLBACK_IMAGE = 'images/cake6.jpg';

function apiUrl(path) {
    return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
}

function money(value) {
    if (value === undefined || value === null || value === '') return 'Price on request';
    const number = Number(value);
    return Number.isFinite(number) ? `₹${number.toLocaleString('en-IN')}` : value;
}

function productId(product) {
    return product._id || product.id;
}

function productImage(product) {
    return product.image || product.imageUrl || product.photo || FALLBACK_IMAGE;
}

function productList(data) {
    if (Array.isArray(data)) return data;
    return data.products || data.data || data.items || [];
}

function asTextList(value) {
    if (Array.isArray(value)) return value.join(', ');
    return value || 'Customisable';
}

async function request(path, options = {}) {
    const response = await fetch(apiUrl(path), options);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    const status = document.getElementById('products-status');
    grid.innerHTML = '';

    if (!products.length) {
        status.textContent = 'No products available yet.';
        return;
    }

    status.hidden = true;
    products.forEach((product) => {
        const card = document.createElement('button');
        card.className = 'product-card';
        card.type = 'button';
        card.dataset.id = productId(product);
        card.innerHTML = `
            <img src="${productImage(product)}" alt="${product.name || 'Cake'}" loading="lazy">
            <span class="product-category">${product.category || 'Cake'}</span>
            <h3>${product.name || 'Custom Cake'}</h3>
            <p>${money(product.price)}</p>
        `;
        card.addEventListener('click', () => showProductDetails(product));
        grid.appendChild(card);
    });
}

async function showProductDetails(product) {
    const id = productId(product);
    let details = product;

    if (id) {
        try {
            details = await request(`/api/products/${id}`);
            details = details.product || details.data || details;
        } catch (error) {
            console.warn(error);
        }
    }

    document.getElementById('product-details').innerHTML = `
        <img src="${productImage(details)}" alt="${details.name || 'Cake'}">
        <div>
            <span class="product-category">${details.category || 'Cake'}</span>
            <h2>${details.name || 'Custom Cake'}</h2>
            <p class="detail-price">${money(details.price)}</p>
            <p>${details.description || 'A beautiful custom cake made for your celebration.'}</p>
            <dl>
                <dt>Flavours</dt><dd>${asTextList(details.flavours || details.flavors)}</dd>
                <dt>Size</dt><dd>${asTextList(details.size)}</dd>
                <dt>Category</dt><dd>${details.category || 'Cake'}</dd>
            </dl>
        </div>
    `;
    document.getElementById('product-modal').hidden = false;
}

async function loadProducts() {
    const status = document.getElementById('products-status');
    try {
        const data = await request('/api/products');
        renderProducts(productList(data));
    } catch (error) {
        console.warn(error);
        status.textContent = 'Products could not be loaded right now. Please try again later.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    document.getElementById('product-modal-close').addEventListener('click', () => {
        document.getElementById('product-modal').hidden = true;
    });
    document.getElementById('product-modal').addEventListener('click', (event) => {
        if (event.target.id === 'product-modal') event.currentTarget.hidden = true;
    });
});
