﻿// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

using System;
using System.Collections.Generic;
using System.Linq;
using Modello.Classi.Soccorso.Eventi.Eccezioni;

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Questa classe rappresenta l'assegnazione di risorse per l'evasione di una richiesta di
    ///   assistenza. Le risorse sono costituite da componenti con i relativi ruoli, Mezzi e Squadra
    /// </summary>
    /// no
    /// <remarks>
    ///   Questo evento associa il personale all'effettivo mezzo e squadra che interverranno per il
    ///   soccorso. Valuteremo se i mezzi e le attrezzature possono essere ricondotti ad un'unica
    ///   categoria (risorsa strumentale).
    /// </remarks>
    public class ComposizionePartenza : Evento
    {
        /// <summary>
        ///   Costruttore che inizializza l'attributo Componenti.
        /// </summary>
        public ComposizionePartenza()
        {
            this.Componenti = new HashSet<ComponentePartenza>();
        }

        /// <summary>
        ///   Restituisce il codice fiscale del capopartenza presente all'interno dei componenti.
        /// </summary>
        public string CodiceFiscaleCapopartenza
        {
            get
            {
                try
                {
                    var componenteCapopartenza = this.Componenti.SingleOrDefault(c => c.Ruoli.Contains(ComponentePartenza.Ruolo.CapoPartenza));

                    if (componenteCapopartenza != null)
                    {
                        return componenteCapopartenza.CodiceFiscale;
                    }

                    return null;
                }
                catch (InvalidOperationException ex)
                {
                    throw new ComposizionePartenzaException("Esiste più di un Capo Partenza", ex);
                }
            }
        }

        /// <summary>
        ///   Restituisce l'insieme dei codici fiscali relativi alla partenza
        /// </summary>
        public ISet<string> CodiciFiscaliComponenti
        {
            get
            {
                return new HashSet<string>(this
                    .Componenti
                    .Select(c => c.CodiceFiscale));
            }
        }

        /// <summary>
        ///   E' la lista dei componenti della partenza
        /// </summary>
        public ISet<ComponentePartenza> Componenti { get; set; }

        /// <summary>
        ///   Restituisce il numero di componenti della <see cref="ComposizionePartenza" />
        /// </summary>
        public int NumeroComponenti
        {
            get
            {
                return this.Componenti.Count;
            }
        }
    }
}