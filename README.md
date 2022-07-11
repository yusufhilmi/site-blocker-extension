# Site Blocker with Todo List





### To-dos
1. Implement drag and drop for both domains and todos
2. Listen to tab updates from background service worker instead of content script
3. Write tests, (simulate chrome.storage and extension development, reloading extension is a PITA)


## Learnings
1. Sync storage is persistent as long as extension is loaded. Reloads and pauses won't affect it.
2. If you remove extension and load unpacked storage will reset.
   1. Wonder if this applies to extensions from Chrome web store, it might be bounded to id of extension
3. In app navs are a bit tricky, content scripts only will run in load and unless there is a refresh it will not be in effect.
