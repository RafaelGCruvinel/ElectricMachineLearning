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

      for(let i = 0; i<20; i++){
        createEspira(i, "a", "");
        createEspira(i, "b", "");
        createEspira(i, "c", "");
        createEspira(i, "d", "");
        createEspira(i, "e", "");
        createEspira(i, "f", "");
      }
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
        .attr("class", "nucleo1");

      var rect = svg.append("rect")
        .attr("x", 194)
        .attr("y", 107)
        .attr("width", 86)
        .attr("height", 63)
        .attr("class", "nucleo2");

      var rect = svg.append("rect")
        .attr("x", 301)
        .attr("y", 107)
        .attr("width", 86)
        .attr("height", 63)
        .attr("class", "nucleo3");

      var rect = svg.append("rect")
        .attr("x", 408)
        .attr("y", 107)
        .attr("width", 86)
        .attr("height", 63)
        .attr("class", "nucleo4");

      //escovas
      createEscova([123, 234, 344, 456], "escova");
      function createEscova(place, classe){
        let offset = [0, 0, 0, 0], objeto;
        let offsetDic = {
          a1: [place[0],270,34,23],
          b1: [place[1],270,34,23],
          a2: [place[2],270,34,23],
          b2: [place[3],270,34,23],
          la1: [place[0]+17, 293, place[0]+17, 329],
          la2: [place[0]+17, 329, place[2]+17, 329],
          la3: [place[2]+17, 293, place[2]+17, 329],
          la4: [(place[0]+place[2])/2, 329, (place[0]+place[2])/2, 350],
          lb1: [place[1]+17, 293, place[1]+17, 311],
          lb2: [place[1]+17, 311, place[3]+17, 311],
          lb3: [place[1]+17, 293, place[1]+17, 311],
          lb4: [place[3]+17, 293, place[3]+17, 350],
        }
        let styleDic = {
          a1: "escova",
          a2: "escova",
          b1: "escova",
          b2: "escova",
          la1: "p",
          la2: "p",
          la3: "p",
          la4: "p",
          lb1: "n",
          lb2: "n",
          lb3: "n",
          lb4: "n",
        }

        // place = Math.round(place * 21.6);


        createContato("a1");
        createContato("a2");
        createContato("b1");
        createContato("b2");

        createLigacao("la1");
        createLigacao("la2");
        createLigacao("la3");
        createLigacao("la4");

        createLigacao("lb1");
        createLigacao("lb2");
        createLigacao("lb3");
        createLigacao("lb4");

        function createContato(type){
          let offset = offsetDic[type];
          let style = styleDic[type];
          var rect = svg.append("rect")
            .attr("x", offset[0])
            .attr("y", offset[1])
            .attr("width", offset[2])
            .attr("height", offset[3])
            .classed("escova", true);
        }

        function createLigacao(type){
          let offset = offsetDic[type];
          let style = styleDic[type];
          var rect = svg.append("line")
            .attr("x1", offset[0])
            .attr("y1", offset[1])
            .attr("x2", offset[2])
            .attr("y2", offset[3])
            .classed(style, true);
        }

        return objeto;
      }


      function createEspira(place, type, classe){
        let offset = [0, 0, 0, 0], objeto;
        let offsetDic = {
          a: [127, 30, 80, 86],
          b: [80, 86, 80, 195],
          c: [80, 195, 133, 248],
          d: [133, 248, 155, 196],
          e: [155, 196, 155, 86],
          f: [155, 86, 106, 30],
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
      }


  }

}
