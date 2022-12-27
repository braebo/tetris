export interface Theme {
	name: string
	grid: string
	outline: string
	primary: string
	secondary: string
}

export const defaultTheme: Theme = {
	name: 'default',
	grid: '#1d1d1d',
	outline: '#151515',
	primary: 'cyan',
	secondary: 'magenta'
}

export const themes: Theme[] = [
	defaultTheme,
	{
		name: 'retro',
		grid: 'hsl(240, 50%, 10%)',
		outline: 'hsl(328, 100%, 20%)',
		primary: 'indigo',
		secondary: 'deeppink'
	}
]
