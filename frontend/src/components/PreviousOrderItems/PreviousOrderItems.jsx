import React from 'react';
import { IoLockClosedOutline } from 'react-icons/io5';
import './PreviousOrderItems.css';

/**
 * PreviousOrderItems Component
 * Displays read-only items from a previous order during edit mode
 * These items cannot be modified or removed
 */
const PreviousOrderItems = ({ items, orderId }) => {
  if (!items || items.length === 0) return null;

  // Calculate subtotal for previous items
  const subtotal = items.reduce((total, item) => {
    const price = parseFloat(item.unitPrice) || parseFloat(item.price) || 0;
    return total + (price * item.quantity);
  }, 0);

  return (
    <div className="previous-order-section" data-testid="previous-order-section">
      {/* Section Header */}
      <div className="previous-order-header">
        <div className="previous-order-title-row">
          <IoLockClosedOutline className="previous-order-lock-icon" />
          <h3 className="previous-order-title">Previously Ordered</h3>
        </div>
        {orderId && (
          <span className="previous-order-id">Order #{orderId}</span>
        )}
      </div>

      <p className="previous-order-subtitle">These items cannot be modified</p>

      {/* Items List */}
      <div className="previous-order-items-list">
        {items.map((item, index) => (
          <div 
            key={item.id || index} 
            className="previous-order-item"
            data-testid={`previous-order-item-${item.id || index}`}
          >
            {/* Item Info */}
            <div className="previous-order-item-info">
              {/* Veg/Non-Veg Indicator */}
              <span className={`previous-order-veg-label ${item.item?.veg ? 'veg' : 'non-veg'}`}>
                <span className="previous-order-veg-dot"></span>
              </span>
              
              <div className="previous-order-item-details">
                <span className="previous-order-item-name">{item.item?.name || 'Unknown Item'}</span>
                
                {/* Show variations if any */}
                {item.variations && item.variations.length > 0 && (
                  <span className="previous-order-item-variations">
                    {item.variations.map((v, i) => v.name || v.label).join(', ')}
                  </span>
                )}
                
                {/* Show add-ons if any */}
                {item.add_ons && item.add_ons.length > 0 && (
                  <span className="previous-order-item-addons">
                    + {item.add_ons.map(a => a.name).join(', ')}
                  </span>
                )}

                {/* Show cooking notes if any */}
                {item.foodLevelNotes && (
                  <span className="previous-order-item-notes">
                    Note: {item.foodLevelNotes}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="previous-order-item-right">
              <span className="previous-order-item-quantity">x{item.quantity}</span>
              <span className="previous-order-item-price">
                ₹{((parseFloat(item.unitPrice) || parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="previous-order-subtotal">
        <span className="previous-order-subtotal-label">Previous Order Subtotal</span>
        <span className="previous-order-subtotal-value">₹{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PreviousOrderItems;
