import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  selector   : 'flow-boxes',
  templateUrl: './flow.component.html',
  styleUrls  : ['./flow.component.scss'],
})
export class FlowComponent implements OnInit, AfterViewInit {
  @Input('blocks') blocks;
  @Input('box-types') boxTypes;
  @ViewChildren('blocksIterator') blocksIterator: QueryList<any>;
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  blocksCount = 0;
  defaultBlockType = {
    connector      : 'StateMachine',
    paintStyle     : {stroke: 'red', strokeWidth: 4},
    hoverPaintStyle: {stroke: 'blue'},
    overlays       : [
      'Arrow'
    ]
  };
  defaultEndpoints = [['RightMiddle'], ['LeftMiddle']];
  blocksBasicType;
  jsPlumbInstance;

  connectorPaintStyle = {
    strokeWidth  : 2,
    stroke       : '#6faa93',
    joinstyle    : 'round',
    outlineStroke: 'white',
    outlineWidth : 2
  };
  connectorHoverStyle = {
    strokeWidth  : 3,
    stroke       : '#216477',
    outlineWidth : 5,
    outlineStroke: 'white'
  };
  endpointHoverStyle = {
    fill  : '#216477',
    stroke: '#216477'
  };
  // the definition of source endpoints (the small blue ones)
  sourceEndpoint = {
    endpoint           : 'Dot',
    paintStyle         : {
      stroke     : '#7AB02C',
      fill       : '#7AB02C',
      radius     : 5,
      strokeWidth: 1
    },
    isSource           : true,
    connector          : ['Flowchart', {stub: [20, 30], gap: 5, cornerRadius: 10, alwaysRespectStubs: true}],
    connectorStyle     : this.connectorPaintStyle,
    hoverPaintStyle    : this.endpointHoverStyle,
    connectorHoverStyle: this.connectorHoverStyle,
    dragOptions        : {},
    overlays           : [
      ['Label', {
        location: [0.5, 1.5],
        label   : 'Drag',
        cssClass: 'endpointSourceLabel',
        visible : false
      }]
    ]
  };
  // the definition of target endpoints (will appear when the user drags a connection)
  targetEndpoint = {
    endpoint       : 'Dot',
    paintStyle     : {fill: '#d93e4a', radius: 5},
    hoverPaintStyle: this.endpointHoverStyle,
    maxConnections : -1,
    dropOptions    : {hoverClass: 'hover', activeClass: 'active'},
    isTarget       : true,
    overlays       : [
      ['Label', {location: [0.5, -0.5], label: 'Drop', cssClass: 'endpointTargetLabel', visible: false}]
    ]
  };

  constructor() {}

  ngOnInit() {
    this.blocksBasicType = (this.boxTypes) ? this.boxTypes : this.defaultBlockType;
  }

  ngAfterViewInit() {
    this.blocksCount = this.blocks.length;
    this.initJsPlumbInstance();
    this.blocksIterator.changes.subscribe((q) => {
      if (q.length !== this.blocksCount) {
        this.initEndpoints();
        this.blocksCount = this.blocks.length;
      }
    });
  }

  initJsPlumbInstance() {
    jsPlumb.ready(() => {
      // noinspection TypeScriptValidateJSTypes
      this.jsPlumbInstance = jsPlumb.getInstance({
        DragOptions       : {cursor: 'pointer', zIndex: 2000},
        ConnectionOverlays: [
          ['Arrow', {
            location: -15,
            visible : true,
            width   : 5,
            length  : 20,
            id      : 'ARROW',
            /*events  : {
              click: function () { alert("you clicked on the arrow overlay")}
            }*/
          }]
        ],
        Container         : 'canvas'
      });
      this.jsPlumbInstance.registerConnectionType('basic', this.blocksBasicType);
      this.initEndpoints();
    });
  }

  initEndpoints() {
    this.jsPlumbInstance.batch(() => {
      this.blocks.forEach((block) => {
        this.addEndpoints(`Window${block.id}`, ...this.defaultEndpoints);
      });
      this.jsPlumbInstance.draggable(jsPlumb.getSelector('.flowchart-board .window'), {grid: [20, 20]});
      this.initConnections();
      // noinspection TypeScriptValidateJSTypes
      this.jsPlumbInstance.bind('click', (conn, originalEvent) => {
        if (confirm('Delete connection?')) {
          this.jsPlumbInstance.deleteConnection(conn);
        }
        conn.toggleType('basic');
      });

      // jsPlumb.fire("jsPlumbDemoLoaded", this.jsPlumbInstance);

    });
  }

  initConnections() {
    this.blocks.forEach((block) => {
      if (block.connection.out && this.checkNodePresence(block.connection.out)) {
        this.jsPlumbInstance.connect({
          uuids   : [`Window${block.id}RightMiddle`, `Window${block.connection.out}LeftMiddle`],
          editable: true
        });
      }
    });
  }

  addEndpoints(toId, sourceAnchors?, targetAnchors?) {
    for (let i = 0; i < sourceAnchors.length; i++) {
      const sourceUUID = toId + sourceAnchors[i];
      // noinspection TypeScriptValidateJSTypes
      this.jsPlumbInstance.addEndpoint('flowchart' + toId, this.sourceEndpoint, {
        anchor: sourceAnchors[i], uuid: sourceUUID
      });
    }
    for (let j = 0; j < targetAnchors.length; j++) {
      const targetUUID = toId + targetAnchors[j];
      // noinspection TypeScriptValidateJSTypes
      this.jsPlumbInstance.addEndpoint('flowchart' + toId, this.targetEndpoint, {
        anchor: targetAnchors[j],
        uuid  : targetUUID
      });
    }
  }

  checkNodePresence(id) {
    return this.blocks.filter(obj => obj.id === id).length > 0;
  }

  switchView(ev) {
    if (ev.item.view === 'circle') {
      ev.item.position.top = ev.item.position.top + 1.9;
      ev.item.view = 'rectangle';
    } else {
      ev.item.position.top = ev.item.position.top - 1.9;
      ev.item.view = 'circle';
    }
  }

  removeBlock(item) {
    const el = `Window${item.id}`;
    this.jsPlumbInstance.remove(`flowchart${el}`);
    this.blocks = this.blocks.filter(obj => obj.id !== item.id);

  }
}
