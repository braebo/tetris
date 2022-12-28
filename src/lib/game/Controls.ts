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

	keydown(e: KeyboardEvent) {
		if (this.game.gameOver) return

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
