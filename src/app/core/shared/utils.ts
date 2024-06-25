
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class CommonUtils {
    static isNullOrEmpty(t: any) {
        return t == undefined || t.toString() == '';
    }
}