import './App.css';
import {useState} from 'react';

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={(e) => {
      e.preventDefault();
      const title = e.target.title.value
      const body = e.target.body.value
      props.onCreate(title, body)
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea  name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="Create"/></p>
    </form>
  </article>
}

function Update(props) {
  const [title, setTitle] = useState(props.title)
  const [body, setBody] = useState(props.body)
  return (
  <article>
    <h2>Update</h2>
    <form onSubmit={(e) => {
      e.preventDefault();
      const title = e.target.title.value
      const body = e.target.body.value
      props.onUpdate(title, body)
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={(e) => {
        setTitle(e.target.value);
      }}/></p>
      <p><textarea  name="body" placeholder="body" value={body} onChange={(e) => {
        setBody(e.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"/></p>
    </form>
  </article>)
}

function Header(props) {
  return (
    <header>   
        <h1>
          <a href="/" onClick={(e) => {
          e.preventDefault();
          props.onChangeMode();
          }}>{props.title}</a>
        </h1>
    </header>
  )
}

function Nav(props) {
  const lis = []
  for (let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(
    <li key={t.id}>
      <a id={t.id} href={`/read/${t.id}`} onClick={(e) => {
        e.preventDefault();
        props.onChangeMode(Number(e.target.id));
      }}>{t.title}</a>
    </li>)
  }
  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  )
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  )
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'javascript is ...'},
  ])
  const [nextId, setNextId] = useState(4);

  let content = null;
  let contextControl = null;

  if (mode === 'WELCOME'){
    content = <Article title='Welcome' body="Hello, WEB"></Article>;
  }
  else if (mode === 'READ') {
    let title, body = null;
    for (const topic of topics){
      if (topic.id === id) {
        title = topic.title;
        body = topic.body;
        break;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl =
    <>
      <li>
        <a href={`/update/{id}`} onClick={(e) => {
          e.preventDefault();
          setMode('UPDATE');
        }}>Update</a>
      </li>
      <li>
        <input type="button" value="Delete" onClick={()=>{
          const newTopics = [...topics]
          for (const key in newTopics){
            if (newTopics[key].id === id){
              newTopics.splice(key);
              break;
            }
          }
          setTopics(newTopics)
          setMode("WELCOME")
        }}/>
      </li>
    </>
  }
  else if (mode === 'CREATE') {
    content = <Create onCreate={(title, body) => {
      const newTopic = {id:nextId, title:title, body:body};
      setTopics([...topics, newTopic]);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }
  else if (mode === 'UPDATE') {
    let title, body = null;
    for (const topic of topics){
      if (topic.id === id){
        title = topic.title;
        body = topic.body;
        break;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      const updatedTopic = {id: id, title: title, body: body}
      const newTopics = [...topics]
      for (const key in newTopics){
        if (newTopics[key].id === id){
          newTopics[key] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  return (
    <div>
      <Header title='WEB' onChangeMode={() => {
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(id) => {
        setMode('READ');
        setId(id);
      }}></Nav>
      {content}
      <ul>
        <li>
          <a href="/create" onClick={(e) => {
            e.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
