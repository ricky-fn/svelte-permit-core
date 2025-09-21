<script lang="ts">
	import { DEMO_DATA } from "$constants/demo";
	import MenuAccessControl from "$lib/MenuAccessControl.svelte";
    import { faBars } from "@fortawesome/free-solid-svg-icons";
	import classNames from "classnames";
    import Fa from 'svelte-fa';
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { type AccessControl, type Role, type Group, MenuAccessPermission, MenuAccessAction } from "permit-core";
    import LivePanel from "$components/LivePanel.svelte";
    import PermissionBreakdown from "./PermissionBreakdown.svelte";
    import DemoCodeBlock from "$components/ui/DemoCodeBlock.svelte";
    import type { BundledLanguage } from 'shiki/bundle/web';
    
    const menuItems = $derived(DEMO_DATA.menu.items.map(item => item.id));

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
                identifier: DEMO_DATA.menu.identifier,
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
            title: 'Define Menu Permissions (Roles & Groups)',
            lang: 'typescript',
            code: `import { createMenuPermission } from 'permit-core';

const groupPermissions = {
  [adminGroup.getCode()]: {
    menu: createMenuPermission(adminGroup, [{
      identifier: 'menu-items',
      list: /.*/
    }])
  },
  [contentGroup.getCode()]: {
    menu: createMenuPermission(contentGroup, [{
      identifier: 'menu-items',
      list: ['analytics', 'admin'],
      exclude: true
    }])
  }
};

const rolePermissions = {
  [adminRole.getCode()]: {
    menu: createMenuPermission(adminRole, [{
      identifier: 'menu-items',
      list: /.*/
    }])
  },
  [editorRole.getCode()]: {
    menu: createMenuPermission(editorRole, [{
      identifier: 'menu-items',
      list: ['dashboard', 'content', 'settings']
    }])
  },
  [viewerRole.getCode()]: {
    menu: createMenuPermission(viewerRole, [{
      identifier: 'menu-items',
      list: ['dashboard']
    }])
  }
};`
        },
        {
            title: 'Using MenuAccessControl in Svelte',
            lang: 'svelte',
            code: `<script lang="ts">
    import AccessControlProvider from '$lib/AccessControlProvider.svelte';
    import MenuAccessControl from '$lib/MenuAccessControl.svelte';
    import { DEMO_DATA } from '$lib/data/demo';
    import { user } from '$stores/user.store';
    import classNames from 'classnames';

    const menuItems = DEMO_DATA.menu.items.map(item => item.id);
<\/script>
<AccessControlProvider {roles} {groups} account={user}>\n  <ul class=\"space-y-2\">\n    <MenuAccessControl\n      identifier={DEMO_DATA.menu.identifier}\n      menuList={menuItems}\n    >\n      {#snippet children({ menu, isEditable })}\n        <li class=\"flex items-center\">\n          <div class={classNames(\"w-3 h-3 rounded-full mr-2\", {\n            \"bg-green-500\": isEditable,\n            \"bg-red-500\": !isEditable,\n          })}></div>\n          <span>{DEMO_DATA.menu.items.find(item => item.id === menu)?.name}</span>\n        </li>\n      {/snippet}\n    </MenuAccessControl>\n  </ul>\n</AccessControlProvider>`
        }
    ];
</script>

<LivePanel>
    <h3 class="text-xl font-semibold text-primary mb-4">
        <Fa icon={faBars} class="mr-2 inline-block"/>
        Menu Access Control
    </h3>

    <div class="bg-blue-50 rounded-xl p-4 mb-4">
        <div class="bg-white rounded-lg p-4">
            <div class="flex space-x-4 justify-center">
                <MenuAccessControl
                    identifier={DEMO_DATA.menu.identifier}
                    menuList={menuItems}
                >
                    {#snippet children({ menu, isEditable })}
                        {#if isEditable}
                            <div class="menu-item px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">{DEMO_DATA.menu.items.find(item => item.id === menu)?.name}</div>
                        {/if}
                    {/snippet}
                </MenuAccessControl>
            </div>
        </div>
    </div>

    <div class="bg-green-50 rounded-xl p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 class="font-semibold text-gray-800 mb-3">Accessible Menu Items</h4>
                <div class="bg-white rounded-lg p-4 min-h-[120px]">
                    <ul id="accessibleMenuItems" class="space-y-2">
                        <MenuAccessControl
                            identifier={DEMO_DATA.menu.identifier}
                            menuList={menuItems}
                        >
                            {#snippet children({ menu, isEditable })}
                                <li class="flex items-center">
                                    <div class={classNames("w-3 h-3 rounded-full mr-2", {
                                        "bg-green-500": isEditable,
                                        "bg-red-500": !isEditable,
                                    })}></div>
                                    <span>{DEMO_DATA.menu.items.find(item => item.id === menu)?.name}</span>
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

    <PermissionBreakdown
        rolePermissions={rolePermissions}
        groupPermissions={groupPermissions}
        effectivePermissions={effectivePermissions}
        effectiveLabel="Menu Effective Permissions"
        effectiveDisplay={effectivePermissions.join(', ')}
    />
</LivePanel>

<DemoCodeBlock {configs} />