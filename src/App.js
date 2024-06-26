import React, { useEffect, useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const App = () => {
  const [freinds, setFreinds] = useState(initialFriends);
  const [showAddFreind, setShowAddFreind] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFreind() {
    setShowAddFreind((prev) => !prev);
  }
  function handleAddFreind(friend) {
    setFreinds((prev) => [...prev, friend]);
    setShowAddFreind(false);
  }
  function handleSelectFriend(friend) {
    setSelectedFriend((prev) => (prev?.id === friend.id ? null : friend));
  }
  function handleSplitBill(value) {
    setFreinds(
      (prev) => prev.map((friend)=> friend.id === selectedFriend.id ? {...friend,balance : friend.balance + value} : friend)
    )

    setSelectedFriend(null);
  }


  return (
    <div className="app">
      <div className="sidebar">
        <FreindList
          freinds={freinds}
          onSelect={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFreind && <AddMember onAddFriend={handleAddFreind} />}
        <Button onClick={handleShowAddFreind}>
          {showAddFreind ? "close" : "Add Member"}
        </Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplit={handleSplitBill} />}
    </div>
  );
};

function FreindList({ freinds, onSelect, selectedFriend }) {
  return (
    <ul>
      {freinds.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <div>
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owe you {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      </div>
      <Button onClick={() => onSelect(friend)}>
        {" "}
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function AddMember({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    console.log(name, image);

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    console.log(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplit }) {
  const [billValue, setBillValue] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [whoispaying, setWhoispaying] = useState("user");
  const friendExpense = billValue ? billValue - userExpense: '';

  function handleSubmit(e) {
    e.preventDefault();

    if (!billValue || !userExpense) return;
    onSplit(whoispaying === "user" ? friendExpense : -userExpense);

  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />
      <label>🧑‍🦲 Your Expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) => setUserExpense(Number(e.target.value) > billValue ? billValue : Number(e.target.value))}
      />
      <label>🧑‍🤝‍🧑 {selectedFriend.name} expense</label>
      <input type="text" disabled  value={friendExpense}/>
      <label>🤑 Who is paying the bill ?</label>
      <select value={whoispaying}
        onChange={(e) => setWhoispaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
