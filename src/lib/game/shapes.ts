export type CellState = 0 | 1

export type ShapeRotation = CellState[][]

export type ShapeType = 'square' | 'line' | 'z' | 'triangle' | 'L'

export interface Shape {
	type: ShapeType
	color: string
	cells: ShapeRotation[]
}

export const shapes: Shape[] = [
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
				[1, 1],
				[1, 1]
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

export const randomShape = () => shapes[Math.floor(Math.random() * shapes.length)]
