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
    updatePu;
    // var to print
    vt = 120;
    iara;
    iajxs;
    ef;
    ia;
    iaPu = 1;
    fp;
    cap;
    fp0 = 0.8;
    private fatPot: boolean = true;
    private fatPotString: string = 'ind';
    private isMotor: boolean = false;
    private isMotorString: string = 'mot';
    private subexcitado: boolean = false;
    public ra: Number = 0.05;
    public xs: Number = 1.2;

    constructor() {
        function changeFp($event){
          let value = $event.value;
          let format = (e) => math.format(e, {notation: 'fixed', precision: 2});
          console.log('Changing fp to ' + value);

          this.fp0 = format(value);
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs);
        }

        function changeIa($event){
          let value = $event.value;
          let format = (e) => math.format(e, {notation: 'fixed', precision: 1});
          console.log('Changing Ia Percent to ' + value);

          this.iaPu = format(value);
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs);
        }

        function changeFatPot(){
          console.log('Changing FatPot to ' + this.fatPotString);
          if (this.fatPotString === 'ind') this.fatPot = true;
          else this.fatPot = false;
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs);
        }
        function changeType(){
          console.log('Changing Type to ' + this.isMotorString);
          if (this.isMotorString === 'mot') this.isMotor = true;
          else this.isMotor = false;
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs);
        }
        function updatePu(){
          console.log('update Pu values');
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs);
        }
        this.changeFp = changeFp;
        this.changeIa = changeIa;
        this.changeFatPot = changeFatPot;
        this.changeType = changeType;
        this.updatePu = updatePu;
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
        let w = 500;
        let h = 500;

        let offsetX = 250;
        let biasX = 0;
        let offsetY = 250;
        let biasY = 0;

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

        function updateDiagram(iaPu, fatPot, fp0, isMotor, rapu, xspu){

          // example 6.3 page 307
          let vt, iax, iay, xs, ra;
          let efx, efy, ia, kva, ia0, vt0;
          let fp, phi, raia, raiax, raiay;
          let iajxs, iajxsx, iajxsy;
          let vb, sb, zb, ib, d;

          vt0 = 208;
          kva = 5000;
          ia0 = 5000 / ( Math.sqrt(3) * vt0);


          vb = 208;
          sb = kva;
          zb = vb*vb/sb;
          ib = sb / (vb * Math.sqrt(3));

          console.log(zb, '\n\n')

          ra = rapu * zb;
          xs = xspu * zb;
          phi = Math.acos(fp0);
          if (isMotor) ia0 = -ia0;
          iax = ia0 * iaPu * Math.cos(phi);
          iay = ia0 * iaPu * Math.sin(phi); //@TODO check validation FP negative or positive
          if (fatPot) {
            iay = ia0 * -1 * iaPu * Math.sin(phi);
          }
          ia = math.complex(iax, iay);
          console.log('ia', ia)
          vt = 120; // vt/Math.sqrt(3)

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

          // offset IA
          let offsetIa = 8.35;


          updateSVG1(offsetIa, iax, iay, vt, raiax, raiay, iajxsx, iajxsy, efx, efy );
          // updateVector('ia', [0, 0, offsetIa * iax, offsetIa * iay]);
          // updateVector('vt', [0, 0, vt, 0]);
          // updateVector('iara', [vt, 0, raiax, raiay]);
          // updateVector('iajxs', [raiax + vt, raiay, iajxsx, iajxsy]);
          // updateVector('ef', [0, 0, efx, efy]);

          updateStatus(
            math.complex(vt/(zb*ib), 0),
            math.complex(raiax/(zb*ib), raiay/(zb*ib)),
            math.complex(iajxsx/(zb*ib), iajxsy/(zb*ib)),
            math.complex(efx/(zb*ib), efy/(zb*ib)),
            math.complex(iax/ib, iay/ib),
            fp0);
          // updateStatus(
          //   math.complex(vt, 0),
          //   math.complex(raiax, raiay),
          //   math.complex(iajxsx, iajxsy),
          //   math.complex(efx, efy),
          //   math.complex(iax, iay),
          //   fp0);
        }

        let updateSVG1 = (offsetIa, iax, iay, vt, raiax, raiay, iajxsx, iajxsy, efx, efy ) => {
          let xmin, xmax, ymin, ymax;
          xmin = Math.min( 0, offsetIa * iax, raiax + vt, raiax + vt + iajxsx, efx);
          xmax = Math.max( 0, offsetIa * iax, raiax + vt, raiax + vt + iajxsx, efx);
          ymin = Math.min( 0, offsetIa * iay, raiay, raiay +  iajxsy, efy);
          ymax = Math.max( 0, offsetIa * iay, raiay, raiay +  iajxsy, efy);
          biasX = 0-(xmin + xmax)/4;
          biasY = 0-(ymin + ymax)/4;
          console.log('changing offset', biasX, biasY);
          updateVector('ia', [0, 0, offsetIa * iax, offsetIa * iay]);
          updateVector('vt', [0, 0, vt, 0]);
          updateVector('iara', [vt, 0, raiax, raiay]);
          updateVector('iajxs', [raiax + vt, raiay, iajxsx, iajxsy]);
          updateVector('ef', [0, 0, efx, efy]);
        }

        function updateVector(id, vector){
          let scale = 0.5;
          console.log('aki');
          d3.select('#' + id)
            .attr('x1', offsetX + biasX + vector[0] * scale)
            .attr('y1', h - (offsetY + biasY + vector[1] * scale))
            .attr('x2', offsetX + biasX  + vector[2] * scale + vector[0] * scale)
            .attr('y2', h - (offsetY + biasY  + vector[3] * scale + vector[1] * scale));
        }

        let updateStatus = (vt, iara, iajxs, ef, ia, fp) => {
          let format = (e) => math.format(e, {notation: 'fixed', precision: 2});
          let polar = (e) => format(math.abs(e)) + ' ∟ ' +format(math.arg(e) / 2 / Math.PI * 360) + '°';

          this.vt = format(vt);
          this.iara =  polar(iara);
          this.iajxs = polar(iajxs);
          this.ef =  polar(ef);
          this.ia =  polar(ia);
          this.fp =  polar(fp);
          this.subexcitado = vt.toPolar().r > ef.toPolar().r;
        };

        updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs);
        this.updateDiagram = updateDiagram;
    }

  }
