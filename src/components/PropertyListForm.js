import React, { useState } from "react";

const PropertyListForm = ({propertyContract, provider}) => {
  const [houseName, setHouseName] = useState();
  const [address, setAddress] = useState();
  const [area, setArea] = useState();
  const [year, setYear] = useState();
  const [rooms, setRooms] = useState();
  const [baths, setBaths] = useState();
  const [price, setPrice] = useState();

  const formSubmit =  async () => {
    const signer = await provider.getSigner()
    const newItemId = await propertyContract.connect(signer).mint(houseName, address, area, rooms, baths, price);
    console.log(newItemId);
  }

  return (
    <div>
      PropertyListForm
      <form className="form_section" onSubmit={e => {
        e.preventDefault()
        formSubmit()
      }}>
        <label className="form_label">
          House Name: <input className="form_input" name="houseName" onChange={e => setHouseName(e.target.value)} />
        </label>
        <label className="form_label">
          Address: <input className="form_input" name="address" onChange={e => setAddress(e.target.value)} />
        </label>
        <label className="form_label">
          Square Feet: <input className="form_input" name="area" type="number" onChange={e => setArea(e.target.value)} />
        </label>
        <label className="form_label">
          Year Built: <input className="form_input" name="year" type="number" onChange={e => setYear(e.target.value)} />
        </label>
        <label className="form_label">
          No. of Rooms: <input className="form_input" name="rooms" type="number"  onChange={e => setRooms(e.target.value)}/>
        </label>
        <label className="form_label">
          No. of Bathrooms: <input className="form_input" name="bathrooms" type="number" onChange={e => setBaths(e.target.value)} />
        </label>
        <label className="form_label">
          Property Value: <input className="form_input" name="price" type="number" onChange={e => setPrice(e.target.value)} />
        </label>
        <label className="submit">
          <button type="submit">Submit</button>
        </label>
      </form>
    </div>
  );
}

export default PropertyListForm;
