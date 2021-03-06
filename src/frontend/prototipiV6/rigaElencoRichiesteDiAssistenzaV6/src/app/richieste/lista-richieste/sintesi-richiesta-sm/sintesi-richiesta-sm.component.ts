import { Component, OnInit, Input } from '@angular/core';

// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Service
import { ListaRichiesteService } from '../../service/lista-richieste-service.service';

// Helper methods
import { HelperMethods } from '../../helper/_helper-methods';

@Component({
  selector: 'app-sintesi-richiesta-sm',
  templateUrl: './sintesi-richiesta-sm.component.html',
  styleUrls: ['./sintesi-richiesta-sm.component.css']
})
export class SintesiRichiestaSmComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;

  methods = new HelperMethods;

  constructor(private richiesteS: ListaRichiesteService) { }

  ngOnInit() {
  }

  // Ritorna la richiesta nella lista, defissandola
  defissa() {
    this.richiesteS.defissata();
    this.richiesteS.deselezionata();
  }
}
