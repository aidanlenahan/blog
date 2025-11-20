// List of articles - each article should have metadata
const articles = [
    // Articles will be automatically loaded from the articles directory
    // Format: { title, date, author, excerpt, file }
];

// Fetch articles from the articles directory
async function loadArticles() {
    try {
        // Fetch the articles index file
        const response = await fetch('articles/index.json');
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }
        const articlesData = await response.json();
        return articlesData.articles || [];
    } catch (error) {
        console.error('Error loading articles:', error);
        return [];
    }
}

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Create article card HTML
function createArticleCard(article) {
    const card = document.createElement('a');
    card.href = `articles/${article.file}`;
    card.className = 'article-card';
    
    card.innerHTML = `
        <h3>${article.title}</h3>
        <div class="article-meta">
            <span>📅 ${formatDate(article.date)}</span>
            ${article.author ? `<span>✍️ ${article.author}</span>` : ''}
        </div>
        <p class="article-excerpt">${article.excerpt}</p>
    `;
    
    return card;
}

// Display articles on the page
function displayArticles(articles) {
    const articleList = document.getElementById('article-list');
    
    if (articles.length === 0) {
        articleList.innerHTML = '<p class="no-articles">No articles yet. Check back soon!</p>';
        return;
    }
    
    // Sort articles by date (newest first)
    const sortedArticles = articles.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    // Clear loading message
    articleList.innerHTML = '';
    
    // Create and append article cards
    sortedArticles.forEach(article => {
        const card = createArticleCard(article);
        articleList.appendChild(card);
    });
}

// Initialize the blog
async function init() {
    const articles = await loadArticles();
    displayArticles(articles);
}

// Load articles when page loads
document.addEventListener('DOMContentLoaded', init);
