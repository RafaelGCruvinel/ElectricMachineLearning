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

      constructor() {
      }

      ngOnInit() {

          console.log('here');
          var w = "450px";
          var h = "300px";
          var svg = d3.select("svg")
            .attr("width", w)
            .attr("height", h);

          // Vt
          svg.append("line")
            .attr("class", "vector")
            .attr("x1", 57)
            .attr("y1", 122)
            .attr("x2", 205)
            .attr("y2", 121);

          // Ia*Ra
          svg.append("line")
            .attr("class", "vector")
            .attr("x1", 205)
            .attr("y1", 121)
            .attr("x2", 247)
            .attr("y2", 170);

          // Ia*j*Xs
          svg.append("line")
            .attr("class", "vector")
            .attr("x1", 247)
            .attr("y1", 170)
            .attr("x2", 350)
            .attr("y2", 62);

          // Ef
          svg.append("line")
            .attr("class", "vector")
            .attr("x1", 57)
            .attr("y1", 122)
            .attr("x2", 350)
            .attr("y2", 62);

            // Ef
            svg.append("line")
              .attr("class", "vector")
              .attr("x1", 57)
              .attr("y1", 122)
              .attr("x2", 122)
              .attr("y2", 211);


      }

  }
