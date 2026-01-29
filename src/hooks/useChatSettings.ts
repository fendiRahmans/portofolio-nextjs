// useChatSettings - Manage AI chat settings (admin only)
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { ChatSettings } from '@/types/chat';

export function useChatSettings() {
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      } else {
        setError(data.error || 'Failed to fetch settings');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update settings
  const updateSettings = useCallback(
    async (updates: Partial<Omit<ChatSettings, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setIsSaving(true);
      setError(null);

      try {
        const response = await fetch('/api/chat/settings', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (data.success) {
          setSettings(data.data);
          return true;
        } else {
          setError(data.error || 'Failed to update settings');
          return false;
        }
      } catch (err) {
        console.error('Error updating settings:', err);
        setError('Failed to update settings');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  // Toggle AI
  const toggleAI = useCallback(
    async (enabled: boolean) => {
      return updateSettings({ aiEnabled: enabled });
    },
    [updateSettings]
  );

  // Update AI model
  const updateAIModel = useCallback(
    async (model: string) => {
      return updateSettings({ aiModel: model });
    },
    [updateSettings]
  );

  // Update temperature
  const updateTemperature = useCallback(
    async (temperature: number) => {
      return updateSettings({ aiTemperature: temperature });
    },
    [updateSettings]
  );

  // Update system prompt
  const updateSystemPrompt = useCallback(
    async (prompt: string) => {
      return updateSettings({ systemPrompt: prompt });
    },
    [updateSettings]
  );

  // Initial fetch
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    fetchSettings,
    updateSettings,
    toggleAI,
    updateAIModel,
    updateTemperature,
    updateSystemPrompt,
  };
}
