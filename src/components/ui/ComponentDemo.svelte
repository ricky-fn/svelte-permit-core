<script lang="ts">
	import ComponentAccessControl from "$lib/ComponentAccessControl.svelte";
    import { faCube } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa';
	import classNames from "classnames";
    import { getContext } from "svelte";
    import type { BundledLanguage } from 'shiki/bundle/web';
	import type { Writable } from "svelte/store";
	import { createComponentAccessAction, type AccessControl, type ComponentAccessAction, type ComponentAccessPermission, type Group, type Role } from "permit-core";
    import { DEMO_DATA } from "$constants/demo";
	import LivePanel from "$components/LivePanel.svelte";
	import PermissionBreakdown from "./PermissionBreakdown.svelte";
	import DemoCodeBlock from "./DemoCodeBlock.svelte";
    
    const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
    const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");
    const accessControl = getContext<AccessControl>('AccessControl');

    const adminPanelIdentifier = DEMO_DATA.components.adminPanel.identifier;
    const contentPanelIdentifier = DEMO_DATA.components.contentPanel.identifier;

    const {
        rolePermissions,
        groupPermissions,
        adminPanelEffectivePermissions,
        contentPanelEffectivePermissions
    } = $derived.by(() => {
        let rolePermissions = [];
        let groupPermissions = [];
        let adminPanelEffectivePermissions = [];
        let contentPanelEffectivePermissions = [];

        if ($currentRole) {
            rolePermissions = $currentRole
                .getPermissions<ComponentAccessPermission>("component")
                .filter(permission => permission.getTarget() === $currentRole)
                .map(permission => 
                    permission.getRules()
                        .filter(rule => permission.getTarget() === $currentRole && permission.rules.includes(rule))
                        .map(rule => 
                            `${rule.exclude ? '-' : '+'}${rule.identifier} (${rule.actions.join(`, ${rule.exclude ? '-' : '+'}`)})`
                        )
                )
                .flat();

            if ($currentRoleGroup) {
                groupPermissions = $currentRoleGroup.getPermissions<ComponentAccessPermission>("component")
                    .filter(permission => permission.getTarget() === $currentRoleGroup)
                    .map(permission => permission.getRules().map(rule => `${rule.exclude ? '-' : '+'}${rule.identifier} (${rule.actions.join(`, ${rule.exclude ? '-' : '+'}`)})`))
                    .flat();
            } else {
                groupPermissions = [];
            }

            const adminPanelAccessViewAction = createComponentAccessAction($currentRole.getCode(), {
                identifier: adminPanelIdentifier,
                action: 'view'
            });

            const adminPanelAccessEditAction = createComponentAccessAction($currentRole.getCode(), {
                identifier: adminPanelIdentifier,
                action: 'edit'
            });

            accessControl.checkPermissions<ComponentAccessAction>(adminPanelAccessViewAction, {
                onSuccess: () => {
                    adminPanelEffectivePermissions.push("view");
                }
            });

            accessControl.checkPermissions<ComponentAccessAction>(adminPanelAccessEditAction, {
                onSuccess: () => {
                    adminPanelEffectivePermissions.push("edit");
                }
            });

            const contentPanelAccessViewAction = createComponentAccessAction($currentRole.getCode(), {
                identifier: contentPanelIdentifier,
                action: 'view'
            });

            const contentPanelAccessEditAction = createComponentAccessAction($currentRole.getCode(), {
                identifier: contentPanelIdentifier,
                action: 'edit'
            });

            accessControl.checkPermissions<ComponentAccessAction>(contentPanelAccessViewAction, {
                onSuccess: () => {
                    contentPanelEffectivePermissions.push("view");
                }
            });

            accessControl.checkPermissions<ComponentAccessAction>(contentPanelAccessEditAction, {
                onSuccess: () => {
                    contentPanelEffectivePermissions.push("edit");
                }
            });

        } else {
            rolePermissions = [];
        }

        return {
            rolePermissions,
            groupPermissions,
            adminPanelEffectivePermissions,
            contentPanelEffectivePermissions
        };
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
            title: 'Define Component Permissions (Roles & Groups)',
            lang: 'typescript',
            code: `import { createComponentPermission } from 'permit-core';

const groupPermissions = {
  [adminGroup.getCode()]: {
    component: createComponentPermission(adminGroup, [{
      identifier: /.*/,
      actions: ['view', 'edit']
    }])
  },
  [contentGroup.getCode()]: {
    component: createComponentPermission(contentGroup, [{
      identifier: 'admin-panel',
      actions: ['edit'],
      exclude: true
    }, {
      identifier: 'content-panel',
      actions: ['view', 'edit']
    }])
  }
};

const rolePermissions = {
  [adminRole.getCode()]: {
    component: createComponentPermission(adminRole, [{
      identifier: /.*/,
      actions: ['view', 'edit']
    }])
  },
  [editorRole.getCode()]: {
    component: createComponentPermission(editorRole, [{
      identifier: 'admin-panel',
      actions: ['view']
    }, {
      identifier: 'content-panel',
      actions: ['view', 'edit']
    }])
  },
  [viewerRole.getCode()]: {
    component: createComponentPermission(viewerRole, [{
      identifier: 'content-panel',
      actions: ['view']
    }])
  }
};`
        },
        {
            title: 'Using ComponentAccessControl in Svelte',
            lang: 'svelte',
            code: `<script lang="ts">
  import AccessControlProvider from '$lib/AccessControlProvider.svelte';
  import ComponentAccessControl from '$lib/ComponentAccessControl.svelte';
  import { user } from '$stores/user.store';

  // roles, groups, rolePermissions, groupPermissions defined above
<\/script>

<AccessControlProvider {roles} {groups} account={user}>
  <ComponentAccessControl identifier="admin-panel">
    {#snippet children({ isEditable })}
      <button class="btn" disabled={!isEditable}>Edit Settings</button>
    {/snippet}
    {#snippet fallback()}
      <p>Access denied</p>
    {/snippet}
  </ComponentAccessControl>
</AccessControlProvider>`
        }
    ];

    const effectiveDisplay = $derived.by(() => {
        return adminPanelEffectivePermissions.join(', ') + ', ' + contentPanelEffectivePermissions.join(', ');
    });
