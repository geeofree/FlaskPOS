import $ from "jquery"
import search from "../misc/searchQuery"

export default function tableSearch() {
  const $parent = $('.data-table-body');
  search($parent, '.data-sku', '.data-name', '.data-type')
}
