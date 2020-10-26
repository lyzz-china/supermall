<template>
  <div class="wrapper">
    <ul>
      <button @click="btnclick">按钮</button>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
      <li>121212</li>
    </ul>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Category",
    data(){
      return {
        scroll: null
      }
    },
    methods:{
      btnclick(){
        console.log('btnclick');
      }
    },
    mounted() {
      this.scroll = new BScroll(document.querySelector('.wrapper'),{
        probeType: 3,
        pullUpLoad: true
      })

      this.scroll.on('scroll',(position)=>{
        console.log(position);
      })

      this.scroll.on('pullingUp',()=>{
        console.log('上拉加载更多');
      })

    }
  }
</script>

<style scoped>
  .wrapper {
    height: 150px;
    background-color: red;
    overflow: hidden;
  }
</style>
