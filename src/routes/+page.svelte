<script lang="ts">
	import RemoteCode from '../registry/remote-code/remote-code.svelte';
	import github from 'svelte-highlight/styles/github';
	import githubDark from 'svelte-highlight/styles/github-dark';
</script>

<div class=" p-4">
	<RemoteCode theme={github} darkTheme={githubDark} />
</div>
