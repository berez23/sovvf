import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/**
 * Component
 */
import { GestioneUtentiComponent } from './gestione-utenti.component';
/**
 * Routing
 */
import { GestioneUtentiRouting } from './gestione-utenti.routing';
import { ListaUtentiComponent } from './lista-utenti/lista-utenti.component';
/**
 * Module
 */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [GestioneUtentiComponent, ListaUtentiComponent],
  imports: [
    CommonModule,
    GestioneUtentiRouting,
    NgbModule
  ]
})
export class GestioneUtentiModule { }