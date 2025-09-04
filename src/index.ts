// Pure ESM implementation with TypeScript types

function generateMask(
  maskLength: number | 'random',
  minLength: number,
  maxLength: number,
  maskChar = '*'
): string {
  let length = maskLength
  if (length === 'random') {
    length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
  }
  return maskChar.repeat(length)
}

function normalizePropertyName(prop: string): string {
  return prop.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export type PropertyMatcher = (
  key: string,
  normalizedKey: string,
  value: any,
  path: Array<string | number>
) => boolean

export interface MaskConfig {
  properties?: string[]
  propertyMatcher?: PropertyMatcher | null
  maskLength?: number | 'random'
  minLength?: number
  maxLength?: number
  maskChar?: string
  fullMask?: boolean | string
}

export type Masker = (
  data: any,
  config?: MaskConfig,
  seen?: WeakMap<any, any>
) => any

export default function maskObject(
  data: any,
  config: MaskConfig = {},
  seen: WeakMap<any, any> = new WeakMap()
) {
  const {
    properties = [
      'password',
      'key',
      'secret',
      'token',
      'privatekey',
      'passphrase'
    ],
    propertyMatcher = null,
    maskLength = 8,
    minLength = 5,
    maxLength = 15,
    maskChar = '*',
    fullMask = false
  } = config

  if (seen.has(data)) {
    return seen.get(data)
  }

  const normalizedProperties = properties.map((p) => normalizePropertyName(p))

  function maskValue(value: string) {
    if (typeof fullMask === 'string') {
      return fullMask
    }
    if (fullMask === true) {
      return maskChar.repeat(value.length)
    }
    return generateMask(maskLength, minLength, maxLength, maskChar)
  }

  function shouldMaskProperty(
    key: string,
    value: any,
    path: Array<string | number> = []
  ) {
    const normalizedKey = normalizePropertyName(key)

    if (propertyMatcher && typeof propertyMatcher === 'function') {
      return propertyMatcher(key, normalizedKey, value, path)
    }

    return normalizedProperties.indexOf(normalizedKey) !== -1
  }

  function processItem(
    item: any,
    isTargetProperty: boolean,
    path: Array<string | number> = []
  ): any {
    if (item == null) {
      return item
    }

    if (typeof item === 'object' && seen.has(item)) {
      return seen.get(item)
    }

    let result: any
    if (Array.isArray(item)) {
      result = []
      seen.set(item, result)

      for (let i = 0; i < item.length; i += 1) {
        const newPath = [...path, i]
        result[i] = processItem(item[i], isTargetProperty, newPath)
      }
    } else if (typeof item === 'object') {
      result = {}
      seen.set(item, result)

      const keys = Object.keys(item)
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i]
        const newPath = [...path, key]
        const shouldMask =
          isTargetProperty ||
          shouldMaskProperty(key, (item as any)[key], newPath)
        ;(result as any)[key] = processItem(
          (item as any)[key],
          shouldMask,
          newPath
        )
      }
    } else if (isTargetProperty && typeof item === 'string') {
      result = maskValue(item)
    } else {
      result = item
    }

    return result
  }

  let result: any
  if (Array.isArray(data)) {
    result = []
    seen.set(data, result)

    for (let i = 0; i < data.length; i += 1) {
      result[i] = processItem(data[i], false, [i])
    }
  } else if (data && typeof data === 'object') {
    result = {}
    seen.set(data, result)

    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      const shouldMask = shouldMaskProperty(key, (data as any)[key], [key])
      ;(result as any)[key] = processItem((data as any)[key], shouldMask, [key])
    }
  } else {
    result = data
  }

  return result
}
