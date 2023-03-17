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

	import { page } from '$app/stores';
	import HOME_ICON from '$lib/components/home.svelte';
	import CHATTERS_ICON from '$lib/components/chatters.svelte';
	import COMMANDS_ICON from '$lib/components/commands.svelte';
	import DASHBOARD_ICON from '$lib/components/dashboard.svelte';

	let isSideNavOpen = true;
</script>

<Header platformName="ArikenCompany" href="/" persistentHamburgerMenu={true} bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>

	<HeaderNav>
		<HeaderNavItem href="/commands" text="Commands" />
		<HeaderNavItem href="/chatters" text="Chatters" />
		<HeaderNavItem href="/dashboard" text="Dashboard" />
	</HeaderNav>
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
		<SideNavLink
			text="DashBoard"
			icon={DASHBOARD_ICON}
			href="/dashboard"
			isSelected={$page.url.pathname === '/dashboard'}
		/>
	</SideNavItems>
</SideNav>
