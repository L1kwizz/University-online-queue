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
