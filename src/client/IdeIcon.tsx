/** Small, code-native product marks for the IDE launcher menu. */
import type { ReactNode } from 'react'
import type { IdeId } from '../ide-catalog.ts'
import css from './IdeLauncherAction.module.css'

const JETBRAINS_LABELS: Partial<Record<IdeId, string>> = {
  intellij: 'IJ',
  webstorm: 'WS',
  pycharm: 'PC',
  goland: 'GO',
  clion: 'CL',
  rider: 'RD',
}

/** Render a compact recognizable mark without loading remote image assets. */
export function IdeIcon({ id }: { id: IdeId }): ReactNode {
  const jetbrains = JETBRAINS_LABELS[id]
  if (jetbrains !== undefined) {
    return <span className={`${css.ideIcon} ${css.jetbrains}`} aria-hidden="true">{jetbrains}</span>
  }
  switch (id) {
    case 'vscode':
      return (
        <svg className={css.ideIcon} viewBox="0 0 20 20" aria-hidden="true">
          <path fill="#23a8f2" d="M14.7 1.8 7.3 8.4 3.2 5.3 1.4 6.8 5.6 10l-4.2 3.2 1.8 1.5 4.1-3.1 7.4 6.6 3.9-1.8V3.6l-3.9-1.8Zm-.2 5v6.4L10.2 10l4.3-3.2Z" />
        </svg>
      )
    case 'cursor':
      return (
        <svg className={css.ideIcon} viewBox="0 0 20 20" aria-hidden="true">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="#17171a" />
          <path d="m5 4 10 7-5 .8-2.1 4.1L5 4Z" fill="#fff" />
        </svg>
      )
    case 'windsurf':
      return (
        <svg className={css.ideIcon} viewBox="0 0 20 20" aria-hidden="true">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="#12b8a6" />
          <path d="M3.8 7.1c2.3 1.2 3.6 1.2 5.8 0 2.3-1.2 3.7-1.2 6.6 0M3.8 11.1c2.3 1.2 3.6 1.2 5.8 0 2.3-1.2 3.7-1.2 6.6 0" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    case 'zed':
      return (
        <svg className={css.ideIcon} viewBox="0 0 20 20" aria-hidden="true">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="#111" />
          <path d="M5 5h10L7 15h8" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )
    case 'vscodium':
      return (
        <svg className={css.ideIcon} viewBox="0 0 20 20" aria-hidden="true">
          <path d="m14.8 2-7.4 6.4-4-3-2 1.6L5.6 10l-4.2 3 2 1.6 4-3 7.4 6.4 3.8-1.8V3.8L14.8 2Z" fill="#2f80d0" />
          <path d="m14.5 6.8-4.2 3.2 4.2 3.2V6.8Z" fill="#9ccc42" />
        </svg>
      )
    case 'trae':
      return <span className={`${css.ideIcon} ${css.trae}`} aria-hidden="true">T</span>
    case 'android-studio':
      return (
        <svg className={css.ideIcon} viewBox="0 0 20 20" aria-hidden="true">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="#37b767" />
          <path d="M6.3 8.2h7.4v5.4H6.3V8.2Zm1.2-2L6.2 4.4m6.3 1.8 1.3-1.8" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8.4" cy="10.1" r=".7" fill="#fff" /><circle cx="11.6" cy="10.1" r=".7" fill="#fff" />
        </svg>
      )
    case 'xcode':
      return (
        <svg className={css.ideIcon} viewBox="0 0 20 20" aria-hidden="true">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="#208ff0" />
          <path d="m5.2 14.8 8.9-9.6M7.2 5.2l7.6 9.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'visual-studio':
      return (
        <svg className={css.ideIcon} viewBox="0 0 20 20" aria-hidden="true">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="#6f42c1" />
          <path d="m4 7 3 3-3 3-1.7-1.4L4 10 2.3 8.4 4 7Zm3 3 6.7-5L17 6.5v7L13.7 15 7 10Z" fill="#fff" />
        </svg>
      )
    case 'sublime-text':
      return <span className={`${css.ideIcon} ${css.sublime}`} aria-hidden="true">S</span>
  }
}
