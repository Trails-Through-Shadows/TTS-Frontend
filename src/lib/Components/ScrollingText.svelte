<script lang="ts">
	import { onDestroy } from "svelte";

	export let scrollSpeed: number = 25;
	export let waitTime: number = 2000;

	// Animation
	let messageContainer: null | HTMLDivElement = null;
	let wrapper: null | HTMLDivElement = null;
	let lastTime = Date.now();
	let direction = 1;

	let timeout: number | null = null;
	let animationFrameRequest: any = null;

	const animationFrame = () => {
		if (direction === 0) {
			return;
		}

		const now = Date.now();
		let delta = now - lastTime;
		lastTime = now;

		if (!messageContainer) return;
		if (!wrapper) return;

		const currentLeft = messageContainer.offsetLeft;
		const width = messageContainer.offsetWidth;
		const wrapperWidth = wrapper.offsetWidth;

		if (wrapperWidth > width) {
			messageContainer.style.left = '0px';
			return;
		}


		if (currentLeft + width < wrapperWidth && direction === 1) {
			direction = 0;
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				direction = -1;
				lastTime = Date.now();
				animationFrameRequest = requestAnimationFrame(animationFrame);
			}, waitTime);
			return;
		} else if (currentLeft > 0 && direction === -1) {
			direction = 0;
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				direction = 1;
				lastTime = Date.now();
				animationFrameRequest = requestAnimationFrame(animationFrame);
			}, waitTime);
			return;
		}

		if (direction === 1) {
			messageContainer.style.left = `${(currentLeft - delta / scrollSpeed)}px`;
		} else if (direction === -1) {
			console.log('moving right');
			messageContainer.style.left = `${(currentLeft + delta / scrollSpeed)}px`;
		}

		animationFrameRequest = requestAnimationFrame(animationFrame);
	}
	animationFrameRequest = requestAnimationFrame(animationFrame);

	onDestroy(() => {
		if (timeout) {
			clearTimeout(timeout);
		}
		if (animationFrameRequest) {
			cancelAnimationFrame(animationFrameRequest);
		}
	});
  </script>

<div class="infoline" bind:this={wrapper}>
	<div class="messages-wrapper" bind:this={messageContainer}>
		<div class="message">
			<slot />
		</div>
	</div>
</div>

<style >
	.infoline {
		width: 100%;
		flex: 1;
		display: inline-block;
		position: relative;
		margin: 0;
		overflow: hidden;
		height: 1.9rem;
		padding: 0;
		box-sizing: border-box;
	}

	.messages-wrapper {
		text-wrap: nowrap;
		position: absolute;
		top: 0.3rem;
		display: flex;
		flex-direction: row;
		gap: 8rem;
		left: 0px;
	}

	.message {
		white-space: nowrap;
	}
</style>