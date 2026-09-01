document.addEventListener('DOMContentLoaded', () => {
    initializeLocalStorage();
    renderProducts();
    renderNews();
});

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
            { id: 1, content: 'Отзыв 1', author: 'Автор 1', rating: '★★★★★', date: '2023-10-01' },
            { id: 2, content: 'Отзыв 2', author: 'Автор 2', rating: '★★★★☆', date: '2023-10-02' }
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
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Цена: ${product.price} руб.</p>
            <button class="button" href="">Купить</button>
            <div id="reviews-${product.id}">
                <!-- Reviews will be dynamically rendered here -->
            </div>
        `;
        productsSection.appendChild(productCard);

        renderProductReviews(product.id);
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
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <p><small>Дата: ${article.date}</small></p>
        `;
        newsSection.appendChild(articleCard);
    });
}

function renderProductReviews(productId) {
    const reviewsSection = document.getElementById(`reviews-${productId}`);
    if (!reviewsSection) return;

    const reviews = JSON.parse(localStorage.getItem('poople_reviews'));
    const productReviews = reviews.filter(review => review.productId === productId);

    reviewsSection.innerHTML = '';

    productReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'card';
        reviewCard.innerHTML = `
            <h3>${review.author}</h3>
            <p>${review.content}</p>
            <div class="rating">${review.rating}</div>
            <p><small>Дата: ${review.date}</small></p>
        `;
        reviewsSection.appendChild(reviewCard);
    });
}

function addProduct(event) {
    event.preventDefault();
    const form = event.target;
    const products = JSON.parse(localStorage.getItem('poople_products'));
    const newProduct = {
        id: products.length + 1,
        name: form.name.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        image: form.image.value
    };
    products.push(newProduct);
    localStorage.setItem('poople_products', JSON.stringify(products));
    renderProducts();
    form.reset();
}

function addNews(event) {
    event.preventDefault();
    const form = event.target;
    const news = JSON.parse(localStorage.getItem('poople_news'));
    const newArticle = {
        id: news.length + 1,
        title: form.title.value,
        content: form.content.value,
        date: form.date.value
    };
    news.push(newArticle);
    localStorage.setItem('poople_news', JSON.stringify(news));
    renderNews();
    form.reset();
}

function addReview(event) {
    event.preventDefault();
    const form = event.target;
    const reviews = JSON.parse(localStorage.getItem('poople_reviews'));
    const newReview = {
        id: reviews.length + 1,
        content: form.content.value,
        author: form.author.value,
        rating: form.rating.value,
        date: form.date.value
    };
    reviews.push(newReview);
    localStorage.setItem('poople_reviews', JSON.stringify(reviews));
    renderProductReviews(); // This will need to be improved to only re-render the specific product's reviews
    form.reset();
}
