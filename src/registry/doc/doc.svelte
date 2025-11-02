<script lang="ts">
	import typescript from 'svelte-highlight/languages/typescript';
	import Code from '../code/code.svelte';
	import { generateTypeTemplate } from './doc.utils.js';
	import type { DocTypes } from './doc.types.js';

	let { children, title, subtitle, propsToTranslate, propsDescription, footer }: DocTypes =
		$props();
</script>

<section
	class="grid gap-6 rounded-lg border border-border bg-card p-6 shadow-sm transition-colors duration-200"
>
	<header class="grid gap-1">
		{#if title}
			<h2 class="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
		{/if}
		{#if subtitle}
			<p class="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
		{/if}
	</header>

	<div class="prose dark:prose-invert max-w-none">
		{@render children?.()}
	</div>
	{#if propsDescription}
		<h3 class="leading-1">Description</h3>
		<div class=" text-sm leading-relaxed text-muted-foreground">
			{@render propsDescription?.()}
		</div>
	{/if}
	{#if propsToTranslate}
		<section class="grid gap-3">
			<Code language={typescript} code={generateTypeTemplate('Props', propsToTranslate)} />
		</section>
	{/if}

	{#if footer}
		<footer class="mt-2 border-t border-border pt-4 text-sm text-muted-foreground">
			{@render footer?.()}
		</footer>
	{/if}
</section>
