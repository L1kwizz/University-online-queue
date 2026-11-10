import type { CounterWindow, QueueTicket, User } from './types'

export const DEMO_USERS: Record<string, User & { password: string }> = {
  'student@university.kz': {
    email: 'student@university.kz',
    password: 'student123',
    name: 'Темирлан Оспанов',
    role: 'student',
    subtitle: 'ИС-23-2 · 3 курс',
    initials: 'ТО',
  },
  'teacher@university.kz': {
    email: 'teacher@university.kz',
    password: 'teacher123',
    name: 'Айгүл Ержанова',
    role: 'staff',
    subtitle: 'Главный специалист деканата',
    initials: 'АЕ',
  },
}

export const WINDOWS: CounterWindow[] = [
  { id: 1, name: 'Окно 01', staff: 'Смагулов А.Б.', directions: ['tech'] },
  { id: 2, name: 'Окно 02', staff: 'Ахметова Г.К.', directions: ['hum'] },
  { id: 3, name: 'Окно 03', staff: 'Ержанова А.М.', directions: ['tech', 'hum'] },
]

export const INITIAL_TICKETS: QueueTicket[] = [
  {
    id: 't-1',
    ticketNumber: 'Т-101',
    studentEmail: 'alihan@university.kz',
    studentName: 'Алихан Аскаров',
    purpose: 'Получение транскрипта',
    direction: 'tech',
    createdAt: '09:15',
    status: 'completed',
    windowNumber: 1,
  },
  {
    id: 't-2',
    ticketNumber: 'Г-201',
    studentEmail: 'aruzhan@university.kz',
    studentName: 'Аружан Серикова',
    purpose: 'Подписание обходного листа',
    direction: 'hum',
    createdAt: '09:22',
    status: 'completed',
    windowNumber: 2,
  },
  {
    id: 't-3',
    ticketNumber: 'Т-102',
    studentEmail: 'daniyar@university.kz',
    studentName: 'Данияр Нурланов',
    purpose: 'Академическая задолженность',
    direction: 'tech',
    createdAt: '09:34',
    status: 'called',
    windowNumber: 1,
  },
  {
    id: 't-4',
    ticketNumber: 'Г-202',
    studentEmail: 'madina@university.kz',
    studentName: 'Мадина Бекболатова',
    purpose: 'Академический отпуск',
    direction: 'hum',
    createdAt: '09:38',
    status: 'waiting',
  },
  {
    id: 't-5',
    ticketNumber: 'Т-103',
    studentEmail: 'adilet@university.kz',
    studentName: 'Адилет Кенжебек',
    purpose: 'Перевод на образовательный грант',
    direction: 'tech',
    createdAt: '09:45',
    status: 'waiting',
  },
  {
    id: 't-6',
    ticketNumber: 'Г-203',
    studentEmail: 'tomiris@university.kz',
    studentName: 'Томирис Жумагулова',
    purpose: 'Дубликат студенческого билета',
    direction: 'hum',
    createdAt: '09:50',
    status: 'waiting',
  },
  {
    id: 't-7',
    ticketNumber: 'Т-104',
    studentEmail: 'student@university.kz',
    studentName: 'Темирлан Оспанов',
    purpose: 'Регистрация дисциплин на летний семестр',
    direction: 'tech',
    createdAt: '09:55',
    status: 'waiting',
  },
]

export const PURPOSES = [
  'Получение справки с места учёбы',
  'Транскрипт и академическая справка',
  'Подписание обходного листа',
  'Перевод и восстановление',
  'Академическая задолженность',
  'Академический отпуск',
  'Регистрация дисциплин',
]
