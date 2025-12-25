import { useState } from 'react';
import { 
  UserPlus, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Search,
  Download,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Percent,
  Globe
} from 'lucide-react';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { AddMessengerModal } from '../../components/admin/AddMessengerModal';
import { EditMessengerModal } from '../../components/admin/EditMessengerModal';
import { MessengerDetailsModal } from '../../components/admin/MessengerDetailsModal';
import { EditLandingPageModal } from '../../components/admin/EditLandingPageModal';
import { useAdminMessengers } from '../../hooks/useAdminMessengers';
import type { MessengerWithStats } from '../../types';

export function Messengers() {
  const {
    messengers,
    stats,
    loading,
    error,
    fetchMessengers,
    createMessenger,
    updateMessenger,
    toggleMessengerStatus,
    checkSlugAvailability,
  } = useAdminMessengers();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | '18' | '30'>('all');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLandingPageModal, setShowLandingPageModal] = useState(false);
  const [selectedMessenger, setSelectedMessenger] = useState<MessengerWithStats | null>(null);

  const handleSearch = () => {
    fetchMessengers({
      search: searchTerm,
      status: statusFilter,
      planType: planFilter,
    });
  };

  const handleViewDetails = (messenger: MessengerWithStats) => {
    setSelectedMessenger(messenger);
    setShowDetailsModal(true);
  };

  const handleEdit = (messenger: MessengerWithStats) => {
    setSelectedMessenger(messenger);
    setShowEditModal(true);
  };

  const handleToggleStatus = async (messengerId: string) => {
    await toggleMessengerStatus(messengerId);
  };

  const handleEditLandingPage = (messenger: MessengerWithStats) => {
    setSelectedMessenger(messenger);
    setShowLandingPageModal(true);
  };

  if (loading && !messengers.length) {
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
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ניהול שליחים</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">ניהול מלא של כל השליחים במערכת</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          <StatsCard
            title="סה''כ שליחים"
            value={stats.total_messengers}
            icon={Users}
          />
          <StatsCard
            title="שליחים פעילים"
            value={stats.active_messengers}
            icon={Activity}
          />
          <StatsCard
            title="תורמים כוללים"
            value={stats.total_donors}
            icon={Users}
          />
          <StatsCard
            title="הכנסות החודש"
            value={`₪${stats.this_month_revenue.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatsCard
            title="סה''כ עמלות"
            value={`₪${stats.total_commissions_paid.toLocaleString()}`}
            icon={TrendingUp}
          />
        </div>
      )}

      {/* Add Messenger Button - Prominent */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">צירוף שליח חדש</h3>
            <p className="text-sm text-gray-600">הוסף שליח חדש למערכת בקלות ובמהירות</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            <UserPlus className="h-5 w-5" />
            <span className="font-semibold">צרף שליח חדש</span>
          </Button>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="חפש לפי שם, אימייל או slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setTimeout(handleSearch, 0);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="active">פעילים</option>
                <option value="inactive">מושהים</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => {
                  setPlanFilter(e.target.value as any);
                  setTimeout(handleSearch, 0);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">כל התוכניות</option>
                <option value="18">תוכנית 18</option>
                <option value="30">תוכנית 30</option>
              </select>

              <Button variant="secondary" size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>

              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">ייצוא</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Messengers Table */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">רשימת שליחים</h2>
            <Badge variant="info">{messengers.length} שליחים</Badge>
          </div>
        }
      >
        {messengers.length > 0 ? (
          <DataTable
            data={messengers}
            columns={[
              {
                key: 'full_name',
                header: 'שם',
                render: (item) => (
                  <div>
                    <p className="font-medium text-gray-900">{item.full_name}</p>
                    <p className="text-xs text-gray-500">/{item.landing_page_slug}</p>
                  </div>
                ),
              },
              {
                key: 'email',
                header: 'פרטי קשר',
                render: (item) => (
                  <div>
                    <p className="text-sm text-gray-900">{item.email}</p>
                    {item.phone && (
                      <p className="text-xs text-gray-500">{item.phone}</p>
                    )}
                  </div>
                ),
              },
              {
                key: 'plan_type',
                header: 'תוכנית',
                render: (item) => (
                  <Badge variant="info">{item.plan_type}</Badge>
                ),
              },
              {
                key: 'total_donors',
                header: 'תורמים',
                render: (item) => (
                  <span className="font-semibold text-indigo-600">{item.total_donors}</span>
                ),
              },
              {
                key: 'active_subscriptions',
                header: 'פעילים',
                render: (item) => (
                  <span className="font-medium">{item.active_subscriptions}</span>
                ),
              },
              {
                key: 'this_month_revenue',
                header: 'הכנסות החודש',
                render: (item) => (
                  <span className="font-semibold text-green-600">
                    ₪{item.this_month_revenue.toFixed(0)}
                  </span>
                ),
              },
              {
                key: 'commission_rate_one_time',
                header: 'עמלה',
                render: (item) => (
                  <span className="flex items-center gap-1 text-purple-600">
                    <Percent className="h-3 w-3" />
                    {item.commission_rate_one_time}%
                  </span>
                ),
              },
              {
                key: 'is_active',
                header: 'סטטוס',
                render: (item) => (
                  <Badge variant={item.is_active ? 'success' : 'danger'}>
                    {item.is_active ? 'פעיל' : 'מושהה'}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                header: 'פעולות',
                render: (item) => (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="צפייה"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="עריכה"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleEditLandingPage(item)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="ערוך דף נחיתה"
                    >
                      <Globe className="h-4 w-4 text-indigo-600" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title={item.is_active ? 'השהה' : 'הפעל'}
                    >
                      {item.is_active ? (
                        <Ban className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </button>
                  </div>
                ),
              },
            ]}
          />
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">אין שליחים במערכת</p>
            <p className="text-sm text-gray-400 mt-1">התחל בצירוף השליח הראשון</p>
          </div>
        )}
      </Card>

      {/* Modals */}
      <AddMessengerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={createMessenger}
        checkSlugAvailability={checkSlugAvailability}
      />

      <EditMessengerModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMessenger(null);
        }}
        messenger={selectedMessenger}
        onSubmit={updateMessenger}
        checkSlugAvailability={checkSlugAvailability}
      />

      <MessengerDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedMessenger(null);
        }}
        messenger={selectedMessenger}
        onToggleStatus={toggleMessengerStatus}
      />

      <EditLandingPageModal
        isOpen={showLandingPageModal}
        onClose={() => {
          setShowLandingPageModal(false);
          setSelectedMessenger(null);
        }}
        messenger={selectedMessenger}
      />
    </div>
  );
}

