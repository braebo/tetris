import type { Theme } from './themes'
import type { Block } from './Block'

import { Ticker, tickerDefOpts } from './Ticker'
import { gridStore, themeStore } from './stores'
import { Grid } from './Grid'

interface GameOptions {
	debug: boolean
	theme: Theme
}

/** Default game options. */
const defaultGameOpts: GameOptions = {
	debug: false,
	theme: themeStore.get()
}

interface Level {
	interval: number
	scoreMultiplier: number
}

export class Game {
	blocks: Block[] = []
	grid: Grid
	ticker: Ticker
	state: 'paused' | 'started' | 'stopped' = 'stopped'

	score = 0
	gameOver = false
	level = 0
	levels: Level[] = [
		{ interval: 1000, scoreMultiplier: 1 },
		{ interval: 900, scoreMultiplier: 1.1 },
		{ interval: 800, scoreMultiplier: 1.2 },
		{ interval: 700, scoreMultiplier: 1.3 },
		{ interval: 600, scoreMultiplier: 1.4 },
		{ interval: 500, scoreMultiplier: 1.5 },
		{ interval: 450, scoreMultiplier: 1.75 },
		{ interval: 400, scoreMultiplier: 2 }
	]
	get currentLevel() {
		return this.levels[this.level]
	}

	speedMultiplier = 1

	_theme!: Theme
	set theme(theme: Theme) {
		this._theme = theme
		themeStore.set(theme)
	}
	get theme() {
		return this._theme
	}

	debug: boolean

	constructor(options?: GameOptions) {
		const opts = { ...defaultGameOpts, ...options }
		this.debug = opts.debug
		this.theme = opts.theme

		this.ticker = new Ticker(this, tickerDefOpts)
		this.grid = new Grid(this)
		this.update()
	}

	start() {
		if (this.state === 'started') {
			return
		}

		if (this.state === 'stopped') {
			this.grid.addBlock()
		}

		this.state = 'started'
		this.ticker.start()
	}

	pause() {
		this.ticker.stop()
		this.state = 'paused'
	}

	reset() {
		this.ticker.stop()
		this.ticker.time = 0
		this.grid = new Grid(this)
		this.score = 0
		this.level = 0
		this.gameOver = false
		this.state = 'stopped'
		this.update()
	}

	restart() {
		this.reset()
		this.start()
	}

	/**
	 * A debug utility for manually invoking a tick.
	 * Usually, the game will tick automatically after {@link Game.start} is invoked.
	 */
	tick() {
		// The grid tick handles gravity and block movement.
		this.grid.tick()
		this.update()
	}

	/** Updates any stores that are subscribed to the game (mostly for the UI). */
	update() {
		gridStore.set(this.grid.cells)
	}

	/** Cleans up any loose resources used by the game. */
	dispose() {
		this.ticker.dispose()
	}
}
