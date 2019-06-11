import { bindingTypes, expressionTypes, template } from '../../src'


function createEmptyTemplate() {
  return template('<virtual expr0><!----></virtual>', [{
    type: bindingTypes.VIRTUAL,
    selector: '[expr0]'
  }])
}

function createSimpleTemplate() {
  return template('<virtual expr0><!----></virtual>', [{
    type: bindingTypes.VIRTUAL,
    selector: '[expr0]',
    template: template('<p expr0><!----></b>', [{
      selector: '[expr0]',
      expressions: [
        {
          type: expressionTypes.TEXT, childNodeIndex: 0,
          evaluate: scope => scope.text
        }
      ]
    }])
  }])
}

describe('virtual bindings', () => {
  it('virtual bindings without markup will be removed', () => {
    const target = document.createElement('div')

    const el = createEmptyTemplate().mount(target, {
      text: 'hello'
    })

    expect(target.querySelector('virtual')).to.be.not.ok

    expect(() => el.update({text: 'goodbye'})).to.not.throw()

    el.unmount()
  })

  it('single virtual binding can be mounted and updated', () => {
    const target = document.createElement('div')

    const el = createSimpleTemplate().mount(target, {
      text: 'hello'
    })

    expect(target.querySelector('virtual')).to.be.not.ok
    expect(target.querySelector('p')).to.be.ok
    expect(target.querySelector('p').textContent).to.equal('hello')

    el.update({text: 'goodbye'})

    expect(target.querySelector('p').textContent).to.equal('goodbye')

    el.unmount()
  })

})
