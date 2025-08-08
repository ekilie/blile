<script lang="ts">
	import { toasts, dismissToast } from '@/store';
	import { fly } from 'svelte/transition';
	import { CheckCircle2, XCircle, Info, X } from 'lucide-svelte';

	const iconMap = {
		success: CheckCircle2,
		error: XCircle,
		info: Info
	} as const;

	function barStyle(t: { timeout?: number }) {
		const duration = t.timeout ?? 4000;
		if (duration === 0) return '';
		return `animation: toast-bar ${duration}ms linear forwards;`;
	}
</script>

<div
	class="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end gap-3 px-4 py-4 sm:py-5 sm:pr-5"
>
	<div class="flex w-full flex-col items-end gap-3 sm:w-96" aria-live="polite" aria-atomic="false">
		{#each $toasts as t (t.id)}
			<div
				in:fly={{ x: 50, duration: 180 }}
				out:fly={{ x: 50, duration: 160 }}
				class="group pointer-events-auto relative w-full overflow-hidden rounded-lg border border-border/60 bg-secondary-background/95 backdrop-blur supports-[backdrop-filter]:bg-secondary-background/70 shadow-lg shadow-black/10 ring-1 ring-black/5"
				role="status"
			>
				<!-- Accent bar -->
				<span class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-primary/60"
				></span>
				<!-- Progress bar -->
				<span class="absolute bottom-0 left-0 h-0.5 bg-primary/70" style={barStyle(t)} />
				<div class="flex w-full items-start gap-3 px-4 py-3 pr-10 text-sm leading-snug">
					<svelte:component
						this={iconMap[t.type]}
						class={t.type === 'error'
							? 'h-5 w-5 text-red-500 drop-shadow-sm'
							: t.type === 'success'
								? 'h-5 w-5 text-green-500 drop-shadow-sm'
								: 'h-5 w-5 text-blue-500 drop-shadow-sm'}
					/>
					<div
						class="flex-1 whitespace-pre-wrap text-[13px] font-medium tracking-tight text-foreground/90"
					>
						{t.message}
					</div>
					<button
						class="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-md text-foreground/45 transition-colors hover:bg-foreground/5 hover:text-foreground/80 active:scale-95"
						on:click={() => dismissToast(t.id)}
						aria-label="Dismiss notification"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	@keyframes toast-bar {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}
</style>
