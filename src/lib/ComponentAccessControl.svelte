<script lang="ts">
    /**
     * ComponentAccessControl
     *
     * Guards a UI fragment (children snippet) behind component-level permissions
     * driven by the active role (and optionally its group) from the access control context.
     * If the current role has `view` permission for the provided `identifier`, the `children`
     * snippet is rendered with `{ isEditable, role }`. If not, the optional `fallback` snippet
     * is rendered instead.
     *
     * Contexts consumed:
     * - `AccessControl`: Access control instance to evaluate actions
     * - `CurrentAccessRole`: Writable<Role | null>
     * - `CurrentAccessRoleGroup`: Writable<Group | null>
     *
     * Usage:
     * ```svelte
     * <ComponentAccessControl identifier="admin-panel">
     *   {#snippet children({ isEditable, role })}
     *     <button disabled={!isEditable}>Edit</button>
     *   {/snippet}
     *   {#snippet fallback({ role })}
     *     <p>Access denied</p>
     *   {/snippet}
     * </ComponentAccessControl>
     * ```
     */
    import { ComponentAccessAction, type AccessControl, type RolePermissionGroup, type Role, type Group} from "permit-core";
	import { getContext, type Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';

	/**
	 * Component props
	 *
	 * @prop {string} identifier - Unique component identifier to check access against.
	 * @prop {Snippet<[{ isEditable: boolean; role: Role }]>} children - Rendered when `view` is allowed. Receives editability and active role.
	 * @prop {Snippet<[{ role: Role }]>} [fallback] - Rendered when `view` is denied. Receives the active role.
	 */
	const { identifier, children, fallback }: { 
		identifier: string; 
		children: Snippet<[{ isEditable: boolean; role: Role }]>, 
		fallback?: Snippet<[{ role: Role }]> 
	} = $props();

	/** Access control instance provided by the nearest AccessControlProvider */
	const accessControl = getContext<AccessControl>('AccessControl');
	/** Currently active role (reactive store) */
	const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
	/** Currently active group assigned to the role, if any (reactive store) */
	const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");

	/** Whether the component is visible (has `view` permission) */
	let isVisible = $state(false);
	/** Whether the component is editable (has `edit` permission) */
	let isEditable = $state(false);
	/** Cached values to detect when to re-evaluate permissions */
	let currentRoleCode = $state<string>();
	let currentRoleGroupCode = $state<string | undefined>();
	let currentRolePermissions = $state([]);

	/** Re-evaluates visibility and editability when role/group/permissions change */
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
			const componentViewAction = new ComponentAccessAction(currentRoleCode, {
				identifier: identifier,
				action: 'view'
			});

			accessControl.checkPermissions<ComponentAccessAction>(componentViewAction, {
				onSuccess: (action) => {
					isVisible = true;
				},
				onFailure: (action) => {
					isVisible = false;
				}
			});

			const componentEditAction = new ComponentAccessAction(currentRoleCode, {
				identifier: identifier,
				action: 'edit'
			});

			accessControl.checkPermissions<ComponentAccessAction>(componentEditAction, {
				onSuccess: (action) => {
					isEditable = true;
				},
				onFailure: (action) => {
					isEditable = false;
				}
			});
		}
	});
</script>

{#if isVisible}
    {@render children({isEditable, role: $currentRole})}
{:else if fallback}
    {@render fallback({role: $currentRole})}
{/if}
