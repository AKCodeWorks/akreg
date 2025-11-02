<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';

	async function getComponentCode(component: string) {
		const url = `https://raw.githubusercontent.com/AKCodeWorks/akui/refs/heads/main/src/registry/${component}/${component}.svelte`;
		const res = await fetch(url);
		if (!res.ok) {
			console.error('Failed to fetch component:', res.statusText);
			return;
		}
		const text = await res.text();
		return text;
	}

	let { theme, darkTheme, ...props } = $props();

	let colorScheme = $derived.by(() => {
		if (typeof window !== 'undefined') {
			return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
		} else {
			return 'dark';
		}
	});

	let displayedTheme = $derived.by(() => {
		return colorScheme === 'dark' && darkTheme ? theme : theme;
	});
</script>

<svelte:head>
	{@html displayedTheme}
</svelte:head>

<div class="rounded border-border p-4 shadow">
	{#await getComponentCode('button')}
		Loading...
	{:then code}
		<HighlightSvelte
			class="overflow-clip rounded-md border border-border shadow-sm "
			--border-radius="var(--1rem)"
			--langtag-color="var(--muted-foreground)"
			langtag
			{code}
		/>
	{:catch}
		Error...
	{/await}
</div>
