/**
 * Central content source for Casa Vida.
 * Fully typed and easy to swap for a CMS later — every page reads from here.
 */

export const church = {
  name: 'Casa Vida',
  city: 'Cartagena',
  country: 'Colombia',
  tagline: 'Aquí hay lugar para ti',
  address: 'Manga, Cra 22 #29 — 2do Piso, Cartagena, Colombia',
  neighborhood: 'Manga',
  mapsQuery: 'Manga, Cra 22 %2329, Cartagena, Colombia',
  phone: '+57 301 2599057',
  email: 'casavidacorreo@gmail.com',
  bank: {
    name: 'Bancolombia',
    type: 'Cuenta de ahorros',
    number: '78900008356',
    holder: 'Fundación Casa Vida',
    nit: '902002497',
    breBKey: '0090988965',
  },
} as const

export type Social = {
  label: string
  handle: string
  href: string
  description: string
  platform: 'instagram' | 'youtube' | 'whatsapp'
}

export const socials: Social[] = [
  {
    label: 'Instagram',
    handle: '@casavidactg',
    href: 'https://instagram.com/casavidactg',
    description: 'Momentos de la comunidad, anuncios y frases de la semana.',
    platform: 'instagram',
  },
  {
    label: 'YouTube',
    handle: '@casavidatv',
    href: 'https://youtube.com/@casavidatv',
    description: 'Prédicas completas, adoración y transmisiones en vivo.',
    platform: 'youtube',
  },
  {
    label: 'Canal de WhatsApp',
    handle: 'Casa Vida',
    href: 'https://whatsapp.com/channel/0029VafmGVF2f3EMMBIqLt0n',
    description: 'Recordatorios de servicios, oración y avisos importantes.',
    platform: 'whatsapp',
  },
]

export const nav = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Visita', href: '/visita' },
  { label: 'Cita', href: '/cita' },
  { label: 'Ofrenda', href: '/ofrenda' },
]

export const linkIconKeys = [
  'instagram',
  'whatsapp',
  'facebook',
  'youtube',
  'tiktok',
  'spotify',
  'telegram',
  'x',
  'threads',
  'website',
  'email',
  'phone',
] as const
export type LinkIcon = (typeof linkIconKeys)[number]

export type Link = {
  title: string
  url: string
  icon: LinkIcon
  active: boolean
}

export type ServiceTime = {
  day: string
  time: string
  title: string
  description: string
  active: boolean
}

export const serviceTimes: ServiceTime[] = [
  {
    day: 'Domingos',
    time: '10:00 a.m.',
    title: 'Servicio',
    description:
      'Nuestra reunión central: adoración, palabra y comunidad para toda la familia.',
    active: true,
  },
  {
    day: 'Sábados',
    time: '5:00 p.m.',
    title: 'Jóvenes',
    description:
      'Un espacio para adolescentes y jóvenes: música, charlas y amistades reales.',
    active: true,
  },
]

export const values = [
  {
    title: 'Fe viva',
    description:
      'Creemos en un Dios cercano que transforma la vida cotidiana, no solo los domingos.',
    icon: 'flame',
  },
  {
    title: 'Familia',
    description:
      'Nadie camina solo. Somos una casa con puertas abiertas para cada generación.',
    icon: 'home',
  },
  {
    title: 'Servicio',
    description:
      'Amamos a Cartagena con hechos: cada ministerio existe para llevar esperanza a la ciudad.',
    icon: 'heart',
  },
]

export type Ministry = {
  slug: string
  name: string
  short: string
  description: string
  schedule: string
  audience: string
  image: string
  gallery: string[]
}

