import $ from "jquery"
import ajax from "../misc/ajax"
export { select, createEl }

function select() {
  const $transaction = $('.transactions-body')

  $transaction.on('click', '.trans-data-wrapper', function() {
    const $self = $(this)
    const $selected = $('.selected-transaction')
    const receiptNo = Number($self.find('.transID').text())

    if($self.hasClass('selected-transaction')) {
      $self.removeClass('selected-transaction')
    }
    else {
      $selected.removeClass('selected-transaction')
      $self.addClass('selected-transaction')
      request_transaction_info(receiptNo)
    }

    if($('.selected-transaction').length == 0) {
      clearItems()
    }
  })
}

function request_transaction_info(receiptNo) {
  clearItems()

  ajax({transID: receiptNo}, '/receipt_request', resp => {
    resp.forEach(data => createItemEL(data))
  })
}

function clearItems() {
  const $item_sold = $('.sold-item')
  $item_sold.each((_, data) => $(data).remove())
}


function createItemEL(data) {
  const $wrapper   = $('.items-sold-wrapper')
  const $container = createEl('div', {'class': 'sold-item sold-column'})
  const $itemName  = createEl('p', {'class': 'long-width item-sold-name'}, data.name)
  const $itemQty   = createEl('p', {'class': 'short-width item-sold-qty'}, data.qty_sold)
  const $itemTotal = createEl('p', {'class': 'short-width item-sold-linetotal'}, "₱" + data.linetotal)

  $container.append($itemName, $itemQty, $itemTotal)
  $wrapper.append($container)
}

function createEl(el, attr, text) {
  const $element = $(document.createElement(el))
  $element.attr(attr)

  if(text) {
    const textEl = document.createTextNode(text)
    $element.append(textEl)
  }

  return $element
}
