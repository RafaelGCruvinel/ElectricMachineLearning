import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import 'nvd3';
declare let d3: any;

import * as math from 'mathjs';
declare let math: any;

@Component({
    selector: 'app-synchronous-machine',
    templateUrl: 'synchronous-machine.component.html',
    styleUrls: [
      '../../../node_modules/nvd3/build/nv.d3.css'
    ],
    encapsulation: ViewEncapsulation.None
})

export class SynchronousMachineComponent implements OnInit {
    ef;
    xs;
    ia;
    ra;
    calcEf;

      constructor() {

        //Dados Vt, Ia, If => descobrir Ef, If

        function calcEf(ef, xs, ia, ra){
          let i1, i2, i3;
          i1 = ef;
          i2 = math.multiply(math.complex( 0 , xs), ia);

          i3 = math.add(i1, i2)
          return math.add(i3, -ra)
          //Ef = Vt + j * Xs * Ia - Ra
        }
      this.calcEf = calcEf;

      }

      ngOnInit() {


          console.log(this.calcEf(10, 2, 3, 7));

          console.log('Creating SVG');
          var w = "450px";
          var h = "300px";
          var svg = d3.select("svg")
            .attr("width", w)
            .attr("height", h);

          // Vt
          svg.append("line")
            .attr("class", "vector")
            .attr("id", "vt");

          // Ia*Ra
          svg.append("line")
            .attr("class", "vector")
            .attr("id", "iara");

          // Ia*j*Xs
          svg.append("line")
            .attr("class", "vector")
            .attr("id", "iajxs");

          // Ef
          svg.append("line")
            .attr("class", "vector")
            .attr("id", "ef");

          // ia
          svg.append("line")
            .attr("class", "vector")
            .attr("id", "ia");

          function updateDiagram(){
            let offsetX = 57;
            let offsetY = 122;
            updateVector('ia', [offsetX,offsetY,122,211]);
            updateVector('vt', [offsetX,offsetY,205,121]);
            updateVector('iara', [205,121,247,170]);
            updateVector('iajxs', [247,170,350,62]);
            updateVector('ef', [offsetX,offsetY,350,62]);
          }

          function updateVector(id, vector){
            d3.select("#" + id)
              .attr("x1", vector[0])
              .attr("y1", vector[1])
              .attr("x2", vector[2])
              .attr("y2", vector[3]);
          }
          updateDiagram();

      }

  }
