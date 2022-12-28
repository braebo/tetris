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

		if (!block.canMove('down')) {
			this.game.gameOver = true
			alert('Game Over')
			return
		}
	}

	/** Returns the grid cell occupied by a given Block cell. */
	getCell(block: Block, x: number, y: number) {
		return this.cells[y + block.y]?.[x + block.x]
	}

	moveBlock(direction: 'left' | 'right' | 'down') {
		if (this.activeBlock) {
			if (this.activeBlock.canMove(direction)) {
				this.activeBlock.unlink()
				if (direction === 'left') {
					this.activeBlock.x -= 1
				} else if (direction === 'right') {
					this.activeBlock.x += 1
				} else if (direction === 'down') {
					this.activeBlock.y += 1
				}
				this.activeBlock.link()
				this.game.update()
			} else {
				if (this.debug) console.log("Move denied.  Can't move " + direction)
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
		this.activeBlock?.rotate()
		this.game.update()
	}

	/** Moves the block downwards to the point where it would collide and stop falling. */
	dropBlock() {
		if (!this.activeBlock) return

		const loopGuard = 21
		let y = this.activeBlock.y
		while (this.activeBlock?.canMove('down')) {
			y++
			if (y > loopGuard) {
				console.error('loopGuard triggered')
				break
			}
		}
		y--
		this.activeBlock.y = y
		this.game.update()
	}

	/** Freezes the active block in place and adds a new block. */
	freeze() {
		if (this.activeBlock) {
			this.activeBlock.falling = false
			this.addBlock()
		}
	}

	tick() {
		if (this.game.gameOver) return

		const block = this.activeBlock

		if (block?.falling) {
			// If the block can't fall, freeze it and return early.
			if (!block.canMove('down')) return this.freeze()

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
			if (this.debug) console.groupCollapsed('Grid.tick() - Link cells.')
			block.cells.forEach((row, y) => {
				row.forEach((cell, x) => {
					const targetCell = this.getCell(block, x, y)
					if (cell === 1) {
						targetCell.link(block, x, y)
					}
					if (this.debug) console.log('targetCell', targetCell.position)
				})
			})
			if (this.debug) console.groupEnd()
		}

		// if (this.debug) {
		// 	console.table(this.cells.map((row) => row.map((cell) => cell._state)))
		// }
		this.game.update()
	}
}
