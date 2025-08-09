<script lang="ts">
	import { activeFileEntry } from '@/store';
	import { db } from '@/database/client';
	import { entry as entryTable } from '@/database/schema';
	import { eq } from 'drizzle-orm';
	import Editor from '@/components/shared/editor/editor.svelte';
	import PdfViewer from '@/components/shared/pdf-viewer.svelte';
	import EditorInlineTitle from '@/components/shared/editor/inline-title.svelte';
	import EditorSearch from '@/components/shared/editor/search.svelte';

	let fileContent = '';
	let loading = true;

	$: if ($activeFileEntry?.path) {
		loadFileContent($activeFileEntry.path);
	}

	async function loadFileContent(path: string) {
		loading = true;
		try {
			const file = await db.select().from(entryTable).where(eq(entryTable.path, path));
			if (file.length > 0) {
				fileContent = file[0].content || '';
			}
		} catch (error) {
			console.error('Error loading file content:', error);
		} finally {
			loading = false;
		}
	}
</script>

{#if loading}
	<div class="flex items-center justify-center w-full h-full">
		<p class="text-muted-foreground">Loading...</p>
	</div>
{:else if $activeFileEntry?.contentType === 'application/pdf'}
	<PdfViewer pdfData={fileContent} fileName={$activeFileEntry.name || 'document.pdf'} />
{:else}
	<!-- Markdown editor (default) -->
	<EditorSearch />
	<EditorInlineTitle />
	<Editor />
{/if}
