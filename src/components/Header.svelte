<script lang="ts">
    import type { Snippet } from "svelte";
    import Fa from 'svelte-fa';
    import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
    
    const { title, description, children }: { title: string, description: string, children: Snippet } = $props();
  </script>
  
  <header class="text-center mb-12">
    <h1 class="text-4xl md:text-5xl font-bold mb-4">
      <Fa icon={faShieldAlt} class="mr-3 inline-block" />
      <span class="gradient-text">{title}</span>
    </h1>
    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
      {description}
    </p>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
      {@render children?.()}
    </div>
  </header>