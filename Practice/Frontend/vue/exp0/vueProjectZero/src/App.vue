<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue';

const isChecked = ref(false);
const textInput = ref('');
const randomNumber = ref(null);

async function fetchRandomNumber() {
  try {
    const response = await fetch('https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new');
    if (!response.ok) throw new Error('Network response was not ok');
    const number = await response.text();
    randomNumber.value = number.trim();  // trim to clean up whitespace/newlines
  } catch (error) {
    randomNumber.value = 'Error fetching number';
  }
}


</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

<input type="checkbox" id="toggle" v-model="isChecked" />
<label for="toggle">Show text field</label>

<div v-if="isChecked">
<input
  type="text"
  v-model="textInput"
  placeholder="Enter something..."
  @keyup.enter="fetchRandomNumber"
/>

<p>You typed: {{ textInput }}</p>
<p v-if="randomNumber !== null">Random Number: {{ randomNumber }} </p>
</div>


      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