export const ministries: Ministry[] = [
  {
    slug: 'servicio-dominical',
    name: 'Servicio dominical',
    short: 'Adoración y palabra para toda la familia.',
    description:
      'El corazón de nuestra semana. Un tiempo de adoración, enseñanza bíblica y encuentro con Dios y con otros. Llega unos minutos antes para tomar un café y conocer a alguien nuevo.',
    schedule: 'Domingos 10:00 a.m.',
    audience: 'Toda la familia',
    image: '/images/real-worship.jpg',
    gallery: ['/images/real-hero.jpg', '/images/gallery-worship.png'],
  },
  {
    slug: 'jovenes',
    name: 'Jóvenes',
    short: 'Una generación encendida por la fe.',
    description:
      'Adolescentes y jóvenes que quieren vivir su fe con autenticidad. Música, charlas honestas, juegos y grupos pequeños donde caben tus preguntas.',
    schedule: 'Sábados 5:00 p.m.',
    audience: '12 a 25 años',
    image: '/images/real-jovenes.jpg',
    gallery: ['/images/gallery-youth.png'],
  },
  {
    slug: 'discipulado',
    name: 'Discipulado',
    short: 'Crece en grupos pequeños durante la semana.',
    description:
      'Grupos que se reúnen en casas por toda la ciudad para estudiar la Biblia, orar y hacer vida juntos. El mejor lugar para pasar de visitante a familia.',
    schedule: 'Entre semana · varios horarios',
    audience: 'Adultos y jóvenes',
    image: '/images/ministry-discipleship.png',
    gallery: [],
  },
  {
    slug: 'bautismos',
    name: 'Bautismos',
    short: 'Da el paso público de tu fe.',
    description:
      'El bautismo es una celebración de una nueva vida. Acompañamos a cada persona con una clase corta antes de dar este paso significativo.',
    schedule: 'Varias fechas al año',
    audience: 'Nuevos creyentes',
    image: '/images/real-bautismo-1.jpg',
    gallery: ['/images/real-bautismo-2.jpg'],
  },
  {
    slug: 'ninos',
    name: 'Niños',
    short: 'Un lugar seguro y divertido para los más pequeños.',
    description:
      'Mientras los adultos están en el servicio, los niños viven la fe a su manera: historias, canciones, juegos y mucho cuidado por parte de un equipo capacitado.',
    schedule: 'Domingos 10:00 a.m.',
    audience: '2 a 11 años',
    image: '/images/real-ninos.jpg',
    gallery: [],
  },
]

export type Sermon = {
  slug: string
  title: string
  speaker: string
  series?: string
  topic: string
  date: string // ISO
  youtubeId: string
  summary: string
  verses?: string[]
  thumbnail: string
}

/**
 * Real prédicas pulled from youtube.com/@CasaVidatv. This list is a manual
 * snapshot, not a live feed — update it as new sermons go up, or point
 * "Ver canal completo" straight at YouTube for anything not listed here.
 */
export const sermons: Sermon[] = [
  {
    slug: 'que-es-la-fe',
    title: '¿Qué es la fe?',
    speaker: 'Ps. Carlos Guardela',
    series: 'Casa Vida Cree',
    topic: 'Fe',
    date: '2026-07-22',
    youtubeId: 'CoN2USQRxKU',
    summary:
      '¿Qué es realmente la fe? ¿Una emoción, una convicción personal, o algo mucho más profundo? Una enseñanza de la serie Casa Vida Cree.',
    verses: ['Romanos 10'],
    thumbnail: 'https://i.ytimg.com/vi/CoN2USQRxKU/hqdefault.jpg',
  },
  {
    slug: 'comprometidos-familia-o-espectadores',
    title: 'Comprometidos: familia o espectadores',
    speaker: 'Ps. Carlos Guardela',
    series: 'Comprometidos',
    topic: 'Compromiso',
    date: '2026-07-01',
    youtubeId: 'N3F_8u-k5LI',
    summary:
      'El verdadero compromiso con la iglesia no se vive desde las gradas. Un mensaje sobre pasar de espectadores a familia, basado en Hechos 2:41.',
    verses: ['Hechos 2:41'],
    thumbnail: 'https://i.ytimg.com/vi/N3F_8u-k5LI/hqdefault.jpg',
  },
  {
    slug: 'matando-al-idolo',
    title: 'Matando al ídolo',
    speaker: 'Ps. Carlos Guardela',
    series: 'Casa Vida Adora',
    topic: 'Adoración',
    date: '2026-05-22',
    youtubeId: '3_2nXkASLLg',
    summary:
      'Dando inicio a la serie Casa Vida Adora, un mensaje sobre lo que realmente significa poner a Dios primero, basado en Génesis 22.',
    verses: ['Génesis 22'],
    thumbnail: 'https://i.ytimg.com/vi/3_2nXkASLLg/hqdefault.jpg',
  },
  {
    slug: 'resucito',
    title: 'Resucitó',
    speaker: 'Ps. Karina Torres',
    topic: 'Resurrección',
    date: '2026-04-06',
    youtubeId: 'MveFvc-y_MI',
    summary:
      'La verdad central de nuestra fe, proclamada con poder desde Marcos 16: Jesús resucitó, y eso lo cambia todo.',
    verses: ['Marcos 16:1-20'],
    thumbnail: 'https://i.ytimg.com/vi/MveFvc-y_MI/hqdefault.jpg',
  },
  {
    slug: 'permanecer',
    title: 'Permanecer',
    speaker: 'Ps. Karina Torres',
    topic: 'Discipulado',
    date: '2026-01-27',
    youtubeId: 'YqReIvS6i3U',
    summary:
      'Jesús se revela como la vid verdadera. Una enseñanza sobre lo que significa permanecer en Él para dar fruto de verdad, basada en Juan 15.',
    verses: ['Juan 15:1-8'],
    thumbnail: 'https://i.ytimg.com/vi/YqReIvS6i3U/hqdefault.jpg',
  },
]

