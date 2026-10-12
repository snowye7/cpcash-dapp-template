# migrate-to-pharos

基于 Vite、React 和 TypeScript 的项目，已接入 TDesign、TDesign Icons 和 TanStack Query。

## 开发

```bash
pnpm install
pnpm dev
```

## 使用

- 从 `tdesign-react` 导入组件，从 `tdesign-icons-react` 导入图标。TDesign 全局样式已在 `src/main.tsx` 加载。
- `QueryClientProvider` 已在 `src/main.tsx` 挂载。组件内可直接使用 `@tanstack/react-query` 的 `useQuery`、`useMutation` 等 API。
- 若需要在组件外操作缓存，可从 `src/query-client.ts` 导入 `queryClient`。

```tsx
import { useQuery } from "@tanstack/react-query"

const { data, isPending, error } = useQuery({
    queryKey: ["example"],
    queryFn: async () => {
        const response = await fetch("/api/example")
        if (!response.ok) throw new Error("请求失败")
        return response.json()
    },
})
```

## 检查

```bash
pnpm lint
pnpm build
```
