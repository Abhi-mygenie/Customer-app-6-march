# Image & File Audit Notes — To Discuss Later

## Date: Feb 2026

---

## 1. Restaurant 478 ("18march") Logo Issue
- **Current logoUrl in DB**: `https://loyalty-points-debug-1.preview.emergentagent.com/api/uploads/ae2b994cb7184820914d7906200711b3.svg`
- Points to an **old preview environment** — will break when that pod is shut down
- The file (`ae2b994cb7184820914d7906200711b3.svg`) is **NOT present** locally in `/app/backend/uploads/`
- When it breaks, the app will fall back to `/assets/images/ic_login_logo.png`

---

## 2. Suspect / Corrupt Files in `/app/backend/uploads/`
These files are unusually small and likely corrupt or failed uploads:

| File | Size |
|---|---|
| `142168fc4b7a4f40ae8786f1a682abfe.webp` | 44 B |
| `25e4fc1e04bd48a287dc1a89c6e37928.jpg` | 362 B |
| `752f36cbf67e4e178b906d1d9a5795ed.png` | 68 B |
| `8c57fadffa824b9290daf7842cc30c35.gif` | 43 B |
| `976da4df39994b24a5a06af1dc699ef1.png` | 68 B |
| `9ab640d3f516448093552157d401f56c.png` | 19 B |
| `a2f65a50dce0466c87fb74ec55e68897.png` | 68 B |
| `a3ae57b9e1ed4d08badb47df4c2c5c36.svg` | 85 B |

---

## 3. Unused Static Assets in `/app/frontend/public/assets/images/`
- `hyatt_logo.png` (75 KB) — not referenced in any component code
- `hyatt_logo_1.png` (76 KB) — not referenced in any component code

---

## 4. Sidebar Fallback Bug
- `Sidebar.jsx` references `/assets/images/mygenie_logo.png` as fallback
- Only `mygenie_logo.svg` exists — the `.png` version does not exist
- Will show a broken image when a restaurant has no custom logo

---

## 5. Discussion Points
- Should the 18march logo be re-uploaded or stored locally?
- Clean up corrupt/tiny files from uploads?
- Remove unused Hyatt logos?
- Fix Sidebar fallback to use `.svg` instead of `.png`?
- Consider a migration strategy for logos pointing to old preview URLs
