# needle

Way to search through large sistemic original.json files by section or user names or ids.

1. Pull repo into place that you'll find later: git clone git@github.com:jaronrayj/needle.git
2. Move to directory: cd needle
3. Install: npm install
4. Move original.json to json-storage/original
5. Run node: npm start

It will run through options to allow you to choose between user or section and providing id or name.

TIPS
The less information you provide, the more content you will get back. It will pull data from partial info. 
If you want more specific, provide more info.

UltraLog will save it to the json-storage/log folder by the what you are searching with (id or name).
I couldn't figure out how to format it... find a nice json formatter with your favorite coding platform.