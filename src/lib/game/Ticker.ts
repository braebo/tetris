import type { Game } from './Game'

export interface TickerOptions {
	time: number
	frame: number
	ticks: number
	lastTickTime: number
}

export const tickerDefOpts: TickerOptions = {
	time: 0,
	frame: 0,
	ticks: 0,
	lastTickTime: 0
}

export class Ticker {
	frame!: number
	time!: number
	ticks!: number
	lastTickTime!: number

	running = false
	timer?: number

	private get interval() {
		return this.game.currentLevel.interval
	}

	constructor(public game: Game, options: TickerOptions) {
		Object.assign(this, { ...options, ...tickerDefOpts })
	}

	protected tick() {
		if (this.game.gameOver) return this.stop()
		this.time = Date.now()

		if (this.time - this.lastTickTime > this.interval) {
			this.lastTickTime = this.time
			this.frame++
			this.game.grid.tick()

			if (this.game.debug) {
				console.log('Ticker.tick ' + this.time + '.', this)
			}
		}

		this.timer = requestAnimationFrame(() => {
			if (this.running) this.tick()
		})
	}

	start() {
		this.time = performance.now()
		this.running = true
		this.tick()
	}

	stop() {
		this.running = false
	}

	dispose() {
		this.stop()
		clearTimeout(this.timer)
	}
}
