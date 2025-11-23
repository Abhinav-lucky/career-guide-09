export interface Certificate {
  name: string;
  type: 'required' | 'optional';
}

export interface Link {
  name: string;
  url: string;
  platform: 'YouTube' | 'Udemy' | 'Coursera' | 'Unacademy' | 'Other';
  type: 'free' | 'paid';
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
}

export interface Job {
  id: string;
  name: string;
  icon: string;
  sectorId: string;
  description: string;
  detailedDescription: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  roadmap: RoadmapStep[];
  certificates: Certificate[];
  links: Link[];
}

export interface Sector {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradient: {
    from: string;
    to: string;
  };
}

export interface FilterOptions {
  skills: string[];
  salaryRange: [number, number];
  difficulty: ('beginner' | 'intermediate' | 'advanced')[];
}

export type SortOption = 'alphabetical-asc' | 'alphabetical-desc' | 'most-viewed';
