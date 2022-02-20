import styles from './styles.module.scss'
import Link from 'next/link'
import { SigninButton } from '../SigninButton'
import Image from 'next/image'
import logo from '../../../public/images/logo.svg'
export function Header(){
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <a className={styles.logo}>
                    <Image src={logo} alt="Logo" />
                    </a>
               
                </Link>
                
                <nav>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    <Link href="/board"> 
                        <a>Meu Board</a>
                    </Link>
                   
                </nav>
                <SigninButton/>
            </div>
        </header>
    )
}