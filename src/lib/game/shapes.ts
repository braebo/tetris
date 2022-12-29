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
		color: '#ad19b6',
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
		color: '#ffff28',
		cells: [
			[
				[1, 1],
				[1, 1]
			]
		]
	},
	{
		type: 'line',
		color: '#1a62ff',
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
		color: '#ff2d2d',
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
		color: '#19c319',
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
		color: '#4f05ff',
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
		color: '#ffb62f',
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
