export const VirtualBinding = Object.seal({
  // dynamic binding properties
  node: null,
  name: null,
  template: null,

  // API methods
  mount(scope, parentScope) {
    if (this.template) {
      this.template = this.template.clone()
      this.template.mount(this.node, scope, parentScope)
    }
    unwrap(this.node)

    this.node.parentNode.removeChild(this.node)

    return this
  },
  update(scope, parentScope) {
    if (this.template) {
      this.template.update(scope, parentScope)
    }

    return this
  },
  unmount(scope, parentScope) {
    if (this.template) {
      this.template.unmount(scope, parentScope, false)
    }

    return this
  }
})

function unwrap(node) {
  if (node.firstChild) {
    node.parentNode.insertBefore(node.firstChild, node)
    unwrap(node)
  }
}

export default function createVirtual(node, { template }) {
  return {
    ...VirtualBinding,
    node,
    template
  }
}
