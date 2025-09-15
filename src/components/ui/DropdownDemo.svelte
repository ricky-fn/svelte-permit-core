<script lang="ts">
	import { DEMO_DATA } from "$lib/data/demo";
	import DropdownAccessControl from "$lib/DropdownAccessControl.svelte";
    import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
	import classNames from "classnames";
    import Fa from 'svelte-fa';
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { type AccessControl, type Role, type Group, createDropdownPermission, createDropdownAccessAction } from "permit-core";

    let isDropdownOpen = $state(false);

    const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
    const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");
    const accessControl = getContext<AccessControl>('AccessControl');

    const items = $derived(DEMO_DATA.dropdownItems.map(item => item.id));

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
                .getPermissions<ReturnType<typeof createDropdownPermission>>("dropdown")
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
                groupPermissions = $currentRoleGroup.getPermissions<ReturnType<typeof createDropdownPermission>>("dropdown")
                    .filter(permission => permission.getTarget() === $currentRoleGroup)
                    .map(permission => permission.getRules().map(rule => `${rule.exclude ? '-' : '+'}${rule.list instanceof Array ? rule.list.join(`, ${rule.exclude ? '-' : '+'}`) : rule.list}`))
                    .flat();
            } else {
                groupPermissions = [];
            }

            const dropdownAccessAction = createDropdownAccessAction($currentRole.getCode(), {
                identifier: "dropdown-items",
                dropdown: items as string[]
            });

            accessControl.checkPermissions<ReturnType<typeof createDropdownAccessAction>>(dropdownAccessAction, {
                onSuccess: (action) => {
                    const dropdownAccessPermission = $currentRole.getPermissions<ReturnType<typeof createDropdownPermission>>("dropdown")[0];
                    effectivePermissions = dropdownAccessPermission.getAccessibleList(action) as Array<string>;
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
    <Fa icon={faCaretDown} class="mr-2 inline-block"/>
    Dropdown Access Control
</h3>

<div class="bg-blue-50 rounded-xl p-4 mb-4">
    <div class="relative inline-block w-full">
        <button 
            onclick={() => isDropdownOpen = !isDropdownOpen}
            class="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium flex justify-between items-center">
            <span>Admin Actions</span>
            <Fa icon={faCaretDown} class={classNames("inline-block", {
                "rotate-180": isDropdownOpen
            })}/>
        </button>
        <div class={classNames("absolute w-full mt-2 bg-white rounded-lg shadow-lg dropdown-menu z-10", {
            "hidden": !isDropdownOpen,
            "block": isDropdownOpen
        })}>
            <div class="py-2">
                <DropdownAccessControl
                    identifier="dropdown-items"
                    list={items}
                >
                    {#snippet children({ isEditable, item })}
                        <div class={classNames("dropdown-item px-4 py-2", {
                            "hover:bg-gray-100 cursor-pointer": isEditable,
                            "bg-gray-300 cursor-not-allowed": !isEditable,
                        })}>{DEMO_DATA.dropdownItems.find(i => i.id === item)?.name}</div>
                    {/snippet}
                </DropdownAccessControl>
            </div>
        </div>
    </div>
</div>

<div class="bg-green-50 rounded-xl p-4 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">Accessible Items</h4>
            <div class="bg-white rounded-lg p-4 min-h-[120px]">
                <ul id="accessibleItems" class="space-y-2">
                    <DropdownAccessControl
                        identifier="dropdown-items"
                        list={items}
                    >
                        {#snippet children({ isEditable, item })}
                            <li class="flex items-center">
                                <div class={classNames("w-3 h-3 rounded-full mr-2", {
                                    "bg-green-500": isEditable,
                                    "bg-red-500": !isEditable,
                                })}></div>
                                <span>{DEMO_DATA.dropdownItems.find(i => i.id === item)?.name}</span>
                            </li>
                        {/snippet}
                    </DropdownAccessControl>
                </ul>
            </div>
        </div>
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">Permissions</h4>
            <div class="bg-white rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span class="text-sm">Allowed</span>
                </div>
                <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span class="text-sm">Denied</span>
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
            <span>Available Dropdown Items:</span>
            <span id="effectivePermissions" class="text-primary">
                {effectivePermissions.length > 0 ? `${effectivePermissions.join(', ')}` : '-'}
            </span>
        </div>
    </div>
</div>