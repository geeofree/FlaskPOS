(function() {
  const input = $('.text-input')

  input.focus(function() {
    const current = $(this)
    current.next().addClass("stretch")
  })

  input.blur(function() {
    const current = $(this)

    if(current[0].value.length < 5) {
      current.next().removeClass("stretch")
    }
  })
})()
