var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

//var ROOT_PATH = 'https://echarts.apache.org/examples';
//import * as echarts from 'echarts';
//var chartDom = document.getElementById('main');
//var myChart = echarts.init(chartDom);
var option;

(function () {
  const prepared = document.createElement('template')
  prepared.innerHTML = `
      <style>chart_dom
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
    class SamplePrepared extends HTMLElement {
      constructor () {
        super()
  
        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._shadowRoot.appendChild(prepared.content.cloneNode(true))
  
        this._root = this._shadowRoot.getElementById('root')
  
        this._props = {}
  
        this.render()
        this._selectedDataPoint = {}
      }

      getSelectedDataPoint () {
        return this._selectedDataPoint
      }
  
      async render (resultSet) {
        await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js')
  
        const chart = echarts.init(this._root)
        var length=resultSet.length;

        //取数据并设置MAP需要的数组
        const labels = [];
        const values = [];
        for (var i=0; i<length;i++){
    
          var lab = resultSet[i]["ID_264y6h04q5"].description;
  
          if (labels.indexOf(lab) === -1) {
           labels.push(lab);
           }
  
          var val = Number(resultSet[i]["@MeasureDimension"].rawValue);
           values.push(val); 
        }
        //console.log("labels");
        //console.log(labels);
        //console.log(values);
  
        const data = values.map((label, index) => ({ value: label, name: labels[index] }));
  
        //console.log(data);

        //传递数据

        $.get('http://localhost:3000/beef_cuts_france.svg', function (svg) {
          echarts.registerMap('beef_cuts_france', { svg: svg });
          option = {
            tooltip: {},
            visualMap: {
              left: 'center',
              bottom: '10%',
              min: 0,
              max: 10000,
              orient: 'horizontal',
              text: ['', 'Price'],
              realtime: true,
              calculable: true,
              inRange: {
                color: ['#dbac00', '#db6e00', '#cf0000']
              }
            },
            series: [
              {
                name: 'French Beef Cuts',
                type: 'map',
                map: 'beef_cuts_france',
                roam: true,
                emphasis: {
                  label: {
                    show: false
                  }
                },
                selectedMode: false,
                data: data,
              }
            ]
          };
        
        chart.setOption(option)
      });

      chart.on('click',   (params)=> {
        // https://echarts.apache.org/en/api.html#events.Mouse%20events
        // console.log(params),
        const { seriesIndex, seriesName, dataIndex, data, name } = params
        this._selectedDataPoint = { seriesIndex, seriesName, dataIndex, data, name }
        this.dispatchEvent(new Event('onClick'))
      })
      //option && myChart.setOption(option);
    }}

  customElements.define('com-beef-cuts-echarts', SamplePrepared)
})()
