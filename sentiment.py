import pickle
from nltk.tokenize import word_tokenize
from trainModel import remove_noise

def get_sentiment(loaded_classifier, message):
    # Returns sentiment (Positive, Neutral, Negative) for a message
    custom_tokens = remove_noise(word_tokenize(message))
    return loaded_classifier.classify(dict([token, True] for token in custom_tokens))

def main():
    # Load the saved classifier from the file
    with open('sentimentClassifier.pickle', 'rb') as f:
        loaded_classifier = pickle.load(f)

    messages = ["I ordered just once from TerribleCo, they screwed up, never used the app again.",
                     "You're such a loser why do you even play this game.",
                     "Hey you're great at this game",
                     "My grandmother plays better than you and she can't even see without glasses"]

    for message in messages:
        print(message, get_sentiment(loaded_classifier, message))

if __name__ == "__main__":
    test_sentence = "this is a happy sentence with a bad word like shit"

    print(get_sentiment(test_sentence))