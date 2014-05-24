function! SendRefreshRequest()
    let fileName = getreg('%')
    let urlEncodedFileName = substitute(fileName, '/', '%2F', 'g')
    let vimEscapedFileName = substitute(urlEncodedFileName, '%', '\\%', 'g')
    "Make request to the server with the event name and the filename. Not
    "really using the filename at this point, but in the future it might
    "come in handy. We're also not bothing with anything other than the
    "BufWritePost event, but it's nice to keep in general for now in case we
    "want start listening for other events in the future.
    let curlRequest = '"http://localhost:7700/reload?filename=' . vimEscapedFileName . '"'
    execute 'silent !curl ' . curlRequest
    "Clear and redraw the screen
    redraw!
endfunction

"Create an autocmd group
aug RefreshGroup
    "Clear the RefreshGroup augroup. Otherwise Vim will combine them.
    au!
    au BufWritePost * call SendRefreshRequest()
aug END
