<script lang="ts">
    import { createRouteAccessAction, type AccessControl, type Role, Permission, type Group, RouteAccessAction } from "permit-core";
    import type { Writable } from "svelte/store";
    import { getContext, type Snippet } from "svelte";

    const { route, children, fallback }: { route: string, children: Snippet<[{ role: Writable<Role>; route: string }]>, fallback: Snippet<[{ role: Writable<Role>; route: string }]>, fallback: Snippet<[{ role: Writable<Role>; route: string }]> } = $props();

    const accessControl = getContext<AccessControl>('AccessControl');
	const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
	const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");

    let isAccessible = $state<boolean>(false);
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

            const routeAccessAction = createRouteAccessAction(currentRoleCode, {
                route
            });

            accessControl.checkPermissions<RouteAccessAction>(routeAccessAction, {
                onSuccess: () => {
                    isAccessible = true
                },
                onFailure: () => {
                    isAccessible = false;
                }
            });
        }
    });
</script>

{#if isAccessible}
    {@render children({ role: currentRole, route })}
{:else}
    {@render fallback({ role: currentRole, route })}
{/if}