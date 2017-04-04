import $ from "jquery"
import { btnOpenModal, closeModal } from "../misc/modal"
import restockNumInputEvent from "./stockNumInput"
import ajax from "../misc/ajax"



export default function itemRestock() {
  const $restockBtn   = $('.restock')
  const $restockModal = $('.restock-modal')

  btnOpenModal($restockBtn, $restockModal, modalEvent)
}

function modalEvent(content, showModal) {
  const $selected      = $('.selected')
  const $selContainer  = $('.selected-table-items')

  if($selected.length == 0) {
    alert('No item(s) selected to restock.')
    return
  }

  // SHOW MODAL
  showModal()

  // Create Item Table of Selected Items
  createSelItems($selected, $selContainer)

  // Stock Input Events
  restockNumInputEvent()

  // Confirm Stock Button Event
  restock()

  // CLOSE MODAL
  closeModal(function() {
    clearContainer()
    $('.all-stock').val(0)
    $('.confirm-restock').off("click")
  })
}

// CREATE ITEM FUNCTION
function createSelItems($selected, $container) {
  $selected.each((_, data) => {
    const $data  = $(data)

    // ELEMENT DATA
    const $name  = $data.find('.data-name').text()
    const $stock = $data.find('.data-stock').text()
    const $max   = $data.find('.data-max-stock').text()
    const $id    = $data.find('.invID').text()

    // ITEM ELEMENT
    const itemEL = stockSelItem($id, $name, $stock, $max)

    // APPEND TO CONTAINER
    $container.append(itemEL)
  })
}

// STOCK SELECTED ITEM
function stockSelItem($id, $name, $stock, $max) {
  // ITEM ELEMENT
  const item = document.createElement('div')
  item.setAttribute('class', "sel-tbl-item")
  item.setAttribute('id', $id)
  const $item = $(item)

  // ITEM NAME ELEMENT
  const itemName = document.createElement('span')
  const nameVal = document.createTextNode($name)
  itemName.setAttribute('class', 'long-div sel-item-name')
  $(itemName).append(nameVal)

  // ITEM STOCK INPUT ELEMENT
  const stockInput = document.createElement('input')
  stockInput.setAttribute('class', 'short-div sel-item-stock stock-input')
  stockInput.setAttribute('type', 'text')
  stockInput.setAttribute('value', 0)

  // ITEM IN-STOCK ELEMENT
  const inStock = document.createElement('span')
  const stockVal = document.createTextNode($stock)
  inStock.setAttribute('class', 'short-div sel-item-instock')
  $(inStock).append(stockVal)

  // ITEM MAX STOCK ELEMENT
  const maxStock = document.createElement('span')
  const maxVal = document.createTextNode($max)
  maxStock.setAttribute('class', 'short-div sel-item-max')
  $(maxStock).append(maxVal)


  const itemData = [itemName, stockInput, inStock, maxStock]
  itemData.forEach(el => $item.append(el))

  return $item
}

// CLEAR CONTAINER
function clearContainer() {
  const $item = $('.sel-tbl-item')
  $item.each((_, data) => $(data).remove())
}

// RESTOCK
function restock() {
  const $confirm = $('.confirm-restock')
  const $items   = $('.sel-tbl-item')

  function confirmClick() {
    var url;

    // Iterate all over the items
    function item(_, item) {
      const $item = $(item)
      const $itemID = Number($item.attr('id').match(/\d+/)[0])
      const $stock = Number($item.find('.stock-input').val())

      // Data for to send on Route
      const data = {
        item_id: $itemID,
        stock: $stock
      }


      function data_resp(data) {
        if(data.status == "success") {
          url = data.url
        }
      }

      ajax(data, '/restock_product', data_resp)
    }

    $items.each(item)
    alert('Success!')
    window.location.replace(url)
  }

  $confirm.click(confirmClick)
}
