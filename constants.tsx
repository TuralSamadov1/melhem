
import { CaseStatus, ContentTone, UserRole, ClinicalCase, User } from './types';

export const INITIAL_CASES: ClinicalCase[] = [
  {
    id: '1',
    doctorId: 'doc1',
    doctorName: 'Dr. Leyla Əliyeva',
    title: 'Uğurlu Laparoskopik Cərrahiyyə',
    category: 'Ginekologiya',
    shortDescription: '30 yaşlı pasiyentdə kista xaric edilməsi.',
    patientProblem: 'Pasiyent kəskin ağrılarla müraciət etmişdi.',
    treatmentProcess: 'Laparoskopik üsulla minimal kəsiklə kista təmizləndi.',
    result: 'Pasiyent 24 saat sonra evə yazıldı.',
    tone: ContentTone.EDUCATIONAL,
    isAnonymous: true,
    isSuitableForSharing: true,
    status: CaseStatus.NEW,
    createdAt: new Date().toISOString(),
    media: [{ url: 'https://picsum.photos/seed/surgery/800/600', type: 'image' }]
  },
  {
    id: '2',
    doctorId: 'doc2',
    doctorName: 'Dr. Emil Qasımov',
    title: 'Uşaq Diş Müalicəsində Yeni Metod',
    category: 'Stomatologiya',
    shortDescription: 'Ağrısız uşaq diş müalicəsi təcrübəsi.',
    patientProblem: 'Uşaqda diş həkimi qorxusu və çürük dişlər.',
    treatmentProcess: 'Sedasiya altında tam ağrısız bərpa.',
    result: 'Uşaq heç bir travma almadan müalicə olundu.',
    tone: ContentTone.MOTIVATIONAL,
    isAnonymous: false,
    isSuitableForSharing: true,
    status: CaseStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    media: [{ url: 'https://picsum.photos/seed/dentist/800/600', type: 'image' }],
    publishedResult: {
      type: 'link',
      content: 'https://instagram.com/melhem_hospital',
      caption: 'Bu keys artıq rəsmi Instagram səhifəmizdə trendə çevrilib!'
    }
  }
];

export const MOCK_DOCTOR: User = {
  id: 'doc1',
  name: 'Dr. Leyla Əliyeva',
  role: UserRole.DOCTOR,
  specialty: 'Ginekoloq-Cərrah',
  casesCount: 12
};

export const MOCK_MARKETING: User = {
  id: 'mkt1',
  name: 'Aysel Məmmədova',
  role: UserRole.MARKETING,
  casesCount: 45
};
