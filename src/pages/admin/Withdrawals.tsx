import { useState } from 'react';
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { Modal } from '../../components/shared/Modal';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { useAuth } from '../../contexts/AuthContext';

export function AdminWithdrawals() {
  const { user } = useAuth();
  const { withdrawals, loading, error, approveWithdrawal, rejectWithdrawal } = useWithdrawals();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const filteredWithdrawals = withdrawals.filter(w => 
    filterStatus === 'all' || w.status === filterStatus
  );

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const completedCount = withdrawals.filter(w => w.status === 'completed').length;
  const totalAmount = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.amount, 0);

  const handleApprove = async (withdrawalId: string) => {
    if (!user?.id) return;
    
    if (confirm('האם אתה בטוח שברצונך לאשר את המשיכה?')) {
      setActionLoading(true);
      await approveWithdrawal(withdrawalId, user.id);
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedWithdrawal || !rejectReason.trim()) {
      alert('נא להזין סיבת דחייה');
      return;
    }

    setActionLoading(true);
    await rejectWithdrawal(selectedWithdrawal.id, rejectReason);
    setActionLoading(false);
    setShowRejectModal(false);
    setSelectedWithdrawal(null);
    setRejectReason('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">שגיאה בטעינת הנתונים</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ניהול משיכות</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">אישור וניהול בקשות משיכה מהשליחים</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">ממתינות לאישור</p>
            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">אושרו</p>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">סה"כ שולם</p>
            <p className="text-2xl font-bold text-indigo-600">₪{totalAmount.toFixed(0)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">סה"כ בקשות</p>
            <p className="text-2xl font-bold text-gray-600">{withdrawals.length}</p>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">כל הבקשות</option>
            <option value="pending">ממתינות לאישור</option>
            <option value="completed">אושרו</option>
            <option value="failed">נדחו</option>
          </select>
          <Badge variant="info">{filteredWithdrawals.length} תוצאות</Badge>
        </div>
      </Card>

      {/* Withdrawals List */}
      <div className="space-y-3">
        {filteredWithdrawals.length > 0 ? (
          filteredWithdrawals.map((withdrawal) => (
            <Card key={withdrawal.id}>
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-indigo-500" />
                      <h3 className="font-semibold text-gray-900">{withdrawal.messengerName}</h3>
                      <Badge 
                        variant={
                          withdrawal.status === 'completed' ? 'success' :
                          withdrawal.status === 'pending' ? 'warning' :
                          'danger'
                        }
                      >
                        {withdrawal.status === 'completed' ? 'אושר' :
                         withdrawal.status === 'pending' ? 'ממתין' :
                         'נדחה'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">סכום:</p>
                        <p className="font-bold text-lg text-green-600">₪{withdrawal.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">תאריך בקשה:</p>
                        <p className="font-medium">{withdrawal.requestedAt}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                  <p className="font-semibold text-gray-900 mb-2">פרטי בנק:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600">בנק: </span>
                      <span className="font-medium">{withdrawal.bankName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">סניף: </span>
                      <span className="font-medium">{withdrawal.bankBranch || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">חשבון: </span>
                      <span className="font-medium">{withdrawal.bankAccount || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">בעל החשבון: </span>
                      <span className="font-medium">{withdrawal.bankAccountHolder || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions for pending withdrawals */}
                {withdrawal.status === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(withdrawal.id)}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      אשר משיכה
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedWithdrawal(withdrawal);
                        setShowRejectModal(true);
                      }}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4" />
                      דחה
                    </Button>
                  </div>
                )}

                {/* Show approval/rejection info */}
                {withdrawal.status === 'completed' && withdrawal.approvedAt && (
                  <div className="bg-green-50 p-2 rounded text-xs text-green-700 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    אושר בתאריך: {withdrawal.approvedAt}
                  </div>
                )}

                {withdrawal.status === 'failed' && withdrawal.rejectionReason && (
                  <div className="bg-red-50 p-2 rounded text-xs text-red-700">
                    <p className="font-semibold mb-1">סיבת דחייה:</p>
                    <p>{withdrawal.rejectionReason}</p>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">אין בקשות משיכה</p>
            </div>
          </Card>
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedWithdrawal(null);
          setRejectReason('');
        }}
        title="דחיית בקשת משיכה"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            נא להזין סיבת דחייה עבור {selectedWithdrawal?.messengerName}
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סיבת דחייה
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
              placeholder="לדוגמא: פרטי בנק שגויים, יתרה לא מספיקה..."
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
              }}
              disabled={actionLoading}
            >
              ביטול
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              loading={actionLoading}
            >
              <XCircle className="h-4 w-4" />
              דחה בקשה
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

