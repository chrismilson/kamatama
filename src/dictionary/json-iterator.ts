/**
 * Fetches a json file and iterates over all of the base objects.
 *
 * This parser is opinionated and makes assumptions about the data. Make sure
 * you understand how it works before you go ahead and copy/paste it into your
 * own project.
 *
 * @param url The url of the external json file
 */
export default async function* jsonIterator<T = any>(url: string) {
  const decoder = new TextDecoder('utf-8')

  const reader = (await fetch(url)).body?.getReader()
  if (!reader) {
    return
  }

  // Counts the number of un-closed, open braces.
  let open = 0

  // A flag that reveals whether we are currently within a string.
  let inString = false

  // The start of a yet unclosed JSON object.
  let remaining = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }
    const chunk = value ? decoder.decode(value) : ''
    let lastBase = -1
    const result: T[] = []

    for (let i = 0; i < chunk.length; i++) {
      if (inString) {
        if (chunk[i] === '"') {
          inString = false
        } else if (chunk[i] === '\\') {
          i += 1
        }
      } else if (chunk[i] === '"') {
        inString = true
      } else if (chunk[i] === '{') {
        if (open === 0) {
          lastBase = i
        }
        open += 1
      } else if (chunk[i] === '}') {
        open -= 1
        if (open === 0) {
          if (lastBase < 0) {
            const s = remaining + chunk.substring(0, i + 1)
            try {
              result.push(JSON.parse(remaining + chunk.substring(0, i + 1)))
            } catch (e) {
              console.log(s)
              return
            }
          } else {
            const s = chunk.substring(lastBase, i + 1)
            try {
              result.push(JSON.parse(chunk.substring(lastBase, i + 1)))
            } catch (e) {
              console.log(s)
              return
            }
          }
        }
      }
    }

    yield result

    if (open > 0) {
      if (lastBase < 0) {
        remaining += chunk
      } else {
        remaining = chunk.substring(lastBase)
      }
    }
  }
}
