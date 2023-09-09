import pickle
from nltk.tokenize import word_tokenize
from trainModel import remove_noise

def main():
    # Load the saved classifier from the file
    with open('sentimentClassifier.pickle', 'rb') as f:
        loaded_classifier = pickle.load(f)

    custom_tweet = "I ordered just once from TerribleCo, they screwed up, never used the app again."

    custom_tokens = remove_noise(word_tokenize(custom_tweet))

    print(custom_tweet, loaded_classifier.classify(dict([token, True] for token in custom_tokens)))

if __name__ == "__main__":
    main()