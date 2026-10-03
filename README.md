# NPO Sakura Official Website

Official website for NPO Sakura, a non-profit organization dedicated to promoting healthy living and community development through various activities.

## Site Structure

- **Homepage**: Overview of the organization, mission, and activities
- **About Us**: Mission, vision, and organizational information
- **Activities**: Detailed information about our programs and services
- **Support**: Information about our support activities for Yuri Tachibana
- **Membership**: Information about joining our organization
- **Contact**: Contact information

## Technical Specifications

- HTML5
- CSS3 (Responsive design)
- Modern UI/UX design
- Hosted on GitHub Pages

## Local Development

1. Clone the repository
```bash
git clone https://github.com/your-username/npo-sakura.git
cd npo-sakura
```

2. Open `index.html` in your browser

## Tests

End-to-end tests use [Playwright](https://playwright.dev/) and live in `tests/`. They serve the site locally, block all external requests, and replace the Supabase client with a stub, so nothing is sent to the production database.

```bash
npm ci
npx playwright install chromium
npm test
```

The same tests run on GitHub Actions (`.github/workflows/test.yml`) for every pull request and every push to `main`.

## GitHub Pages Deployment

1. Go to repository settings
2. Select "Pages" section
3. Set Source to "Deploy from a branch"
4. Set Branch to "main"
5. Click "Save"

After deployment, the site will be available at `https://your-username.github.io/npo-sakura`

## Customization

### Content Changes

- `index.html`: Edit main content
- `styles.css`: Adjust design

### Color Scheme

You can adjust the site's color scheme by modifying these variables in the CSS file:

- Main colors: `#ffb7c5` and `#ff9a9e` (cherry blossom gradient)
- Accent color: `#e91e63`
- Text color: `#333`

## License

© 2024 NPO Sakura. All rights reserved. 
