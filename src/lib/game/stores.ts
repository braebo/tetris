import type { Cell } from './Cell'

import { writable } from 'svelte/store'

export const grid = writable<Cell[][]>([])
