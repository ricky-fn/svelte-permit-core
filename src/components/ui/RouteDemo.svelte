<script lang="ts">
	import { DEMO_DATA } from "$constants/demo";
    import { faRoute, faLock, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa';
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { type AccessControl, type Role, type Group, RouteAccessPermission, createRouteAccessAction, RouteAccessAction } from "permit-core";
    import classNames from "classnames";
	import RouteAccessControl from "$lib/RouteAccessControl.svelte";
    import LivePanel from "$components/LivePanel.svelte";
    import PermissionBreakdown from "./PermissionBreakdown.svelte";
    import DemoCodeBlock from "./DemoCodeBlock.svelte";
    import type { BundledLanguage } from 'shiki/bundle/web';

    let currentRoute = $state<typeof DEMO_DATA.routes[number]['path']>("/admin");
    const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
    const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");
    const accessControl = getContext<AccessControl>('AccessControl');

    let currentRouteName = $derived.by(() => DEMO_DATA.routes.find(route => route.path === currentRoute)?.name);

    const {
        rolePermissions,
        groupPermissions,
        adminPanelEffectivePermission,
        contentPanelEffectivePermission,
        isCurrentRouteAccessible
    } = $derived.by(() => {
        let rolePermissions = [];
        let groupPermissions = [];
        let adminPanelEffectivePermission = false;
        let contentPanelEffectivePermission = false;
        let isCurrentRouteAccessible = false;

        if ($currentRole) {
            rolePermissions = $currentRole
                .getPermissions<RouteAccessPermission>("navigation")
                .filter(permission => permission.getTarget() === $currentRole)
                .map(permission => 
                    permission.getRules()
                        .filter(rule => permission.getTarget() === $currentRole && permission.rules.includes(rule))
                        .map(rule => `${rule.exclude ? '-' : '+'}${rule.route}`)
                )
                .flat();

            if ($currentRoleGroup) {
                groupPermissions = $currentRoleGroup.getPermissions<RouteAccessPermission>("navigation")
                    .filter(permission => permission.getTarget() === $currentRoleGroup)
                    .map(permission => permission.getRules().map(rule => `${rule.exclude ? '-' : '+'}${rule.route}`))
                    .flat();
            } else {
                groupPermissions = [];
            }

            const adminPanelAccessAction = createRouteAccessAction($currentRole.getCode(), {
                route: DEMO_DATA.routes[0].path
            });

            accessControl.checkPermissions<RouteAccessAction>(adminPanelAccessAction, {
                onSuccess: () => {
                    adminPanelEffectivePermission = true;
                }
            });

            const contentPanelAccessAction = createRouteAccessAction($currentRole.getCode(), {
                route: DEMO_DATA.routes[1].path
            });

            accessControl.checkPermissions<RouteAccessAction>(contentPanelAccessAction, {
                onSuccess: () => {
                    contentPanelEffectivePermission = true;
                }
            });
        } else {
            rolePermissions = [];
            groupPermissions = [];
            adminPanelEffectivePermission = false;
            contentPanelEffectivePermission = false;
        }

        isCurrentRouteAccessible = currentRoute === DEMO_DATA.routes[0].path ? adminPanelEffectivePermission : contentPanelEffectivePermission;

        return {
            rolePermissions,
            groupPermissions,
            adminPanelEffectivePermission,
            contentPanelEffectivePermission,
            isCurrentRouteAccessible
        };
    });

    let availableRoutes = $derived.by(() => {
        return [DEMO_DATA.routes[0].path, DEMO_DATA.routes[1].path];
    });

	const configs: { title: string; lang: BundledLanguage; code: string }[] = [
		{
			title: 'Create Roles and Groups',
			lang: 'typescript',
			code: `import { createRole, createGroup } from 'permit-core';

const adminRole = createRole('admin');
const editorRole = createRole('editor');
const viewerRole = createRole('viewer');

const roles = [adminRole, editorRole, viewerRole];

const adminGroup = createGroup('admin');
const contentGroup = createGroup('content', adminGroup);

const groups = [adminGroup, contentGroup];`
		},
		{
			title: 'Define Route Permissions (Roles & Groups)',
			lang: 'typescript',
			code: `import { createRoutePermission } from 'permit-core';

const groupPermissions = {
  [adminGroup.getCode()]: {
    navigation: createRoutePermission(adminGroup, [{
      route: /.*/,
    }])
  },
  [contentGroup.getCode()]: {
    navigation: createRoutePermission(contentGroup, [{
      route: '/admin',
      exclude: true
    }])
  }
};

const rolePermissions = {
  [adminRole.getCode()]: {
    navigation: createRoutePermission(adminRole, [{
      route: /.*/,
    }])
  },
  [editorRole.getCode()]: {
    navigation: createRoutePermission(editorRole, [{
      route: '/content',
    }])
  },
  [viewerRole.getCode()]: {
    navigation: createRoutePermission(viewerRole, [])
  }
};`
		},
		{
			title: 'Using RouteAccessControl in Svelte',
			lang: 'svelte',
			code: `<script lang="ts">
  import AccessControlProvider from '$lib/AccessControlProvider.svelte';
  import RouteAccessControl from '$lib/RouteAccessControl.svelte';
  import { user } from '$stores/user.store';
<\/script>

<AccessControlProvider {roles} {groups} account={user}>
  <RouteAccessControl route="/admin">
    {#snippet children()}
      <p>Access granted to Admin Panel</p>
    {/snippet}
    {#snippet fallback()}
      <p>Access denied</p>
    {/snippet}
  </RouteAccessControl>
  <RouteAccessControl route="/content">
    {#snippet children()}
      <p>Access granted to Content Panel</p>
    {/snippet}
    {#snippet fallback()}
      <p>Access denied</p>
    {/snippet}
  </RouteAccessControl>
</AccessControlProvider>`
		}
	];
</script>

{#snippet fallback()}
    <div class="bg-white rounded-lg p-4">
        <div class="text-center py-4 rounded-lg bg-red-50">
            <Fa icon={faLock} class="inline-block text-2xl mb-2 text-red-500"/>
            <p>Access denied to {currentRouteName}</p>
        </div>
    </div>
{/snippet}

<LivePanel>
    <h3 class="text-xl font-semibold text-primary mb-4">
        <Fa icon={faRoute} class="mr-2 inline-block"/>
        Route Access Control
    </h3>

    <div class="bg-blue-50 rounded-xl p-4 mb-4">
        <div class="route-display bg-white rounded-lg p-4 mb-4">
            <span class="text-gray-600">Current route:</span>
            <span class="font-medium">{currentRoute}</span>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
            <button 
                class="py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                onclick={() => currentRoute = DEMO_DATA.routes[0].path}
            >
                Go to Admin Panel
            </button>
            <button 
                class="py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                onclick={() => currentRoute = DEMO_DATA.routes[1].path}
            >
                Go to Content Panel
            </button>
        </div>
    </div>

    <div class="bg-green-50 rounded-xl p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 class="font-semibold text-gray-800 mb-3">Route Permissions</h4>
                <div class="bg-white rounded-lg p-4">
                    <div class="flex justify-between py-1 border-b border-gray-100">
                        <span>{DEMO_DATA.routes[0].path}</span>
                        <span class={classNames("font-medium", {
                            "text-green-500": adminPanelEffectivePermission,
                            "text-red-500": !adminPanelEffectivePermission,
                        })}>{adminPanelEffectivePermission ? 'Allowed' : 'Denied'}</span>
                    </div>
                    <div class="flex justify-between py-1">
                        <span>{DEMO_DATA.routes[1].path}</span>
                        <span class={classNames("font-medium", {
                            "text-green-500": contentPanelEffectivePermission,
                            "text-red-500": !contentPanelEffectivePermission,
                        })}>{contentPanelEffectivePermission ? 'Allowed' : 'Denied'}</span>
                    </div>
                </div>
            </div>
            <div>
                <h4 class="font-semibold text-gray-800 mb-3">Access Status</h4>
                {#if currentRoute === DEMO_DATA.routes[0].path}
                <RouteAccessControl route="/admin" {fallback}>
                    <div class="bg-white rounded-lg p-4">
                        <div class="text-center py-4 rounded-lg bg-green-50">
                            <Fa icon={faCheckCircle} class="inline-block text-2xl mb-2 text-green-500"/>
                            <p>Access granted to Admin Panel</p>
                        </div>
                    </div>
                </RouteAccessControl>
                {:else if currentRoute === DEMO_DATA.routes[1].path}
                <RouteAccessControl route="/content" {fallback}>
                    <div class="bg-white rounded-lg p-4">
                        <div class="text-center py-4 rounded-lg bg-green-50">
                            <Fa icon={faCheckCircle} class="inline-block text-2xl mb-2 text-green-500"/>
                            <p>Access granted to Content Panel</p>
                        </div>
                    </div>
                </RouteAccessControl>
                {/if}
            </div>
        </div>
    </div>

    <PermissionBreakdown
        rolePermissions={rolePermissions}
        groupPermissions={groupPermissions}
        effectivePermissions={adminPanelEffectivePermission ? [DEMO_DATA.routes[0].path] : []}
        effectiveLabel="Available Routes"
        effectiveDisplay={availableRoutes.join(', ')}
    />
</LivePanel>

<DemoCodeBlock {configs} />