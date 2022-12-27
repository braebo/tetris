import type { Theme } from './themes'
import type { Cell } from './Cell'

import { defaultTheme } from './themes'
import { writable } from 'svelte/store'

import { persistentAtom } from '@nanostores/persistent'

export const gridStore = writable<Cell[][]>([])

export const themeStore = persistentAtom<Theme>('tetris_theme', defaultTheme, {
	encode: JSON.stringify,
	decode: JSON.parse
})
