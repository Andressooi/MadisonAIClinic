type PhotoSlotProps = {
  /** What should be dropped here, in plain words. */
  label: string
}

/**
 * Placeholder for real photography. Swap the whole element for an
 * `<img>` (keep the `grayscale` class on the figure) once shots exist.
 */
export function PhotoSlot({ label }: PhotoSlotProps) {
  return (
    <div className="photo-slot" role="img" aria-label={`Photo placeholder: ${label}`}>
      <span className="photo-slot-label" aria-hidden="true">
        {label}
      </span>
    </div>
  )
}
