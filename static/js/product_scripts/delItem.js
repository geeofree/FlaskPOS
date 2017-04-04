import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import ajax from "../misc/ajax"

export default function delItem () {
  const $delBtn        = $('.delete')
  const $delModal      = $('.remove-modal')

  btnOpenModal($delBtn, $delModal, modalEvent)
}


function modalEvent(content, showModal) {
  const $selected  = $('.selected')
  const $confirm   = $('.confirm')
  const $contentInputs = content.find('input')
  var canBeDeleted = 0

  if($selected.length == 0) {
    alert('No item(s) selected to delete')
    return
  }

  $selected.each((_, el) => {
    const $el = $(el)
    const stock = Number($el.find('.data-stock').text())

    if(stock == 0) {
      canBeDeleted++
    }
    else {
      $el.removeClass('selected')
    }
  })

  if(canBeDeleted) {
    showModal()
  }
  else {
    alert('All selected items still have stocks, cannot remove.')
    return
  }

  $confirm.click(function() {
    const $sel = $('.selected')
    const pass  = $('.pw-delete').val()
    let url, count = 0

    const data = {
      client_pass: pass,
      item_id: []
    }

    $sel.each(function(_, el) {
      const $el = $(el)
      const invID = $el.find('.invID').text()
      const stock = $el.find('.data-stock').text()

      data.item_id.push(invID)
    })

    function response(resp) {
      if(resp.status == 'success') {
        count++

        if(count == $sel.length) {
          alert(`Successfully removed ${count} item(s).`)
          window.location.replace(resp.url)
        }
      }
      else {
        alert(resp.error)
      }
    }

    ajax(data, '/del_product', response)
  })

  closeModal(function() {
    $contentInputs.val('')
  })
}
