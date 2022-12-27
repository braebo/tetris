import type { Block } from './Block'
import type { Game } from './Game'

export class Cell {
	debug = false
	_state: 0 | 1 = 0

	block: null | Block = null
	color: null | string = null
	position: [x: number, y: number]

	constructor(public game: Game, position: [x: number, y: number], state?: 0 | 1) {
		this.state = state ?? 0
		this.position = position
	}

	get x() {
		return this.position[0]
	}

	get y() {
		return this.position[1]
	}

	set state(state: 0 | 1) {
		this._state = state
		this.color = state === 1 ? this.block?.color ?? null : null
	}

	get state() {
		return this._state
	}

	toggle() {
		this.state = this.state === 0 ? 1 : 0
	}

	link(block: Block, x: number, y: number) {
		this.block = block
		const newState = block.cells[y][x]
		if (this.state === 1 && newState === 1) {
			if (this.debug) console.error('cell', this.position, 'linked to block', block, 'but was already occupied')
		}
		this.state = newState

		if (this.debug) console.log('cell', this.position, 'linked to block', block)
	}

	unlink() {
		this.block = null
		if (this.state === 0) {
			if (this.debug) console.error('cell', this.position, 'unlinked but was already empty')
		}
		this.state = 0
	}

	isEmpty() {
		return this.state === 0
	}

	isOccupied() {
		return this.state === 1
	}

	canFall() {
		const touchingFloor = this.y + 1 < this.game.grid.dimensions[1]
		if (!touchingFloor) {
			if (this.debug) console.log('cell', this.position, 'Collision detected: grid floor')
			return false
		}

		const cellBelow = this.game.grid.cells[this.y + 1][this.x]
		if (cellBelow.isOccupied()) {
			if (this.debug) console.log('cell', this.position, 'Collision detected: cell below')
			return false
		}

		return true
	}

	reset() {
		if (this.isOccupied()) this.unlink()
	}
}
