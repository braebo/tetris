import { Subject } from 'rxjs'

export const key = new Subject()

class Cell {
	piece: null | Block = null
	_state: 0 | 1 = 0

	constructor(public color: string, public position: [x: number, y: number], state?: 0 | 1) {
		this.state = state ?? 0
	}

	set state(state: 0 | 1) {
		this._state = state
		this.color = state === 0 ? '#eeeeee' : this.piece?.color || '#000000'
	}

	get state() {
		return this._state
	}

	toggle() {
		this.state = this.state === 0 ? 1 : 0
	}

	link(piece: Block) {
		this.piece = piece
		this.toggle()
	}

	unlink() {
		this.piece = null
		this.toggle()
	}

	isEmpty() {
		return this.state === 0
	}

	isOccupied() {
		return this.state === 1
	}
}

type CellState = 0 | 1

type ShapeRotation = CellState[][]
type ActiveRotation = 0 | 1 | 2 | 3

type ShapeType = 'square' | 'line' | 'z' | 'triangle' | 'L'

interface Shape {
	type: ShapeType
	color: string
	cells: ShapeRotation[]
}

const shapes: Shape[] = [
	{
		type: 'triangle',
		color: 'red',
		cells: [
			[
				[0, 1, 0],
				[1, 1, 1]
			],
			[
				[1, 0],
				[1, 1],
				[1, 0]
			],
			[
				[1, 1, 1],
				[0, 1, 0]
			],
			[
				[0, 1],
				[1, 1],
				[0, 1]
			]
		]
	},
	{
		type: 'square',
		color: 'green',
		cells: [
			[
				[1, 1, 1],
				[1, 1, 1],
				[1, 1, 1]
			]
		]
	},
	{
		type: 'line',
		color: 'blue',
		cells: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]]
	},
	{
		type: 'z',
		color: 'yellow',
		cells: [
			[
				[1, 1, 0],
				[0, 1, 1]
			],
			[
				[0, 1],
				[1, 1],
				[1, 0]
			],
			[
				[0, 1, 1],
				[1, 1, 0]
			],
			[
				[1, 0],
				[1, 1],
				[0, 1]
			]
		]
	},
	{
		type: 'L',
		color: 'orange',
		cells: [
			[
				[1, 0, 0],
				[1, 1, 1]
			],
			[
				[1, 1],
				[1, 0],
				[1, 0]
			],
			[
				[1, 1, 1],
				[0, 0, 1]
			],
			[
				[0, 1],
				[0, 1],
				[1, 1]
			]
		]
	}
]

const randomShape = () => shapes[Math.floor(Math.random() * shapes.length)]

class Block {
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
}

class Grid {
	dimensions: [x: number, y: number] = [10, 20]
	cells: Cell[][]
	color = '#eeeeee'
	time = 0
	speed = 1

	constructor() {
		this.cells = Array(this.dimensions[1])
			.fill(0)
			.map((_, y) =>
				Array(this.dimensions[0])
					.fill(0)
					.map((_, x) => new Cell(this.color, [x, y], 0))
			)
	}

	addBlock(block: Block = new Block([0, 0])) {
		console.log('Grid.addBlock', block)
		block.position = [Math.floor(this.dimensions[0] / 2), 0]
		block.cells.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (this.cells[x][y].isEmpty()) {
					this.cells[y + block.position[1]][x + block.position[0]].link(block)
				}
			})
		})
	}

	tick() {
		this.time++
		// Move all falling blocks down 1 cell.
		this.cells.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell.isOccupied() && cell.piece?.falling) {
					cell.piece.position = [x, y + 1]
				}
			})
		})
		key.next(void 0)
	}
}

interface Theme {
	background: string
	grid: string
	block: string
}
type ThemeTitle = string
type Themes = Record<ThemeTitle, Theme>

const themes: Themes = {
	default: {
		background: '#eeeeee',
		grid: '#cccccc',
		block: '#333333'
	},
	light: {
		background: '#ffffff',
		grid: '#cccccc',
		block: '#333333'
	}
} as const

const activeTheme: Themes[ThemeTitle] = themes['default']

export class Tetris {
	blocks: Block[] = []
	grid = new Grid()
	score = 0
	debug = false
	theme: ThemeTitle = 'default'

	constructor() {
		// this.grid.addBlock()
	}
}

export const tetris = new Tetris()

tetris.grid.addBlock()
