# Customer App - PRD

## Original Problem Statement
Pull and build https://github.com/Abhi-mygenie/customer-app5th-march.git

## Architecture
- **Frontend**: React 19 with Tailwind CSS
- **Backend**: FastAPI with MongoDB
- **External API**: MyGenie POS API (manage.mygenie.online)

## What's Been Implemented (March 6, 2026)

### Initial Setup
- Cloned GitHub repository
- Installed dependencies (yarn/pip)
- Imported database from CRMV1 (14 collections)
- Seeded demo data (295 orders, 1026 order items)

### Code Changes Made
1. **`online_order` field** - Controls ADD button visibility (Yes/No)
2. **`multiple_menus` field** - Renamed from `menu_type`, uses Yes/No values
3. **Tagline from local** - Uses `config.tagline` instead of `restaurant.description`
4. **Production API endpoints** - Updated to `manage.mygenie.online/api/v1`
5. **Fixed API flow** - Wait for `restaurant.id` from restaurant-info before calling other APIs

### MyGenie API Fields Used (Final)
| Field | Values | Purpose |
|-------|--------|---------|
| `id` | Number | Restaurant ID for other APIs |
| `name` | String | Restaurant name |
| `is_loyalty` | Yes/No | Show loyalty features |
| `is_coupon` | Yes/No | Show coupon features |
| `multiple_menus` | Yes/No | Single or multiple menus |
| `online_order` | Yes/No | Show/hide ADD button |

### Environment Variables
```
REACT_APP_API_BASE_URL=https://manage.mygenie.online/api/v1
REACT_APP_IMAGE_BASE_URL=https://manage.mygenie.online
```

## API Flow (Preprod vs Production)
- **Preprod**: Uses numeric ID directly (e.g., `478`)
- **Production**: Uses subdomain (e.g., `fivestar.mygenie.online`) → calls restaurant-info → gets numeric ID → uses for other APIs

## Files Modified
- `/app/frontend/.env`
- `/app/frontend/src/pages/MenuItems.jsx`
- `/app/frontend/src/pages/ReviewOrder.jsx`
- `/app/frontend/src/pages/DiningMenu.jsx`
- `/app/frontend/src/pages/LandingPage.jsx`
- `/app/frontend/src/pages/AboutUs.jsx`
- `/app/frontend/src/components/MenuItem/MenuItem.jsx`
- `/app/frontend/src/api/utils/restaurantIdConfig.js`
- `/app/backend/db_import.py`
- `/app/backend/seed_demo_data.py`

## Next Action Items
- None - all requested changes complete

## Backlog/Future
- Add `.npmrc` with `legacy-peer-deps=true` for easier local npm installs
- Disable visual-edits plugin for local development (`enableVisualEdits: false` in craco.config.js)
