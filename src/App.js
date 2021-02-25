import React,{ useState, useRef, useEffect } from 'react';
import TodoList from './TodoList';
import {v4 as uuidv4} from 'uuid';

const LOCAL_STORAGE_KEY = 'utterapp.todos'
 
function App() {
  
  const [todos, setTodos] = useState([]);
  const [utter, setUtter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setuser] = useState(null)
  const todoNameRef = useRef();
  const utterContentRef = useRef(null);
  
 
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if(storedTodos) setTodos(storedTodos)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(todos))
  }, [todos])


   

  function toggleTodo(id){
    const newTodos = [...todos]
    const todo = newTodos.find(todo => todo.id === id)
    todo.complete = !todo.complete
    setTodos(newTodos)
  }

  function addTodo(e){
    const name = todoNameRef.current.value
    if(name == '') return
    setTodos(prevTodos => {
      return [...prevTodos,{id:uuidv4(),name:name,complete:false}]
    })
    todoNameRef.current.value = null
  }

  function handleClearCompleted(e) {
    const newTodos = todos.filter(todo => !todo.complete)
    setTodos(newTodos)
  }

  function addUtterEvent(e) {
    const utterTxt = utterContentRef.current.value;
    const request =  {"utterref": utterTxt,
    "authorname": user
    };

    const url = "http://localhost:8080/addUtter"
    const response = fetch(url,{method:"post",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify(request)
    })

    response
    .then(res => {
      console.log(res)
    })
    .then(result => {
      console.log(result)
    })

  }

    function handleApiCall(){
    setLoading(true);
    const url = "http://localhost:8080/findAllUtters";
      const response =  fetch(url);
      response
      .then(res => res.json())
      .then(result => {
        setUtter(result[0]);
        setuser(result[0]['authorname']);
      })
      .catch(err => console.log(err));
      
       
      setLoading(false);
  }

  return (
    <>
   <TodoList todoList={todos} toggleTodo={toggleTodo}/>
   <input ref={todoNameRef} type="text"/>
   <button onClick={addTodo}>Add Todo </button>
   <button onClick={handleClearCompleted}>Clear Completed</button>
   <button onClick={handleApiCall}>pullFromAPI</button>
   <div> {todos.filter(todo => !todo.complete).length} left to do</div>

   <div>
     { loading || !utter  ?(
       <div>Loading...</div>
     ) : (
       <div>
         <div>{user}</div>
         <div className="utterRef">{utter.utterref}</div>
       </div>
     )}
   </div>
   <hr/>
  <div>
    <input ref={utterContentRef} type="text"/>
    <button onClick={addUtterEvent}>Add Utter</button>
  </div>

   </>
  )
}

export default App;
