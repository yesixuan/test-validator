<template>
  <div>
    <button>{{ text }}</button><span>sdfg</span>
  </div>
</template>

<script>
  export default {
    name: 'OwnerBtn',
    props: {
      text: {
        required: true,
        type: String
      }
    }
  }
</script>

<style scoped>

</style>