import { Entry, LogType } from '../types';
import { createEntry } from '../utils';

type LogServiceEvent = 'change';

type Listener = (entries: Entry[]) => void;

export class LogService {
  private entries: Entry[] = [];
  private listeners: Record<LogServiceEvent, Set<Listener>> = {
    change: new Set(),
  };

  constructor() {}

  subscribe(event: LogServiceEvent, listener: Listener) {
    this.listeners[event].add(listener);
    return () => this.listeners[event].delete(listener); // unsubscribe
  }

  private emit(event: LogServiceEvent) {
    this.listeners[event].forEach((l) => l(this.entries));
  }

  append(message: string, type: LogType) {
    const entry = createEntry(message, type);
    const maxLines = Number.parseInt(process.env.NEXT_PUBLIC_MAX_LOG_LINES!);
    const trimmed =
      this.entries.length >= maxLines ? this.entries.slice(1) : this.entries;
    this.entries = [...trimmed, entry];
    this.emit('change');
  }

  clear() {
    this.entries = [];
    this.emit('change');
  }

  getEntries() {
    return this.entries;
  }
}
