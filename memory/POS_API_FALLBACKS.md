# POS API Fallbacks Documentation

> **Last Updated:** March 12, 2026  
> **Purpose:** Documents all fallback values used when POS API doesn't return expected results

---

## Table of Contents

1. [Overview](#overview)
2. [Menu Items API](#1-menu-items-api)
3. [Order Details API](#2-order-details-api)
4. [Place Order API](#3-place-order-api)
5. [Cart Items Transformation](#4-cart-items-transformation)
6. [Table Status Check API](#5-table-status-check-api)
7. [Restaurant Details API](#6-restaurant-details-api)
8. [Table/Room Config API](#7-tableroom-config-api)
9. [Stations API](#8-stations-api)
10. [Quick Reference Table](#quick-reference-table)

---

## Overview

When the POS API fails to return expected data, the application uses fallback values to prevent crashes and maintain functionality. This document lists all fallback occurrences across the codebase.

### Fallback Types:
- **Empty String (`''`)** - For text fields
- **Zero (`0`)** - For numeric/price fields
- **Empty Array (`[]`)** - For list fields
- **Null (`null`)** - For optional fields
- **Default Values** - Specific defaults like `'GST'`, `'Unknown Item'`

---

## 1. Menu Items API

**File:** `/app/frontend/src/hooks/useMenuData.js`  
**Function:** `useMenuSections` → calls `getRestaurantProducts`  
**API Endpoint:** Restaurant Products API

### Item-Level Fallbacks

| Field | API Field | Fallback Value | Line # | Description |
|-------|-----------|----------------|--------|-------------|
| Name | `item.name` | `''` | 84 | Item displays with no name |
| Description | `item.description` | `''` | 85 | No description shown |
| Price | `item.price` | `0` | 86 | Item shows ₹0.00 |
| Image | `item.image` | `null` | 69-80 | No image displayed |
| Allergens | `item.allergens` | `[]` | 90 | No allergen warnings |
| Variations | `item.variations` | `[]` | 91 | No variation options |
| Add-ons | `item.add_ons` | `[]` | 92 | No add-on options |
| Calories | `item.kcal` | `''` | 93 | No calorie info |
| Portion Size | `item.portion_size` | `''` | 94 | No portion info |
| Station | `item.station_name` | `''` | 95 | No station displayed |
| Web Availability | `item.live_web` | `null` | 96 | Treated as available |
| Available From | `item.web_available_time_starts` | `null` | 97 | No time restriction |
| Available Until | `item.web_available_time_ends` | `null` | 98 | No time restriction |
| Tax Percentage | `item.tax` | `0` | 99 | No tax applied |
| Tax Type | `item.tax_type` | `'GST'` | 100 | Defaults to GST |

### Category-Level Fallbacks

| Field | API Field | Fallback Value | Line # | Description |
|-------|-----------|----------------|--------|-------------|
| Category Name | `product.category_name` | `''` | 105 | Empty category header |
| Category Image | `product.category_image` | `''` | 106 | No category image |
| Items | `product.items` | `[]` | 62 | Empty category |

### Response-Level Fallbacks

| Scenario | Fallback Value | Line # | Description |
|----------|----------------|--------|-------------|
| `data.products` missing | `[]` or check if `data` is array | 57 | Empty menu |
| API fails (dev mode) | Local JSON `../data/menuItems.json` | 122-130 | Uses cached data |
| `menuSections` undefined | `[]` | 142 | Empty sections array |

---

## 2. Order Details API

**File:** `/app/frontend/src/api/services/orderService.js`  
**Function:** `getOrderDetails`  
**API Endpoint:** `/air-bnb/get-order-details/{orderId}`

### Order-Level Fallbacks

| Field | API Field | Fallback Value | Line # | Description |
|-------|-----------|----------------|--------|-------------|
| Details Array | `orderData.details` | `[]` | 839, 849 | No order items |
| First Detail | `(orderData.details)[0]` | `{}` | 839 | Empty object |
| Order Discount | `firstDetail.order_discount` | `0` | 841 | No discount |
| Order Status | `firstDetail.f_order_status` | `null` | 934 | Unknown status |
| Restaurant Order ID | `firstDetail.restaurant_order_id` | `null` | 935 | No POS order ID |
| Order Amount | `firstDetail.order_amount` | `0` | 938 | ₹0.00 total |

### Item Detail Fallbacks

| Field | API Field | Fallback Value | Line # | Description |
|-------|-----------|----------------|--------|-------------|
| Unit Price | `detail.unit_price` | `0` | 850 | ₹0.00 per unit |
| Quantity | `detail.quantity` | `1` | 851 | Default 1 item |
| Variation Price | `val.optionPrice` | `0` | 861 | No variation cost |
| Add-on Price | `addon.price` | `0` | 871 | No add-on cost |
| Add-on Quantity | `addon.quantity` | `1` | 871 | Default 1 add-on |
| Tax Percentage | `detail.food_details?.tax` | `0` | 884 | No tax |
| Tax Type | `detail.food_details?.tax_type` | `'GST'` | 885 | Default GST |

### Food Details Fallbacks

| Field | API Field | Fallback Value | Line # | Description |
|-------|-----------|----------------|--------|-------------|
| Food Name | `detail.food_details?.name` | `'Unknown Item'` | 902 | Generic name |
| Description | `detail.food_details?.description` | `''` | 903 | No description |
| Image | `detail.food_details?.image` | `''` | 904 | No image |
| Price | `detail.food_details?.price` | `detail.price` | 905 | Uses detail price |
| Tax | `detail.food_details?.tax` | `0` | 907 | No tax |
| Tax Type | `detail.food_details?.tax_type` | `'GST'` | 908 | Default GST |
| Variations | `detail.variation` | `[]` | 910 | No variations |
| Add-ons | `detail.add_ons` | `[]` | 911 | No add-ons |
| Food Notes | `detail.food_level_notes` | `''` | 912 | No cooking notes |
| Order Note | `detail.order_note` | `''` | 913 | No special instructions |

---

## 3. Place Order API

**File:** `/app/frontend/src/api/services/orderService.js`  
**Functions:** `buildOrderPayload`, `build716OrderPayload`

### Customer Data Fallbacks

| Field | Fallback Value | Line # | Description |
|-------|----------------|--------|-------------|
| Customer Phone | `''` | 563-564, 651-652 | Empty phone number |
| Customer Name | `''` | 610, 711 | Empty customer name |
| Dial Code | `'+91'` (via getDialCode) | 528 | Default India code |

### Order Data Fallbacks

| Field | Fallback Value | Line # | Description |
|-------|----------------|--------|-------------|
| Special Instructions | `''` | 580, 681 | No special notes |
| Restaurant ID | `0` | 582, 683 | Invalid restaurant |
| Table Number | `''` | 600 | No table assigned |
| Payment Type | `'postpaid'` | 594 | Pay after meal |

### Tax Calculation Fallbacks

| Field | Fallback Value | Line # | Description |
|-------|----------------|--------|-------------|
| GST Tax Amount | `0` | 656 | No GST |
| VAT Tax Amount | `0` | 660 | No VAT |

---

## 4. Cart Items Transformation

**File:** `/app/frontend/src/api/services/orderService.js`  
**Functions:** `transformCartItemsNormal`, `transformCartItems716`

### Cart Item Fallbacks

| Field | API Field | Fallback Value | Line # | Description |
|-------|-----------|----------------|--------|-------------|
| Base Price | `cartItem.item.price` | `0` | 388 | ₹0.00 base |
| Variation Price | `variation.optionPrice` | `0` | 393 | No variation cost |
| Add-on Price | `addon.price` | `0` | 400 | No add-on cost |
| Add-on Quantity | `addon.quantity` | `0` | 400 | No add-ons |
| Food ID | `cartItem.itemId` | `0` | 445, 485 | Invalid food ID |
| Cooking Instructions | `cartItem.cookingInstructions` | `''` | 446, 486 | No instructions |
| Item Tax | `cartItem.item.tax` | `0` | 476 | No tax |
| Variation Name | `variation.name` | `'CHOICE OF'` | 316 | Default label |

### Variation/Add-on Price Calculations

| Calculation | Fallback | Line # | Description |
|-------------|----------|--------|-------------|
| Total Variation Price | `0` per missing variation | 416 | Sum defaults to 0 |
| Total Add-on Price | `0` per missing add-on | 429 | Sum defaults to 0 |

---

## 5. Table Status Check API

**File:** `/app/frontend/src/api/services/orderService.js`  
**Function:** `checkTableStatus`

### Response Fallbacks

| Field | Fallback Value | Line # | Description |
|-------|----------------|--------|-------------|
| Order ID | `''` | 1150 | Empty order ID |

### Error Handling Fallback

| Scenario | Fallback Response | Line # | Description |
|----------|-------------------|--------|-------------|
| API Error | `{ hasExistingOrder: false, existingOrderId: null, ... }` | 1161-1168 | Treats as new order |

```javascript
// On API error, returns safe default:
{
  hasExistingOrder: false,
  existingOrderId: null,
  orderStatus: null,
  canEdit: false,
  error: error.message,
}
```

---

## 6. Restaurant Details API

**File:** `/app/frontend/src/hooks/useMenuData.js`  
**Function:** `useRestaurantDetails`

### Response Fallbacks

| Scenario | Fallback Value | Description |
|----------|----------------|-------------|
| No identifier provided | Throws Error | Cannot proceed without ID |
| API fails | `restaurant: null` | No restaurant data |
| `error` present | `errorMessage` via `getErrorMessage()` | User-friendly error |

---

## 7. Table/Room Config API

**File:** `/app/frontend/src/hooks/useMenuData.js`  
**Function:** `useTableConfig`

### Response Fallbacks

| Scenario | Fallback Value | Line # | Description |
|----------|----------------|--------|-------------|
| No restaurantId | `{ rooms: [], tables: [] }` | 307 | Empty config |
| `tableConfig?.rooms` missing | `[]` | 318 | No rooms |
| `tableConfig?.tables` missing | `[]` | 319 | No tables |

---

## 8. Stations API

**File:** `/app/frontend/src/hooks/useMenuData.js`  
**Function:** `useStations`

### Response Fallbacks

| Scenario | Fallback Value | Line # | Description |
|----------|----------------|--------|-------------|
| API fails (dev mode) | Local JSON `../data/stations.json` | 174-178 | Uses cached data |
| `stations` undefined | `[]` | 194 | Empty stations list |

---

## Quick Reference Table

### Critical Fallbacks (Most Impact)

| API | Field | Fallback | User Impact |
|-----|-------|----------|-------------|
| Menu Items | `item.name` | `''` | Item shows blank name |
| Menu Items | `item.price` | `0` | Item shows ₹0.00 |
| Menu Items | `item.tax_type` | `'GST'` | Tax calculated as GST |
| Order Details | `food_details?.name` | `'Unknown Item'` | Generic item name in order |
| Order Details | All amounts | `0` | Bill shows ₹0.00 |
| Place Order | `customerName` | `''` | Order without customer name |
| Table Status | On Error | `hasExistingOrder: false` | Always creates new order |
| Table Config | All fields | `[]` | No tables/rooms displayed |

### Fallback Value Types Summary

| Type | Count | Example Fields |
|------|-------|----------------|
| Empty String `''` | 25+ | name, description, phone, instructions |
| Zero `0` | 20+ | price, tax, quantity, amounts |
| Empty Array `[]` | 15+ | items, variations, add_ons, rooms, tables |
| Null `null` | 10+ | image, order_status, time fields |
| Default String | 3 | `'GST'`, `'Unknown Item'`, `'CHOICE OF'` |
| Default Number | 2 | `1` for quantity, `'+91'` for dial code |

---

## Code Examples

### Checking for Fallback Values in Frontend

```javascript
// Menu Item - checking if using fallback
const isItemNameMissing = !item.name || item.name === '';
const isItemPriceZero = item.price === 0;
const isUsingDefaultTaxType = item.tax_type === 'GST' && !apiReturnedTaxType;

// Order Details - checking for unknown item
const isUnknownItem = item.name === 'Unknown Item';

// Table Status - checking for error fallback
const isTableStatusError = tableStatus.error !== undefined;
```

### Safe Data Access Pattern Used

```javascript
// Pattern 1: Optional chaining with fallback
const name = detail.food_details?.name || 'Unknown Item';

// Pattern 2: Nullish coalescing
const status = firstDetail.f_order_status ?? null;

// Pattern 3: Default parameter
const quantity = detail.quantity || 1;

// Pattern 4: Array fallback
const items = orderData.details || [];
const firstItem = items[0] || {};
```

---

## Recommendations

### For Developers

1. **Always check for fallback indicators** before displaying critical data
2. **Log warnings** when fallback values are used in production
3. **Consider UI indicators** for missing data (e.g., "Price not available")

### For QA Testing

1. Test with POS API returning partial data
2. Test with POS API returning empty responses
3. Test with POS API timeout/failure scenarios
4. Verify fallback values display appropriately in UI

### For Operations

1. Monitor for high frequency of fallback usage (indicates POS API issues)
2. Set up alerts for `'Unknown Item'` appearing in orders
3. Track orders placed with ₹0.00 totals

---

## Related Files

- `/app/frontend/src/hooks/useMenuData.js` - Menu data hooks
- `/app/frontend/src/api/services/orderService.js` - Order service
- `/app/frontend/src/api/services/restaurantService.js` - Restaurant service
- `/app/frontend/src/api/services/tableRoomService.js` - Table/Room service
- `/app/frontend/src/context/RestaurantConfigContext.jsx` - Admin config defaults

---

*Document maintained by MyGenie Engineering Team*
