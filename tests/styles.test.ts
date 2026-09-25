import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import {
  CAPPED_ATTR, LINES_VAR, PLUGIN_ATTR, PLUGIN_ID, STYLE_ATTR, STYLE_ID,
} from '../src/shared.ts'
import { applyWindowLines, injectStyles, resetWindowLines } from '../src/client/styles.ts'

/** 样式桩只认 `tag[attr="value"]` 这一种选择器形状. */
const OWNED_SELECTOR = /^(\w+)\[([\w-]+)="([^"]*)"\]$/

/** 只保留 styles.ts 用到的 CSSStyleDeclaration 成员. */
class StubStyle {
  readonly values = new Map<string, string>()

  setProperty(name: string, value: string): void {
    this.values.set(name, value)
  }

  removeProperty(name: string): void {
    this.values.delete(name)
  }
}

/** 只保留 styles.ts 用到的元素成员. */
class StubElement {
  readonly tagName: string
  readonly attributes = new Map<string, string>()
  readonly children: StubElement[] = []
  readonly style = new StubStyle()
  textContent = ''
  parent: StubElement | null = null

  constructor(tagName: string) {
    this.tagName = tagName
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value)
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name)
  }

  appendChild(child: StubElement): void {
    child.parent = this
    this.children.push(child)
  }

  remove(): void {
    const parent = this.parent
    if (parent === null) return
    const index = parent.children.indexOf(this)
    if (index >= 0) parent.children.splice(index, 1)
    this.parent = null
  }
}

/** 只保留 styles.ts 用到的 document 成员. */
class StubDocument {
  readonly documentElement = new StubElement('html')
  readonly head = new StubElement('head')

  createElement(tagName: string): StubElement {
    return new StubElement(tagName)
  }

  querySelector(selector: string): StubElement | null {
    const match = OWNED_SELECTOR.exec(selector)
    if (match === null) throw new Error(`stub document: unsupported selector ${selector}`)
    const [, tagName, attribute, value] = match
    return this.head.children.find(
      child => child.tagName === tagName && child.getAttribute(attribute) === value,
    ) ?? null
  }
}

/** 装上一个干净的 document 桩. */
function mountDocument(): StubDocument {
  const doc = new StubDocument()
  Object.defineProperty(globalThis, 'document', { value: doc, configurable: true })
  return doc
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'document')
})

describe('plugin stylesheet lifecycle', () => {
  it('injects one owned sheet that leaves the scroll chain alone', () => {
    const doc = mountDocument()
    const remove = injectStyles()

    assert.equal(doc.head.children.length, 1)
    const sheet = doc.head.children[0]
    assert.equal(sheet.getAttribute(STYLE_ATTR), STYLE_ID)
    assert.equal(sheet.getAttribute(PLUGIN_ATTR), PLUGIN_ID)
    assert.ok(sheet.textContent.includes('max-height'))
    assert.equal(sheet.textContent.includes('overscroll-behavior'), false)

    remove()
    assert.equal(doc.head.children.length, 0)
  })

  it('replaces a stale sheet instead of stacking a second one', () => {
    const doc = mountDocument()
    const removeFirst = injectStyles()
    const removeSecond = injectStyles()

    assert.equal(doc.head.children.length, 1)
    removeFirst()
    assert.equal(doc.head.children.length, 1)
    removeSecond()
    assert.equal(doc.head.children.length, 0)
  })
})

describe('window lines', () => {
  it('caps the root while lines are positive and drops the cap at zero', () => {
    const doc = mountDocument()
    applyWindowLines(12)
    assert.equal(doc.documentElement.getAttribute(CAPPED_ATTR), '1')
    assert.equal(doc.documentElement.style.values.get(LINES_VAR), '12')

    applyWindowLines(0)
    assert.equal(doc.documentElement.getAttribute(CAPPED_ATTR), null)
    assert.equal(doc.documentElement.style.values.get(LINES_VAR), '0')
  })

  it('restores the root on teardown', () => {
    const doc = mountDocument()
    applyWindowLines(8)
    resetWindowLines()

    assert.equal(doc.documentElement.getAttribute(CAPPED_ATTR), null)
    assert.equal(doc.documentElement.style.values.has(LINES_VAR), false)
  })
})
