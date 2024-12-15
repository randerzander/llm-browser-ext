Start server.py on 8000, and update background.js to point to your server's hostname.

In Firefox, open about:debugging. On the left hand menu, click "This Firefox", then "Load Temporary Add-on...", then point to manifest.json

Switch to a tab you'd like to summarize. Then click the puzzle piece icon, and select "Grab Page Text". It'll give you a popup w/ an editable prompt, then send it and all text from your current tab to the server, then display whatever the LLM returns in a modal popup.

Example Prompt:
[prompt.png]

And the result:
[summary.png]
