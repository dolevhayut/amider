import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { MessengerLandingPageData, LandingPageContent, UpdateLandingPageContent, ImpactItem, Testimonial, CustomSection } from '../types';
import type { Database } from '../types/database.types';

type LandingPageContentRow = Database['public']['Tables']['landing_page_content']['Row'];

// Helper function to convert database row to LandingPageContent
function convertRowToLandingPageContent(row: LandingPageContentRow): LandingPageContent {
  return {
    id: row.id,
    messenger_id: row.messenger_id,
    hero_title: row.hero_title,
    hero_subtitle: row.hero_subtitle ?? undefined,
    hero_description: row.hero_description ?? '',
    hero_image_url: row.hero_image_url ?? undefined,
    cta_primary_text: row.cta_primary_text ?? '',
    cta_secondary_text: row.cta_secondary_text ?? undefined,
    about_title: row.about_title ?? '',
    about_content: row.about_content ?? undefined,
    impact_title: row.impact_title ?? '',
    impact_items: (row.impact_items as ImpactItem[] | null) ?? [],
    testimonials: (row.testimonials as Testimonial[] | null) ?? [],
    custom_sections: (row.custom_sections as CustomSection[] | null) ?? [],
    theme_color: row.theme_color ?? '#A4832E',
    background_style: (row.background_style as 'light' | 'dark') ?? 'light',
    meta_title: row.meta_title ?? undefined,
    meta_description: row.meta_description ?? undefined,
    created_at: row.created_at ?? '',
    updated_at: row.updated_at ?? '',
  };
}

// Helper function to convert UpdateLandingPageContent to database update format
function convertUpdateToDbFormat(updates: UpdateLandingPageContent): Database['public']['Tables']['landing_page_content']['Update'] {
  const dbUpdate: Database['public']['Tables']['landing_page_content']['Update'] = {};
  
  if (updates.hero_title !== undefined) dbUpdate.hero_title = updates.hero_title;
  if (updates.hero_subtitle !== undefined) dbUpdate.hero_subtitle = updates.hero_subtitle ?? null;
  if (updates.hero_description !== undefined) dbUpdate.hero_description = updates.hero_description ?? null;
  if (updates.hero_image_url !== undefined) dbUpdate.hero_image_url = updates.hero_image_url ?? null;
  if (updates.cta_primary_text !== undefined) dbUpdate.cta_primary_text = updates.cta_primary_text ?? null;
  if (updates.cta_secondary_text !== undefined) dbUpdate.cta_secondary_text = updates.cta_secondary_text ?? null;
  if (updates.about_title !== undefined) dbUpdate.about_title = updates.about_title ?? null;
  if (updates.about_content !== undefined) dbUpdate.about_content = updates.about_content ?? null;
  if (updates.impact_title !== undefined) dbUpdate.impact_title = updates.impact_title ?? null;
  if (updates.impact_items !== undefined) dbUpdate.impact_items = updates.impact_items as any;
  if (updates.testimonials !== undefined) dbUpdate.testimonials = updates.testimonials as any;
  if (updates.custom_sections !== undefined) dbUpdate.custom_sections = updates.custom_sections as any;
  if (updates.theme_color !== undefined) dbUpdate.theme_color = updates.theme_color ?? null;
  if (updates.background_style !== undefined) dbUpdate.background_style = updates.background_style ?? null;
  if (updates.meta_title !== undefined) dbUpdate.meta_title = updates.meta_title ?? null;
  if (updates.meta_description !== undefined) dbUpdate.meta_description = updates.meta_description ?? null;
  
  return dbUpdate;
}

