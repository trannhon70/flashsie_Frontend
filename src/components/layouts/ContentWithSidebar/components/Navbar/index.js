'use client'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from '@nextui-org/react'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Logo } from '~/assets/icon'

import { SessionStore } from '@/config/sesstionStore'
import { signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export default function NavbarComponent({ menu }) {
  const pathname = usePathname()

  const user = SessionStore.getUserSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const onDropdown = (key) => {
    if (key === 'logout') signOut()
    else {
      router.push(key)
    }
  }
  return (
    <Navbar isBordered maxWidth='2xl' className='bg-primary'>
      <NavbarContent justify='start' className='max-w-[120px] sm:max-w-[16rem]'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className='text-white lg:hidden'
        />
        <Link href='/'>
          <NavbarBrand className='mr-4'>
            <Logo size={120} />
            {/* <p className='font-bold text-inherit text-white'>Flashie</p> */}
          </NavbarBrand>
        </Link>
      </NavbarContent>
      <NavbarContent className='hidden md:flex'>
        <Input
          classNames={{
            base: 'w-full h-10',
            mainWrapper: 'h-full',
            input: [
              'bg-transparent',
              'text-black/90',
              'placeholder:text-default-700/50',
            ],
            inputWrapper: 'h-full font-normal text-white ',
          }}
          placeholder='Type to search...'
          size='sm'
          startContent={
            <FaSearch
              size={18}
              className='text-white-400 pointer-events-none flex-shrink-0 text-black/50 dark:text-white/90'
            />
          }
          type='search'
        />
      </NavbarContent>

      <NavbarContent justify='end' className='max-w-[80px] sm:max-w-none'>
        <Dropdown placement='bottom-end'>
          <DropdownTrigger>
            <Avatar
              isBordered
              as='button'
              className='transition-transform'
              color='secondary'
              name='Jason Hughes'
              size='sm'
              src={user?.avatar}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label='Profile Actions'
            variant='flat'
            onAction={onDropdown}
          >
            <DropdownItem
              key='/profile'
              className='h-14 gap-2 rounded-none border-b-1'
            >
              <p className='font-semibold'>Signed in as</p>
              <p className='font-semibold'>{user?.email}</p>
            </DropdownItem>
            <DropdownItem key='/profile'>Profile</DropdownItem>
            <DropdownItem key='/teacher'>Teacher</DropdownItem>
            {/* <DropdownItem key='/flashset-management'>
              Flashset management
            </DropdownItem> */}
            {/* 
            <DropdownItem key='configurations'>Configurations</DropdownItem>
            <DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem> */}
            <DropdownItem
              key='logout'
              color='danger'
              className='rounded-none border-t-1'
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {Array.isArray(menu) && (
        <NavbarMenu>
          {menu.map((item, index) => {
            let active =
              pathname !== '/'
                ? pathname == item.pathname
                : pathname.startsWith(item.pathname)

            return (
              <NavbarMenuItem key={`${item.name}-${index}`}>
                <Link
                  color={active ? 'primary' : 'foreground'}
                  className='mt-4 w-full gap-4'
                  href={item.pathname}
                  size='lg'
                >
                  <item.icon size={28} />
                  {item.text}
                </Link>
              </NavbarMenuItem>
            )
          })}
        </NavbarMenu>
      )}
    </Navbar>
  )
}
