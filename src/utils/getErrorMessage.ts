import { BaseError } from "viem"

export interface PlainObject {
    [key: string]: unknown
}

export interface ErrorLike {
    message?: unknown
    error?: unknown
    data?: unknown
    response?: unknown
}

export interface ErrorKeyInfo {
    /** 错误名称 */
    name: string
    /** 错误消息 */
    message: string
    /** 错误堆栈 */
    stack?: string
}

export interface ViemBaseErrorKeyInfo extends ErrorKeyInfo {
    /** Viem 短错误消息 */
    shortMessage: string
    /** Viem 错误详情 */
    details?: string
    /** Viem 文档路径 */
    docsPath?: string
    /** Viem 元信息消息 */
    metaMessages?: string[]
    /** Viem 版本 */
    version: string
    /** 原始错误原因 */
    cause?: unknown
}

export function isPlainObject(value: unknown): value is PlainObject {
    if (Object.prototype.toString.call(value) !== "[object Object]") {
        return false
    }

    const prototype = Object.getPrototypeOf(value)
    return prototype === null || prototype === Object.prototype
}

export function getErrorKeyInfo(error: Error): ErrorKeyInfo {
    const info: ErrorKeyInfo = {
        message: error.message,
        name: error.name,
    }

    if (typeof error.stack === "string") {
        info.stack = error.stack
    }

    return info
}

export function getViemBaseErrorKeyInfo(error: BaseError): ViemBaseErrorKeyInfo {
    const info: ViemBaseErrorKeyInfo = {
        message: error.message,
        name: error.name,
        shortMessage: error.shortMessage,
        version: error.version,
    }

    if (typeof error.details === "string" && error.details) {
        info.details = error.details
    }

    if (typeof error.docsPath === "string" && error.docsPath) {
        info.docsPath = error.docsPath
    }

    if (Array.isArray(error.metaMessages) && error.metaMessages.length > 0) {
        info.metaMessages = error.metaMessages
    }

    if (typeof error.stack === "string") {
        info.stack = error.stack
    }

    if (error.cause instanceof BaseError) {
        info.cause = getViemBaseErrorKeyInfo(error.cause)
    } else if (error.cause instanceof Error) {
        info.cause = getErrorKeyInfo(error.cause)
    } else if (error.cause) {
        info.cause = error.cause
    }

    return info
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof BaseError) {
        const info = getViemBaseErrorKeyInfo(error)
        console.error("Viem BaseError", info)

        return error.shortMessage || error.message || error.details
    }

    if (typeof error === "string") {
        return error
    }

    if (error instanceof Error) {
        return error.message
    }

    if (isPlainObject(error)) {
        if (typeof error.message === "string") {
            return error.message
        }

        if (typeof error.error === "string") {
            return error.error
        }

        if (isPlainObject(error.data) && typeof error.data.message === "string") {
            return error.data.message
        }

        if (isPlainObject(error.response) && isPlainObject(error.response.data) && typeof error.response.data.message === "string") {
            return error.response.data.message
        }
    }

    return "请求失败"
}
