# Base Rules

- 永远使用中文回复
- 禁止修改 `node_modules` 文件夹中的任何文件
- 当我让你修复一个问题，而你尝试一次或多次修复失败后，我会在每次失败修复后的问题现象再次反馈给你，在进行下一次修复之前，你必须思考之前所有的修复是否还有必要，是否需要先撤回之前的修复，然后再进行修复
- 尽量使用 `interface` 而不是 `type`，函数类型除外
- 所有的类型定义都使用 `export` 导出
- 如果某一个属性的类型是 `[key]: someType | null`，请将它改写为 `[key]?: someType`，尽量不要使用 `null` 类型
- 禁止使用字面量类型，必须使用独立的类型定义，比如:

    ```typescript
    export interface Student {
        father: {
            name: string
            age: number
        }
    }
    ```

    你应该将 `Father` 类型独立出来，而不是使用字面量类型:

    ```typescript
    export interface Father {
        name: string
        age: number
    }

    export interface Student {
        father: Father
    }
    ```

- 尽量为代码添加注释，尽量使用 `//` 而不是 `/** */`
- 但是对于变量名、函数名、类型名、属性等具有明确意义的名称，使用 `/** 名称的作用 */` 进行注释
- 尽量使用 `const` 而不是 `let`，除非需要使用 `let` 的特性
- 尽量使用 `function` 而不是 `() => {}` 声明函数，除非是直接传递的回调函数或者 `React` 函数式组件
- 尽量使用 `"` 而不是 `'`，除非是 `"` 中包含 `'`
- 尽量不要使用 `;` 进行结尾
- 尽量使用模板字符串而不是 `+` 进行字符串拼接
- 中文和英文之间加一个空格
- 不需要为类型文件单独生成一个 `types/index.ts` 文件，而是直接在需要使用的地方进行类型声明并且导出
- 当你使用 `@tanstack/react-query` 的 `useQuery` 时，请使用函数名的烤肉串命名法和参数组成 `key`，例如 `queryKey: ["query-book", queryParams]`；具体封装方式见下方「API 与 TanStack Query 规则」
- 当你使用 `@tanstack/react-query` 的 `useMutation` 时，使用返回值必须进行解构和重命名，例如 `const { mutateAsync: submitBookAsync } = useSubmitBook()`
- 函数的参数数量尽量控制在 2 个以内，如果超过 2 个，请使用对象形式的参数，参数类型名称使用函数名的大驼峰 + `Params` 后缀，例如 `QueryBookParams`
- 尽量直接从模块中导入方法，而不是使用 `默认导出.方法` 的形式

    ```typescript
    // 而不是使用 默认导出.方法 的形式
    import fs from "fs/promises"

    fs.readFile
    ```

- 如果某个方法存在同步和异步两种形式，你应该尽量使用异步形式，而不是同步形式，比如读取文件，你应该尽量使用 `fs/promises` 提供的 `readFile` 方法，而不是 `fs` 提供的 `readFileSync` 方法
- 在 `Node.js` 中，你应该尽量使用模块的 `Promise` 版本，而不是回调版本，比如读取文件，你应该尽量使用 `fs/promises` 提供的 `readFile` 方法，而不是 `fs` 提供的 `readFile` 方法
- 涉及到文件读写操作时，尽量使用 `fs` 提供的 `createReadStream` 或者 `createWriteStream` 的方式来实现，而不是一次性读取所有内容
- `Web API` 中的 `ReadableStream` 可以使用以下方法转换为 `Node.js` 中的 `Readable`:

    ```typescript
    import { Readable } from "stream"
    import { ReadableStream } from "stream/web"

    // 这里的 webStream 是 Web API 中的 ReadableStream
    const webStream = someWebApi()

    // 将 Web API 中的 ReadableStream 转换为 Node.js 中的 Readable
    const nodeStream = Readable.fromWeb(webStream as ReadableStream)
    ```

    `Web API` 中的 `WritableStream` 转换为 `Node.js` 中的 `Writable` 的方法同理

