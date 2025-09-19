<script lang="ts">
    /**
     * DropdownAccessControl
     *
     * Computes the list of accessible dropdown items for the active role (and optional group)
     * using the access control context, and renders the `children` snippet for each item
     * in `list`, indicating whether the item is editable/visible for that role.
     *
     * Consumed contexts:
     * - `AccessControl`: Access control instance
     * - `CurrentAccessRole`: Writable<Role | null>
     * - `CurrentAccessRoleGroup`: Writable<Group | null>
     *
     * Usage (following DropdownDemo):
     * ```svelte
     * <ul class="space-y-2">
     *   <DropdownAccessControl identifier={DEMO_DATA.dropdown.identifier} list={items}>
     *     {#snippet children({ isEditable, item })}
     *       <li class="flex items-center">
     *         <div class={classNames('w-3 h-3 rounded-full mr-2', {
     *           'bg-green-500': isEditable,
     *           'bg-red-500': !isEditable,
     *         })}></div>
     *         <span>{DEMO_DATA.dropdown.items.find(i => i.id === item)?.name}</span>
     *       </li>
     *     {/snippet}
     *   </DropdownAccessControl>
     * </ul>
     * ```
     */
	import { createDropdownAccessAction, type AccessControl, type Role, type Group, createDropdownPermission } from 'permit-core';
	import type { Writable } from 'svelte/store';
	import { getContext, type Snippet } from 'svelte';

	type T = $$Generic;
	
	/**
	 * Component props
	 *
	 * @prop {Array<T>} list - Full list of candidate dropdown items to evaluate.
	 * @prop {string} identifier - Dropdown permission identifier to check against.
	 * @prop {Snippet<[{ isEditable: boolean; role: Writable<Role>; item: T; index: number }]>} children - Rendered for each item, with editability flag.
	 */
	const { list, identifier, children }: { list: Array<T>, identifier: string, children: Snippet<[{ isEditable: boolean; role: Writable<Role>; item: T; index: number }]> } = $props();

	/** Access control instance provided by AccessControlProvider */
	const accessControl = getContext<AccessControl>('AccessControl');
	/** Active role store */
	const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
	/** Active group store (if assigned) */
	const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");

	/** Cached values to detect when to recompute */
	let currentRoleCode = $state<string>();
	let currentRoleGroupCode = $state<string | undefined>();
	let currentRolePermissions = $state([]);
	/** Computed accessible items for the current role */
	let accessibleItems = $state<Array<T>>([]);

	/** Recompute accessible dropdown items when role/group/permissions change */
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
