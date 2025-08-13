<script lang="ts">
	import Header from "$components/Header.svelte";
	import FeaturesGrid from "$components/FeaturesGrid.svelte";
	import StatCard from "$components/ui/StatCard.svelte";
	import ConfigurationPanel from "$components/ConfigurationPanel.svelte";
</script>

<Header title="Access Control Library">
	<StatCard value="4" label="Control Types" />
	<StatCard value="100%" label="Type Safety" />
	<StatCard value="3.2K" label="Weekly Downloads" />
	<StatCard value="4.8" label="User Rating" />
</Header>

<FeaturesGrid />

<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
	<ConfigurationPanel />
</div>