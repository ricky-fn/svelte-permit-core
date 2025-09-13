<script lang="ts">
	import CodeBlock from "$components/ui/CodeBlock.svelte";
	import Fa from "svelte-fa";
	import { faArrowDown, faCogs } from "@fortawesome/free-solid-svg-icons";
	import { user } from "$stores/user.store";
	import { DEMO_DATA } from "$lib/data/demo";
	import { getContext } from "svelte";
	import type { Role } from "permit-core";
	import type { Writable } from "svelte/store";

	const currentRole:Writable<Role | null> = getContext('CurrentAccessRole');
	let role = $state($currentRole?.getCode());
	let groupFlag = $state($currentRole?.getGroup()?.getCode());

 	const configs = [
		{
			title: "AccessControlProvider Setup",
			lang: "ts",
			code: `// Initialize roles and permissions
const roles = [
    new Role('admin'),
    new Role('editor'),
    new Role('viewer')
];

const permissions = {
    admin: { /* admin permissions */ },
    editor: { /* editor permissions */ },
    viewer: { /* viewer permissions */ }
};

// Create provider
const accessControlProvider = new AccessControlProvider({
    roles,
    permissions,
    account: userStore
});

// Wrap your application
accessControlProvider.render(app);`
		},
		{
			title: "ComponentAccessControl Usage",
			lang: "svelte",
			code: `<ComponentAccessControl 
    identifier="admin-panel" 
    rules={[
        { role: 'admin', actions: ['view', 'edit'] },
        { role: 'editor', actions: ['view'] }
    ]}
>
    {/* Content to protect */}
</ComponentAccessControl>`
		},
		{
			title: "RouteAccessControl Implementation",
			lang: "svelte",
			code: `<RouteAccessControl 
    route="/admin" 
    fallback={<Unauthorized />}
>
    <AdminDashboard />
</RouteAccessControl>`
		}
	];

	$effect(() => {
		user.login(role, groupFlag);
	});
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
	<div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
		<h2
			class="text-2xl font-bold text-primary flex items-center gap-3 mb-6 pb-4 border-b border-gray-100"
		>
			<Fa icon={faCogs} class="mr-3" />
			Configuration
		</h2>

		{#each configs as config}
			<div class="mb-8">
				<h3 class="text-lg font-semibold text-gray-800 mb-3">{config.title}</h3>
				<CodeBlock code={config.code} lang={config.lang} />
			</div>
		{/each}

		<div class="mb-6">
			<label for="role-select" class="block text-gray-700 font-medium mb-2"
				>Select Role</label
			>
			<select
				id="role-select"
				bind:value={role}
				class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
			>
				{#each DEMO_DATA.roles as role}
					<option value={role.code}>{role.name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-6">
			<label for="group-select" class="block text-gray-700 font-medium mb-2">Select Group</label>
			<select
				id="group-select"
				bind:value={groupFlag}
				class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
			>
				<option value="none">No Group</option>
				{#each DEMO_DATA.groups as group}
					<option value={group.code}>{group.name}</option>
				{/each}
			</select>
		</div>

		<div class="bg-blue-50 rounded-xl p-4 mb-6">
			<div class="flex items-center">
				<div class="permission-indicator bg-primary"></div>
				<span class="text-sm font-medium">Current Role: <span class="font-bold">{role}</span></span>
			</div>
			<div class="flex items-center mt-2">
				<div class="permission-indicator bg-secondary"></div>
				<span class="text-sm font-medium">Current Group: <span class="font-bold">{groupFlag}</span></span>
			</div>
		</div>

		<!-- Group hierarchy visualization -->
		<div class="bg-gray-50 rounded-xl p-4">
			<h3 class="text-lg font-semibold text-gray-800 mb-3">Group Hierarchy</h3>
			<div class="flex flex-col items-center">
				<!-- Admin Group -->
				<div class="w-full bg-blue-50 rounded-lg p-4 mb-4 relative">
					<div class="flex items-center">
						<span class="group-badge bg-blue-500 text-white mr-3">Admin Group</span>
						<span class="text-sm font-medium">Full permissions</span>
					</div>
				</div>
				
				<!-- Inheritance Arrow -->
				<Fa icon={faArrowDown} class="text-gray-500" />
				
				<!-- Content Group -->
				<div class="w-full bg-green-50 rounded-lg p-4 mt-4">
					<div class="flex items-center">
						<span class="group-badge bg-green-500 text-white mr-3">Content Group</span>
						<span class="text-sm font-medium">Inherits from Admin Group</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
