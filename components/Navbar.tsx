"use client"

import Link from 'next/link'
import Image from 'next/image'
import posthog from 'posthog-js'

const Navbar = () => {
   const handleLogoClick = () => {
      posthog.capture('logo_clicked', {
         location: 'navbar'
      });
   };

   const handleNavClick = (navItem: string) => {
      posthog.capture(`nav_${navItem}_clicked`, {
         location: 'navbar',
         nav_item: navItem
      });
   };

   return (
      <header>
         <nav>
            <Link href="/" className='logo' onClick={handleLogoClick}>
               <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

               <p>DevEvent</p>
            </Link>

            <ul>
               <Link href="/" onClick={() => handleNavClick('home')}>Home</Link>
               <Link href="/" onClick={() => handleNavClick('events')}>Events</Link>
               <Link href="/" onClick={() => handleNavClick('create_event')}>Create Event</Link>
            </ul>
         </nav>
      </header>
   )
}

export default Navbar