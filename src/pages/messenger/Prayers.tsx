import { Heart, CheckCircle, Archive, Filter } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useMessengerData } from '../../hooks/useMessengerData';
import { useMessengerPrayers } from '../../hooks/useMessengerPrayers';
import { useState } from 'react';

export function MessengerPrayers() {
  const { profile, loading: profileLoading } = useMessengerData();
  const { prayers, loading: prayersLoading, markPrayerCompleted } = useMessengerPrayers(profile?.id);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [completingId, setCompletingId] = useState<string | null>(null);

  const loading = profileLoading || prayersLoading;

  const filteredPrayers = prayers.filter(prayer => {
    if (filterStatus === 'all') return true;
    return prayer.status === filterStatus;
  });

  const handleMarkCompleted = async (prayerId: string) => {
    setCompletingId(prayerId);
    await markPrayerCompleted(prayerId);
    setCompletingId(null);
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

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">רשימת תפילות</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">כל התפילות שהתקבלו מהתורמים שלך</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">כל התפילות</option>
            <option value="active">פעילות</option>
            <option value="completed">הושלמו</option>
          </select>
          <Badge variant="info">{filteredPrayers.length} תוצאות</Badge>
        </div>
      </Card>

      {/* Prayers List */}
      <div className="space-y-3">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map((prayer) => (
            <Card key={prayer.id}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <h3 className="font-semibold text-gray-900">{prayer.prayerSubjectName}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{prayer.prayerIntention}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>מאת: {prayer.memberName}</span>
                        <span>•</span>
                        <span>נשלח: {prayer.submittedAt}</span>
                        {prayer.completedAt && (
                          <>
                            <span>•</span>
                            <span>הושלם: {prayer.completedAt}</span>
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
                        <Badge variant="secondary">בארכיון</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {prayer.status === 'active' && (
                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleMarkCompleted(prayer.id)}
                      disabled={completingId === prayer.id}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{completingId === prayer.id ? 'מעדכן...' : 'סמן כהושלם'}</span>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">אין תפילות להצגה</p>
              {filterStatus !== 'all' && (
                <p className="text-sm text-gray-400 mt-1">נסה לשנות את הסינון</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

