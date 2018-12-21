<template>
  <div class="hello">
    <form ref="myForm" v-validate="validateData">
      <!--<OwnerInput label="姓名" v-model="formData.name" />-->
      <!--<OwnerInput label="电话" v-model="formData.tel" />-->
      <input placeholder="姓名" v-model="formData.name" name="name" />
      <input placeholder="电话" v-model="formData.tel" name="tel" />
      <select name="habit" v-model="formData.habit">
        <option value="">吃饭</option>
        <option value="1">睡觉</option>
        <option value="2">打豆豆</option>
      </select>
    </form>
    <OwnerBtn text="保存" v-check-submit="submit" />
    <!--<button v-check-submit="submit">保存</button>-->
  </div>
</template>

<script>
import OwnerInput from './OwnerInput'
import OwnerBtn from './OwnerBtn'
export default {
  name: 'HelloWorld',
  components: {
    OwnerInput,
    OwnerBtn
  },
  data() {
    return {
      vic: {},
      formData: {
        name: '',
        tel: '',
        habit: ''
      }
    }
  },
  methods: {
    submit() {
      console.log(JSON.parse(JSON.stringify(this.vic)))
    }
  },
  created() {
    this.validateData = {
      validateKey: 'vic',
      ref: 'myForm',
      formData: 'formData',
      fields: [ 'name', 'tel', 'habit' ],
      rules: {
        name: {
          name: 'name',
          validator: [
            {
              fun: val => /^\d+$/.test(val),
              msg: '只接受数字'
            }
          ]
        },
        tel: {
          name: 'tel',
          validator: [
            {
              fun: val => /^\d{10}$/.test(val),
              msg: '只接受数字'
            }
          ]
        },
        habit: {
          name: 'habit',
          validator: [
            {
              fun: val => val !== '',
              msg: '必填'
            }
          ]
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
