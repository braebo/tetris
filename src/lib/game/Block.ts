import type { Grid } from './Grid'
import { randomShape, type Shape, type ActiveRotation } from './shapes'

export class Block {
	color: string
	falling = true

	shape: Shape
	rotation: ActiveRotation = 0

	position: [x: number, y: number]

	constructor(public grid: Grid, position: [x: number, y: number], shape: Shape = randomShape()) {
		this.shape = shape
		this.color = shape.color
		this.position = position
	}

	get cells() {
		return this.shape.cells[this.rotation]
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

	get y() {
		return this.position[1]
	}

	/** Checks for collision below the block. */
	willCollide() {
		const bottomCellsIndex = this.cells.length - 1
		const bottomCells = this.cells[bottomCellsIndex]
		const belowIsEmpty = bottomCells.every(
			(_cell, x) => this.grid.getCell(this, x, bottomCellsIndex).cellBelow() === 'empty'
		)
		return !belowIsEmpty
	}
}
