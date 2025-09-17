<script lang="ts" module>
	export type MenuAccessRules<T = string[]> = Partial<Record<string, T>>;
</script>

<script lang="ts">
	import { MenuAccessAction, type RolePermissionGroup, type AccessControl, type Role, type Group, MenuAccessPermission } from 'permit-core';
	import type { Writable } from 'svelte/store';   
	import { getContext, type Snippet } from 'svelte';

	type T = $$Generic;

    const { menuList, identifier, children }: { menuList: Array<T>, identifier: string, children: Snippet<[{ isEditable: boolean; role: Writable<Role>; menu: T; index: number }]> } = $props();

	const accessControl = getContext<AccessControl>('AccessControl');
	const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
	const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");

	let accessibleMenu = $state<Array<T>>([]);
	let currentRoleCode = $state<string>();
	let currentRoleGroupCode = $state<string | undefined>();
	let currentRolePermissions = $state([]);

	$effect(() => {
		if (
			$currentRole && 
			($currentRole.getCode() !== currentRoleCode 
			|| $currentRoleGroup?.getCode() !== currentRoleGroupCode
			|| $currentRole.getPermissions().length !== currentRolePermissions.length)
		) {
			currentRoleCode = $currentRole.getCode();
			currentRoleGroupCode = $currentRoleGroup?.getCode();
			currentRolePermissions = $currentRole.getPermissions();

			const menuAccessAction = new MenuAccessAction(currentRoleCode, {
				identifier,
				menu: menuList as string[]
			});

			accessControl.checkPermissions<MenuAccessAction>(menuAccessAction, {
				onSuccess: (action) => {
					const menuAccessPermission = $currentRole.getPermissions<MenuAccessPermission>("menu")[0];
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
    {@render children({ isEditable: accessibleMenu.includes(menu), role: currentRole, menu, index })}
{/each}
