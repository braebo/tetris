import { themes, defaultTheme, type ThemeTitle } from './themes'
import { Ticker, tickerDefOpts } from './Ticker'
import { writable } from 'svelte/store'
import { Block } from './Block'

export const grid = writable<Cell[][]>([])

class Cell {
	block: null | Block = null
	color: string
	position: [x: number, y: number]
	_state: 0 | 1 = 0
	debug = false

	constructor(public game: Game, color: string, position: [x: number, y: number], state?: 0 | 1) {
		this.state = state ?? 0
		this.color = color
		this.position = position
	}

	set state(state: 0 | 1) {
		this._state = state
		this.color = state === 0 ? this.game.activeTheme.cell : this.block?.color || '#000000'
	}

	get state() {
		return this._state
	}

	toggle() {
		this.state = this.state === 0 ? 1 : 0
	}

	link(block: Block, x: number, y: number) {
		this.block = block
		const newState = block.cells[y][x]
		if (this.state === 1 && newState === 1) {
			if (this.debug) console.error('cell', this.position, 'linked to block', block, 'but was already occupied')
		}
		this.state = newState

		if (this.debug) console.log('cell', this.position, 'linked to block', block)
	}

	unlink() {
		this.block = null
		if (this.state === 0) {
			if (this.debug) console.error('cell', this.position, 'unlinked but was already empty')
		}
		this.state = 0
	}

	isEmpty() {
		return this.state === 0
	}

	isOccupied() {
		return this.state === 1
	}

	get x() {
		return this.position[0]
	}

	get y() {
		return this.position[1]
	}

	canFall() {
		const touchingFloor = this.y + 1 < this.game.grid.dimensions[1]
		if (!touchingFloor) {
			if (this.debug) console.log('cell', this.position, 'Collision detected: grid floor')
			return false
		}

		const cellBelow = this.game.grid.cells[this.y + 1][this.x]
		if (cellBelow.isOccupied()) {
			if (this.debug) console.log('cell', this.position, 'Collision detected: cell below')
			return false
		}

		return true
	}

	reset() {
		if (this.isOccupied()) this.unlink()
	}
}

class Grid {
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
					// todo - Game Over
				}
			})
		})
		this.blocks.push(block)
	}

	getCell(block: Block, x: number, y: number) {
		if (this.debug) {
			console.log('Grid.getCell() - block.position = ', block.position)
			console.log({ blockX: block.x, blockY: block.y, x, y })
		}
		return this.cells[y + block.y][x + block.x]
	}

	tick() {
		// Move all falling blocks down 1 cell.
		this.blocks.forEach((block) => {
			if (block.falling) {
				// Check if the block is colliding with another block or the bottom of the grid.
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

interface GameOptions {
	debug: boolean
	theme: ThemeTitle
}

/** Tetris default options. */
const testrisDefOpts: GameOptions = {
	debug: false,
	theme: 'default'
}

export class Game {
	blocks: Block[] = []
	grid: Grid
	ticker: Ticker

	score = 0
	theme: ThemeTitle
	debug: boolean

	get activeTheme() {
		return themes.get(this.theme) ?? defaultTheme
	}

	constructor(options?: GameOptions) {
		const opts = { ...testrisDefOpts, ...options }
		this.debug = opts.debug
		this.theme = opts.theme

		this.ticker = new Ticker(this, tickerDefOpts)
		this.grid = new Grid(this)
		this.update()
	}

	start() {
		this.ticker.start()
	}

	pause() {
		this.ticker.stop()
	}

	reset() {
		this.grid = new Grid(this)
		this.ticker.stop()
		this.ticker.time = 0
	}

	restart() {
		this.reset()
		this.start()
	}

	tick() {
		this.grid.tick()
		this.update()
	}

	update() {
		grid.set(this.grid.cells)
	}

	dispose() {
		this.ticker.dispose()
	}
}

export const tetris = new Game()

tetris.grid.addBlock()
