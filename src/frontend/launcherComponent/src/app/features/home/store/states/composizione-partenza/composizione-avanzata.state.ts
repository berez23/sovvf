import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import {
    ClearComposizioneAvanzata,
    GetListeComposizioneAvanzata,
    UnselectMezziAndSquadreComposizioneAvanzata
} from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { MezziComposizioneState } from './mezzi-composizione.state';
import { SquadreComposizioneState } from './squadre-composizione.state';
import { ComposizionePartenzaState } from './composizione-partenza.state';
import {
    ClearSelectedMezziComposizione,
    SetListaMezziComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import {
    ClearSelectedSquadreComposizione,
    SetListaSquadreComposizione
} from '../../actions/composizione-partenza/squadre-composizione.actions';
import { ListaComposizioneAvanzata } from '../../../composizione-partenza/interface/lista-composizione-avanzata-interface';
import { BoxPartenzaState } from './box-partenza.state';
import {
    mezzoComposizioneBusy,
    squadraComposizioneBusy
} from '../../../composizione-partenza/shared/functions/composizione-functions';
import { RemoveBoxPartenza } from '../../actions/composizione-partenza/box-partenza.actions';
import { FiltriComposizione } from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';

export interface ComposizioneAvanzataStateModel {
    listaMezziSquadre: Array<any>;
}

export const ComposizioneAvanzataStateDefaults: ComposizioneAvanzataStateModel = {
    listaMezziSquadre: []
};

@State<ComposizioneAvanzataStateModel>({
    name: 'composizioneAvanzata',
    defaults: ComposizioneAvanzataStateDefaults,
    children: [MezziComposizioneState, SquadreComposizioneState]
})
export class ComposizioneAvanzataState {


    @Selector()
    static listaMezziSquadre(state: ComposizioneAvanzataStateModel) {
        return state.listaMezziSquadre;
    }


    constructor(private squadreService: CompPartenzaService,
                private store: Store) {
    }

    @Action(GetListeComposizioneAvanzata)
    getListeComposizioneAvanzata({ getState, dispatch }: StateContext<ComposizioneAvanzataStateModel>, action: GetListeComposizioneAvanzata) {
        const filtri = {} as FiltriComposizione;
        if (action.filtri) {
            filtri.CodiceDistaccamento = action.filtri.CodiceDistaccamento.length > 0 ? action.filtri.CodiceDistaccamento : [''];
            filtri.CodiceStatoMezzo = action.filtri.CodiceStatoMezzo.length > 0 ? action.filtri.CodiceStatoMezzo : [''];
            filtri.CodiceTipoMezzo = action.filtri.CodiceTipoMezzo.length > 0 ? action.filtri.CodiceTipoMezzo : [''];
        } else {
            filtri.CodiceDistaccamento = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceDistaccamento.length > 0 ?
                this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo : [''];
            filtri.CodiceStatoMezzo = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceStatoMezzo.length > 0 ?
                this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo : [''];
            filtri.CodiceTipoMezzo = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo.length > 0 ?
                this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati).CodiceTipoMezzo : [''];
        }
        filtri.idRichiesta = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione) ? this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id : '';
        // filtri['idRichiesta'] = '1';

        // imposto il codice del mezzo selezionato se presente
        const codiceMezzo = this.store.selectSnapshot(MezziComposizioneState.idMezzoComposizioneSelezionato);

        if (action.onlyMezziComposizione && codiceMezzo && codiceMezzo.length > 0) {
            filtri.CodiceMezzo = [codiceMezzo];
        } else {
            filtri.CodiceMezzo = [''];
        }
        // imposto il codice delle squadre selezionate se presenti
        const codiceSquadre = this.store.selectSnapshot(SquadreComposizioneState.idSquadreSelezionate);

        if (action.onlySquadreComposizione && codiceSquadre && codiceSquadre.length > 0) {
            filtri.CodiceSquadra = codiceSquadre;
        } else {
            filtri.CodiceSquadra = [''];
        }

        console.log(filtri);
        this.squadreService.getListeComposizioneAvanzata(filtri).subscribe((listeCompAvanzata: ListaComposizioneAvanzata) => {
            if (listeCompAvanzata) {
                const listaBoxPartenza = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
                if (listeCompAvanzata.composizioneMezzi) {
                    this.store.dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezzi));
                }
                if (listeCompAvanzata.composizioneSquadre) {
                    this.store.dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadre));
                }
                console.log('listeCompAvanzata', listeCompAvanzata);
                if (listaBoxPartenza.length > 0) {
                    const listaBoxMezzi = listaBoxPartenza.filter( box => box.mezzoComposizione !== null);
                    if (listaBoxMezzi.length > 0) {
                        const mezziOccupati = [];
                        listeCompAvanzata.composizioneMezzi.forEach(mezzo => {
                            if (mezzoComposizioneBusy(mezzo.mezzo.stato)) {
                                mezziOccupati.push(mezzo.id);
                            }
                        });
                        if (mezziOccupati.length > 0) {
                            listaBoxPartenza.forEach(box => {
                                if (mezziOccupati.includes(box.mezzoComposizione.id)) {
                                    this.store.dispatch(new RemoveBoxPartenza(box));
                                }
                            });
                        }
                    }
                }
            }
            // console.log('Composizione Partenza Avanzata Service');
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(UnselectMezziAndSquadreComposizioneAvanzata)
    unselectMezziAndSquadreComposizioneAvanzata({ dispatch }: StateContext<ComposizioneAvanzataStateModel>) {
        dispatch(new ClearSelectedMezziComposizione());
        dispatch(new ClearSelectedSquadreComposizione());
    }


    @Action(ClearComposizioneAvanzata)
    clearComposizioneAvanzata({ patchState }: StateContext<ComposizioneAvanzataStateModel>) {
        patchState(ComposizioneAvanzataStateDefaults);
    }
}
