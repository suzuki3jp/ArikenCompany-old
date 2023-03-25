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

	const array = Object.entries(data.chatters);
	// 名前が数字のみの人を除外する。ソートがうまくいかないため
	const filteredArray = array.filter((item) => {
		// @ts-ignore
		return isNaN(item[0]);
	});
	filteredArray.sort((a, b) => {
		// @ts-ignore
		return b[1] - a[1];
	});
	const sortedChatters = Object.fromEntries(filteredArray);
	const headers = [
		{ key: 'place', value: '順位', width: '25%' },
		{ key: 'name', value: '名前(ID)', width: '50%' },
		{ key: 'value', value: 'コメント数', width: '25%' }
	];
	let rows: { id: string; place: string; name: string; value: string }[] = [];
	const chatterNames = Object.keys(sortedChatters);
	chatterNames.forEach((key, i) => {
		const newRow = {
			id: String(rows.length),
			place: `${i + 1}`,
			name: key,
			value: sortedChatters[key]
		};
		// @ts-ignore
		rows.push(newRow);
	});

	let pageSize = 10;
	let page = 1;
</script>

<svelte:head>
	<title>Chatters</title>
	<meta name="description" content="ArikenCompany - Chatters" />
</svelte:head>

<div class="chatters-table inline-center" style="margin-bottom: auto">
	<DataTable
		title="Chatters"
		description="コメント数ランキング。これはリアルタイムで更新されます。(2022/11/18より取得開始)"
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
						return row.name.includes(value);
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
	.chatters-table {
		margin-top: 5%;
		width: 70%;
		height: 100%;
	}

	:global(.chatters-table td) {
		word-wrap: break-word;
	}

	@media (max-width: 850px) {
		.chatters-table {
			margin-top: 60px;
			width: 90%;
		}
	}
</style>
