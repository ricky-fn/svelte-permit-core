<script lang="ts">
    /**
     * RouteAccessControl
     *
     * Evaluates whether the active role (and optionally its group) has access to a given `route`.
     * Renders the `children` snippet when access is granted; otherwise renders the `fallback` snippet.
     *
     * Consumed contexts:
     * - `AccessControl`: Access control instance
     * - `CurrentAccessRole`: Writable<Role | null>
     * - `CurrentAccessRoleGroup`: Writable<Group | null>
     *
     * Usage:
     * ```svelte
     * <RouteAccessControl route="/admin">
     *   {#snippet children({ role, route })}
     *     <p>Access granted to {route}</p>
     *   {/snippet}
     *   {#snippet fallback({ role, route })}
     *     <p>Access denied to {route}</p>
     *   {/snippet}
     * </RouteAccessControl>
     * ```
     */
    import { createRouteAccessAction, type AccessControl, type Role, Permission, type Group, RouteAccessAction } from "permit-core";
    import type { Writable } from "svelte/store";
    import { getContext, type Snippet } from "svelte";

    /**
     * Component props
     *
     * @prop {string} route - Route path to check access against.
     * @prop {Snippet<[{ role: Writable<Role>; route: string }]>} children - Rendered when access is granted.
     * @prop {Snippet<[{ role: Writable<Role>; route: string }]>} fallback - Rendered when access is denied.
     */
    const { route, children, fallback }: { route: string; children: Snippet<[{ role: Writable<Role>; route: string }]>; fallback: Snippet<[{ role: Writable<Role>; route: string }]> } = $props();

    /** Access control instance provided by AccessControlProvider */
    const accessControl = getContext<AccessControl>('AccessControl');
    /** Active role store */
    const currentRole = getContext<Writable<Role>>("CurrentAccessRole");
    /** Active group store (if assigned) */
    const currentRoleGroup = getContext<Writable<Group>>("CurrentAccessRoleGroup");

    /** Whether the `route` is accessible for the current role */
    let isAccessible = $state<boolean>(false);
    /** Cached values to detect when to re-evaluate */
    let currentRoleCode = $state<string>();
    let currentRoleGroupCode = $state<string | undefined>();
    let currentRolePermissions = $state([]);

    /** Re-evaluate route access when role/group/permissions change */
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