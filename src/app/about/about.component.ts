import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { createHttpObservable } from 'app/common/util';
import { interval, timer, fromEvent, Observable, noop, of, concat, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {

    const http$ = createHttpObservable('/api/courses');

    const sub = http$.subscribe(console.log);

    setTimeout(() => sub.unsubscribe());
  }

}
