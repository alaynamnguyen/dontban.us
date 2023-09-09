import pickle
from sentiment import get_sentiment
from niceify import reword_phrase

"""
TODO:
- Regex for credit card numbers / addresses / age / personal info
- Handle for explicit curse words / slurs
- Let the user add their own phrases to ban
"""

def handle_message(message):
    # Load the saved classifier from the file
    with open('backend/sentimentClassifier.pickle', 'rb') as f:
        loaded_classifier = pickle.load(f)

    # Test messages:
    # messages = ["You're such a loser why do you even play this game.",
    #             "Hey you're great at this game",
    #             "My grandmother plays better than you and she can't even see without glasses",
    #             "You should go quit you're terrible at this"]

    sentiment = get_sentiment(loaded_classifier, message)
    if sentiment == "Negative":
        message = reword_phrase(message).replace('"', "")
        print("\nNegative message!! Rewording with GPT:\n", message)
    else:
        print("\nPositive message!! Keeping as is:\n", message)
    
    return message

if __name__ == "__main__":
    handle_message()