import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {concat, fromEvent, interval, noop, observable, Observable, of, timer, merge, Subject, BehaviorSubject} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {

        // Subject = no memory, BehaviourSubject = default value
        // AsyncSubjet only emits the last value in the stream only after it completes. Ideal for long-running calulations where we really only care about the last value :P
        // ReplaySubject = emits all values in the stream even for late subs

        // mean to be private to the part of the application that is emmiting some data
        const subject = new BehaviorSubject(0); // do not share the subject itself with other parts of the application
        // subject = easy way to avoid huge custom observable creation logic. it can't return a method for unsubscription unlike new observable.

        const series1$ = subject.asObservable(); // this is ok to share

        // try to avoid subjects and use rxjs utility methods instead
        // from(browserEvent), fromPromise(promise), of(values)

        series1$.subscribe(val => console.log("early sub:", val));

        subject.next(1);
        subject.next(2);
        subject.next(3);

        // subject.complete();
        
        setTimeout(() => {
            series1$.subscribe(val => console.log("late sub: " + val));
        }, 3000);
    }


}
