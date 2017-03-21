import { addItem } from "./addItem"
import delItem from "./delItem"
import updateItem from "./updateItem"
import itemRestock from "./restockItem"
import tableSearch from "./searchTable"
import $ from "jquery"


export default function product() {
  selectItem()
  addItem()
  delItem()
  updateItem()
  itemRestock()
  tableSearch()
}

function selectItem() {
  const $table = $('.data-wrapper')

  $table.on("click", '.tbl-data', function() {
    const $self = $(this)

    if($self.hasClass('selected')) {
      $self.removeClass('selected')
    }
    else {
      $self.addClass('selected')
    }
  })
}
