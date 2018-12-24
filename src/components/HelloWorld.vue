<template>
  <div class="hello">
    <form ref="myForm">
      <!--<OwnerInput label="姓名" v-model="formData.name" />-->
      <!--<OwnerInput label="电话" v-model="formData.tel" />-->
      <input placeholder="姓名" v-model="formData.name" name="name" />
      <input placeholder="电话" v-model="formData.tel" name="tel" />
      <select name="habit" v-model="formData.habit">
        <option value="">空</option>
        <option value="1">睡觉</option>
        <option value="2">打豆豆</option>
      </select>
    </form>
    <OwnerBtn text="保存" v-validate:submit="validateData" />
    <!--<button v-check-submit="submit">保存</button>-->
    <br>
    {{ JSON.parse(JSON.stringify(this.vic)) }}
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
  computed: {
    test() {
      return 'hehe'
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
        name: [
          {
            fun: val => /^\d+$/.test(val),
            msg: '只接受数字'
          }
        ],
        tel: [
          {
            fun: val => /^\d{10}$/.test(val),
            msg: '只接受10位数字'
          }
        ],
        habit: [
          {
            fun: val => val !== '',
            msg: '必填'
          }
        ]
      }
    }
  },
  mounted() {
    console.log(this)
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
