import type { ReactNode } from 'react'

type BentoCardProps = {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function BentoCard({
  title,
  subtitle,
  children,
  className = '',
}: BentoCardProps) {
  return (
    <article className={`bento-card ${className}`.trim()}>
      <header className="bento-card__header">
        <h2 className="bento-card__title">{title}</h2>
        {subtitle ? <p className="bento-card__subtitle">{subtitle}</p> : null}
      </header>
      <div className="bento-card__body">{children}</div>
    </article>
  )
}
