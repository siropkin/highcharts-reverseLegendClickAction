(function (H) {
  H.wrap(H.Chart.prototype, 'init', function (proceed) {
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    const chart = this;
    const isLegendClickReversed = chart.legend.options.reverseLegendClickAction || false;
    chart.update({
      chart: {
        __visibleSeries: []
      }
    });
    if(isLegendClickReversed === true){
      if(!chart.options.plotOptions.series){
        chart.options.plotOptions.series = {};
      }
      if(!chart.options.plotOptions.series.events){
        chart.options.plotOptions.series.events = {};
      }
      chart.update({
        plotOptions:{
          series:{
            events: {
              legendItemClick: function (e) {
                e.preventDefault();
                if(this.chart.options.chart.__visibleSeries.length == 1 && this.chart.options.chart.__visibleSeries[0] === this.name){
                  // make all legend items visible
                  this.chart.series.forEach(serie => serie.setVisible(true));
                  this.chart.options.chart.__visibleSeries.length = 0;
                  return false;
                }
                if(!this.chart.options.chart.__visibleSeries.includes(this.name)){
                  this.chart.options.chart.__visibleSeries.push(this.name);
                }else{
                  this.setVisible(false);
                  let index = this.chart.options.chart.__visibleSeries.indexOf(this.name);
                  this.chart.options.chart.__visibleSeries.splice(index, 1);
                  return false;
                }
                //deselect all the series which are not in the __visibleSeries array;
                this.chart.series.forEach(serie => {
                  if(this.chart.options.chart.__visibleSeries.includes(serie.name)){
                    serie.setVisible(true);
                  }else{
                    serie.setVisible(false);
                  }
                });
                if(this.chart.options.chart.__visibleSeries.length === this.chart.series.length){
                  this.chart.options.chart.__visibleSeries.length = 0;
                }
              }
            }
          }
        }
      })
    }
  });
}(Highcharts));
