import type { Shape, ShapeRotation } from './shapes'
import type { Grid } from './Grid'

import { randomShape } from './shapes'

export class Block {
	color: string
	falling = true

	position: [x: number, y: number]
	shape: Shape

	_rotation = 0

	debug = true

	cells: ShapeRotation

	constructor(public grid: Grid, position: [x: number, y: number], shape: Shape = randomShape()) {
		this.shape = shape
		this.color = shape.color
		this.position = position
		this.cells = this.shape.cells[this.rotation]
	}

	get height() {
		return this.cells.length
	}

	get width() {
		return this.cells[0].length
	}

	get x() {
		return this.position[0]
	}
	set x(value) {
		this.position = [value, this.y]
	}

	get y() {
		return this.position[1]
	}
	set y(value) {
		this.position = [this.x, value]
	}

	rotate() {
		const newRotation = this._rotation + 1
		this.rotation = newRotation
	}

	get rotation() {
		return this._rotation
	}

	set rotation(value) {
		// Check if the rotation will hit any non-empty cells.
		this.cells.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell === 1) {
					const targetCell = this.grid.getCell(this, x, y)

					// If the targetCell is occupied by this block, it doesn't count.
					const isSelf = targetCell?.block === this
					if (!isSelf && targetCell.isOccupied()) {
						return
					}
				}
			})
		})

		this.unlink()

		if (value < 0) {
			value = this.shape.cells.length - 1
		}
		if (value >= this.shape.cells.length) {
			value = 0
		}

		this._rotation = value
		this.cells = this.shape.cells[this.rotation]

		this.link()
	}

	link() {
		this.cells.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell === 1) {
					const targetCell = this.grid.getCell(this, x, y)
					targetCell.link(this, x, y)
				}
			})
		})
	}

	unlink() {
		this.cells.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell === 1) {
					const targetCell = this.grid.getCell(this, x, y)
					targetCell.unlink()
				}
			})
		})
	}

	/** Checks for collision below the block. */
	canMove(direction: 'right' | 'left' | 'down') {
		if (direction === 'down') {
			for (let y = this.height - 1; y >= 0; y--) {
				for (let x = 0; x < this.width; x++) {
					if (this.cells[y][x] === 1) {
						const thisCell = this.grid.getCell(this, x, y)

						// If the cell below belongs to this block, it doesn't count.
						const destinationCell = this.grid.getCell(this, x, y + 1)
						if (destinationCell?.block === this) continue

						// If the cell below isn't empty, we can't move there.
						const destinationEmpty = thisCell?.cellBelow() === 'empty'
						if (!destinationEmpty) return false
					}
				}
			}

			return true
		}

		if (direction === 'right') {
			for (let y = 0; y < this.height; y++) {
				for (let x = this.width - 1; x >= 0; x--) {
					if (this.cells[y][x] === 1) {
						const thisCell = this.grid.getCell(this, x, y)

						// If the cell to the right belongs to this block, it doesn't count.
						const destinationCell = this.grid.getCell(this, x + 1, y)
						if (destinationCell?.block === this) continue

						// If the cell to the right isn't empty, we can't move there.
						const destinationEmpty = thisCell.cellBeside('right') === 'empty'
						if (!destinationEmpty) return false
					}
				}
			}

			return true
		}

		if (direction === 'left') {
			for (let y = 0; y < this.height; y++) {
				for (let x = 0; x < this.width; x++) {
					if (this.cells[y][x] === 1) {
						const thisCell = this.grid.getCell(this, x, y)

						// If the cell to the left belongs to this block, it doesn't count.
						const destinationCell = this.grid.getCell(this, x - 1, y)
						if (destinationCell?.block === this) continue

						// If the cell to the left isn't empty, we can't move there.
						const destinationEmpty = thisCell.cellBeside('left') === 'empty'
						if (!destinationEmpty) return false
					}
				}
			}

			return true
		}
	}
}
