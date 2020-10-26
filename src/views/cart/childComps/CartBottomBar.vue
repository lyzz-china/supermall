<template>
  <div class="bottom-bar">
    <div class="chenk-content">
      <check-button
        :is-checked="isSelectAll"
        class="chenk-button"
        @click.native="checkClick"
      />
      <span style="padding-left: 5px">全选</span>
    </div>
    <div class="price">
      合计: {{totalPrice}}
    </div>
    <div class="caclulate" @click="calcClick">
      去计算: ({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  import { mapGetters } from 'vuex'

  export default {
    name: "CartBottomBar",
    components:{
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        },0).toFixed(2)
      },
      checkLength(){
        return this.$store.state.cartList.filter(item => item.checked).length
      },
      isSelectAll(){
        if (this.cartList.length === 0) return false

        // return !(this.cartList.filter(item => !item.checked).length)

        // return !this.cartList.find(item => !item.checked)

        let isChecked = false
        for (let item of this.cartList) {
          if (!item.checked) {
            return false
          }
        }
        return true
      }
    },
    methods: {
      checkClick(){
        if (this.isSelectAll){
          this.cartList.forEach(item => item.checked = false)
        }else {
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick(){
        if (!this.isSelectAll) {
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    font-size: 15px;
    height: 40px;
    background-color: #eee;
    position: relative;
    bottom: 40px;
    line-height: 40px;
    display: flex;
  }
  .chenk-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 70px;
  }
  .chenk-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
  .price {
    margin-left: 20px;
    flex: 1;
  }
  .caclulate {
    width: 110px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
