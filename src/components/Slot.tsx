type SlotProps = {
  /** What belongs here, and what decision it needs. */
  children: string
}

/**
 * A visible stand-in for content we do not have yet. Deliberately looks
 * unfinished so nothing ships half-true; each one has a matching TODO in
 * the component that renders it.
 */
export function Slot({ children }: SlotProps) {
  return <p className="slot">{children}</p>
}
