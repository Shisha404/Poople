document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initializeLocalStorage();
    renderProducts();
    renderProductsPreview();
    renderNews();
    renderNewsPreview();
    renderReviews();
    populateProductSelect();
});

function initTheme() {
    const stored = localStorage.getItem('poople_theme');
    if (stored) {
        document.documentElement.setAttribute('data-theme', stored);
    }
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = currentTheme() === 'dark' ? '☀️' : '🌙';
        toggleBtn.addEventListener('click', () => {
            const next = currentTheme() === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('poople_theme', next);
            toggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
        });
    }
}

function currentTheme() {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr) return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function nextId(items) {
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

function initializeLocalStorage() {
    if (!localStorage.getItem('poople_news')) {
        localStorage.setItem('poople_news', JSON.stringify([
            { id: 1, title: 'Новость 1', content: 'Контент новости 1', date: '2023-10-01' },
            { id: 2, title: 'Новость 2', content: 'Контент новости 2', date: '2023-10-02' }
        ]));
    }

    if (!localStorage.getItem('poople_products')) {
        localStorage.setItem('poople_products', JSON.stringify([
            { id: 1, name: 'Продукт 1', description: 'Описание продукта 1', price: 100, image: 'https://via.placeholder.com/300' },
            { id: 2, name: 'Продукт 2', description: 'Описание продукта 2', price: 200, image: 'https://via.placeholder.com/300' },
            { id: 3, name: 'Продукт 3', description: 'Описание продукта 3', price: 300, image: 'https://via.placeholder.com/300' }
        ]));
    }

    if (!localStorage.getItem('poople_reviews')) {
        localStorage.setItem('poople_reviews', JSON.stringify([
            { id: 1, productId: 1, content: 'Отзыв 1', author: 'Автор 1', rating: '★★★★★', date: '2023-10-01' },
            { id: 2, productId: 2, content: 'Отзыв 2', author: 'Автор 2', rating: '★★★★☆', date: '2023-10-02' }
        ]));
    }

    document.getElementById('product-form')?.addEventListener('submit', addProduct);
    document.getElementById('news-form')?.addEventListener('submit', addNews);
    document.getElementById('review-form')?.addEventListener('submit', addReview);
}

function renderProducts() {
    const productsSection = document.getElementById('products-section');
    if (!productsSection) return;

    const products = JSON.parse(localStorage.getItem('poople_products'));
    productsSection.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card';
        productCard.innerHTML = `
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description)}</p>
            <p>Цена: ${escapeHtml(String(product.price))} руб.</p>
            <button class="button" type="button">Купить</button>
            <div id="reviews-${product.id}" class="product-reviews">
                <!-- Reviews for this product will be rendered here -->
            </div>
        `;
        productsSection.appendChild(productCard);
        renderProductReviews(product.id);
    });
}

function renderProductsPreview() {
    const previewSection = document.getElementById('products-preview');
    if (!previewSection) return;

    const products = JSON.parse(localStorage.getItem('poople_products')).slice(0, 3);
    previewSection.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card';
        productCard.innerHTML = `
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description)}</p>
            <p>Цена: ${escapeHtml(String(product.price))} руб.</p>
        `;
        previewSection.appendChild(productCard);
    });
}

function renderNews() {
    const newsSection = document.getElementById('news-section');
    if (!newsSection) return;

    const news = JSON.parse(localStorage.getItem('poople_news'));
    newsSection.innerHTML = '';

    news.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'card';
        articleCard.innerHTML = `
            <h3>${escapeHtml(article.title)}</h3>
            <p>${escapeHtml(article.content)}</p>
            <p><small>Дата: ${escapeHtml(article.date)}</small></p>
        `;
        newsSection.appendChild(articleCard);
    });
}

