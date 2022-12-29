import type { Game } from './Game'

import { Block } from './Block'
import { Cell } from './Cell'

export class Grid {
	/** The dimensions of the grid in cells. */
	dimensions: [x: number, y: number] = [10, 20]

	/**
	 * A 2D array of cells: cell[y][x]
	 * ```yaml
	 * [x0,y0] [x1,y0] [x2,y0] [x3,y0] [x4,y0] [x5,y0] [x6,y0] [x7,y0] [x8,y0] [x9,y0]
	 * [x0,y1] [x1,y1] [x2,y1] [x3,y1] [x4,y1] [x5,y1] [x6,y1] [x7,y1] [x8,y1] [x9,y1]
	 * [x0,y2] [x1,y2] [x2,y2] [x3,y2] [x4,y2] [x5,y2] [x6,y2] [x7,y2] [x8,y2] [x9,y2]
	 * [x0,y3] [x1,y3] [x2,y3] [x3,y3] [x4,y3] [x5,y3] [x6,y3] [x7,y3] [x8,y3] [x9,y3]
	 * ... etc
	 * ```
	 * @example
	 *   // Get the cell at x=5, y=3
	 *   grid.cells[3][5]
	 */
	cells: Cell[][]

	/** The falling block controlled by the player. */
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

	rotateBlock() {
		this.activeBlock?.rotate()
		this.game.update()
	}

	/** Moves the block downwards to the point where it would collide and stop falling. */
	dropBlock() {
		if (!this.activeBlock) return

		const loopGuard = 21
		while (this.activeBlock?.canMove('down')) {
			const y = this.activeBlock.y
			this.moveBlock('down')
			if (y > loopGuard) {
				console.error('loopGuard triggered')
				break
			}
		}
		this.game.update()
	}

	/** Freezes the active block in place and adds a new block. */
	freeze() {
		if (this.activeBlock) {
			this.activeBlock.falling = false
			this.checkRows()
			this.addBlock()
		}
	}

	/**
	 * Checks for full rows and removes them.
	 * @todo - row animation
	 */
	checkRows() {
		let removedRows = 0
		// Move all cells above the removed rows down.
		this.cells.forEach((row, y) => {
			const rowIsFull = row.every((cell) => cell.isOccupied() && cell.block)
			if (rowIsFull) {
				removedRows += 1
				for (let i = y; i > 0; i--) {
					for (let j = 0; j < row.length - 1; j++) {
						const cell = this.cells[i][j]
						cell.unlink()

						const cellAbove = this.cells[i - 1]?.[cell.x]
						if (cellAbove?.isOccupied()) {
							const block = cellAbove.block
							if (!block) throw new Error('Block not found.  This should never happen.')
							cellAbove.unlink()
							cell.link(block)
						}
					}
				}
			}

			this.game.score += removedRows
		})

		this.game.update()
	}

	/**
	 * Moves all floating cells down.
	 * @todo - this isn't being used yet.  Perhaps it could be part of a PowerUp system or something?
	 */
	gravity() {
		let allSettled = true
		// Move all cells above the removed rows down.
		this.cells.forEach((row, y) => {
			// if (y > rows.length) return
			row.forEach((cell, x) => {
				if (cell.block && cell.isOccupied()) {
					console.log('cellBelow', cell.cellBelow())
					if (cell.cellBelow() === 'empty') {
						allSettled = false
						const block = cell.block
						if (!block) return
						cell.unlink()
						this.cells[y + 1][x].link(block)
					}
				}
			})
		})

		if (!allSettled) {
			this.game.update()
			requestAnimationFrame(() => setTimeout(() => this.gravity(), 10))
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
