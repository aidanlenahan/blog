# IT Blog - Software News & Configuration Guides

A simple, elegant blog for posting IT news and software configuration guides. Articles automatically populate on the homepage as they are added to the `articles/` directory.

## Features

- 🎨 Clean, modern design with responsive layout
- 📱 Mobile-friendly interface
- 🔄 Auto-populating article list on homepage
- 📝 Easy article management through JSON index file
- 🚀 Fast and lightweight - pure HTML, CSS, and JavaScript

## Getting Started

### Viewing the Blog

1. Open `index.html` in your web browser
2. Or serve it with any static web server:
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

### Adding New Articles

To add a new article to your blog:

1. **Create your article HTML file** in the `articles/` directory (e.g., `articles/my-new-article.html`)
   - You can copy one of the existing articles as a template
   - Make sure to link to `../style.css` for consistent styling
   - Include a "Back to Home" link

2. **Update the articles index** by editing `articles/index.json`
   - Add a new entry to the `articles` array:
   ```json
   {
       "title": "Your Article Title",
       "date": "2024-01-20",
       "author": "Your Name",
       "excerpt": "A brief description of your article (1-2 sentences)",
       "file": "my-new-article.html"
   }
   ```

3. **Refresh the homepage** - Your new article will automatically appear!

### Article Index Format

The `articles/index.json` file contains an array of article objects with the following fields:

- `title` (required): The article title displayed on the homepage
- `date` (required): Publication date in YYYY-MM-DD format
- `author` (optional): Author name
- `excerpt` (required): Brief description shown on homepage
- `file` (required): Filename of the article HTML file

Articles are automatically sorted by date (newest first) on the homepage.

## Structure

```
blog/
├── index.html              # Homepage with article list
├── style.css              # Styling for the blog
├── script.js              # JavaScript for auto-populating articles
├── articles/              # Directory containing all articles
│   ├── index.json        # Article index/metadata
│   ├── docker-guide.html
│   ├── nginx-reverse-proxy.html
│   └── kubernetes-basics.html
└── README.md
```

## Customization

### Changing Colors
Edit `style.css` and modify the gradient colors in the header section:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modifying Layout
The blog uses a responsive grid layout. Adjust the `.container` max-width in `style.css` to change the content width.

### Adding Features
The blog is intentionally simple. You can extend it by:
- Adding search functionality
- Implementing tags/categories
- Adding comments system
- Including social share buttons

## Deployment

This blog can be deployed to any static hosting service:

- **GitHub Pages**: Push to a repository and enable GitHub Pages
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect your repository to Vercel
- **Any web server**: Upload files via FTP/SFTP

## License

Feel free to use and modify this blog for your own purposes!