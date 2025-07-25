<script lang="ts">
	import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@haptic/ui/components/sheet';
	import { isChatSidebarOpen } from '@/store';

	let messages: { sender: 'user' | 'ai'; text: string }[] = [
		{ sender: 'ai', text: 'Hi! Ask me anything about your document.' }
	];
	let input = '';
	let loading = false;

	function sendMessage() {
		if (!input.trim()) return;
		messages = [...messages, { sender: 'user', text: input }];
		loading = true;
		// Simulate AI response
		setTimeout(() => {
			messages = [...messages, { sender: 'ai', text: `AI response to: "${input}"` }];
			loading = false;
		}, 1000);
		input = '';
	}
</script>

<SheetContent
	side="right"
	class="max-w-md w-full flex flex-col h-full"
	on:close={() => isChatSidebarOpen.set(false)}
>
	<SheetHeader>
		<SheetTitle>Chat with your document</SheetTitle>
	</SheetHeader>
	<div class="flex-1 overflow-y-auto px-2 py-4 space-y-2">
		{#each messages as msg}
			<div class="flex {msg.sender === 'user' ? 'justify-end' : 'justify-start'}">
				<div
					class="rounded-lg px-3 py-2 max-w-xs text-sm"
					class:bg-primary={msg.sender === 'user'}
					class:bg-muted={msg.sender === 'ai'}
					class:text-white={msg.sender === 'user'}
					class:text-foreground={msg.sender === 'ai'}
				>
					{msg.text}
				</div>
			</div>
		{/each}
		{#if loading}
			<div class="flex justify-start">
				<div
					class="rounded-lg px-3 py-2 max-w-xs text-sm bg-muted text-foreground opacity-70 animate-pulse"
				>
					AI is typing...
				</div>
			</div>
		{/if}
	</div>
	<SheetFooter class="p-2 border-t flex items-center gap-2">
		<input
			class="flex-1 border rounded px-2 py-1 text-sm"
			placeholder="Type your question..."
			bind:value={input}
			on:keydown={(e) => e.key === 'Enter' && sendMessage()}
			disabled={loading}
		/>
		<button
			class="btn btn-primary px-3 py-1 rounded"
			on:click={sendMessage}
			disabled={loading || !input.trim()}
		>
			Send
		</button>
	</SheetFooter>
</SheetContent>

<style>
	.btn-primary {
		background: hsl(var(--primary));
		color: white;
	}
</style>
