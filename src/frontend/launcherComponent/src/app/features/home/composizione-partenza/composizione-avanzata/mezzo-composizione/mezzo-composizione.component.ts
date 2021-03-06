import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// Interface
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../interface/box-partenza-interface';
// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { HelperComposizione } from '../../shared/helper/_helper-composizione';
import { MezzoDirection } from '../../../../../shared/interface/mezzo-direction';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';

@Component({
    selector: 'app-mezzo-composizione',
    templateUrl: './mezzo-composizione.component.html',
    styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit {
    @Input() mezzoComp: MezzoComposizione;
    @Input() richiesta: SintesiRichiesta;
    @Input() partenze: BoxPartenza[];
    @Input() itemSelezionato: boolean;
    @Input() itemHover: boolean;
    @Input() itemPrenotato: boolean;
    @Input() itemInPrenotazione: boolean;
    @Input() itemBloccato: boolean;

    @Output() selezionato = new EventEmitter<MezzoComposizione>();
    @Output() deselezionato = new EventEmitter<MezzoComposizione>();
    @Output() hoverIn = new EventEmitter<MezzoComposizione>();
    @Output() hoverOut = new EventEmitter<MezzoComposizione>();
    @Output() sbloccato = new EventEmitter<MezzoComposizione>();

    // Progress Bar
    @Output() startTimeout = new EventEmitter<MezzoComposizione>();
    @Output() stopTimeout = new EventEmitter<MezzoComposizione>();

    // Mappa
    @Output() mezzoCoordinate = new EventEmitter<MezzoDirection>();

    // Sganciamento
    @Output() sganciamento = new EventEmitter<SganciamentoInterface>();

    methods = new HelperComposizione();

    constructor() {
    }

    ngOnInit() {
    }

    // Events
    onClick() {
        if (!this.itemSelezionato) {
            this.selezionato.emit(this.mezzoComp);

            // mappa
            if (this.mezzoComp.mezzo.stato !== 'In Viaggio' && this.mezzoComp.mezzo.stato !== 'Sul Posto') {
                this.mezzoDirection(this.mezzoComp);
            }
        } else if (this.selezionato) {
            this.deselezionato.emit(this.mezzoComp);
        }
    }

    onHoverIn() {
        this.hoverIn.emit(this.mezzoComp);
    }

    onHoverOut() {
        this.hoverOut.emit(this.mezzoComp);
    }

    // Lucchetto
    onSganciamento() {
        if (this.mezzoComp.idRichiesta) {
            const sganciamentoObj = {
                'idMezzo': this.mezzoComp.mezzo.codice,
                'idRichiestaDa': this.mezzoComp.mezzo.idRichiesta
            };
            this.sganciamento.emit(sganciamentoObj);
            // console.log('mezzoComp', this.mezzoComp);
        } else {
            console.error('[SganciamentoMezzo] IdRichiesta non presente nel Mezzo');
        }
    }

    // NgClass
    liClass() {
        let returnClass = '';

        const hover = this.itemHover ? 'hover-si' : 'hover-no';
        const selezionato = this.itemSelezionato ? 'selezionato-si' : 'selezionato-no';
        const prenotato = this.itemPrenotato ? 'prenotato-si' : 'prenotato-no';

        switch (hover + '|' + selezionato + '|' + prenotato) {
            case 'hover-si|selezionato-no|prenotato-no':
                returnClass += 'border-warning';
                break;
            case 'hover-no|selezionato-si|prenotato-no':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-si|prenotato-no':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-no|selezionato-no|prenotato-si':
                returnClass += 'diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-no|prenotato-si':
                returnClass += 'diagonal-stripes bg-lightgrey';
                break;
            case 'hover-no|selezionato-si|prenotato-si':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-si|prenotato-si':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
        }
        //
        // if (this.itemBloccato) {
        if (this.mezzoComp.mezzo.stato !== 'In Sede' && this.mezzoComp.mezzo.stato !== 'In Rientro') {
            returnClass += ' diagonal-stripes bg-lightdanger';
            this.itemBloccato = true;
        }
        // }

        if (this.itemInPrenotazione) {
            returnClass += ' diagonal-stripes bg-lightgrey';
        }

        return returnClass;
    }

    badgeDistaccamentoClass() {
        let result = 'badge-secondary';

        if (this.richiesta && this.mezzoComp) {
            const distaccamentoMezzo = this.mezzoComp.mezzo.distaccamento.descrizione;

            if (this.richiesta.competenze && this.richiesta.competenze.length > 0) {
                if (this.richiesta.competenze[0].descrizione === distaccamentoMezzo) {
                    result = 'badge-primary';
                } else if (this.richiesta.competenze[1].descrizione === distaccamentoMezzo) {
                    result = 'badge-info';
                }
            }
        }
        return result;
    }

    // Mappa
    mezzoDirection(mezzoComp: MezzoComposizione): void {
        const mezzoDirection = {
            idMezzo: mezzoComp.id,
            coordinateMezzo: mezzoComp.coordinate
        } as MezzoDirection;
        this.mezzoCoordinate.emit(mezzoDirection);
    }
}
