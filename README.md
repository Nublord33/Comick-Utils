# Comick-Utils
some scripts for comick will probably merge with comick-client at some point 

0.000000001) install nodejs  using these: 
[windows](https://www.youtube.com/watch?v=06X51c6WHsQ) 
[mac](https://www.youtube.com/watch?v=l53HbzbSwxQ)
<details open>
<summary>publisher comic search</summary>
  
0.1) you have 2 options slow anslow.js and fast.js slow.js is slower but more accurate but publish-to-url is really fast and hit or miss  


  <details open>
<summary>slow.js</summary>
# how to use slow.js

1)go to [this](https://api.comick.fun/publisher) link and do ctrl + f and search for the publisher you want go to the "slug" section
and copy that into publisher variable

2) go to this line of code ``const targets = ["yuri"];`` the target variable to whatever genre you want to include example:
``const targets = ["yuri"];``
``const targets = ["yuri", "romance"];``

3) run the file running ``node slow.js``
</details>


  <details open>
<summary>fast.js</summary>
1) go to [this](https://api.comick.fun/publisher) link and do ctrl + f and search for the publisher you want go to the "slug" section
and copy that into publisher variable

2) go to this line of code ``const targets = ["yuri"];`` the target variable to whatever genre or tag you want to include example:
``const targets = ["yuri"];``
``const targets = ["yuri", "romance"];``

3) run the file running ``node fast.js``
</details>
</details>
