<script lang="ts">
    const {
        rolePermissions,
        groupPermissions,
        effectivePermissions,
        effectiveLabel,
        effectiveDisplay
    }: {
        rolePermissions: string[];
        groupPermissions: string[];
        effectivePermissions: string[];
        effectiveLabel: string;
        effectiveDisplay: string;
    } = $props();
</script>

<div class="bg-purple-50 rounded-xl p-4">
    <h4 class="font-semibold text-gray-800 mb-3">Permission Breakdown</h4>
    <div class="bg-white rounded-xl p-4 text-sm">
        <div class="flex justify-between py-1 border-b border-gray-100">
            <span>Base Role Permissions:</span>
            <span id="rolePermissions" class="font-medium">{rolePermissions.join(', ')}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-gray-100">
            <span>Group Inheritance:</span>
            <span id="groupPermissions" class="font-medium">{groupPermissions.join(', ')}</span>
        </div>
        <div class="flex justify-between py-1 font-bold">
            <span>{effectiveLabel}:</span>
            <span id="effectivePermissions" class="text-primary">
                {effectiveDisplay || (effectivePermissions.length > 0 ? effectivePermissions.join(', ') : '-')}
            </span>
        </div>
    </div>
</div>