</script>

{#snippet panel({ isEditable, isVisible, title, buttonText })}
    <div class="bg-blue-50 rounded-xl p-4">
        <div class="bg-white rounded-xl p-5 component-box">
            <h4 class="font-semibold text-gray-800 mb-3">{title}</h4>
            <p class="mb-3">Status: <span class={classNames("font-medium", {
                "text-green-600": isEditable,
                "text-yellow-600": (!isVisible && isEditable) || (isVisible && !isEditable),
                "text-red-600": !isEditable && !isVisible,
            })}>{isEditable && isVisible ? 'Access granted (edit/view)' : isVisible ? 'Access granted (view only)' : 'Access denied'}</span></p>
            {#if isVisible}
                <button id="editAdminBtn" class={classNames("py-2 px-4 rounded-lg font-medium w-full", {
                    "bg-gray-200 text-gray-700": !isEditable,
                    "bg-primary hover:bg-primary-dark text-white": isEditable,
                })} disabled={!isEditable}>
                    {buttonText}
                </button>
            {/if}
        </div>
    </div>
{/snippet}


<LivePanel>
    <h3 class="text-xl font-semibold text-primary mb-4">
        <Fa icon={faCube} class="mr-2 inline-block"/>
        Component Access Control
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ComponentAccessControl identifier={adminPanelIdentifier}>
            {#snippet children({ isEditable })}
                {@render panel({ isEditable, isVisible: true, title: 'Admin Panel Component', buttonText: 'Edit Settings' })}
            {/snippet}
            {#snippet fallback()}
                {@render panel({ isEditable: false, isVisible: false, title: 'Admin Panel Component', buttonText: 'Edit Settings' })}
            {/snippet}
        </ComponentAccessControl>
        <ComponentAccessControl identifier={contentPanelIdentifier}>
            {#snippet children({ isEditable })}
                {@render panel({ isEditable, isVisible: true, title: 'Content Editor Component', buttonText: 'Edit Content' })}
            {/snippet}
            {#snippet fallback()}
                {@render panel({ isEditable: false, isVisible: false, title: 'Content Editor Component', buttonText: 'Edit Content' })}
            {/snippet}
        </ComponentAccessControl>
    </div>

    <PermissionBreakdown
        rolePermissions={rolePermissions}
        groupPermissions={groupPermissions}
        effectivePermissions={adminPanelEffectivePermissions}
        effectiveLabel="Admin Panel Effective Permissions"
        effectiveDisplay={effectiveDisplay}
    />
</LivePanel>

<DemoCodeBlock {configs} />