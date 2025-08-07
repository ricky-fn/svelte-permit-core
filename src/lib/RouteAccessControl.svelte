<script lang="ts">
    import { createRouteAccessAction, type AccessControl, type Role, Permission } from "permit-core";
    import type { Writable } from "svelte/store";
    import { getContext, type Snippet } from "svelte";

    const { route, children, fallback }: { route: string, children: Snippet<[{ role: Writable<Role> }]>, fallback: Snippet<[{ role: Writable<Role> }]> } = $props();

    const accessControl = getContext<Writable<AccessControl>>('AccessControl');
    const currentRole = getContext<Writable<Role>>('CurrentAccessRole');

    let isVisible = $state<boolean>(false);
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

            const routeAccessAction = createRouteAccessAction(currentRoleCode, {
                route
            });

            $accessControl.checkPermissions<ReturnType<typeof createRouteAccessAction>>(routeAccessAction, {
                onSuccess: () => {
                    isVisible = true
                },
                onFailure: () => {
                    isVisible = false;
                }
            });
        }
    });
</script>

{#if isVisible}
    {children({ role: currentRole })}
{:else}
    {fallback({ role: currentRole })}
{/if}