import './App.css'
import TodoListTemplate from './components/TodoListTemplate';
import Form from './components/Form';

function App() {

  return (
    <>
      <TodoListTemplate form={<Form />}>
        템플릿 완성
      </TodoListTemplate>
    </>
  )
}

export default App