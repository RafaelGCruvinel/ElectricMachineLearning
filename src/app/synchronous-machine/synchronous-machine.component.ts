import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import 'nvd3';
declare let d3: any;


@Component({
    selector: 'app-synchronous-machine',
    templateUrl: 'synchronous-machine.component.html',
    styleUrls: [
      '../../../node_modules/nvd3/build/nv.d3.css'
    ],
    encapsulation: ViewEncapsulation.None
})
export class SynchronousMachineComponent implements OnInit {
  options;
  data;
  percentageVoltage = 27;
  percentageRtwo = 100;
  //functions
  graficalizer;
  changeRange;
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





    constructor() {
      function changeRange() {
        this.data = graficalizer(this.value, this.percentageRtwo);
        console.log("new value: " + this.value);
      }

      function calcVth(x1, xm, v1, r1) {
        let num = xm * v1;
        let den = Math.sqrt(r1 * r1 + (x1 + xm) * (x1 + xm));
        // if(true){
        //   console.log("Calculando Vth")
        //   console.log("x1 = ", x1, "xm = ", xm, "v1 = ", v1, "r1 = ", r1)
        //   console.log("num = ", num,"den = ", den, "return", num/den);
        // }
        return num/den;
      }

      function calcRth(x1, xm, v1, r1) {
        let num = xm * xm * r1;
        let den = r1 * r1 + (x1 + xm) * (x1 + xm);
        // if(true){
        //   console.log("Calculando Rth")
        //   console.log("x1 = ", x1, "xm = ", xm, "v1 = ", v1, "r1 = ", r1)
        //   console.log("num = ", num,"den = ", den, "return", num/den);
        // }
        return num/den;
      }

      function calcXth(x1, xm, v1, r1) {
        let num = xm * (xm * x1 + x1 * x1 + r1 * r1);
        let den = r1 * r1 + (x1 + xm) * (x1 + xm);
        // if(true){
        //   console.log("Calculando Xth")
        //   console.log("x1 = ", x1, "xm = ", xm, "v1 = ", v1, "r1 = ", r1)
        //   console.log("num = ", num,"den = ", den, "return", num/den);
        // }
        return num/den;
      }

      function calcNs(f, p){
        return 120 * f / p;
      }

      function calcWs(ns){
        return 2 * Math.PI * ns / 60;
      }

      function calcS(ns, n){
        return (ns - n ) / ns;
      }

      function vth(Xone, Xm, Vone, Rone) {
        return (Xm * Vone) / Math.sqrt(Rone * Rone + (Xone + Xm) * (Xone + Xm));
      }

      function rth(Xone, Xm, Vone, Rone) {
        return (Xm * Xm * Rone) / (Rone * Rone + (Xone + Xm) * (Xone + Xm));
      }

      function xth(Xone, Xm, Vone, Rone) {
        return (Xm * (Xm * Xone + Xone * Xone + Rone * Rone)) / (Rone * Rone + (Xone + Xm) * (Xone + Xm));
      }

      function calcTorque(n){
        let p, f, ns, w, xm, x1, r1, r2l, x2l, ws, v1, rth, xth, vth, s;
        let num, den;
        p = 6;
        f = 60;
        ns = calcNs(f, p);
        ws = calcWs(ns);
        xm = 273.04;
        x1 = 7.96;
        r1 = 2.8;
        r2l = 2.12;
        x2l = 7.96;
        v1 = 2200 / Math.sqrt(3);
        rth = calcRth(x1, xm, v1, r1);
        xth = calcXth(x1, xm, v1, r1);
        vth = calcVth(x1, xm, v1, r1);

        //torque
        s = calcS(ns, n);

        num = vth* vth * r2l;
        den = s * ws * ( ( rth + r2l / s) * (rth + r2l / s) + ( xth + x2l ) * ( xth + x2l ) );

        console.log(num/den);

        return num / den;
        // num = 3 * Vth * Vth * Rtwo;
        // div = ws * s * (Math.pow((Rth + Rtwo / s), 2) + Math.pow((Xth + Xtwo), 2));

        //T(i,j)=(1/wsyn) * Vth(j)^2 / ( (Rth+R2l/s(i,j)) ^2 + (Xth+X2l)^2 )*(R2l/s(i,j));
        //T(i,j)=(1/wsyn) * Vth(j)^2 / ( (Rth+R2l/s(i,j)) ^2 + (Xth+X2l)^2 )*(R2l/s);
      }

      function torque(i, percentVoltage, percentRtwo) {
        let T, ws, VthValue, Rth, Rs, s, Xth, Xtwo, Rone, Rtwo, f, Xone, Vone;
        let num, div, n, Xm, Vth, p;
        p = 6;
        f = 60;
        n = 120 * f / p;
        Xm = 273.04;
        Xone = 7.96;
        Rone = 2.8;
        Rtwo = 2.12 * percentRtwo / 100;
        Xtwo = 7.96;
        Vone = 2200 * (percentVoltage / 100) / Math.sqrt(3);
        ws = f * 4 * 3.1415 / (p);
        Vth = vth(Xone, Xm, Vone, Rone);
        Rth = rth(Xone, Xm, Vone, Rone);
        Xth = xth(Xone, Xm, Vone, Rone);
        s = 1 - i / 100;
        num = 3 * Vth * Vth * Rtwo;
        div = ws * s * (Math.pow((Rth + Rtwo / s), 2) + Math.pow((Xth + Xtwo), 2));
        T = num / div;
        return T;
      }

      /*Random Data Generator */
      function graficalizer(valueOne, valueTwo) {
        var funct1 = [], funct2 = [],
          funct3 = [], funct4 = [],
          funct5 = [];

        //Data is represented as an array of {x,y} pairs.
        for (var i = 0; i < 100; i++) {
           funct1.push({ x: i * 12, y: calcTorque(i*12) });
          //  funct2.push({ x: i * 12, y: torque(i, 75, 100) });
          //  funct3.push({ x: i * 12, y: torque(i, 50, 100) });
          //  funct4.push({ x: i * 12, y: torque(i, 25, 100) });
          //  funct5.push({ x: i * 12, y: torque(i, valueOne, valueTwo) });
        }

        //Line chart data should be sent as an array of series objects.
        return [
          {
            values: funct1,      //values - represents the array of {x,y} data points
            key: 'Vth = 100%', //key  - the name of the series.
            color: '#ff7f0e'  //color - optional: choose your own line color.
          },
          // {
          //   values: funct2,
          //   key: 'Vth = 75%',
          //   color: '#2ca02c'
          // },
          // {
          //   values: funct3,
          //   key: 'Vth = 50%',
          //   color: '#7777ff',
          //   //area: true
          // },
          // {
          //   values: funct4, //values - represents the array of {x,y} data points
          //   key: 'Vth = 25%', //key  - the name of the series.
          //   color: '#0f0'  //color - optional: choose your own line color.
          // },
          // {
          //   values: funct5, //values - represents the array of {x,y} data points
          //   key: 'Vth = ' + valueOne + '%', //key  - the name of the series.
          //   color: '#ff1200'  //color - optional: choose your own line color.
          // }
        ];
      };

      this.graficalizer = graficalizer;
      this.changeRange = changeRange;


    }


    ngOnInit() {
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
            stateChange: function (e) { console.log("stateChange"); },
            changeState: function (e) { console.log("changeState"); },
            tooltipShow: function (e) { console.log("tooltipShow"); },
            tooltipHide: function (e) { console.log("tooltipHide"); }
          },
          xAxis: {
            axisLabel: 'T [Nm]'
          },
          yAxis: {
            axisLabel: 'n [rpm]',
            tickFormat: function (d) {
              return d3.format('.02f')(d);
            },
            axisLabelDistance: -10
          },
          callback: function (chart) {
            console.log("!!! lineChart callback !!!");
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

    this.data = this.graficalizer(this.percentageVoltage, this.percentageRtwo);

  }
}
