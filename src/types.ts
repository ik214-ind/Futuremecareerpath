export interface StudentProfile {
  email: string;
  yearOfStudy: string;
  skills: string[];
  interests: string;
  targetCompanies: string[];
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface ActionItem {
  id: string;
  label: string;
  done: boolean;
}

export interface CareerPath {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  skillsToMaster: string[];
  projects: { title: string; description: string }[];
  milestones: Milestone[];
  first30Days: ActionItem[];
  demandScore: number;
  matchScore?: number;
}

export interface HackathonEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  city: string;
  theme: string;
  prizePool: string;
  participants: string;
  daysAway: number;
  tag: string;
  status: string;
  registrationUrl: string;
}

export interface AlumniMentor {
  id: string;
  name: string;
  company: string;
  role: string;
  bio: string;
  batch: string;
  expertise: string[];
  avatarColor: string;
  initials: string;
  linkedinUrl: string;
}

export interface JobMarketData {
  year: string;
  mlEngineer: number;
  dataEngineer: number;
  aiResearcher: number;
  mlOps: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export type PageId = 'profile' | 'dashboard' | 'alumni' | 'counselor';
