<template>
  <h1 class="title">
    <slot />
  </h1>
</template>

<style lang="scss">
.title {
  font-size: 35px;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;

  @media only screen and (min-width: 768px) {
    font-size: 50px;
  }
}
</style>
