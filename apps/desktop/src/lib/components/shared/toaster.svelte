<script lang="ts">
	import { toasts, dismissToast, type ToastMessage } from '@/store';
	import { fly } from 'svelte/transition';
	import Icon from '@/components/shared/icon.svelte';
	const icons: Record<string, string> = { success: 'check', error: 'x', info: 'info' };
</script>

<div class="fixed top-3 right-3 z-[100] flex flex-col gap-2 w-80">
	{#each $toasts as t (t.id)}
		<div
			in:fly={{ x: 40, duration: 180 }}
			out:fly={{ x: 40, duration: 150 }}
			class="rounded-md border p-3 shadow-sm bg-secondary-background flex items-start gap-3"
		>
			<Icon
				name={icons[t.type]}
				class={t.type === 'error'
					? 'text-red-500 w-4 h-4 mt-0.5'
					: t.type === 'success'
						? 'text-green-500 w-4 h-4 mt-0.5'
						: 'text-blue-500 w-4 h-4 mt-0.5'}
			/>
			<div class="text-sm flex-1 leading-snug">{t.message}</div>
			<button
				class="text-xs text-muted-foreground hover:text-foreground"
				on:click={() => dismissToast(t.id)}>✕</button
			>
		</div>
	{/each}
</div>
