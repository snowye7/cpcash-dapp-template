import Cookies from "js-cookie"

/** 登录 JWT Cookie 名称 */
export const LoginCookieKey = "app-jwt"

/** 登录 JWT 默认有效期秒数 */
export const LoginTokenDefaultExpiresIn = 12 * 60 * 60

/** 设置登录 Cookie */
export function setToken(token: string, expiresIn = LoginTokenDefaultExpiresIn): void {
    const expires = new Date(Date.now() + Math.max(expiresIn, 0) * 1000)

    Cookies.set(LoginCookieKey, token, {
        expires,
        path: "/",
        sameSite: "lax",
    })
}

/** 获取登录 Cookie */
export function getToken(): string | undefined {
    return Cookies.get(LoginCookieKey)
}

/** 删除登录 Cookie */
export function removeToken(): void {
    Cookies.remove(LoginCookieKey, {
        path: "/",
        sameSite: "lax",
    })
}
