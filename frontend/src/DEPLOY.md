# Deployment Guide

## Stack
- Backend  → Render   (free tier, Django)
- Frontend → Vercel   (free tier, React)

---

## Step 1 — Prepare GitHub repo

Structure should be:
```
/backend     ← Django
/frontend    ← React/Vite
```

Add to `.gitignore`:
```
backend/venv/
frontend/node_modules/
frontend/dist/
*.pyc
.env
__pycache__/
```

---

## Step 2 — Deploy Django on Render

1. Go to render.com → New → Web Service
2. Connect your GitHub repo
3. Set:
   - Root directory:  `backend`
   - Build command:   `pip install -r requirements.txt`
   - Start command:   `gunicorn config.wsgi:application`

4. Add environment variables on Render:
   - `DJANGO_SECRET_KEY`  → generate at https://djecrety.ir
   - `DEBUG`              → `False`
   - `ALLOWED_HOSTS`      → `your-app.onrender.com`

5. Add gunicorn to backend/requirements.txt:
   ```
   gunicorn
   ```

6. Update backend/config/settings.py:
   ```python
   import os
   SECRET_KEY    = os.environ.get('DJANGO_SECRET_KEY')
   DEBUG         = os.environ.get('DEBUG', 'False') == 'True'
   ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
   ```

7. Click Deploy → copy the URL (e.g. https://your-app.onrender.com)

---

## Step 3 — Deploy React on Vercel

1. Go to vercel.com → New Project → Import your GitHub repo
2. Set:
   - Root directory:   `frontend`
   - Framework:        Vite  (auto-detected)
3. Add environment variable:
   - `VITE_API_URL` → `https://your-app.onrender.com`  (your Render URL)
4. Click Deploy

---

## Step 4 — Update Django CORS

In backend/config/settings.py add your Vercel URL:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://your-app.vercel.app',   # ← add this
]
```

Push to GitHub → Render auto-redeploys.

---

## Done

| Service  | URL                                  |
|----------|--------------------------------------|
| Frontend | https://your-app.vercel.app          |
| API      | https://your-app.onrender.com/api/predict/ |

Every git push auto-deploys both.
