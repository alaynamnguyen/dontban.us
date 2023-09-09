import pickle
from sentiment import get_sentiment
from niceify import reword_phrase

def main():
    # Load the saved classifier from the file
    with open('sentimentClassifier.pickle', 'rb') as f:
        loaded_classifier = pickle.load(f)


    messages = ["I ordered just once from TerribleCo, they screwed up, never used the app again.",
                     "You're such a loser why do you even play this game.",
                     "Hey you're great at this game",
                     "My grandmother plays better than you and she can't even see without glasses"]

    for message in messages:
        sentiment = get_sentiment(loaded_classifier, message)
        if sentiment == "Negative":
            print("Negative message!! Rewording with GPT:")
            reworded_message = reword_phrase(message)
            print(reworded_message)
        else:
            print("Positive message!! Keeping as is:")
            print(message)

if __name__ == "__main__":
    main()