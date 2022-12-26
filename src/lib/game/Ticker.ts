import type { Game } from './Game'

export interface TickerOptions {
	time: number
	speed: number
	frame: number
	ticks: number
}

export const tickerDefOpts: TickerOptions = {
	time: 0,
	speed: 1000,
	frame: 0,
	ticks: 0
}

export class Ticker {
	frame!: number
	time!: number
	speed!: number
	ticks!: number

	running = false
	timer?: NodeJS.Timeout

	constructor(public game: Game, options: TickerOptions) {
		Object.assign(this, { ...options, ...tickerDefOpts })
	}
	protected tick() {
		this.time = performance.now()
		if (this.time - this.speed * this.frame > this.speed) {
			if (this.game.debug) {
				console.log('Ticker.tick ' + this.time + '.', this)
			}
			this.frame++
			this.game.grid.tick()
		}

		this.timer = setTimeout(() => {
			if (this.running) this.tick()
		}, 1000 / 32)
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
