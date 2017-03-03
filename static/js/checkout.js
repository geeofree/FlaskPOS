(function() {
  var down_icon = $('.down-icon')
  var choices = $('.choices')

  down_icon.click(function() {
    console.log(down_icon.hasClass('hide'), choices.hasClass('hide'))

    if(down_icon.hasClass('hide') && !choices.hasClass('hide')) {
      down_icon.removeClass('hide')
      choices.addClass('hide')
    }
    else if(choices.hasClass('hide') && !down_icon.hasClass('hide')){
      down_icon.addClass('hide')
      choices.removeClass('hide')
    }
  })

})()
