import createBinding from '../binding'


export const VirtualBinding = Object.seal({
  // dynamic binding properties
  node: null,
  start: null,
  end: null,
  bindings: null,

  // API methods
  mount(scope, parentScope) {
    // marking around the node
    mark.apply(this)

    if (this.bindings) {
      this.bindings.forEach(b => b.mount(scope, parentScope))
    }

    if (this.node.parentNode) {
      unwrap.apply(this)
      this.node.parentNode.removeChild(this.node)
    }

    return this
  },
  update(scope, parentScope) {
    rewrap.apply(this)
    this.end.parentNode.insertBefore(this.node, this.end)

    if (this.bindings) {
      this.bindings.forEach(b => b.update(scope, parentScope))
    }

    if (this.node.parentNode) {
      unwrap.apply(this)
      this.node.parentNode.removeChild(this.node)
    }

    return this
  },
  unmount(scope, parentScope) {
    rewrap.apply(this)

    if (this.bindings) {
      this.bindings.forEach(b => b.unmount(scope, parentScope))
    }

    // remove the marking around the node
    unmark.apply(this)

    return this
  }
})

/**
 * Mark the node by a pair of comment nodes.
 *
 * @return {undefined}
 */
function mark() {
  const { node, start, end } = this
  node.parentNode.insertBefore(start, node)
  node.parentNode.insertBefore(end, node.nextSibling)
  if (node.parentNode !== start.parentNode || node.parentNode !== end.parentNode) throw new Error('node must have the same parent')
}

function unmark() {
  const { start, end } = this
  start.parentNode.removeChild(start)
  end.parentNode.removeChild(end)
}

function unwrap() {
  const {node} = this

  function liftup() {
    if (!node.firstChild) {
      return
    }
    node.parentNode.insertBefore(node.firstChild, node)
  }
  liftup()
}

function rewrap() {
  const {node, start, end} = this

  function liftdown() {
    if (start.nextSibling === end) {
      return
    }
    node.appendChild(start.nextSibling)
    liftdown()
  }

  liftdown()
}

function createCompositeBindings(node, bindings) {
  return bindings.map(b => createBinding(node, b))
}

export default function createVirtual(node, { bindings }) {

  const start = node.ownerDocument.createComment('virtual')
  const end = node.ownerDocument.createComment('/virtual')

  return {
    ...VirtualBinding,
    node,
    start,
    end,
    bindings: bindings && createCompositeBindings(node, bindings)
  }
}
