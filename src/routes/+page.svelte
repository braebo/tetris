<script lang="ts">
	import { Game, grid } from '$lib/game'
	import { onMount } from 'svelte'

	const tetris = new Game()

	onMount(() => {
		tetris.start

		return () => tetris.dispose
	})
</script>

<div class="tetris">
	<div class="buttons">
		<button on:click={() => tetris.tick()}>tick</button>
		<button on:click={() => tetris.start()}>start</button>
		<button on:click={() => tetris.pause()}>pause</button>
		<button on:click={() => tetris.reset()}>reset</button>
		<button on:click={() => tetris.grid.addBlock()}>add block</button>
		<div class="button">debug <input type="checkbox" bind:checked={tetris.debug} /></div>
	</div>

	{#each $grid as row, i}
		<div class="row">
			{#each row as cell, j}
				<div class="cell" style="background-color: {cell.color}">
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

		border-radius: 0.1rem;
		width: 2rem;
		height: 2rem;
		outline: 1px solid var(--fg-b);
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

	button, .button {
		background: var(--bg-b);
		color: var(--fg-a);
		width: fit-content;
		margin: 0 auto;
		padding: 0.25rem 1rem;
		font-family: var(--font-a);
		letter-spacing: 0.1rem;
		border-radius: var(--radius);
		border: none;
	}
</style>
