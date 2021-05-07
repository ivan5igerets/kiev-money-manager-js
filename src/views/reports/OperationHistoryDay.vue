<template>
  <div>
    <div class="header">
      <div class="indicator-box">
        <div> Доход </div>
        <div class="income"> {{ monthlyIncome }} </div>
      </div>
      <v-divider
        inset
        vertical
      ></v-divider>
      <div class="indicator-box">
        <div> Затраты </div>
        <div class="spending"> {{ monthlySpanding }} </div>
      </div>
      <v-divider
        inset
        vertical
      ></v-divider>
      <div class="indicator-box">
        <div> Баланс </div>
        <div class="balance"> {{ monthlyIncome - monthlySpanding }} </div>
      </div>
    </div>
      <div class="list-placeholder" v-if="!days.length && !loading">
        В этом месяце нет записей
      </div>
    <loader v-if="loading" />
    <div
      class="day"
      v-bind:class="{'last-day': i === days.length-1}"
      v-for="(day, i) in days"
      :key="i"
      v-else
    >
          <div class="list-header">
            <div class="item"> {{ dateFormating(day[0].dl_operation) }} </div>
            <div class="right-part">
              <div class="item" v-if="sumOfDaysIncome(day)">
                <span class="grey-small-text">
                  Доход: </span> <span class="income">{{sumOfDaysIncome(day)}}
              </span> </div>
              <div class="item" v-if="sumOfDaysSpending(day)">
                <span class="grey-small-text">
                  Затраты: </span> <span class="spending"> {{sumOfDaysSpending(day)}}
              </span> </div>
              <div class="item" v-if="sumOfDaysTransfer(day)">
                <span class="grey-small-text">
                  Перенос: </span> <span class="balance"> {{sumOfDaysTransfer(day)}}
              </span> </div>
            </div>
          </div>
          <v-list dense class="css-operation-day">
            <v-list-item-group color="primary">
              <v-list-item
                :to="{name: 'OperationEdit', params: {k_operation: item.k_operation}}"
                v-for="(item, k_category) in day"
                :key="k_category"
                :disabled="Boolean(item.is_system)"
                class="css-list-item"
              >
                <v-list-item-icon class="mr-3">
                  <category_icon
                    v-bind:a_icon="{
                      s_icon_class: item.s_icon_class, 
                      s_icon_color: item.s_icon_color
                    }"/>
                </v-list-item-icon>
                  <v-list-item-title v-text="item.text_comment ? item.text_comment : item.text_category"></v-list-item-title>
                <v-list-item-action class="css-item-action">
                  <span
                      :class="{transfer:item.is_system, income: item.is_income, spending: !item.is_income || item.m_sum < 0 }">
                    {{item.m_sum}}
                  </span>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
     <operation_button_add />
  </div>
</template>

<script>
import operation_button_add from '@/components/operations/ButtonsAdd'
import category_icon from '@/components/categories/IconShow'
import historyApi from '@/api/history'
import loader from '@/components/Loader'
import {mapState} from 'vuex'
import {CoreDate} from "../../date/CoreDate";

export default {
  components: {
    category_icon,
    loader,
    operation_button_add,
  },

  data() {
    return {
      loading: false,
      days: [],
      date: CoreDate.systemNow(),
      monthlyIncome: 0,
      monthlySpanding: 0,
    }
  },

  mounted() {
    this.getOperations();
    this.$root.$on('change-date', this.changeDate)
  },

  computed: {
    ...mapState('date',{
      month: 'month',
    })
  },

  methods: {
    getOperations() {
      this.loading = true;
      this.days = [];
      this.monthlyIncome = 0;
      this.monthlySpanding = 0;
      historyApi.day({
        dl_filter: this.date
      })
      .then(res => {
        this.countSumOfMonthlyTransactions(res.data)
        this.sortByDate(res.data);
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      })
    },

    sortByDate(operations) {
      const daysTemp = operations.reduce((_, cur) => {
                      if(_[cur.dl_operation]) {
                          _[cur.dl_operation].push(cur);
                  } else {
                      _[cur.dl_operation] = [cur];
                  }
                  return _;
                  }, {})
                  

      const keys = Object.keys(daysTemp);
      keys.sort(function(a, b) {
        return (new Date(b) - new Date(a));
      })

      let k;
      for (let i = 0; i < keys.length; i++) {
        k = keys[i];
        this.days.push(daysTemp[k])
      }
    },

    countSumOfMonthlyTransactions(arr) {
        arr.forEach(el => {
          if (el.is_income) {
            this.monthlyIncome += el.m_sum;
          } else {
            this.monthlySpanding += el.m_sum;
          }
        });
    },

    countSumOfDayTransactions(arr, is_system, is_income) {
      return arr.reduce( (total, day) => {
        if((is_income !== undefined && day.is_income === is_income && !day.is_system) || is_system && day.is_system) {
          return total + day.m_sum;
        } 
        return total;
      }, 0 )
    }, 

    sumOfDaysIncome(arr) {
      return this.countSumOfDayTransactions(arr, 0, 1);
    },

    sumOfDaysSpending(arr) {
      return this.countSumOfDayTransactions(arr, 0, 0);
    },

    sumOfDaysTransfer(arr) {
      return this.countSumOfDayTransactions(arr, 1);
    },

    dateFormating(dateStr) {
      const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      const date = new Date(dateStr);
      return `${this.pad(date.getDate())}/${this.pad(date.getMonth() + 1)} ${ daysOfWeek[date.getDay()]}`;
    },

    pad(num) {
      if(num < 10) {
        return '0' + num;
      }
      return num;
    },


    changeDate(date) {
      this.date = date
      this.getOperations();
    },
  }
}
</script>

<style lang="scss" scoped>

$income: #5ED400;
$spending: #FF0000;
$balance: #028BD9;

.day {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
}

.css-list-item {
  padding: 0 12px !important;
}

.css-item-action {
  margin-left:5px;
  min-width: auto!important;
}

.last-day {
  margin-bottom: 33px;
}

.header {
  display: flex;
  justify-content: space-around;
  position: relative;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}

.datepicker {
  height: 50px;
  padding: 0 10px;
  margin-top: 10px;
}

.list-placeholder {
  text-align: center;
  align-items: center;
  margin-top: 30px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  position: relative;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  margin-top: 20px;
  padding: 5px;

  .right-part {
    display: flex;
  }

  .item {
    text-align: center;
    margin: 0 5px;
  }
}

.grey-small-text {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;

  color: #B6B6B6;

}

.indicator-box {
  text-align: center;
  margin-top: 5px;
  width: 30%;
}

.income {
  color: $income;
}

.spending {
  color: $spending;
}

.transfer {
  color: $balance;
}

.balance {
  color: $balance;
}
</style>