- 严格区分中英文标点符号，不要混用，如果用户混用了，你应该提示用户使用正确的标点符号
- 当使用网络请求时，请使用 `@/utils/request` 中的 `request` 方法，而不是在业务代码中直接使用 `fetch`；`request` 方法与 `fetch` 的调用方法基本一致
- 当你需要进行包管理相关的操作时，比如安装、更新、卸载、执行 `package.json` 中的脚本或者 `npx` 执行某个命令时，请检查当前项目中的 `lock` 文件，如果是 `bun.lock`，你应该使用 `bun` 进行包管理，如果是 `package-lock.json`，你应该使用 `npm` 进行包管理，如果是 `yarn.lock`，你应该使用 `yarn` 进行包管理，如果是 `pnpm-lock.yaml`，你应该使用 `pnpm` 进行包管理，如果同时存在多个 `lock` 文件，优先级为 `bun` > `pnpm` > `yarn` > `npm`
- 请不要使用 `enum` 来声明枚举，而是使用以下方式声明：

    ```typescript
    export const Gender = {
        男: "male",
        女: "female",
    } as const

    export type Gender = (typeof Gender)[keyof typeof Gender]
    ```

- 在创建 `git` 提交记录，必须使用 `[emoji] [type]: 具体内容`的格式进行提交，具体内容使用中文，以下是预设的 `emoji` 和 `type`：

    ```text
    ✨ feature: Select when creating new things
    🐞 fix: Select when fixing a bug
    📝 docs: Select when editing documentation
    💻 wip: Select when work is not finished
    🚄 perfs: Select when working on performances
    ⏪ rollback:Select when undoing something
    🔵 other: Select when fixing a bug
    ```

    你必须使用预设的 `emoji` 和 `type`。如果你的提交记录包含了多种内容，你可以使用多行比如：

    ```text
    ✨ feature: some feature u did
    🐞 fix: some bug u fixed
    ```

- 除了 `React` 组件和页面以外所有的导出必须使用 `export` 关键字导出，不要使用 `export default` 关键字导出

- 当一个文件中需要导出多个 `React` 组件时，主组件必须使用 `export default` 关键字导出，其他组件必须使用 `export` 关键字导出

# React Rules

## 规则

- 生成 `React` 组件时，尽量使用函数式组件，而不是类组件

- 禁止使用 `<></>`，必须使用从 `React` 导入的 `Fragment` 组件

- 组件的 `props` 书写的优先级为：身份属性 (`ref`、`key`、`id`) > 样式属性 (`className`、`classNames`、`style`、`size` 等等) > 其他属性 (`value`、`defaultValue` 等等) > 回调事件 (`onClick`、`onChange` 等等)

- 请始终使用 `on` + 事件名作为事件处理函数的名称，比如 `onClick` 事件处理函数应该命名为 `onClick`，而不是 `handleClick`

- 你应该将根组件的 `props` 当做基础的 `props` 类型，将当前组件所需的原始数据当做 `data` 属性

    ```tsx
    import { clsx } from "@/utils/clsx"
    import { ComponentProps, FC } from "react"

    export interface Book {
        id: string
        name: string
        isbn: string
    }

    export interface BookProps extends Omit<ComponentProps<"div">, "children"> {
        data?: Book
    }

    const Book: FC<BookProps> = ({ className, data, ...rest }) => (
        <div className={clsx("container", className)} {...rest}>
            <div>{data?.name}</div>
            <div>{data?.isbn}</div>
        </div>
    )

    export default Book
    ```

    因为 `Book` 组件的根元素是 `div`，所以 `BookProps` 类型应该继承自 `Omit<ComponentProps<"div">, "children">`。如果根组件不是 HTML 元素，例如 `Container`，则继承自 `Omit<ComponentProps<typeof Container>, "children">`；如果已有 `ContainerProps`，则可以继承自 `Omit<ContainerProps, "children">`

    `data` 属性是指整个项目中某种数据的原始类型，例如从 `queryBook` 接口等 api 函数中获取到的数据，这时 `data` 的类型就是 `Book` 类型

- 尽量直接在函数式组件的参数中解构 `props`，获取需要使用的属性，将剩余的属性作为 `rest` 属性

- 如果你需要根组件设置 `className`，请使用从 `@/utils/clsx` 中导入的 `clsx` 函数来合并 `className`，例如上方的：

    ```tsx
    return (
        <div className={clsx("container", className)} {...rest}>
            ...
        </div>
    )
    ```

