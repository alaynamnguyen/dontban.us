# Demos

* Type in something insulting --> see it reworded with GPT
* Type in something positive --> watch it stay the same
* Profanity? Slurs?
* Credit card numbers?

# Notes

* Pitch it as a tool that players can use to make sure they don't get banned
* ALSO: Chat moderation for games (of all types, those that are well built and those that are newer / not fleshed out)
* Saves time that developers need to program chat moderation logic
* Standardizing chat moderation

message = "You're such a loser!"
    // replace all spaces with @ symbols to go in as one argument
    const replacedMessage = message.replace(/ /g, '@');

    startCodeFunction(replacedMessage, (result) => {
      console.log("Result from Python:", result);
    });