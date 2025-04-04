# Comick-Utils
some scripts for comick will probably merge with comick-client at some point

# how to use publish-to-url

1)go to (this)[https://api.comick.fun/publisher] link and do ctrl + f and search for the publisher you want go to the "slug" section
and copy that into publisher variable

2) go to this line of code "const targets = ["yuri"];" the target variable to whatever genre or tag you want to include example:
const targets = ["yuri"];
const targets = ["yuri", "romance"];

3) run the file running ``node publish-to-url.js``
