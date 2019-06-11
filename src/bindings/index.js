import {EACH, IF, SIMPLE, SLOT, TAG, VIRTUAL} from './binding-types'
import EachBinding from './each'
import IfBinding from './if'
import SimpleBinding from './simple'
import SlotBinding from './slot'
import TagBinding from './tag'
import VirtualBinding from './virtual'

export default {
  [IF]: IfBinding,
  [SIMPLE]: SimpleBinding,
  [EACH]: EachBinding,
  [TAG]: TagBinding,
  [SLOT]: SlotBinding,
  [VIRTUAL]: VirtualBinding
}
