import type { Grid } from './Grid'
import { randomShape, type Shape } from './shapes'

export class Block {
	color: string
	falling = true

	position: [x: number, y: number]
	shape: Shape

	_rotation = 0

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
		this.rotation += 1
	}

	get rotation() {
		return this._rotation
	}

	set rotation(value) {
		this._rotation = value % this.shape.cells.length
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
