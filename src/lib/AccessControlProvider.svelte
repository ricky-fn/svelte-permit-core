<script lang="ts">
    /**
     * AccessControlProvider
     *
     * Provides role/group-based access control context to its children.
     * This component registers provided `roles` and `groups`, tracks the current
     * account's role and optional group via the `account` store, and exposes
     * the following Svelte contexts to descendants:
     *
     * - `AccessControl`: The initialized access control instance
     * - `CurrentAccessRole`: Writable<Role | null> representing the active role
     * - `CurrentAccessRoleGroup`: Writable<Group | null> representing the active group (if any)
     *
     * Usage:
     * ```svelte
     * <AccessControlProvider {roles} {groups} account={user}>
     *   <!-- children that consume contexts -->
     * </AccessControlProvider>
     * ```
     */
    import { setContext, type Snippet, onDestroy } from "svelte";
    import { writable, type Readable } from "svelte/store";
    import { createAccessControl, type Group, type Role, type RolePermissions } from "permit-core";

    type Roles = Role[];
    type RoleCodes = Array<Roles[number]['code']>;
    type Groups = Group[];
    type GroupCodes = Array<Groups[number]['code']>;

    /**
     * Component props
     *
     * @prop {Snippet} children - Subtree rendered inside the provider. Receives contexts via Svelte's getContext.
     * @prop {Roles} roles - List of registered roles for the access control system.
     * @prop {Groups} groups - List of registered groups. May include inheritance.
     * @prop {Readable<{ role: string; groupFlag?: string } | null>} account - Reactive account state. When `role` or `groupFlag` changes, contexts update accordingly. When `null`, contexts reset.
     */
    const { children, roles, groups, account }: { 
        children: Snippet, 
        roles: Roles, 
        groups: Groups,
        account: Readable<(Record<string, any> & { role: string; groupFlag?: string }) | null>
    } = $props();

    /** Initialized access control instance bound to provided roles */
    const accessControl = createAccessControl({ roles });
    /** Writable store for the active role */
    const currentRole = writable<Role | null>(null);
    /** Writable store for the active group (if any) */
    const currentRoleGroup = writable<Group | null>(null);
    /** Cached current group code to detect changes */
    let currentGroupCode = $state<GroupCodes[number] | null>(null);
    /** Cached current role code to detect changes */
    let currentRoleCode = $state<RoleCodes[number] | null>(null);

    groups.forEach(group => accessControl.addGroup(group));
    roles.forEach(role => accessControl.addRole(role));

    /**
     * Subscribes to external `account` store.
     *
     * - When `state.role` changes, updates the active role.
     * - When `state.groupFlag` is present and matches a known group, assigns the group to the active role.
     * - When `state` is `null`, resets role and group contexts.
     */
    const unsubscribe = account.subscribe((state) => {
        if (state && state.role !== currentRoleCode) {
            currentRoleCode = state.role;
            $currentRole = accessControl.getRoleByCode(currentRoleCode);

            if (!currentRole) {
                throw new Error('role is not registered in the access control module');
            }
        }

        if (!state) {
            $currentRole = null;
            $currentRoleGroup = null;
            currentRoleCode = null;
            currentGroupCode = null;
        }

        if (state?.groupFlag && currentRole) {
            const group = accessControl.getGroupByCode(state.groupFlag);
            if (group) {
                $currentRole.resetGroup();
                $currentRole.assignGroup(group);
                $currentRoleGroup = group;
                currentGroupCode = group.getCode();
            } else {
                $currentRole.resetGroup();
                $currentRoleGroup = null;
                currentGroupCode = null;
            }
        }
    });

    /** Cleans up the `account` subscription when the provider is destroyed. */
    onDestroy(unsubscribe);

    /** Expose access control instance to descendants */
    setContext('AccessControl', accessControl);
    /** Expose active role store to descendants */
    setContext('CurrentAccessRole', currentRole);
    /** Expose active group store to descendants */
    setContext('CurrentAccessRoleGroup', currentRoleGroup);
</script>

{@render children()}