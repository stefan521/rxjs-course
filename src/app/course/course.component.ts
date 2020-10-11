import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay, share
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from 'app/common/util';
import {debug, RxJsLogginglevel} from '../common/debug'


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
            .pipe(
                debug(RxJsLogginglevel.INFO, "course value ")
            );
    }

    ngAfterViewInit() {
        this.lessons$ =
            fromEvent<any>(this.input.nativeElement, 'keyup')
                .pipe(
                    map(event => event.target.value),
                    startWith(''),
                    debug(RxJsLogginglevel.TRACE, "search "),
                    debounceTime(400), // wait 400ms for the typing to stabilize before firing a search request
                    distinctUntilChanged(), // ignore if value is the search same as the old one
                    switchMap(search => this.loadLessons(search)), // unsubscribes - cancels the old search requests and searches again
                    debug(RxJsLogginglevel.DEBUG, "lessons value "),
                );
    }

    loadLessons(search: string = ''): Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(res => res["payload"])
            );
    }

}
