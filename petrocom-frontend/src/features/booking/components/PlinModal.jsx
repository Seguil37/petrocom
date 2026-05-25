// src/features/booking/components/PlinModal.jsx

import { useState } from 'react';
import { Smartphone, CheckCircle, Loader2, QrCode } from 'lucide-react';
import PaymentModal from './PaymentModal';

const PlinModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 9);
  };

  const handleConfirmPayment = () => {
    if (phoneNumber.length === 9) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess({
          method: 'plin',
          phone: phoneNumber,
          amount: amount,
          transactionId: `PLIN-${Date.now()}`,
        });
        onClose();
        setPhoneNumber('');
      }, 3000);
    }
  };

  return (
    <PaymentModal isOpen={isOpen} onClose={onClose} title="Pagar con Plin">
      <div className="space-y-6">
        {/* Logo Plin */}
        <div className="bg-gradient-to-br from-[#07073b] to-[#05052f] rounded-2xl p-8 text-white text-center">
          <div className="w-20 h-20 bg-[#F4F5F6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Plin</h3>
          <p className="text-cyan-100">Paga con tu celular</p>
        </div>

        {/* Monto */}
        <div className="bg-cyan-50 rounded-xl p-4 text-center">
          <p className="text-sm text-cyan-700 mb-1">Total a pagar</p>
          <p className="text-3xl font-black text-cyan-900">
            S/ {amount.toFixed(2)}
          </p>
        </div>

        {/* QR Simulado */}
        <div className="bg-[#F4F5F6] border-2 border-dashed border-[#D7DCE1] rounded-xl p-6">
          <div className="w-48 h-48 bg-[#F4F5F6] rounded-xl flex items-center justify-center mx-auto">
            <QrCode className="w-24 h-24 text-[#5F6B76]" />
          </div>
          <p className="text-center text-sm text-[#5F6B76] mt-4">
            Escanea este código QR con tu app Plin
          </p>
        </div>

        {/* O pagar con número */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D7DCE1]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#F4F5F6] text-[#5F6B76]">O ingresa tu número</span>
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-semibold text-[#07073b] mb-2">
            Número de celular
          </label>
          <div className="flex gap-2">
            <div className="px-4 py-3 border-2 border-[#D7DCE1] rounded-xl bg-[#F4F5F6] font-mono">
              +51
            </div>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
              placeholder="987654321"
              className="flex-1 px-4 py-3 border-2 border-[#D7DCE1] rounded-xl focus:border-[#07073b] focus:outline-none font-mono"
              maxLength="9"
            />
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleConfirmPayment}
          disabled={phoneNumber.length !== 9 || loading}
          className="w-full bg-gradient-to-r from-[#07073b] to-[#05052f] hover:from-[#05052f] hover:to-[#05052f] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Confirmar Pago
            </>
          )}
        </button>

        <p className="text-xs text-center text-[#5F6B76]">
          ⚠️ Pago simulado - No se realizará cargo real
        </p>
      </div>
    </PaymentModal>
  );
};

export default PlinModal;