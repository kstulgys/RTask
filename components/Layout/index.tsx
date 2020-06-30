import * as React from 'react'
import Head from 'next/head'
import { Stack, useColorMode } from '@chakra-ui/core'
import { ToggleTheme } from '@components'

interface LayoutProps {
  title: string
  children: React.ReactNode
  [key: string]: any
}

export function Layout({ title, children, ...rest }: LayoutProps) {
  const { colorMode } = useColorMode()
  const bg = {
    light: 'white',
    dark: 'gray.800',
  }
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <ToggleTheme />
      <Stack bg={bg[colorMode]} as="main" minH="100vh" width="full" {...rest}>
        {children}
      </Stack>
    </>
  )
}
