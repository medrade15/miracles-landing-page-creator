
export interface SectionContent {
  id: string;
  type: 'text' | 'video' | 'button' | 'heading';
  content: string;
  icon?: string;
  subContent?: string;
}

export interface AppState {
  title: string;
  coverImage: string;
  sections: SectionContent[];
}
