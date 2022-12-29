<script lang="ts">
	import { Game, gridStore, themeStore } from '$lib/game'
	import { themes } from '$lib/game/themes'
	import { onMount } from 'svelte'

	const tetris = new Game()

	onMount(() => {
		tetris.start()
		tetris.speedMultiplier = 2 // temp

		return () => {
			tetris.reset()
			tetris.dispose()
		}
	})
</script>

<div class="tetris" style:--grid={$themeStore.grid} style:--outline={$themeStore.outline}>
	<div class="buttons">
		<button on:click={() => tetris.tick()}>tick</button>
		<button on:click={() => tetris.start()}>start</button>
		<button on:click={() => tetris.pause()}>pause</button>
		<button on:click={() => tetris.reset()}>reset</button>
		<button on:click={() => tetris.grid.addBlock()}>add block</button>

		<div class="button">
			debug <input type="checkbox" bind:checked={tetris.debug} />
		</div>

		<div class="setting">
			<div class="title">theme</div>
			<select bind:value={tetris.theme}>
				{#each themes as theme}
					<option value={theme}>{theme.name}</option>
				{/each}
			</select>
		</div>

		<div class="setting">
			<div class="title">speed</div>
			<div class="number-input-sm">
				<div class="prefix">x</div>
				<input type="number" step="1" min="1" max="100" bind:value={tetris.speedMultiplier} />
			</div>
		</div>
	</div>

	{#each $gridStore as row, i}
		<div class="row">
			{#each row as cell, j}
				<div
					class="cell"
					class:glow={cell.color}
					style:--cell={cell.color + '50' ?? $themeStore.grid}
					style="background-color: {cell.color ?? $themeStore.grid}"
				>
					{#if tetris.debug}
						<div class="position">x{i}y{j}</div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.tetris {
		position: relative;

		margin: auto;

		border-radius: 1rem;
	}

	.row {
		display: flex;

		width: fit-content;
	}

	.cell {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 2rem;
		height: 2rem;

		background: var(--grid);
		border-radius: 0.2rem;
		outline: 1px solid var(--outline);
		overflow: visible;

		&.glow {
			box-shadow: 0px 0px 15px 5px var(--cell);
		}
	}

	.position {
		font-size: 0.01rem !important;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		position: absolute;
		left: -10rem;
		top: 5rem;
	}

	button,
	.button {
		width: fit-content;
		margin: 0 auto;
		padding: 0.25rem 1rem;

		color: var(--fg-d);
		background: var(--bg-b);
		border-radius: var(--radius);
		border: none;

		font-family: var(--font-a);
		letter-spacing: 0.1rem;

		&:hover {
			color: var(--fg-a);
		}
	}

	.setting {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;

		padding: 0.5rem;
		border-radius: var(--radius);

		outline: 1px solid var(--bg-c);

		.title {
			text-transform: capitalize;
			font-family: var(--font-b);
			color: var(--fg-d);
		}
	}

	select {
		width: fit-content;
		margin: 0 auto;
		padding: 0.25rem 1rem;

		color: var(--fg-a);
		background: var(--bg-b);
		border-radius: var(--radius);
		border: none;
		outline: none;

		font-family: var(--font-a);
		letter-spacing: 0.1rem;

		cursor: pointer;
	}

	.number-input-sm {
		display: flex;
		align-items: center;
		gap: 0.25rem;

		.prefix {
			color: var(--fg-d);
		}

		input {
			width: fit-content;
			margin: 0 auto;
			padding: 0.25rem;

			background: var(--bg-b);
			color: var(--fg-a);
			border-radius: var(--radius);
			border: none;

			letter-spacing: 0.1rem;

			font-family: var(--font-a);
		}
	}
</style>
