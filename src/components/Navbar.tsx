import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from './ui/button'
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight, Menu} from "lucide-react";

const Navbar = ()=>{
    
    return (
        <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>

                {/* Large screen Navbar */}
                <div className="hidden sm:flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link
                        href='/'
                        className='flex z-40 font-semibold text-lg sm:text-2xl'>
                        <span>Converse.</span>
                    </Link>

                    <div className='hidden items-center space-x-4 sm:flex'>
                        <>
                            <Link
                                href='/pricing'
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                })}>
                                Pricing
                            </Link>
                            <LoginLink className={buttonVariants({variant: 'ghost',size: 'sm'})}>
                                Sign In
                            </LoginLink>
                            <RegisterLink className={buttonVariants({size: 'sm'})}>
                                Get started <ArrowRight className="h-5 w-5 ml-1.5"/>
                            </RegisterLink>
                        </>
                    </div>
                </div>
                
                {/* Small screen Navbar */}
                <div className="sm:hidden mx-2 h-14 flex items-center justify-between">
                    <Link
                        href='/'
                        className='flex z-40 font-bold text-xl'>
                        <span>Converse.</span>
                    </Link>
                    <div className="dropdown dropdown-end">
                        {/* <label tabIndex={0} className="btn m-1">Click</label> */}
                        <Menu tabIndex={0} className="h-6 w-6"/>
                        <ul tabIndex={0} className="dropdown-content z-[10] space-y-2 menu mt-4 p-2 shadow bg-white border border-gray-300 rounded-md w-48">
                            <>
                                <Link
                                    href='/pricing'
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        size: 'sm',
                                    })}>
                                    Pricing
                                </Link>
                                <LoginLink className={buttonVariants({variant: 'ghost',size: 'sm'})}>
                                    Sign In
                                </LoginLink>
                                <RegisterLink className={buttonVariants({size: 'sm'})}>
                                    Get started <ArrowRight className="h-5 w-5 ml-1.5"/>
                                </RegisterLink>
                            </>
                        </ul>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar;