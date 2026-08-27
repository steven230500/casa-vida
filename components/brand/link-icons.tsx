import { Globe, Mail, Phone } from 'lucide-react'
import {
  SiInstagram,
  SiWhatsapp,
  SiFacebook,
  SiYoutube,
  SiTiktok,
  SiSpotify,
  SiTelegram,
  SiX,
  SiThreads,
} from 'react-icons/si'
import type { LinkIcon } from '@/lib/data'

export const LINK_ICONS: Record<LinkIcon, React.ComponentType<{ className?: string }>> = {
  instagram: SiInstagram,
  whatsapp: SiWhatsapp,
  facebook: SiFacebook,
  youtube: SiYoutube,
  tiktok: SiTiktok,
  spotify: SiSpotify,
  telegram: SiTelegram,
  x: SiX,
  threads: SiThreads,
  website: Globe,
  email: Mail,
  phone: Phone,
}

export const LINK_ICON_LABELS: Record<LinkIcon, string> = {
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  spotify: 'Spotify',
  telegram: 'Telegram',
  x: 'X (Twitter)',
  threads: 'Threads',
  website: 'Sitio web',
  email: 'Correo',
  phone: 'Teléfono',
}
