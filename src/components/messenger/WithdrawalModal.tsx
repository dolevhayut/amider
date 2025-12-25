import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { DollarSign, AlertCircle } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSubmit: (amount: number, bankDetails: {
    bankName: string;
    bankBranch: string;
    bankAccount: string;
    bankAccountHolder: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const MIN_WITHDRAWAL = 50; // Minimum withdrawal amount in ILS

export function WithdrawalModal({
  isOpen,
  onClose,
  currentBalance,
  onSubmit,
}: WithdrawalModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    bankBranch: '',
    bankAccount: '',
    bankAccountHolder: '',
  });

  const handleSubmit = async () => {
    setError(null);

    const withdrawalAmount = Number(amount);

    // Validations
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      setError('נא להזין סכום תקין');
      return;
    }

    if (withdrawalAmount < MIN_WITHDRAWAL) {
      setError(`סכום משיכה מינימלי: ₪${MIN_WITHDRAWAL}`);
      return;
    }

    if (withdrawalAmount > currentBalance) {
      setError(`יתרה לא מספיקה. יתרה נוכחית: ₪${currentBalance.toFixed(2)}`);
      return;
    }

    if (!bankDetails.bankName || !bankDetails.bankBranch || !bankDetails.bankAccount || !bankDetails.bankAccountHolder) {
      setError('נא למלא את כל פרטי הבנק');
      return;
    }

    setLoading(true);
    const result = await onSubmit(withdrawalAmount, bankDetails);
    setLoading(false);

    if (result.success) {
      // Reset form
      setAmount('');
      setBankDetails({
        bankName: '',
        bankBranch: '',
        bankAccount: '',
        bankAccountHolder: '',
      });
      onClose();
    } else {
      setError(result.error || 'שגיאה בשליחת בקשה');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="בקשת משיכת כסף"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Current Balance */}
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">יתרה זמינה למשיכה:</p>
          <p className="text-2xl font-bold text-green-600">₪{currentBalance.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">סכום מינימלי למשיכה: ₪{MIN_WITHDRAWAL}</p>
        </div>

        {/* Withdrawal Amount */}
        <div>
          <Input
            label="סכום למשיכה"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`לפחות ₪${MIN_WITHDRAWAL}`}
            required
            min={MIN_WITHDRAWAL}
            max={currentBalance}
          />
          <p className="text-xs text-gray-500 mt-1">
            הכסף יועבר תוך 3-5 ימי עסקים
          </p>
        </div>

        {/* Bank Details */}
        <div className="space-y-3 pt-2 border-t">
          <h4 className="font-semibold text-gray-900">פרטי בנק לזיכוי</h4>
          
          <Input
            label="שם הבנק"
            type="text"
            value={bankDetails.bankName}
            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
            placeholder="לדוגמא: בנק לאומי"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="סניף"
              type="text"
              value={bankDetails.bankBranch}
              onChange={(e) => setBankDetails({ ...bankDetails, bankBranch: e.target.value })}
              placeholder="123"
              required
            />

            <Input
              label="מספר חשבון"
              type="text"
              value={bankDetails.bankAccount}
              onChange={(e) => setBankDetails({ ...bankDetails, bankAccount: e.target.value })}
              placeholder="123456"
              required
            />
          </div>

          <Input
            label="שם בעל החשבון"
            type="text"
            value={bankDetails.bankAccountHolder}
            onChange={(e) => setBankDetails({ ...bankDetails, bankAccountHolder: e.target.value })}
            placeholder="שם מלא כפי שמופיע בבנק"
            required
          />
        </div>

        {/* Info */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-900">
            💡 <strong>שים לב:</strong> הבקשה תישלח לאישור המנהל. לאחר אישור, הכסף יועבר לחשבון הבנק שהזנת תוך 3-5 ימי עסקים.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            ביטול
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            <DollarSign className="h-4 w-4" />
            שלח בקשה
          </Button>
        </div>
      </div>
    </Modal>
  );
}

