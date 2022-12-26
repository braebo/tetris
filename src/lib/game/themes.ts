export interface Theme {
	cell: string
	grid: string
	block: string
}
export type ThemeTitle = string
export type Themes = Map<ThemeTitle, Theme>

export const defaultTheme: Theme = {
	cell: '#aeaeae',
	grid: '#cccccc',
	block: '#333333'
}

export const themes: Themes = new Map<ThemeTitle, Theme>(
	Object.entries({
		default: defaultTheme,
		light: {
			cell: '#ffffff',
			grid: '#cccccc',
			block: '#333333'
		},
		dark: {
			cell: '#333333',
			grid: '#cccccc',
			block: '#eeeeee'
		}
	})
)
