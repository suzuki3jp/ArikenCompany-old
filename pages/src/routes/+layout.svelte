<script>
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		SkipToContent,
		SideNav,
		SideNavItems,
		SideNavLink
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/g80.css';
	import './common.css';

	import { page } from '$app/stores';
	import HOME_ICON from '$lib/components/home.svelte';
	import CHATTERS_ICON from '$lib/components/chatters.svelte';
	import COMMANDS_ICON from '$lib/components/commands.svelte';
	import GITHUB_ICON from '$lib/images/github.png';

	let isSideNavOpen = true;
</script>

<div class="app">
	<Header platformName="ArikenCompany" href="/" persistentHamburgerMenu={true} bind:isSideNavOpen>
		<svelte:fragment slot="skip-to-content">
			<SkipToContent />
		</svelte:fragment>

		<HeaderNav style="margin-right: auto;">
			<HeaderNavItem href="/commands" text="Commands" />
			<HeaderNavItem href="/chatters" text="Chatters" />
		</HeaderNav>

		<a href="https://github.com/suzuki3jp/arikencompany">
			<img src={GITHUB_ICON} alt="github icon" style="width: 25px; margin-right: 15px;" />
		</a>
	</Header>

	<SideNav bind:isOpen={isSideNavOpen}>
		<SideNavItems>
			<SideNavLink text="HOME" icon={HOME_ICON} href="/" isSelected={$page.url.pathname === '/'} />
			<SideNavLink
				text="Commands"
				icon={COMMANDS_ICON}
				href="/commands"
				isSelected={$page.url.pathname === '/commands'}
			/>
			<SideNavLink
				text="Chatters"
				icon={CHATTERS_ICON}
				href="/chatters"
				isSelected={$page.url.pathname === '/chatters'}
			/>
		</SideNavItems>
	</SideNav>

	<slot />

	<footer>
		<div class="text-center" style="margin-bottom: 1%;">
			Copyright (c) <a href="https://github.com/suzuki3jp">suzuki3jp</a> All Rights Reserved
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
