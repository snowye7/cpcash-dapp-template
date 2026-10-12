import { getToken, removeToken } from "@/utils/cookieStorage"
import { getErrorMessage, isPlainObject } from "@/utils/getErrorMessage"
import { MessagePlugin } from "tdesign-react"

export interface ResponseData {
    json: any
    blob: Blob
    text: string
    arrayBuffer: ArrayBuffer
    formData: FormData
    stream: Response
}

export type ResponseType = keyof ResponseData

export interface RequestOptions<T extends ResponseType = "json"> extends Omit<RequestInit, "body" | "method"> {
    method?: "GET" | "POST" | "DELETE" | "HEAD" | "OPTIONS" | "PUT" | "PATCH" | "CONNECT" | "TRACE" | (string & {})
    /**
     * 响应的数据类型，默认 json
     * @default "json"
     */
    type?: T
    base?: string | URL
    body?: BodyInit | Record<string, any> | any[]
    search?: (string | number | boolean)[][] | Record<string, string | number | boolean> | string | URLSearchParams
}

export async function request<T extends ResponseType = "json">(input: string | URL, options?: RequestOptions<T>): Promise<ResponseData[T]> {
    let { headers, type = "json", body, base, search, method, ...rest } = options ?? {}
    // 开发环境可以继续通过环境变量直连后端，生产环境默认请求当前站点，由 Nginx 转发 API
    const defaultBase = import.meta.env.VITE_API_URL || location.origin
    const url = new URL(input, typeof input === "string" ? (base ?? defaultBase) : undefined)

    if (search) {
        if (Array.isArray(search)) search = search.map(item => item.map(i => String(i)))
        if (isPlainObject(search)) search = Object.entries(search).map(([key, value]) => [key, String(value)])
        search = new URLSearchParams(search as any)
        if (url.search) url.search = `${url.search}&${search.toString()}`
        else url.search = search.toString()
    }

    if (type !== "json" && type !== "blob" && type !== "text" && type !== "arrayBuffer" && type !== "formData" && type !== "stream")
        throw new Error(`Invalid response type: ${type}`)

    headers = new Headers(headers)

    if (typeof input === "string" && !base) {
        const token = getToken()

        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
    }

    if (body && (isPlainObject(body) || Array.isArray(body))) {
        headers.set("Content-Type", "application/json")
        method ??= "POST"
        body = JSON.stringify(body)
    }

    try {
        const response = await fetch(url, { headers, body, method, ...rest } as RequestInit)
        switch (type) {
            case "json":
                const result = await response.json()
                if (result.code === 401) {
                    removeToken()
                    location.href = `/login?from=${encodeURIComponent(`${location.pathname}${location.search}`)}`
                }
                if (result.code !== 0) {
                    throw new Error(result.msg ?? "接口请求失败")
                }
                return result.data
            case "blob":
                return await response.blob()
            case "text":
                return await response.text()
            case "arrayBuffer":
                return await response.arrayBuffer()
            case "formData":
                return await response.formData()
            case "stream":
                return response
        }
    } catch (error) {
        MessagePlugin.error(getErrorMessage(error))
        throw error
    }
}
