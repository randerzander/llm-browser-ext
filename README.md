Start server.py on 8000, and update background.js to point to your server's hostname.

In Firefox, open about:debugging. On the left hand menu, click "This Firefox", then "Load Temporary Add-on...", then point to manifest.json

Switch to a tab you'd like to summarize. Then click the puzzle piece icon, and select "Grab Page Text". It'll give you a popup w/ an editable prompt.

The default prompts are:
```
1. summarize the page in no more than 4 sentences
2. What if anything seems untrustworthy about this source? Be concise.
3. What questions need to be answered to complete the story? Be concise.
4. What are some jokes I can make about this later in mixed company?
```

You can edit these in [background.js](background.js).

Each of the numbered prompts are then sent with all text from your current tab to the server, then display whatever the LLM returns in a modal popup.

Example Summary Prompt:
![example prompt](images/prompt.png)

And the result:
![summary](images/summary.png)

Example with all 4 prompts:
![](images/the_register.png)
