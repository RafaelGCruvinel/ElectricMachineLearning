import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import 'nvd3';
declare let d3: any;

import * as math from 'mathjs';
declare let math: any;

@Component({
    selector: 'app-synchronous-machine',
    templateUrl: 'synchronous-machine.component.html',
    styleUrls: [
      '../../../node_modules/nvd3/build/nv.d3.css',
      'synchronous-machine.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})

export class SynchronousMachineComponent implements OnInit {
    updateDiagram;
    changeFp;
    changeIa;
    changeFatPot;
    changeType;
    // ef;
    // xs;
    // ia;
    // ra;
    // calcEf;
    // var to print
    vt = 120;
    iara;
    iajxs;
    ef;
    ia = 0;
    iaPercent = 100;
    fp;
    cap;
    fp0 = 0.8;
    private fatPot: boolean = false;
    private isGerador: boolean = false;

    constructor() {
        function changeFp($event){
          let value = $event.value;
          let format = (e) => math.format(e, {notation: 'fixed', precision: 2});
          console.log('Changing fp to ' + value);

          this.fp0 = format(value);
          this.updateDiagram(this.iaPercent, this.fatPot, this.fp0, this.isGerador);
        }

        function changeIa($event){
          let value = $event.value;
          let format = (e) => math.format(e, {notation: 'fixed', precision: 1});
          console.log('Changing Ia Percent to ' + value);

          this.iaPercent = format(value);
          this.updateDiagram(this.iaPercent, this.fatPot, this.fp0, this.isGerador);
        }

        function changeFatPot(){
          console.log('Changing FatPot to ' + this.fatPot);
          this.updateDiagram(this.iaPercent, this.fatPot, this.fp0, this.isGerador);
        }
        function changeType(){
          console.log('Changing Type to ' + this.fatPot);
          this.updateDiagram(this.iaPercent, this.fatPot, this.fp0, this.isGerador);
        }
        this.changeFp = changeFp;
        this.changeIa = changeIa;
        this.changeFatPot = changeFatPot;
        this.changeType = changeType;
      }

      ngOnInit() {
        // Dados Vt, Ia, If => descobrir Ef, If

        function calcEf(vt, xs, ia, ra){
          let raia, iajxs, ret1;

          iajxs = calcIaJXs(vt, xs, ia, ra);
          raia = calcRaIa(vt, xs, ia, ra);
          ret1 = math.add(vt, raia);
          return math.add(ret1, iajxs);
          // Ef = Vt + j * Xs * Ia + Ra * Ia
        }

        function calcRaIa(vt, xs, ia, ra){
          return math.multiply(math.complex( ra , 0), ia);
        }

        function calcIaJXs(vt, xs, ia, ra){
          return math.multiply(math.complex( 0 , xs), ia);
        }

          console.log(calcEf(10, 2, 3, 7));

          console.log('Creating SVG');
          let w = 450;
          let h = 300;

          let offsetX = 57;
          let offsetY = 122;

          let svg = d3.select('#pl-diagram')
            .attr('width', w)
            .attr('height', h);

          // Vt
          svg.append('line')
            .classed('vector', true)
            .classed('vectorVt', true)
            .attr('id', 'vt');

          // Ia*Ra
          svg.append('line')
            .classed('vector', true)
            .classed('vectorIaRa', true)
            .attr('id', 'iara');

          // Ia*j*Xs
          svg.append('line')
            .classed('vector', true)
            .classed('vectorIajXs', true)
            .attr('id', 'iajxs');

          // Ef
          svg.append('line')
            .classed('vector', true)
            .classed('vectorEf', true)
            .attr('id', 'ef');

          // ia
          svg.append('line')
            .classed('vector', true)
            .classed('vectorIa', true)
            .attr('id', 'ia');

          function updateDiagram(iaPercent, fatPot, fp0, isGerador){

            // example 6.3 page 307

            let vt, iax, iay, xs, ra;
            let efx, efy, ia, kva, ia0, vt0;
            let fp, phi, raia, raiax, raiay;
            let iajxs, iajxsx, iajxsy;

            vt0 = 208;
            kva = 5000;
            ia0 = 5000 / ( Math.sqrt(3) * vt0);

            phi = Math.acos(fp0);
            if (isGerador) ia0 = -ia0;
            iax = ia0 * iaPercent * Math.cos(phi) / 100;
            iay = ia0 * iaPercent * Math.sin(phi) / 100; //@TODO check validation FP negative or positive
            if (fatPot === true) {
              iay = ia0 * -1 * iaPercent * Math.sin(phi) / 100;
            }
            ia = math.complex(iax, iay);
            console.log('ia', ia)
            vt = 120; // vt/Math.sqrt(3)
            xs = 8;
            ra = 0;
            console.log('aki');
            let d;
            d = calcEf(vt, xs, ia, ra);
            console.log('\nef',d.abs(), d.arg());

            efx = calcEf(vt, xs, ia, ra).re;
            efy = calcEf(vt, xs, ia, ra).im;
            raia = calcRaIa(vt, xs, ia, ra);
            raiax = calcRaIa(vt, xs, ia, ra).re;
            raiay = calcRaIa(vt, xs, ia, ra).im;

            iajxs = calcIaJXs(vt, xs, ia, ra);
            iajxsx = calcIaJXs(vt, xs, ia, ra).re;
            iajxsy = calcIaJXs(vt, xs, ia, ra).im;

            console.log(iajxsx, raiax)
            // Dados Vt, Ia, If => descobrir Ef, If

            updateVector('ia', [0, 0, iax, iay]);
            updateVector('vt', [0, 0, vt, 0]);
            updateVector('iara', [vt, 0, raiax, raiay]);
            updateVector('iajxs', [raiax + vt, raiay, iajxsx, iajxsy]);
            updateVector('ef', [0, 0, efx, efy]);
            console.log(vt, '\nvt');
            updateStatus(
              math.complex(vt, 0),
              math.complex(raiax, raiay),
              math.complex(iajxsx, iajxsy),
              math.complex(efx, efy),
              ia,
              fp0);
          }

          function updateVector(id, vector){
            d3.select('#' + id)
              .attr('x1', offsetX + vector[0])
              .attr('y1', h - (offsetY + vector[1]))
              .attr('x2', offsetX + vector[2] + vector[0])
              .attr('y2', h - (offsetY + vector[3] + vector[1]));
          }

          let updateStatus = (vt, iara, iajxs, ef, ia, fp) => {
            let format = (e) => math.format(e, {notation: 'fixed', precision: 2});
            this.vt = format(vt);
            this.iara =  format(iara);
            this.iajxs = format(iajxs);
            this.ef =  format(ef);
            this.ia =  format(ia);
            this.fp =  format(fp);
          };

          updateDiagram(this.iaPercent, this.fatPot, this.fp0, this.isGerador);
          this.updateDiagram = updateDiagram;
      }


  }
