<script lang="ts" module>
	export type ComponentAccessRules = {
		role: string;
		actions: Array<"view" | "edit">;
	}[];
</script>

<script lang="ts">
    import { ComponentAccessAction, type AccessControl, type RolePermissionGroup, type Role} from "permit-core";
	import { getContext, type Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';

	const { identifier, rules, children }: { identifier: string; rules: ComponentAccessRules, children: Snippet<[{ isEditable: boolean; role: Role }]> } = $props();

	const accessControl = getContext<Writable<AccessControl>>('AccessControl');
	const permissions = getContext<Writable<RolePermissionGroup<string>>>('AccessPermissions');
	const currentRole = getContext<Writable<Role>>("CurrentAccessRole");

	let isVisible = $state(false);
	let isEditable = $state(false);
	let currentRoleCode = $state<string>();
	let currentRoleGroupCode = $state<string | undefined>();
	let currentRolePermissions = $state([]);

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
			const componentViewAction = new ComponentAccessAction(currentRoleCode, {
				identifier: identifier,
				action: 'view'
			});

			$accessControl.checkPermissions<ComponentAccessAction>(componentViewAction, {
				onSuccess: (action) => {
					if (action.getParameters().identifier === identifier) {
						isVisible = true;
					}
				},
				onFailure: (action) => {
					if (action.getParameters().identifier === identifier) {
						isVisible = false;
					}
				}
			});

			const componentEditAction = new ComponentAccessAction(currentRoleCode, {
				identifier: identifier,
				action: 'edit'
			});

			$accessControl.checkPermissions<ComponentAccessAction>(componentEditAction, {
				onSuccess: (action) => {
					if (action.getParameters().identifier === identifier) {
						isEditable = true;
					}
				},
				onFailure: (action) => {
					if (action.getParameters().identifier === identifier) {
						isEditable = false;
					}
				}
			});
		}
	});

	$effect(() => {
		if (rules && rules.length > 0) {
			rules.forEach((rule) => {
				$permissions[rule.role].component.addRule({
					actions: rule.actions,
					identifier
				});
			});
		}
	});
</script>

{#if isVisible}
    {@render children({isEditable, role: $currentRole})}
{/if}
