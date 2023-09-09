import sys
import os

# # Add the path to the 'backend' directory to sys.path
# backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
# sys.path.append(backend_dir)

# from backend.main import handle_message

# FUNCTIONS


def my_print(str):
    print('Python    : "' + str + '"', flush=True)  # Add flush=True here


# CODE

my_print('Spawned from within electron (js)')

if len(sys.argv) >= 2:
    # Access the first command-line argument (index 1) as a string
    message = sys.argv[1]
    message = message.replace("@", " ")

    # Now you can use 'string_parameter' in your Python code
    print(f'Received string parameter: {message}')
else:
    print('No string parameter provided.')

