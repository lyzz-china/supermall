<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <scroll>
      <goods-list ref="recommend" :goods="recommends"/>
      </scroll>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
<!--    <toast :message="message" :show="show"></toast>-->
  </div>
</template>

<script>


import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from  './childComps/DetailBaseInfo'
import DetailShopInfo from  './childComps/DetailShopInfo'
import DetailGoodsInfo from  './childComps/DetailGoodsInfo'
import DetailParamInfo from  './childComps/DetailParamInfo'
import DetailCommentInfo from  './childComps/DetailCommentInfo'
import DetailBottomBar from  './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'

import {getDetail, Goods, Shop, GoodsParam ,getRecommend} from "network/detail";
import {debounce} from "../../common/utils";

import { mapActions } from 'vuex'

// import Toast from 'components/common/toast/Toast'

export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop,
      // Toast,

    },
    data(){
      return {
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex:0,
        isShowBackTop: false,
        // message:'',
        // show:false
      }
    },
  mounted(){

  },
    created() {
      // console.log(this.$route.params);
      this.iid = this.$route.params.iid

      getDetail(this.iid).then(res => {
        const data = res.result
        this.topImages = res.result.itemInfo.topImages

        this.goods = new Goods(data.itemInfo, data.columns,data.shopInfo.services)

        this.shop = new Shop(data.shopInfo)

        this.detailInfo = data.detailInfo

        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // this.commentInfo =
        if (data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]

          // this.$nextTick(()=>{
          //   this.themeTopYs = []
          //
          //   this.themeTopYs.push(0)
          //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          //
          //   console.log(this.themeTopYs);
          // })
        }
        // console.log(this.commentInfo);
      })



      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)

        console.log(this.themeTopYs);
      },200)
    },
  // updated(){
  //     this.themeTopYs = []
  //   this.themeTopYs.push(0)
  //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
  //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
  //
  //   console.log(this.themeTopYs);
  // },
  methods: {
    ...mapActions(['addCart']),
    imageLoad(){
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index){
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
    },
    contentScroll(position){
     const positoinY = -position.y
      // console.log(positoinY)
      let length = this.themeTopYs.length
      for (let i=0 ;i< length - 1; i++) {
        if(this.currentIndex != i && (positoinY >= this.themeTopYs[i] && positoinY < this.themeTopYs[i+1])){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex

          // if ((i < length - 1 && positoinY >= this.themeTopYs[i] && positoinY < this.themeTopYs[i+1])
          // || (i === length - 1 && positoinY >= this.themeTopYs[i])){
          //     this.currentIndex = i
          //     this.$refs.nav.currentIndex = this.currentIndex
          // }
        }
      }

      this.isShowBackTop = (-position.y) > 1000
    },
    backClick(){
      this.$refs.scroll.scrollTo(0, 0)
    },
    addToCart(){
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // this.$store.cartList.push(product)
      // this.$store.commit('addCart',product)
      this.addCart(product).then(res => {
        // this.show = true
        // this.message = res
        //
        // setTimeout(()=>{
        //   this.show = false
        //   this.message = ''
        // },1500)
        this.$toast.show(res,1500)
      })

      // this.$store.dispatch('addCart',product).then(res => {
      //   console.log(res)
      // })
    }
  }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    background-color: #fff;
    height: calc(100% - 44px - 49px)
  }
</style>
