<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1" class="tab-control" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
            <!--@pullingUp="loadMore"-->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/nvabar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import { getHomeMultidata,getHomeGoods } from 'network/home'
  import {debounce} from 'common/utils'


  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,

    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    data(){
      return {
        banners: [],
        recommends:[],
        goods:{
          'pop': {page: 0,list:[]},
          'new': {page: 0,list:[]},
          'sell': {page: 0,list:[]}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        // saveY: 0

      }
    },
    //不用这样也可以不销毁页面
    // destroyed() {
    //
    // },
    // activated(){
    //   this.$refs.scroll.scrollTo(0,this.saveY,0)
    //   this.$refs.scroll.refresh()
    // },
    // deactivated(){
    //   this.saveY = this.$refs.scroll.getScrollY()
    // },
    created() {
      //1.请求多个数据
     this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mounted(){
      //1.图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh,50  )
      this.$bus.$on('itemImageLoad', ()=>{
        // console.log("-----")
        refresh()
        // this.$refs.scroll.refresh()
      })
    },
    methods: {
      //事件监听
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        if (this.$refs.tabControl1 !== undefined){
          this.$refs.tabControl1.currentIndex = index
          this.$refs.tabControl2.currentIndex = index
        }

      },
      backClick(){
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position){
        this.isShowBackTop = (-position.y) > 1000

        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },


      //网络请求
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          // console.log(this.goods[type].list)
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style sc1oped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  .content {
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }

  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
