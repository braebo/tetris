import type { Game } from './Game'

export class Controls {
	active = false

	constructor(public game: Game) {
		if (typeof window === 'undefined') return

		this.activate()
	}

	activate() {
		if (this.active) return

		window.addEventListener('keydown', this.keydown.bind(this))
		this.active = true
	}

	moveBlockRight() {
		this.game.grid.moveBlock('right')
	}

	moveBlockLeft() {
		this.game.grid.moveBlock('left')
	}

	moveBlockDown() {
		this.game.grid.moveBlock('down')
	}

	dropBlock() {
		this.game.grid.dropBlock()
	}

	rotateBlock() {
		this.game.grid.rotateBlock()
	}

	repeatThrottle = 0
	maxRepeatSpeedMS = 75

	keydown(e: KeyboardEvent) {
		if (this.game.gameOver) return
		if (e.repeat) {
			if (this.repeatThrottle === 0) this.repeatThrottle = performance.now()
			const sinceLast = performance.now() - this.repeatThrottle
			if (sinceLast >= this.maxRepeatSpeedMS) {
				this.repeatThrottle = performance.now()
			} else {
				return
			}
		}

		switch (e.key) {
			case 'ArrowLeft':
				this.moveBlockLeft()
				break
			case 'ArrowRight':
				this.moveBlockRight()
				break
			case 'ArrowDown':
				this.moveBlockDown()
				break
			case 'ArrowUp':
				this.rotateBlock()
				break
			case ' ':
				this.dropBlock()
				break
		}
	}

	dispose() {
		window?.removeEventListener('keydown', this.keydown)
	}
}
