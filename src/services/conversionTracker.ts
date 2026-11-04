/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { safeStorage } from '../utils/safeStorage';

export type ConversionEventType = 
  | 'view_combo_page'
  | 'click_directions'
  | 'start_order'
  | 'apply_voucher'
  | 'order_completed'
  | 'packaging_feedback';

export interface ConversionEvent {
  id: string;
  type: ConversionEventType;
  timestamp: string;
  creatorRef?: string;
  orderCode?: string;
  details?: Record<string, any>;
}

const STORAGE_KEY = 'go_coffee_analytics_events';

export const trackConversion = (
  type: ConversionEventType,
  details?: Record<string, any>,
  creatorRef?: string
) => {
  try {
    const existingStr = safeStorage.getItem(STORAGE_KEY);
    const events: ConversionEvent[] = existingStr ? JSON.parse(existingStr) : [];

    const newEvent: ConversionEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      timestamp: new Date().toISOString(),
      creatorRef: creatorRef || getCreatorRefFromUrl() || undefined,
      details,
    };

    events.unshift(newEvent);
    // Keep last 150 events
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, 150)));

    // Send custom DOM event so UI can react in real time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('go_coffee_conversion_event', { detail: newEvent }));
    }
  } catch (err) {
    console.error('Failed to track conversion:', err);
  }
};

export const getConversionStats = () => {
  try {
    const existingStr = safeStorage.getItem(STORAGE_KEY);
    const events: ConversionEvent[] = existingStr ? JSON.parse(existingStr) : [];
    
    return {
      viewCombo: events.filter(e => e.type === 'view_combo_page').length,
      directions: events.filter(e => e.type === 'click_directions').length,
      startOrder: events.filter(e => e.type === 'start_order').length,
      applyVoucher: events.filter(e => e.type === 'apply_voucher').length,
      orderCompleted: events.filter(e => e.type === 'order_completed').length,
      feedback: events.filter(e => e.type === 'packaging_feedback').length,
      total: events.length,
      events,
    };
  } catch (e) {
    return {
      viewCombo: 0,
      directions: 0,
      startOrder: 0,
      applyVoucher: 0,
      orderCompleted: 0,
      feedback: 0,
      total: 0,
      events: [],
    };
  }
};

export const getCreatorRefFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('ref') || params.get('creator') || params.get('c') || params.get('utm_source');
};
