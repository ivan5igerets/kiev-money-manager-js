<template>
    <div class="css-diagram-group-list pa-0">
    <v-list-group no-action flat>
        <template v-slot:activator>

            <v-list-item-content @click.stop="openGroupOperationHistory(data.k_category_group)">
              <div class="item align-center">
                <category_icon v-bind:a_icon="{s_icon_class: data.s_icon_class, s_icon_color: data.s_icon_color}"/>
                <div class="main-part">
                    <div class="text">
                        <div> {{ data.text_group }} <span class="percents"> {{ data.m_sum_percent }} % </span> </div>
                        <div> {{ data.m_sum }} </div>
                    </div>
                  <budget_line_diagram
                    :color="data.s_icon_color"
                    v-bind:i_height="5"
                    v-bind:m_budget="data.m_budget"
                    v-bind:m_sum_total="data.m_sum"
                    v-show="data.m_budget !== 0 && enable_budget_mode && !data.is_income"
                  />
                </div>
              </div>
            </v-list-item-content> 
        
            <!-- <v-menu bottom left>
                <template v-slot:activator="{on, attrs}">
                    <v-btn color="grey" icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item key="1" >
                    <v-list-item-title>Редактировать</v-list-item-title>
                    </v-list-item>
                    <v-list-item key="2" >
                    <v-list-item-title>Удалить</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu> -->
        </template>

        <v-list-item
            :key="item.id"
            :to="{name: 'CategoryOperationHistory', params: {k_category: item.k_category}}"
            v-for="item in data.a_category"
        >
            <v-list-item-content>
              <div class="item align-center">
                <category_icon v-bind:a_icon="item.a_icon"/>
                <div class="main-part">
                    <div class="text">
                        <div> {{ item.text_category }}</div>
                        <div> {{ item.m_sum }} </div>
                    </div>
                    <budget_line_diagram
                      :color="item.a_icon.s_icon_color"
                      v-bind:i_height="5"
                      v-bind:m_budget="item.m_budget"
                      v-bind:m_sum_total="item.m_sum"
                      v-show="item.m_budget !== 0 && enable_budget_mode && !item.is_income"
                    />
                </div>
              </div>
            </v-list-item-content> 
        </v-list-item>
        
      
    </v-list-group>
    </div>
</template>

<script>
import category_icon from '@/components/categories/IconShow'
import budget_line_diagram from '@/components/reports/CategoryBudgetLineDiagram'

export default {
  components: {
    category_icon,
    budget_line_diagram
  },

  props: {
    data: {
      type: Object,
      required: true,
    },
    enable_budget_mode: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    openGroupOperationHistory(k_category_group) {
      this.$router.push({name: 'GroupOperationHistory', params: {k_category_group: k_category_group}})
    }
  },

  data() {
    return {
      power: 50
    }
  },
}
</script>

<style lang="scss">

.css-diagram-group-list {
  .v-list-group__header__append-icon {
    min-width: 0!important;
    margin-left: 0!important;
  }

  .v-list-item__action {
    padding-right: 2px!important;
  }

  .v-list-group__header {
    flex-direction: row-reverse !important;
  }

  .item {
    display: flex;
  }

  .main-part {
    width: 100%;
    // align-items: ;
    // background: chartreuse;
  }

  .text {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }
}

.percents {
  margin-left: 5px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */
  color: #787676;
}
</style>