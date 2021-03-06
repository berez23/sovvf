﻿//-----------------------------------------------------------------------
// <copyright file="TestUtente.cs" company="CNVVF">
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
using System;
using NUnit.Framework;
using SO115App.API.Models.Classi.Autenticazione;

namespace Modello.Test.Classi.Autenticazione
{
    [TestFixture]
    public class TestUtente
    {
        [Test]
        public void Un_utente_con_username_e_correttamente_creato()
        {
            var utente = new Utente("username");

            Assert.That(utente.Username, Is.EqualTo("username"));
            Assert.That(utente.ValidoDa, Is.Null);
            Assert.That(utente.ValidoFinoA, Is.Null);
            Assert.That(utente.Attivo, Is.True);
        }

        [Test]
        public void Un_utente_con_username_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new Utente(" "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_utente_con_username_e_data_fine_validita_e_correttamente_creato()
        {
            var fine = DateTime.Now;
            var utente = new Utente("username", fine);

            Assert.That(utente.Username, Is.EqualTo("username"));
            Assert.That(utente.ValidoDa, Is.Null);
            Assert.That(utente.ValidoFinoA, Is.EqualTo(fine));
            Assert.That(utente.Attivo, Is.True);
        }

        [Test]
        public void Un_utente_con_username_e_data_fine_validita_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new Utente("username", new DateTime()),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_utente_con_username_data_inizio_e_fine_validita_e_correttamente_creato()
        {
            var inizio = DateTime.Now;
            var fine = DateTime.Now.AddDays(1);
            var utente = new Utente("username", inizio, fine);

            Assert.That(utente.Username, Is.EqualTo("username"));
            Assert.That(utente.ValidoDa, Is.EqualTo(inizio));
            Assert.That(utente.ValidoFinoA, Is.EqualTo(fine));
            Assert.That(utente.Attivo, Is.True);
        }

        [Test]
        public void Un_utente_con_username_data_inizio_validita_di_default_e_data_fine_validita_non_puo_essere_creato()
        {
            var fine = DateTime.Now.AddDays(1);
            Assert.That(
                () => new Utente("username", new DateTime(), fine),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_utente_con_username_data_inizio_validita_e_data_fine_validita_di_default_non_puo_essere_creato()
        {
            var inizio = DateTime.Now;
            Assert.That(
                () => new Utente("username", inizio, new DateTime()),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }
    }
}