function renderNewsPreview() {
    const previewSection = document.getElementById('news-preview');
    if (!previewSection) return;

    const news = JSON.parse(localStorage.getItem('poople_news')).slice(0, 2);
    previewSection.innerHTML = '';

    news.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'card';
        articleCard.innerHTML = `
            <h3>${escapeHtml(article.title)}</h3>
            <p>${escapeHtml(article.content)}</p>
            <p><small>Дата: ${escapeHtml(article.date)}</small></p>
        `;
        previewSection.appendChild(articleCard);
    });
}

function renderProductReviews(productId) {
    const reviewsSection = document.getElementById(`reviews-${productId}`);
    if (!reviewsSection) return;

    const reviews = JSON.parse(localStorage.getItem('poople_reviews'));
    const productReviews = reviews.filter(review => review.productId === productId);

    reviewsSection.innerHTML = '';

    if (productReviews.length === 0) {
        reviewsSection.innerHTML = '<p><small>Пока нет отзывов на этот товар.</small></p>';
        return;
    }

    productReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'card review-card';
        reviewCard.innerHTML = `
            <h4>${escapeHtml(review.author)}</h4>
            <p>${escapeHtml(review.content)}</p>
            <div class="rating">${escapeHtml(review.rating)}</div>
            <p><small>Дата: ${escapeHtml(review.date)}</small></p>
        `;
        reviewsSection.appendChild(reviewCard);
    });
}

function renderReviews() {
    // Full reviews page (pages/reviews.html): shows every review with its product name
    const reviewsSection = document.getElementById('reviews-section');
    if (!reviewsSection) return;

    const reviews = JSON.parse(localStorage.getItem('poople_reviews'));
    const products = JSON.parse(localStorage.getItem('poople_products'));
    reviewsSection.innerHTML = '';

    reviews.forEach(review => {
        const product = products.find(p => p.id === review.productId);
        const reviewCard = document.createElement('div');
        reviewCard.className = 'card';
        reviewCard.innerHTML = `
            <h3>${escapeHtml(review.author)}</h3>
            ${product ? `<p><small>Товар: ${escapeHtml(product.name)}</small></p>` : ''}
            <p>${escapeHtml(review.content)}</p>
            <div class="rating">${escapeHtml(review.rating)}</div>
            <p><small>Дата: ${escapeHtml(review.date)}</small></p>
        `;
        reviewsSection.appendChild(reviewCard);
    });
}

function populateProductSelect() {
    // Fills the product dropdown on the admin review form
    const select = document.querySelector('#review-form select[name="productId"]');
    if (!select) return;

    const products = JSON.parse(localStorage.getItem('poople_products'));
    select.innerHTML = products.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');
}

function addProduct(event) {
    event.preventDefault();
    const form = event.target;
    const products = JSON.parse(localStorage.getItem('poople_products'));
    const newProduct = {
        id: nextId(products),
        name: form.name.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        image: form.image.value
    };
    products.push(newProduct);
    localStorage.setItem('poople_products', JSON.stringify(products));
    renderProducts();
    populateProductSelect();
    form.reset();
    alert('Продукт добавлен.');
}

function addNews(event) {
    event.preventDefault();
    const form = event.target;
    const news = JSON.parse(localStorage.getItem('poople_news'));
    const newArticle = {
        id: nextId(news),
        title: form.title.value,
        content: form.content.value,
        date: form.date.value
    };
    news.push(newArticle);
    localStorage.setItem('poople_news', JSON.stringify(news));
    renderNews();
    form.reset();
    alert('Новость добавлена.');
}

function addReview(event) {
    event.preventDefault();
    const form = event.target;
    const reviews = JSON.parse(localStorage.getItem('poople_reviews'));
    const newReview = {
        id: nextId(reviews),
        productId: parseInt(form.productId.value, 10),
        content: form.content.value,
        author: form.author.value,
        rating: form.rating.value,
        date: form.date.value
    };
    reviews.push(newReview);
    localStorage.setItem('poople_reviews', JSON.stringify(reviews));
    renderReviews();
    renderProductReviews(newReview.productId);
    form.reset();
    alert('Отзыв добавлен.');
}
