<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <ImgCropper msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import ImgCropper from "@/components/ImgCropper.vue";

export default {
  name: "Home",
  components: {
    ImgCropper
  }
};
</script>
