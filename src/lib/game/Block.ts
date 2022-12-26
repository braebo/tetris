import { randomShape, type Shape, type ActiveRotation } from './shapes'

export class Block {
	color: string
	falling = true

	shape: Shape
	rotation: ActiveRotation = 0

	position: [x: number, y: number]

	constructor(position: [x: number, y: number], shape: Shape = randomShape()) {
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
}
