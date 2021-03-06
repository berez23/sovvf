﻿//-----------------------------------------------------------------------
// <copyright file="GetRichiesteMarker.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetRichiesteMarker : IGetRichiesteMarker
    {
        public List<SintesiRichiestaMarker> GetListaRichiesteMarker()
        {
            List<SintesiRichiestaMarker> ListaSintesiRichieste = new List<SintesiRichiestaMarker>();

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSintesiRichieste = JsonConvert.DeserializeObject<List<SintesiRichiestaMarker>>(json);

            if (ListaSintesiRichieste != null)
            {
                return ListaSintesiRichieste;
            }
            else
            {
                List<SintesiRichiestaMarker> ListaRichiesteVuota = new List<SintesiRichiestaMarker>();
                return ListaRichiesteVuota;
            }
        }

        private string MapStatoRichiesta(SintesiRichieste sintesi)
        {
            string stato = "Chiamata";

            if (sintesi.Chiusa)
                stato = "Chiusa";

            if (sintesi.Sospesa)
                stato = "Sospesa";

            if (sintesi.Aperta)
            {
                if (sintesi.Presidiato)
                    stato = "Presidiata";
                else if (sintesi.IstantePrimaAssegnazione != null)
                    stato = "Assegnata";
            }

            return stato;
        }
    }
}