- 如果组件是一个受控组件，请使用 `value` 和 `onValueChange` 来实现受控组件，这两个属性都应该是可选，例如：

    ```tsx
    import { ComponentProps, FC } from "react"

    export interface MyInputProps extends Omit<ComponentProps<typeof OtherInput>, "value" | "onValueChange"> {
        value?: string
        onValueChange?: (value: string) => void
    }

    const MyInput: FC<MyInputProps> = ({ value, onValueChange, ...rest }) => {
        return <OtherInput value={value} onValueChange={onValueChange} {...rest} />
    }

    export default MyInput
    ```

- 如果你需要使用 `React` 中的某个导入，请使用 `import { xxx } from "react"` 而不是 `React.xxx` 的形式，如果已经存在同名的变量或者类型，请使用 `import { xxx as reactXxx } from "react"`，变量使用小驼峰命名，类型使用大驼峰命名

- 如果你需要在组件内部添加一个事件处理函数，而组件的 `props` 中存在同名的事件处理函数，你应该这样处理：

    ```tsx
    // 因为 global 中存在 MouseEvent 类型，与 react 中的 MouseEvent 类型冲突，所以需要将 react 中的 MouseEvent 类型重命名为 ReactMouseEvent
    import { ComponentProps, FC, MouseEvent as ReactMouseEvent } from "react"

    export interface AppProps extends Omit<ComponentProps<"div">, "children"> {}

    // 将 props 中的同名事件处理函数加一个下划线前缀
    const App: FC<AppProps> = ({ onClick: _onClick, ...rest }) => {
        function onClick(event: ReactMouseEvent<HTMLDivElement, MouseEvent>) {
            // 优先处理内部逻辑
            console.log("onClick")

            // 然后调用外部的事件处理函数
            _onClick?.(event)
        }

        return (
            <div onClick={onClick} {...rest}>
                Hello World!
            </div>
        )
    }

    export default App
    ```

- 如果你的组件内部没有任何逻辑，只有 `return` 一个组件，请直接返回该组件，不要使用 `return` 关键字，例如：

    ```tsx
    const App: FC<AppProps> = ({ className, ...rest }) => (
        <div className={clsx("container", className)} {...rest}>
            Hello World!
        </div>
    )
    ```

- 当你在组件内部需要获取根组件的 `ref`，而 `props` 中也有 `ref` 属性时，你应该这样处理：

    ```tsx
    const App: FC<AppProps> = ({ ref, ...rest }) => {
        const container = useRef<HTMLDivElement>(null)

        useImperativeHandle(ref, () => container.current!)

        return (
            <div ref={container} {...rest}>
                Hello World!
            </div>
        )
    }
    ```

- 如果组件没有 `children`，请使用自闭合标签，例如 `<div />` 而不是 `<div></div>`

- 如果 jsx 中某个元素的属性（非 `children` 属性）的类型为回调函数，并且这个回调函数无法使用一行代码完成，请使用 `function` 关键字声明一个函数，然后传递给该属性，例如：

    ```tsx
    const App: FC<AppProps> = ({ className, ...rest }) => {
        function onClick(event: ReactMouseEvent<HTMLDivElement, MouseEvent>) {
            console.log("onClick")
            doSomething()
        }

        return (
            <div onClick={onClick} {...rest}>
                Hello World!
            </div>
        )
    }
    ```

- 当前项目使用 TDesign。优先从 `tdesign-react` 导入组件、从 `tdesign-icons-react` 导入图标；全局样式已在 `src/main.tsx` 中引入

## 组件与页面

请遵循以下规则生成组件或页面，并在新增时考虑复用与抽取：

1. 先分析页面结构，识别重复的 UI 片段与逻辑，并判断是否值得抽取。不要为了抽取而抽取，优先考虑维护成本。
2. 抽取的组件应该放在公共的 `@/components` 目录下，工具函数应该放在公共的 `@/utils` 目录下，禁止放在其他目录下。
3. 新增组件或页面前，检查已有目录（尤其是 `@/components` 与 `@/utils`）是否已有可复用实现，优先复用而非重复创建。
4. 抽取时保持原有 UI 风格与交互一致，避免引入不必要的样式或行为变化。
5. 组件拆分要能提升可读性与可测试性；若拆分后跨文件沟通成本增加，则保留在原文件。
6. 对抽取出的组件与工具，提供清晰的 props 或函数签名与命名，便于后续维护与扩展。

# API 与 TanStack Query 规则

当前项目已在 `src/main.tsx` 挂载 `QueryClientProvider`，共享实例位于 `src/query-client.ts`。

