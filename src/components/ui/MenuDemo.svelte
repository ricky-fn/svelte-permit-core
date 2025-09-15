<script lang="ts">
	import { DEMO_DATA } from "$lib/data/demo";
	import MenuAccessControl from "$lib/MenuAccessControl.svelte";
    import { faBars } from "@fortawesome/free-solid-svg-icons";
	import classNames from "classnames";
    import Fa from 'svelte-fa';
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { type AccessControl, type Role, type Group, MenuAccessPermission, MenuAccessAction } from "permit-core";

    const menuItems = $derived(DEMO_DATA.menuItems.map(item => item.id));

    const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
    const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");
    const accessControl = getContext<AccessControl>('AccessControl');

    const {
        rolePermissions,
        groupPermissions,
        effectivePermissions
    } = $derived.by(() => {
        let rolePermissions = [];
        let groupPermissions = [];
        let effectivePermissions = [];

        if ($currentRole) {
            rolePermissions = $currentRole
                .getPermissions<MenuAccessPermission>("menu")
                .filter(permission => permission.getTarget() === $currentRole)
                .map(permission => 
                    permission.getRules()
                        .filter(rule => permission.getTarget() === $currentRole && permission.rules.includes(rule))
                        .map(rule => 
                            `${rule.exclude ? '-' : '+'}${rule.list instanceof Array ? rule.list.join(`, ${rule.exclude ? '-' : '+'}`) : rule.list}`
                        )
                    )
                .flat();

            if ($currentRoleGroup) {
                groupPermissions = $currentRoleGroup.getPermissions<MenuAccessPermission>("menu")
                    .filter(permission => permission.getTarget() === $currentRoleGroup)
                    .map(permission => permission.getRules().map(rule => 
                        `${rule.exclude ? '-' : '+'}${rule.list instanceof Array ? rule.list.join(`, ${rule.exclude ? '-' : '+'}`) : rule.list}`
                    )
                )
                .flat();
            } else {
                groupPermissions = [];
            }

            const menuAccessAction = new MenuAccessAction($currentRole.getCode(), {
                identifier: "menu-items",
                menu: menuItems as string[]
            });

            accessControl.checkPermissions<MenuAccessAction>(menuAccessAction, {
                onSuccess: (action) => {
                    const menuAccessPermission = $currentRole.getPermissions<MenuAccessPermission>("menu")[0];
                    effectivePermissions = menuAccessPermission.getAccessibleList(action) as Array<string>;
                },
                onFailure: () => {
                    effectivePermissions = [];
                }
            });
        } else {
            rolePermissions = [];
            groupPermissions = [];
            effectivePermissions = [];
        }

        return {
            rolePermissions,
            groupPermissions,
            effectivePermissions
        };
    });
</script>

<h3 class="text-xl font-semibold text-primary mb-4">
    <Fa icon={faBars} class="mr-2 inline-block"/>
    Menu Access Control
</h3>

<div class="bg-blue-50 rounded-xl p-4 mb-4">
    <div class="bg-white rounded-lg p-4">
        <div class="flex space-x-4 justify-center">
            <MenuAccessControl
                identifier="menu-items"
                menuList={menuItems}
            >
                {#snippet children({ menu, isEditable })}
                    {#if isEditable}
                        <div class="menu-item px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">{DEMO_DATA.menuItems.find(item => item.id === menu)?.name}</div>
                    {/if}
                {/snippet}
            </MenuAccessControl>
        </div>
    </div>
</div>

<div class="bg-green-50 rounded-xl p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">Accessible Menu Items</h4>
            <div class="bg-white rounded-lg p-4 min-h-[120px]">
                <ul id="accessibleMenuItems" class="space-y-2">
                    <MenuAccessControl
                        identifier="menu-items"
                        menuList={menuItems}
                    >
                        {#snippet children({ menu, isEditable })}
                            <li class="flex items-center">
                                <div class={classNames("w-3 h-3 rounded-full mr-2", {
                                    "bg-green-500": isEditable,
                                    "bg-red-500": !isEditable,
                                })}></div>
                                <span>{DEMO_DATA.menuItems.find(item => item.id === menu)?.name}</span>
                            </li>
                        {/snippet}
                    </MenuAccessControl>
                </ul>
            </div>
        </div>
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">Permissions</h4>
            <div class="bg-white rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span class="text-sm">Visible</span>
                </div>
                <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span class="text-sm">Hidden</span>
                </div>
            </div>
        </div>
    </div>
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
            <span>Available Menu Items:</span>
            <span id="effectivePermissions" class="text-primary">
                {effectivePermissions.length > 0 ? `${effectivePermissions.join(', ')}` : '-'}
            </span>
        </div>
    </div>
</div>