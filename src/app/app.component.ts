import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit{
  blocks = [];
  blocksIndex = 0;

  constructor(private http: HttpClient) {
  }

  ngOnInit(){
     this.http.get('/assets/data.json').subscribe((data: any)=>{
       this.blocks = data;
    });
  }

  addNode() {
    const id = this.blocks.length + 1;
    this.blocks.push(
      {
        id         : id,
        rules      : 26,
        name       : `Block ${id}`,
        type       : 'marker',
        connection : {in: false, out: false},
        position   : {top: 1, left: 14 + this.blocksIndex * 7},
        view       : 'rectangle',
        borderColor: '#6faa93'
      }
    );
    this.blocksIndex++;
  }

}
