<script lang="ts">
    import { faBars } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa';
</script>

<h3 class="text-xl font-semibold text-primary mb-4">
    <Fa icon={faBars} class="mr-2 inline-block"/>
    Menu Access Control
</h3>

<div class="bg-blue-50 rounded-xl p-4 mb-4">
    <div class="bg-white rounded-lg p-4">
        <div class="flex space-x-4 justify-center">
            <div class="menu-item px-4 py-2 rounded-lg hover:bg-gray-100">Dashboard</div>
            <div class="menu-item px-4 py-2 rounded-lg hover:bg-gray-100">Content</div>
            <div class="menu-item px-4 py-2 rounded-lg hover:bg-gray-100">Analytics</div>
            <div class="menu-item px-4 py-2 rounded-lg hover:bg-gray-100">Admin</div>
            <div class="menu-item px-4 py-2 rounded-lg hover:bg-gray-100">Settings</div>
        </div>
    </div>
</div>

<div class="bg-green-50 rounded-xl p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">Accessible Menu Items</h4>
            <div class="bg-white rounded-lg p-4 min-h-[120px]">
                <ul id="accessibleMenuItems" class="space-y-2"></ul>
            </div>
        </div>
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">Permissions</h4>
            <div class="bg-white rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span class="text-sm">Visible</span>
                </div>
                <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span class="text-sm">Hidden</span>
                </div>
            </div>
        </div>
    </div>
</div>