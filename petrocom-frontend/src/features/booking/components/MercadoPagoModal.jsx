// src/features/booking/components/MercadoPagoModal.jsx

import { useState } from 'react';
import { CreditCard, CheckCircle, Loader2, Shield } from 'lucide-react';
import PaymentModal from './PaymentModal';

const MercadoPagoModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleConfirmPayment = () => {
    if (email && email.includes('@')) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess({
          method: 'mercadopago',
          email: email,
          amount: amount,
          transactionId: `MP-${Date.now()}`,
        });
        onClose();
        setEmail('');
      }, 3000);
    }
  };

  return (
    <PaymentModal isOpen={isOpen} onClose={onClose} title="Pagar con Mercado Pago">
      <div className="space-y-6">
        {/* Logo Mercado Pago */}
        <div className="bg-gradient-to-br from-[#07073b] to-[#05052f] rounded-2xl p-8 text-white text-center">
          <div className="w-20 h-20 bg-[#f3f4f6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Mercado Pago</h3>
          <p className="text-white">Tu dinero seguro</p>
        </div>

        {/* Monto */}
        <div className="bg-[#f3f4f6] rounded-xl p-4 text-center">
          <p className="text-sm text-[#07073b] mb-1">Total a pagar</p>
          <p className="text-3xl font-black text-[#05052f]">
            S/ {amount.toFixed(2)}
          </p>
        </div>

        {/* Beneficios */}
        <div className="bg-[#f3f4f6] rounded-xl p-4">
          <h4 className="font-bold text-white mb-3">Beneficios:</h4>
          <ul className="space-y-2 text-sm text-[#07073b]">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#07073b]" />
              Compra protegida
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#07073b]" />
              Paga en cuotas sin interés
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#07073b]" />
              Devolución garantizada
            </li>
          </ul>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#07073b] mb-2">
            Email de Mercado Pago
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 border-2 border-[#dfe2ea] rounded-xl focus:border-[#07073b] focus:outline-none"
          />
        </div>

        {/* Seguridad */}
        <div className="flex items-center gap-3 bg-[#f3f4f6] p-4 rounded-xl">
          <Shield className="w-6 h-6 text-[#07073b] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#05052f]">Pago 100% seguro</p>
            <p className="text-xs text-[#07073b]">Protegido por Mercado Pago</p>
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleConfirmPayment}
          disabled={!email || !email.includes('@') || loading}
          className="w-full bg-gradient-to-r from-[#07073b] to-[#05052f] hover:from-[#07073b] hover:to-[#05052f] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Redirigiendo a Mercado Pago...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pagar con Mercado Pago
            </>
          )}
        </button>

        <p className="text-xs text-center text-[#65647a]">
          ⚠️ Pago simulado - Serás redirigido a Mercado Pago (simulado)
        </p>
      </div>
    </PaymentModal>
  );
};

export default MercadoPagoModal;