- 每个接口放在 `src/api/<接口函数名>.ts` 中，文件名与导出的请求函数名一致。接口文件同时导出该接口所需的数据类型和 Query 或 Mutation Hook；按需直接从文件导入，不必为类型另建 `types/index.ts`。
- 请求函数使用具名导出的 `async function`，显式声明参数类型和 `Promise<响应类型>`，统一调用 `@/utils/request` 的 `request`。HTTP 方法显式写在选项里：查询参数放 `search`，JSON 请求体放 `body`，路径变量用 `encodeURIComponent` 编码。`request` 已处理 JSON 响应的 `code`、`msg`、`data`、鉴权和错误提示，业务接口不再重复解析响应包。
- 与后端字段保持一致；请求体类型可使用 `XxxIn`，响应类型可使用 `XxxOut` 或 `XxxResp`，筛选或分页参数使用 `XxxParams`。复用已有响应类型，不重复声明同一数据结构。可选查询字段仅在有值时加入 `search`，不要把 `undefined` 序列化为字符串。
- 用 `useQuery` 封装读取型接口，用 `useMutation` 封装提交、修改、删除及需要按用户操作即时触发的接口。判断依据是调用和缓存语义，不能只根据 HTTP 方法：源项目的 POST 列表查询仍使用 `useQuery`，GET 登录 Nonce 则使用 `useMutation`；同一读取接口确有自动查询和按需触发两种场景时，可分别提供 Query Hook 与 `XxxMutation` Hook。
- Query Hook 通常以 `use` 加接口函数名的大驼峰形式命名，例如 `useListItems`；首个参数传接口参数，第二个可选参数传 Query 选项。无接口参数时只接收可选选项。`queryKey` 第一项为接口函数名的烤肉串形式，后续项包含所有影响结果的参数，例如 `["list-items", params]`；无参数时只保留第一项。`queryFn` 调用对应的请求函数。允许调用方通过选项设置 `enabled`、`refetchInterval` 等。
- Mutation Hook 通常以 `use` 加接口函数名的大驼峰形式命名；需要区分用途时可加业务后缀或 `Mutation` 后缀。`mutationKey` 为函数名的烤肉串形式，`mutationFn` 直接指向请求函数；其唯一可选参数为 Mutation 选项。组件调用后，解构并按业务动作重命名 `mutate` 或 `mutateAsync`，按需重命名 `isPending` 等状态，避免多个 Hook 的字段混淆。
- Hook 选项类型分别使用 `Omit<UseQueryOptions<响应类型, Error>, "queryFn" | "queryKey">` 和 `Omit<UseMutationOptions<响应类型, Error, 请求参数类型>, "mutationFn" | "mutationKey">`，在默认配置之后展开 `...(options ?? {})`。无参数 Mutation 的请求参数类型用 `void`。
- 在使用接口的组件中处理成功后的相关数据刷新，可通过 `onSuccess` 中的 `refetch` 或 `queryClient.invalidateQueries` 更新受影响的查询；不要把所有变更都写成全局清缓存。组件内用 `useQueryClient()`，组件外需要操作缓存时导入 `src/query-client.ts` 中的 `queryClient`。

查询接口的写法示例：

```typescript
import { request } from "@/utils/request"
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

export interface ItemResp {
    id: number
    name: string
}

export interface ListItemsParams {
    page?: number
}

export async function listItems(search?: ListItemsParams): Promise<ItemResp[]> {
    return await request("/api/items", { search })
}

export function useListItems(params?: ListItemsParams, options?: Omit<UseQueryOptions<ItemResp[], Error>, "queryFn" | "queryKey">) {
    return useQuery({
        queryKey: ["list-items", params],
        queryFn: () => listItems(params),
        ...(options ?? {}),
    })
}
```

变更接口的写法示例：

```typescript
import { request } from "@/utils/request"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"

export interface CreateItemIn {
    name: string
}

export interface CreateItemOut {
    id: number
    name: string
}

export async function createItem(data: CreateItemIn): Promise<CreateItemOut> {
    return await request("/api/items", { method: "POST", body: data })
}

export function useCreateItem(options?: Omit<UseMutationOptions<CreateItemOut, Error, CreateItemIn>, "mutationFn" | "mutationKey">) {
    return useMutation({
        mutationKey: ["create-item"],
        mutationFn: createItem,
        ...(options ?? {}),
    })
}
```
