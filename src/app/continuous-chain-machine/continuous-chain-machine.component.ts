import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import 'nvd3';
declare let d3: any;

@Component({
    selector: 'app-continuous-machine',
    templateUrl: 'continuous-chain-machine.component.html',
    styleUrls: ['continuous-chain-machine.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContinuousChainMachineComponent implements OnInit {

    constructor() { }

    ngOnInit() {

      // create a SVG area to draw on
      var svg = d3.select("#graph01")
        .append("svg")
        .attr("width",580)
        .attr("height",370)
        .style("border", "solid 1px lightgrey")
        .style("padding", "10px");

      // var rect = svg.append("rect")
      //   .attr("width", 100)
      //   .attr("height", 100)
      //   .style("fill","#66aaff")
      //   .style("stroke", "0033ff")
      //   .style("stroke-width",3);

      // var rect = svg.append("rect")
      //   .attr("x", 120) // move this box 120px to the right
      //   .attr("width", 100)
      //   .attr("height", 100)
      //   .attr("rx", 20) // corner radius
      //   .attr("ry", 20) // corner radius
      //   .style("fill","yellow")
      //   .style("stroke", "#666666") // border color
      //   .style("stroke-width",3) // border width

      // var circle = svg.append("circle")
      //   .attr("cx", 240)
      //   .attr("cy", 50)
      //   .attr("r", 40)
      //   .style("fill","blue")
      //   .style("stroke", "red")
      //   .style("stroke-width",3)
      //   .style("opacity", 0.75);

      // var line = svg.append("line")
      //   .attr("x1",0)
      //   .attr("y1",120)
      //   .attr("x2",220)
      //   .attr("y2",120)
      //   .style("stroke", "pink")
      //   .style("stroke-width",10)
      //   .style("stroke-linecap", "round")

      // var line = svg.append("line")
      //   .attr("x1",0)
      //   .attr("y1",150)
      //   .attr("x2",220)
      //   .attr("y2",300)
      //   .style("stroke", "lightgreen")
      //   .style("stroke-width",5)
      //   .style("stroke-linecap", "round")
      //   .style("stroke-dasharray", 20);

      //a
      createEspira(0, "a", "a");
      createEspira(0, "b", "a");
      createEspira(0, "c", "a");
      createEspira(0, "d", "a");
      createEspira(0, "e", "a");
      createEspira(0, "f", "a");

      //21.6 entre paralelos

      var rect = svg.append("rect")
        .attr("x", 56)
        .attr("y", 248)
        .attr("width", 23)
        .attr("height", 23)
        .style("fill","#66aaff")
        .style("stroke", "0033ff")
        .style("stroke-width",3);

      var rect = svg.append("rect")
        .attr("x", 86)
        .attr("y", 107)
        .attr("width", 86)
        .attr("height", 63)
        .attr("class", "nucleo");

      var rect = svg.append("rect")
        .attr("x", 194)
        .attr("y", 107)
        .attr("width", 86)
        .attr("height", 63)
        .attr("class", "nucleo");

      var rect = svg.append("rect")
        .attr("x", 301)
        .attr("y", 107)
        .attr("width", 86)
        .attr("height", 63)
        .attr("class", "nucleo");

      var rect = svg.append("rect")
        .attr("x", 408)
        .attr("y", 107)
        .attr("width", 86)
        .attr("height", 63)
        .attr("class", "nucleo");

      //escovas
      var rect = svg.append("rect")
        .attr("x", 123)
        .attr("y", 270)
        .attr("width", 34)
        .attr("height", 23)
        .attr("class", "escova");
      var rect = svg.append("rect")
        .attr("x", 234)
        .attr("y", 270)
        .attr("width", 34)
        .attr("height", 23)
        .attr("class", "escova");
      var rect = svg.append("rect")
        .attr("x", 344)
        .attr("y", 270)
        .attr("width", 34)
        .attr("height", 23)
        .attr("class", "escova");
      var rect = svg.append("rect")
        .attr("x", 456)
        .attr("y", 270)
        .attr("width", 34)
        .attr("height", 23)
        .attr("class", "escova");

      var line = svg.append("line")
        .attr("x1",138)
        .attr("y1",293)
        .attr("x2",138)
        .attr("y2",329)
        .attr("class", "p")
      var line = svg.append("line")
        .attr("x1",138)
        .attr("y1",329)
        .attr("x2",360)
        .attr("y2",329)
        .attr("class", "p")
      var line = svg.append("line")
        .attr("x1",360)
        .attr("y1",293)
        .attr("x2",360)
        .attr("y2",329)
        .attr("class", "p")
      var line = svg.append("line")
        .attr("x1",250)
        .attr("y1",329)
        .attr("x2",250)
        .attr("y2",350)
        .attr("class", "p")

      var line = svg.append("line")
        .attr("x1",250)
        .attr("y1",293)
        .attr("x2",250)
        .attr("y2",311)
        .attr("class", "n");
      var line = svg.append("line")
        .attr("x1",250)
        .attr("y1",311)
        .attr("x2",476)
        .attr("y2",311)
        .attr("class", "n");
      var line = svg.append("line")
        .attr("x1",250)
        .attr("y1",293)
        .attr("x2",252)
        .attr("y2",311)
        .attr("class", "n");
      var line = svg.append("line")
        .attr("x1",472)
        .attr("y1",293)
        .attr("x2",474)
        .attr("y2",352)
        .attr("class", "n");

        function createEspira(place, type, classe){
          let offset = [0, 0, 0, 0], objeto;
          let offsetDic = {
            a: [127, 30, 80, 86],
            b: [80, 86, 80, 195],
            c: [80,195,133,248],
            d: [133,248,155,196],
            e: [155,196,155,86],
            f: [155,86,106,30],
          }
          let StyleDic = {
            a: "enr1",
            b: "enr1",
            c: "enr1",
            d: "enr2",
            e: "enr2",
            f: "enr2",
          }
          if(offsetDic[type]){
            offset = offsetDic[type]
          }

          place = Math.round(place * 21.6);

          objeto =  svg.append("line")
            .classed(classe, true)
            .attr("x1", place + offset[0])
            .attr("y1", offset[1])
            .attr("x2", place + offset[2])
            .attr("y2", offset[3]);

            if(StyleDic[type]){
              objeto.classed(StyleDic[type], true);
            }

          return objeto;
        }

    }

}