export const youtubeChannel = 'https://youtube.com/@casavidatv'

export type ChurchEvent = {
  slug: string
  title: string
  date: string // ISO date
  time: string
  location: string
  category: string
  description: string
  image: string
  registration: boolean
}

// No placeholder events - real ones are created by staff in /admin/eventos.

export type TeamMember = {
  name: string
  role: string
  bio: string
  image: string
}

export const team: TeamMember[] = [
  {
    name: 'Carlos Guardela',
    role: 'Pastor principal',
    bio: 'Lidera Casa Vida con una pasión por una fe cercana y sencilla.',
    image: '/images/real-pastor.jpg',
  },
  {
    name: 'Karina Torres',
    role: 'Pastora',
    bio: 'Acompaña a las familias y lidera el ministerio de discipulado.',
    image: '/images/real-pastora.jpg',
  },
]

export const beliefs = [
  {
    title: 'La Biblia',
    content:
      'Creemos que la Biblia es la palabra inspirada de Dios y nuestra guía para la vida y la fe.',
  },
  {
    title: 'Dios',
    content:
      'Creemos en un solo Dios que se revela como Padre, Hijo y Espíritu Santo.',
  },
  {
    title: 'Jesús',
    content:
      'Creemos que Jesús es el Hijo de Dios, que murió y resucitó para reconciliarnos con el Padre.',
  },
  {
    title: 'La gracia',
    content:
      'Creemos que somos salvos por gracia, mediante la fe, y no por nuestros méritos.',
  },
  {
    title: 'La iglesia',
    content:
      'Creemos que la iglesia es una familia enviada a amar a Dios y servir a la ciudad.',
  },
]

export const timeline = [
  {
    year: '2022',
    title: 'Una inquietud de Dios',
    text: 'Dios habla a los pastores Carlos y Karina sobre la necesidad de alcanzar personas para Cristo desde sus propias esferas de influencia: la educación, el arte, lo social, las nuevas generaciones y la familia.',
  },
  {
    year: '2023',
    title: 'Comienza la plantación',
    text: 'En julio, después de años sirviendo en su iglesia anterior, los pastores dan el paso de comenzar a caminar hacia lo que hoy es Casa Vida.',
  },
  {
    year: '2026',
    title: 'Una casa que crece',
    text: 'Hoy seguimos caminando con el mismo corazón del comienzo: alcanzar, discipular y ver comunidades saludables que adoran.',
  },
]

export const vision =
  'Vemos hijos de Dios que adoran al Padre, comprometidos y unidos al cuerpo de Cristo, amando y sirviendo a la comunidad, que alcanzan y discipulan a los perdidos a través del evangelio de Jesucristo, hasta ver comunidades saludables que así mismo adoren.'

export const mission =
  'Ser y hacer discípulos de Jesús, caminando hacia la madurez espiritual, equipados para servir y transformar nuestra familia y entorno.'

export const marqueeWords = [
  'Comunidad',
  'Esperanza',
  'Familia',
  'Fe',
  'Cartagena',
  'Gracia',
  'Servicio',
  'Adoración',
]

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

