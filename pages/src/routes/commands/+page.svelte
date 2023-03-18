<script lang="ts">
	import {
		DataTable,
		Pagination,
		Toolbar,
		ToolbarContent,
		ToolbarSearch
	} from 'carbon-components-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const commandKeys = Object.keys(data.commands);
	const headers = [
		{ key: 'name', value: 'コマンド名', width: '30%' },
		{ key: 'value', value: '内容' }
	];
	let rows: { id: string; name: string; value: string }[] = [];
	commandKeys.forEach((key, i) => {
		const newRow = { id: String(rows.length), name: key, value: data.commands[key] };
		rows.push(newRow);
	});

	let pageSize = 10;
	let page = 1;
</script>

<svelte:head>
	<title>Commands</title>
	<meta name="description" content="ArikenCompany - Commands" />
</svelte:head>

<div class="commands-table inline-center" style="margin-bottom: auto">
	<DataTable
		title="Commands"
		description="ArikenCompanyの現在有効なコマンド一覧です。これはリアルタイムで更新されます。"
		{headers}
		{rows}
		{pageSize}
		{page}
	>
		<Toolbar>
			<ToolbarContent>
				<ToolbarSearch
					shouldFilterRows={(row, value) => {
						value = value.toString();
						if (value.trim().length === 0) return true;
						return row.name.includes(value) || row.value.includes(value);
					}}
				/>
			</ToolbarContent>
		</Toolbar>
	</DataTable>

	<Pagination
		class="inline-center"
		bind:pageSize
		bind:page
		totalItems={rows.length}
		itemsPerPageText="ページごとのコマンド個数"
		pageRangeText={(current, total) => `/ ${total}`}
		itemRangeText={(min, max, total) => `${max} / ${total}`}
		forwardText="次へ"
		backwardText="戻る"
	/>
</div>

<style>
	.commands-table {
		margin-top: 5%;
		width: 70%;
		height: 100%;
	}

	@media (max-width: 540px) {
		.commands-table {
			width: 540px;
			margin-top: 15%;
		}
		:global(footer) {
			width: 540px;
			margin-top: 130px;
		}
		:global(.bx--data-table-container) {
			overflow: scroll;
		}
	}

	@media (min-width: 541px) and (max-width: 600px) {
		.commands-table {
			width: 100%;
			margin-top: 15%;
		}
	}

	@media (min-width: 601px) and (max-width: 800px) {
		.commands-table {
			width: 90%;
		}
	}

	@media (min-width: 601px) and (max-width: 1100px) {
		.commands-table {
			margin-top: 10%;
		}
	}
</style>
