// background.js
browser.browserAction.onClicked.addListener(function(tab) {
  browser.tabs.executeScript(tab.id, {
    code: `
      overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999;display:flex;justify-content:center;align-items:center;';
      
      const dialog = document.createElement('div');
      dialog.style.cssText = 'background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);width:300px;';
      dialog.innerHTML = \`
        <h3 style="margin-top:0;">Enter Prompt</h3>
        <textarea id="promptInput" style="width:100%;margin:10px 0;padding:8px;min-height:60px;">
        1. summarize the page in no more than 4 sentences
        2. What if anything seems untrustworthy about this source? Be concise.
        3. What questions need to be answered to complete the story? Be concise.
        4. What are some jokes I can make about this later in mixed company?
        </textarea>
        <div style="text-align:right;">
          <button id="submitPrompt" style="margin-right:8px;padding:6px 12px;">Submit</button>
          <button id="cancelPrompt" style="padding:6px 12px;">Cancel</button>
        </div>
      \`;
      
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      document.getElementById('submitPrompt').onclick = function() {
        const userPrompt = document.getElementById('promptInput').value;
        overlay.remove();
        browser.runtime.sendMessage({
          action: "promptSubmitted",
          prompt: userPrompt,
	  tabId: ${tab.id}
        });
      };

      document.getElementById('cancelPrompt').onclick = function() {
        overlay.remove();
      };
    `
  });
});

function sendToEndpoint(pageText, userPrompt, tabId) {
  //console.log(userPrompt);
  //console.log(pageText);
  //console.log(tabId);
  fetch('http://desktop:8000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userPrompt: userPrompt, text: pageText }),
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    browser.tabs.executeScript(tabId, {
      code: `
        overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:99999;display:flex;justify-content:center;align-items:center;';
        const content = document.createElement('div');
        content.style.cssText = 'background:white;padding:20px;border-radius:5px;max-width:80%;max-height:80%;overflow:auto;';
        content.innerHTML = '<h2>Response</h2><p>' + ${JSON.stringify(data)} + '</p><button id="closeOverlay">Close</button>';
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        document.getElementById('closeOverlay').onclick = function() { overlay.remove(); };
      `
    });
  })
  .catch((error) => console.error('Error:', error));
}

browser.runtime.onMessage.addListener(function(message) {
  if (message.action === "promptSubmitted") {
    console.log("promptSubmitted");
    console.log(message);
    browser.tabs.executeScript(message.tabId, {
      code: `var userPrompt = ${JSON.stringify(message.prompt)}; var tabId = ${message.tabId};`
    }).then(() => {
      browser.tabs.executeScript(message.tabId, {
        file: "content_script.js"
      });
    });
  } else if (message.action === "sendPageText") {
    console.log("sendPageText");
    console.log(Object.keys(message));
    sendToEndpoint(message.pageText, message.userPrompt, message.tabId);
  }
});
