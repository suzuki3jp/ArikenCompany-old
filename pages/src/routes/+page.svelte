<script>
	import { Content } from 'carbon-components-svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="ArikenCompany" />
</svelte:head>

<Content class="text-center" style="margin-bottom: auto;">
	<div class="font-weight-middle main">
		<h1 class="font-weight-bold ArikenCompany-font" style="display: inline-block; margin-top: 2%">
			ArikenCompany
		</h1>
		<div style="margin-top: 10%;">
			ArikenCompanyは
			<a href="https://www.twitch.tv/arikendebu">ありけんのTwitch</a>
			チャンネルのチャットでコマンド機能をサポートしています。
		</div>
		<div style="margin-top: 20px;">
			<a href="https://nightbot.tv">Nightbot</a>
			をモデルに作成しており、サイトとBotのソースコードは
			<a href="https://github.com/suzuki3jp/arikencompany">GitHub</a>
			にて公開されています。
		</div>
		<div style="margin-top: 20px;">
			機能リクエスト、バグ報告、その他連絡がある場合は
			<a href="https://www.twitter.com/messages/compose?recipient_id=1538905179311185922">
				TwitterのDM
			</a>
			へお願いします。
		</div>
	</div>
</Content>

<style>
	.main {
		margin-top: 2%;
		font-size: 25px;
		line-height: 40px;
	}

	@media (max-width: 550px) {
		.main {
			font-size: 15px;
			line-height: 30px;
			width: 100%;
		}
	}

	@media (min-width: 551px) and (max-width: 700px) {
		.main {
			font-size: 20px;
		}
	}
</style>
