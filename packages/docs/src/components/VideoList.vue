<template>
  <div class="videos mt-16">
    <VideoItem video="/videos/draggable.mp4" id="fh8r8" :badges="['drag']" />
    <VideoItem video="/videos/cards.mp4" id="fduch" :badges="['drag']" />
    <VideoItem video="/videos/actionsheet.mp4" id="zuwji" :badges="['drag', 'touchaction', 'initial', 'rubberband']" />
    <VideoItem video="/videos/infinitescroll.mp4" id="nigoy" :badges="['wheel', 'drag']" />
    <VideoItem video="/videos/viewpager.mp4" id="v364z" :badges="['drag']" />
    <VideoItem video="/videos/multi.mp4" id="rkgzi" :badges="['drag', 'pinch', 'wheel', 'move']" />
    <VideoItem video="/videos/rocket.mp4" id="vi1tn" :badges="['drag', 'initial']" />
  </div>
</template>

<script>
import VideoItem from './VideoItem.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    VideoItem,
  },
})
</script>

<style lang="postcss">
.videos {
  display: grid;
  align-items: flex-start;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 1rem;
}

.videos > div video {
  transition: filter 400ms ease;
}

.videos > div:hover video {
  filter: brightness(1.1);
}

.badges {
  display: flex;
  margin: 0.4em -0.3rem;
}

.badge {
  font-size: 0.8rem;
  margin: 0 0.3rem;
}

.badges > .badge {
  text-decoration: none;
  @apply bg-gray-700 text-white -mt-4;
  padding: 0.4rem 0.5rem;
  border-radius: 2px;
}

.badges > .badge:hover {
  background-color: var(--bg-accent-primary);
  color: #fff;
}

.playerWrapper {
  position: relative;
  padding-top: 56.25%; /* Player ratio: 100 / (1280 / 720) */
}

.player {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
