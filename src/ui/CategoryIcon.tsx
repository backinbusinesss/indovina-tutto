import {
  BadgeCheck,
  Castle,
  Coins,
  Droplets,
  Flag,
  Globe2,
  Heart,
  Landmark,
  type LucideIcon,
  Map as MapIcon,
  Mountain,
  Music,
  Palette,
  PawPrint,
  Rocket,
  ScrollText,
  Shuffle,
  Trophy,
  FlaskConical,
  Leaf,
  Car,
  Gamepad2,
  Building2,
  PartyPopper,
  Pizza,
  Goal,
  Zap,
  Lightbulb,
  Languages,
  Calculator,
  Tv,
  Users,
  UtensilsCrossed,
  Waves,
} from 'lucide-react'
import { categoryById } from '@/content/categories'
import type { Source } from '@/engine/types'
import { cx } from '@/lib/cx'

const ICONS: Record<string, LucideIcon> = {
  Flag,
  Landmark,
  Map: MapIcon,
  BadgeCheck,
  Globe2,
  Waves,
  Mountain,
  Droplets,
  Castle,
  Coins,
  UtensilsCrossed,
  Heart,
  PawPrint,
  ScrollText,
  FlaskConical,
  Rocket,
  Trophy,
  Palette,
  Music,
  Goal,
  Zap,
  Lightbulb,
  Languages,
  Calculator,
  Tv,
  Users,
  Leaf,
  Car,
  Gamepad2,
  Building2,
  PartyPopper,
  Pizza,
}

export const MIX = { name: 'Mix Tutto', color: '#7C5CFF' }

export function sourceMeta(source: Source): { name: string; color: string; Icon: LucideIcon } {
  if (source === 'mix') return { ...MIX, Icon: Shuffle }
  const c = categoryById(source)
  return { name: c.name, color: c.color, Icon: ICONS[c.icon] ?? Flag }
}

/** Riquadro colorato con l'icona della categoria. */
export function CategoryTile({ source, className = 'size-12', iconClass = 'size-6' }: { source: Source; className?: string; iconClass?: string }) {
  const { color, Icon } = sourceMeta(source)
  return (
    <span
      className={cx('grid shrink-0 place-items-center rounded-2xl text-white', className)}
      style={{
        background: `linear-gradient(145deg, ${color}, color-mix(in oklab, ${color} 62%, #1b1340))`,
        boxShadow: `0 6px 18px -6px ${color}, inset 0 1px 0 rgba(255,255,255,0.35)`,
      }}
      aria-hidden="true"
    >
      <Icon className={iconClass} strokeWidth={2.3} />
    </span>
  )
}
