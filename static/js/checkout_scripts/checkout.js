import $ from "jquery"
import productSelect from "./productSelect"
import { clearCart, removeItem } from "./clearCart"
import tenderItems from "./tenderCart"
import productSearch from "./productSearch"


export default function checkout() {
  showOptionNav()
  productSearch()
  productSelect()
  tenderItems()
  clearCart()
}


function showOptionNav() {
  const $items = $('.items')

  $items.on("mouseenter", '.purchased-item', function() {
    const $self = $(this)
    const $options = $self.find('.option-nav')
    const $itemOptions = $options.find('.item-option')
    $itemOptions.addClass('show-option')

    itemRemoval($items, $self)

    $self.on("mouseleave", function() {
      const $checkbox = $options.find('.checkbox')
      $itemOptions.removeClass('show-option')

      if($checkbox.is(':checked')) {
        $checkbox.addClass('show-option')
      }
    })
  })
}

function itemRemoval($item_wrapper, $current_item) {
  const $trash = $current_item.find('.trash')

  $trash.off("click")

  $trash.click(function() {
    const $items = $item_wrapper.find('.purchased-item')

    $items.each((_, item) => {
      const $item = $(item)
      const $itemCheckbox = $item.find('.checkbox')

      if($itemCheckbox.is(':checked')) {
        removeItem($item)
      }
    })
  })
}
