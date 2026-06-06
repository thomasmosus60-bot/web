const API_BASE_URL = 'https://honore-cakes-website.onrender.com';
let adminToken = sessionStorage.getItem('honoreAdminToken') || '';

function apiUrl(path) {
    return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
}

function productId(product) {
    return product._id || product.id;
}

function productList(data) {
    if (Array.isArray(data)) return data;
    return data.products || data.data || data.items || [];
}

function authHeaders() {
    return adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
}

async function apiRequest(path, options = {}) {
    const response = await fetch(apiUrl(path), {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
            ...(options.headers || {})
        }
    });

    let data = null;
    try { data = await response.json(); } catch (error) {}
    if (!response.ok) throw new Error(data?.message || 'Request failed');
    return data;
}

function tokenFrom(data) {
    return data?.token || data?.accessToken || data?.adminToken || data?.data?.token || '';
}

function readForm(form) {
    const formData = new FormData(form);
    return {
        name: formData.get('name').trim(),
        description: formData.get('description').trim(),
        category: formData.get('category').trim(),
        price: Number(formData.get('price')),
        image: formData.get('image'),
        flavours: formData.get('flavours').split(',').map((item) => item.trim()).filter(Boolean),
        size: formData.get('size').trim(),
        featured: formData.get('featured') === 'on'
    };
}

function fillForm(product) {
    const form = document.getElementById('product-form');
    form.id.value = productId(product);
    form.name.value = product.name || '';
    form.description.value = product.description || '';
    form.category.value = product.category || '';
    form.price.value = product.price || '';
    form.image.value = product.image || '';
    form.flavours.value = Array.isArray(product.flavours) ? product.flavours.join(', ') : (product.flavours || product.flavors || '');
    form.size.value = product.size || '';
    form.featured.checked = Boolean(product.featured);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-form').id.value = '';
}

function renderProducts(products) {
    const container = document.getElementById('admin-products');
    container.innerHTML = products.map((product) => `
        <article class="admin-product" data-id="${productId(product)}">
            <img src="${product.image || 'images/cake6.jpg'}" alt="${product.name || 'Cake'}">
            <div>
                <h3>${product.name || 'Custom Cake'}</h3>
                <p>${product.category || 'Cake'} · ₹${product.price || 0}</p>
            </div>
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="delete">Delete</button>
        </article>
    `).join('');

    container.querySelectorAll('[data-action="edit"]').forEach((button) => {
        button.addEventListener('click', () => {
            const id = button.closest('.admin-product').dataset.id;
            fillForm(products.find((product) => productId(product) === id));
        });
    });

    container.querySelectorAll('[data-action="delete"]').forEach((button) => {
        button.addEventListener('click', async () => {
            const id = button.closest('.admin-product').dataset.id;
            if (!confirm('Delete this product?')) return;
            await apiRequest(`/api/products/${id}`, { method: 'DELETE' });
            await loadProducts();
        });
    });
}

async function loadProducts() {
    const data = await apiRequest('/api/products');
    renderProducts(productList(data));
}

async function login(form) {
    const message = document.getElementById('login-message');
    const formData = new FormData(form);
    try {
        const data = await apiRequest('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });
        adminToken = tokenFrom(data);
        if (adminToken) sessionStorage.setItem('honoreAdminToken', adminToken);
        form.hidden = true;
        document.getElementById('product-admin').hidden = false;
        await loadProducts();
    } catch (error) {
        message.textContent = error.message;
    }
}

async function saveProduct(form) {
    const message = document.getElementById('product-message');
    const id = form.id.value;
    const product = readForm(form);
    try {
        await apiRequest(id ? `/api/products/${id}` : '/api/products', {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(product)
        });
        message.textContent = id ? 'Product updated.' : 'Product added.';
        clearForm();
        await loadProducts();
    } catch (error) {
        message.textContent = error.message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login');
    const productAdmin = document.getElementById('product-admin');

    if (adminToken) {
        loginForm.hidden = true;
        productAdmin.hidden = false;
        loadProducts().catch(() => {
            sessionStorage.removeItem('honoreAdminToken');
            adminToken = '';
            loginForm.hidden = false;
            productAdmin.hidden = true;
        });
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        login(loginForm);
    });

    document.getElementById('product-form').addEventListener('submit', (event) => {
        event.preventDefault();
        saveProduct(event.currentTarget);
    });

    document.getElementById('clear-product-form').addEventListener('click', clearForm);
});