interface UseLandingPageReturn {
  data: MessengerLandingPageData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLandingPage(slug: string): UseLandingPageReturn {
  const [data, setData] = useState<MessengerLandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLandingPage = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get messenger by slug
      const { data: messengerData, error: messengerError } = await supabase
        .from('messengers')
        .select('id, user_id, landing_page_slug, custom_goal_text, plan_type, is_active')
        .eq('landing_page_slug', slug)
        .single();

      if (messengerError) throw messengerError;
      if (!messengerData) throw new Error('Messenger not found');
      if (!messengerData.is_active) throw new Error('This page is not available');

      // Get user info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', messengerData.user_id)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('User not found');

      // Get landing page content
      const { data: contentData, error: contentError } = await supabase
        .from('landing_page_content')
        .select('*')
        .eq('messenger_id', messengerData.id)
        .single();

      if (contentError) {
        // If no content exists, create default
        if (contentError.code === 'PGRST116') {
          const { data: newContent, error: createError } = await supabase
            .from('landing_page_content')
            .insert({
              messenger_id: messengerData.id,
              hero_description: messengerData.custom_goal_text || 'הצטרפו למעגל הלקוחות והשותפים שלי',
            })
            .select()
            .single();

          if (createError) throw createError;
          if (!newContent) throw new Error('Failed to create content');
          
          setData({
            messenger: {
              id: messengerData.id,
              full_name: userData.full_name,
              landing_page_slug: messengerData.landing_page_slug,
              custom_goal_text: messengerData.custom_goal_text ?? undefined,
              plan_type: messengerData.plan_type,
            },
            content: convertRowToLandingPageContent(newContent),
          });
        } else {
          throw contentError;
        }
      } else {
        if (!contentData) throw new Error('Content not found');
        
        setData({
          messenger: {
            id: messengerData.id,
            full_name: userData.full_name,
            landing_page_slug: messengerData.landing_page_slug,
            custom_goal_text: messengerData.custom_goal_text ?? undefined,
            plan_type: messengerData.plan_type,
          },
          content: convertRowToLandingPageContent(contentData),
        });
      }
    } catch (err) {
      console.error('Error fetching landing page:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'object' && err !== null && 'message' in err
        ? String(err.message)
        : 'Failed to load page';
      
      // Log more details for debugging
      if (err instanceof Error && 'code' in err) {
        console.error('Error code:', (err as any).code);
        console.error('Error details:', (err as any).details);
        console.error('Error hint:', (err as any).hint);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchLandingPage();
    }
  }, [slug]);

  return {
    data,
    loading,
    error,
    refetch: fetchLandingPage,
  };
}

interface UseAdminLandingPageReturn {
  content: LandingPageContent | null;
  loading: boolean;
  error: string | null;
  updateContent: (updates: UpdateLandingPageContent) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

export function useAdminLandingPage(messengerId: string): UseAdminLandingPageReturn {
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('landing_page_content')
        .select('*')
        .eq('messenger_id', messengerId)
        .single();

      if (fetchError) {
        // If no content exists, create default
        if (fetchError.code === 'PGRST116') {
          const { data: newContent, error: createError } = await supabase
            .from('landing_page_content')
            .insert({ messenger_id: messengerId })
            .select()
            .single();

          if (createError) throw createError;
          if (!newContent) throw new Error('Failed to create content');
          setContent(convertRowToLandingPageContent(newContent));
        } else {
          throw fetchError;
        }
      } else {
        if (!data) throw new Error('Content not found');
        setContent(convertRowToLandingPageContent(data));
      }
    } catch (err) {
      console.error('Error fetching landing page content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (updates: UpdateLandingPageContent): Promise<{ success: boolean; error?: string }> => {
    try {
      const dbUpdates = convertUpdateToDbFormat(updates);
      const { error: updateError } = await supabase
        .from('landing_page_content')
        .update(dbUpdates)
        .eq('messenger_id', messengerId);

      if (updateError) throw updateError;

      // Refresh content
      await fetchContent();

      return { success: true };
    } catch (err) {
      console.error('Error updating landing page content:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update content',
      };
    }
  };

  useEffect(() => {
    if (messengerId) {
      fetchContent();
    }
  }, [messengerId]);

  return {
    content,
    loading,
    error,
    updateContent,
    refetch: fetchContent,
  };
}

