<script lang="ts">
	import ComponentAccessControl from "$lib/ComponentAccessControl.svelte";
    import { faCube } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa';
	import classNames from "classnames";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import { createComponentAccessAction, type AccessControl, type ComponentAccessAction, type ComponentAccessPermission, type Group, type Role } from "permit-core";

    const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
    const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");
    const accessControl = getContext<AccessControl>('AccessControl');

    const adminPanelIdentifier = "admin-panel";
    const contentPanelIdentifier = "content-panel";

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
                            `${rule.identifier} (${rule.actions.join(', ')})`
                        )
                )
                .flat();

            if ($currentRoleGroup) {
                groupPermissions = $currentRoleGroup.getPermissions<ComponentAccessPermission>("component")
                    .filter(permission => permission.getTarget() === $currentRoleGroup)
                    .map(permission => permission.getRules().map(rule => `${rule.identifier} (${rule.actions.join(', ')})`))
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
            <button id="editAdminBtn" class={classNames("py-2 px-4 rounded-lg font-medium w-full", {
                "bg-gray-200 text-gray-700": !isEditable,
                "bg-primary hover:bg-primary-dark text-white": isEditable,
            })} disabled={!isEditable}>
                {buttonText}
            </button>
        </div>
    </div>
{/snippet}

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

<div class="bg-purple-50 rounded-xl p-4">
    <h4 class="font-semibold text-gray-800 mb-3">Permission Breakdown</h4>
    <div class="bg-white rounded-xl p-4 text-sm">
        <div class="flex justify-between py-1 border-b border-gray-100">
            <span>Base Role Permissions:</span>
            <span id="rolePermissions" class="font-medium">{rolePermissions.join(', ')}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-gray-100">
            <span>Group Inheritance:</span>
            <span id="groupPermissions" class="font-medium">{groupPermissions.join(', ')}</span>
        </div>
        <div class="flex justify-between py-1 font-bold">
            <span>Effective Permissions:</span>
            <span id="effectivePermissions" class="text-primary">
                {adminPanelEffectivePermissions.length > 0 ? `${adminPanelIdentifier} (${adminPanelEffectivePermissions.join(', ')})` : '-'}
                {contentPanelEffectivePermissions.length > 0 ? `${contentPanelIdentifier} (${contentPanelEffectivePermissions.join(', ')})` : '-'}
            </span>
        </div>
    </div>
</div>