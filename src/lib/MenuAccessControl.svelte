<script lang="ts">
	/**
	 * MenuAccessControl
	 *
	 * Computes the list of accessible menu items for the active role (and optional group)
	 * using the access control context, and renders the `children` snippet for each item
	 * in `menuList`, indicating whether the item is editable/visible for that role.
	 *
	 * Consumed contexts:
	 * - `AccessControl`: Access control instance
	 * - `CurrentAccessRole`: Writable<Role | null>
	 * - `CurrentAccessRoleGroup`: Writable<Group | null>
	 *
	 * Usage:
	 * ```svelte
	 * <ul>
	 * 		<MenuAccessControl identifier="menu-items" menuList={menuItems}>
	 *   		{#snippet children({ menu, isEditable })}
	 *     			<li class={classNames({
	 *       			'hidden': !isEditable
	 *     			})}>{menu}</li>
	 *   		{/snippet}
	 * 		</MenuAccessControl>
	 * </ul>
	 * ```
	 */
	import { MenuAccessAction, type AccessControl, type Role, type Group, MenuAccessPermission } from 'permit-core';
	import type { Writable } from 'svelte/store';   
	import { getContext, type Snippet } from 'svelte';

	type T = $$Generic;

	/**
	 * Component props
	 *
	 * @prop {Array<T>} menuList - Full list of candidate menu items to evaluate.
	 * @prop {string} identifier - Menu permission identifier to check against.
	 * @prop {Snippet<[{ isEditable: boolean; role: Writable<Role>; menu: T; index: number }]>} children - Rendered for each item, with editability flag.
	 */
	const { menuList, identifier, children }: { menuList: Array<T>, identifier: string, children: Snippet<[{ isEditable: boolean; role: Writable<Role>; menu: T; index: number }]> } = $props();

	/** Access control instance provided by AccessControlProvider */
	const accessControl = getContext<AccessControl>('AccessControl');
	/** Active role store */
	const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
	/** Active group store (if assigned) */
	const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");

	/** Computed accessible menu list for the current role */
	let accessibleMenu = $state<Array<T>>([]);
	/** Cached values to detect when to recompute */
	let currentRoleCode = $state<string>();
	let currentRoleGroupCode = $state<string | undefined>();
	let currentRolePermissions = $state([]);

	/** Recompute accessible menu when role/group/permissions change */
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
