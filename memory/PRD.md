# Customer App - MyGenie POS Integration

## Original Problem Statement
Pull and build the Customer App from https://github.com/Abhi-mygenie/Customer-app-6-march as is.

## Architecture
- **Frontend**: React.js with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (local) + External MyGenie API (preprod.mygenie.online)
- **Environment**: Emergent Platform

## User Personas
1. **Restaurant Admin** - Manages branding, banners, visibility settings
2. **Customer** - Browses menu, places orders, edits existing orders

## Core Requirements (Static)
- Restaurant menu display with categories
- Cart functionality with add/remove items
- Order placement workflow
- Admin settings panel (Branding, Banners, Content, Visibility)
- Border radius customization for UI elements

## What's Been Implemented

### Session 1 (March 7, 2026)
1. **Initial Setup** - Cloned repo, imported database, configured environment
2. **Menu Tab in Admin Settings** - Added 5th tab to navigate back to menu
3. **Admin Settings Button in Header** - Shows "Settings" button for logged-in admins
4. **Border Radius Fix** - All buttons/containers now respect admin border radius setting
5. **Environment Switch** - Switched from production to preprod API

### Session 2 (March 7, 2026) - Edit Order Feature
1. **API Integration** (`/api/air-bnb/get-order-details/{orderId}`)
2. **CartContext Extended** - Added edit mode state management:
   - `isEditMode`, `editingOrderId`, `previousOrderItems`
   - `startEditOrder()`, `clearEditMode()`, `getEditOrderPayload()`
3. **PreviousOrderItems Component** - Read-only display of previous order items
4. **ReviewOrder Page Updates** - Split view showing:
   - "Previously Ordered" section (locked items)
   - "New Items" section (editable)
   - Combined price breakdown with Grand Total
5. **Menu Page Edit Banner** - Shows "Adding items to Order #XXXXX" with Cancel button
6. **OrderSuccess Page** - Edit Order button triggers the flow

## API Endpoints
- `GET /api/air-bnb/get-order-details/{orderId}` - Fetch order details for editing
- `POST /api/customer/order/place` - Place new order
- `GET /api/web/restaurant-info` - Get restaurant details

## Prioritized Backlog

### P0 (Critical)
- [ ] Order submission with combined previous + new items payload
- [ ] Integration testing with real order IDs

### P1 (High)
- [ ] Call Waiter API integration
- [ ] Pay Bill flow implementation
- [ ] OTP-based customer login

### P2 (Medium)
- [ ] Coupon code validation
- [ ] Loyalty points redemption
- [ ] Multiple payment methods

## Next Tasks
1. Test full edit order submission flow
2. Implement order status real-time updates
3. Add payment integration

## Test Credentials
- **Admin Email**: demo@restaurant.com
- **Admin Password**: demo123
- **Test Order ID**: 243057
