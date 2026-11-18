import type { Subject, SubjectId } from './types'

export const SUBJECTS: Subject[] = [
  {
    id: 'turkce',
    name: 'Türkçe Dünyası',
    short: 'Türkçe',
    tagline: 'Masal Ormanı ve Kitaplar Şehri',
    available: true,
    accent: '#f0504a',
    accentDark: '#b8302c',
    pastel: '#ffe3d9',
    icon: 'openbook',
    grades: [1, 2, 3, 4],
  },
  {
    id: 'matematik',
    name: 'Matematik Dünyası',
    short: 'Matematik',
    tagline: 'Sayılar Macera Parkı',
    available: true,
    accent: '#9b6ef3',
    accentDark: '#6b43c4',
    pastel: '#eadfff',
    icon: 'abacus',
    grades: [1, 2, 3, 4],
  },
  {
    id: 'fen',
    name: 'Fen Bilimleri Dünyası',
    short: 'Fen Bilimleri',
    tagline: 'Keşif Laboratuvarı',
    available: true,
    accent: '#2ec4c9',
    accentDark: '#149aa0',
    pastel: '#d4f6f4',
    icon: 'microscope',
    grades: [3, 4],
  },
  {
    id: 'hayat',
    name: 'Hayat Bilgisi Dünyası',
    short: 'Hayat Bilgisi',
    tagline: 'Mutlu Mahalle',
    available: true,
    accent: '#5bc236',
    accentDark: '#3a8f1d',
    pastel: '#dcf5d0',
    icon: 'housegarden',
    grades: [1, 2, 3],
  },
  {
    id: 'tarih',
    name: 'Keşif ve Tarih Dünyası',
    short: 'Sosyal Bilgiler',
    tagline: 'Sosyal Bilgiler · Zaman Makinesi Kalesi',
    available: true,
    accent: '#ff9a2e',
    accentDark: '#d8670b',
    pastel: '#ffe9cc',
    icon: 'castle',
    grades: [4],
  },
]

/** Bu ders seçilen sınıfta programda var mı? */
export const subjectOpenFor = (id: SubjectId, grade: number | null) => grade !== null && SUBJECTS.find((s) => s.id === id)!.grades.includes(grade as 1)

export const subjectById = (id: SubjectId) => SUBJECTS.find((s) => s.id === id)!
