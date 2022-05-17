/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function valueMap(list, val, labelKey = 'label', valKey = 'value') {
  if (!Array.isArray(list)) return null
  const item = list.find(el => val === el[valKey])
  if (item) {
    return item[labelKey]
  } else {
    return null
  }
}

export function arrValues(list, valKey = 'value') {
  if (!Array.isArray(list)) return null
  const arr = list.map(item => item[valKey])
  return arr
}

export function dictionary2Map(dc) {
  const obj = {}
  if (!Object.keys(dc).length) return {}
  for (const key in dc) {
    if (Object.hasOwnProperty.call(dc, key)) {
      obj[key] = {}
      ;(dc[key] || []).forEach(item => {
        obj[key][item.value] = item.label
      })
    }
  }
  return obj
}

// 去掉对象中所有自有属性的字符串前后空格
export function objectTrim(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] instanceof Object && !(obj[key] instanceof Array)) {
        objectTrim(obj[key])
      } else {
        typeof obj[key] === 'string' && (obj[key] = obj[key].trim())
      }
    }
  }
  return obj
}
