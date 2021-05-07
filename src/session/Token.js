export class Token {
  static get() {
    return localStorage.getItem('token')
  }

  static set(token) {
    return localStorage.setItem('token', token)
  }

  static reset() {
    localStorage.removeItem('token')
  }
}