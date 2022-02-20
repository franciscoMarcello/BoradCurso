import {signIn, signOut, useSession} from 'next-auth/client'
import styles from './styles.module.scss'
import {FaGithub} from 'react-icons/fa'
import {FiX} from 'react-icons/fi'
import Image from "next/image";
export function SigninButton(){

   const [session] = useSession();


    return session ? (
        <button
        type='button'
        className={styles.signInButton}
        onClick={()=> signOut()}
        >
            <div>
            <Image width={35} height={35} objectFit="fill" src={session.user.image} alt="Foto do usuário" />
            </div>
            Olá {session.user.name}
            <FiX
            className={styles.closeIcon}
            color="#7e8287"
            />
         
        </button>
       
    ):(
        <button
        type='button'
        className={styles.signInButton}
        onClick={()=>signIn('github')}
        >
            <FaGithub
            color="#fff"
            />
            Entrar com github
        </button>
    )
}