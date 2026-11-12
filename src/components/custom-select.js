/*
Component: custom-select
Webflow attribute: data-component="custom-select" (on a native Webflow Select field or its field wrapper)
*/

import '../styles/custom-select.css'

let uid = 0

/**
 * Replaces the look of a native <select> with a dropdown styled like the nav
 * dropdown (white card, lime highlight). The native select stays in the form
 * (visually hidden), keeps its name/value and the browser `required`
 * validation, so Webflow form submission works unchanged.
 * Keyboard: Enter/Space/Arrows open, Arrows/Home/End move, Enter/Space pick,
 * Escape/Tab close, typing a letter jumps to the first matching option.
 * @param {HTMLElement[]} elements - All elements matching [data-component='custom-select']
 */
export default function (elements) {
  elements.forEach((el) => {
    // The attribute can sit on the <select> or on its field wrapper
    const select = el.tagName === 'SELECT' ? el : el.querySelector('select')
    if (!select) {
      console.warn('[custom-select] No <select> found', el)
      return
    }
    if (select.closest('[data-cs]')) return

    const id = `cs-${++uid}`
    const options = Array.from(select.options)
    // An option with an empty value is the placeholder, not a choice
    const placeholder = options.find((o) => o.value === '')
    const choices = options.filter((o) => o.value !== '')

    // ── Build ───────────────────────────────────────────────────────
    const root = document.createElement('div')
    root.setAttribute('data-cs', '')
    select.parentNode.insertBefore(root, select)
    root.appendChild(select)
    select.setAttribute('data-cs-native', '')
    select.tabIndex = -1
    select.setAttribute('aria-hidden', 'true')

    const trigger = document.createElement('button')
    trigger.type = 'button'
    // Reuse the Webflow input classes so the closed state matches the inputs
    trigger.className = select.className
    trigger.setAttribute('data-cs-trigger', '')
    trigger.setAttribute('role', 'combobox')
    trigger.setAttribute('aria-haspopup', 'listbox')
    trigger.setAttribute('aria-expanded', 'false')
    trigger.setAttribute('aria-controls', `${id}-list`)
    trigger.id = `${id}-trigger`

    // Point the field label at the button instead of the hidden select
    const label = select.id
      ? document.querySelector(`label[for='${select.id}']`)
      : null
    if (label) {
      if (!label.id) label.id = `${id}-label`
      label.setAttribute('for', trigger.id)
      trigger.setAttribute('aria-labelledby', `${label.id} ${trigger.id}`)
    }

    const value = document.createElement('span')
    value.setAttribute('data-cs-value', '')
    const icon = document.createElement('span')
    icon.setAttribute('data-cs-icon', '')
    icon.setAttribute('aria-hidden', 'true')
    trigger.append(value, icon)

    const list = document.createElement('ul')
    list.id = `${id}-list`
    list.setAttribute('role', 'listbox')
    list.setAttribute('data-cs-list', '')
    list.tabIndex = -1
    if (label) list.setAttribute('aria-labelledby', label.id)

    const highlight = document.createElement('li')
    highlight.setAttribute('data-cs-highlight', '')
    highlight.setAttribute('aria-hidden', 'true')
    highlight.setAttribute('role', 'presentation')
    list.appendChild(highlight)

    const items = choices.map((option, i) => {
      const li = document.createElement('li')
      li.id = `${id}-opt-${i}`
      li.setAttribute('role', 'option')
      li.setAttribute('data-cs-option', '')
      li.setAttribute('aria-selected', 'false')
      li.style.setProperty('--i', i)
      li.dataset.value = option.value
      const text = document.createElement('span')
      text.setAttribute('data-cs-text', '')
      text.textContent = option.textContent
      li.appendChild(text)
      list.appendChild(li)
      return li
    })

    root.append(trigger, list)

    // ── State ───────────────────────────────────────────────────────
    let active = -1

    const render = () => {
      const current = choices.findIndex((o) => o.value === select.value)
      value.textContent =
        current > -1
          ? choices[current].textContent
          : placeholder
            ? placeholder.textContent
            : ''
      root.toggleAttribute('data-cs-empty', current === -1)
      items.forEach((li, i) =>
        li.setAttribute('aria-selected', String(i === current))
      )
    }

    const moveHighlight = (li) => {
      if (!li) {
        highlight.removeAttribute('data-visible')
        return
      }
      const snap = !highlight.hasAttribute('data-visible')
      highlight.toggleAttribute('data-snap', snap)
      highlight.style.setProperty('--hl-y', `${li.offsetTop}px`)
      highlight.style.setProperty('--hl-h', `${li.offsetHeight}px`)
      highlight.setAttribute('data-visible', '')
      if (snap) {
        requestAnimationFrame(() => highlight.removeAttribute('data-snap'))
      }
    }

    const setActive = (index) => {
      active = Math.max(0, Math.min(items.length - 1, index))
      items.forEach((li, i) => li.toggleAttribute('data-active', i === active))
      const li = items[active]
      trigger.setAttribute('aria-activedescendant', li.id)
      moveHighlight(li)
      // Keep the active option in view when the list scrolls
      const top = li.offsetTop
      const bottom = top + li.offsetHeight
      if (top < list.scrollTop) list.scrollTop = top
      else if (bottom > list.scrollTop + list.clientHeight)
        list.scrollTop = bottom - list.clientHeight
    }

    const isOpen = () => root.hasAttribute('data-cs-open')

    const open = () => {
      if (isOpen()) return
      root.setAttribute('data-cs-open', '')
      trigger.setAttribute('aria-expanded', 'true')
      const current = choices.findIndex((o) => o.value === select.value)
      requestAnimationFrame(() => setActive(current > -1 ? current : 0))
      document.addEventListener('pointerdown', onOutside)
    }

    const close = (focus = false) => {
      if (!isOpen()) return
      root.removeAttribute('data-cs-open')
      trigger.setAttribute('aria-expanded', 'false')
      trigger.removeAttribute('aria-activedescendant')
      items.forEach((li) => li.removeAttribute('data-active'))
      moveHighlight(null)
      document.removeEventListener('pointerdown', onOutside)
      if (focus) trigger.focus()
    }

    const choose = (index) => {
      const option = choices[index]
      if (!option) return
      if (select.value !== option.value) {
        select.value = option.value
        select.dispatchEvent(new window.Event('input', { bubbles: true }))
        select.dispatchEvent(new window.Event('change', { bubbles: true }))
      }
      render()
      close(true)
    }

    function onOutside(e) {
      if (!root.contains(e.target)) close()
    }

    // ── Events ──────────────────────────────────────────────────────
    trigger.addEventListener('click', () => (isOpen() ? close() : open()))

    let typed = ''
    let typedTimer
    trigger.addEventListener('keydown', (e) => {
      const key = e.key
      if (!isOpen()) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
          e.preventDefault()
          open()
        }
        return
      }
      if (key === 'ArrowDown') {
        e.preventDefault()
        setActive(active + 1)
      } else if (key === 'ArrowUp') {
        e.preventDefault()
        setActive(active - 1)
      } else if (key === 'Home') {
        e.preventDefault()
        setActive(0)
      } else if (key === 'End') {
        e.preventDefault()
        setActive(items.length - 1)
      } else if (key === 'Enter' || key === ' ') {
        e.preventDefault()
        choose(active)
      } else if (key === 'Escape') {
        e.preventDefault()
        close(true)
      } else if (key === 'Tab') {
        close()
      } else if (key.length === 1) {
        // Type-ahead: jump to the first option starting with the typed text
        typed += key.toLowerCase()
        clearTimeout(typedTimer)
        typedTimer = setTimeout(() => (typed = ''), 600)
        const match = choices.findIndex((o) =>
          o.textContent.trim().toLowerCase().startsWith(typed)
        )
        if (match > -1) setActive(match)
      }
    })

    items.forEach((li, i) => {
      li.addEventListener('pointerenter', () => setActive(i))
      li.addEventListener('click', () => choose(i))
    })
    list.addEventListener('pointerleave', () => {
      if (active > -1) moveHighlight(items[active])
    })

    // Browser validation (required) fires on the hidden select: flag the
    // trigger so the error state is visible, and clear it once a value is set
    select.addEventListener('invalid', () => {
      root.setAttribute('data-cs-invalid', '')
      trigger.focus()
    })
    select.addEventListener('change', () => {
      root.removeAttribute('data-cs-invalid')
      render()
    })
    // Webflow resets the form after a successful submit
    select.form &&
      select.form.addEventListener('reset', () => setTimeout(render, 0))

    render()
  })
}
