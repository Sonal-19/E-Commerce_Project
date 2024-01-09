import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

function TodoList() {
  const [data, setData] = useState([]);
  const [editedTask, setEditedTask] = useState({ index: null, text: "" });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('todos')) || [];
    setData(storedData);
  }, []);

  const saveDataToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const removeAll = () => {
    setData([]);
    saveDataToLocalStorage([]);
  };

  const singleRemove = (index) => {
    const newTodos = [...data];
    newTodos.splice(index, 1);
    setData(newTodos);
    saveDataToLocalStorage(newTodos);
  };

  const addTodo = () => {
    if (editedTask.index !== null) {
      const updatedTodos = [...data];
      if (editedTask.text.trim() === "") {
        return;
      } else {
        updatedTodos[editedTask.index] = editedTask.text;
        setData(updatedTodos);
        saveDataToLocalStorage(updatedTodos);
      }
    } else {
      if (editedTask.text.trim() === "") {
        return;
      }
      setData([...data, editedTask.text]);
      saveDataToLocalStorage([...data, editedTask.text]);
    }

    setEditedTask({ index: null, text: "" });
  };

  const handleInputChange = (e) => {
    setEditedTask({ ...editedTask, text: e.target.value });
  };

  const handleEditClick = (index) => {
    setEditedTask({ index, text: data[index] });
  };

  const handleCancelClick = () => {
    setEditedTask({ index: null, text: "" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="container-lg d-flex flex-column justify-content-center align-items-center">
      <div
        className="cardA rounded bg-white border shadow p-4 mb-3 pb-4"
        style={{
          height: '390px',
          backgroundImage: `url(https://img.freepik.com/free-vector/nature-leaf-frame_1308-26493.jpg?size=626&ext=jpg)`, 
          //backgroundImage: `url(https://img.freepik.com/free-photo/fresh-green-plant-leaves_23-2148122190.jpg?size=626&ext=jpg)`, 
          backgroundPosition: 'center',
        }}
      >
        <h4 className="text-bold font-monospace text-center">To-do list</h4>
        <div>
          <div className="input-group m-3">
            <input
              className="form-control"
              type="text"
              placeholder="What is the task today?"
              value={editedTask.text}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            {editedTask.index !== null && (
              <>
                <button className="btn btnA me-2" onClick={addTodo}>
                  Save
                </button>
                <button className="btn btnA" onClick={handleCancelClick}>
                  Cancel
                </button>
              </>
            )}
            {editedTask.index === null && (
              <button className="btn btnA me-4" onClick={addTodo}>
                +
              </button>
            )}
          </div>
          <div>
            {data.map((item, index) => (
              <div key={index} className="d-flex align-items-center ms-4">
                {editedTask.index === index ? (
                  <input
                    type="text"
                    value={editedTask.text}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex-grow-1">{item}</div>
                )}
                <div className="ms-2">
                  {editedTask.index === index ? (
                    <>
                      <button className="btn btn-primary ms-5 me-2" onClick={addTodo}>
                        Save
                      </button>
                      <button className="btn btnA" onClick={handleCancelClick}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(index)}
                        className="btn m-2"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => singleRemove(index)}
                        className="btn m-2"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: 'rgb(226, 7, 7)' }}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {data.length > 0 && (
          <div className="d-flex justify-content-center">
            <button className="btn btnA mt-3 p-2 mb-0" onClick={removeAll}>
              Remove all ToDo's
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoList;
