/**
 * SANAT YUVASI SİSTEMİ
 * Referans kalitesindeki raster illüstrasyonlar (karakterler, arka planlar) dışarıda üretilip
 * public/assets/art/ altına konur ve manifest.json'a yazılır. Uygulama açılışta manifesti okur:
 * görsel varsa onu, yoksa koddan çizilen (SVG/3D) sürümü gösterir. Bkz. docs/ART_PROMPTS.md
 */
import { create } from 'zustand'

export type CharacterId = 'findik' | 'kasif' | 'robo' | 'sinif1' | 'sinif2' | 'sinif3' | 'sinif4' | 'pet' | `kasif-${string}`
export type BackgroundId = 'world' | 'forest' | 'park' | 'meadow' | 'glade' | 'orchard' | 'sky' | 'lab' | 'town' | 'history' | 'door' | 'door-open'

export interface ArtManifest {
  /** karakter → poz → dosya (art/ altına göre) */
  characters?: Partial<Record<string, Record<string, string>>>
  backgrounds?: Partial<Record<BackgroundId, string>>
}

interface ArtState {
  manifest: ArtManifest
  loaded: boolean
}

export const useArt = create<ArtState>(() => ({ manifest: {}, loaded: false }))

export async function loadArtManifest() {
  try {
    const r = await fetch('/assets/art/manifest.json', { cache: 'no-cache' })
    if (!r.ok) throw new Error(String(r.status))
    const m = (await r.json()) as ArtManifest
    useArt.setState({ manifest: m, loaded: true })
  } catch {
    useArt.setState({ manifest: {}, loaded: true })
  }
}

export const artUrl = (file: string) => `/assets/art/${file}`

export function useCharacterArt(id: CharacterId, pose: string): string | null {
  return useArt((s) => {
    const c = s.manifest.characters?.[id]
    if (!c) return null
    const f = c[pose] ?? c.idle ?? Object.values(c)[0]
    return f ? artUrl(f) : null
  })
}

export function useBackgroundArt(id: BackgroundId): string | null {
  return useArt((s) => {
    const f = s.manifest.backgrounds?.[id]
    return f ? artUrl(f) : null
  })
}
