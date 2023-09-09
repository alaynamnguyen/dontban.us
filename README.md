# mrnicegai

To set up: 
* Create a `.env` file with `OPENAI_API_KEY={paste key here}`

Run:
`python -m venv venv`
`. venv/bin/activate`
`pip install -r requirements.txt`

### Setting up nltk library on your venv (MacOS)
Activate your venv from above and do the following: 
* go into python interpreter by calling ```python3``` in your command line
install the following packages:
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('twitter_samples')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

exit with control+d

Call python3 sentiment.py.
If WordNet dependency is not installed, go into your finder
and call cmd+shift+h. This will open up your home and access the nltk_data/corpora folder and unzip wordnet.zip
