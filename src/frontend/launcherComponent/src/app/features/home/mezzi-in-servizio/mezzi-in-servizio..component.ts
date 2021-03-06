import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ToggleMezziInServizio } from '../store/actions/view/view.actions';
import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { GetMezziInServizio } from '../store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { MezziInServizioState } from '../store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { Observable } from 'rxjs';
import { MezzoActionInterface } from 'src/app/shared/interface/mezzo-action.interface';
import { ActionMezzo } from '../store/actions/richieste/richieste.actions';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { statoMezzoBorderClass } from 'src/app/shared/helper/function';
import { StatoMezzo } from 'src/app/shared/enum/stato-mezzo.enum';
import { SetIdRichiestaEventi, ClearEventiRichiesta, SetRicercaTargaMezzo } from '../store/actions/eventi/eventi-richiesta.actions';
import { EventiRichiestaComponent } from '../eventi/eventi-richiesta.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mezzi-in-servizio',
  templateUrl: './mezzi-in-servizio.component.html',
  styleUrls: ['./mezzi-in-servizio.component.css']
})
export class MezziInServizioComponent implements OnInit {

  @Select(MezziInServizioState.mezziInServizio) mezziInServizio$: Observable<Mezzo[]>;
  mezziInServizio: Mezzo[];

  @Select(RichiesteState.richieste) richieste$: Observable<SintesiRichiesta[]>;
  richieste: SintesiRichiesta[];

  constructor(private store: Store,
    private modalService: NgbModal) {
    this.store.dispatch(new GetMezziInServizio());
    this.mezziInServizio$.subscribe((mezzi: Mezzo[]) => {
      this.mezziInServizio = mezzi;
    });

    this.richieste$.subscribe((richieste: any) => {
      this.richieste = richieste;
    });
  }

  ngOnInit() {
    // TODO: implementare
    // this.store.dispatch(new SetFiltroMarker('mezzo'));
  }

  onActionMezzo(mezzo: Mezzo, mezzoAction: MezzoActionInterface) {
    const richiesta = this.richieste.filter(x => x.codice === mezzo.idRichiesta)[0];
    mezzoAction.richiesta = richiesta ? richiesta : null;
    mezzoAction.listaMezzi = true;
    this.store.dispatch(new ActionMezzo(mezzoAction));
  }

  statoMezzoBorderClass(stato: StatoMezzo) {
    return statoMezzoBorderClass(stato);
  }

  onDettaglioRichiesta(mezzo: Mezzo) {
    this.store.dispatch(new ToggleMezziInServizio());
    // this.store.dispatch(new SetRicerca({ 'descrizione': mezzo.idRichiesta }));
  }

  /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
  onVisualizzaEventiRichiesta(mezzo: Mezzo, idRichiesta: string) {
    this.store.dispatch(new SetIdRichiestaEventi(idRichiesta));
    this.store.dispatch(new SetRicercaTargaMezzo({ targa: mezzo.descrizione }));
    const modal = this.modalService.open(EventiRichiestaComponent, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
    modal.result.then(() => {
    },
      () => this.store.dispatch(new ClearEventiRichiesta()));
  }

  tornaIndietro() {
    this.store.dispatch(new ToggleMezziInServizio());
  }

}
