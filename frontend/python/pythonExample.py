import sys
import os
import pickle
from nltk.tokenize import word_tokenize
from trainModel import remove_noise
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# # Add the path to the 'backend' directory to sys.path
# backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
# sys.path.append(backend_dir)

# from backend.main import handle_message
# from main import handle_message

# FUNCTIONS

def reword_phrase(phrase_to_reword):
    response = openai.Completion.create(
                model="text-davinci-003",
                prompt=get_prompt(phrase_to_reword),
                max_tokens=50,
        )   
    
    reworded_phrase = response.choices[0].text.strip()
    return reworded_phrase
    
def get_prompt(phrase_to_reword):
    return """You're a gamer and you are typing into the chat.
    You type this phrase ({}) but you don't want to be banned from the game. 
    Reword the phrase to type into the chat so that it's not rude language but still insulting and a good roast!
    Be very insulting in a nicely worded way so that the player feels bad. Add some humor too!
    """.format(phrase_to_reword)

def get_sentiment(loaded_classifier, message):
    # Returns sentiment (Positive, Neutral, Negative) for a message
    custom_tokens = remove_noise(word_tokenize(message))
    return loaded_classifier.classify(dict([token, True] for token in custom_tokens))

def handle_message(message):
    # Load the saved classifier from the file
    with open('./sentimentClassifier.pickle', 'rb') as f:
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

def my_print(str):
    print(str, flush=True)  # Add flush=True here

# CODE

if len(sys.argv) >= 2:
    # Access the first command-line argument (index 1) as a string
    message = sys.argv[1]
    message = message.replace("@", " ")

    # print(f'Python: Received string parameter: {message}')

    # Call the sentiment and GPT
    message = handle_message(message)
else:
    # print('Python: No string parameter provided.')
    message = ""

my_print(message)
# sys.stdout.flush()
