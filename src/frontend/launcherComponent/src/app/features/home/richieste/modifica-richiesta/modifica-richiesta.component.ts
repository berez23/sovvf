import { Component, isDevMode, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RichiestaModificaState } from '../../store/states/richieste/richiesta-modifica.state';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { makeCopy, roundTodecimal, visualizzaBoschiSterpaglie } from '../../../../shared/helper/function';
import { PatchRichiesta } from '../../store/actions/richieste/richieste.actions';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { CopyToClipboard } from '../../store/actions/chiamata/clipboard.actions';
import { NavbarState } from '../../../navbar/store/states/navbar.state';
import { ChiudiRichiestaModifica, ModificaIndirizzo } from '../../store/actions/richieste/richiesta-modifica.actions';
import { Tipologia } from '../../../../shared/model/tipologia.model';
import { GOOGLEPLACESOPTIONS } from '../../../../core/settings/google-places-options';
import { Localita } from '../../../../shared/model/localita.model';
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { TipoTerreno } from '../../../../shared/model/tipo-terreno';

@Component({
    selector: 'app-modifica-richiesta',
    templateUrl: './modifica-richiesta.component.html',
    styleUrls: ['./modifica-richiesta.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModificaRichiestaComponent implements OnInit, OnDestroy {

    options = GOOGLEPLACESOPTIONS;

    tipologiaRichiedente: string;
    @Select(NavbarState.tipologie) tipologie$: Observable<Tipologia[]>;
    tipologie: Tipologia[];

    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;
    richiestaModifica: SintesiRichiesta;

    subscription = new Subscription();

    methods = new HelperSintesiRichiesta;

    modificaRichiestaForm: FormGroup;
    submitted = false;

    coordinate: Coordinate;

    constructor(private formBuilder: FormBuilder,
        private store: Store) {
        this.initForm();
        this.subscription.add(this.richiestaModifica$.subscribe((richiesta: SintesiRichiesta) => {
            if (richiesta) {
                this.richiestaModifica = makeCopy(richiesta);
                this.coordinate = makeCopy(richiesta.localita.coordinate);
            }
        }));
        this.subscription.add(this.tipologie$.subscribe((tipologie: Tipologia[]) => this.tipologie = tipologie));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Modifica Richiesta creato');
        this.creaForm();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Modifica Richiesta Distrutto');
    }

    initForm() {
        this.modificaRichiestaForm = this.formBuilder.group({
            tipoIntervento: new FormControl(),
            nominativo: new FormControl(),
            telefono: new FormControl(),
            indirizzo: new FormControl(),
            etichette: new FormControl(),
            noteIndirizzo: new FormControl(),
            rilevanzaGrave: new FormControl(),
            rilevanzaStArCu: new FormControl(),
            latitudine: new FormControl(),
            longitudine: new FormControl(),
            piano: new FormControl(),
            notePrivate: new FormControl(),
            notePubbliche: new FormControl(),
            motivazione: new FormControl(),
            zoneEmergenza: new FormControl(),
            prioritaRichiesta: new FormControl()
        });
    }

    get f() {
        return this.modificaRichiestaForm.controls;
    }

    creaForm(): void {
        const zoneEmergenza = this.richiestaModifica.zoneEmergenza ? this.richiestaModifica.zoneEmergenza.join(' ') : null;
        const etichette = this.richiestaModifica.tags ? this.richiestaModifica.tags.join(' ') : null;
        this.modificaRichiestaForm = this.formBuilder.group({
            tipoIntervento: [this.richiestaModifica.tipologie, Validators.required],
            nominativo: [this.richiestaModifica.richiedente.nominativo, Validators.required],
            telefono: [this.richiestaModifica.richiedente.telefono, Validators.required],
            indirizzo: [this.richiestaModifica.localita.indirizzo, Validators.required],
            etichette: [etichette],
            noteIndirizzo: [this.richiestaModifica.localita.note],
            rilevanzaGrave: [this.richiestaModifica.rilevanteGrave],
            rilevanzaStArCu: [this.richiestaModifica.rilevanteStArCu],
            latitudine: [this.richiestaModifica.localita.coordinate.latitudine, Validators.required],
            longitudine: [this.richiestaModifica.localita.coordinate.longitudine, Validators.required],
            piano: [this.richiestaModifica.localita.piano],
            notePrivate: [this.richiestaModifica.notePrivate],
            notePubbliche: [this.richiestaModifica.notePubbliche],
            motivazione: [this.richiestaModifica.descrizione],
            zoneEmergenza: [zoneEmergenza],
            prioritaRichiesta: [this.richiestaModifica.prioritaRichiesta]
        });

    }

    cambiaTipologiaRichiedente(tipologia: string) {
        this.tipologiaRichiedente = tipologia;
    }

    setRilevanza() {
        if (this.f.rilevanzaGrave.value === true) {
            this.f.rilevanzaGrave.setValue(false);
        } else {
            this.f.rilevanzaGrave.setValue(true);
        }
    }

    setRilevanzaStArCu() {
        if (this.f.rilevanzaStArCu.value === true) {
            this.f.rilevanzaStArCu.setValue(false);
        } else {
            this.f.rilevanzaStArCu.setValue(true);
        }
    }

    onCercaIndirizzo(result: Address): void {
        const coordinate = new Coordinate(roundTodecimal(result.geometry.location.lat(), 6), roundTodecimal(result.geometry.location.lng(), 6));
        this.coordinate = coordinate;
        this.f.latitudine.patchValue(coordinate.latitudine);
        this.f.longitudine.patchValue(coordinate.longitudine);
        this.f.indirizzo.patchValue(result.formatted_address);
        const nuovoIndirizzo = new Localita(coordinate ? coordinate : null, result.formatted_address);
        this.store.dispatch(new ModificaIndirizzo(nuovoIndirizzo));
    }

    onMsgIndirizzo(): string {
        let msg = '';
        if (this.f.indirizzo.errors && !this.coordinate) {
            msg = 'L\'indirizzo è richiesto';
        } else if (this.f.indirizzo.errors) {
            msg = 'L\'indirizzo è richiesto';
        } else if (!this.coordinate) {
            msg = 'È necessario selezionare un indirizzo dall\'elenco';
        } else {
            return null;
        }
        return msg;
    }

    onCopiaIndirizzo() {
        this.store.dispatch(new CopyToClipboard(new Coordinate(this.f.latitudine.value, this.f.longitudine.value)));
    }

    getNuovaRichiesta() {
        const nuovaRichiesta = this.richiestaModifica;

        const f = this.f;
        nuovaRichiesta.tipologie = f.tipoIntervento.value;
        nuovaRichiesta.richiedente.telefono = f.telefono.value;
        nuovaRichiesta.richiedente.nominativo = f.nominativo.value;
        nuovaRichiesta.localita.indirizzo = f.indirizzo.value;
        nuovaRichiesta.tags = f.etichette.value ? f.etichette.value.split(' ') : null;
        nuovaRichiesta.localita.note = f.noteIndirizzo.value;
        nuovaRichiesta.rilevanteGrave = f.rilevanzaGrave.value;
        nuovaRichiesta.rilevanteStArCu = f.rilevanzaStArCu.value;
        nuovaRichiesta.localita.coordinate.latitudine = f.latitudine.value;
        nuovaRichiesta.localita.coordinate.longitudine = f.longitudine.value;
        nuovaRichiesta.localita.piano = f.piano.value;
        nuovaRichiesta.descrizione = f.motivazione.value;
        nuovaRichiesta.zoneEmergenza = f.zoneEmergenza.value ? f.zoneEmergenza.value.split(' ') : null;
        nuovaRichiesta.notePrivate = f.notePrivate.value;
        nuovaRichiesta.notePubbliche = f.notePubbliche.value;
        nuovaRichiesta.prioritaRichiesta = f.prioritaRichiesta.value;
        // console.log('Richiesta Modificata', nuovaRichiesta);
        this.setDescrizione();
        return nuovaRichiesta;
    }

    onChiudiModifica() {
        this.store.dispatch(new ChiudiRichiestaModifica);
    }

    onConfermaModifica() {
        this.submitted = true;
        if (!(this.modificaRichiestaForm.valid && !!this.coordinate)) {
            return;
        }

        const nuovaRichiesta = this.getNuovaRichiesta();
        this.store.dispatch(new PatchRichiesta(nuovaRichiesta));
    }


    onTerreniSelezionati($event: TipoTerreno[]): void {
        this.richiestaModifica.tipoTerreno = $event;
    }

    checkTipologie(): boolean {
        return !!!(this.f.tipoIntervento.value && (this.f.tipoIntervento.value.length > 0));
    }

    modificaIndirizzo() {
        const address = this.f.indirizzo;
        if (address.touched || address.dirty) {
            this.coordinate = null;
        }
        console.log('coordinate', this.coordinate);
    }

    setDescrizione(): void {
        const form = this.f;
        if (!form.motivazione.value) {
            // console.log(form.selectedTipologie.value);
            const nuovaDescrizione = this.tipologie.filter(tipologia => tipologia.codice === form.tipoIntervento.value[0].codice);
            if (nuovaDescrizione && nuovaDescrizione.length > 0) {
                this.richiestaModifica.descrizione = nuovaDescrizione[0].descrizione;
            }
        }
    }

    visualizzaBoschiSterpaglie(tipologieRichiesta: Tipologia[]) {
        return visualizzaBoschiSterpaglie(tipologieRichiesta);
    }

}
