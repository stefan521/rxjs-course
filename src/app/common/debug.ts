import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export enum RxJsLogginglevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    ERROR = 3
}

// not exporting = variable private to this file
let rxjsLoggingLevel = RxJsLogginglevel.INFO;

export function setRxJsLoggingLevel(level :RxJsLogginglevel) {
    rxjsLoggingLevel = level;
}

export const debug = (level: number, message: string) => {
    return (source: Observable<any>) => source
        .pipe(
            tap(val => {
                if (level >= rxjsLoggingLevel) {
                    console.log(message + ': ', val);
                }
            })
        );
};
