import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';

const API_URL_RICHIESTE = environment.apiUrl.maps.markers.richieste;

@Injectable()
export class RichiesteMarkerService {


    constructor(private http: HttpClient) {
    }

    public getRichiesteMarkers(): Observable<any> {
        return this.http.get(API_URL_RICHIESTE).pipe(
            retry(3),
            catchError(handleError));
    }

}
