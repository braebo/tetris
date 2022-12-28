export type CellState = 0 | 1

export type ShapeRotation = CellState[][]

export type ShapeType = 'square' | 'line' | 'triangle' | 'z' | 'zReverse' | 'L' | 'LReverse'

export interface Shape {
	type: ShapeType
	color: string
	cells: ShapeRotation[]
}

export const shapes: Shape[] = [
	{
		type: 'triangle',
		color: 'purple',
		cells: [
			[
				[0, 0, 0],
				[0, 1, 0],
				[1, 1, 1]
			],
			[
				[1, 0, 0],
				[1, 1, 0],
				[1, 0, 0]
			],
			[
				[1, 1, 1],
				[0, 1, 0],
				[0, 0, 0]
			],
			[
				[0, 0, 1],
				[0, 1, 1],
				[0, 0, 1]
			]
		]
	},
	{
		type: 'square',
		color: 'yellow',
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
		cells: [
			[
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 1, 1, 1],
				[0, 0, 0, 0]
			],
			[
				[0, 1, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 0]
			],
			[
				[0, 0, 0, 0],
				[1, 1, 1, 1],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			],
			[
				[0, 0, 1, 0],
				[0, 0, 1, 0],
				[0, 0, 1, 0],
				[0, 0, 1, 0]
			]
		]
	},
	{
		type: 'z',
		color: 'red',
		cells: [
			[
				[1, 1, 0],
				[0, 1, 1],
				[0, 0, 0]
			],
			[
				[0, 0, 1],
				[0, 1, 1],
				[0, 1, 0]
			],
			[
				[0, 0, 0],
				[1, 1, 0],
				[0, 1, 1]
			],
			[
				[0, 1, 0],
				[1, 1, 0],
				[1, 0, 0]
			]
		]
	},
	{
		type: 'zReverse',
		color: 'green',
		cells: [
			[
				[0, 1, 1],
				[1, 1, 0],
				[0, 0, 0]
			],
			[
				[0, 1, 0],
				[0, 1, 1],
				[0, 0, 1]
			],
			[
				[0, 0, 0],
				[0, 1, 1],
				[1, 1, 0]
			],
			[
				[1, 0, 0],
				[1, 1, 0],
				[0, 1, 0]
			]
		]
	},
	{
		type: 'L',
		color: 'blue',
		cells: [
			[
				[1, 0, 0],
				[1, 1, 1],
				[0, 0, 0]
			],
			[
				[1, 1, 0],
				[1, 0, 0],
				[1, 0, 0]
			],
			[
				[1, 1, 1],
				[0, 0, 1],
				[0, 0, 0]
			],
			[
				[0, 0, 1],
				[0, 0, 1],
				[0, 1, 1]
			]
		]
	},
	{
		type: 'LReverse',
		color: 'orange',
		cells: [
			[
				[0, 0, 1],
				[1, 1, 1],
				[0, 0, 0]
			],
			[
				[1, 0, 0],
				[1, 0, 0],
				[1, 1, 0]
			],
			[
				[1, 1, 1],
				[1, 0, 0],
				[0, 0, 0]
			],
			[
				[0, 1, 1],
				[0, 0, 1],
				[0, 0, 1]
			]
		]
	}
]

export const randomShape = () => shapes[Math.floor(Math.random() * shapes.length)]
