import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type SubscriptionCallback<T> = (payload: {
  new: T;
  old: T;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}) => void;

export function useRealtimeSubscription<T>(
  table: string,
  callback: SubscriptionCallback<T>
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Create and subscribe to the channel
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          callback({
            new: payload.new as T,
            old: payload.old as T,
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          });
        }
      )
      .subscribe();

    setChannel(channel);

    // Cleanup subscription
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, callback]);

  return channel;
}