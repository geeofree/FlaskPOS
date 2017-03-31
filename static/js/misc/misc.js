import $ from 'jquery'
import "../../bower_components/jquery-mousewheel/jquery.mousewheel.min"
export { highlightMagnet, numInputValidation, changeHandler, scrollbar, logout }


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
function scrollbar($element) {
  if($element.constructor == Array) {
    $element.forEach( el => customScroll($(el)) )
  }
  else {
    customScroll($element)
  }

  function customScroll($el) {
    const $elParent = $el.parent()
    const $elChild = $el.children()
    const elHeight = $el.height()

    let $scrollWrapper, $scrollBar


    if(!$elParent.hasClass('scroll-wrapper')) {
      $scrollWrapper = $(document.createElement('div'))
      $scrollWrapper.height(elHeight)
      $scrollWrapper.addClass('scroll-wrapper')
      $scrollWrapper.append($el)
      $elParent.append($scrollWrapper)
      $el.addClass('scroll-content')
    }

    const contentChildHeight = $($elChild[0]).height()
    const contentHeight = Math.floor($el.height())
    const wrapperHeight = Math.floor($el.parent('.scroll-wrapper').height())
    const scrollMax = Math.round(contentHeight / 100)
    const maxHeight = contentHeight - wrapperHeight
    const scrollIter = Math.floor(maxHeight / scrollMax)
    const scrollBarIter = Math.floor(wrapperHeight / scrollMax)
    let scrollSpeed = 0
    let scrollBarSpeed = 0
    let lastBarIter = scrollBarIter

    if(contentHeight > wrapperHeight && $elParent.find('.scrollbar').length == 0) {
      $scrollBar = $(document.createElement('div'))
      $scrollBar.addClass('scrollbar')
      $el.parent('.scroll-wrapper').append($scrollBar)
    }

    if(contentHeight > wrapperHeight && $elParent.find('.scrollbar').length) {
      $elParent.find('.scrollbar').height(scrollBarIter)
      $el.css('top', 0 + 'px')
      $elParent.find('.scrollbar').css('top', 0 + 'px')
      addScrollEv($el)
    }
    else if(contentHeight < wrapperHeight && $elParent.find('.scrollbar').length) {
      $el.css('top', 0 + 'px')
      $el.off("mouseover")
      $el.off("mousewheel")
      $elParent.find('.scrollbar').css('top', 0 + 'px')
      $elParent.find('.scrollbar').remove()
    }


    function drag(goUp, goDown) {
      if(goUp) {
        scrollSpeed -= scrollIter
        scrollBarSpeed += scrollBarIter

        console.log(scrollSpeed, maxHeight)

        if(Math.abs(scrollSpeed) <= maxHeight) {
          $el.css('top', scrollSpeed + "px")
        }
        else {
          scrollSpeed += scrollIter
        }


        if(scrollBarSpeed <= wrapperHeight - scrollBarIter) {
          scrollBarSpeed += scrollBarIter

          if(scrollBarSpeed > wrapperHeight - scrollBarIter) {
            scrollBarSpeed -= scrollBarIter
            lastBarIter = (wrapperHeight - scrollBarIter) - scrollBarSpeed
            scrollBarSpeed = scrollBarSpeed + lastBarIter
          }
          else {
            scrollBarSpeed -= scrollBarIter
          }

          $elParent.find('.scrollbar').css('top', scrollBarSpeed + "px")
        }
        else {
          scrollBarSpeed -= scrollBarIter
        }

      }
      else if(goDown) {
        scrollSpeed += scrollIter
        $el.css('top', scrollSpeed + "px")

        if(scrollSpeed == 0) {
          scrollBarSpeed = 0
          $elParent.find('.scrollbar').css('top', scrollBarSpeed + "px")
          lastBarIter = scrollBarIter
          return
        }

        if(scrollBarSpeed > 0) {
          scrollBarSpeed -= lastBarIter ? lastBarIter : scrollBarIter
          $elParent.find('.scrollbar').css('top', scrollBarSpeed + "px")
          lastBarIter = scrollBarIter
        }
      }

    }

    function mousewheelEv(event) {
      const scrollY = event.deltaY
      const goUp = scrollY < 0 && Math.abs(scrollSpeed) < contentHeight
      const goDown = scrollY > 0 && scrollSpeed < 0

      drag(goUp, goDown)
    }

    function addScrollEv($element) {
      $element.off("mouseover")
      $element.mouseover(function() {
        const $self = $(this)
        $self.off("mousewheel")
        $self.mousewheel(mousewheelEv)
      })
    }
  }

}



// LOGOUT
function logout() {
  const btn = $('.power-btn')

  console.log(btn)

  btn.click(function() {
    const logout = confirm('Are you sure you want to log out?')

    if(logout) {
      window.location.replace('/logout')
    }
  })
}
