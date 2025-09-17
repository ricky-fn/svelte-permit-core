<script lang="ts">
    import { setContext, type Snippet, onDestroy } from "svelte";
    import { writable, type Readable } from "svelte/store";
    import { createAccessControl, type Group, type Role, type RolePermissions } from "permit-core";

    type Roles = Role[];
    type RoleCodes = Array<Roles[number]['code']>;
    type Groups = Group[];
    type GroupCodes = Array<Groups[number]['code']>;

    const { children, roles, groups, account }: { 
        children: Snippet, 
        roles: Roles, 
        groups: Groups,
        account: Readable<(Record<string, any> & { role: string; groupFlag?: string }) | null>
    } = $props();

    const accessControl = createAccessControl({ roles });
    const currentRole = writable<Role | null>(null);
    const currentRoleGroup = writable<Group | null>(null);
    let currentGroupCode = $state<GroupCodes[number] | null>(null);
    let currentRoleCode = $state<RoleCodes[number] | null>(null);

    groups.forEach(group => accessControl.addGroup(group));
    roles.forEach(role => accessControl.addRole(role));

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

    onDestroy(unsubscribe);

    setContext('AccessControl', accessControl);
    setContext('CurrentAccessRole', currentRole);
    setContext('CurrentAccessRoleGroup', currentRoleGroup);
</script>

{@render children()}