import pickle
from nltk.tokenize import word_tokenize
from trainModel import remove_noise

def get_sentiment(custom_sentence):
    # Load the saved classifier from the file
    with open('sentimentClassifier.pickle', 'rb') as f:
        loaded_classifier = pickle.load(f)

    custom_tokens = remove_noise(word_tokenize(custom_sentence))
    
    return loaded_classifier.classify(dict([token, True] for token in custom_tokens))

if __name__ == "__main__":
    test_sentence = "this is a happy sentence with a bad word like shit"

    print(get_sentiment(test_sentence))