# Customer App PRD

## Original Problem Statement
Pull GitHub repository `https://github.com/Abhi-mygenie/Customer-app-6-march.git` as-is, find and run DB import script.

## Architecture
- **Frontend**: React (with TailwindCSS, Craco)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB

## What's Been Implemented (March 7, 2025)
- [x] Cloned repository from main branch
- [x] Created environment files (.env for backend and frontend)
- [x] Installed all dependencies (pip & yarn)
- [x] Ran `db_import.py --drop` to import database

## Database Collections Imported
| Collection | Documents |
|------------|-----------|
| customers | 1,967 |
| points_transactions | 280 |
| wallet_transactions | 81 |
| automation_rules | 70 |
| whatsapp_templates | 70 |
| feedback | 17 |
| loyalty_settings | 7 |
| users | 6 |
| segments | 4 |
| coupons | 3 |
| whatsapp_event_template_map | 2 |
| orders | 1 |
| cron_job_logs | 1 |

## Backlog / Next Tasks
- P0: Test application login and main flows
- P1: Configure WhatsApp integration keys if needed
- P2: Review automation rules functionality
