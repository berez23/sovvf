export class LayoutMethods {

    constructor() {
    }

    /* Restituisce un Array con tanti elementi quanto è la priorità dell'intervento */
    vettorePallini(richiesta) {
        return new Array(richiesta.priorita);
    }

    /* Restituisce un Array con tanti elementi quanti sono i buchini della priorità dell'intervento */
    vettoreBuchini(richiesta) {
        const MAX_PRIORITA = 5;
        return new Array(MAX_PRIORITA - richiesta.priorita);
    }

    /* Restituisce i nomi delle squadre  */
    nomiSquadre(richiesta): string[] {
        let nomiSquadre: string[];
        if (richiesta.partenze) {
            richiesta.partenze.forEach(partenza => {
                nomiSquadre = partenza.squadre.map(s => s.nome);
            });
        }
        return nomiSquadre;
    }

    /* Restituisce il numero delle squadre */
    numeroSquadre(richiesta): number {
        let numeroSquadre = 0;
        if (richiesta.partenze) {
            richiesta.partenze.forEach(partenza => {
                numeroSquadre = numeroSquadre + partenza.squadre.length;
            });
        }
        return numeroSquadre;
    }

    /* Restituisce i nomi dei mezzi  */
    nomiMezzi(richiesta): string[] {
        let nomiMezzi = [];
        if (richiesta.partenze) {
            richiesta.partenze.forEach(partenza => {
                nomiMezzi = partenza.mezzi.map(s => s.descrizione);
            });
        }
        return nomiMezzi;
    }

    /* Restituisce il numero dei mezzi */
    numeroMezzi(richiesta): number {
        let numeroMezzi = 0;
        if (richiesta.partenze) {
            richiesta.partenze.forEach(partenza => {
                numeroMezzi = numeroMezzi + partenza.mezzi.length;
            });
        }
        return numeroMezzi;
    }

    /* Permette di colorare l'icona della tipologia */
    coloraIcona(nome): any {
        const colori = [
            {
                icon: 'fa fa-fire',
                color: 'text-danger'
            },
            {
                icon: 'fa fa-exclamation-triangle',
                color: 'text-warning'
            },
            {
                icon: 'fa fa-medkit',
                color: 'text-primary'
            }
        ];

        const colore = colori.find(x => x.icon === nome);
        if (nome === undefined || nome === '') {
            return 'fa fa-exclamation-triangle text-warning';
        } else if (colore !== undefined) {
            return nome + ' ' + colore.color;
        } else {
            return nome + ' guida';
        }
    }

    /* NgClass status */
    statusClass(richiesta) {
        return {
            'status_chiamata': richiesta.stato === 'chiamata',
            'status_presidiato': richiesta.stato === 'presidiato',
            'status_assegnato': richiesta.stato === 'assegnato',
            'status_sospeso': richiesta.stato === 'sospeso',
            'status_chiuso': richiesta.stato === 'chiuso'
        };
    }
}