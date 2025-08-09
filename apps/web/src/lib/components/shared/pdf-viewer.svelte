<script lang="ts">
	export let pdfData: string; // Base64 encoded PDF data
	export let fileName: string = 'document.pdf';

	let iframe: HTMLIFrameElement;
	let pdfUrl: string;

	$: if (pdfData) {
		// Convert base64 to blob URL for iframe display
		try {
			const byteCharacters = atob(pdfData);
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			const blob = new Blob([byteArray], { type: 'application/pdf' });
			pdfUrl = URL.createObjectURL(blob);
		} catch (error) {
			console.error('Error loading PDF:', error);
		}
	}

	function downloadPdf() {
		if (pdfUrl) {
			const link = document.createElement('a');
			link.href = pdfUrl;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
</script>

<div class="w-full h-full flex flex-col">
	{#if pdfUrl}
		<!-- PDF toolbar -->
		<div class="flex items-center justify-between p-2 border-b bg-background">
			<span class="text-sm text-muted-foreground">{fileName}</span>
			<button
				on:click={downloadPdf}
				class="text-sm px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
			>
				Download
			</button>
		</div>

		<!-- PDF viewer -->
		<div class="flex-1 w-full">
			<iframe bind:this={iframe} src={pdfUrl} class="w-full h-full border-0" title="PDF Viewer">
				<p>
					Your browser doesn't support PDF viewing. <a href={pdfUrl} download={fileName}
						>Download the PDF</a
					> to view it.
				</p>
			</iframe>
		</div>
	{:else}
		<div class="flex items-center justify-center w-full h-full">
			<p class="text-muted-foreground">Loading PDF...</p>
		</div>
	{/if}
</div>
