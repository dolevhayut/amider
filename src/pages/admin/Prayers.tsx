import { Heart, Search, Download, TrendingUp, CheckCircle } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { Input } from '../../components/shared/Input';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useAdminPrayers } from '../../hooks/useAdminPrayers';
import { useState } from 'react';

export function AdminPrayers() {
  const { prayers, loading, error } = useAdminPrayers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'archived'>('all');

  // Filter prayers based on search and status
  const filteredPrayers = prayers.filter(prayer => {
    const matchesSearch = prayer.prayerSubjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.prayerIntention.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.messengerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || prayer.status === filterStatus;
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ניהול תפילות</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">כל התפילות במערכת מכל השליחים</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">סה"כ תפילות</p>
            <p className="text-2xl font-bold text-indigo-600">{prayers.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">פעילות</p>
            <p className="text-2xl font-bold text-green-600">
              {prayers.filter(p => p.status === 'active').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">הושלמו</p>
            <p className="text-2xl font-bold text-blue-600">
              {prayers.filter(p => p.status === 'completed').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">בארכיון</p>
            <p className="text-2xl font-bold text-gray-600">
              {prayers.filter(p => p.status === 'archived').length}
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
                  placeholder="חפש לפי שם, כוונה, לקוח או שליח..."
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
                <option value="active">פעילות</option>
                <option value="completed">הושלמו</option>
                <option value="archived">בארכיון</option>
              </select>
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">ייצוא</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Prayers List */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">רשימת תפילות</h2>
            </div>
            <Badge variant="info">{filteredPrayers.length} תוצאות</Badge>
          </div>
        }
      >
        {filteredPrayers.length > 0 ? (
          <div className="space-y-3">
            {filteredPrayers.map((prayer) => (
              <div key={prayer.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <h3 className="font-semibold text-gray-900">{prayer.prayerSubjectName}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{prayer.prayerIntention}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>לקוח:</span>
                            <span className="font-medium text-gray-700">{prayer.memberName}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-indigo-500" />
                            <span>שליח:</span>
                            <span className="font-medium text-indigo-600">{prayer.messengerName}</span>
                          </div>
                          <span>•</span>
                          <span>נשלח: {prayer.submittedAt}</span>
                          {prayer.completedAt && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>הושלם: {prayer.completedAt}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {prayer.status === 'active' && (
                          <Badge variant="success">פעיל</Badge>
                        )}
                        {prayer.status === 'completed' && (
                          <Badge variant="info">הושלם</Badge>
                        )}
                        {prayer.status === 'archived' && (
                          <Badge variant="default">בארכיון</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">לא נמצאו תפילות</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-1">נסה לשנות את החיפוש</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

