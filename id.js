function yo(){
    function nope(){
        console.log(this)
    }

    nope()
}


window.yo()