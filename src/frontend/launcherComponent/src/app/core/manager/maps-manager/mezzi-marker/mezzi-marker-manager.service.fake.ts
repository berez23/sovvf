import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DispatcherMezziMarkerService } from '../../../dispatcher/dispatcher-maps/mezzi-marker/dispatcher-mezzi-marker.service';
import { MezzoMarker } from '../../../../maps/maps-model/mezzo-marker.model';


@Injectable({
    providedIn: 'root'
})
export class MezziMarkerManagerServiceFake {

    mezziMarker: MezzoMarker[];

    constructor(private dispatcher: DispatcherMezziMarkerService) {

        /**
         * dispatcher mezzi
         */
        this.dispatcher.onNewMezziMarkersList().subscribe(mezzi => {
            this.mezziMarker = mezzi;
        });

        this.dispatcher.onNewMezzoMarker().subscribe(mezzi => {
            this.mezziMarker.push(mezzi);
        });

        this.dispatcher.onUpdateMezzoMarker().subscribe(mezzi => {
            this.mezziMarker = this.mezziMarker.map(r => r.id_richiesta === mezzi.id_richiesta ? mezzi : r);
        });

        this.dispatcher.onDeleteMezzoMarker().subscribe(mezzi => {
            this.mezziMarker.splice(this.mezziMarker.indexOf(mezzi), 1);
        });

    }

    getMezziMarker(): Observable<MezzoMarker[]> {
        return of(this.mezziMarker);
    }

    /**
     * metodo che opacizza i marker
     * @param action
     * @param filterState
     * @param stringSearch
     */
    cambiaOpacitaMarker(action: boolean, filterState?: string[], stringSearch?: string[]) {
        if (action) {
            /**
             * annullo la precedente ricerca e ritorno null tutte le opacità
             */
            this.mezziMarker.forEach(r => {
                r.opacita = null;
            });
            if (!filterState) {
                /**
                 * opacizzo i marker con id diverso a quelli della ricerca
                 */
                this.mezziMarker.forEach(r => {
                    stringSearch.forEach(c => {
                        if (r.mezzo.codice === c) {
                            r.opacita = false;
                        } else if (r.opacita !== false) {
                            r.opacita = true;
                        }
                    });
                });
            } else {
                /**
                 * opacizzo i marker con stato diverso da quello di filterState
                 */
                this.mezziMarker.forEach(r => {
                    filterState.forEach(c => {
                        if (r.mezzo.stato.toLowerCase().substring(0, 5) === c.toLowerCase().substring(0, 5)) {
                            r.opacita = false;
                        } else if (r.opacita !== false) {
                            r.opacita = true;
                        }
                    });
                });
            }
        } else {
            /**
             * ritorno null a tutti i marker e tolgo l'opacità
             */
            this.mezziMarker.forEach(r => {
                r.opacita = null;
            });
        }
    }

}
