// src/features/booking/components/PayPalButton.jsx

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const [error, setError] = useState(null);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: "USD",
          },
          description: "Solicitud de servicio tecnico - PETROCOM Energy",
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        brand_name: "PETROCOM Energy",
        locale: "es-PE",
      },
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      console.log('PayPal payment successful:', details);
      onSuccess(details);
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      setError('Error al procesar el pago');
      onError(error);
    }
  };

  const onErrorHandler = (err) => {
    console.error('PayPal error:', err);
    setError('Error con PayPal');
    onError(err);
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-[#F4F5F6] border-l-4 border-[#C58A2A] p-4 rounded-lg mb-4">
          <p className="text-[#C58A2A] text-sm">{error}</p>
        </div>
      )}
      
      <div className="paypal-buttons-wrapper">
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onErrorHandler}
          onCancel={() => {
            console.log('Payment cancelled');
          }}
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 45,
          }}
          fundingSource={undefined}
          forceReRender={[amount, error]}
        />
      </div>
    </div>
  );
};

export default PayPalButton;
