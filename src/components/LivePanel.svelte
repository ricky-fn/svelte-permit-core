<script lang="ts">
    import { faFlask } from "@fortawesome/free-solid-svg-icons";
    import Fa from 'svelte-fa';

    const { children } = $props();
</script>

<div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <h2 class="text-2xl font-bold text-primary flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <Fa icon={faFlask} />
        Live Demo
    </h2>

    {@render children?.()}
</div>