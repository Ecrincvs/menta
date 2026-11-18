import type { CSSProperties } from 'react'

/** 3D stil nesne görseli (public/assets/objects/<name>.png — Fluent Emoji 3D, MIT) */
export function Obj({
  name,
  size = 64,
  alt = '',
  className = '',
  style,
  shadow = true,
}: {
  name: string
  size?: number | string
  alt?: string
  className?: string
  style?: CSSProperties
  shadow?: boolean
}) {
  return (
    <img
      src={`/assets/objects/${name}.png`}
      alt={alt}
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? size : undefined}
      draggable={false}
      className={`${shadow ? 'mk-obj' : ''} ${className}`}
      style={{ width: size, height: size, objectFit: 'contain', pointerEvents: 'none', ...style }}
    />
  )
}
