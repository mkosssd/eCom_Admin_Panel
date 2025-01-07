import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GeneralService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    constructor() { }

    showLoader(flag: boolean) {
        this.loadingSubject.next(flag); // Start loading
    }
}
