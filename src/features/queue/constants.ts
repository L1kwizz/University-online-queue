export const PURPOSES = [
  'Получение справки с места учёбы',
  'Транскрипт и академическая справка',
  'Подписание обходного листа',
  'Перевод и восстановление',
  'Академическая задолженность',
  'Академический отпуск',
  'Регистрация дисциплин',
] as const

export const TICKET_STATUSES = ['waiting', 'called', 'completed', 'skipped', 'cancelled'] as const

export const DEPARTMENTS = [
  {
    code: 'tech',
    name: 'Деканат технических направлений',
    ticketPrefix: 'Т',
    ticketNumberStart: 100,
    building: 'Корпус A',
    floor: 1,
  },
  {
    code: 'hum',
    name: 'Деканат гуманитарных направлений',
    ticketPrefix: 'Г',
    ticketNumberStart: 200,
    building: 'Корпус B',
    floor: 2,
  },
] as const

export const COUNTERS = {
  tech: [
    { name: 'Окно 01', number: 1, staffName: 'Смагулов А.Б.' },
    { name: 'Окно 02', number: 2, staffName: 'Ержанова А.М.' },
  ],
  hum: [
    { name: 'Окно 03', number: 3, staffName: 'Ахметова Г.К.' },
    { name: 'Окно 04', number: 4, staffName: 'Токтарова С.Н.' },
  ],
} as const

export const DEMO_ACCOUNTS = [
  {
    email: 'student.tech@university.kz',
    password: 'Tech-Student-2026',
    name: 'Темирлан Оспанов',
    role: 'student',
    departmentCode: 'tech',
    subtitle: 'ИС-23-2 · 3 курс',
    initials: 'ТО',
    label: 'Студент · Технический',
  },
  {
    email: 'student.hum@university.kz',
    password: 'Hum-Student-2026',
    name: 'Аружан Серикова',
    role: 'student',
    departmentCode: 'hum',
    subtitle: 'Право-23-1 · 2 курс',
    initials: 'АС',
    label: 'Студент · Гуманитарный',
  },
  {
    email: 'staff.tech@university.kz',
    password: 'Tech-Staff-2026',
    name: 'Айгүл Ержанова',
    role: 'staff',
    departmentCode: 'tech',
    subtitle: 'Главный специалист деканата ИТ',
    initials: 'АЕ',
    label: 'Деканат · Технический',
  },
  {
    email: 'staff.hum@university.kz',
    password: 'Hum-Staff-2026',
    name: 'Газиза Ахметова',
    role: 'staff',
    departmentCode: 'hum',
    subtitle: 'Специалист деканата гуманитарных направлений',
    initials: 'ГА',
    label: 'Деканат · Гуманитарный',
  },
] as const
