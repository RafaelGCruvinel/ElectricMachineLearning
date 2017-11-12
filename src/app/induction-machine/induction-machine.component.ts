import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import 'nvd3';
declare let d3: any;

import * as math from 'mathjs';
declare let math: any;

@Component({
    selector: 'app-induction-machine',
    templateUrl: 'induction-machine.component.html',
    styleUrls: [
      'induction-machine.component.scss',
      '../../../node_modules/nvd3/build/nv.d3.css'
    ],
    encapsulation: ViewEncapsulation.None
})

export class InductionMachineComponent implements OnInit {

  options;
  options2;
  options3;
  data;
  data2;
  data3;
  percentageVoltage = 100;
  percentageRtwo = 100;
  // functions
  graficalizer;
  graficalizer2;
  graficalizer3;
  changeVoltage;
  changeRtwo;
  changeVt;
  changeXm;
  changeX1;
  changeR1;
  changeX2l;
  changeR2l;
  updateGraphs;
  p;
  f;
  r1;
  r2l;
  rth;
  s;
  t;
  v1;
  vth;
  x1;
  xth;
  x2l;
  xm;
  i2l;
  ws;
  vt;
  //private vtGeneral: Number = 2200;
  public general = {
    p: 6,
    f: 60,
    xm: 273.04,
    x1: 7.96,
    r1: 2.8,
    x2l: 7.96,
    //ns: 0,
    //ws: 0,
    vt: 2200,
    r2l: 2.12,
  }
  public generalVt = 2200;
  public generalXm = 273.04;
  public generalX1 = 7.96;
  public generalR1 = 2.8;
  public generalX2l = 7.96;
  public generalR2l = 2.12;

