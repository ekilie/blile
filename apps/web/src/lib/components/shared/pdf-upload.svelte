<script lang="ts">
	import { createPdf } from '@/api/notes';
	import { collection } from '@/store';
	import { Button } from '@haptic/ui/components/button';
	import Icon from '@/components/shared/icon.svelte';

	let fileInput: HTMLInputElement;
	let uploading = false;

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (!files || files.length === 0) return;

		const file = files[0];

		// Check if it's a PDF
		if (file.type !== 'application/pdf') {
			alert('Please select a PDF file.');
			return;
		}

		uploading = true;
		try {
			await createPdf($collection || '/', file);
		} catch (error) {
			console.error('Error uploading PDF:', error);
			alert('Error uploading PDF file.');
		} finally {
			uploading = false;
			if (fileInput) {
				fileInput.value = '';
			}
		}
	}

	function triggerFileSelect() {
		fileInput?.click();
	}
</script>

<input
	bind:this={fileInput}
	type="file"
	accept=".pdf,application/pdf"
	on:change={handleFileSelect}
	class="hidden"
/>

<Button
	size="icon"
	variant="ghost"
	scale="md"
	class="h-7 w-7"
	disabled={uploading}
	on:click={triggerFileSelect}
	title="Upload PDF"
>
	{#if uploading}
		<Icon name="reload" class="w-4 h-4 animate-spin" />
	{:else}
		<Icon name="share" class="w-4 h-4" />
	{/if}
</Button>
