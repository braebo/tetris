import type { Block } from './Block'

import { themes, defaultTheme, type ThemeTitle } from './themes'
import { Ticker, tickerDefOpts } from './Ticker'
import { grid } from './stores'
import { Grid } from './Grid'

interface GameOptions {
	debug: boolean
	theme: ThemeTitle
}

/** Default game options. */
const defaultGameOpts: GameOptions = {
	debug: false,
	theme: 'default'
}

interface Level {
	interval: number
	scoreMultiplier: number
}

export class Game {
	blocks: Block[] = []
	grid: Grid
	ticker: Ticker

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

	theme: ThemeTitle
	debug: boolean

	get activeTheme() {
		return themes.get(this.theme) ?? defaultTheme
	}

	constructor(options?: GameOptions) {
		const opts = { ...defaultGameOpts, ...options }
		this.debug = opts.debug
		this.theme = opts.theme

		this.ticker = new Ticker(this, tickerDefOpts)
		this.grid = new Grid(this)
		this.update()
	}

	start() {
		this.ticker.start()
	}

	pause() {
		this.ticker.stop()
	}

	reset() {
		this.grid = new Grid(this)
		this.ticker.stop()
		this.ticker.time = 0
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
		this.grid.tick()
		this.update()
	}

	/** Updates any stores that are subscribed to the game. */
	update() {
		grid.set(this.grid.cells)
	}

	/** Cleans up any loose resources used by the game. */
	dispose() {
		this.ticker.dispose()
	}
}
