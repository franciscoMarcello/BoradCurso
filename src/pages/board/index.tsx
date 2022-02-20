
import styles from './styles.module.scss'
import {useState, FormEvent} from 'react'
import Head from 'next/head'
import {FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock,FiX, FiRadio} from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import firebase from '../../services/firebaseConnection'
import {format, formatDistance} from 'date-fns'
import Link from 'next/link'
import ptBR from 'date-fns/locale/pt-BR'


type TaskList={
    id:string;
    created:string | Date;
    createdFormated?:string;
    tarefa:string;
    userId:string;
    nome:string;

}
interface BoardProps{
    user:{
        id:string;
        nome:string;
        donate:boolean;
        lastDonate:string | Date;
    }
    data:string;
}
export default function Board({user, data}: BoardProps){
    const [input, setInput] = useState('');
    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
    const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)
    async function handleAddTask(e:FormEvent){
        e.preventDefault()
        if(input === ""){
            alert('Preencha com alguma tarefa!')
            return;
        }
        if(taskEdit){
            await firebase.firestore().collection('tarefas').doc(taskEdit.id).update({tarefa:input}).then(()=>{
                let data = taskList
                let taskindex = taskList.findIndex(item => item.id === taskEdit.id);
                data[taskindex].tarefa = input
                setTaskList(data)
                setTaskEdit(null)
                setInput("")
            })
            return;
        }
        await firebase.firestore().collection('tarefas').add({
            created: new Date(),
            tarefa:input,
            userId:user.id,
            nome:user.nome
        }).then((doc)=>{
            console.log('Sucesso')
            let data={
                id:doc.id,
                created:new Date(),
                createdFormated:format(new Date(), 'dd MMMM yyyy',{locale:ptBR}),
                tarefa:input,
                userId:user.id,
                nome:user.nome
            };
            setTaskList([...taskList, data]);
            setInput('')
        }).catch((err)=>{
            console.log('ERRO',err)
        })
    }


    async function handleDelete(id:string){
        await firebase.firestore().collection('tarefas').doc(id).delete().then(()=>{
            let taskDeleted = taskList.filter( item => {
                return (item.id !== id)
            })
            setTaskList(taskDeleted)
        }).catch((err)=>{
            console.log(err)
        })
    }

    function handleEdit(task:TaskList){
       setInput(task.tarefa)
       setTaskEdit(task)
    }
    function handleCancelEdit(){
        
        setInput('')
        setTaskEdit(null)
    }
    return(
        <>
       <Head>
           <title>Minhas Tarefas</title>
       </Head>
        <main className={styles.container} > 
        {taskEdit  && (
            <span className={styles.warnText}>
               <button onClick={handleCancelEdit}>
                    <FiX size={30} color="#ff3636"/>
                </button>
                Voce esta editando uma tarefa!
            </span>
        )}
            <form onSubmit={handleAddTask}>
                <input
                type='text'
                placeholder="Digite sua tarefa ..."
                value={input}
                onChange={(e)=> setInput(e.target.value)}
                />
                <button type='submit'>
                    <FiPlus size={25} color="#1E1E24"/>
                </button>
            </form>
            <h1>Você tem {taskList.length} {taskList.length== 1 ? 'Tarefa' : 'Tarefas'}!</h1>
            <section>
            {taskList.map(task => {
                return (
                    <article key={task.id} className={styles.taskList}>
                        <Link href={`/board/${task.id}`}>
                            <p>{task.tarefa}</p>
                        </Link>
                        <div className={styles.actions}>
                            <div>
                                <div>
                                    <FiCalendar size={20} color="#7D5BA6" />
                                    <time>{task.createdFormated}</time>
                                </div>
                               {user.donate && (
                                    <button onClick={() => handleEdit(task)}>
                                    <FiEdit2 size={20} color="#fff" />
                                    <span>Editar</span>
                                </button>
                               )}
                            </div>
                            <button onClick={() => handleDelete(task.id)}>
                                <FiTrash size={20} color="#ff3636" />
                                <span>Excluir</span>
                            </button>
                        </div>
                    </article>
                )
            })} 
                
            </section>
        </main>
        {user.donate && (
            <div className={styles.vipContainer}>
            <h3>Obrigado por apoiar esse projeto.</h3>
            <div>
                <FiClock size={28} color="#fff"/>
                <time>
                    Última doação foi a {formatDistance(new Date(user.lastDonate), new Date(),{locale:ptBR})}.
                </time>
            </div>
        </div>
        )}

        <SupportButton/>
        </>
    )
}


export const getServerSideProps : GetServerSideProps = async ({req})=> {
    const session = await getSession({req});
    if(!session?.id){
        return{
            redirect:{
                destination:'/',
                permanent:false
            }
        }
    }
  
   const tasks =  await firebase.firestore().collection('tarefas')
   .where('userId', '==',session?.id)
   .orderBy('created','asc').get();

   const data = JSON.stringify(tasks.docs.map(u =>{
       return{
           id:u.id,
           createdFormated:format(u.data().created.toDate(), 'dd MMMM yyyy',{locale:ptBR}),
           ...u.data(),
       }
   }))


    const user = {
        nome: session?.user.name,
        id: session?.id,
        donate:session?.donate,
        lastDonate:session?.lastDonate
    }

    return{
        props:{
            user,
            data
        }
    }
} 