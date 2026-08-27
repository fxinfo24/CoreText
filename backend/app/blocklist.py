"""Disposable / temporary email domain blocking.

Self-registration is open (anyone with the URL can create a viewer account),
so we block the most common throwaway-mail providers to reduce spammer/bot
signups. This is defense-in-depth, not a hard guarantee — a determined actor
can always use a real domain. Pair with admin approval for production if needed.
"""
from typing import Set

# Curated list of known disposable / temp-mail providers.
DISPOSABLE_DOMAINS: Set[str] = {
    "10minutemail.com", "10minutemail.net", "20minmail.com", "30minutemail.com",
    "9xm.in", "a-bc.net", "amail.club", "anonbox.net", "discard.email",
    "discard.ga", "discard.email", "dispostable.com", "dummyemail.net",
    "emailfake.com", "emailgo.de", "emailsensei.com", "fakeinbox.com",
    "fake-mail.ws", "fakemailgenerator.com", "fakemailgenerator.net",
    "filzmail.com", "forgetmail.com", "getnada.com", "getonemail.com",
    "guerrillamail.com", "guerrillamail.de", "guerrillamail.net",
    "guerrillamail.org", "guerrillamailblock.com", "incognitomail.com",
    "jetable.org", "mailcatch.com", "maildrop.cc", "mailinator.com",
    "mailinator.net", "mailinator.org", "mailinator2.com", "mailnesia.com",
    "mailnull.com", "mailexpire.com", "mailhub.io", "mailnesia.com",
    "mintemail.com", "moburl.com", "mt2009.com", "mytrashmail.com",
    "nada.email", "no-spam.ws", "noclick.email", "nospam.ze.tc",
    "nullbox.info", "pokemail.net", "prtnx.com", "realemail.net",
    "rppkn.com", "shortmail.net", "sharklasers.com", "sogetthis.com",
    "spam4.me", "spamail.ws", "spamcero.com", "spambog.com", "spambog.de",
    "spambog.ru", "spambox.us", "spamdate.com", "spamgourmet.com",
    "spamhole.com", "spamify.com", "spamkill.info", "spaml.com",
    "spamlot.net", "spamola.com", "spamrs.com", "spamslicer.com",
    "spamspot.com", "spamstack.net", "spamthis.co.uk", "spamtrail.com",
    "spamtroll.net", "supremeboard.com", "tempemail.co", "tempemail.com",
    "tempemail.net", "tempinbox.com", "tempmail.com", "tempmail.de",
    "tempmail.eu", "tempmail.net", "tempmail.org", "tempmailaddress.com",
    "temp-mail.org", "temp-mail.org", "tempmailo.com", "temporarily.de",
    "tempovmail.com", "thankyou2010.com", "throwawayemailaddress.com",
    "throwawaymail.com", "throwam.com", "trash2009.com", "trashmail.com",
    "trashmail.net", "trashmail.org", "trashmailer.com", "trashymail.com",
    "trashymail.net", "yep.it", "yopmail.com", "yopmail.fr", "yopmail.net",
    "zehnminuten.de", "zoemail.net", "zumpul.com",
}


def is_disposable_email(email: str) -> bool:
    try:
        domain = email.strip().lower().split("@", 1)[1]
    except IndexError:
        return False
    return domain in DISPOSABLE_DOMAINS
