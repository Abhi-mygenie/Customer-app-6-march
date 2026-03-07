import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRestaurantId } from '../utils/useRestaurantId';
import { useRestaurantDetails } from '../hooks/useMenuData';
import { useRestaurantConfig } from '../context/RestaurantConfigContext';
import { useScannedTable } from '../hooks/useScannedTable';
import { useCart } from '../context/CartContext';
import { isMultipleMenu } from '../api/utils/restaurantIdConfig';
import { getOrderDetails } from '../api/services/orderService';
import Header from '../components/Header/Header';
import { IoCheckmarkCircle, IoCallOutline, IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';
import { RiBillLine } from 'react-icons/ri';
import { MdOutlineEdit, MdOutlineRestaurantMenu, MdOutlineTableRestaurant } from 'react-icons/md';
import { FaDoorOpen } from 'react-icons/fa';
import './OrderSuccess.css';

// Helper: check if a success_config flag is enabled (defaults to Y)
const isConfigEnabled = (restaurant, key) => {
  const config = restaurant?.success_config;
  if (!config) return true;
  const val = config[key];
  if (val === undefined || val === null) return true;
  return val === 'Y' || val === 'y' || val === true || val === '1';
};

// Order status steps
const ORDER_STATUSES = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'served', label: 'Served' },
];

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurantId } = useRestaurantId();
  const { restaurant } = useRestaurantDetails(restaurantId);
  const { logoUrl: configLogoUrl, phone: configPhone, fetchConfig } = useRestaurantConfig();
  const { tableNo: scannedTableNo, roomOrTable: scannedRoomOrTable, isScanned } = useScannedTable();
  const { startEditOrder } = useCart();
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [showItems, setShowItems] = useState(true);

  const orderData = location.state?.orderData || null;
  const orderItems = orderData?.items || [];

  // Fetch admin config for this restaurant
  useEffect(() => {
    if (restaurantId) {
      fetchConfig(restaurantId);
    }
  }, [restaurantId, fetchConfig]);

  // Redirect if no order data
  useEffect(() => {
    if (!orderData) {
      if (restaurantId) {
        if (isMultipleMenu(restaurant, restaurantId)) {
          navigate(`/${restaurantId}/stations`, { replace: true });
        } else {
          navigate(`/${restaurantId}/menu`, { replace: true });
        }
      } else {
        navigate('/stations', { replace: true });
      }
    }
  }, [orderData, navigate, restaurantId, restaurant]);

  if (!orderData) return null;

  // Current order status (from API or default to 'placed')
  const currentStatus = orderData.status || 'placed';
  const currentStepIndex = ORDER_STATUSES.findIndex(s => s.key === currentStatus);

  const handleGoToMenu = () => {
    if (isMultipleMenu(restaurant, restaurantId)) {
      navigate(`/${restaurantId}/stations`, { replace: true });
    } else {
      navigate(`/${restaurantId}/menu`, { replace: true });
    }
  };

  const handleEditOrder = async () => {
    if (!orderData?.orderId) {
      console.error('No order ID available for editing');
      return;
    }

    setIsLoadingEdit(true);
    try {
      // Fetch order details from API
      const orderDetails = await getOrderDetails(orderData.orderId);
      
      // Start edit mode with previous items
      startEditOrder(
        orderData.orderId,
        orderDetails.previousItems,
        {
          tableId: orderDetails.tableId,
          tableNo: orderDetails.tableNo,
          restaurant: orderDetails.restaurant,
        }
      );

      // Navigate to menu to add more items
      if (isMultipleMenu(restaurant, restaurantId)) {
        navigate(`/${restaurantId}/stations`, { replace: true });
      } else {
        navigate(`/${restaurantId}/menu`, { replace: true });
      }
    } catch (error) {
      console.error('Failed to fetch order details for editing:', error);
      // Still allow navigation even if API fails
      navigate(`/${restaurantId}/review-order`, { replace: true });
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleCallWaiter = () => {
    // TODO: Integrate with call waiter API
    console.log('Call waiter triggered for order', orderData.orderId);
  };

  const handlePayBill = () => {
    // TODO: Integrate with pay bill flow
    console.log('Pay bill triggered for order', orderData.orderId);
  };

  // Config flags
  const showOrderStatus = isConfigEnabled(restaurant, 'show_order_status');
  const showCallWaiter = isConfigEnabled(restaurant, 'show_call_waiter');
  const showPayBill = isConfigEnabled(restaurant, 'show_pay_bill');
  const showEditOrder = isConfigEnabled(restaurant, 'show_edit_order');
  const showGoToMenu = isConfigEnabled(restaurant, 'show_go_to_menu');
  const showTableNumber = isConfigEnabled(restaurant, 'show_table_number') && isScanned && scannedTableNo;

  // Calculate total items count
  const totalItemsCount = orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="order-success-page" data-testid="order-success-page">
      <Header
        brandText={restaurant?.name}
        logoUrl={configLogoUrl || '/assets/images/ic_login_logo.png'}
        phone={configPhone || restaurant?.phone}
        onLogoClick={() => navigate(`/${restaurantId}`)}
      />
      <div className="order-success-container">

        {/* Compact Hero: Icon + Title inline */}
        <div className="order-success-hero-compact">
          <div className="order-success-icon-small" data-testid="order-success-icon">
            <IoCheckmarkCircle />
          </div>
          <div className="order-success-hero-text">
            <h1 className="order-success-title-compact">Order Placed!</h1>
            <p className="order-success-message-compact">
              Your order is being processed
            </p>
          </div>
        </div>

        {/* Order Details Card - Compact */}
        <div className="order-success-card-compact" data-testid="order-success-card">
          {/* Order ID + Total in one row */}
          <div className="order-success-main-row">
            <div className="order-success-order-info">
              <span className="order-success-order-label">Order</span>
              <span className="order-success-order-id">#{orderData.orderId || 'N/A'}</span>
            </div>
            <span className="order-success-total">₹{orderData.totalToPay || '0.00'}</span>
          </div>

          {/* Table Number - inline */}
          {showTableNumber && (
            <div className="order-success-table-row">
              <span className="order-success-table-icon">
                {scannedRoomOrTable === 'room' ? <FaDoorOpen /> : <MdOutlineTableRestaurant />}
              </span>
              <span className="order-success-table-label">
                {scannedRoomOrTable === 'room' ? 'Room' : 'Table'}
              </span>
              <span className="order-success-table-value">{scannedTableNo}</span>
            </div>
          )}
        </div>

        {/* Items Ordered - Collapsible */}
        {orderItems.length > 0 && (
          <div className="order-success-items-card">
            <div 
              className="order-success-items-header"
              onClick={() => setShowItems(!showItems)}
              data-testid="toggle-items-btn"
            >
              <span className="order-success-items-title">
                Items Ordered ({totalItemsCount})
              </span>
              <span className="order-success-items-toggle">
                {showItems ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
              </span>
            </div>
            {showItems && (
              <div className="order-success-items-list">
                {orderItems.map((item, index) => (
                  <div key={index} className="order-success-item-row">
                    <div className="order-success-item-info">
                      <span className={`order-success-item-veg ${item.veg ? 'veg' : 'non-veg'}`}>
                        <span className="veg-dot"></span>
                      </span>
                      <span className="order-success-item-name">{item.name || item.item?.name || 'Item'}</span>
                      <span className="order-success-item-qty">x{item.quantity || 1}</span>
                    </div>
                    <span className="order-success-item-price">
                      ₹{((item.price || item.totalPrice || 0) * (item.quantity || 1)).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Order Status Tracker - Compact */}
        {showOrderStatus && (
          <div className="order-status-tracker-compact" data-testid="order-status-tracker">
            <div className="order-status-steps-compact">
              {ORDER_STATUSES.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className={`order-status-step-compact ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="order-status-dot-compact">
                      {isCompleted && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {idx < ORDER_STATUSES.length - 1 && (
                      <div className={`order-status-line-compact ${isCompleted && idx < currentStepIndex ? 'filled' : ''}`}></div>
                    )}
                    <span className="order-status-label-compact">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons - Compact */}
        <div className="order-success-actions-compact" data-testid="order-success-actions">
          {/* Top row: Edit + Call Waiter + Pay Bill */}
          <div className="order-success-btn-row">
            {showEditOrder && (
              <button
                className="order-success-btn order-success-btn-outline"
                onClick={handleEditOrder}
                disabled={isLoadingEdit}
                data-testid="order-success-edit-btn"
              >
                <MdOutlineEdit />
                {isLoadingEdit ? '...' : 'Edit'}
              </button>
            )}
            {showCallWaiter && (
              <button
                className="order-success-btn order-success-btn-outline"
                onClick={handleCallWaiter}
                data-testid="order-success-call-waiter-btn"
              >
                <IoCallOutline />
                Call
              </button>
            )}
            {showPayBill && (
              <button
                className="order-success-btn order-success-btn-outline"
                onClick={handlePayBill}
                data-testid="order-success-pay-bill-btn"
              >
                <RiBillLine />
                Pay
              </button>
            )}
          </div>

          {/* Browse Menu - Full width */}
          {showGoToMenu && (
            <button
              className="order-success-btn order-success-btn-primary"
              onClick={handleGoToMenu}
              data-testid="order-success-menu-btn"
            >
              <MdOutlineRestaurantMenu />
              Browse Menu
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
