import $ from "jquery"
import openModal from "../misc/modal"

const closeBtn = $('.close')

export default function delItem () {
  const $delBtn        = $('.delete')
  const $delModal      = $('.remove-modal')

  openModal($delBtn, $delModal, modalEvent)
}


function modalEvent(modal, content) {
  const $selected      = $('.selected')
  const $confirm       = $('.confirm')
  const $contentInputs = content.find('input')


  if($selected.length == 0) {
    alert('ERROR: No item(s) selected to delete')
    return
  }

  // SHOW modal
  modal.addClass('active')
  content.addClass('active')

  $confirm.click(function() {
    $selected.each(function(_, el) {
      const $el = $(el)
      const $invID = $el.find('.invID').text()

      $.ajax({
        url: `/del_product?id=${$invID}`,
        data: $('.warning').serialize(),
        type: 'POST'
      })

    })
  })

  closeBtn.click(function() {
    $('.active').removeClass('active')
    $contentInputs.val('')
  })
}