    constructor() {

      function changeVt() {
        console.log("Changing Vt to ", this.generalVt);
        this.general.vt = this.generalVt;
        updateGraphs();
      }
      function changeXm() {
        console.log("Changing Xm to ", this.generalXm);
        this.general.xm = this.generalXm;
        updateGraphs();
      }
      function changeX1() {
        console.log("Changing X1 to ", this.generalX1);
        this.general.x1 = this.generalX1;
        updateGraphs();
      }
      function changeR1() {
        console.log("Changing R1 to ", this.generalR1);
        this.general.r1 = this.generalR1;
        updateGraphs();
      }
      function changeX2l() {
        console.log("Changing X2' to ", this.generalX2l);
        this.general.x2l = this.generalX2l;
        updateGraphs();
      }
      function changeR2l() {
        console.log("Changing R2' to ", this.generalR2l);
        this.general.r2l = this.generalR2l;
        updateGraphs();
      }


      let updateGraphs = () => {
        console.log('Updating graphs...');
        this.data = graficalizer(this.general, this.percentageVoltage, this.percentageRtwo);
        this.data2 = graficalizer2(this.general, this.percentageVoltage, this.percentageRtwo);
        this.data3 = graficalizer3(this.general, this.percentageVoltage, this.percentageRtwo);
      }

      function changeVoltage($event){
        let value = $event.value;
        console.log("Changing voltage to " + value);

        this.percentageVoltage = value;
        updateGraphs();
      }

      function changeRtwo($event){
        let value = $event.value;
        console.log("Changing Rtwo to " + value);

        this.percentageRtwo = value;
        updateGraphs();
      }

      function calcVth(x1, xm, v1, r1) {
        let num = xm * v1;
        let den = Math.sqrt(r1 * r1 + (x1 + xm) * (x1 + xm));
        return num / den;
      }

      function calcRth(x1, xm, v1, r1) {
        let num = xm * xm * r1;
        let den = r1 * r1 + (x1 + xm) * (x1 + xm);
        return num / den;
      }

      function calcXth(x1, xm, v1, r1) {
        let num = xm * (xm * x1 + x1 * x1 + r1 * r1);
        let den = r1 * r1 + (x1 + xm) * (x1 + xm);
        return num / den;
      }

      function calcNs(f, p) {
        return 120 * f / p;
      }

      function calcWs(ns) {
        return 2 * Math.PI * ns / 60;
      }

      function calcS(ns, n) {
        return (ns - n ) / ns;
      }

      // Calcular torque com n, porcentagem da tensão, e porcentagem de r2
      function calcTorque(general, n, pv1, pr2){
        let p, f, ns, w, xm, x1, r1, r2l, x2l, ws, v1, rth, xth, vth, s;
        let num, den;
        p = general.p;
        f = general.f;
        xm = general.xm
        x1 = general.x1;
        r1 = general.r1
        x2l = general.x2l
        ns = calcNs(f, p);
        ws = calcWs(ns);
        r2l = general.r2l * pr2;
        v1 = general.vt * pv1 / Math.sqrt(3);
        rth = calcRth(x1, xm, v1, r1);
        xth = calcXth(x1, xm, v1, r1);
        vth = calcVth(x1, xm, v1, r1);

        // torque
        s = calcS(ns, n);

        num = vth* vth * r2l;
        den = s * ws * ( ( rth + r2l / s) * (rth + r2l / s) + ( xth + x2l ) * ( xth + x2l ) );

        // console.log(num/den);

        return num / den;
      }

      function calcCorrente(general, n, pv1, pr2){
        let p, f, ns, w, xm, x1, r1, r2l, x2l, ws, v1, rth, xth, vth, s;
        let num, den, j, z1, i1;
        let num1, den1;

        p = general.p;
        f = general.f;
        xm = general.xm
        x1 = general.x1;
        r1 = general.r1
        x2l = general.x2l
        ns = calcNs(f, p);
        ws = calcWs(ns);
        r2l = general.r2l * pr2;
        v1 = general.vt * pv1 / Math.sqrt(3);
        rth = calcRth(x1, xm, v1, r1);
        xth = calcXth(x1, xm, v1, r1);
        vth = calcVth(x1, xm, v1, r1);

        s = calcS(ns, n);

        // Corrente
        z1 = math.complex(r1, x1)
        num1 = math.multiply(math.complex(r2l/s, x2l), math.complex(0, xm));
        den1 = math.complex(r2l/s, xm + x2l)
        z1 = math.add(z1, math.divide(num1, den1));
        i1 = math.divide(v1, z1)
        return i1.abs();
      }
      // calc corrente slide 15

      function calcFatPot(general, n, pv1, pr2){
        // calc corrente slide 15
        let p, f, ns, w, xm, x1, r1, r2l, x2l, ws, v1, rth, xth, vth, s;
        let num, den, j, z1, i1;
        let num1, den1;
        p = general.p;
        f = general.f;
        xm = general.xm
        x1 = general.x1;
        r1 = general.r1
        x2l = general.x2l
        ns = calcNs(f, p);
        ws = calcWs(ns);
        r2l = general.r2l * pr2;
        v1 = general.vt * pv1 / Math.sqrt(3);
        rth = calcRth(x1, xm, v1, r1);
        xth = calcXth(x1, xm, v1, r1);
        vth = calcVth(x1, xm, v1, r1);

        s = calcS(ns, n);

        // Corrente
        z1 = math.complex(r1, x1)
        num1 = math.multiply(math.complex(r2l/s, x2l), math.complex(0, xm));
        den1 = math.complex(r2l/s, xm + x2l)
        z1 = math.add(z1, math.divide(num1, den1));
        i1 = math.divide(v1, z1)
        return math.cos(i1.arg());
      }



      /*Create graph 01 */
      function graficalizer(general, valueOne, valueTwo) {
        let funct1 = [], funct2 = [],
          funct3 = [], funct4 = [],
          funct5 = [];

        // Data is represented as an array of {x,y} pairs.
        for (let i = 0; i <= 100; i++) {
           funct1.push({ x: i * 12, y: calcTorque(general, i * 12, 1, 1) });
           funct2.push({ x: i * 12, y: calcTorque(general, i * 12, valueOne/100, valueTwo/100) });
        }

        // Line chart data should be sent as an array of series objects.
        return [
          {
            values: funct1,  // values - represents the array of {x,y} data points
            key: 'Padrão', // key  - the name of the series.
            color: '#ff7f0e'  // color - optional: choose your own line color.
          },
          {
            values: funct2,
            key: 'Custom',
            color: '#2ca02c',
            area: true
          },
        ];
      }

      /*Create graph 02 */
      function graficalizer2(general, valueOne, valueTwo) {
        let funct1 = [], funct2 = [], funct3 = [];

        // Data is represented as an array of {x,y} pairs.
        for (let i = 0; i <= 100; i++) {
           funct1.push({ x: i * 12, y: calcCorrente(general, i * 12, 1, 1) });
           funct2.push({ x: i * 12, y: calcCorrente(general, i * 12, valueOne/100, valueTwo/100) });
        }

        // Line chart data should be sent as an array of series objects.
        return [
          {
            values: funct1,  // values - represents the array of {x,y} data points
            key: 'Padrão', // key  - the name of the series.
            color: '#ff7f0e'  // color - optional: choose your own line color.
          },
          {
            values: funct2,
            key: 'Custom',
            color: '#2ca02c',
            area: true
          },
        ];
      }

      /*Create graph 03 */
      function graficalizer3(general, valueOne, valueTwo) {
        let funct1 = [], funct2 = [], funct3 = [];

        // Data is represented as an array of {x,y} pairs.
        for (let i = 0; i <= 100; i++) {
           funct1.push({ x: i * 12, y: calcFatPot(general, i * 12, 1, 1) });
           funct2.push({ x: i * 12, y: calcFatPot(general, i * 12, valueOne/100, valueTwo/100) });
        }

        // Line chart data should be sent as an array of series objects.
        return [
          {
            values: funct1,  // values - represents the array of {x,y} data points
            key: 'Padrão', // key  - the name of the series.
            color: '#ff7f0e'  // color - optional: choose your own line color.
          },
          {
            values: funct2,
            key: 'Custom',
            color: '#2ca02c',
            area: true
          },
        ];
      }

      this.graficalizer = graficalizer;
      this.graficalizer2 = graficalizer2;
      this.graficalizer3 = graficalizer3;

      this.changeVt = changeVt;
      this.changeRtwo = changeRtwo;
      this.changeVoltage = changeVoltage;
      this.changeXm = changeXm;
      this.changeX1 = changeX1;
      this.changeR1 = changeR1;
      this.changeX2l = changeX2l;
      this.changeR2l = changeR2l;
      this.updateGraphs = updateGraphs;
    }


