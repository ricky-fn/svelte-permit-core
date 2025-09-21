<script lang="ts">
	import Header from "$components/Header.svelte";
	import FeaturesTabs from "$components/FeaturesTabs.svelte";
	import ConfigurationPanel from "$components/ConfigurationPanel.svelte";
	import { user } from "$stores/user.store";
	import AccessControlProvider from "$lib/AccessControlProvider.svelte";
	import Footer from "$components/Footer.svelte";
	import { createComponentPermission, createDropdownPermission, createGroup, createMenuPermission, createRole, createRoutePermission } from "permit-core";
	import { writable } from "svelte/store";
	import { DEMO_DATA } from "$constants/demo";
	import { onMount } from "svelte";
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
				identifier: DEMO_DATA.menu.identifier,
				list: /.*/
			}]),
		},
		[contentGroup.getCode()]: {
			navigation: createRoutePermission(contentGroup, [{
				route: "/admin" as typeof DEMO_DATA.routes[number]['path'],
				exclude: true
			}]),
			component: createComponentPermission(contentGroup, [{
				identifier: DEMO_DATA.components.adminPanel.identifier,
				actions: ['edit'],
				exclude: true
			}, {
				identifier: DEMO_DATA.components.contentPanel.identifier,
				actions: ['view', 'edit']
			}]),
			dropdown: createDropdownPermission(contentGroup, [{
				identifier: DEMO_DATA.dropdown.identifier,
				list: ["delete-user", "change-role", "reset-password"] as typeof DEMO_DATA.dropdown.items[number]['id'][],
				exclude: true
			}]),
			menu: createMenuPermission(contentGroup, [{
				identifier: DEMO_DATA.menu.identifier,
				list: ["analytics", "admin"] as typeof DEMO_DATA.menu.items[number]['id'][],
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
				identifier: DEMO_DATA.menu.identifier,
				list: /.*/
			}]),
		},
		[editorRole.getCode()]: {
			navigation: createRoutePermission(editorRole, [{
				route: "/content" as typeof DEMO_DATA.routes[number]['path'],
			}]),
			component: createComponentPermission(editorRole, [{
				identifier: DEMO_DATA.components.adminPanel.identifier,
				actions: ['view']
			}, {
				identifier: DEMO_DATA.components.contentPanel.identifier,
				actions: ['view', 'edit']
			}]),
			dropdown: createDropdownPermission(editorRole, [{
				identifier: DEMO_DATA.dropdown.identifier,
				list: ["edit-user", "reset-password"] as typeof DEMO_DATA.dropdown.items[number]['id'][]
			}]),
			menu: createMenuPermission(editorRole, [{
				identifier: DEMO_DATA.menu.identifier,
				list: ["dashboard", "content", "settings"] as typeof DEMO_DATA.menu.items[number]['id'][]
			}]),
		},
		[viewerRole.getCode()]: {
			navigation: createRoutePermission(viewerRole, []),
			component: createComponentPermission(viewerRole, [{
				identifier: DEMO_DATA.components.contentPanel.identifier,
				actions: ['view']
			}]),
			menu: createMenuPermission(viewerRole, [{
				identifier: DEMO_DATA.menu.identifier,
				list: ["dashboard"] as typeof DEMO_DATA.menu.items[number]['id'][]
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

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
		<ConfigurationPanel/>

		{#if $currentTab === DEMO_DATA.tabs[0].id}
			<ComponentDemo />
		{:else if $currentTab === DEMO_DATA.tabs[1].id}
			<DropdownDemo />
		{:else if $currentTab === DEMO_DATA.tabs[2].id}
			<MenuDemo />
		{:else if $currentTab === DEMO_DATA.tabs[3].id}
			<RouteDemo />
		{/if}
	</div>

	<Footer/>
</AccessControlProvider>
