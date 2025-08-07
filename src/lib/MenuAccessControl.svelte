<script lang="ts" module>
	export type MenuAccessRules<T = string[]> = Partial<Record<string, T>>;
</script>

<script lang="ts">
	import { MenuAccessAction, type RolePermissionGroup, type AccessControl, type Role, Permission } from 'permit-core';
	import type { Writable } from 'svelte/store';   
	import { getContext, type Snippet } from 'svelte';

	type T = $$Generic;

    const { menuList, identifier, children }: { menuList: Array<T>, identifier: string, children: Snippet<[{ isEditable: boolean; role: Writable<Role>; menu: T; index: number }]> } = $props();

	const accessControl = getContext<Writable<AccessControl>>('AccessControl');
	const currentRole = getContext<Writable<Role | undefined>>('CurrentAccessRole');
	const permissions = getContext<Writable<RolePermissionGroup<string>>>('AccessPermissions');

	let accessibleMenu = $state<Array<T>>([]);
	let currentRoleCode = $state<string>();
	let currentRolePermissions = $state<Permission[]>([]);
	let currentRoleGroupCode = $state<string | undefined>();

	$effect(() => {
		if (
			$currentRole && 
			($currentRole.getCode() !== currentRoleCode 
			|| $currentRole.getGroup()?.getCode() !== currentRoleGroupCode
			|| $currentRole.getPermissions().length !== currentRolePermissions.length)
		) {
			currentRoleCode = $currentRole.getCode();
			currentRoleGroupCode = $currentRole.getGroup()?.getCode();
			currentRolePermissions = $currentRole.getPermissions();

			const menuAccessAction = new MenuAccessAction(currentRoleCode, {
				identifier,
				menu: menuList as string[]
			});

			$accessControl.checkPermissions<MenuAccessAction>(menuAccessAction, {
				onSuccess: (action) => {
					const menuAccessPermission = $permissions[action.getRoleCode()][action.getType()];
					accessibleMenu = menuAccessPermission.getAccessibleList(action) as Array<T>;
				},
				onFailure: () => {
					accessibleMenu = [];
				}
			});
		}
	});
</script>

{#each menuList as menu, index}
    {children({ isEditable: accessibleMenu.includes(menu), role: currentRole, menu, index })}
{/each}
