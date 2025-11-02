<script lang="ts">
	import type { CodeComponentProps } from './code.types.js';
	import { Highlight, HighlightSvelte } from 'svelte-highlight';
	import github from 'svelte-highlight/styles/github';
	import githubDark from 'svelte-highlight/styles/github-dark';
	import { getComponentCode } from './code.utils.js';
	import { ak } from '../utilities/ak.js';

	let { href, code, theme, darkTheme, containerProps, ...props }: CodeComponentProps = $props();

	let colorScheme: 'light' | 'dark' = $derived.by(() => {
		if (typeof window !== 'undefined') {
			return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
		} else {
			return 'dark';
		}
	});

	let displayedTheme = $derived.by(() => {
		return {
			light: theme || github,
			dark: darkTheme || githubDark
		};
	});
</script>

<svelte:head>
	{@html displayedTheme[colorScheme]}
</svelte:head>

<div class={ak('w-full rounded border-border p-4 shadow', { ...props })}>
	{#await href ? getComponentCode(href) : Promise.resolve(code) then code}
		{#if code && !props.language}
			<HighlightSvelte
				langtag
				--langtag-top="0.5rem"
				--langtag-right="0.5rem"
				--langtag-border-radius="0.5rem"
				--langtag-padding="0.25rem 0.5rem"
				class="grid max-w-fit overflow-clip rounded-md border border-border shadow-sm"
				--border-radius="var(--1rem)"
				--langtag-color="var(--muted-foreground)"
				{code}
			></HighlightSvelte>
		{:else if code && props.language}
			<Highlight
				language={props.language}
				langtag
				--langtag-top="0.5rem"
				--langtag-right="0.5rem"
				--langtag-border-radius="0.5rem"
				--langtag-padding="0.25rem 0.5rem"
				class="mx-w-fit grid overflow-clip rounded-md border border-border shadow-sm"
				--border-radius="1rem"
				--langtag-color="var(--muted-foreground)"
				{code}
			></Highlight>
		{/if}
	{/await}
</div>
