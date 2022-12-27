import type { Game } from './Game'

import { Block } from './Block'
import { Cell } from './Cell'

export class Grid {
	dimensions: [x: number, y: number] = [10, 20]
	cells: Cell[][]
	blocks: Block[] = []

	debug = false

	constructor(public game: Game) {
		this.cells = Array(this.dimensions[1])
			.fill(0)
			.map((_, y) =>
				Array(this.dimensions[0])
					.fill(0)
					.map((_, x) => new Cell(game, this.game.activeTheme.cell, [x, y], 0))
			)
	}

	get center() {
		return Math.floor(this.dimensions[0] / 2)
	}

	addBlock(block: Block = new Block([0, 0])) {
		if (this.debug) {
			console.log('Grid.addBlock', block)
		}
		block.position = [this.center - Math.floor(block.width / 2), 0]
		block.cells.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (this.cells[x][y].isEmpty()) {
					const targetCell = this.getCell(block, x, y)
					if (cell === 1) {
						targetCell.link(block, x, y)
					}
				} else {
					console.error('Game Over')
					this.game.gameOver = true
					return
				}
			})
		})
		this.blocks.push(block)
		this.game.update()
	}

	/** Returns the grid cell occupied by a given Block cell. */
	getCell(block: Block, x: number, y: number) {
		if (this.debug) {
			console.log('Grid.getCell() - block.position = ', block.position)
			console.log({ blockX: block.x, blockY: block.y, x, y })
		}
		return this.cells[y + block.y][x + block.x]
	}

	tick() {
		if (this.game.gameOver) return
		// Move all falling blocks down 1 cell.
		this.blocks.forEach((block) => {
			if (block.falling) {
				// Check if the block would collide with another block or the bottom of the grid.
				const bottomCellsIndex = block.cells.length - 1
				const bottomCells = block.cells[bottomCellsIndex]
				if (this.debug) {
					console.log('bottomCellsIndex', bottomCellsIndex)
					console.log('bottomCells', bottomCells)
				}
				const canFall = bottomCells.every((_cell, x) => this.getCell(block, x, bottomCellsIndex).canFall())

				// If the block can't fall, toggle it and return early.
				if (!canFall) {
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
		})
		if (this.debug) {
			console.table(this.cells.map((row) => row.map((cell) => cell._state)))
		}
		this.game.update()
	}
}
