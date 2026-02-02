"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "next-themes"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }){
    // create QueryClient inside component to ensure each request gets its own client
    const [queryClient] = useState(
        () => 
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // default settings for all queries
                        staleTime: 60 * 1000, // data is fresh for 1 minute
                        gcTime: 5 * 60 * 1000, // garbage collection after 5 minutes
                        refetchOnWindowFocus: false, // don't refetch when window regains focus
                        retry: 1 // retry failed requests once
                    },
                    mutations: {
                        // default settings for all mutations
                        retry: 1
                    }
                }
            })
    )

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    )
}