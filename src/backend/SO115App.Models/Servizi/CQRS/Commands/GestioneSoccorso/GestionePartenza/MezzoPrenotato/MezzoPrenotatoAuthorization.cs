using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;

namespace DomainModel.CQRS.Commands.MezzoPrenotato
{
    public class MezzoPrenotatoAuthorization : ICommandAuthorizer<MezzoPrenotatoCommand>
    {

        private readonly IPrincipal currentUser;

        public MezzoPrenotatoAuthorization(IPrincipal currentUser)
        {
            this.currentUser = currentUser;
        }

        public IEnumerable<AuthorizationResult> Authorize(MezzoPrenotatoCommand command)
        {
            var username = currentUser.Identity.Name;
            var user = Utente.FindUserByUsername(username);

            if (currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);

        }
    }
}
