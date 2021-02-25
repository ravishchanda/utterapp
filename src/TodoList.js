import React from 'react'
import Todo from './Todo'

export default function TodoList({todoList,toggleTodo}) {
    return (
       todoList.map(todo =>{
           return <Todo key={todo.id} todo={todo} toggleTodo={toggleTodo}/>
       })
    )
}
