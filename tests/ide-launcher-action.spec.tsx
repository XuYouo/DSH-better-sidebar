/** Header utility: native menu states, icons, and session-scoped open call. */
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createElement, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { IdeLauncherAction } from '../src/client/IdeLauncherAction.tsx'
import type { SidebarSessionList } from '../src/context-types.ts'
import type { InstalledIde } from '../src/ide-catalog.ts'

;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

const copy: Record<string, string> = {
  ideOpen: 'Open in IDE',
  ideInstalled: 'Installed IDEs',
  ideDetecting: 'Detecting IDEs…',
  ideNone: 'No supported IDE detected on the DSH host',
  ideError: 'Action failed: {message}',
  ideHostHint: 'Detection and opening happen on the DSH host',
}

const translate = (key: string, params?: Record<string, string | number>): string => {
  let value = copy[key] ?? key
  for (const [name, replacement] of Object.entries(params ?? {})) value = value.replaceAll(`{${name}}`, String(replacement))
  return value
}

const sessions: SidebarSessionList = {
  current: 's1',
  byId: { s1: { id: 's1', displayTitle: 'Session', cwd: '/workspace/current' } },
}

const useSessions = <T,>(selector: (state: SidebarSessionList) => T): T => selector(sessions)

function mount(node: ReactNode): { container: HTMLDivElement; unmount: () => void } {
  const container = document.createElement('div')
  document.body.append(container)
  const root: Root = createRoot(container)
  act(() => { root.render(node) })
  return {
    container,
    unmount: () => {
      act(() => { root.unmount() })
      container.remove()
    },
  }
}

function component(
  listIdes: () => Promise<InstalledIde[]>,
  openIde = vi.fn(async () => {}),
): ReactNode {
  return createElement(IdeLauncherAction, {
    sessionId: 's1',
    useSessions,
    t: translate,
    listIdes,
    openIde,
  })
}

afterEach(() => {
  for (const child of [...document.body.children]) child.remove()
})

describe('IdeLauncherAction', () => {
  it('uses the Session Log capsule shape and shows detected IDEs with icons', async () => {
    const { container, unmount } = mount(component(async () => [
      { id: 'vscode', name: 'Visual Studio Code' },
      { id: 'intellij', name: 'IntelliJ IDEA' },
    ]))
    const trigger = container.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')!
    expect(trigger.textContent).toContain('Open in IDE')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    await act(async () => { trigger.click() })
    const rows = [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    expect(rows[0]?.textContent).toBe('Visual Studio Code')
    expect(rows[1]?.textContent).toContain('IntelliJ IDEA')
    expect(rows[0]?.querySelector('svg')).not.toBeNull()
    expect(rows[1]?.querySelector('span')).not.toBeNull()
    expect(document.body.textContent).toContain('Detection and opening happen on the DSH host')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    unmount()
  })

  it('opens the selected IDE with this session id and cwd, then closes the menu', async () => {
    const openIde = vi.fn(async () => {})
    const { container, unmount } = mount(component(
      async () => [{ id: 'cursor', name: 'Cursor' }],
      openIde,
    ))
    await act(async () => { container.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')!.click() })
    const item = document.querySelector<HTMLElement>('[role="menuitem"]')!
    await act(async () => { item.click() })
    expect(openIde).toHaveBeenCalledWith({ sessionId: 's1', cwd: '/workspace/current' }, 'cursor')
    expect(document.querySelectorAll('[role="menuitem"]')).toHaveLength(0)
    unmount()
  })

  it('renders an explicit host-side empty state', async () => {
    const { container, unmount } = mount(component(async () => []))
    await act(async () => { container.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')!.click() })
    expect(document.body.textContent).toContain('No supported IDE detected on the DSH host')
    unmount()
  })

  it('reopens the menu with the launch failure instead of losing the error', async () => {
    const openIde = vi.fn(async () => { throw new Error('application disappeared') })
    const { container, unmount } = mount(component(
      async () => [{ id: 'zed', name: 'Zed' }],
      openIde,
    ))
    await act(async () => { container.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')!.click() })
    await act(async () => { document.querySelector<HTMLElement>('[role="menuitem"]')!.click() })
    expect(document.body.textContent).toContain('Action failed: application disappeared')
    expect(container.querySelector('[aria-expanded="true"]')).not.toBeNull()
    unmount()
  })
})
