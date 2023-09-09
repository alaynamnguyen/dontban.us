import pickle
from nltk.tokenize import word_tokenize
from trainModel import remove_noise

def get_sentiment(loaded_classifier, message):
    # Returns sentiment (Positive, Neutral, Negative) for a message
    custom_tokens = remove_noise(word_tokenize(message))
    return loaded_classifier.classify(dict([token, True] for token in custom_tokens))