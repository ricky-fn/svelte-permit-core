<script lang="ts">
    import FeatureCard from "./FeatureCard.svelte";
    import Fa from 'svelte-fa';
    import { type IconDefinition } from '@fortawesome/free-solid-svg-icons';
    import { type Writable } from "svelte/store";
    import { DEMO_DATA } from "$constants/demo";
	import classNames from "classnames";
    
    const { currentTab }: { currentTab: Writable<string> } = $props();

    const features: { title: string, icon: IconDefinition, id: string }[] = $state(DEMO_DATA.tabs);
  </script>
  
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    {#each features as feature}
        {#snippet icon()}
            <Fa icon={feature.icon} color="primary" class={classNames("inline-block text-2xl", {"fill-white": feature.id === $currentTab})}/>
        {/snippet}
        <FeatureCard {icon} title={feature.title} class={classNames({"active": feature.id === $currentTab})} onClick={() => $currentTab = feature.id}/>
    {/each}
  </div>