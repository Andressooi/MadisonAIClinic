import type { CSSProperties } from 'react'

type LogoProps = {
  /* Wordmark font-size in px; the full stop scales off it in em. */
  size?: number
  /* Ground the lockup sits on. */
  tone?: 'ink' | 'on-red' | 'on-dark'
}

/* Wordmark lockup from the logo kit ("the full stop"): lowercase Archivo Black,
   tight negative tracking, closed by a small red square. Built in CSS so it
   stays pixel-true at any size. */
export function Logo({ size = 18, tone = 'ink' }: LogoProps) {
  return (
    <span
      className={tone === 'ink' ? 'logo' : `logo logo-${tone}`}
      style={{ '--logo-size': `${size}px` } as CSSProperties}
    >
      <span className="visually-hidden">MadisonAIClinic</span>
      <span aria-hidden="true">madison ai clinic</span>
      <span className="logo-stop" aria-hidden="true" />
    </span>
  )
}
