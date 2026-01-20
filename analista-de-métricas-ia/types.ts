
export interface Metric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface Report {
  title: string;
  summary: string;
  metrics: Metric[];
  actionItems: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type ReportType = 'commercial' | 'editorial';
