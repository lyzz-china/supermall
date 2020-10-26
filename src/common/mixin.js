import {debounce} from "./utils";

export const itemListenerMinxin = {
  data(){
    itemImgListener:null
  },
  mounted(){
    let newRefresh = debounce(this.$refs.scroll.refresh,100)
    this.itemImgListener = () => {
      console.log('ssssdddss');
      newRefresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener)
    console.log('ssss');
  }
}
