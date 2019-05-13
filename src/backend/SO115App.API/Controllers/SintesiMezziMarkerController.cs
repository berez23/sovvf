﻿//-----------------------------------------------------------------------
// <copyright file="SintesiMezziMarkerController.cs" company="CNVVF">
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
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiMezziMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using System.Collections.Generic;
using System.Net;
using System.Security.Principal;
using System.Threading.Tasks;

/* using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste; */

namespace SO115App.API.Controllers
{
    /// <summary>
    ///   Controller per l'accesso alla sintesi sulle richieste di assistenza
    /// </summary>

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SintesiMezziMarkerController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IQueryHandler<SintesiMezziMarkerQuery, SintesiMezziMarkerResult> handler;

        private readonly IHubContext<NotificationHub> _NotificationHub;
        private readonly IPrincipal _currentUser;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public SintesiMezziMarkerController(IHubContext<NotificationHub> NotificationHubContext, IPrincipal currentUser,
            IQueryHandler<SintesiMezziMarkerQuery, SintesiMezziMarkerResult> handler)
        {
            this.handler = handler;
            _NotificationHub = NotificationHubContext;
            _currentUser = currentUser;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="filtro">Il filtro per le richieste</param>
        /// <returns>Le sintesi delle richieste di assistenza</returns>
        [HttpGet]
        public async Task<IActionResult> Get(string id)
        {
            FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza();
            filtro.SearchKey = "0";

            var query = new SintesiMezziMarkerQuery()
            {
                Filtro = filtro
            };

            try
            {
                List<SintesiMezzoMarker> listaSintesi = new List<SintesiMezzoMarker>();
                listaSintesi = (List<SintesiMezzoMarker>)this.handler.Handle(query).SintesiMezziMarker;

                await _NotificationHub.Clients.Client(id).SendAsync("NotifyGetListaMezziMarker", listaSintesi);

                return Ok();
            }
            catch
            {
                return Ok(HttpStatusCode.BadRequest);
            }
        }

        [HttpGet("{filtro}")]
        public SintesiMezziMarkerResult GetMarkerFromId(FiltroRicercaRichiesteAssistenza filtro)
        {
            var query = new SintesiMezziMarkerQuery()
            {
                Filtro = filtro
            };

            return this.handler.Handle(query);
        }
    }
}