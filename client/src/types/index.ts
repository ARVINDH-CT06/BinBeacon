export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'resident' | 'collector' | 'authority';
}

export interface Resident {
  id: string;
  userId: string;
  doorNumber: string;
  address: string;
  beaconScore: number;
  isAvailable: boolean;
}

export interface Collector {
  id: string;
  userId: string;
  employeeId: string;
  areaAssigned: string;
  collectionProgress: number;
}

export interface Authority {
  id: string;
  userId: string;
  authorityName: string;
  employeeId: string;
  email: string;
}

export interface CollectionHistory {
  id: string;
  residentId: string;
  collectorId: string;
  wasteType: string;
  status: 'collected' | 'pending' | 'reported';
  collectionDate: Date;
}

export interface OverflowReport {
  id: string;
  residentId: string;
  overflowType: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'assigned' | 'resolved';
  assignedCollectorId?: string;
  reportedAt: Date;
}

export interface Tip {
  id: string;
  fromResidentId: string;
  toCollectorId: string;
  amount: number;
  sentAt: Date;
}

export interface Chat {
  id: string;
  senderId: string;
  receiverId?: string;
  message: string;
  chatType: 'private' | 'group';
  sentAt: Date;
}

export interface Feedback {
  id: string;
  residentId: string;
  collectorId: string;
  rating: number;
  comment?: string;
  submittedAt: Date;
}

export interface DistributeRequest {
  id: string;
  residentId: string;
  itemType: string;
  status: 'pending' | 'accepted' | 'ignored';
  requestedAt: Date;
}

export interface Broadcast {
  id: string;
  authorityId: string;
  message: string;
  targetAudience: 'all' | 'residents' | 'collectors';
  sentAt: Date;
}

export type Language = 'en' | 'hi' | 'ta' | 'or';

export interface AppContextType {
  user: User | null;
  profile: Resident | Collector | Authority | null;
  language: Language;
  isDarkMode: boolean;
  login: (user: User, profile: any) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
}
