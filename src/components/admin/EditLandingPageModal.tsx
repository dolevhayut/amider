import { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Save, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useAdminLandingPage } from '../../hooks';
import type { MessengerWithStats, ImpactItem } from '../../types';

interface EditLandingPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  messenger: MessengerWithStats | null;
}

export function EditLandingPageModal({ isOpen, onClose, messenger }: EditLandingPageModalProps) {
  const { content, loading, updateContent } = useAdminLandingPage(messenger?.id || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'impact' | 'design'>('hero');

  // Form state
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    cta_primary_text: '',
    cta_secondary_text: '',
    about_title: '',
    about_content: '',
    impact_title: '',
    theme_color: '#A4832E',
    background_style: 'gradient' as 'light' | 'dark' | 'gradient',
  });

  const [impactItems, setImpactItems] = useState<ImpactItem[]>([]);

  useEffect(() => {
    if (content) {
      setFormData({
        hero_title: content.hero_title,
        hero_subtitle: content.hero_subtitle || '',
        hero_description: content.hero_description,
        cta_primary_text: content.cta_primary_text,
        cta_secondary_text: content.cta_secondary_text || '',
        about_title: content.about_title,
        about_content: content.about_content || '',
        impact_title: content.impact_title,
        theme_color: content.theme_color,
        background_style: content.background_style,
      });
      setImpactItems(content.impact_items || []);
    }
  }, [content]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddImpactItem = () => {
    setImpactItems(prev => [...prev, { icon: '✨', title: '', description: '' }]);
  };

  const handleUpdateImpactItem = (index: number, field: keyof ImpactItem, value: string) => {
    setImpactItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveImpactItem = (index: number) => {
    setImpactItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const result = await updateContent({
      ...formData,
      impact_items: impactItems.filter(item => item.title && item.description),
    });

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'שגיאה בשמירת השינויים');
    }

    setSaving(false);
  };

  if (!messenger) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`עריכת דף נחיתה - ${messenger.full_name}`}
      size="large"
    >
      <div className="space-y-6">
        {/* Preview Link */}
        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
          <span className="text-sm text-gray-700">
            דף נחיתה: <span className="font-medium">ami-dar.co.il/m/{messenger.landing_page_slug}</span>
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(`/m/${messenger.landing_page_slug}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            תצוגה מקדימה
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'hero'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            הירו סקשן
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            אודות
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'impact'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            השפעה
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'design'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            עיצוב
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'hero' && (
            <>
              <Input
                label="כותרת ראשית"
                value={formData.hero_title}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                placeholder="תמיכה בתפילות וישועות"
              />

              <Input
                label="כותרת משנה (אופציונלי)"
                value={formData.hero_subtitle}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                placeholder="הצטרפו למעגל התורמים"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור
                </label>
                <textarea
                  value={formData.hero_description}
                  onChange={(e) => handleChange('hero_description', e.target.value)}
                  placeholder="תיאור מפורט..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <Input
                label="טקסט כפתור ראשי"
                value={formData.cta_primary_text}
                onChange={(e) => handleChange('cta_primary_text', e.target.value)}
                placeholder="תרמו עכשיו"
              />

              <Input
                label="טקסט כפתור משני (אופציונלי)"
                value={formData.cta_secondary_text}
                onChange={(e) => handleChange('cta_secondary_text', e.target.value)}
                placeholder="למידע נוסף"
              />
            </>
          )}

          {activeTab === 'about' && (
            <>
              <Input
                label="כותרת סקשן"
                value={formData.about_title}
                onChange={(e) => handleChange('about_title', e.target.value)}
                placeholder="מי אני?"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תוכן
                </label>
                <textarea
                  value={formData.about_content}
                  onChange={(e) => handleChange('about_content', e.target.value)}
                  placeholder="ספר על עצמך..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {activeTab === 'impact' && (
            <>
              <Input
                label="כותרת סקשן"
                value={formData.impact_title}
                onChange={(e) => handleChange('impact_title', e.target.value)}
                placeholder="כל תרומה עושה הבדל"
              />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    נקודות השפעה
                  </label>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddImpactItem}
                  >
                    <Plus className="h-4 w-4" />
                    הוסף נקודה
                  </Button>
                </div>

                <div className="space-y-3">
                  {impactItems.map((item, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Input
                          label="אייקון"
                          value={item.icon}
                          onChange={(e) => handleUpdateImpactItem(index, 'icon', e.target.value)}
                          placeholder="✨"
                          className="w-20"
                        />
                        <div className="flex-1">
                          <Input
                            label="כותרת"
                            value={item.title}
                            onChange={(e) => handleUpdateImpactItem(index, 'title', e.target.value)}
                            placeholder="כותרת"
                          />
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRemoveImpactItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <textarea
                          value={item.description}
                          onChange={(e) => handleUpdateImpactItem(index, 'description', e.target.value)}
                          placeholder="תיאור..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}

                  {impactItems.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-6">
                      לא הוגדרו נקודות השפעה. לחץ על "הוסף נקודה" להתחלה.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'design' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  צבע ראשי
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.theme_color}
                    onChange={(e) => handleChange('theme_color', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={formData.theme_color}
                    onChange={(e) => handleChange('theme_color', e.target.value)}
                    placeholder="#A4832E"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  צבע ברירת מחדל: #A4832E (זהב) | צבע משני: #253B49 (נייבי)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סגנון רקע
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'gradient'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => handleChange('background_style', style)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.background_style === style
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {style === 'light' && 'בהיר'}
                        {style === 'dark' && 'כהה'}
                        {style === 'gradient' && 'גרדיאנט'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            ביטול
          </Button>

          <Button
            onClick={handleSave}
            loading={saving || loading}
          >
            <Save className="h-4 w-4" />
            שמור שינויים
          </Button>
        </div>
      </div>
    </Modal>
  );
}

