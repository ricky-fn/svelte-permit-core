<script lang="ts" module>
	export type DropdownAccessRules<T = string[]> = Partial<Record<string, T>>;
</script>

<script lang="ts">
	import { createDropdownAccessAction, type AccessControl, type Role, type Group, createDropdownPermission } from 'permit-core';
	import type { Writable } from 'svelte/store';
	import { getContext, type Snippet } from 'svelte';

	type T = $$Generic;
	
	const { list, identifier, children }: { list: Array<T>, identifier: string, children: Snippet<[{ isEditable: boolean; role: Writable<Role>; item: T; index: number }]> } = $props();

	const accessControl = getContext<AccessControl>('AccessControl');
	const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
	const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");

	let currentRoleCode = $state<string>();
	let currentRoleGroupCode = $state<string | undefined>();
	let currentRolePermissions = $state([]);
	let accessibleItems = $state<Array<T>>([]);

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

			const dropdownAccessAction = createDropdownAccessAction(currentRoleCode, {
				identifier,
				dropdown: list as string[]
			});

			accessControl.checkPermissions<ReturnType<typeof createDropdownAccessAction>>(dropdownAccessAction, {
				onSuccess: (action) => {
					const dropdownAccessPermission = $currentRole.getPermissions<ReturnType<typeof createDropdownPermission>>("dropdown")[0];
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
    {@render children({ isEditable: accessibleItems.includes(item), role: currentRole, item, index })}
{/each}
