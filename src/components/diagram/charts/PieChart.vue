<template>
    <div>
        <div id="chartdiv"></div>
    </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

export default {

    data() {
        return {
            chartDataArr: [],
            chartColorArr: [],
        }
    },
    
    props: {
        data: {
            type: Array,
            required: true,
        },
    },

    created() {
        this.data.forEach(el => {
            if (el.k_category) {
                this.chartDataArr.push({
                    category: el.text_category,
                    count: el.m_sum,
                })

                this.chartColorArr.push(am4core.color(el.a_icon.s_icon_color))
            } else {
                this.chartDataArr.push({
                    category: el.text_group,
                    count: el.m_sum,
                })

                this.chartColorArr.push(am4core.color(el.s_icon_color))
            }
        })
    },

    mounted() {
        am4core.options.autoDispose = true;
        
        const chart = am4core.create("chartdiv", am4charts.PieChart);
        chart.data = this.chartDataArr;

        const pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "count";
        pieSeries.dataFields.category = "category";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.labels.template.disabled = true;
        pieSeries.colors.list = this.chartColorArr;

        this.hiddenLink();
    },

    methods: {
        hiddenLink() {
            const chartTemp = document.getElementById('chartdiv');
            let link = chartTemp.firstElementChild;

            for(let i = 0; i < 6; ++i) {
                link = link.lastElementChild;
            }
            link.previousElementSibling.style = "display: none"
        },
    },
}
</script>

<style scoped>
#chartdiv {
  width: 100%;
  height: 250px;
}
</style>