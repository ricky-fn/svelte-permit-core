<script lang="ts" module>
	export type DropdownAccessRules<T = string[]> = Partial<Record<string, T>>;
</script>

<script lang="ts">
	import { createDropdownAccessAction, type RolePermissionGroup, type AccessControl, type Role, Permission } from 'permit-core';
	import type { Writable } from 'svelte/store';
	import { getContext, type Snippet } from 'svelte';

	type T = $$Generic;
	
	const { list, identifier, children }: { list: Array<T>, identifier: string, children: Snippet<[{ isEditable: boolean; role: Writable<Role>; item: T; index: number }]> } = $props();

	const accessControl = getContext<Writable<AccessControl>>('AccessControl');
	const currentRole = getContext<Writable<Role>>('CurrentAccessRole');
	const permissions = getContext<Writable<RolePermissionGroup<string>>>('AccessPermissions');

	let accessibleItems = $state<Array<T>>([]);
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

			const dropdownAccessAction = createDropdownAccessAction(currentRoleCode, {
				identifier,
				dropdown: list as string[]
			});

			$accessControl.checkPermissions<ReturnType<typeof createDropdownAccessAction>>(dropdownAccessAction, {
				onSuccess: (action) => {
					const dropdownAccessPermission = $permissions[action.getRoleCode()][action.getType()];
					accessibleItems = dropdownAccessPermission.getAccessibleList(action) as Array<T>;
				},
				onFailure: () => {
					accessibleItems = [];
				}
			});
		}
	});
</script>

{#each list as item, index}
    {children({ isEditable: accessibleItems.includes(item), role: currentRole, item, index })}
{/each}
