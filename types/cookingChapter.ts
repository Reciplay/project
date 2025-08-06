export interface ChecklistItem {
  label: string;
  duration: string;
  note?: string;
  checked?: boolean;
}

export interface CookingChapter {
  step: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
  statusText: string;
  time: string;
  checklist: ChecklistItem[];
}
