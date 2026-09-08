import { isNearBottom } from '../shared.ts'

/** 正在流式输出且已展开的 Think 体. */
const BODY_SELECTOR = [
  '[data-variant="think"][data-expanded][data-state="running"]',
  '[data-open] > :not([data-disclosure-row])',
].join(' ')

/**
 * 跟随流式思维链: 用户贴着底部时自动滚到最新行, 上翻则暂停, 回到底部再恢复.
 * 不移动 React 拥有的行节点, 只改 thinkBody 的 scrollTop.
 * @returns 取消观察与监听的 disposer.
 */
export function startThinkFollow(): () => void {
  if (typeof document === 'undefined' || document.body === null) return () => {}

  const following = new WeakMap<HTMLElement, boolean>()
  let frame = 0

  const scan = (): void => {
    const bodies = document.querySelectorAll(BODY_SELECTOR)
    for (let i = 0; i < bodies.length; i++) {
      const node = bodies.item(i)
      if (!(node instanceof HTMLElement)) continue
      if (following.get(node) === false) continue
      following.set(node, true)
      node.scrollTop = node.scrollHeight
    }
  }

  const schedule = (): void => {
    if (frame !== 0) return
    frame = requestAnimationFrame(() => {
      frame = 0
      scan()
    })
  }

  const onScroll = (event: Event): void => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    if (!target.matches(BODY_SELECTOR)) return
    following.set(
      target,
      isNearBottom(target.scrollTop, target.scrollHeight, target.clientHeight),
    )
  }

  scan()
  const observer = new MutationObserver(() => {
    schedule()
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  })
  document.addEventListener('scroll', onScroll, true)

  return () => {
    observer.disconnect()
    document.removeEventListener('scroll', onScroll, true)
    if (frame !== 0) cancelAnimationFrame(frame)
    frame = 0
  }
}
