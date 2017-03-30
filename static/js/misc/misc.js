import $ from 'jquery'
import "../../bower_components/jquery-mousewheel/jquery.mousewheel.min"
export { highlightMagnet, numInputValidation, changeHandler, scrollbar }


function highlightMagnet() {
  const dir = $('.dir')
  const current = $('.current_dir')

  dir.mouseenter(function() {
    const $self = $(this)
    if(!$self.hasClass('current_dir')) {
      dir.addClass('current_dir')
      current.removeClass('current_dir')
    }
  })

  dir.mouseleave(function() {
    const $self = $(this)

    if(!current.hasClass('current_dir')) {
      current.addClass('current_dir')
      $self.removeClass('current_dir')
    }
  })
}

// Input Length Validator
function numInputValidation($inputEL, callback) {

  $inputEL.keydown(function(event) {
    const button = event.which || event.button
    const keyVal = String.fromCharCode(button)

    if(!(button >= 48 && button <= 57 || button >= 96 && button <= 105 || button == 8
      || button == 37 || button == 39 || event.ctrlKey && button == 65 || button == 9)) {
      event.preventDefault()
    }
  })

  $inputEL.keyup(function(event) {
    const $self  = $(this)
    const button = event.which || event.button
    const keyVal = String.fromCharCode(button)

    if(callback) {
      if(keyVal !== " " && !isNaN(keyVal) || button == 8) {
        callback($self, event)
      }
    }

  })
}

// Change Handler for Number Type Inputs
function changeHandler($input, min, max) {
  $input.change(function() {
    const $self = $(this)
    const val = Number($self.val())

    if(val < min) {
      $self.val(max)
      return
    }

    if(val > max) {
      $self.val(min)
      return
    }
  })
}

// SCROLLBAR
function scrollbar($parent) {

  if($parent.constructor == Array) {
    $parent.forEach( el => customScroll($(el)) )
  }
  else {
    customScroll($parent)
  }

  function customScroll($el) {
    const $elParent = $el.parent()
    const $elChild = $el.children()
    const elHeight = $el.height()

    const $scrollBar = $(document.createElement('div'))
    $scrollBar.addClass('scrollbar')

    const $scrollWrapper = $(document.createElement('div'))
    $scrollWrapper.height(elHeight)
    $scrollWrapper.addClass('scroll-wrapper')

    $scrollWrapper.append($el, $scrollBar)
    $elParent.append($scrollWrapper)

    $el.addClass('scroll-content')

    const contentChildHeight = $($elChild[0]).height()
    const contentHeight = $el.height()
    const scrollMax = contentHeight / contentChildHeight
    const maxHeight = contentHeight - elHeight
    const scrollIter = Math.floor(maxHeight / scrollMax)
    const scrollBarIter = Number((elHeight / scrollMax).toFixed(2))
    let scrollSpeed = 0
    let scrollBarSpeed = 0

    $scrollBar.height(scrollBarIter)

    function drag(goUp, goDown) {
      if(goUp) {
        scrollSpeed -= scrollIter
        scrollBarSpeed = Number((scrollBarSpeed + scrollBarIter).toFixed(2))

        if(Math.abs(scrollSpeed) < maxHeight) {
          $el.css('top', scrollSpeed + "px")
        }
        else {
          scrollSpeed += scrollIter
        }

        if(scrollBarSpeed < elHeight) {
          $scrollBar.css('top', scrollBarSpeed + "px")
        }
        else {
          scrollBarSpeed -= scrollBarIter
        }

      }
      else if(goDown) {
        scrollSpeed += scrollIter
        $el.css('top', scrollSpeed + "px")

        if(scrollBarSpeed > 0) {
          scrollBarSpeed = Number((scrollBarSpeed - scrollBarIter).toFixed(2))
          $scrollBar.css('top', scrollBarSpeed + "px")
        }
      }

      console.log(scrollBarSpeed)
    }

    function mousewheelEv(event) {
      const scrollY = event.deltaY
      const goUp = scrollY < 0 && Math.abs(scrollSpeed) < elHeight
      const goDown = scrollY > 0 && scrollSpeed < 0

      drag(goUp, goDown)
    }

    $el.mousewheel(mousewheelEv)
  }


}
