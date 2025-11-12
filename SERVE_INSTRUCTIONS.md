# How to Serve StopTheCharge PWA

## Quick Start

### Option 1: Python HTTP Server (Recommended for Testing)

**From the project root:**
```bash
cd /workspaces/stopthecharge
python3 -m http.server 8000
```

Then open in browser:
```
http://localhost:8000/public/index.html
```

### Option 2: Node.js HTTP Server

```bash
# Install if needed
npm install -g http-server

# Run from project root
cd /workspaces/stopthecharge
http-server public -p 8000
```

Then open:
```
http://localhost:8000/index.html
```

### Option 3: Using Node.js with Express (For Production)

```bash
# Install express
npm install express

# Create server.js in project root
```

```javascript
// server.js
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));

// Root redirects to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 redirect to index.html (for SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`StopTheCharge running at http://localhost:${PORT}`);
});
```

Then run:
```bash
node server.js
```

---

## Directory Structure for Serving

```
/workspaces/stopthecharge/
├── public/
│   ├── index.html           ← Homepage
│   ├── directory.html       ← Service directory
│   ├── service-detail.html  ← Service guide
│   ├── dashboard.html       ← User dashboard
│   ├── admin.html           ← Admin dashboard
│   ├── service-worker.js    ← Service Worker
│   └── manifest.json        ← PWA manifest
├── css/
│   └── style.css            ← All styles
├── js/
│   └── app.js               ← Main app logic
├── backend/
│   ├── config.js            ← Configuration
│   ├── webhook-handlers.js  ← Webhook logic
│   └── email-templates.js   ← Email templates
└── images/
    └── (icons, logos, etc)
```

---

## URL Routing

### All URLs should use `/public` as base:

```
http://localhost:8000/public/index.html         → Home
http://localhost:8000/public/directory.html     → Directory
http://localhost:8000/public/service-detail.html → Service Detail
http://localhost:8000/public/dashboard.html     → Dashboard
http://localhost:8000/public/admin.html         → Admin Dashboard
```

### OR if serving with root redirect:

```
http://localhost:8000/                          → Home (index.html)
http://localhost:8000/directory.html            → Directory
http://localhost:8000/service-detail.html       → Service Detail
http://localhost:8000/dashboard.html            → Dashboard
http://localhost:8000/admin.html                → Admin Dashboard
```

---

## Testing URLs

### Using Python Server (Option 1):
```
http://localhost:8000/public/
```

### Using Express Server (Option 3):
```
http://localhost:8000/
```

---

## Browser DevTools Testing

### Check Service Worker:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** (left sidebar)
4. Should see: "service-worker.js - running"

### Check Console Logs:
1. Open DevTools (F12)
2. Go to **Console** tab
3. Refresh page
4. Should see startup logs with `[StopTheCharge]` prefix

### Check Storage:
1. Open DevTools (F12)
2. Go to **Application** tab
3. **LocalStorage** → See stored subscriptions
4. **Cache Storage** → See cached assets

### Check Network:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. All requests should be 200 OK
5. No 404 errors

---

## Troubleshooting

### Issue: 404 errors on CSS/JS
**Solution:** Ensure you're serving from correct directory with proper path structure

### Issue: Service Worker not registering
**Solution:** Service Worker path must be `service-worker.js` (relative), not `/service-worker.js`

### Issue: Search not working
**Solution:** Check browser console for errors, verify `searchInput` and `searchBtn` IDs exist

### Issue: Navigation links broken
**Solution:** All links must use relative paths (`href="index.html"`, not `href="/index.html"`)

### Issue: Styles not loading
**Solution:** Check that CSS path is `../css/style.css` (from /public directory)

---

## Production Deployment

### Using Docker:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install express

EXPOSE 8000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t stopthecharge .
docker run -p 8000:8000 stopthecharge
```

### Using Netlify:
1. Connect GitHub repo
2. Build command: (leave empty - static files)
3. Publish directory: `public`
4. Deploy!

### Using Vercel:
1. Connect GitHub repo
2. Framework: Static site
3. Root directory: `.`
4. Deploy!

### Using GitHub Pages:
1. Push to `gh-pages` branch
2. Enable in Settings > Pages
3. Set source to `gh-pages` branch

---

## Performance Optimization

### Current Performance:
- ✅ PWA manifest configured
- ✅ Service Worker caching
- ✅ Offline support
- ✅ Responsive CSS
- ✅ Minimal dependencies (vanilla JS)

### Future Optimizations:
- [ ] Image optimization (WebP formats)
- [ ] CSS minification
- [ ] JS minification
- [ ] Gzip compression
- [ ] CDN delivery
- [ ] Database caching
- [ ] API response caching

---

## Security Considerations

### Current Security:
- ✅ No external dependencies
- ✅ No sensitive data in localStorage
- ✅ HTTPS recommended for production
- ✅ Service Worker cache validation

### Production Security:
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Add authentication
- [ ] Validate all inputs
- [ ] Use HTTPS only
- [ ] Set security headers
- [ ] Implement CORS properly

---

## Monitoring & Logging

### Console Logs Available:
Every major action is logged with format:
```javascript
[StopTheCharge] Action description...
```

### Monitor These Metrics:
- User interactions (clicks, submissions)
- Search queries and results
- Navigation flow
- Error rates
- Service Worker status
- Webhook delivery (when connected)

---

## Need Help?

1. **Check Console Logs** - Press F12, go to Console tab
2. **Check Network Tab** - Look for 404 errors
3. **Check Application Tab** - Verify Service Worker, Cache, Storage
4. **Read FIXES_COMPLETED.md** - Detailed fix documentation
5. **Read PHASE3A_QUICKSTART.md** - N8N integration guide

---

*Ready to serve! 🚀*
