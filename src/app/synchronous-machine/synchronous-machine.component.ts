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

      constructor() { }

      ngOnInit() { }

  }
