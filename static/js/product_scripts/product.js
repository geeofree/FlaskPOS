import selectItem from "../misc/selectItem"
import { addItem } from "./addItem"
import delItem from "./delItem"
import updateItem from "./updateItem"
import $ from "jquery"

const $tableData = $('.tbl-data')

export default function product() {
  selectItem($tableData, "selected")
  addItem()
  delItem()
  updateItem()
}
