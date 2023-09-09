import os
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

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
    You type this phrase ("{}") but you don't want to be banned from the game. 
    Reword the phrase to type into the chat so that it's not rude language but still insulting and a good roast!
    Be very insulting in a nicely worded way so that the player feels bad. Add some humor too!
    """.format(phrase_to_reword)

def main():
    # phrase_to_reword = "You are such a loser"
    phrase_to_reword = "My grandmother plays league better than you, you loser!"
    print(reword_phrase(phrase_to_reword))