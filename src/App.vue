<template>
  <div id="app">
    <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->

    <router-view />
  </div>
</template>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  height: 100%;
  width: 100%;
}
</style>
