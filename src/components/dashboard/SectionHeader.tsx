interface SectionHeaderProps {
  icon: string
  title: string
  variant?: 'default' | 'system'
}

export default function SectionHeader({ icon, title, variant = 'default' }: SectionHeaderProps) {
  const isSystem = variant === 'system'
  return (
    <div className={`section-header${isSystem ? ' sys-header' : ''}`}>
      <span className="icon">{icon}</span>
      <span className={`section-title${isSystem ? ' sys-title' : ''}`}>{title}</span>
    </div>
  )
}
