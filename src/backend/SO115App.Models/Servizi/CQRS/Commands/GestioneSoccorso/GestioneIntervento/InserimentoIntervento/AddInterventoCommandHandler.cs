﻿//-----------------------------------------------------------------------
// <copyright file="AddInterventoCommandHandler.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using System;
using System.Data;
using SO115App.Models.Classi.Utility;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoCommandHandler : ICommandHandler<AddInterventoCommand>
    {
        private readonly ISaveRichiestaAssistenza _saveRichiestaAssistenza;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;

        public AddInterventoCommandHandler(ISaveRichiestaAssistenza saveRichiestaAssistenza, IGeneraCodiceRichiesta generaCodiceRichiesta)
        {
            this._saveRichiestaAssistenza = saveRichiestaAssistenza;
            _generaCodiceRichiesta = generaCodiceRichiesta;
        }

        public void Handle(AddInterventoCommand command)
        {
            var sedeRichiesta = command.Chiamata.Operatore.Sede.Codice;
            var prioritaRichiesta = (RichiestaAssistenza.Priorita)command.Chiamata.PrioritaRichiesta;
            var codiceChiamata = _generaCodiceRichiesta.GeneraCodiceChiamata(sedeRichiesta, DateTime.UtcNow.Year);
            command.Chiamata.Codice = codiceChiamata;
            command.Chiamata.Id = codiceChiamata;

            var richiesta = new RichiestaAssistenza()
            {
                Tipologie = command.Chiamata.Tipologie,
                ZoneEmergenza = command.Chiamata.ZoneEmergenza,
                Operatore = command.Chiamata.Operatore,
                Richiedente = command.Chiamata.Richiedente,
                Localita = command.Chiamata.Localita,
                Descrizione = command.Chiamata.Descrizione,
                Codice = codiceChiamata,
                TurnoInserimentoChiamata = command.Chiamata.TurnoInserimentoChiamata,
                TipoTerreno = command.Chiamata.TipoTerreno,
                ListaEntiIntervenuti = command.Chiamata.ListaEntiIntervenuti,
                ObiettivoSensibile = command.Chiamata.ObiettivoSensibile,
                ListaUtentiInLavorazione = command.Chiamata.ListaUtentiInLavorazione,
                ListaUtentiPresaInCarico = command.Chiamata.ListaUtentiPresaInCarico,
                NotePubbliche = command.Chiamata.NotePubbliche,
                NotePrivate = command.Chiamata.NotePrivate,
                Id = codiceChiamata // TODO DA TOGLIERE QUANDO AVREMO UN DB
            };

            if (command.Chiamata.Stato == Costanti.RichiestaChiusa)
            {
                new ChiusuraRichiesta("", richiesta, DateTime.UtcNow, command.Chiamata.Operatore.Id);
            }

            if (command.Chiamata.Tags != null)
            {
                foreach (var t in command.Chiamata.Tags)
                {
                    richiesta.Tags.Add(t);
                }
            }

            new Telefonata(richiesta, command.Chiamata.Richiedente.Telefono, DateTime.UtcNow, command.Chiamata.Operatore.Id)
            {
                NominativoChiamante = command.Chiamata.Richiedente.Nominativo,
                Motivazione = command.Chiamata.Motivazione,
                NotePrivate = command.Chiamata.NotePrivate,
                NotePubbliche = command.Chiamata.NotePubbliche,
                NumeroTelefono = command.Chiamata.Richiedente.Telefono,
                Esito = command.Chiamata.Azione.ToString(),
            };

            new AssegnazionePriorita(richiesta, prioritaRichiesta, DateTime.UtcNow.AddMilliseconds(1.0), command.Chiamata.Operatore.Id);

            if (command.Chiamata.RilevanteGrave || command.Chiamata.RilevanteStArCu)
                new MarcaRilevante(richiesta, DateTime.UtcNow.AddMilliseconds(1.5), command.Chiamata.Operatore.Id, "", command.Chiamata.RilevanteGrave,
            command.Chiamata.RilevanteStArCu);

            this._saveRichiestaAssistenza.Save(richiesta);
        }
    }
}
