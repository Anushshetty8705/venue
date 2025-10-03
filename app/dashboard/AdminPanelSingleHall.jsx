"use client";
import React, { useState } from "react";
import { bookings, halls } from "./guestpanel/bookings";

export default function AdminPanel() {
  const [newHall, setNewHall] = useState({ name: "", location: "", capacity: 0, pricePerHour: 0, ac: true });

  const addHall = () => {
    if (!newHall.name || !newHall.location) return alert("Fill hall info");
    halls.push({ ...newHall, id: Date.now().toString() });
    setNewHall({ name: "", location: "", capacity: 0, pricePerHour: 0, ac: true });
  };

  const markOfflineBooking = (hall, type="slot") => {
    const date = prompt("Date (YYYY-MM-DD):");
    if(!date) return;
    let slot=null, from=null, to=null;
    if(type==="slot") slot = prompt("Slot (morning/afternoon/evening/full-day):");
    else {
      from = prompt("From date:");
      to = prompt("To date:");
    }

    bookings.push({
      hallId: hall.id,
      hallName: hall.name,
      type,
      date,
      slot,
      from,
      to,
      name: "Offline Booking",
      phone: "-",
      status: "offline",
      owner: "admin"
    });
    alert("Offline booking added!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <div className="border p-4 mb-4 rounded">
        <h3 className="font-semibold mb-2">Add Hall</h3>
        <input type="text" placeholder="Name" value={newHall.name} onChange={e=>setNewHall({...newHall,name:e.target.value})} className="p-2 border rounded mr-2"/>
        <input type="text" placeholder="Location" value={newHall.location} onChange={e=>setNewHall({...newHall,location:e.target.value})} className="p-2 border rounded mr-2"/>
        <input type="number" placeholder="Capacity" value={newHall.capacity} onChange={e=>setNewHall({...newHall,capacity:Number(e.target.value)})} className="p-2 border rounded mr-2"/>
        <input type="number" placeholder="Price/hr" value={newHall.pricePerHour} onChange={e=>setNewHall({...newHall,pricePerHour:Number(e.target.value)})} className="p-2 border rounded mr-2"/>
        <label>
          <input type="checkbox" checked={newHall.ac} onChange={e=>setNewHall({...newHall,ac:e.target.checked})}/> AC
        </label>
        <button onClick={addHall} className="ml-2 p-2 bg-blue-600 text-white rounded">Add Hall</button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Halls</h3>
      {halls.map(h => (
        <div key={h.id} className="border p-2 rounded mb-2">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>{h.name}</strong> ({h.location}) Capacity: {h.capacity} Price/hr: ₹{h.pricePerHour} {h.ac?"AC":"Non-AC"}</p>
            </div>
            <div>
              <button onClick={()=>markOfflineBooking(h,"slot")} className="p-1 bg-green-600 text-white rounded mr-1">Add Slot Booking</button>
              <button onClick={()=>markOfflineBooking(h,"multi")} className="p-1 bg-purple-600 text-white rounded">Add Multi-day Booking</button>
            </div>
          </div>
        </div>
      ))}

      <h3 className="text-xl font-semibold mt-4 mb-2">All Bookings</h3>
      {bookings.map((b,i)=>(
        <div key={i} className="border p-2 rounded mb-1">
          <p><strong>{b.hallName}</strong> {b.type==="slot"?b.date+" "+b.slot:`${b.from} to ${b.to}`} {b.status==="offline"?"(Offline)":"(Guest)"} Name: {b.name} Phone: {b.phone}</p>
        </div>
      ))}
    </div>
  );
}
