<script lang="ts">
    import { faRoute, faLock } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa';
</script>

<h3 class="text-xl font-semibold text-primary mb-4">
    <Fa icon={faRoute} class="mr-2 inline-block"/>
    Route Access Control
</h3>

<div class="bg-blue-50 rounded-xl p-4 mb-4">
    <div class="route-display bg-white rounded-lg p-4 mb-4">
        <span class="text-gray-600">Current route:</span>
        <span id="currentRoute" class="font-medium">/dashboard</span>
    </div>
    
    <div class="grid grid-cols-2 gap-3">
        <button id="navigateAdminBtn" class="py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
            Go to Admin Panel
        </button>
        <button id="navigateEditorBtn" class="py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
            Go to Content Editor
        </button>
    </div>
</div>

<div class="bg-green-50 rounded-xl p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">Route Permissions</h4>
            <div class="bg-white rounded-lg p-4">
                <div class="flex justify-between py-1 border-b border-gray-100">
                    <span>/admin</span>
                    <span id="adminRouteStatus" class="font-medium">-</span>
                </div>
                <div class="flex justify-between py-1">
                    <span>/editor</span>
                    <span id="editorRouteStatus" class="font-medium">-</span>
                </div>
            </div>
        </div>
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">Access Status</h4>
            <div class="bg-white rounded-lg p-4">
                <div id="routeAccessStatus" class="text-center py-4 rounded-lg">
                    <Fa icon={faLock} class="text-2xl mb-2 text-red-500"/>
                    <p>Access denied to this route</p>
                </div>
            </div>
        </div>
    </div>
</div>