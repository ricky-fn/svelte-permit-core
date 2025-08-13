<script lang="ts">
    import FeatureCard from "./FeatureCard.svelte";
    import Fa from 'svelte-fa';
    import { faUserTag, faCube, faRoute, faCaretDown } from '@fortawesome/free-solid-svg-icons';
    
    export let features = [
      {
        title: "AccessControlProvider",
        icon: faUserTag,
        description: "Centralized context provider that manages roles, permissions, and user state"
      },
      {
        title: "ComponentAccessControl",
        icon: faCube,
        description: "Controls component-level access with view/edit permissions"
      },
      {
        title: "RouteAccessControl",
        icon: faRoute,
        description: "Manages route navigation permissions with fallback"
      },
      {
        title: "DropdownAccessControl",
        icon: faCaretDown,
        description: "Filters dropdown menu items based on permissions"
      }
    ];
  </script>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    {#each features as feature}
        {#snippet icon()}
            <Fa icon={feature.icon} color="primary" />
        {/snippet}
        <FeatureCard {icon} title={feature.title} description={feature.description} />
    {/each}
  </div>