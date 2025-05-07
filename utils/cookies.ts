type CookieOptions = {
  path?: string
  maxAge?: number
  secure?: boolean
  httpOnly?: boolean
}

export class Cookies {
  private isServer: boolean

  constructor() {
    this.isServer = typeof window === "undefined"
  }

  get(name: string): string | undefined {
    if (this.isServer) return undefined

    try {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(";").shift() as string)
      return undefined
    } catch (error) {
      console.error("Error getting cookie:", error)
      return undefined
    }
  }

  set(name: string, value: string, options: CookieOptions = {}): void {
    if (this.isServer) return

    try {
      let cookie = `${name}=${encodeURIComponent(value)}`

      if (options.path) {
        cookie += `; path=${options.path}`
      }
      if (options.maxAge) {
        cookie += `; max-age=${options.maxAge}`
      }
      if (options.secure) {
        cookie += "; secure"
      }
      if (options.httpOnly) {
        console.warn("httpOnly flag is not supported in client-side cookies.")
      }

      document.cookie = cookie
    } catch (error) {
      console.error("Error setting cookie:", error)
    }
  }

  remove(name: string, path?: string): void {
    if (this.isServer) return

    try {
      document.cookie = `${name}=; max-age=0; path=${path || "/"}`
    } catch (error) {
      console.error("Error removing cookie:", error)
    }
  }
}

export const cookies = new Cookies()
