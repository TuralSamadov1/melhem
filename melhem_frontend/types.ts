
export enum UserRole {
  DOCTOR = 'Həkim',
  MARKETING = 'Marketinq'
}

export enum CaseStatus {
  NEW = 'Yeni',
  REVIEWED = 'Baxıldı',
  IN_PROGRESS = 'Hazırlanır',
  READY = 'Hazırdır',
  PUBLISHED = 'Paylaşıldı'
}

export enum ContentTone {
  EDUCATIONAL = 'Maarifləndirici',
  MOTIVATIONAL = 'Motivasiyaedici',
  PREMIUM = 'Premium İmic'
}

export interface CaseMedia {
  url: string;
  type: 'image' | 'video';
}

export interface PublishedResult {
  type: 'link' | 'image' | 'video' | 'text';
  content: string;
  caption?: string;
}

export interface ClinicalCase {
  id: string;
  doctorId: string;
  doctorName: string;
  title: string;
  category: string;
  shortDescription: string;
  patientProblem: string;
  treatmentProcess: string;
  result: string;
  tone: ContentTone;
  isAnonymous: boolean;
  isSuitableForSharing: boolean;
  status: CaseStatus;
  createdAt: string;
  media: CaseMedia[];
  publishedResult?: PublishedResult;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  degree?: string;
  specialty?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  website?: string;
  casesCount: number;
}

export interface Notification {
  id: string;
  recipientId: string | 'MARKETING_TEAM';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  caseId?: string;
  type: 'STATUS_CHANGE' | 'NEW_SUBMISSION';
}
