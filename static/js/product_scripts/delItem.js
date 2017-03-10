import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"


export default function delItem () {
  const $delBtn        = $('.delete')
  const $delModal      = $('.remove-modal')

  btnOpenModal($delBtn, $delModal, modalEvent)
}


function modalEvent(content, showModal) {
  const $selected      = $('.selected')
  const $confirm       = $('.confirm')
  const $contentInputs = content.find('input')


  if($selected.length == 0) {
    alert('ERROR: No item(s) selected to delete')
    return
  }

  // SHOW modal
  showModal()

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

  closeModal(function() {
    $contentInputs.val('')
  })
}
