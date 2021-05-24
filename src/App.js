import {useEffect, useState} from 'react'
import shortid from 'shortid'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const [nothing, setNothing] = useState(null)
  const [buttonCng, setButtonCng] = useState(false)
  const [datas, setDatas] = useState([])
  const [user, setUser] = useState({
    name : '',
    email : '',
    id : shortid.generate()
  })


  const handleChange = (e) => {
    setUser({
      ...user,
    [e.target.name] : e.target.value
    })
  }

  const addData = (e) => {
    e.preventDefault()
    if( user.name && user.email ) {
      fetch("http://localhost:8000/user", {
        method : "POST", 
        body: JSON.stringify(user),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      })
        .then(() => {
          fetch("http://localhost:8000/user")
            .then((res) => {
              return res.json()
            })
            .then(data => {
              setDatas(data)
            })
        })
    //  setDatas([...datas,user])
     setUser({
      name : '',
      email : '',
      id : shortid.generate()
    })
    } else {
      alert("Enter Valid Data")
    }

  }

  const deletHand = (value) => {
    fetch(`http://localhost:8000/user/${value.id}`, {
      method : "DELETE",
    })
    .then(() => {
      fetch("http://localhost:8000/user")
        .then((res) => {
          return res.json()
        })
        .then(data => setDatas(data))
    })
    .catch((err) => console.log(err.message))

      
    // setDatas(newDatas)
  }

  const editHand = (value) => {
    setUser({
      name : value.name,
      email : value.email,
      id : value.id
    })
    setNothing(value)
    setButtonCng(true)
  }

  const updateHand = (e) => {
    e.preventDefault()
    if ( user.name && user.email ) {
      
     

      if(!nothing ) return
      const updatedData = datas.find( (item) => {
        return item.id === nothing.id
      })
      fetch(`http://localhost:8000/user/${updatedData.id}`, {
        method : "PATCH",
        body: JSON.stringify({
          name: user.name || updatedData.name,
          email: user.email || updatedData.email,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      })
        .then(res => console.log(res))
      updatedData.name = user.name
      updatedData.email = user.email
      setUser({
        name : '',
        email : '',
        id : shortid.generate()
      })
      setNothing(null)
      setButtonCng(false)
    } else {
      alert("Please enter valid data")
    }
  }

  useEffect( () => {
    fetch("http://localhost:8000/user") 
      .then( (res) => {
        return res.json()
      })
      .then ( (data) => {
        setDatas(data)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [])
  return (
    <div>
      <form onSubmit = { buttonCng ? updateHand : addData  }>
        <input type="text" name = "name" value = {user.name} onChange = { (e) => handleChange(e) } />
        <br />
        <input type="text" name = "email" value = {user.email} onChange = { (e) => handleChange(e) } />
        <br />
        <button type="submit" className="btn btn-info">{ buttonCng ? 'Update' : 'Add'}</button>
      </form>
      <div>
        {datas.map( (value) => {
          return (
            <div key = {value.id}>
              <h2>{value.name}</h2>
              <h4>{value.email}</h4>
              <button className="btn btn-info" onClick = { () => deletHand(value) } >Delete</button>
              <button className="btn btn-info" onClick = { () => editHand(value) }>Edit</button>
              
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
