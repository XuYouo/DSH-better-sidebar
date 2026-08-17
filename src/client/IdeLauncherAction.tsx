/** Session-header utility for opening the session cwd in a host IDE. */
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  IconChevronDownOutline14,
  IconCodeOutline16,
  IconLoadingOutline16,
  Menu,
  type MenuEntry,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { IdeId, InstalledIde } from '../ide-catalog.ts'
import type { SidebarSessionList } from '../context-types.ts'
import type { SessionScope } from './api.ts'
import { IdeIcon } from './IdeIcon.tsx'
import css from './IdeLauncherAction.module.css'

type Translate = (key: string, params?: Record<string, string | number>) => string

export interface IdeLauncherActionProps {
  sessionId: string
  useSessions<T>(selector: (state: SidebarSessionList) => T): T
  t: Translate
  listIdes(): Promise<InstalledIde[]>
  openIde(scope: SessionScope, id: IdeId): Promise<void>
}

/** Native DSH capsule + Menu, ordered immediately before Session Log. */
export function IdeLauncherAction({
  sessionId,
  useSessions,
  t,
  listIdes,
  openIde,
}: IdeLauncherActionProps): ReactNode {
  const cwd = useSessions(state => state.byId[sessionId]?.cwd)
  const [open, setOpen] = useState(false)
  const [ides, setIdes] = useState<InstalledIde[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [openingId, setOpeningId] = useState<IdeId | null>(null)
  const [error, setError] = useState<string | null>(null)

  const detect = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setIdes(await listIdes())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoading(false)
    }
  }, [listIdes])

  const toggle = useCallback(() => {
    setOpen(value => {
      const next = !value
      if (next) void detect()
      return next
    })
  }, [detect])

  const entries = useMemo<MenuEntry[]>(() => {
    const items: MenuEntry[] = [{ type: 'label', id: 'installed', text: t('ideInstalled') }]
    if (ides !== null) {
      for (const ide of ides) {
        items.push({
          id: ide.id,
          label: ide.name,
          icon: <IdeIcon id={ide.id} />,
          disabled: openingId !== null,
        })
      }
    }
    if (loading && ides === null) {
      items.push({ id: 'detecting', label: t('ideDetecting'), icon: <IconLoadingOutline16 className={css.spinner} />, disabled: true })
    } else if (!loading && error === null && ides?.length === 0) {
      items.push({ id: 'empty', label: t('ideNone'), disabled: true })
    }
    return items
  }, [error, ides, loading, openingId, t])

  const footer = useMemo<MenuEntry[]>(() => {
    const items: MenuEntry[] = []
    if (error !== null) items.push({ id: 'error', label: t('ideError', { message: error }), disabled: true })
    items.push({ id: 'host-hint', label: t('ideHostHint'), disabled: true })
    return items
  }, [error, t])

  const select = useCallback((raw: string) => {
    const ide = ides?.find(candidate => candidate.id === raw)
    if (ide === undefined) return
    setOpen(false)
    setOpeningId(ide.id)
    setError(null)
    const scope: SessionScope = { sessionId, ...(cwd ? { cwd } : {}) }
    void openIde(scope, ide.id).catch((cause) => {
      setError(cause instanceof Error ? cause.message : String(cause))
      setOpen(true)
    }).finally(() => { setOpeningId(null) })
  }, [cwd, ides, openIde, sessionId])

  const busy = openingId !== null
  const anchor = (
    <button
      type="button"
      className={css.trigger}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-busy={busy || loading}
      title={t('ideHostHint')}
      onClick={toggle}
    >
      {busy ? <IconLoadingOutline16 size={14} className={css.spinner} /> : <IconCodeOutline16 size={14} />}
      <span>{t('ideOpen')}</span>
      <IconChevronDownOutline14 size={12} className={open ? css.chevronOpen : undefined} />
    </button>
  )

  return (
    <Menu
      open={open}
      anchor={anchor}
      items={entries}
      footer={footer}
      onSelect={select}
      onClose={() => { setOpen(false) }}
      align="start"
      side="bottom"
      portal
      dense
    />
  )
}
