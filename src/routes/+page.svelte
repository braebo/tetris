<script lang="ts">
	import { tetris, key } from '$lib/Tetris'
	import { dev } from '$app/environment'

	tetris.debug = dev
</script>

{#key $key}
	<div class="tetris">
		{#each tetris.grid.cells as row, i}
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
{/key}

<style lang="scss">
	.tetris {
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
</style>
