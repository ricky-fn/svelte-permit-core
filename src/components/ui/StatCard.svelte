<script lang="ts">
    const { value, label }: { value: string, label: string } = $props();
</script>
  
<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
    <div class="text-3xl font-bold gradient-text">{value}</div>
    <div class="text-gray-600 mt-1">{label}</div>
</div>