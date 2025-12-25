import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { MessengerLandingPageData, LandingPageContent, UpdateLandingPageContent } from '../types';

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
              hero_description: messengerData.custom_goal_text || 'הצטרפו למעגל התורמים והשותפים שלי',
            })
            .select()
            .single();

          if (createError) throw createError;
          
          setData({
            messenger: {
              id: messengerData.id,
              full_name: userData.full_name,
              landing_page_slug: messengerData.landing_page_slug,
              custom_goal_text: messengerData.custom_goal_text,
              plan_type: messengerData.plan_type,
            },
            content: newContent as LandingPageContent,
          });
        } else {
          throw contentError;
        }
      } else {
        setData({
          messenger: {
            id: messengerData.id,
            full_name: userData.full_name,
            landing_page_slug: messengerData.landing_page_slug,
            custom_goal_text: messengerData.custom_goal_text,
            plan_type: messengerData.plan_type,
          },
          content: contentData as LandingPageContent,
        });
      }
    } catch (err) {
      console.error('Error fetching landing page:', err);
      setError(err instanceof Error ? err.message : 'Failed to load page');
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
          setContent(newContent as LandingPageContent);
        } else {
          throw fetchError;
        }
      } else {
        setContent(data as LandingPageContent);
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
      const { error: updateError } = await supabase
        .from('landing_page_content')
        .update(updates)
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

