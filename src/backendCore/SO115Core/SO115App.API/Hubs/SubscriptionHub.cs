using System.Threading.Tasks;
using SO115App.API.Models.Classi.Notifications;
using Microsoft.AspNetCore.SignalR;
using System;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Utenti;

namespace SO115App.API.Hubs
{
    public class SubscriptionHub : Hub
    {
        public async Task AddToGroup(Notification<Utente> utente)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, utente.CodiceSede);
            await Clients.OthersInGroup(utente.CodiceSede).SendAsync("NotifyLogIn", "L'utente " + utente.NominativoUtente + " è stato inserito nella sede " + utente.CodiceSede);
            await base.OnConnectedAsync();
        }

        public async Task RemoveToGroup(Notification<Utente> utente)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, utente.CodiceSede);
            await Clients.OthersInGroup(utente.CodiceSede).SendAsync("NotifyLogOut", "L'utente " + utente.NominativoUtente + " è uscito dalla sede " + utente.CodiceSede);
            await base.OnConnectedAsync();
        }

        public async Task SendMessage(Notification<String> messaggio)
        {     
            await Clients.OthersInGroup(messaggio.CodiceSede).SendAsync("ReceiveMessage", messaggio.ActionObj);
        }

        public async Task TurnoMessage(Notification<Turno> turno)
        {     
            await Clients.OthersInGroup(turno.CodiceSede).SendAsync("TurnoMessage", turno.ActionObj);
        }
    }
}