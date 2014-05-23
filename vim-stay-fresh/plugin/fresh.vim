function! SendRefreshRequest(...)
    let fileName = getreg('%')
    let urlEncodedFileName = substitute(fileName, '/', '%2F', 'g')
    let vimEscapedFileName = substitute(urlEncodedFileName, '%', '\\%', 'g')
    let eventName = a:0
    "Make request to the server
    "TODO: Don't hard-code the event name.
    let curlRequest = '"http://localhost:7700/BufWritePost?filename=' . vimEscapedFileName . '"'
    execute 'silent !curl ' . curlRequest
    "Clear and redraw the screen
    redraw!
endfunction

"Create an autocmd group
aug RefreshGroup
    "Clear the RefreshGroup augroup. Otherwise Vim will combine them.
    au!
    "TODO: Call this function with the event name as arg
    au BufWritePost * call SendRefreshRequest()
    au CursorHold * call SendRefreshRequest()
    au CursorHoldI * call SendRefreshRequest()
aug END
