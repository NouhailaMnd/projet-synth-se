@component('mail::message')
# Bonjour {{ $prestataire->nom ?? 'Prestataire' }},

Nous vous informons que votre abonnement arrive à expiration dans 2 jours.

**Date de fin :** {{ \Carbon\Carbon::parse($abonnement->date_fin)->format('d/m/Y') }}

Veuillez renouveler votre abonnement pour continuer à bénéficier de nos services.



Merci,<br>
L’équipe Service à Domicile
@endcomponent
