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
    public fatPot: boolean = true;
    public fatPotString: string = 'ind';
    public isMotor: boolean = false;
    public isMotorString: string = 'mot';
    public subexcitado: boolean = false;
    public ra: Number = 0.05;
    public xs: Number = 1.2;
    public xd: Number = 1;
    public xq: Number = 1;

    constructor() {
        function changeFp($event){
          let value = $event.value;
          let format = (e) => math.format(e, {notation: 'fixed', precision: 2});
          console.log('Changing fp to ' + value);

          this.fp0 = format(value);
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs, this.xd, this.xq);
        }

        function changeIa($event){
          let value = $event.value;
          let format = (e) => math.format(e, {notation: 'fixed', precision: 1});
          console.log('Changing Ia Percent to ' + value);

          this.iaPu = format(value);
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs, this.xd, this.xq);
        }

        function changeFatPot(){
          console.log('Changing FatPot to ' + this.fatPotString);
          if (this.fatPotString === 'ind') this.fatPot = true;
          else this.fatPot = false;
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs, this.xd, this.xq);
        }
        function changeType(){
          console.log('Changing Type to ' + this.isMotorString);
          if (this.isMotorString === 'mot') this.isMotor = true;
          else this.isMotor = false;
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs, this.xd, this.xq);
        }
        function updatePu(){
          console.log('update Pu values');
          this.updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs, this.xd, this.xq);
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

        function calcIjX(x, i){
          return math.multiply(math.complex( 0 , x), i);
        }


        console.log('Creating SVG');
        let w = 400;
        let h = 400;

        let offsetX = 200;
        let biasX = 0;
        let offsetY = 200;
        let biasY = 0;

        let svg = d3.select('#pl-diagram')
          .attr('width', w)
          .attr('height', h);

        let svg2 = d3.select('#ps-diagram')
          .attr('width', w)
          .attr('height', h);

        let createLine = (e, classe, id) => {
          e.append('line')
            .classed('vector', true)
            .classed(classe, true)
            .attr('id', id);
        }

        // Vt
        createLine(svg,'vectorVt', 'vt');
        // Ia*Ra
        createLine(svg,'vectorIaRa', 'iara');
        // Ia*j*Xs
        createLine(svg,'vectorIajXs', 'iajxs');
        // Ef
        createLine(svg,'vectorEf', 'ef');
        // ia
        createLine(svg,'vectorIa', 'ia');

        // Vt
        createLine(svg2,'vectorVt', 'vt2');
        // Ia*Ra
        createLine(svg2,'vectorIaRa', 'iara2');
        // Ef
        createLine(svg2,'vectorEf', 'ef2');
        // ia
        createLine(svg2,'vectorIa', 'ia2');
        // id
        createLine(svg2,'vectorEf', 'id2');
        // iq
        createLine(svg2,'vectorIa', 'iq2');
        // idjxd
        createLine(svg2,'vectorIa', 'iajxd2');
        // iqjxq
        createLine(svg2,'vectorIa', 'iajxq2');

        function updateDiagram(iaPu, fatPot, fp0, isMotor, rapu, xspu, xdpu, xqpu){
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
          if (fatPot) phi = -phi;
          if (isMotor) ia0 = -ia0;
          iax = ia0 * iaPu * Math.cos(phi);
          iay = ia0 * iaPu * Math.sin(phi); //@TODO check validation FP negative or positive
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

          // SVG2
          vt0 = 208;
          kva = 5000;
          ia0 = 5000 / ( Math.sqrt(3) * vt0);

          vb = 208;
          sb = kva;
          zb = vb*vb/sb;
          ib = sb / (vb * Math.sqrt(3));

          console.log(zb, '\n\n')
          let xd, xq;
          ra = rapu * zb;
          xq = xqpu * zb;
          xd = xdpu * zb;
          phi = Math.acos(fp0);
          if (fatPot) phi = -phi;
          if (isMotor) ia0 = -ia0;
          iax = ia0 * iaPu * Math.cos(phi);
          iay = ia0 * iaPu * Math.sin(phi); //@TODO check validation FP negative or positive
          ia = math.complex(iax, iay);
          console.log('ia', ia)
          vt = 120; // vt/Math.sqrt(3)
          // ***************************************************
          raia = calcRaIa(vt, xs, ia, ra);
          let iajxq = calcIjX(xq, ia);
          let Vtfasor = math.complex(vt, 0);
          let delta = (math.add(math.add(Vtfasor,raia),iajxq)).arg();
          console.log('delta: ' + delta);
          let psi = delta + phi;
          console.log('ps: ' + psi);
          console.log(math.exp(math.complex(0,delta)));
          let iq = math.multiply(math.multiply(ia, math.cos(psi)), math.exp(math.complex(0,delta)));
          let id = math.multiply(math.multiply(ia, math.sin(psi)), math.exp(math.complex(0,delta - Math.PI * 0.5)));

          //Id_fasor=Ia_L_f(i)*sin(psi)*exp(j*(delta-pi/2));

          console.log('\n---------', calcIjX(xd, iq), xq, iq)
          let iajxdx = calcIjX(xd, id).re;
          let iajxdy = calcIjX(xd, id).im;
          let iajxqx = calcIjX(xq, iq).re;
          let iajxqy = calcIjX(xq, iq).im;
          //jXdIa_x=[RaIa_x(2) RaIa_x(2)+real(j*Xd_sat*Ia_fasor)];
          //jXdIa_y=[RaIa_y(2) RaIa_y(2)+imag(j*Xd_sat*Ia_fasor)];
          efx = calcEf(vt, xs, ia, ra).re;
          efy = calcEf(vt, xs, ia, ra).im;
          raiax = calcRaIa(vt, xs, ia, ra).re;
          raiay = calcRaIa(vt, xs, ia, ra).im;

          iajxs = calcIaJXs(vt, xs, ia, ra);


          console.log(iajxsx, raiax)
          // Dados Vt, Ia, If => descobrir Ef, If


          updateSVG2(offsetIa, iax, iay, vt, raiax, raiay, iajxdx, iajxdy, iajxqx, iajxqy, efx, efy );
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

        let updateSVG2 = (offsetIa, iax, iay, vt, raiax, raiay, iajxdx, iajxdy, iajxqx, iajxqy, efx, efy ) => {
          let xmin, xmax, ymin, ymax;
          // xmin = Math.min( 0, offsetIa * iax, raiax + vt, raiax + vt + iajxdx, efx);
          // xmax = Math.max( 0, offsetIa * iax, raiax + vt, raiax + vt + iajxdx, efx);
          // ymin = Math.min( 0, offsetIa * iay, raiay, raiay +  iajxdy, efy);
          // ymax = Math.max( 0, offsetIa * iay, raiay, raiay +  iajxdy, efy);
          // biasX = 0-(xmin + xmax)/4;
          // biasY = 0-(ymin + ymax)/4;
          // console.log('changing offset2', biasX, biasY);
          biasX = 0;
          biasY = 0;
          updateVector('vt2', [0, 0, vt, 0]);
          updateVector('iara2', [vt, 0, raiax, raiay]);
          updateVector('iajxd2', [raiax + vt, raiay, iajxdx, iajxdy]);
          updateVector('iajxq2', [raiax + vt + iajxdx, raiay + iajxdy, iajxqx, iajxqy]);
          updateVector('iajxq2', [raiax + vt + iajxdx, raiay + iajxdy, iajxqx, iajxqy]);

          updateVector('ia2', [0, 0, offsetIa * iax, offsetIa * iay]);
          // updateVector('iq2', [0, 0, offsetIa * iax, 0]);
          // updateVector('id2', [0, 0, 0, offsetIa * iay]);
          // updateVector('ef2', [0, 0, efx, efy]);
        }

        function updateVector(id, vector){
          let scale = 0.5;
          console.log('updating ' + id + ' with ' + vector + '\n');
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

        updateDiagram(this.iaPu, this.fatPot, this.fp0, this.isMotor, this.ra, this.xs, this.xd, this.xq);
        this.updateDiagram = updateDiagram;
    }

  }
