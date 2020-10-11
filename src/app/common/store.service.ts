import { Injectable } from '@angular/core';
import { Course } from 'app/model/course';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable } from './util';

@Injectable({
    providedIn: 'root'
}) // providedIn root means theres only one service in our application
export class Store {

    private subject = new BehaviorSubject<Course[]>([]);
    
    courses$: Observable<Course[]> = this.subject.asObservable();

    init() {
        createHttpObservable('/api/courses')
            .pipe(
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"]))
            )
            .subscribe(
                courses => this.subject.next(courses)
            );
    }

    selectBeginnerCourses() {
        return this.filterByCategory('BEGINNER');
    }

    selectAdvancedCourses() {
        return this.filterByCategory('ADVANCED');
    }

    filterByCategory(category: string) {
        return this.courses$
            .pipe(
                map(courses =>
                        courses.filter(course => course.category === category)
                    )
            );
    }

    selectCourseById(courseId: number) {
        return this.courses$
            .pipe(
                map(courses =>
                        courses.find(course => course.id === courseId)
                    )
            );
    }

    saveCourse(courseId: number, changes: object):Observable<any> {
        // do not mutate data directly. we want to make a new value and emit it
        const courses = this.subject.getValue();

        const courseIndex = courses.findIndex(course => course.id === courseId);

        const newCourses = courses.slice(0);

        newCourses[courseIndex] = {
            ...courses[courseIndex],
            ...changes
        };

        this.subject.next(newCourses);

        return fromPromise(fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }
}