    ngOnInit() {

      // console.log('math Complex' + math.complex(2, 3));

      this.options = {
        chart: {
          type: 'lineChart',
          height: 450,
          margin: {
            top: 20,
            right: 20,
            bottom: 40,
            left: 55
          },
          x: function (d) { return d.x; },
          y: function (d) { return d.y; },
          useInteractiveGuideline: true,
          dispatch: {
            stateChange: function (e) { console.log('stateChange'); },
            changeState: function (e) { console.log('changeState'); },
            tooltipShow: function (e) { console.log('tooltipShow'); },
            tooltipHide: function (e) { console.log('tooltipHide'); }
          },
          xAxis: {
            axisLabel: 'n [rpm]'
          },
          yAxis: {
            axisLabel: 'T [Nm]',
            tickFormat: function (d) {
              return d3.format('.02f')(d);
            },
            axisLabelDistance: -10
          },
          callback: function (chart) {
            console.log('!!! lineChart callback !!!');
          }
        },
        title: {
          enable: true,
          text: 'Curva Conjugado x Velocidade'
        },
        subtitle: {
          enable: false,
          text: 'Subtitle for simple line chart.',
          css: {
            'text-align': 'center',
            'margin': '10px 13px 0px 7px'
          }
        },
        caption: {
          enable: true,
          html: '<b>Figure 1.</b> Gráfico baseado no exemplo 5.2 do P. C. Sen, terceira edição.',
          css: {
            'text-align': 'justify',
            'margin': '10px 13px 0px 7px'
          }
        }
      };

    this.data = this.graficalizer(this.general, this.percentageVoltage, this.percentageRtwo);

    this.options2 = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function (d) { return d.x; },
        y: function (d) { return d.y; },
        useInteractiveGuideline: true,
        dispatch: {
          stateChange: function (e) { console.log('stateChange'); },
          changeState: function (e) { console.log('changeState'); },
          tooltipShow: function (e) { console.log('tooltipShow'); },
          tooltipHide: function (e) { console.log('tooltipHide'); }
        },
        xAxis: {
          axisLabel: 'n [rpm]'
        },
        yAxis: {
          axisLabel: 'I [A]',
          tickFormat: function (d) {
            return d3.format('.02f')(d);
          },
          axisLabelDistance: -10
        },
        callback: function (chart) {
          console.log('!!! lineChart callback !!!');
        }
      },
      title: {
        enable: true,
        text: 'Curva Corrente x Velocidade'
      },
      subtitle: {
        enable: false,
        text: 'Subtitle for simple line chart.',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: true,
        html: '<b>Figure 1.</b> Gráfico baseado no exemplo 5.2 do P. C. Sen, terceira edição.',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    };

    this.data2 = this.graficalizer2(this.general, this.percentageVoltage, this.percentageRtwo);

    this.options3 = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function (d) { return d.x; },
        y: function (d) { return d.y; },
        useInteractiveGuideline: true,
        dispatch: {
          stateChange: function (e) { console.log('stateChange'); },
          changeState: function (e) { console.log('changeState'); },
          tooltipShow: function (e) { console.log('tooltipShow'); },
          tooltipHide: function (e) { console.log('tooltipHide'); }
        },
        xAxis: {
          axisLabel: 'n [rpm]'
        },
        yAxis: {
          axisLabel: 'FP',
          tickFormat: function (d) {
            return d3.format('.02f')(d);
          },
          axisLabelDistance: -10
        },
        callback: function (chart) {
          console.log('!!! lineChart callback !!!');
        }
      },
      title: {
        enable: true,
        text: 'Curva Fator de Potência x Velocidade'
      },
      subtitle: {
        enable: false,
        text: 'Subtitle for simple line chart.',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: true,
        html: '<b>Figure 1.</b> Gráfico baseado no exemplo 5.2 do P. C. Sen, terceira edição.',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    };

    this.data3 = this.graficalizer3(this.general, this.percentageVoltage, this.percentageRtwo);

  }
}
