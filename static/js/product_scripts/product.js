import { addItem } from "./addItem"
import { scrollbar } from "../misc/misc"
import delItem from "./delItem"
import updateItem from "./updateItem"
import itemRestock from "./restockItem"
import tableSearch from "./searchTable"
import $ from "jquery"


export default function product() {
  scrollbar($('.data-table-body'))
  selectItem()
  addItem()
  delItem()
  updateItem()
  itemRestock()
  tableSearch()
}

function selectItem() {
  const $table = $('.data-table')

  $table.on("click", '.data-info', function() {
    const $self = $(this)

    if($self.hasClass('selected')) {
      $self.removeClass('selected')
    }
    else {
      $self.addClass('selected')
    }
  })
}
