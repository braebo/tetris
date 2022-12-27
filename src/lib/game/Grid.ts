import type { Game } from './Game'

import { Block } from './Block'
import { Cell } from './Cell'

export class Grid {
	dimensions: [x: number, y: number] = [10, 20]
	cells: Cell[][]
	activeBlock?: Block

	debug = false

	constructor(public game: Game) {
		this.cells = Array(this.dimensions[1])
			.fill(0)
			.map((_, y) =>
				Array(this.dimensions[0])
					.fill(0)
					.map((_, x) => new Cell(game, [x, y], 0))
			)
	}

	get center() {
		return Math.floor(this.dimensions[0] / 2)
	}

	addBlock(block: Block = new Block(this, [0, 0])) {
		if (this.game.gameOver) return

		if (this.debug) {
			console.log('Grid.addBlock', block)
		}

		block.position = [this.center - Math.floor(block.width / 2), 0]

		block.cells.forEach((row, y) => {
			row.forEach((cell, x) => {
				const targetCell = this.getCell(block, x, y)
				if (cell === 1) {
					targetCell.link(block, x, y)
				}
			})
		})

		this.activeBlock = block

		this.game.update()

		if (block.willCollide()) {
			this.game.gameOver = true
			alert('Game Over')
			return
		}
	}

	/** Returns the grid cell occupied by a given Block cell. */
	getCell(block: Block, x: number, y: number) {
		if (this.debug) {
			console.log('Grid.getCell() - block.position = ', block.position)
			console.log({ blockX: block.x, blockY: block.y, x, y })
		}
		return this.cells[y + block.y][x + block.x]
	}

	moveBlock(direction: 'left' | 'right' | 'up' | 'down') {
		if (this.activeBlock) {
			const { x, y } = this.activeBlock

			if (direction.match(/left|right/)) {
				const nextX = direction === 'left' ? x - 1 : x + 1
				const nextY = y
				if (this.canMoveTo(nextX, nextY)) {
					this.activeBlock.position = [nextX, nextY]
					this.game.update()
				}
			}

			if (direction.match(/up|down/)) {
				const nextX = direction === 'left' ? x - 1 : x + 1
				const nextY = y
				if (this.canMoveTo(nextX, nextY)) {
					this.activeBlock.position = [nextX, nextY]
					this.game.update()
				}
			}
		}
	}

	canMoveTo(x: number, y: number) {
		if (this.activeBlock) {
			const { cells } = this.activeBlock
			for (let i = 0; i < cells.length; i++) {
				for (let j = 0; j < cells[i].length; j++) {
					const cell = cells[i][j]
					if (cell === 1) {
						const targetCell = this.cells[y + i][x + j]
						if (targetCell.block) {
							return false
						}
					}
				}
			}
		}
		return true
	}

	rotateBlock() {
		if (this.activeBlock) {
			this.activeBlock.rotation = (this.activeBlock.rotation + 1) % this.activeBlock.cells.length
			this.game.update()
		}
	}

	/** Moves the block downwards to the point where it would collide and stop falling. */
	dropBlock() {
		if (!this.activeBlock) return

		let y = this.activeBlock.y
		while (!this.activeBlock?.willCollide()) {
			y++
		}
		y--
		this.activeBlock.y = y
		this.game.update()
	}

	tick() {
		if (this.game.gameOver) return

		const block = this.activeBlock

		if (block?.falling) {
			// If the block can't fall, toggle it and return early.
			if (block.willCollide()) {
				if (this.debug) console.warn('collision detected')
				block.falling = false
				this.addBlock()
				return
			}

			// Unlink all cells in the current block.
			block.cells.forEach((row, y) => {
				row.forEach((cell, x) => {
					const currentCell = this.getCell(block, x, y)
					if (cell === 1) {
						currentCell.unlink()
					}
				})
			})

			// Move the block down 1 cell.
			block.position[1]++

			// Link all cells in the current block to the next cell down.
			block.cells.forEach((row, y) => {
				row.forEach((cell, x) => {
					const targetCell = this.getCell(block, x, y)
					if (cell === 1) {
						targetCell.link(block, x, y)
					}
					if (this.debug) console.log('targetCell', targetCell.position)
				})
			})
		}

		if (this.debug) {
			console.table(this.cells.map((row) => row.map((cell) => cell._state)))
		}
		this.game.update()
	}
}
