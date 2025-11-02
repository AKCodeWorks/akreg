<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="box-border h-screen w-screen overflow-y-auto bg-background p-4">
	{@render children()}
</div>
