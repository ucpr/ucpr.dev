# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Personal blog/portfolio website (ucpr.dev) built with Next.js 15 and deployed to Cloudflare Workers. Uses static site generation with markdown-based content.

## Key Commands

### Development
```bash
# Install dependencies
bun install

# Run development server (with Turbopack)
bun dev

# Build for production (generates static files and RSS)
bun build

# Deploy to Cloudflare Workers
bun deploy

# Format code
bun format

# Check formatting
bun format:check
```

### Testing
No test framework is currently configured. When adding tests, set up the testing infrastructure first.

## Architecture Overview

### Content System
- Articles stored as markdown files in `/content/articles/`
- Front matter supports: title, description, tags, publishedAt, status (draft/published)
- External articles configuration in `/content/external-articles.json`
- RSS/Atom feeds generated during build via `/scripts/generateRSS.js`

### Core APIs (`/src/lib/`)
- `api.ts`: Main content fetching functions
  - `getAllArticles()`: Returns all published articles
  - `getArticleBySlug()`: Fetches single article with content
  - `getAllTags()`: Extracts all unique tags
- `rss.ts`: RSS/Atom feed generation
- `markdownToHtml.ts`: Markdown processing with Shiki syntax highlighting

### Routing Structure
- `/` - Home page with article list
- `/articles/[slug]` - Individual article pages
- `/tags/[tag]` - Articles filtered by tag
- `/profile` - Profile page
- `/feed.xml`, `/atom.xml`, `/feed.json` - Feed endpoints

### Workers Services
- `ogpinfo`: Fetches OGP metadata for external links
- `ucprdev-image-proxy`: Proxies external images with caching

## Development Guidelines

### Article Creation
1. Create markdown file in `/content/articles/` with format: `YYYY-MM-DD-slug.md`
2. Include required front matter:
   ```yaml
   ---
   title: "Article Title"
   description: "Brief description"
   tags: ["tag1", "tag2"]
   publishedAt: "2024-01-01T00:00:00.000Z"
   status: "published"
   ---
   ```
3. Run `bun build` to generate RSS feeds

### Code Style
- TypeScript with strict mode
- Biome for formatting: tabs, double quotes
- Components use `.tsx` extension
- Utilities use `.ts` extension

### Deployment Notes
- Static export mode (`output: "export"`)
- Output directory: `/out/`
- Cloudflare Workers configuration in `/workers/`
- Build errors in TypeScript are ignored for deployment (`ignoreBuildErrors: true`)

### Important Patterns
- All date handling uses `date-fns` or `dayjs`
- Images served unoptimized due to static export
- Dark mode handled via CSS (no JS toggle)
- External articles fetched from JSON, not markdown files