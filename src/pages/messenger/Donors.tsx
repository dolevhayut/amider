import { Users, Search, Filter, Download } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import { Input } from '../../components/shared/Input';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useMessengerData } from '../../hooks/useMessengerData';
import { useMessengerDonors } from '../../hooks/useMessengerDonors';
import { useState } from 'react';

export function MessengerDonors() {
  const { profile, loading: profileLoading } = useMessengerData();
  const { donors, loading: donorsLoading } = useMessengerDonors(profile?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'cancelled'>('all');

  const loading = profileLoading || donorsLoading;

  // Filter donors based on search and status
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || donor.subscriptionStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ניהול תורמים</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">רשימת כל התורמים שלך</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">סה"כ תורמים</p>
            <p className="text-2xl font-bold text-indigo-600">{donors.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">פעילים</p>
            <p className="text-2xl font-bold text-green-600">
              {donors.filter(d => d.subscriptionStatus === 'active').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">חודשיים</p>
            <p className="text-2xl font-bold text-blue-600">
              {donors.filter(d => d.subscriptionType === 'monthly').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">חד-פעמי</p>
            <p className="text-2xl font-bold text-purple-600">
              {donors.filter(d => d.subscriptionType === 'one_time').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="חפש לפי שם או אימייל..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="active">פעילים</option>
                <option value="cancelled">מבוטלים</option>
              </select>
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">ייצוא</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Donors Table */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">רשימת תורמים</h2>
            </div>
            <Badge variant="info">{filteredDonors.length} תוצאות</Badge>
          </div>
        }
      >
        {filteredDonors.length > 0 ? (
          <DataTable
            data={filteredDonors}
            columns={[
              { 
                key: 'name', 
                header: 'שם',
                render: (item) => (
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.phone && (
                      <p className="text-xs text-gray-500">{item.phone}</p>
                    )}
                  </div>
                )
              },
              { 
                key: 'email', 
                header: 'אימייל',
                render: (item) => (
                  <span className="text-sm text-gray-600">{item.email}</span>
                )
              },
              {
                key: 'subscriptionType',
                header: 'סוג מנוי',
                render: (item) => (
                  <Badge variant={item.subscriptionType === 'monthly' ? 'success' : 'info'}>
                    {item.subscriptionType === 'monthly' ? 'חודשי' : 'חד-פעמי'}
                  </Badge>
                ),
              },
              {
                key: 'subscriptionStatus',
                header: 'סטטוס',
                render: (item) => {
                  const statusConfig = {
                    active: { variant: 'success' as const, label: 'פעיל' },
                    cancelled: { variant: 'danger' as const, label: 'בוטל' },
                    pending: { variant: 'warning' as const, label: 'ממתין' },
                    failed: { variant: 'danger' as const, label: 'נכשל' },
                  };
                  const config = statusConfig[item.subscriptionStatus];
                  return <Badge variant={config.variant}>{config.label}</Badge>;
                },
              },
              { 
                key: 'joinDate', 
                header: 'תאריך הצטרפות',
                render: (item) => (
                  <span className="text-sm text-gray-600">{item.joinDate}</span>
                )
              },
              {
                key: 'nextPaymentDate',
                header: 'תשלום הבא',
                render: (item) => (
                  <span className="text-sm text-gray-600">
                    {item.nextPaymentDate || '-'}
                  </span>
                ),
              },
            ]}
          />
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">לא נמצאו תורמים</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-1">נסה לשנות את החיפוש</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

