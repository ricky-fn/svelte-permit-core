<script lang="ts" module>
	export type ComponentAccessRules = {
		role: string;
		actions: Array<"view" | "edit">;
	}[];
</script>

<script lang="ts">
    import { ComponentAccessAction, type AccessControl, type RolePermissionGroup, type Role, type Group} from "permit-core";
	import { getContext, type Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';

	const { identifier, rules = [], children, fallback }: { 
		identifier: string; 
		rules?: ComponentAccessRules, 
		children: Snippet<[{ isEditable: boolean; role: Role }]>, 
		fallback?: Snippet<[{ role: Role }]> 
	} = $props();

	const accessControl = getContext<AccessControl>('AccessControl');
	const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
	const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");

	let isVisible = $state(false);
	let isEditable = $state(false);
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

	// $effect(() => {
	// 	if (rules && rules.length > 0) {
	// 		rules.forEach((rule) => {
	// 			$permissions[rule.role].component.addRule({
	// 				actions: rule.actions,
	// 				identifier
	// 			});
	// 		});
	// 	}
	// });
</script>

{#if isVisible}
    {@render children({isEditable, role: $currentRole})}
{:else if fallback}
    {@render fallback({role: $currentRole})}
{/if}
