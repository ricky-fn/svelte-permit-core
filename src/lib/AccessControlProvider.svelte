<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import type { Writable } from "svelte/store";
    import { createAccessControl, type Role, type RolePermissions } from "permit-core";

    type Roles = Role[];
    type RoleCodes = Array<Roles[number]['code']>;

    const { children, roles, permissions, account}: { 
        children: Snippet, 
        roles: Roles, 
        permissions: Record<string, RolePermissions>,
        account: Writable<Record<string, any> & {role: string} | undefined> 
    } = $props();

    // TODO: should use a store instead of a state
    const accessControl = createAccessControl({ roles });
    let currentRole = $state<Role | null>(null);
    let currentRoleCode = $state<RoleCodes[number] | null>(null);
    let currentAccessPermission = $state<RolePermissions | null>(null);

    account.subscribe((state) => {
        if (state && state.role !== currentRoleCode) {
            currentRoleCode = state.role;
            currentAccessPermission = permissions[currentRoleCode];
            currentRole = accessControl.getRoleByCode(currentRoleCode);

            if (!currentRole) {
                throw new Error('role is not registered in the access control module');
            }
        }

        if (!state) {
            currentRole = null;
            currentRoleCode = null;
            currentAccessPermission = null;
        }

        if (state?.groupFlag && currentRole) {
            const group = accessControl.getGroupByCode(state.groupFlag);
            if (group) {
                currentRole.assignGroup(group);
            }
        }
    });

    setContext('AccessControl', accessControl);
    setContext('AccessPermissions', permissions);
    setContext('CurrentAccessRole', currentRole);
</script>

{@render children()}