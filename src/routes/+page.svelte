<script lang="ts">
	import Header from "$components/Header.svelte";
	import FeaturesTabs from "$components/FeaturesTabs.svelte";
	import ConfigurationPanel from "$components/ConfigurationPanel.svelte";
	import { user } from "$stores/user.store";
	import AccessControlProvider from "$lib/AccessControlProvider.svelte";
	import Footer from "$components/Footer.svelte";
	import { createComponentPermission, createDropdownPermission, createGroup, createMenuPermission, createRole, createRoutePermission } from "permit-core";
	import { writable } from "svelte/store";
	import { DEMO_DATA } from "$lib/data/demo";
	import { onMount } from "svelte";
	import LivePanel from "$components/LivePanel.svelte";
	import ComponentDemo from "$components/ui/ComponentDemo.svelte";
	import DropdownDemo from "$components/ui/DropdownDemo.svelte";
	import MenuDemo from "$components/ui/MenuDemo.svelte";
	import RouteDemo from "$components/ui/RouteDemo.svelte";

	let currentTab = $state(writable(DEMO_DATA.tabs[0].id));
  
	const adminRole = $state(createRole(DEMO_DATA.roles[0].code));
	const editorRole = $state(createRole(DEMO_DATA.roles[1].code));
	const viewerRole = $state(createRole(DEMO_DATA.roles[2].code));

	const roles = $state([adminRole, editorRole, viewerRole]);

	const adminGroup = $state(createGroup(DEMO_DATA.groups[0].code));

	const contentGroup = $state(createGroup(DEMO_DATA.groups[1].code, adminGroup));

	const groups = $state([adminGroup, contentGroup]);

	const groupPermissions = {
		[adminGroup.getCode()]: {
			navigation: createRoutePermission(adminGroup, [{
				route: /.*/,
			}]),
			component: createComponentPermission(adminGroup, [{
				identifier: /.*/,
				actions: ['view', 'edit']
			}]),
			dropdown: createDropdownPermission(adminGroup, [{
				identifier: /.*/,
				list: /.*/
			}]),
			menu: createMenuPermission(adminGroup, [{
				identifier: "menu-items",
				list: /.*/
			}]),
		},
		[contentGroup.getCode()]: {
			navigation: createRoutePermission(contentGroup, [{
				route: "/admin" as typeof DEMO_DATA.routes[number]['path'],
				exclude: true
			}]),
			component: createComponentPermission(contentGroup, [{
				identifier: "admin-panel",
				actions: ['edit'],
				exclude: true
			}, {
				identifier: "content-panel",
				actions: ['view', 'edit']
			}]),
			dropdown: createDropdownPermission(contentGroup, [{
				identifier: "dropdown-items",
				list: ["delete-user", "change-role", "reset-password"] as typeof DEMO_DATA.dropdownItems[number]['id'][],
				exclude: true
			}]),
			menu: createMenuPermission(contentGroup, [{
				identifier: "menu-items",
				list: ["analytics", "admin"] as typeof DEMO_DATA.menuItems[number]['id'][],
				exclude: true
			}]),
		},
	}

	const rolePermissions = {
		[adminRole.getCode()]: {
			navigation: createRoutePermission(adminRole, [{
				route: /.*/,
			}]),
			component: createComponentPermission(adminRole, [{
				identifier: /.*/,
				actions: ['view', 'edit']
			}]),
			dropdown: createDropdownPermission(adminRole, [{
				identifier: /.*/,
				list: /.*/
			}]),
			menu: createMenuPermission(adminRole, [{
				identifier: "menu-items",
				list: /.*/
			}]),
		},
		[editorRole.getCode()]: {
			navigation: createRoutePermission(editorRole, [{
				route: "/content" as typeof DEMO_DATA.routes[number]['path'],
			}]),
			component: createComponentPermission(editorRole, [{
				identifier: 'admin-panel',
				actions: ['view']
			}, {
				identifier: 'content-panel',
				actions: ['view', 'edit']
			}]),
			dropdown: createDropdownPermission(editorRole, [{
				identifier: "dropdown-items",
				list: ["edit-user", "reset-password"] as typeof DEMO_DATA.dropdownItems[number]['id'][]
			}]),
			menu: createMenuPermission(editorRole, [{
				identifier: "menu-items",
				list: ["dashboard", "content", "settings"] as typeof DEMO_DATA.menuItems[number]['id'][]
			}]),
		},
		[viewerRole.getCode()]: {
			navigation: createRoutePermission(viewerRole, []),
			component: createComponentPermission(viewerRole, [{
				identifier: 'content-panel',
				actions: ['view']
			}]),
			menu: createMenuPermission(viewerRole, [{
				identifier: "menu-items",
				list: ["dashboard"] as typeof DEMO_DATA.menuItems[number]['id'][]
			}]),
		}
	}

	onMount(() => {
		user.login(DEMO_DATA.roles[0].code);
	});
</script>

<AccessControlProvider {roles} {groups} account={user}>
	<Header
		title="Access Control Library"
		description="Enterprise-grade access control system with role-based permissions, group inheritance, and extensible validation"
	/>

	<FeaturesTabs {currentTab} />

	<ConfigurationPanel/>

	<LivePanel>
		{#if $currentTab === DEMO_DATA.tabs[0].id}
			<ComponentDemo />
		{:else if $currentTab === DEMO_DATA.tabs[1].id}
			<DropdownDemo />
		{:else if $currentTab === DEMO_DATA.tabs[2].id}
			<MenuDemo />
		{:else if $currentTab === DEMO_DATA.tabs[3].id}
			<RouteDemo />
		{/if}
	</LivePanel>

	<Footer/>
</AccessControlProvider>
