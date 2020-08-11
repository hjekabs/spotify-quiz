<template>
  <div class="h-100 w-100">
    {{ timer }}
    <br />
    {{ answers }}
    <br />
    {{ track }}
  </div>
</template>

<script>
export default {
  props: ['timer', 'answers', 'track']
}
</script>

<style>
</style>