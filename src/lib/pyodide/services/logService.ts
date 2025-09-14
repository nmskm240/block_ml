import { createId } from '@paralleldrive/cuid2';

import { Entry, ErrorContent, GraphContent, LogContent } from '../types';

type Listener = (entries: Entry[]) => void;

export class LogService {
  private entries: Entry[] = [];
  private listeners: Map<string, Set<Listener>> = new Map();

  subscribe(event: 'change', listener: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(listener);

    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  private notify(event: 'change'): void {
    this.listeners
      .get(event)
      ?.forEach((listener) => listener([...this.entries]));
  }

  getEntries(): Entry[] {
    return [...this.entries];
  }

  addLog(content: Omit<LogContent, 'type'>): void {
    this.entries.push({
      id: createId(),
      createdAt: new Date(),
      content: { type: 'log', ...content },
    });
    this.notify('change');
  }

  addGraph(content: Omit<GraphContent, 'type' | 'targetId'>): void {
    this.entries.push({
      id: createId(),
      createdAt: new Date(),
      content: { type: 'graph', targetId: createId(), ...content },
    });
    this.notify('change');
  }

  addError(content: Omit<ErrorContent, 'type'>): void {
    this.entries.push({
      id: createId(),
      createdAt: new Date(),
      content: { type: 'error', ...content },
    });
    this.notify('change');
  }

  clear(): void {
    this.entries = [];
    this.notify('change');
  }
}
