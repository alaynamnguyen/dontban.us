import sys
import os

# # Add the path to the 'backend' directory to sys.path
# backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
# sys.path.append(backend_dir)

# from backend.main import handle_message
# from main import handle_message

# FUNCTIONS

def my_print(str):
    print(str, flush=True)  # Add flush=True here

# CODE

if len(sys.argv) >= 2:
    # Access the first command-line argument (index 1) as a string
    message = sys.argv[1]
    message = message.replace("@", " ")

    print(f'Python: Received string parameter: {message}')
else:
    print('Python: No string parameter provided.')

# Call the sentiment and GPT

# my_print("HEY MAN")
print("HEY MAN")
sys.stdout.flush()
