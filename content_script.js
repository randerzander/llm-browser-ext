function getPageText() {
  return document.body.innerText;
}
let pageText = getPageText();

browser.runtime.sendMessage({
  action: "sendPageText",
  pageText: pageText,
  tabId: tabId,
  userPrompt: userPrompt
});

