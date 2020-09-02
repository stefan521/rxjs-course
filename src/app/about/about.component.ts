import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, timer, fromEvent, Observable, noop } from 'rxjs';
@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
    // RxJs = Reactive Extensions for JavaScript

    /* Stream Lesson

    // stream of values that are being emitted over time
    document.addEventListener('click', evt => {
      console.log(evt);
    }); // multivalue stream that never completes

    let counter = 0;

    // a second stream of values
    setInterval(() => {

      console.log(counter);
      counter++;
    
    }, 1000); // multivalue stream that never completes


    // a special type of stream that only emits one value and then completes
    setTimeout(() => {
      console.log("finished....");
    }, 3000);

    */


    /* Observable lesson

    const interval$ = timer(3000, 1000); // Observable emitting numbers a definition for a stream of values

    // an Observable will only become a stream if we subscribe to it
    const sub = interval$.subscribe(val => console.log('stream 1 ' + val));
    // interval$.subscribe(val => console.log('stream 2 ' + val));

    const click$ = fromEvent(document, 'click');

    // the observable emits its values and either errors out or completes. if it errors it means it won't ever complete. values can't be emitted after errors or completion
    click$.subscribe(
      evt => console.log(evt), // value callback for the stream values
      err => console.log(err), // error handler
      () => console.log("stream completed") // callback for completed stream
    );

    setTimeout(() => sub.unsubscribe(), 5000);

    */

    const http$: Observable<any> = Observable.create(observer => {
      // we use the observable internally to implement the observable
      // observer.next()
      // observer.error()
      // observer.complete()

      fetch('/api/courses')
        .then(response => {
          return response.json();
        })
        .then(body => {
          observer.next(body);

          observer.complete(); // can't call next anymore and can't error
        })
        .catch(err => {
          observer.error(err); // can't complete and can't emit new values anymore
        });
    });

    http$.subscribe(
      courses => console.log(courses),
      noop,
      () => console.log('completed')
    );
  }

}
