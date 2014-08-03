Chrome Stay Fresh
=================
A Chrome extension for auto-reloading various tabs in the Chrome browser.
It relies on the presence of a [native messaging
host](https://developer.chrome.com/extensions/messaging#native-messaging)
which accepts HTTP requests on port 7700 and notifies the Chrome extension
when those requests are made. The extension itself maintains a list of
"listening" tabs which are automatically reloaded (i.e., "refreshed")
whenever the **native messaging host** receives a `GET /reload HTTP/1.1`
request.

This extension is meant to accompany the
[vim-stay-fresh](https://github.com/ahw/vim-stay-fresh) Vim plugin and/or
the [vim-hooks](https://github.com/ahw/vim-hooks) Vim plugin. Much like
bacon, eggs, and toast, either pairing should work well together out of the
box because the coupling is very loose.  (The
[vim-stay-fresh](https://github.com/ahw/vim-stay-fresh) plugin simply runs
`curl localhost:7700/reload` whenever Vim fires a `BufWritePost` event.
Using **vim-stay-fresh** and **chrome-stay-fresh** together enables
auto-reloading of browser tabs whenever there are file changes in Vim.)

**Note:** if you're coming here from the
[vim-hooks](https://github.com/ahw/vim-hooks) documentation, understand that
although I've been happily using this code for a few months now without an
issue, it has not been battle tested in any way. I'd appreciate hearing
issues people have as they try to get this up and running in their own
environments.

Installation
------------
Installation is still not very smooth. I have not released the extension
into the Chrome Web Store which means the only option at the moment involves
loading the unpacked extension directly from a local `git-clone` of this
repo. The drawback of this approach is that Chrome will generate a unique ID
for the unpacked extension that must be manually cut and pasted into the
**native messaging host** manifest file. This id must be present in the list
of `allow_origins` of `host/org.vim.stayfresh.json`.

Here is the most reliable installation procedure at the moment. Please raise
and issue or message me directly if you'd like help.
**Important:** the
`INSTALL` script only handles **Mac OSX** correctly at the moment):

1. Load the unpacked extension.
2. Copy the ID from the `chrome://extensions` page (make sure "Developer mode"
  checkbox is checked)
3. Add that ID to the `allow_origins` list in `org.vim.stayfresh.json` along with
  the others. Seems that wildcards are not allowed.
4. Take a look at the `INSTALL` script to get an idea of what it's doing,
   which is mostly just copying a few files around and replacing some magic
   strings in the `host/org.vim.stayfresh.json` templatized manifest file.
   If all looks good, run `./INSTALL` to copy the host manifest file to the
   right place.
5. Restart Chrome
6. Re-load the extension from `chrome://extensions`.
