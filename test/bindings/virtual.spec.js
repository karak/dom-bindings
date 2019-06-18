import { bindingTypes, expressionTypes, template } from '../../src'


function createEmptyTemplate() {
  return template('<virtual expr0><!----></virtual>', [{
    type: bindingTypes.VIRTUAL,
    selector: '[expr0]'
  }])
}

function createSimpleTemplate() {
  return template('<virtual expr0><p expr1><!----></b></virtual>', [{
    type: bindingTypes.VIRTUAL,
    selector: '[expr0]',
    bindings: [{
      selector: '[expr1]',
      expressions: [
        {
          type: expressionTypes.TEXT, childNodeIndex: 0,
          evaluate: scope => scope.text
        }
      ]
    }]
  }])
}

function createWithIfTemplate() {
  return template('<virtual expr0><p expr1><!----></p></virtual>', [{
    type: bindingTypes.VIRTUAL,
    selector: '[expr0]',
    bindings: [
      {
        // no selector, which means root element
        type: bindingTypes.IF,
        evaluate: scope => scope.isVisible,
        template: template('<!---->', [])
      },
      {
        selector: '[expr1]',
        expressions: [{
          type: expressionTypes.TEXT,
          childNodeIndex: 0,
          evaluate: scope => scope.text
        }]
      }
    ]
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

  it('virtual with if directive binding can be mounted and updated', () => {
    const target = document.createElement('div')

    const el = createWithIfTemplate().mount(target, {
      text: 'hello',
      isVisible: true
    })

    expect(target.querySelector('virtual')).to.be.not.ok
    expect(target.querySelector('p')).to.be.ok
    expect(target.querySelector('p').textContent).to.equal('hello')

    el.update({isVisible: false})

    expect(target.querySelector('virtual')).to.be.not.ok
    expect(target.querySelector('p')).to.be.not.ok

    el.update({isVisible: true, text: 'goodbye'})

    expect(target.querySelector('virtual')).to.be.not.ok
    expect(target.querySelector('p')).to.be.ok
    expect(target.querySelector('p').textContent).to.equal('goodbye')

    el.unmount()
  })
})
