<template>
  <svg :height="radius * 2" :width="radius * 2">
    <circle
      stroke="#1db954"
      :stroke-dasharray="circumference + ' ' + circumference"
      :style="{ strokeDashoffset: strokeDashoffset }"
      :stroke-width="stroke"
      fill="transparent"
      :r="normalizedRadius"
      :cx="radius"
      :cy="radius"
    />
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      stroke="#1db954"
      stroke-width="2px"
    >
      Get Ready.
    </text>
  </svg>
</template>

<script>
export default {
  props: {
    radius: Number,
    progress: Number,
    stroke: Number
  },
  data() {
    const normalizedRadius = this.radius - this.stroke * 2
    const circumference = normalizedRadius * 2 * Math.PI

    return {
      normalizedRadius,
      circumference
    }
  },
  computed: {
    strokeDashoffset() {
      return this.circumference - (this.progress / 100) * this.circumference
    }
  }
}
</script>

<style></style>
