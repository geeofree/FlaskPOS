import $ from "jquery"
import selectUserEl from "./selectUserEl"
import formKeyEvents from "./userForm"
import userButtonEvent from "./userModals"
import { scrollbar } from "../misc/misc"

export default function users() {
  scrollbar($('.user-table-body'))
  selectUserEl()
  formKeyEvents()
  userButtonEvent()
}
