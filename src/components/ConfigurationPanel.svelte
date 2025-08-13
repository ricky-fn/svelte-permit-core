<script lang="ts">
	import CodeBlock from "$components/ui/CodeBlock.svelte";
	import Fa from 'svelte-fa';
	import { faCogs } from '@fortawesome/free-solid-svg-icons';

	const configs = [
		{
			title: "AccessControlProvider Setup",
			lang: 'ts',
			code: 
`// Initialize roles and permissions
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
			lang: 'svelte',
			code: 
`<ComponentAccessControl 
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
			lang: 'svelte',
			code: 
`<RouteAccessControl 
    route="/admin" 
    fallback={<Unauthorized />}
>
    <AdminDashboard />
</RouteAccessControl>`
		}
	];
</script>

<div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
	<h2
		class="text-2xl font-bold text-primary flex items-center gap-3 mb-6 pb-4 border-b border-gray-100"
	>
		<Fa icon={faCogs} class="mr-3" />
		Configuration & Setup
	</h2>

	{#each configs as config}
		<div class="mb-8">
			<h3 class="text-lg font-semibold text-gray-800 mb-3">{config.title}</h3>
			<CodeBlock code={config.code} lang={config.lang} />
		</div>
	{/each}
</div>
